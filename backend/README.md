# Backend Setup and Running Instructions

## Prerequisites

- Python 3.8 or higher
- Virtual environment (venv) at project root level

## Setup (Run from Project Root)

```bash
# Navigate to project root
cd /home/noor/development/code/project/garissa-house-rental-hub

# Create virtual environment (if not already created)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

## Running the Flask Server

**IMPORTANT: Always run from the PROJECT ROOT, not from the backend directory**

### Correct Way (from project root):

```bash
# Navigate to project root
cd /home/noor/development/code/project/garissa-house-rental-hub

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

## Why This Happens

- The virtual environment (`venv`) is created at the project root level
- All Python dependencies are installed in the project root venv
- When you run from the backend directory, Python can't find the installed packages
- The Flask app needs to be run as a module: `python -m backend.app`

## Environment Variables

Make sure you have a `.env` file in the backend directory with:

```
MAIL_USERNAME=garissarealestate@gmail.com
MAIL_PASSWORD=your_app_password_here
```

## API Endpoints

- `POST /signup` - User registration
- `POST /login` - User login
- `POST /forgot-password` - Send password reset code
- `POST /reset-password` - Reset password with code
- `POST /change-password` - Change password (authenticated)
- `GET /me` - Get current user info

## Troubleshooting

If you get "No module named 'flask'" error:

1. Make sure you're in the project root directory
2. Make sure the virtual environment is activated
3. Make sure dependencies are installed: `pip install -r backend/requirements.txt`
4. Run as module: `python -m backend.app`
