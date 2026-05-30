# isVisaRequired.com

Visa requirement checker. pnpm monorepo (originally built on Replit), deployed on Vercel.

## Structure

- `artifacts/visa-checker` — React + Vite frontend (the website). **Built and served by Vercel.**
- `artifacts/api-server` — Express 5 API. **Deployed as a Vercel serverless function** via `api/index.ts`.
- `artifacts/visa-app` — Expo (React Native) mobile app. Not deployed by Vercel.
- `artifacts/mockup-sandbox` — internal UI sandbox. Not deployed.
- `lib/*` — shared workspace packages (`db`, `api-zod`, `api-client-react`, `api-spec`).

## How Vercel builds this

See `vercel.json`:

- **Install**: `pnpm install` for the `visa-checker` + `api-server` workspaces.
- **Build**: `pnpm --filter @workspace/visa-checker build` → static output in `artifacts/visa-checker/dist/public`.
- **API**: `/api/*` is rewritten to the `api/index.ts` serverless function, which runs the Express app. The frontend calls the API at same-origin `/api/...`, so no API URL config is needed.
- **SPA fallback**: all other routes rewrite to `index.html`.

## Required environment variables (set in Vercel project settings)

| Variable | Used by | Notes |
|----------|---------|-------|
| `DATABASE_URL` | api-server | Postgres connection string (e.g. Neon). Required — server throws without it. |
| `CLERK_PUBLISHABLE_KEY` | api-server | Clerk auth (My Travels, admin). |
| `CLERK_SECRET_KEY` | api-server | Clerk backend key. |
| `VITE_CLERK_PUBLISHABLE_KEY` | frontend (build-time) | Same Clerk publishable key, exposed to the browser. |
| `VITE_GA_MEASUREMENT_ID` | frontend (build-time) | Google Analytics (optional). |
| `NODE_ENV=production` | both | Vercel sets this automatically; keeps pino logging worker-free for serverless. |

`PORT` / `BASE_PATH` are Replit dev-server vars and are **not** needed on Vercel (the build defaults `BASE_PATH=/`).

## Local development (Replit / local)

```sh
pnpm install
pnpm --filter @workspace/api-server dev      # API
pnpm --filter @workspace/visa-checker dev     # frontend (needs PORT + BASE_PATH set)
pnpm --filter @workspace/db push              # apply DB schema (dev only)
```

See `replit.md` for full feature/endpoint documentation.
