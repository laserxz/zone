# Project: Landing Page
## URL: zone.net.au

## Stack
- React (CDN-loaded via react.min.js / react-dom.min.js)
- JSX compiled with Babel CLI (zone-src.jsx → zone-compiled.js)
- No backend, no build tooling beyond Babel
- Static HTML + pre-compiled React

## File Structure
- `index.html` — main page, loads React from CDN scripts and zone-compiled.js
- `zone-src.jsx` — React JSX source (app cards, nav, tabbed panel, layout)
- `zone-landing.jsx` — alternate/older JSX source
- `zone-compiled.js` — Babel-compiled output loaded by index.html
- `zone-compiled-new.js` — alternate compiled version
- `react.min.js` / `react-dom.min.js` — vendored React (CDN fallback)
- `package.json` — Babel dev dependencies only

## Infrastructure
- VPS path: /var/www/zone
- PM2 name: static (no PM2)
- Port: static (Nginx serves files directly)
- Nginx: /etc/nginx/sites-enabled/zone.net.au (also handles www.zone.net.au)
- GitHub: github.com/laserxz/zone
- Local: C:\Users\Jeff\Documents\GitHub\zone

## Deploy
Edit locally → push via GitHub Desktop → `git pull` on VPS
If JSX changed: `npx babel zone-src.jsx --presets @babel/preset-react -o zone-compiled.js`

## Key Info
- Landing page for all zone.net.au apps
- Lists app cards with links to each subdomain
- Nginx redirects www.zone.net.au → zone.net.au
- No auth, no API, no database

## Architecture
- No hero section — compact nav bar with inline tagline
- About / Feedback / Donate merged into a single TabbedPanel component below the app grid
- App grid uses auto-fill minmax(175px, 1fr) for responsive layout
- 4 categories: Laser Show Tools, Utilities, Entertainment, Finance
- Cross-listing via `crossCategory` array on apps (ShowCo → Finance, Mortgage → Finance)
- Category filter pills have per-category accent colours (defined in CATEGORY_CONFIG)
- 12 apps total: ShowCo, MPE Calculator, LaserMaze, SWMS, Conductor, LaserFace, BPM Detector, ReceiptZone, PWS Weather, Mortgage Calculator, Watch Tracker, PopUp Cards

## Current State
- Fully functional landing page

## Rules
- Dark theme UI
- PWA + Capacitor-ready
- Contact: apps@zone.net.au
- For workflow rules see /root/WORKFLOW.md
