import os
import sqlite3
from datetime import datetime, timedelta, timezone

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from flask_mail import Mail, Message
from werkzeug.security import check_password_hash, generate_password_hash

try:  # Support running as module or script
    from .models import get_db, init_db, close_db, seed_admin_user
except Exception:  # pragma: no cover
    from models import get_db, init_db, close_db, seed_admin_user  # type: ignore


def create_app() -> Flask:
    app = Flask(__name__)

    # Core config
    app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY", "dev-secret-key-change-me")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-change-me")

    # Mail (Gmail SMTP)
    app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    app.config["MAIL_PORT"] = int(os.getenv("MAIL_PORT", "587"))
    app.config["MAIL_USE_TLS"] = os.getenv("MAIL_USE_TLS", "true").lower() == "true"
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME", "")
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD", "")
    app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_DEFAULT_SENDER", app.config["MAIL_USERNAME"]) 
    app.config["MAIL_SUPPRESS_SEND"] = os.getenv("MAIL_SUPPRESS_SEND", "false").lower() == "true" and True or False

    # Initialize extensions
    CORS(app, resources={r"/*": {"origins": os.getenv("CORS_ORIGINS", "*")}}, supports_credentials=True)
    JWTManager(app)
    mail = Mail(app)

    # Ensure DB exists and seed admin user
    with app.app_context():
        init_db()
        seed_admin_user()
    app.teardown_appcontext(close_db)

    @app.get("/health")
    def health() -> tuple[dict, int]:
        return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}, 200

    @app.post("/signup")
    def signup():
        body = request.get_json(silent=True) or {}
        name = (body.get("name") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = (body.get("password") or "")
        confirm_password = (body.get("confirmPassword") or body.get("confirm_password") or "")

        if not name or not email or not password:
            return {"message": "Name, email and password are required."}, 400
        if password != confirm_password:
            return {"message": "Passwords do not match."}, 400

        password_hash = generate_password_hash(password)

        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("SELECT id FROM users WHERE email = ?", (email,))
            if cur.fetchone():
                return {"message": "Email already registered."}, 409

            cur.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                (name, email, password_hash),
            )
            db.commit()
        except sqlite3.Error:
            return {"message": "Database error during signup."}, 500

        return {"message": "Signup successful."}, 201

    @app.post("/login")
    def login():
        body = request.get_json(silent=True) or {}
        email = (body.get("email") or "").strip().lower()
        password = (body.get("password") or "")
        if not email or not password:
            return {"message": "Email and password required."}, 400

        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("SELECT id, name, email, password_hash, is_admin FROM users WHERE email = ?", (email,))
            row = cur.fetchone()
            if not row:
                return {"message": "Invalid credentials."}, 401

            user_id, name, email, password_hash, is_admin = row
            if not check_password_hash(password_hash, password):
                return {"message": "Invalid credentials."}, 401

            access_token = create_access_token(identity=str(user_id), additional_claims={"name": name, "email": email, "is_admin": is_admin})
            return {
                "access_token": access_token,
                "user": {"id": user_id, "name": name, "email": email, "is_admin": is_admin},
            }, 200
        except sqlite3.Error:
            return {"message": "Database error during login."}, 500

    @app.get("/me")
    @jwt_required()
    def me():
        user_id = get_jwt_identity()
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("SELECT id, name, email, is_admin FROM users WHERE id = ?", (user_id,))
            row = cur.fetchone()
            if not row:
                return {"message": "User not found."}, 404
            uid, name, email, is_admin = row
            return {"id": uid, "name": name, "email": email, "is_admin": is_admin}, 200
        except sqlite3.Error:
            return {"message": "Database error."}, 500

    @app.post("/change-password")
    @jwt_required()
    def change_password():
        user_id = get_jwt_identity()
        body = request.get_json(silent=True) or {}
        current_password = body.get("currentPassword") or body.get("current_password")
        new_password = body.get("newPassword") or body.get("new_password")
        confirm_new = body.get("confirmNewPassword") or body.get("confirm_new_password")

        if not current_password or not new_password:
            return {"message": "Current and new password are required."}, 400
        if new_password != confirm_new:
            return {"message": "New passwords do not match."}, 400

        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("SELECT password_hash FROM users WHERE id = ?", (user_id,))
            row = cur.fetchone()
            if not row:
                return {"message": "User not found."}, 404
            if not check_password_hash(row[0], current_password):
                return {"message": "Current password is incorrect."}, 401

            cur.execute(
                "UPDATE users SET password_hash = ? WHERE id = ?",
                (generate_password_hash(new_password), user_id),
            )
            db.commit()
            return {"message": "Password updated successfully."}, 200
        except sqlite3.Error:
            return {"message": "Database error updating password."}, 500

    @app.post("/forgot-password")
    def forgot_password():
        body = request.get_json(silent=True) or {}
        email = (body.get("email") or "").strip().lower()
        if not email:
            return {"message": "Email is required."}, 400

        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("SELECT id, name FROM users WHERE email = ?", (email,))
            row = cur.fetchone()
            if not row:
                # Do not reveal user existence
                return {"message": "If the email exists, a reset code was sent."}, 200
            user_id, name = row

            # strictly 7-digit numeric code
            code_num = "".join(str(int.from_bytes(os.urandom(1), 'big') % 10) for _ in range(7))
            expiry = datetime.now(timezone.utc) + timedelta(minutes=10)

            # Save code
            cur.execute(
                "INSERT INTO reset_codes (user_id, code, expiry) VALUES (?, ?, ?)",
                (user_id, code_num, int(expiry.timestamp())),
            )
            db.commit()

            # Log code for debugging (remove in production)
            app.logger.info("Password reset code for %s is %s", email, code_num)

            # Send email
            msg = Message(
                subject="Your Password Reset Code",
                recipients=[email],
                body=(
                    f"Hello {name},\n\n"
                    f"Your password reset code is: {code_num}\n"
                    f"This code will expire in 10 minutes.\n\n"
                    f"If you did not request this, please ignore this email.\n"
                ),
            )
            try:
                mail.send(msg)
            except Exception:
                app.logger.exception("Failed to send reset email via SMTP")

            return {"message": "If the email exists, a reset code was sent."}, 200
        except sqlite3.Error:
            return {"message": "Database error generating reset code."}, 500

    @app.post("/reset-password")
    def reset_password():
        body = request.get_json(silent=True) or {}
        email = (body.get("email") or "").strip().lower()
        code = (body.get("code") or "").strip()
        new_password = body.get("newPassword") or body.get("new_password")
        confirm_new = body.get("confirmNewPassword") or body.get("confirm_new_password")

        if not email or not code or not new_password:
            return {"message": "Email, code, and new password are required."}, 400
        if new_password != confirm_new:
            return {"message": "Passwords do not match."}, 400

        try:
            now_ts = int(datetime.now(timezone.utc).timestamp())
            db = get_db()
            cur = db.cursor()
            cur.execute("SELECT id FROM users WHERE email = ?", (email,))
            user_row = cur.fetchone()
            if not user_row:
                # Do not reveal
                return {"message": "Invalid code or expired."}, 400
            user_id = user_row[0]

            cur.execute(
                "SELECT id, code, expiry FROM reset_codes WHERE user_id = ? ORDER BY id DESC LIMIT 1",
                (user_id,),
            )
            rc_row = cur.fetchone()
            if not rc_row:
                return {"message": "Invalid code or expired."}, 400

            rc_id, rc_code, rc_expiry = rc_row
            if rc_code != code or now_ts > rc_expiry:
                return {"message": "Invalid code or expired."}, 400

            # Update password
            cur.execute(
                "UPDATE users SET password_hash = ? WHERE id = ?",
                (generate_password_hash(new_password), user_id),
            )
            # Invalidate used code
            cur.execute("DELETE FROM reset_codes WHERE id = ?", (rc_id,))
            db.commit()
            return {"message": "Password reset successful."}, 200
        except sqlite3.Error:
            return {"message": "Database error resetting password."}, 500

    # Admin endpoints
    @app.get("/admin/users")
    @jwt_required()
    def get_all_users():
        """Get all users (admin only)"""
        try:
            # Get current user from JWT
            user_id = get_jwt_identity()
            db = get_db()
            cur = db.cursor()
            
            # Check if current user is admin
            cur.execute("SELECT is_admin FROM users WHERE id = ?", (user_id,))
            user_row = cur.fetchone()
            if not user_row or not user_row[0]:
                return {"message": "Admin access required."}, 403
            
            # Get all users
            cur.execute("SELECT id, name, email, is_admin FROM users ORDER BY id")
            users = []
            for row in cur.fetchall():
                users.append({
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "is_admin": bool(row[3])
                })
            
            return {"users": users}, 200
        except sqlite3.Error:
            return {"message": "Database error fetching users."}, 500

    @app.delete("/admin/users/<int:user_id>")
    @jwt_required()
    def delete_user(user_id):
        """Delete a user (admin only, cannot delete admin users)"""
        try:
            # Get current user from JWT
            current_user_id = get_jwt_identity()
            db = get_db()
            cur = db.cursor()
            
            # Check if current user is admin
            cur.execute("SELECT is_admin FROM users WHERE id = ?", (current_user_id,))
            current_user_row = cur.fetchone()
            if not current_user_row or not current_user_row[0]:
                return {"message": "Admin access required."}, 403
            
            # Check if target user exists and is not admin
            cur.execute("SELECT is_admin FROM users WHERE id = ?", (user_id,))
            target_user_row = cur.fetchone()
            if not target_user_row:
                return {"message": "User not found."}, 404
            
            if target_user_row[0]:  # is_admin
                return {"message": "Cannot delete admin users."}, 400
            
            # Delete the user
            cur.execute("DELETE FROM users WHERE id = ?", (user_id,))
            db.commit()
            
            return {"message": "User deleted successfully."}, 200
        except sqlite3.Error:
            return {"message": "Database error deleting user."}, 500

    return app


if __name__ == "__main__":
    # Load dotenv if present (prefer backend/.env)
    try:
        from dotenv import load_dotenv  # type: ignore
        import pathlib

        here = pathlib.Path(__file__).resolve().parent
        backend_env = here / ".env"
        # Load backend/.env first, then project root .env
        if backend_env.exists():
            load_dotenv(backend_env)
        load_dotenv()
    except Exception:
        pass

    application = create_app()
    application.logger.info("MAIL_USERNAME=%s", application.config.get("MAIL_USERNAME"))
    application.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")))


