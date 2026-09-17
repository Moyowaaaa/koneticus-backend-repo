# Kollabs Backend

REST API for **Kollabs** (also branded as Koneticus) — a collaboration platform for creators. Users post ideas, search for people and projects, send collaboration requests, chat, and get realtime notifications.

The server is Express + TypeScript, MongoDB (Mongoose), Redis cache, Cloudinary uploads, and Socket.IO on the same origin.

Live API: [https://kollabs-backend-repo.onrender.com](https://kollabs-backend-repo.onrender.com)  
Swagger: [https://kollabs-backend-repo.onrender.com/api-docs](https://kollabs-backend-repo.onrender.com/api-docs)

---

## Stack

| Layer | Tech |
| --- | --- |
| Runtime | Node.js, TypeScript |
| HTTP | Express 5 |
| Database | MongoDB via Mongoose |
| Cache | Redis (IoRedis), optional |
| Auth | JWT cookie (`authToken`) + Bearer token |
| Realtime | Socket.IO (`chat:message`, `notification:new`) |
| Files | Multer + Cloudinary (images and raw docs) |
| Email | Resend + EJS templates |
| Docs | Swagger UI at `/api-docs` |

---

## Local setup

```bash
git clone https://github.com/Moyowaaaa/Kollabs-backend-repo.git
cd Kollabs-backend-repo
pnpm install   # or npm install
```

Create a `.env` in the repo root (see [Environment](#environment)). Then:

```bash
pnpm dev       # nodemon + ts-node, default PORT 8081 (local often uses 4000)
pnpm build     # tsc → dist/
pnpm start     # node dist/server.js
```

Other scripts: `pnpm lint`, `pnpm lint:fix`.

---

## Environment

| Variable | Required | Notes |
| --- | --- | --- |
| `PORT` | No | Default `8081` |
| `NODE_ENV` | No | `production` uses `MONGO_URI_PROD` |
| `MONGO_URI` | Yes (dev) | Development MongoDB URI |
| `MONGO_URI_PROD` | Yes (prod) | Production MongoDB URI |
| `SECRET` | Yes | JWT signing secret |
| `CLOUDINARY_CLOUD_NAME` | Yes | Uploads |
| `CLOUDINARY_API_KEY` | Yes | |
| `CLOUDINARY_API_SECRET` | Yes | |
| `RESEND_API_KEY` | Yes | Transactional email |
| `EMAIL_FROM` | No | Default Resend onboarding address |
| `FRONTEND_URL` | No | Links in emails; default `http://localhost:3000` |
| `REDIS_URL` | No | Default `redis://localhost:6379` |
| `CORS_ORIGINS` | No | Extra origins, comma-separated |

Default CORS origins include localhost:3000/3001, koneticus.com, and `https://area-52.netlify.app`.

---

## API

Base path: **`/v1/api`**. Auth is cookie `authToken` and/or `Authorization: Bearer`.

| Prefix | Module |
| --- | --- |
| `/` | Waitlist |
| `/auth` | Sign up/in/out, email verify, password reset |
| `/user` | Profile (`/me`, updates, photo, CV) |
| `/projects` | CRUD, status pipeline, search, collaborators |
| `/collaboration-requests` | Create, list mine, accept/reject |
| `/feed` | Chronological and trending feeds |
| `/notifications` | Inbox, unread count, mark read |
| `/chat` | DMs, groups, Kollaborations, messages, polls, attachments |
| `/search` | Federated people + projects (`q`, optional `role` / `skill` / `status`) |

Health: `GET /`  
Docs: `GET /api-docs`

### Project status

`draft` → `seeking_collaborators` → `ongoing` → `completed`  
(legacy `pending` is treated as seeking collaborators)

Collaboration requests are only accepted while a project is seeking collaborators.

### Search

`GET /v1/api/search?q=` (min 2 characters, or filters only).

- Keyword uses Mongo `$text` on names, bios, titles, descriptions, roles.
- Typing a role matches user `roles` and project `requiredRoles`.
- Phrases like `ongoing`, `draft`, `completed`, `seeking collaborators` match project status.
- Optional query params: `role`, `skill`, `status`, `limit`.

---

## Realtime (Socket.IO)

Same origin as the HTTP server (`/socket.io`). Authenticate with cookie `authToken` or handshake `auth.token`.

| Event | Direction | Purpose |
| --- | --- | --- |
| `conversation:join` / `leave` | client → server | Join room `conversation:{id}` |
| `chat:message` | server → room | After a message is persisted |
| `notification:new` | server → `user:{userId}` | After a notification is created |

---

## Modules

Each domain lives under `src/modules/<name>/` with routes, controller, model, interfaces, and Swagger:

`auth` · `user` · `projects` · `collaboration-requests` · `feed` · `notifications` · `chat` · `search` · `waitlist`

Entry point: `src/server.ts`.

---

## Auth

- Sign-in sets an HttpOnly cookie (`authToken`, SameSite=Lax).
- Sign-up returns a JWT; browsers should also send Bearer for cross-site (e.g. Netlify → Render).
- Protected routes use `verifyAuthentication`.

---

## Uploads

Multer → Cloudinary.

- Profile photo / CV on sign-up and profile update
- Project media
- Collaboration-request media
- Chat attachments: images plus PDF / DOC / DOCX (non-images as Cloudinary `raw`)
- Optional group avatar

---

## Logging

Winston writes to `logs/all-logs.log` (plus console). Morgan logs HTTP.

Log files are **gitignored**. Do not commit `logs/all-logs.log`.

---

## License

ISC (see `package.json`).
