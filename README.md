# 🏠 Garissa House Rental Hub

A comprehensive rental property management platform with role-based access control for Admins, Property Owners, and Tenants.

## 🚀 Quick Start for New Laptops

After cloning this project to a new laptop, run the automated setup script:

```bash
# Make the script executable (first time only)
chmod +x setup_new_laptop.sh

# Run the setup script
./setup_new_laptop.sh
```

This script will automatically:
- ✅ Create Python virtual environment
- ✅ Install all dependencies (Python + Node.js)
- ✅ Set up the database with default users
- ✅ Configure everything for you

## 📋 Manual Setup (Alternative)

If you prefer manual setup:

### 1. Backend Setup
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r backend/requirements.txt

# Setup database
python backend/setup_database.py
```

### 2. Frontend Setup
```bash
# Install Node.js dependencies
npm install
```

## 🏃‍♂️ Running the Application

### Start Backend Server
```bash
# Activate virtual environment
source venv/bin/activate

# Start Flask server
python -m backend.app
```
Backend will run on: http://localhost:5000

### Start Frontend Server
```bash
# In a new terminal
npm run dev
```
Frontend will run on: http://localhost:5173

## 👤 Default Login Credentials

After setup, you can login with these accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | garissarealestate@gmail.com | sumeyo2025 |
| **Owner** | owner@example.com | password123 |
| **Tenant** | tenant@example.com | password123 |

## 🏗️ System Architecture

### Role-Based Access Control

#### 👑 **Admin Dashboard**
- Manage all users and their roles
- View all properties across the platform
- Monitor all rental agreements
- System-wide analytics and reports
- Platform management and oversight

#### 🏠 **Owner Dashboard**
- Add and manage property listings
- Upload property images
- Manage rental agreements
- View tenant information
- Track property status and availability

#### 🏡 **Tenant Dashboard**
- Search and browse available properties
- Save favorite properties
- View rental history
- Contact property owners
- Manage rental applications

### Key Features

#### Property Management
- **Comprehensive Property Forms**: Detailed property listings with amenities, contact info, and images
- **Image Upload**: Multiple images per property with captions
- **Search & Filter**: Advanced property search with filters (price, location, amenities)
- **Property Details**: Rich property information with owner contact details

#### Rental System
- **Rental Agreements**: Create and manage rental contracts
- **Status Tracking**: Track rental status (active, expired, terminated)
- **Tenant Management**: View and manage tenant information
- **Rental History**: Complete rental transaction history

#### User Management
- **Role-Based Access**: Secure role-based permissions
- **User Profiles**: Detailed user profiles with contact information
- **Admin Controls**: Admin can manage user roles and permissions

## 🛠️ Technology Stack

### Backend
- **Flask**: Python web framework
- **SQLite**: Lightweight database
- **JWT**: Authentication and authorization
- **SQLAlchemy**: Database ORM (if needed for scaling)

### Frontend
- **React**: JavaScript framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **React Icons**: Icon library

### Authentication
- **JWT Tokens**: Secure authentication
- **Role-Based Access**: Admin, Owner, Tenant roles
- **Password Hashing**: Secure password storage

## 📁 Project Structure

```
garissa-house-rental-hub/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── models.py              # Database models and setup
│   ├── setup_database.py      # Database initialization script
│   ├── requirements.txt       # Python dependencies
│   └── database.db           # SQLite database
├── src/
│   ├── admin/                # Admin dashboard components
│   ├── owner/                # Owner dashboard components
│   ├── tenant/               # Tenant dashboard components
│   ├── components/           # Shared components
│   ├── context/              # React context providers
│   └── pages/                # Page components
├── setup_new_laptop.sh       # Automated setup script
└── package.json              # Node.js dependencies
```

## 🔧 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /signup` - General user registration
- `POST /tenant-signup` - Tenant-specific registration
- `POST /owner-signup` - Owner-specific registration

### Property Management
- `GET /properties` - Get all properties
- `POST /properties` - Create property (owner only)
- `GET /my-properties` - Get owner's properties
- `PUT /properties/<id>` - Update property
- `DELETE /properties/<id>` - Delete property

### Rental Management
- `GET /rentals` - Get user's rentals
- `POST /rentals` - Create rental (owner only)
- `GET /admin/rentals` - Get all rentals (admin only)

### Admin Management
- `GET /admin/users` - Get all users (admin only)
- `PUT /admin/users/<id>/role` - Update user role

## 🚨 Troubleshooting

### "Failed to load dashboard data" Error
This usually means the database isn't properly initialized. Run:
```bash
python backend/setup_database.py
```

### "No module named 'flask'" Error
Make sure you're:
1. In the project root directory
2. Virtual environment is activated
3. Dependencies are installed
4. Running as module: `python -m backend.app`

### "Access denied" Errors
- Admin endpoints require `role = 'admin'`
- Owner endpoints require `role = 'owner'`
- Tenant endpoints require `role = 'tenant'`

### Database Issues
Check if database exists and has data:
```bash
ls -la backend/database.db
sqlite3 backend/database.db "SELECT COUNT(*) FROM users;"
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions per role
- **Password Hashing**: Secure password storage with bcrypt
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries

## 🚀 Deployment Considerations

### For Production
1. **Database**: Consider PostgreSQL for production
2. **File Storage**: Use cloud storage (AWS S3, Google Cloud Storage)
3. **Environment Variables**: Secure configuration management
4. **HTTPS**: SSL/TLS encryption
5. **Rate Limiting**: API rate limiting
6. **Logging**: Comprehensive logging and monitoring

### Scaling
- **Load Balancing**: Multiple server instances
- **Caching**: Redis for session and data caching
- **CDN**: Content delivery network for static assets
- **Database Optimization**: Indexing and query optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions:
- Email: garissarealestate@gmail.com
- Create an issue in the repository

---

**Built with ❤️ for Garissa House Rental Hub**
