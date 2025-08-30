# Backend Setup and Running Instructions

## Prerequisites

- Python 3.8 or higher
- Virtual environment (venv) at project root level

## Setup for New Laptops (After Cloning)

When you clone this project to a new laptop, follow these steps:

### 1. Initial Setup

```bash
# Navigate to project root
cd /path/to/garissa-house-rental-hub

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
```

### 2. Database Setup (IMPORTANT!)

**This step is crucial for new laptops!** The database needs to be initialized with tables and default users.

```bash
# Make sure you're in the project root with venv activated
cd /path/to/garissa-house-rental-hub
source venv/bin/activate

# Run the database setup script
python backend/setup_database.py
```

This will:
- ✅ Create all database tables
- ✅ Create default admin user
- ✅ Create sample owner and tenant users
- ✅ Set up proper database structure

### 3. Default Login Credentials

After running the setup script, you can login with:

- **Admin**: `garissarealestate@gmail.com` / `sumeyo2025`
- **Owner**: `owner@example.com` / `password123`
- **Tenant**: `tenant@example.com` / `password123`

## Running the Flask Server

**IMPORTANT: Always run from the PROJECT ROOT, not from the backend directory**

### Correct Way (from project root):

```bash
# Navigate to project root
cd /path/to/garissa-house-rental-hub

# Activate virtual environment
source venv/bin/activate

# Run Flask app as a module
python -m backend.app
```

### Wrong Way (don't do this):

```bash
# DON'T run from backend directory
cd backend
python3 app.py  # This will fail with "No module named 'flask'"
```

## Environment Variables

Make sure you have a `.env` file in the backend directory with:

```
MAIL_USERNAME=garissarealestate@gmail.com
MAIL_PASSWORD=your_app_password_here
```

## API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /tenant-signup` - Tenant-specific registration
- `POST /owner-signup` - Owner-specific registration
- `POST /forgot-password` - Send password reset code
- `POST /reset-password` - Reset password with code
- `POST /change-password` - Change password (authenticated)
- `GET /me` - Get current user info

### Property Management
- `POST /properties` - Create property (owner only)
- `GET /properties` - Get all properties
- `GET /properties/<id>` - Get specific property
- `GET /my-properties` - Get owner's properties
- `PUT /properties/<id>` - Update property (owner only)
- `DELETE /properties/<id>` - Delete property (owner only)

### Rental Management
- `GET /rentals` - Get user's rentals (owner/tenant)
- `POST /rentals` - Create rental (owner only)
- `PUT /rentals/<id>` - Update rental (owner only)
- `DELETE /rentals/<id>` - Delete rental (owner only)
- `GET /admin/rentals` - Get all rentals (admin only)

### Admin Management
- `GET /admin/users` - Get all users (admin only)
- `PUT /admin/users/<id>/role` - Update user role (admin only)

### Favorites
- `POST /properties/<id>/favorite` - Add to favorites (tenant only)
- `DELETE /properties/<id>/favorite` - Remove from favorites (tenant only)
- `GET /favorites` - Get user's favorites (tenant only)

## Troubleshooting

### "Failed to load dashboard data" Error

If you see this error on a new laptop:

1. **Make sure you ran the database setup script:**
   ```bash
   python backend/setup_database.py
   ```

2. **Check if database file exists:**
   ```bash
   ls -la backend/database.db
   ```

3. **Verify database has data:**
   ```bash
   sqlite3 backend/database.db "SELECT COUNT(*) FROM users;"
   ```

### "No module named 'flask'" Error

1. Make sure you're in the project root directory
2. Make sure the virtual environment is activated
3. Make sure dependencies are installed: `pip install -r backend/requirements.txt`
4. Run as module: `python -m backend.app`

### "Access denied" Errors

- **Admin endpoints**: Only accessible by users with `role = 'admin'`
- **Owner endpoints**: Only accessible by users with `role = 'owner'`
- **Tenant endpoints**: Only accessible by users with `role = 'tenant'`

Make sure you're logged in with the correct user role for the feature you're trying to access.

## Database Schema

The application uses SQLite with the following main tables:

- **users**: User accounts with roles (admin, owner, tenant)
- **properties**: Property listings with details
- **property_images**: Images for properties
- **rentals**: Rental agreements between owners and tenants
- **favorites**: Tenant's favorite properties
- **reset_codes**: Password reset functionality

## Development Notes

- The database is automatically initialized when the Flask app starts
- Default admin user is created if it doesn't exist
- All endpoints require JWT authentication except login/signup
- Role-based access control is implemented throughout the API
