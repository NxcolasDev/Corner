# Project Structure

## Root
- `Readme.md` - project startup and overview.
- `PROJECT_STRUCTURE.md` - explanation of the main folders.
- `FRONTEND_DOCUMENTATION.md` - frontend architecture and workflow.

## `client/client`
- `package.json` - frontend dependencies and scripts.
- `vite.config.js` - Vite configuration with Tailwind plugin.
- `src/` - frontend source code.

### `src/api`
- `axios.js` - central Axios instance with base URL and auth header helper.

### `src/context`
- `AuthContext.jsx` - authentication context for user state and token persistence.

### `src/layouts`
- `AppLayout.jsx` - shared application shell with sidebar and mobile navigation.

### `src/pages`
- `Login.jsx` - user login page.
- `Register.jsx` - registration page.
- `Dashboard.jsx` - home page with deck metrics and quick actions.
- `DeckDetails.jsx` - deck view, flashcard CRUD, and deck edit support.
- `Study.jsx` - study mode with flip card experience and review buttons.
- `Settings.jsx` - profile and logout page.

### `src/services`
- `auth.service.js` - auth API calls.
- `deck.service.js` - deck API calls.
- `flashcard.service.js` - flashcard API calls.

### `src/components`
- `DeckCard.jsx` - reusable deck card component.
- `FlashcardRow.jsx` - flashcard list row with edit/delete actions.
- `StudyCard.jsx` - study card display component.

### `src/utils`
- `format.js` - shared display helpers.
