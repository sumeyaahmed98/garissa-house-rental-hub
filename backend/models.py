import os
import sqlite3
from flask import current_app, g


def _ensure_db_path() -> str:
    db_path = current_app.config.get("DATABASE_PATH")
    if not db_path:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        db_path = os.path.join(base_dir, "database.db")
        current_app.config["DATABASE_PATH"] = db_path
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    return db_path


def get_db() -> sqlite3.Connection:
    if "db" not in g:
        db_path = _ensure_db_path()
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        g.db = conn
    return g.db


def close_db(e=None):  # noqa: ANN001
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db() -> None:
    db = get_db()
    cur = db.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            is_admin BOOLEAN DEFAULT FALSE
        );
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS reset_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            code TEXT NOT NULL,
            expiry INTEGER NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """
    )
    db.commit()

def seed_admin_user() -> None:
    """Create the default admin user if it doesn't exist"""
    from werkzeug.security import generate_password_hash
    
    db = get_db()
    cur = db.cursor()
    
    # Check if admin user already exists
    cur.execute("SELECT id FROM users WHERE email = ?", ("garissarealestate@gmail.com",))
    admin_exists = cur.fetchone()
    
    if not admin_exists:
        # Create admin user
        admin_password_hash = generate_password_hash("sumeyo2025")
        cur.execute(
            "INSERT INTO users (name, email, password_hash, is_admin) VALUES (?, ?, ?, ?)",
            ("Admin", "garissarealestate@gmail.com", admin_password_hash, True)
        )
        db.commit()
        print("✅ Admin user created: garissarealestate@gmail.com")
    else:
        print("ℹ️  Admin user already exists")


