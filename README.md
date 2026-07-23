# Campus Marketplace — Frontend

React SPA for a student marketplace with Pesapal payment, dark mode, and chat.

## Stack

- React 18, Vite 6
- React Router v6
- Tailwind CSS 3 (dark mode via class strategy)
- Axios with JWT interceptor
- Playwright (E2E tests)
- ESLint 9 (flat config)

## Quick Start

```bash
npm install
cp .env.example .env   # defaults to localhost:8000
npm run dev            # starts on http://localhost:5173
```

## Build

```bash
npm run build          # outputs to dist/
npm run lint           # ESLint
npm run preview        # preview production build
```

## E2E Tests

Requires the Django backend running on `http://localhost:8000`.

```bash
npm run test:e2e       # runs Playwright tests headlessly
npx playwright test --ui  # interactive UI mode
```

## Features

- Browse & search listings with category/price filters
- Listing detail with image, chat modal, wishlist ♡, and report
- Seller profile page showing all their listings
- Buy Now with Pesapal hosted payment page
- Payment callback page (success/failed/pending)
- My Payments page tracking transaction history
- Messages with conversation threads, unread badges
- Dark mode toggle (persisted in localStorage)
- Recently viewed listings (persisted in localStorage)
- Loading skeleton placeholders
- Wishlist / Favourites page
- Mark item as sold (seller only)
- Responsive grid layout

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000/api` | Backend API base URL |

## CI

GitHub Actions workflow at `.github/workflows/react.yml` runs lint + build on push/PR to `main` and `dev`.
