# DUEZERO AI

**Never miss a deadline again.**

DUEZERO AI is a deadline and renewal command center for individuals and small businesses. This first MVP is designed for India-first workflows with an international-ready interface.

## MVP features

- Add, search and filter deadlines.
- Track personal, vehicle, health, business, finance, digital and government renewals.
- Calculate overdue, due-today, due-soon and upcoming status from due dates.
- Track optional estimated amounts in INR.
- Mark records completed or delete them.
- Dashboard summary and responsive mobile layout.
- Browser-local persistence using localStorage.

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

Import this repository into Vercel and use the default Next.js build settings. No environment variables are required for this local-storage MVP.

## Important MVP boundaries

- Records are stored only in the current browser on the current device. They are not synced to an account or shared across devices.
- The notification button requests browser notification permission only. A server-side reminder scheduler is not connected yet, so automatic background reminders are not active.
- Sample records are demonstration data and can be edited or deleted.
- This app does not yet provide legal, tax, insurance or compliance advice. Verify renewal dates and requirements with the relevant provider or authority.

## Next production milestones

1. Supabase authentication and encrypted cloud-backed records with row-level security.
2. Server-side scheduled email / push reminders with user-configurable lead times.
3. Multi-currency and locale settings.
4. Document vault with private object storage.
5. Subscription billing and organization workspaces.

## Stack

- Next.js App Router
- React + TypeScript
- Lucide icons
- CSS responsive UI

## License

All rights reserved until a license is added.
