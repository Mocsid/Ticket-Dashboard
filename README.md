# Ticket Dashboard

A minimalist ticket tracker built with React + Tailwind CSS + Firebase Realtime Database.

## Features

- ✅ Add categories and tickets
- ✅ Mark tickets as done or undone
- ✅ Edit notes inline
- ✅ Separate view for completed tickets
- ✅ Realtime updates
- ✅ Password-gated frontend

## Technologies

- React (Create React App)
- Firebase Realtime Database
- Tailwind CSS
- Deployed via Vercel (recommended)

## Getting Started

### 1. Clone this repo

```
git clone git@github.com:Mocsid/Ticket-Dashboard.git
cd firebase-ticket-dashboard
```

### 2. Install dependencies

```
npm install
```

### 3. Add your Firebase config in `.env`:

```env
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_DATABASE_URL=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_DASHBOARD_PASSWORD=...
```

### 5. Password
Add the password under your .env or use 'defaultpassword' if not set.

### 4. Start the app

```
npm start
```

## License

MIT — free to use and modify.
