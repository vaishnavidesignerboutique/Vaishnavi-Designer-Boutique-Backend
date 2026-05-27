# Vaishnavi Designer Boutique — Backend

Express 5 REST API for the Vaishnavi Designer Boutique website. Handles inquiries, blog posts, admin auth, and Cloudinary signed uploads. Persists to Turso (libSQL).

## Run

```powershell
copy .env.example .env       # fill in values
npm install
npm run dev                  # → http://localhost:4000
```

On boot, the server runs migrations and idempotent seeding (admin user + six draft blog posts). Safe to run repeatedly.

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | public | health check |
| POST | `/auth/admin/login` | public | login → `{ token, user }` |
| POST | `/inquiries` | public (rate-limited) | submit inquiry from website |
| GET | `/inquiries` | admin | list inquiries (filter by `?status=new\|contacted\|closed`) |
| GET | `/inquiries/stats` | admin | dashboard counts |
| PATCH | `/inquiries/:id` | admin | update status / notes |
| GET | `/blogs` | public | list published posts |
| GET | `/blogs/:slug` | public | single published post |
| GET | `/admin/blogs` | admin | list all (drafts + published) |
| GET | `/admin/blogs/:id` | admin | fetch single (any status) |
| POST | `/admin/blogs` | admin | create post |
| PATCH | `/admin/blogs/:id` | admin | edit / publish |
| DELETE | `/admin/blogs/:id` | admin | delete |
| POST | `/uploads/sign` | admin | Cloudinary signed upload params |

## Auth flow

1. Frontend posts `{ email, password }` to `/auth/admin/login`.
2. Server returns a JWT (`HS256`, 24h) signed with `JWT_SECRET`.
3. Frontend stores in `localStorage` for v1; sends as `Authorization: Bearer <token>` on admin requests.

## DB schema

See `src/db/migrate.ts` — three tables, all created with `IF NOT EXISTS`:
- `admin_users` — login table
- `inquiries` — public form submissions
- `blogs` — markdown content with `draft | published` status

## Seeding

`src/db/seed.ts` inserts:
- one admin user using `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (bcrypt-hashed)
- six draft blog posts targeting Lucknow long-tail SEO

Re-running is safe; existing rows are detected by email / slug.

## Reset the database

From the Turso CLI:

```bash
turso db shell vaishnavi-designer-boutiques-siddharth-debugs
> DROP TABLE inquiries; DROP TABLE blogs; DROP TABLE admin_users;
```

Then restart the server — it will re-migrate and re-seed.

## Security notes (read before going public)

- Rotate `TURSO_AUTH_TOKEN` (the one in chat history is exposed).
- Rotate `CLOUDINARY_API_SECRET`.
- Generate a fresh `JWT_SECRET` (32+ chars).
- Change `SEED_ADMIN_PASSWORD` in `.env` and re-seed.
- Consider moving JWT storage from `localStorage` (frontend) to an HTTP-only cookie once on HTTPS.
