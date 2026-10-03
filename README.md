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

## Nightly ambassador report

`vercel.json` schedules `GET /api/cron/ambassador-report` at `0 18 * * *` (18:00 UTC / 23:30 Asia/Colombo; Vercel Hobby crons may fire up to an hour late). It emails headline totals and the top 10 ambassadors to the OCP (BCC Migara) every night through 31 Oct 2026 (Colombo time), then responds `report period ended` without sending.

Trigger it manually:

```sh
curl -H "Authorization: Bearer $CRON_SECRET" https://<deployment>/api/cron/ambassador-report
```

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
