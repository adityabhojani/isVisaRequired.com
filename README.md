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
| `CRON_SECRET` | api-server | Authorises the scheduled jobs. Generate with `openssl rand -hex 32` — hex, never anything with two dots, which Clerk would read as a session token. Without it the cron endpoints return 503 and run nothing. |
| `RESEND_API_KEY` | api-server | Sends visa-alert emails. Optional: alerts are recorded either way, but nothing is emailed without it. |
| `INDEXNOW_KEY` | api-server | Optional override. A default key ships in the code and the ownership file is served at `/{key}.txt` automatically, so IndexNow works with nothing set — an IndexNow key is public by design. Set this only to rotate it. |
| `BING_API_KEY` | api-server | Optional. From Bing Webmaster Tools → Settings → API access. Lets the same job use Bing's direct URL Submission API within the allowance Bing reports. |

`PORT` / `BASE_PATH` are Replit dev-server vars and are **not** needed on Vercel (the build defaults `BASE_PATH=/`).

## Getting search engines to crawl the whole site

The site publishes ~38,000 pages. Sitemaps alone leave most of them uncrawled for
months, so `GET /api/cron/submit-urls` (Vercel Cron, 06:20 UTC daily) pushes them
out in daily batches — landing pages and hubs first, then blog posts, then every
passport → destination pair, and never the same URL twice until everything else
has had a turn. What has been sent is recorded in the `url_submissions` table.

Two back ends, both optional and independent:

* **IndexNow** — the open protocol behind Bing, Yandex, Naver and Seznam. No
  account, no published quota, and nothing to configure: the key ships in the
  code and is served at `/{key}.txt`, which is exactly how the protocol proves
  host ownership. It carries the bulk of the work:
  1,000 URLs a day until the site has been covered once, about five weeks, then
  200 a day to keep it fresh.
* **Bing URL Submission API** (`BING_API_KEY`) — direct, but rate-limited per site.
  The job asks Bing what today's allowance is (`GetUrlSubmissionQuota`) and never
  exceeds it. A new site typically gets ten a day; the allowance rises as Bing
  comes to trust the site, and the job picks that up automatically.

IndexNow runs out of the box; `BING_API_KEY` only adds the direct Bing channel on top.

To see what tomorrow would do without sending anything, sign in as an admin and
open `/api/cron/submit-urls?dry=1`.

## Local development (Replit / local)

```sh
pnpm install
pnpm --filter @workspace/api-server dev      # API
pnpm --filter @workspace/visa-checker dev     # frontend (needs PORT + BASE_PATH set)
pnpm --filter @workspace/db push              # apply DB schema (dev only)
```

See `replit.md` for full feature/endpoint documentation.
