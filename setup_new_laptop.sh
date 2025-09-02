#!/bin/bash

# Garissa House Rental Hub - New Laptop Setup Script
# Run this script after cloning the project to a new laptop

echo "🏠 Garissa House Rental Hub - New Laptop Setup"
echo "=============================================="

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher first."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check if we're in the project root
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the project root directory (where package.json is located)"
    exit 1
fi

echo "✅ Project root directory confirmed"

# Check if backend/requirements.txt exists
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ backend/requirements.txt not found!"
    exit 1
fi

echo "✅ Backend requirements file found"

# Remove existing virtual environment if it exists
if [ -d "venv" ]; then
    echo "🗑️  Removing existing virtual environment..."
    rm -rf venv
fi

# Create fresh virtual environment
echo "📦 Creating fresh virtual environment..."
python3 -m venv venv

if [ ! -d "venv" ]; then
    echo "❌ Failed to create virtual environment"
    exit 1
fi

echo "✅ Virtual environment created successfully"

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Verify activation
if [ "$VIRTUAL_ENV" = "" ]; then
    echo "❌ Virtual environment activation failed"
    exit 1
fi

echo "✅ Virtual environment activated: $VIRTUAL_ENV"

# Upgrade pip
echo "📥 Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install -r backend/requirements.txt

# Verify Flask installation
echo "🔍 Verifying Flask installation..."
python3 -c "import flask; print(f'✅ Flask {flask.__version__} installed successfully')" || {
    echo "❌ Flask installation failed"
    exit 1
}

# Install Node.js dependencies
echo "📥 Installing Node.js dependencies..."
npm install

# Setup database
echo "🗄️  Setting up database..."
cd backend
python3 setup_database.py
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend server:"
echo "   source venv/bin/activate"
echo "   cd backend"
echo "   python3 app.py"
echo ""
echo "2. In another terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "3. Login with default credentials:"
echo "   Admin: garissarealestate@gmail.com / sumeyo2025"
echo "   Owner: owner@example.com / password123"
echo "   Tenant: tenant@example.com / password123"
echo ""
echo "🚀 Your application should now be running at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend: http://localhost:5000"
echo ""
echo "💡 If you get 'ModuleNotFoundError: No module named flask', make sure to:"
echo "   1. Activate the virtual environment: source venv/bin/activate"
echo "   2. Check if Flask is installed: pip list | grep Flask"
echo "   3. Reinstall if needed: pip install -r backend/requirements.txt"
