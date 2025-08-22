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
            password_hash TEXT NOT NULL
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


