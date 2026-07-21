# Frontend Documentation

## Folder responsibilities

- `src/api` holds network configuration and helper utilities for HTTP requests.
- `src/context` contains React context used for global state, especially authentication.
- `src/layouts` defines page structure and navigation around protected content.
- `src/pages` contains the screen components for each route.
- `src/services` contains functions that call backend endpoints.
- `src/components` holds reusable UI pieces for cards, rows, and study content.
- `src/utils` contains presentation helpers like date formatting and difficulty labels.

## Component architecture

The UI is intentionally simple:
- Pages are responsible for loading data, handling user input, and displaying components.
- Shared components are used for repeated UI patterns like deck cards and flashcards.
- Styling is implemented with Tailwind CSS class names for clean responsive design.

## Context API usage

Authentication state is stored in `AuthContext.jsx`:
- `user` and `token` are saved in React state.
- The context persists state in `localStorage` so the session remains after refresh.
- `login` and `logout` update the context and trigger the Axios auth header.
- `ProtectedRoute.jsx` blocks unauthenticated access to app pages.

## Axios usage

`src/api/axios.js` exports a shared Axios instance configured with:
- `baseURL: http://localhost:5000/api`
- `setAuthToken(token)` to attach or remove the bearer token header.

All API services import this instance and return JSON response data.

## Routing

`src/App.jsx` defines routes using React Router:
- `/` → `Login`
- `/register` → `Register`
- `/dashboard` → `Dashboard`
- `/decks/:deckId` → `DeckDetails`
- `/study/:deckId` → `Study`
- `/settings` → `Settings`

Protected routes are wrapped in `ProtectedRoute` and rendered inside `AppLayout`.

## Authentication flow

1. User submits login credentials in `Login.jsx`.
2. `auth.service.loginUser` calls `/api/auth/login`.
3. The response token and user details are stored in `AuthContext`.
4. `AuthContext` saves state to `localStorage` and sets the API authorization header.
5. Protected pages redirect to login if the token is missing.

## API communication

The frontend uses the following backend endpoints:
- `POST /api/auth/register` - create account
- `POST /api/auth/login` - sign in
- `GET /api/decks` - fetch user decks
- `POST /api/decks` - create a deck
- `PUT /api/decks/:id` - update a deck
- `DELETE /api/decks/:id` - delete a deck
- `GET /api/flashcards/:deckId` - fetch flashcards for a deck
- `POST /api/flashcards/:deckId` - create a flashcard
- `PUT /api/flashcards/:id` - update a flashcard
- `DELETE /api/flashcards/:id` - delete a flashcard

## Beginner-friendly notes

- The app uses plain React hooks like `useState` and `useEffect`.
- The Context API keeps authentication logic in one place.
- Services separate API calls from page rendering.
- Each page focuses on a single feature: login, dashboard, deck details, study, or settings.
- Tailwind CSS keeps styling inline and readable using utility classes.
