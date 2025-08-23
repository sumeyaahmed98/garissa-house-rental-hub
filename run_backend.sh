#!/bin/bash

# Script to run Flask backend
# Usage: ./run_backend.sh

echo "Starting Flask Backend..."

# Check if we're in the project root
if [ ! -f "backend/app.py" ]; then
    echo "Error: Please run this script from the project root directory"
    echo "Current directory: $(pwd)"
    echo "Expected to find: backend/app.py"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
echo "Checking dependencies..."
pip install -r backend/requirements.txt

# Kill any existing Flask processes
echo "Stopping any existing Flask processes..."
pkill -f "python.*backend.app" || true
sleep 2

# Run Flask app
echo "Starting Flask server on http://localhost:5000"
echo "Press Ctrl+C to stop"
python -m backend.app
