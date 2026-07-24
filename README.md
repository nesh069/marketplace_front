# Campus Marketplace — Frontend

React SPA for a student marketplace with Pesapal payment, dark mode, and chat.

## Stack

- React 18, Vite 6
- React Router v6 (public browsing + protected routes)
- Tailwind CSS 3 (dark mode via class strategy)
- Axios with JWT interceptor (auto-refresh on 401)
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

- **Public browsing** — listings, detail, seller profiles visible without login
- Browse & search listings with category/price filters
- Listing detail with image, chat modal, wishlist ♡, and report
- Seller profile page showing all their listings
- **Buy Now** with Pesapal hosted payment page (phone validated on input + submit)
- Payment callback page (success/failed/pending) with status update from Pesapal
- My Payments page tracking transaction history (with skeleton loading)
- **Messages** with conversation threads, unread badges, and inline reply input
- **Profile page** showing account details
- Dark mode toggle (persisted in localStorage)
- Recently viewed listings (persisted in localStorage)
- **Wishlist** / Favourites page (state persisted in localStorage + synced with API)
- Mark item as sold (seller only)
- Scroll-to-top on navigation
- Smooth scrolling
- Loading skeleton placeholders (cards, detail, messages, payments)
- Responsive grid layout

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000/api` | Backend API base URL |

## CI

GitHub Actions workflow at `.github/workflows/react.yml` runs lint + build on push/PR to `main` and `dev`.
