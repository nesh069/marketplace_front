# Campus Marketplace — Frontend

React SPA for a student marketplace, paired with the Django backend.

## Stack

- React 18, Vite 6
- React Router v6
- Tailwind CSS 3
- Axios
- ESLint 9 (flat config)

## Quick Start

```bash
npm install
npm run dev          # starts on http://localhost:5173
```

## Build

```bash
npm run build        # outputs to dist/
npm run lint         # ESLint
npm run preview      # preview production build
```

## Docker

```bash
docker build -t marketplace-front .
docker run -p 8080:80 marketplace-front
```

Multi-stage build: Node 20 Alpine builds the app, nginx serves the static bundle.

## CI

GitHub Actions workflow at `.github/workflows/react.yml` runs lint + build on push/PR to `main` and `dev`.
