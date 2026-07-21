# Corner

Corner is a modern flashcard learning platform built as a production-ready MVP. It uses a React + Vite frontend with Tailwind CSS and a Node.js + Express backend with MongoDB authentication.

## What is included

- Login and registration with JWT auth
- Protected routes
- Dashboard with deck statistics
- Deck details page with flashcard management
- Study mode with flip animation and difficulty buttons
- Settings page with logout and profile summary
- Responsive mobile and desktop UI

## Getting started

### Backend

1. Open a terminal in `server`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a terminal in `client/client`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

The frontend expects the backend to run at `http://localhost:5000`.

## Notes

- Authentication state is stored in `localStorage`.
- The frontend is designed to remain simple and easy to understand for a student developer.
- Backend changes were kept minimal to support deck and flashcard updates.
