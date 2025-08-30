#!/usr/bin/env python3
"""
Database Setup Script for Garissa House Rental Hub
Run this script to initialize the database on a new laptop after cloning the project.
"""

import os
import sqlite3
import sys
from werkzeug.security import generate_password_hash

def create_database():
    """Create and initialize the database with all tables and default data"""
    
    # Get the database path
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, "database.db")
    
    print(f"🗄️  Creating database at: {db_path}")
    
    # Remove existing database if it exists
    if os.path.exists(db_path):
        print("⚠️  Existing database found. Removing it to start fresh...")
        os.remove(db_path)
    
    # Create new database connection
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    print("📋 Creating database tables...")
    
    # Users table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'tenant' CHECK (role IN ('admin', 'owner', 'tenant')),
            is_admin BOOLEAN DEFAULT FALSE
        );
    """)
    print("✅ Users table created")
    
    # Reset codes table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS reset_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            code TEXT NOT NULL,
            expiry INTEGER NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    """)
    print("✅ Reset codes table created")
    
    # Properties table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS properties (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            owner_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            property_type TEXT NOT NULL,
            bedrooms INTEGER,
            bathrooms INTEGER,
            square_feet INTEGER,
            rent_amount DECIMAL(10,2) NOT NULL,
            security_deposit DECIMAL(10,2),
            lease_duration TEXT,
            available_date DATE,
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            neighborhood TEXT,
            latitude REAL,
            longitude REAL,
            furnished BOOLEAN DEFAULT FALSE,
            parking_available BOOLEAN DEFAULT FALSE,
            pet_policy TEXT,
            smoking_policy TEXT,
            amenities TEXT, -- JSON string
            contact_info TEXT, -- JSON string
            status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'pending_approval')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
        );
    """)
    print("✅ Properties table created")
    
    # Property images table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS property_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            property_id INTEGER NOT NULL,
            image_url TEXT NOT NULL,
            caption TEXT,
            is_primary BOOLEAN DEFAULT FALSE,
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE
        );
    """)
    print("✅ Property images table created")
    
    # Favorites table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id INTEGER NOT NULL,
            property_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(tenant_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE,
            UNIQUE(tenant_id, property_id)
        );
    """)
    print("✅ Favorites table created")
    
    # Rentals table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS rentals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            property_id INTEGER NOT NULL,
            tenant_id INTEGER NOT NULL,
            owner_id INTEGER NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            rent_amount DECIMAL(10,2) NOT NULL,
            security_deposit DECIMAL(10,2),
            status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'terminated', 'pending')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE,
            FOREIGN KEY(tenant_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
        );
    """)
    print("✅ Rentals table created")
    
    # Create messages table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            recipient_id INTEGER NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            property_id INTEGER,
            inquiry_type TEXT DEFAULT 'general',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users (id),
            FOREIGN KEY (recipient_id) REFERENCES users (id),
            FOREIGN KEY (property_id) REFERENCES properties (id)
        )
    ''')
    print("✅ Messages table created")

    # Create contact_requests table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS contact_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            property_id INTEGER NOT NULL,
            owner_id INTEGER NOT NULL,
            tenant_id INTEGER NOT NULL,
            tenant_name TEXT NOT NULL,
            tenant_email TEXT NOT NULL,
            tenant_phone TEXT,
            message TEXT NOT NULL,
            preferred_date DATE,
            inquiry_type TEXT DEFAULT 'general',
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (property_id) REFERENCES properties (id),
            FOREIGN KEY (owner_id) REFERENCES users (id),
            FOREIGN KEY (tenant_id) REFERENCES users (id)
        )
    ''')
    print("✅ Contact requests table created")
    
    # Create default admin user
    print("👤 Creating default admin user...")
    admin_password_hash = generate_password_hash("sumeyo2025")
    cur.execute(
        "INSERT INTO users (name, email, password_hash, role, is_admin) VALUES (?, ?, ?, ?, ?)",
        ("Admin", "garissarealestate@gmail.com", admin_password_hash, "admin", True)
    )
    print("✅ Admin user created: garissarealestate@gmail.com / sumeyo2025")
    
    # Create some sample users for testing
    print("👥 Creating sample users...")
    
    # Sample owner
    owner_password_hash = generate_password_hash("password123")
    cur.execute(
        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        ("John Owner", "owner@example.com", owner_password_hash, "owner")
    )
    print("✅ Sample owner created: owner@example.com / password123")
    
    # Sample tenant
    tenant_password_hash = generate_password_hash("password123")
    cur.execute(
        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        ("Jane Tenant", "tenant@example.com", tenant_password_hash, "tenant")
    )
    print("✅ Sample tenant created: tenant@example.com / password123")
    
    # Commit all changes
    conn.commit()
    conn.close()
    
    print("\n🎉 Database setup completed successfully!")
    print("\n📋 Default login credentials:")
    print("   Admin: garissarealestate@gmail.com / sumeyo2025")
    print("   Owner: owner@example.com / password123")
    print("   Tenant: tenant@example.com / password123")
    print("\n🚀 You can now start the backend server with: python3 app.py")

if __name__ == "__main__":
    try:
        create_database()
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        sys.exit(1)
