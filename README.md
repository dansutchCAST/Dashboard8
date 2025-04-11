# UK Grantmakers Dashboard

This is a React + Next.js dashboard that visualizes postcode-level UK grantmaking data from 360Giving.

## Features

- Interactive Leaflet map (client-side only)
- Filters by theme and postcode
- Bar chart breakdown of themes

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Deployment

Deploy on Vercel. This version disables SSR for the map to avoid Leaflet's `window` reference error.
