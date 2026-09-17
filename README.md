# DocVault — Phase 1

A private personal and family document vault. **Phase 1 is implemented:** account authentication, dashboard, private local development storage, document upload/listing/detail preview/download/soft-delete, categories, and nested folders. Later-phase controls (sharing, OCR, alerts, family vault, and archive) are intentionally not presented as complete functionality.

## Architecture

- **React + Vite client**: responsive application shell, authenticated routes, forms, drag-and-drop upload and API client.
- **Express API**: validation, authentication/authorization, upload filtering, document streaming, category/folder CRUD, and dashboard aggregation.
- **MongoDB**: metadata only. File data is held by the `StorageService`; Phase 1 includes a local private driver for development. The storage abstraction is the migration point for S3-compatible object storage before production.
- **Security boundary**: the browser receives a short-lived JWT only after registration/login. Protected routes require the bearer token; document streams perform an owner check before serving bytes. Passwords are bcrypt hashes. Helmet, CORS allowlisting, rate limits, input validation, MIME/extension allowlisting, and file size limits are enabled.

> This is a secure-development baseline, not a claim of complete security. Production should use managed private object storage, TLS, HttpOnly refresh-token/session strategy, malware scanning, audit trails, monitoring, key rotation, and independent security review.

## Repository layout

```text
DocVault/
├── backend/src/
│   ├── config/ controllers/ middleware/ models/ routes/ services/ utils/
│   ├── uploads/                 # ignored private development files
│   └── server.js
├── frontend/src/
│   ├── components/ context/ layouts/ pages/ services/ utils/
│   └── main.jsx
├── .env.example
└── package.json
```

## Data schema (Phase 1)

| Collection | Essential fields / relationships |
| --- | --- |
| `users` | `name`, unique lowercase `email`, `passwordHash`, profile timestamps |
| `categories` | owner `user`, `name`, `color`, optional `systemKey`, uniqueness per owner/name |
| `folders` | owner `user`, `name`, optional `parentFolder` self-reference, optional `category` |
| `documents` | owner `user`, category/folder refs, metadata, storage key, MIME/size, dates, `isDeleted`, `deletedAt` |

Planned collections for later phases: `FamilyMember`, `SharedDocument`, `Notification`, `ActivityLog`, `Checklist`, and `ChecklistItem`.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login` | Create an account / authenticate |
| GET | `/api/auth/me` | Authenticated profile |
| GET | `/api/dashboard` | Phase 1 document/storage summary |
| GET/POST | `/api/categories` | List/create categories |
| GET/POST | `/api/folders` | List/create folders (`parentFolder` optional) |
| GET/POST | `/api/documents` | List documents / multipart upload |
| GET/PATCH/DELETE | `/api/documents/:id` | Detail, edit metadata, soft-delete |
| GET | `/api/documents/:id/download` | Owner-authorized inline/download stream |

## Authentication flow

1. User registers or logs in through an input-validated API request.
2. The server bcrypt-hashes new passwords and signs a time-limited JWT.
3. The client retains the token for the active browser session and attaches it as a Bearer token.
4. `requireAuth` verifies the token, loads the user, and each resource controller filters/checks `user` ownership.
5. Logout clears the client session. Changing/resetting passwords and durable server-side session revocation are intentionally scheduled after Phase 1.

## Install and run

```bash
cp .env.example .env
# set JWT_SECRET to a long random value and configure MONGODB_URI
npm install
npm run dev
```

Visit `http://localhost:5173`. The API runs on `http://localhost:5000`.

## Environment requirements

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | 32+ character signing secret; never commit it |
| `PORT` | No | API port, defaults to 5000 |
| `JWT_EXPIRES_IN` | No | JWT TTL, defaults to `1d` |
| `CLIENT_URL` | Yes | Exact allowed web origin for CORS |
| `MAX_FILE_SIZE_MB` | No | Upload limit, defaults to 15 MB |
| `VITE_API_URL` | Yes | Browser-visible API base URL |
