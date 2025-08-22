# Backend (Flask)

## Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env  # then edit values
```

Set these values:
- MAIL_USERNAME=garissarealestate@gmail.com
- MAIL_PASSWORD=otss hrgb pgie dcbw
- MAIL_DEFAULT_SENDER=garissarealestate@gmail.com

## Run

```bash
source venv/bin/activate
python -m backend.app
```

The API will run on http://localhost:5000
