# LaunchPad 4.0

## Environment variables

Set these in Vercel (Project → Settings → Environment Variables) and in `.env.local` for local dev.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key (browser client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service-role key (API routes) |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Yes | Gmail transport for outgoing email |
| `CRON_SECRET` | Yes | Shared secret for `/api/cron/ambassador-report`. Vercel Cron sends it as `Authorization: Bearer <CRON_SECRET>`; requests without it get 401. Use a random string of at least 16 characters. |
| `AMBASSADOR_SHEET_SCRIPT_URL` | Yes | Web app `/exec` URL of the ambassador sheet's Apps Script |
| `AMBASSADOR_SHEET_SECRET` | Yes | Shared secret; must equal the script's `SHEET_SECRET` property |
| `AMBASSADOR_SHEET_URL` | Yes | Link to the ambassador spreadsheet, used for the email's "Open Sheet" button |

## Nightly ambassador report

`vercel.json` schedules `GET /api/cron/ambassador-report` at `0 18 * * *` (18:00 UTC / 23:30 Asia/Colombo; Vercel Hobby crons may fire up to an hour late). It emails headline totals and the top 10 ambassadors to the OCP (BCC Migara) every night through 31 Oct 2026 (Colombo time), then responds `report period ended` without sending.

Each run also overwrites two tabs in the ambassador Google Sheet: **Ambassadors** (every ambassador's registration details) and **Leaderboard** (rank, code, name, referral count for every ambassador, same order as the email). If the sheet update fails, the email is still sent with a warning line.

Trigger it manually:

```sh
curl -H "Authorization: Bearer $CRON_SECRET" https://<deployment>/api/cron/ambassador-report
```

### Ambassador sheet setup (one-off)

1. Signed in as migarawijewardana27@gmail.com, create a new Google Sheet (e.g. "LaunchPad 4.0 – Ambassadors").
2. **Extensions → Apps Script**. Replace `Code.gs` with the contents of [`docs/apps-script/ambassador-sheet.gs`](docs/apps-script/ambassador-sheet.gs) and save. This is a new script, separate from the delegate-registration one.
3. **Project Settings → Script properties → Add property**: `SHEET_SECRET` = a random string of at least 16 characters.
4. **Deploy → New deployment → Web app**, Execute as **Me**, Who has access **Anyone**. Authorize it, then copy the `/exec` URL. (After later script edits, use **Manage deployments → Edit → New version** so the URL stays the same.)
5. Share the sheet with thrinayaniselvanathan@aiesec.net. Viewer access is enough, because both tabs are overwritten every night.
6. In Vercel, add `AMBASSADOR_SHEET_SCRIPT_URL` (the `/exec` URL), `AMBASSADOR_SHEET_SECRET` (same value as `SHEET_SECRET`) and `AMBASSADOR_SHEET_URL` (the sheet's browser URL), then redeploy.
7. Trigger the report manually (above). Check that both tabs fill and that the email's "Open Sheet" button opens the sheet.

## Tests

```sh
npm test
```

Uses Node's built-in test runner (`node --test`) on `src/**/*.test.js`.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
