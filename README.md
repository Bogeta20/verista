## Verista

Airbnb-style two-sided marketplace for short-let apartments in Lagos, Nigeria.
Hosts list properties, guests search/book/pay, Verista takes a host-side
commission on each booking.

One Next.js app (App Router) serving both the UI and the API routes —
responsive across desktop and phone widths, not a separate native app.

### Stack

- **Framework:** Next.js (React), API routes via Route Handlers
- **Database:** PostgreSQL via Prisma ORM (driver adapter: `@prisma/adapter-pg`)
- **File storage:** AWS S3 (`af-south-1`)
- **Payments:** Paystack (Subaccounts + split payments)
- **Hosting target:** Railway

### Local setup

```bash
npm install

# Postgres: point DATABASE_URL in .env at a local/Docker Postgres instance
cp .env.example .env

npm run prisma:migrate   # applies prisma/migrations, generates the client
npm run dev               # http://localhost:3000
```

`/api/health` reports API + database connectivity; the homepage shows the
same status while the real product pages are being built.

### Env vars

See `.env.example`. Ask a project owner for test-mode Paystack keys and S3
credentials — never hardcode secrets in code or commit a real `.env`.

### Build status

Built in stages per the project's build order; each stage is confirmed
working before moving to the next.

- [x] 1. Project scaffold — Next.js + Prisma + Postgres, health check
- [ ] 2. Auth (signup/login, roles)
- [ ] 3. Host flow (payout info, listings, services, publish)
- [ ] 4. Guest flow (search, listing detail, booking)
- [ ] 5. Messaging
- [ ] 6. Paystack integration (subaccounts, split payments, webhook)
- [ ] 7. Dashboards
