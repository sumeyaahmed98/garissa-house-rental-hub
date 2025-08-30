import os
import sqlite3
import json
from datetime import datetime, timedelta, timezone

from flask import Flask, jsonify, request, current_app
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
                "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
                (name, email, password_hash, "tenant"),
            )
            db.commit()
        except sqlite3.Error:
            return {"message": "Database error during signup."}, 500

        return {"message": "Signup successful."}, 201

    @app.post("/tenant-signup")
    def tenant_signup():
        body = request.get_json(silent=True) or {}
        name = (body.get("name") or "").strip()
        email = (body.get("email") or "").strip().lower()
        phone = (body.get("phone") or "").strip()
        location = (body.get("location") or "").strip()
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
                "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
                (name, email, password_hash, "tenant"),
            )
            db.commit()
        except sqlite3.Error:
            return {"message": "Database error during signup."}, 500

        return {"message": "Tenant signup successful."}, 201

    @app.post("/owner-signup")
    def owner_signup():
        body = request.get_json(silent=True) or {}
        name = (body.get("name") or "").strip()
        email = (body.get("email") or "").strip().lower()
        phone = (body.get("phone") or "").strip()
        location = (body.get("location") or "").strip()
        property_count = (body.get("propertyCount") or "").strip()
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
                "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
                (name, email, password_hash, "owner"),
            )
            db.commit()
        except sqlite3.Error:
            return {"message": "Database error during signup."}, 500

        return {"message": "Owner signup successful."}, 201

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
            cur.execute("SELECT id, name, email, password_hash, role, is_admin FROM users WHERE email = ?", (email,))
            row = cur.fetchone()
            if not row:
                return {"message": "Invalid credentials."}, 401

            user_id, name, email, password_hash, role, is_admin = row
            if not check_password_hash(password_hash, password):
                return {"message": "Invalid credentials."}, 401

            access_token = create_access_token(identity=str(user_id), additional_claims={"name": name, "email": email, "role": role, "is_admin": is_admin})
            return {
                "access_token": access_token,
                "user": {"id": user_id, "name": name, "email": email, "role": role, "is_admin": is_admin},
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
            cur.execute("SELECT id, name, email, role, is_admin FROM users WHERE id = ?", (user_id,))
            row = cur.fetchone()
            if not row:
                return {"message": "User not found."}, 404
            uid, name, email, role, is_admin = row
            return {"id": uid, "name": name, "email": email, "role": role, "is_admin": is_admin}, 200
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
            import random
            reset_code = str(random.randint(1000000, 9999999))
            expiry = int(datetime.now(timezone.utc).timestamp()) + 600  # 10 minutes

            # Delete any existing codes for this user
            cur.execute("DELETE FROM reset_codes WHERE user_id = ?", (user_id,))
            
            # Insert new code
            cur.execute(
                "INSERT INTO reset_codes (user_id, code, expiry) VALUES (?, ?, ?)",
                (user_id, reset_code, expiry),
            )
            db.commit()

            # Log the code for debugging (remove in production)
            print(f"Reset code for {email}: {reset_code}")

            # TODO: Send email with reset code
            # For now, just return success
            return {"message": "If the email exists, a reset code was sent."}, 200
        except sqlite3.Error:
            return {"message": "Database error during password reset."}, 500

    @app.post("/reset-password")
    def reset_password():
        body = request.get_json(silent=True) or {}
        email = (body.get("email") or "").strip().lower()
        code = (body.get("code") or "").strip()
        new_password = (body.get("newPassword") or body.get("new_password") or "")
        confirm_new = (body.get("confirmNewPassword") or body.get("confirm_new_password") or "")

        if not email or not code or not new_password:
            return {"message": "Email, code, and new password are required."}, 400
        if new_password != confirm_new:
            return {"message": "New passwords do not match."}, 400

        try:
            db = get_db()
            cur = db.cursor()
            
            # Find user and valid reset code
            cur.execute("""
                SELECT u.id, rc.id 
                FROM users u 
                JOIN reset_codes rc ON u.id = rc.user_id 
                WHERE u.email = ? AND rc.code = ? AND rc.expiry > ?
            """, (email, code, int(datetime.now(timezone.utc).timestamp())))
            
            row = cur.fetchone()
            if not row:
                return {"message": "Invalid or expired reset code."}, 400
            
            user_id, rc_id = row
            
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

    # Property Management Endpoints
    @app.post("/properties")
    @jwt_required()
    def create_property():
        """Create a new property (owner only)"""
        user_id = get_jwt_identity()
        
        try:
            db = get_db()
            cur = db.cursor()
            
            # Check if user is owner
            cur.execute("SELECT role FROM users WHERE id = ?", (user_id,))
            user_row = cur.fetchone()
            if not user_row or user_row[0] != "owner":
                return {"message": "Only property owners can create properties."}, 403
            
            body = request.get_json(silent=True) or {}
            
            # Validate required fields
            required_fields = ["title", "property_type", "rent_amount", "address", "city"]
            for field in required_fields:
                if not body.get(field):
                    return {"message": f"{field.replace('_', ' ').title()} is required."}, 400
            
            # Prepare data
            property_data = {
                "owner_id": user_id,
                "title": body["title"],
                "description": body.get("description", ""),
                "property_type": body["property_type"],
                "bedrooms": body.get("bedrooms"),
                "bathrooms": body.get("bathrooms"),
                "square_feet": body.get("square_feet"),
                "rent_amount": body["rent_amount"],
                "security_deposit": body.get("security_deposit"),
                "lease_duration": body.get("lease_duration"),
                "available_date": body.get("available_date"),
                "address": body["address"],
                "city": body["city"],
                "neighborhood": body.get("neighborhood"),
                "latitude": body.get("latitude"),
                "longitude": body.get("longitude"),
                "furnished": body.get("furnished", False),
                "parking_available": body.get("parking_available", False),
                "pet_policy": body.get("pet_policy"),
                "smoking_policy": body.get("smoking_policy"),
                "amenities": json.dumps(body.get("amenities", [])),
                "contact_info": json.dumps(body.get("contact_info", {})),
                "status": "available"
            }
            
            # Insert property
            cur.execute("""
                INSERT INTO properties (
                    owner_id, title, description, property_type, bedrooms, bathrooms,
                    square_feet, rent_amount, security_deposit, lease_duration,
                    available_date, address, city, neighborhood, latitude, longitude,
                    furnished, parking_available, pet_policy, smoking_policy,
                    amenities, contact_info, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                property_data["owner_id"], property_data["title"], property_data["description"],
                property_data["property_type"], property_data["bedrooms"], property_data["bathrooms"],
                property_data["square_feet"], property_data["rent_amount"], property_data["security_deposit"],
                property_data["lease_duration"], property_data["available_date"], property_data["address"],
                property_data["city"], property_data["neighborhood"], property_data["latitude"],
                property_data["longitude"], property_data["furnished"], property_data["parking_available"],
                property_data["pet_policy"], property_data["smoking_policy"], property_data["amenities"],
                property_data["contact_info"], property_data["status"]
            ))
            
            property_id = cur.lastrowid
            db.commit()
            
            return {"message": "Property created successfully.", "property_id": property_id}, 201
            
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500

    @app.get("/properties")
    def get_properties():
        """Get all available properties with optional filters"""
        try:
            db = get_db()
            cur = db.cursor()
            
            # Get query parameters
            city = request.args.get("city", "")
            min_price = request.args.get("min_price")
            max_price = request.args.get("max_price")
            property_type = request.args.get("property_type", "")
            bedrooms = request.args.get("bedrooms")
            bathrooms = request.args.get("bathrooms")
            
            # Build query
            query = """
                SELECT p.*, u.name as owner_name, u.email as owner_email,
                       (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                FROM properties p
                JOIN users u ON p.owner_id = u.id
                WHERE p.status = 'available'
            """
            params = []
            
            if city:
                query += " AND p.city LIKE ?"
                params.append(f"%{city}%")
            
            if min_price:
                query += " AND p.rent_amount >= ?"
                params.append(float(min_price))
            
            if max_price:
                query += " AND p.rent_amount <= ?"
                params.append(float(max_price))
            
            if property_type:
                query += " AND p.property_type = ?"
                params.append(property_type)
            
            if bedrooms:
                query += " AND p.bedrooms >= ?"
                params.append(int(bedrooms))
            
            if bathrooms:
                query += " AND p.bathrooms >= ?"
                params.append(int(bathrooms))
            
            query += " ORDER BY p.created_at DESC"
            
            cur.execute(query, params)
            properties = []
            
            for row in cur.fetchall():
                property_dict = dict(row)
                property_dict["amenities"] = json.loads(property_dict["amenities"] or "[]")
                property_dict["contact_info"] = json.loads(property_dict["contact_info"] or "{}")
                properties.append(property_dict)
            
            return {"properties": properties}, 200
            
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500

    @app.get("/properties/<int:property_id>")
    def get_property(property_id):
        """Get a specific property with all details and images"""
        try:
            db = get_db()
            cur = db.cursor()
            
            # Get property details
            cur.execute("""
                SELECT p.*, u.name as owner_name, u.email as owner_email
                FROM properties p
                JOIN users u ON p.owner_id = u.id
                WHERE p.id = ?
            """, (property_id,))
            
            property_row = cur.fetchone()
            if not property_row:
                return {"message": "Property not found."}, 404
            
            property_dict = dict(property_row)
            property_dict["amenities"] = json.loads(property_dict["amenities"] or "[]")
            property_dict["contact_info"] = json.loads(property_dict["contact_info"] or "{}")
            
            # Get property images
            cur.execute("""
                SELECT id, image_url, caption, is_primary, sort_order
                FROM property_images
                WHERE property_id = ?
                ORDER BY is_primary DESC, sort_order ASC
            """, (property_id,))
            
            images = [dict(row) for row in cur.fetchall()]
            property_dict["images"] = images
            
            return property_dict, 200
            
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500

    @app.get("/my-properties")
    @jwt_required()
    def get_my_properties():
        """Get properties owned by the current user"""
        user_id = get_jwt_identity()
        
        try:
            db = get_db()
            cur = db.cursor()
            
            # Check if user is owner
            cur.execute("SELECT role FROM users WHERE id = ?", (user_id,))
            user_row = cur.fetchone()
            if not user_row or user_row[0] != "owner":
                return {"message": "Only property owners can view their properties."}, 403
            
            cur.execute("""
                SELECT p.*, 
                       (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                FROM properties p
                WHERE p.owner_id = ?
                ORDER BY p.created_at DESC
            """, (user_id,))
            
            properties = []
            for row in cur.fetchall():
                property_dict = dict(row)
                property_dict["amenities"] = json.loads(property_dict["amenities"] or "[]")
                property_dict["contact_info"] = json.loads(property_dict["contact_info"] or "{}")
                properties.append(property_dict)
            
            return {"properties": properties}, 200
            
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500

    @app.put("/properties/<int:property_id>")
    @jwt_required()
    def update_property(property_id):
        """Update a property (owner only)"""
        user_id = get_jwt_identity()
        
        try:
            db = get_db()
            cur = db.cursor()
            
            # Check if user owns this property
            cur.execute("SELECT owner_id FROM properties WHERE id = ?", (property_id,))
            property_row = cur.fetchone()
            if not property_row:
                return {"message": "Property not found."}, 404
            
            if property_row[0] != user_id:
                return {"message": "You can only update your own properties."}, 403
            
            body = request.get_json(silent=True) or {}
            
            # Update fields
            update_fields = []
            params = []
            
            for field in ["title", "description", "property_type", "bedrooms", "bathrooms", 
                         "square_feet", "rent_amount", "security_deposit", "lease_duration",
                         "available_date", "address", "city", "neighborhood", "latitude", 
                         "longitude", "furnished", "parking_available", "pet_policy", 
                         "smoking_policy", "status"]:
                if field in body:
                    if field in ["amenities", "contact_info"]:
                        update_fields.append(f"{field} = ?")
                        params.append(json.dumps(body[field]))
                    else:
                        update_fields.append(f"{field} = ?")
                        params.append(body[field])
            
            if not update_fields:
                return {"message": "No fields to update."}, 400
            
            update_fields.append("updated_at = CURRENT_TIMESTAMP")
            params.append(property_id)
            
            cur.execute(f"UPDATE properties SET {', '.join(update_fields)} WHERE id = ?", params)
            db.commit()
            
            return {"message": "Property updated successfully."}, 200
            
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500

    @app.delete("/properties/<int:property_id>")
    @jwt_required()
    def delete_property(property_id):
        """Delete a property (owner only)"""
        user_id = get_jwt_identity()
        
        try:
            db = get_db()
            cur = db.cursor()
            
            # Check if user owns this property
            cur.execute("SELECT owner_id FROM properties WHERE id = ?", (property_id,))
            property_row = cur.fetchone()
            if not property_row:
                return {"message": "Property not found."}, 404
            
            if property_row[0] != user_id:
                return {"message": "You can only delete your own properties."}, 403
            
            # Delete property (cascade will delete images and favorites)
            cur.execute("DELETE FROM properties WHERE id = ?", (property_id,))
            db.commit()
            
            return {"message": "Property deleted successfully."}, 200
            
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500



    # Favorites Endpoints
    @app.post("/properties/<int:property_id>/favorite")
    @jwt_required()
    def add_to_favorites(property_id):
        """Add a property to favorites (tenant only)"""
        user_id = get_jwt_identity()
        
        try:
            db = get_db()
            cur = db.cursor()
            
            # Check if user is tenant
            cur.execute("SELECT role FROM users WHERE id = ?", (user_id,))
            user_row = cur.fetchone()
            if not user_row or user_row[0] != "tenant":
                return {"message": "Only tenants can add favorites."}, 403
            
            # Check if property exists
            cur.execute("SELECT id FROM properties WHERE id = ?", (property_id,))
            if not cur.fetchone():
                return {"message": "Property not found."}, 404
            
            # Add to favorites
            cur.execute("""
                INSERT OR IGNORE INTO favorites (tenant_id, property_id)
                VALUES (?, ?)
            """, (user_id, property_id))
            
            db.commit()
            return {"message": "Added to favorites."}, 200
            
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500

    @app.delete("/properties/<int:property_id>/favorite")
    @jwt_required()
    def remove_from_favorites(property_id):
        """Remove a property from favorites (tenant only)"""
        user_id = get_jwt_identity()
        
        try:
            db = get_db()
            cur = db.cursor()
            
            # Check if user is tenant
            cur.execute("SELECT role FROM users WHERE id = ?", (user_id,))
            user_row = cur.fetchone()
            if not user_row or user_row[0] != "tenant":
                return {"message": "Only tenants can remove favorites."}, 403
            
            # Remove from favorites
            cur.execute("""
                DELETE FROM favorites 
                WHERE tenant_id = ? AND property_id = ?
            """, (user_id, property_id))
            
            db.commit()
            return {"message": "Removed from favorites."}, 200
            
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500

    @app.get("/favorites")
    @jwt_required()
    def get_favorites():
        """Get user's favorite properties (tenant only)"""
        user_id = get_jwt_identity()
        
        try:
            db = get_db()
            cur = db.cursor()
            
            # Check if user is tenant
            cur.execute("SELECT role FROM users WHERE id = ?", (user_id,))
            user_row = cur.fetchone()
            if not user_row or user_row[0] != "tenant":
                return {"message": "Only tenants can view favorites."}, 403
            
            cur.execute("""
                SELECT p.*, u.name as owner_name, u.email as owner_email,
                       (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                FROM properties p
                JOIN users u ON p.owner_id = u.id
                JOIN favorites f ON p.id = f.property_id
                WHERE f.tenant_id = ?
                ORDER BY f.created_at DESC
            """, (user_id,))
            
            properties = []
            for row in cur.fetchall():
                property_dict = dict(row)
                property_dict["amenities"] = json.loads(property_dict["amenities"] or "[]")
                property_dict["contact_info"] = json.loads(property_dict["contact_info"] or "{}")
                properties.append(property_dict)
            
            return {"properties": properties}, 200
            
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500

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
            cur.execute("SELECT id, name, email, role, is_admin FROM users ORDER BY id")
            users = []
            for row in cur.fetchall():
                users.append({
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "role": row[3],
                    "is_admin": bool(row[4])
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

    @app.patch("/admin/users/<int:user_id>/role")
    @jwt_required()
    def update_user_role(user_id):
        """Update user role (admin only)"""
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
            
            # Get request body
            body = request.get_json(silent=True) or {}
            new_role = body.get("role")
            
            if not new_role or new_role not in ["admin", "owner", "tenant"]:
                return {"message": "Valid role (admin, owner, tenant) is required."}, 400
            
            # Check if target user exists
            cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
            if not cur.fetchone():
                return {"message": "User not found."}, 404
            
            # Update the user role
            cur.execute("UPDATE users SET role = ? WHERE id = ?", (new_role, user_id))
            db.commit()
            
            return {"message": "User role updated successfully."}, 200
        except sqlite3.Error:
            return {"message": "Database error updating user role."}, 500

    # Rental Management Endpoints
    @app.get("/rentals")
    @jwt_required()
    def get_rentals():
        """Get rentals for the current user (owner or tenant)"""
        user_id = get_jwt_identity()
        
        try:
            db = get_db()
            cur = db.cursor()
            
            # Check user role
            cur.execute("SELECT role FROM users WHERE id = ?", (user_id,))
            user_row = cur.fetchone()
            if not user_row:
                return {"message": "User not found."}, 404
            
            role = user_row[0]
            
            if role == "owner":
                # Get rentals where user is the owner
                cur.execute("""
                    SELECT r.*, p.title as property_title, u.name as tenant_name, u.email as tenant_email
                    FROM rentals r
                    JOIN properties p ON r.property_id = p.id
                    JOIN users u ON r.tenant_id = u.id
                    WHERE r.owner_id = ?
                    ORDER BY r.created_at DESC
                """, (user_id,))
            elif role == "tenant":
                # Get rentals where user is the tenant
                cur.execute("""
                    SELECT r.*, p.title as property_title, u.name as owner_name, u.email as owner_email
                    FROM rentals r
                    JOIN properties p ON r.property_id = p.id
                    JOIN users u ON r.owner_id = u.id
                    WHERE r.tenant_id = ?
                    ORDER BY r.created_at DESC
                """, (user_id,))
            else:
                return {"message": "Access denied."}, 403
            
            rentals = []
            for row in cur.fetchall():
                rentals.append({
                    "id": row[0],
                    "property_id": row[1],
                    "tenant_id": row[2],
                    "owner_id": row[3],
                    "start_date": row[4],
                    "end_date": row[5],
                    "rent_amount": float(row[6]) if row[6] else None,
                    "security_deposit": float(row[7]) if row[7] else None,
                    "status": row[8],
                    "created_at": row[9],
                    "property_title": row[11],
                    "tenant_name": row[12] if role == "owner" else None,
                    "tenant_email": row[13] if role == "owner" else None,
                    "owner_name": row[12] if role == "tenant" else None,
                    "owner_email": row[13] if role == "tenant" else None
                })
            
            return {"rentals": rentals}, 200
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500

    @app.post("/rentals")
    @jwt_required()
    def create_rental():
        """Create a new rental (owner only)"""
        user_id = get_jwt_identity()
        
        try:
            db = get_db()
            cur = db.cursor()
            
            # Check if user is owner
            cur.execute("SELECT role FROM users WHERE id = ?", (user_id,))
            user_row = cur.fetchone()
            if not user_row or user_row[0] != "owner":
                return {"message": "Only property owners can create rentals."}, 403
            
            body = request.get_json(silent=True) or {}
            
            # Validate required fields
            required_fields = ["property_id", "tenant_id", "start_date", "end_date", "rent_amount"]
            for field in required_fields:
                if not body.get(field):
                    return {"message": f"{field.replace('_', ' ').title()} is required."}, 400
            
            # Check if property exists and belongs to owner
            cur.execute("SELECT id FROM properties WHERE id = ? AND owner_id = ?", (body["property_id"], user_id))
            if not cur.fetchone():
                return {"message": "Property not found or you don't own it."}, 404
            
            # Check if tenant exists
            cur.execute("SELECT id FROM users WHERE id = ? AND role = 'tenant'", (body["tenant_id"],))
            if not cur.fetchone():
                return {"message": "Tenant not found."}, 404
            
            # Create rental
            cur.execute("""
                INSERT INTO rentals (property_id, tenant_id, owner_id, start_date, end_date, rent_amount, security_deposit)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                body["property_id"], body["tenant_id"], user_id,
                body["start_date"], body["end_date"], body["rent_amount"],
                body.get("security_deposit")
            ))
            
            rental_id = cur.lastrowid
            
            # Update property status to rented
            cur.execute("UPDATE properties SET status = 'rented' WHERE id = ?", (body["property_id"],))
            
            db.commit()
            return {"message": "Rental created successfully.", "rental_id": rental_id}, 201
            
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500

    @app.put("/rentals/<int:rental_id>")
    @jwt_required()
    def update_rental(rental_id):
        """Update a rental (owner only)"""
        user_id = get_jwt_identity()
        
        try:
            db = get_db()
            cur = db.cursor()
            
            # Check if user is owner
            cur.execute("SELECT role FROM users WHERE id = ?", (user_id,))
            user_row = cur.fetchone()
            if not user_row or user_row[0] != "owner":
                return {"message": "Only property owners can update rentals."}, 403
            
            # Check if rental exists and belongs to owner
            cur.execute("SELECT id FROM rentals WHERE id = ? AND owner_id = ?", (rental_id, user_id))
            if not cur.fetchone():
                return {"message": "Rental not found or you don't own it."}, 404
            
            body = request.get_json(silent=True) or {}
            
            # Update fields
            update_fields = []
            update_values = []
            
            for field in ["start_date", "end_date", "rent_amount", "security_deposit", "status"]:
                if field in body:
                    update_fields.append(f"{field} = ?")
                    update_values.append(body[field])
            
            if update_fields:
                update_values.append(rental_id)
                cur.execute(f"UPDATE rentals SET {', '.join(update_fields)} WHERE id = ?", update_values)
                db.commit()
            
            return {"message": "Rental updated successfully."}, 200
            
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500

    @app.delete("/rentals/<int:rental_id>")
    @jwt_required()
    def delete_rental(rental_id):
        """Delete a rental (owner only)"""
        user_id = get_jwt_identity()
        
        try:
            db = get_db()
            cur = db.cursor()
            
            # Check if user is owner
            cur.execute("SELECT role FROM users WHERE id = ?", (user_id,))
            user_row = cur.fetchone()
            if not user_row or user_row[0] != "owner":
                return {"message": "Only property owners can delete rentals."}, 403
            
            # Get property_id before deleting
            cur.execute("SELECT property_id FROM rentals WHERE id = ? AND owner_id = ?", (rental_id, user_id))
            rental_row = cur.fetchone()
            if not rental_row:
                return {"message": "Rental not found or you don't own it."}, 404
            
            property_id = rental_row[0]
            
            # Delete rental
            cur.execute("DELETE FROM rentals WHERE id = ?", (rental_id,))
            
            # Update property status back to available
            cur.execute("UPDATE properties SET status = 'available' WHERE id = ?", (property_id,))
            
            db.commit()
            return {"message": "Rental deleted successfully."}, 200
            
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500

    # Admin Rental Management Endpoint
    @app.get("/admin/rentals")
    @jwt_required()
    def get_all_rentals():
        """Get all rentals in the system (admin only)"""
        user_id = get_jwt_identity()
        
        try:
            db = get_db()
            cur = db.cursor()
            
            # Check if user is admin
            cur.execute("SELECT role FROM users WHERE id = ?", (user_id,))
            user_row = cur.fetchone()
            if not user_row or user_row[0] != "admin":
                return {"message": "Only administrators can view all rentals."}, 403
            
            # Get all rentals with property and user details
            cur.execute("""
                SELECT r.*, p.title as property_title, 
                       tenant.name as tenant_name, tenant.email as tenant_email,
                       owner.name as owner_name, owner.email as owner_email
                FROM rentals r
                JOIN properties p ON r.property_id = p.id
                JOIN users tenant ON r.tenant_id = tenant.id
                JOIN users owner ON r.owner_id = owner.id
                ORDER BY r.created_at DESC
            """)
            
            rentals = []
            for row in cur.fetchall():
                rentals.append({
                    "id": row[0],
                    "property_id": row[1],
                    "tenant_id": row[2],
                    "owner_id": row[3],
                    "start_date": row[4],
                    "end_date": row[5],
                    "rent_amount": float(row[6]) if row[6] else None,
                    "security_deposit": float(row[7]) if row[7] else None,
                    "status": row[8],
                    "created_at": row[9],
                    "property_title": row[11],
                    "tenant_name": row[12],
                    "tenant_email": row[13],
                    "owner_name": row[14],
                    "owner_email": row[15]
                })
            
            return {"rentals": rentals}, 200
        except sqlite3.Error as e:
            return {"message": f"Database error: {str(e)}"}, 500

    @app.route('/messages', methods=['GET'])
    @jwt_required()
    def get_messages():
        current_user_id = get_jwt_identity()
        
        try:
            # Get messages sent by the current user
            cursor = get_db().cursor()
            cursor.execute('''
                SELECT m.*, 
                       u1.name as sender_name, u1.email as sender_email,
                       u2.name as recipient_name, u2.email as recipient_email,
                       p.title as property_title
                FROM messages m
                LEFT JOIN users u1 ON m.sender_id = u1.id
                LEFT JOIN users u2 ON m.recipient_id = u2.id
                LEFT JOIN properties p ON m.property_id = p.id
                WHERE m.sender_id = ? OR m.recipient_id = ?
                ORDER BY m.created_at DESC
            ''', (current_user_id, current_user_id))
            
            messages = []
            for row in cursor.fetchall():
                messages.append({
                    'id': row[0],
                    'sender_id': row[1],
                    'recipient_id': row[2],
                    'subject': row[3],
                    'message': row[4],
                    'property_id': row[5],
                    'inquiry_type': row[6],
                    'created_at': row[7],
                    'sender_name': row[8],
                    'sender_email': row[9],
                    'recipient_name': row[10],
                    'recipient_email': row[11],
                    'property_title': row[12]
                })
            
            return jsonify({'messages': messages})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/messages', methods=['POST'])
    @jwt_required()
    def create_message():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        try:
            cursor = get_db().cursor()
            cursor.execute('''
                INSERT INTO messages (sender_id, recipient_id, subject, message, property_id, inquiry_type, created_at)
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
            ''', (
                current_user_id,
                data.get('recipient_id'),
                data.get('subject'),
                data.get('message'),
                data.get('property_id'),
                data.get('inquiry_type', 'general')
            ))
            
            get_db().commit()
            
            # Get the created message with details
            cursor.execute('''
                SELECT m.*, 
                       u1.name as sender_name, u1.email as sender_email,
                       u2.name as recipient_name, u2.email as recipient_email,
                       p.title as property_title
                FROM messages m
                LEFT JOIN users u1 ON m.sender_id = u1.id
                LEFT JOIN users u2 ON m.recipient_id = u2.id
                LEFT JOIN properties p ON m.property_id = p.id
                WHERE m.id = ?
            ''', (cursor.lastrowid,))
            
            row = cursor.fetchone()
            message = {
                'id': row[0],
                'sender_id': row[1],
                'recipient_id': row[2],
                'subject': row[3],
                'message': row[4],
                'property_id': row[5],
                'inquiry_type': row[6],
                'created_at': row[7],
                'sender_name': row[8],
                'sender_email': row[9],
                'recipient_name': row[10],
                'recipient_email': row[11],
                'property_title': row[12]
            }
            
            return jsonify({'message': message}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.get('/users')
    @jwt_required()
    def get_users_for_communication():
        current_user_id = get_jwt_identity()
        
        try:
            cursor = get_db().cursor()
            
            # Get current user's role
            cursor.execute('SELECT role FROM users WHERE id = ?', (current_user_id,))
            current_user_role = cursor.fetchone()[0]
            
            # Fetch users based on role
            if current_user_role == 'admin':
                # Admin can see all users except themselves
                cursor.execute('''
                    SELECT id, name, email, role, phone
                    FROM users 
                    WHERE id != ?
                    ORDER BY name
                ''', (current_user_id,))
            elif current_user_role == 'owner':
                # Owners can see tenants
                cursor.execute('''
                    SELECT id, name, email, role, phone
                    FROM users 
                    WHERE role = 'tenant'
                    ORDER BY name
                ''')
            elif current_user_role == 'tenant':
                # Tenants can see owners
                cursor.execute('''
                    SELECT id, name, email, role, phone
                    FROM users 
                    WHERE role = 'owner'
                    ORDER BY name
                ''')
            else:
                return jsonify({'users': []})
            
            users = []
            for row in cursor.fetchall():
                users.append({
                    'id': row[0],
                    'name': row[1],
                    'email': row[2],
                    'role': row[3],
                    'phone': row[4]
                })
            
            return jsonify({'users': users})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.post('/contact-requests')
    @jwt_required()
    def create_contact_request():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        try:
            cursor = get_db().cursor()
            cursor.execute('''
                INSERT INTO contact_requests (
                    property_id, owner_id, tenant_id, tenant_name, tenant_email, 
                    tenant_phone, message, preferred_date, inquiry_type, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            ''', (
                data.get('property_id'),
                data.get('owner_id'),
                current_user_id,
                data.get('name'),
                data.get('email'),
                data.get('phone'),
                data.get('message'),
                data.get('preferred_date'),
                data.get('inquiry_type', 'general'),
                'pending'
            ))
            
            get_db().commit()
            
            # Get the created contact request with details
            cursor.execute('''
                SELECT cr.*, p.title as property_title, u.name as owner_name
                FROM contact_requests cr
                LEFT JOIN properties p ON cr.property_id = p.id
                LEFT JOIN users u ON cr.owner_id = u.id
                WHERE cr.id = ?
            ''', (cursor.lastrowid,))
            
            row = cursor.fetchone()
            contact_request = {
                'id': row[0],
                'property_id': row[1],
                'owner_id': row[2],
                'tenant_id': row[3],
                'tenant_name': row[4],
                'tenant_email': row[5],
                'tenant_phone': row[6],
                'message': row[7],
                'preferred_date': row[8],
                'inquiry_type': row[9],
                'status': row[10],
                'created_at': row[11],
                'property_title': row[12],
                'owner_name': row[13]
            }
            
            return jsonify({'contact_request': contact_request}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.get('/contact-requests')
    @jwt_required()
    def get_contact_requests():
        current_user_id = get_jwt_identity()
        
        try:
            cursor = get_db().cursor()
            
            # Get current user's role
            cursor.execute('SELECT role FROM users WHERE id = ?', (current_user_id,))
            current_user_role = cursor.fetchone()[0]
            
            if current_user_role == 'owner':
                # Owners see contact requests for their properties
                cursor.execute('''
                    SELECT cr.*, p.title as property_title, u.name as tenant_name
                    FROM contact_requests cr
                    LEFT JOIN properties p ON cr.property_id = p.id
                    LEFT JOIN users u ON cr.tenant_id = u.id
                    WHERE cr.owner_id = ?
                    ORDER BY cr.created_at DESC
                ''', (current_user_id,))
            else:
                # Tenants see their own contact requests
                cursor.execute('''
                    SELECT cr.*, p.title as property_title, u.name as owner_name
                    FROM contact_requests cr
                    LEFT JOIN properties p ON cr.property_id = p.id
                    LEFT JOIN users u ON cr.owner_id = u.id
                    WHERE cr.tenant_id = ?
                    ORDER BY cr.created_at DESC
                ''', (current_user_id,))
            
            contact_requests = []
            for row in cursor.fetchall():
                contact_requests.append({
                    'id': row[0],
                    'property_id': row[1],
                    'owner_id': row[2],
                    'tenant_id': row[3],
                    'tenant_name': row[4],
                    'tenant_email': row[5],
                    'tenant_phone': row[6],
                    'message': row[7],
                    'preferred_date': row[8],
                    'inquiry_type': row[9],
                    'status': row[10],
                    'created_at': row[11],
                    'property_title': row[12],
                    'tenant_name': row[13] if current_user_role == 'owner' else None,
                    'owner_name': row[13] if current_user_role != 'owner' else None
                })
            
            return jsonify({'contact_requests': contact_requests})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.put('/contact-requests/<int:request_id>/status')
    @jwt_required()
    def update_contact_request_status(request_id):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        try:
            cursor = get_db().cursor()
            
            # Convert current_user_id to int for comparison
            current_user_id = int(current_user_id)
            
            # Get current user's role
            cursor.execute('SELECT role FROM users WHERE id = ?', (current_user_id,))
            user_result = cursor.fetchone()
            if not user_result:
                return jsonify({'error': 'User not found'}), 404
            current_user_role = user_result[0]
            
            # Verify the user owns the property for this contact request
            cursor.execute('''
                SELECT cr.owner_id, cr.status, cr.tenant_id
                FROM contact_requests cr
                WHERE cr.id = ?
            ''', (request_id,))
            
            result = cursor.fetchone()
            if not result:
                return jsonify({'error': 'Contact request not found'}), 404
            
            owner_id, current_status, tenant_id = result
            
            # Debug logging
            print(f"DEBUG: current_user_id={current_user_id} (type: {type(current_user_id)}), current_user_role={current_user_role}")
            print(f"DEBUG: owner_id={owner_id} (type: {type(owner_id)}), tenant_id={tenant_id} (type: {type(tenant_id)})")
            print(f"DEBUG: owner_id == current_user_id: {owner_id == current_user_id}")
            print(f"DEBUG: owner_id != current_user_id: {owner_id != current_user_id}")
            
            # Check access: owner can update any contact request for their properties
            # tenant can only update their own contact requests
            if current_user_role == 'owner':
                if owner_id != current_user_id:
                    return jsonify({'error': f'Access denied. You can only update contact requests for your properties. Current user: {current_user_id}, Owner: {owner_id}'}), 403
                # Owner has access, continue
            elif current_user_role == 'tenant':
                if tenant_id != current_user_id:
                    return jsonify({'error': f'Access denied. You can only update your own contact requests. Current user: {current_user_id}, Tenant: {tenant_id}'}), 403
                # Tenant has access, continue
            else:
                return jsonify({'error': 'Access denied'}), 403
            
            new_status = data.get('status')
            if new_status not in ['pending', 'responded', 'closed']:
                return jsonify({'error': 'Invalid status'}), 400
            
            cursor.execute('''
                UPDATE contact_requests 
                SET status = ? 
                WHERE id = ?
            ''', (new_status, request_id))
            
            get_db().commit()
            
            return jsonify({'message': 'Status updated successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

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


