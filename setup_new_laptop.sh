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

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install -r backend/requirements.txt

# Install Node.js dependencies
echo "📥 Installing Node.js dependencies..."
npm install

# Setup database
echo "🗄️  Setting up database..."
python3 backend/setup_database.py

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend server:"
echo "   source venv/bin/activate"
echo "   python3 -m backend.app"
echo ""
echo "2. In another terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "3. Login with default credentials:"
echo "   Admin: garissarealestate@gmail.com / sumeyo2025"
echo "   Owner: owner@example.com / password123"
echo "   Tenant: tenant@example.com / password123"
echo ""
echo "🚀 Your application should now be running at http://localhost:5173"
