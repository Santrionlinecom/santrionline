# Local Fix Database Script

The previous `fix-database.js` (root) has been moved to `scripts/local/fix-database.js` to prevent Cloudflare Pages build from touching native dependency `better-sqlite3`.

## Why
Cloudflare Pages (and Workers) environment does not support native Node addons like `better-sqlite3`. Keeping the script in root increases risk of accidental import or bundler crawling it.

## Usage (Local Only)
```bash
node scripts/local/fix-database.js
```

If you ever need to run this in CI, set an explicit guard and avoid running in Cloudflare:
```bash
ALLOW_NATIVE=1 node scripts/local/fix-database.js
```

## Safety
- Do NOT import this file anywhere under `app/`
- Guard clause prevents execution when `process.env.CLOUDFLARE` is present without `ALLOW_NATIVE`

## Next Steps
If builds were failing due to native module resolution, this isolation plus the new `remix.config.mjs` should fix it. Re-run:
```bash
npm run build
```
Then deploy again.
