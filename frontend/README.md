# Frontend Demo Login System

This is a simple React JavaScript demo for the login system.

## Setup

1. Install dependencies: `npm install`
2. Start the development server: `npm start`

The app will run on http://localhost:3000

## Features

- Login form that sends POST request to backend /auth/login
- Displays success or error message

## Backend

Make sure the backend is running on http://localhost:8000

To start backend:
- cd backend
- pip install -r requirements.txt
- uvicorn app.main:app --reload