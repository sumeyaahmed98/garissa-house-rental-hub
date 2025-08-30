# 🔧 Troubleshooting Guide

## Common Issues When Setting Up on New Laptops

### 🚨 "Failed to load dashboard data" Error

**Problem**: Dashboard shows "Failed to load dashboard data" or "Request failed"

**Cause**: Database is not properly initialized or missing

**Solution**:
```bash
# Run the database setup script
python3 backend/setup_database.py
```

**Verification**:
```bash
# Check if database exists
ls -la backend/database.db

# Check if database has users
sqlite3 backend/database.db "SELECT COUNT(*) FROM users;"
```

### 🚨 "No module named 'flask'" Error

**Problem**: Backend fails to start with import errors

**Cause**: Virtual environment not activated or dependencies not installed

**Solution**:
```bash
# Make sure you're in project root
cd /path/to/garissa-house-rental-hub

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run as module (not from backend directory)
python3 -m backend.app
```

### 🚨 "Access denied" Errors

**Problem**: API endpoints return 403 Forbidden

**Cause**: Wrong user role or not logged in

**Solutions**:

1. **For Admin Features**: Login as admin
   - Email: `garissarealestate@gmail.com`
   - Password: `sumeyo2025`

2. **For Owner Features**: Login as owner
   - Email: `owner@example.com`
   - Password: `password123`

3. **For Tenant Features**: Login as tenant
   - Email: `tenant@example.com`
   - Password: `password123`

### 🚨 "Cannot connect to localhost:5000" Error

**Problem**: Frontend can't connect to backend

**Cause**: Backend server not running

**Solution**:
```bash
# Terminal 1: Start backend
source venv/bin/activate
python3 -m backend.app

# Terminal 2: Start frontend
npm run dev
```

### 🚨 "Database is locked" Error

**Problem**: SQLite database is locked

**Cause**: Multiple processes trying to access database

**Solution**:
```bash
# Kill all Python processes
pkill -f python

# Restart backend
source venv/bin/activate
python3 -m backend.app
```

### 🚨 "Port already in use" Error

**Problem**: Port 5000 or 5173 is already in use

**Solution**:
```bash
# Find processes using the port
lsof -i :5000
lsof -i :5173

# Kill the process
kill -9 <PID>
```

### 🚨 "Permission denied" Error

**Problem**: Can't run setup script

**Solution**:
```bash
# Make script executable
chmod +x setup_new_laptop.sh

# Run the script
./setup_new_laptop.sh
```

## 🔍 Diagnostic Commands

### Check System Status
```bash
# Check Python version
python3 --version

# Check if virtual environment exists
ls -la venv/

# Check if database exists
ls -la backend/database.db

# Check database content
sqlite3 backend/database.db "SELECT name, email, role FROM users;"
```

### Check Backend Status
```bash
# Test backend endpoint
curl http://localhost:5000/

# Test with authentication
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "garissarealestate@gmail.com", "password": "sumeyo2025"}'
```

### Check Frontend Status
```bash
# Check if frontend is running
curl http://localhost:5173/

# Check Node.js dependencies
npm list
```

## 🆘 Complete Reset

If nothing else works, do a complete reset:

```bash
# 1. Stop all processes
pkill -f python
pkill -f node

# 2. Remove virtual environment
rm -rf venv/

# 3. Remove database
rm -f backend/database.db

# 4. Remove node_modules
rm -rf node_modules/

# 5. Run automated setup
./setup_new_laptop.sh
```

## 📞 Getting Help

If you're still having issues:

1. **Check the logs**: Look at terminal output for error messages
2. **Verify setup**: Make sure you followed all setup steps
3. **Check versions**: Ensure Python 3.8+ and Node.js 14+ are installed
4. **Contact support**: Email garissarealestate@gmail.com

## 🔄 Quick Fix Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 14+ installed
- [ ] In project root directory
- [ ] Virtual environment activated
- [ ] Dependencies installed
- [ ] Database initialized
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Using correct login credentials
