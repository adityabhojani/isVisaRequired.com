# isvisarequired.com

## Overview

A visa requirement checker web app. Users enter their passport country and destination countries to instantly see whether a visa is required, visa on arrival, e-visa, or visa-free access.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/visa-checker)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM (provisioned, not actively used — visa data is embedded)
- **Validation**: Zod, `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle for server)

## Artifacts

- **visa-checker** (previewPath: `/`) — React + Vite frontend
  - Pages: `/` (check), `/destination/:code`, `/schengen`, `/tier-list`, `/my-travels`, `/alerts`, `/blog`, `/admin`
- **api-server** (previewPath: `/api`) — Express API server
- **visa-app** (previewPath: `/visa-app/`) — Expo (React Native) iOS/Android companion app
  - Expo SDK 54, expo-router v6, Expo Go compatible
  - 4 tabs: Check (visa checker), Explore (browse destinations), History (recent lookups), Passport (power stats)
  - Uses `@workspace/api-client-react` hooks; AsyncStorage for persisting passport selection + history
  - Colors synced from web: primary `#0A2FA1`, accent `#0DB5E8`, background `#F7F9FC`
  - `setBaseUrl` injected at boot via `EXPO_PUBLIC_DOMAIN=$REPLIT_DEV_DOMAIN`
  - Liquid-glass NativeTabs on iOS 26+, BlurView tab bar fallback on older OS

## API Endpoints

- `GET /api/countries` — list all countries
- `GET /api/visa/check?passport=US&destination=FR` — single visa check
- `POST /api/visa/check-multiple` — batch visa check
- `GET /api/visa/check-all?passport=US` — all countries' visa requirements (powers world map)
- `GET /api/visa/destination-info?passport=US&destination=FR` — full info: visa details (cost, documents, process) + tourist attractions
- `GET /api/visa/popular-destinations` — top 20 travel destinations
- `GET /api/visa/stats?passport=US` — passport power stats

## Key Features

- World map visualization (react-simple-maps) colored by visa requirement
- Expandable destination cards with full detail (documents, process, fee)
- Trip overview summary (total cost, combined document checklist)
- Tourist attractions with Wikipedia-sourced photos for 30+ countries
- Sort/filter results by requirement type or alphabetically
- Click countries on map or grid to add to trip selection
- All-countries browse mode after passport selection
- Schengen 90/180-day calculator with visual calendar (/schengen)
- Passport tier list S/A/B/C/D ranking (/tier-list)
- Mystery Destination modal (random visa-free pick)
- Shareable Passport Power Card (html2canvas download)
- My Travels visited-countries tracker (/my-travels, Clerk auth)
- Admin panel: blog editor, newsletter subscribers list (with CSV export), site settings, user stats (/admin)
- Announcement Banner: configurable site-wide banner from admin settings (info/warning/success/promo, dismissable)
- Blog Article JSON-LD: Article + BreadcrumbList schema.org structured data on every blog post
- My Travels CSV export: download visited countries as CSV from the My Travels page
- Home page social proof strip: live trust signals (199 countries, instant results, free, subscriber count)
- Visa Alerts: subscribe to passport+destination change notifications (/alerts)
- Entry Requirements Checklist: per-country entry rules on destination pages

## Admin Panel

- `/admin` — dashboard
- `/admin/blog` — manage blog posts
- `/admin/blog/new` or `/admin/blog/:id` — create/edit blog post
- `/admin/newsletter` — view newsletter subscribers with stats + CSV export
- `/admin/settings` — site settings (announcement banner, hero text, SEO meta)

## Newsletter

- DB table `newsletter_subscribers` auto-created in `artifacts/api-server/src/routes/newsletter.ts`
- Routes: `POST /api/newsletter/subscribe`, `GET /api/newsletter/count`, `GET /api/admin/newsletter/subscribers`
- Frontend: subscribe widgets on home page and destination pages; count shown in home page social proof strip

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Data Files

- `artifacts/api-server/src/data/visaData.ts` — visa requirement matrix + regional treaty fallbacks
- `artifacts/api-server/src/data/countryDetails.ts` — tourist attraction data (30+ countries) + visa cost/document defaults

## Visa Data

Visa requirement data is stored in `artifacts/api-server/src/data/visaData.ts` as a static matrix covering major passport-destination pairs. Regional agreements (EU, GCC, MERCOSUR, CARICOM, ECOWAS) are handled as fallback logic.

## Visa Alerts

- DB table `visa_alerts` auto-created in `artifacts/api-server/src/routes/alerts.ts`
- Routes: `POST /api/alerts`, `GET /api/alerts`, `DELETE /api/alerts/:id`, `GET /api/admin/alerts`
- Frontend: `AlertSubscribeWidget.tsx` (single pair), `MultiAlertSubscribeWidget` (after results on home page)
- Alerts management page: `/alerts`

## Entry Requirements Checklist

- Data: `artifacts/visa-checker/src/data/entryRequirements.ts` — 50+ countries with specific rules
- Component: `artifacts/visa-checker/src/components/EntryChecklist.tsx` — collapsible, required/recommended/none badges
- Used on every `/destination/:code` page between passport power grid and tourist attractions

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
