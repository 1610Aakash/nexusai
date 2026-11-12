# NexusAI

NexusAI is a multi-tenant customer-support SaaS foundation. Part 1 established
the marketing site, dashboard shell, shared UI, and MongoDB connection. Part 2
adds MongoDB-backed identity, secure cookie sessions, organization membership,
server-side role checks, workspace onboarding, and team invitations.

## What is implemented

### Part 1

- Responsive marketing landing page.
- Dashboard shell and demo overview with clearly labeled sample data.
- Placeholder support routes for tickets, inbox, customers, knowledge base, AI
  agents, analytics, and settings.
- Next.js App Router, TypeScript strict mode, Tailwind CSS, shadcn/ui, Lucide,
  Mongoose, and Zod.

### Part 2

- Account signup with immediate session creation, login/logout, current-user
  lookup, password recovery/reset, and safe profile editing.
- MongoDB-backed user, organization, membership, invitation, verification,
  reset-token, rate-limit, and audit-log models.
- Multi-organization memberships with organization-scoped admin/agent roles.
- Protected dashboard routes, workspace switching, four-step organization
  onboarding, and an admin-only team dashboard.
- Optional email verification plus reset and invitation email delivery using
  SMTP or a development-only email preview.

### Planned for later parts

Ticket/customer CRUD, customer-support messaging, real-time chat, knowledge
document processing, embeddings, retrieval-augmented generation (RAG), AI
agents/automation, billing, and live analytics are not implemented.

## Technology

- Next.js App Router, React, TypeScript
- Tailwind CSS, shadcn/ui, Lucide React
- MongoDB Atlas and Mongoose
- Zod, React Hook Form, bcryptjs, jose, Nodemailer
- npm, ESLint, Vitest

## Architecture

Frontend features use MVVM:

```text
src/features/
  auth/                    Login, signup, email verification, password recovery
  organizations/
    onboarding/            Multi-step organization setup
    switch-organization/   Membership-validated active workspace switcher
  profile/                 Permitted profile editing
  team/
    members/
      model/               Team API contracts and requests
      viewmodel/           Team loading and action state
      components/          Team management UI and confirmations
      view/                Team page composition
    invitations/           Invitation acceptance
  dashboard/               Dashboard overview
```

Server code is separate from frontend feature models:

```text
src/server/
  http/          Standard success/error responses and route wrappers
  models/        Mongoose schemas and indexes
  services/      Auth, organization, email, rate limiting, and transaction logic
  validators/    Zod API input validation
src/lib/auth/    JWT, cookie-session, password, and permission helpers
src/lib/mongodb.ts
```

Roles are stored on organization membership records, not on users or in JWT
claims. Every organization-owned operation resolves the authenticated user's
active membership and scopes its database query by that organization. UI
permission hiding is supplemental; route handlers and protected pages enforce
permissions independently.

## Database models

- **User:** normalized unique email, password hash, verification/active status,
  profile data, login timestamp, and token version. Password hashes and token
  version are excluded from normal selections and safe API responses.
- **Organization:** unique validated slug, owner reference, plan, active status,
  and active-admin counter used to protect the last administrator.
- **Membership:** organization-local `admin`/`agent` role and status, with a
  unique `{ organizationId, userId }` index.
- **Invitation:** organization, invited email, role, hashed random token,
  status, and expiration.
- **VerificationToken / PasswordResetToken:** hashed, expiring, single-use
  tokens with MongoDB TTL indexes and explicit application-level expiry checks.
- **RateLimit:** atomic MongoDB fixed-window counters with a TTL index.
- **AuditLog:** organization-scoped team-management events.

Organization creation and team changes use MongoDB transactions where
supported. A compensating/conditional-operation fallback is used for
standalone MongoDB deployments. For concurrent production use, MongoDB Atlas
replica-set transactions are recommended.

## Authentication and security

- Passwords are hashed with bcrypt; the password policy requires at least 12
  characters, uppercase and lowercase letters, and a number.
- Session JWTs are signed with `jose` (HS256), a minimal `sub` and token-version
  payload, an issuer, audience, and a seven-day expiry.
- Sessions use HttpOnly, SameSite=Strict cookies with Secure enabled in
  production. JWTs are not stored in localStorage.
- Password reset increments a persisted token version, invalidating prior
  sessions.
- State-changing API calls enforce same-origin checks.
- Login, signup, verification, reset, and invitation endpoints use
  MongoDB-backed rate limits.
- Verification, reset, and invitation tokens are cryptographically random;
  only SHA-256 token hashes are persisted.
- Email verification is controlled by `REQUIRE_EMAIL_VERIFICATION`. Keep it
  `false` for local development without SMTP: signup creates a verified account
  and session immediately, then sends the user to workspace onboarding. Enable
  it in production when SMTP is configured.
- Organization roles are looked up from active memberships. Agents cannot
  manage memberships or invitations. Owners cannot be removed, and membership
  changes cannot remove the last active administrator.

## API endpoints

All application API responses use:

```json
{ "success": true, "message": "Operation successful", "data": {} }
```

Errors use `{ "success": false, "message": "...", "errors": [] }` and an
appropriate HTTP status.

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create account and session; optionally send a verification email |
| POST | `/api/auth/login` | Verify credentials and set HttpOnly session cookie |
| POST | `/api/auth/logout` | Clear session and active-organization cookies |
| GET | `/api/auth/me` | Return the authenticated safe user |
| POST | `/api/auth/verify-email` | Consume a valid verification token |
| POST | `/api/auth/resend-verification` | Request verification email without account disclosure |
| POST | `/api/auth/forgot-password` | Request reset email with generic response |
| POST | `/api/auth/reset-password` | Set a new password and invalidate sessions |
| GET/PATCH | `/api/users/me` | Read or update permitted profile fields |
| GET/POST | `/api/organizations` | List memberships or create an organization/admin membership |
| GET/PATCH | `/api/organizations/current` | Read or admin-update the active organization |
| POST | `/api/organizations/switch` | Verify membership and set the active organization |
| GET | `/api/organizations/members` | List current organization members (admin) |
| PATCH/DELETE | `/api/organizations/members/:memberId` | Change member role/status or remove member (admin) |
| GET/POST | `/api/organizations/invitations` | List or create invitations (admin) |
| POST | `/api/organizations/invitations/accept` | Accept an invitation for the authenticated email |
| POST | `/api/organizations/invitations/revoke` | Revoke a pending invitation (admin) |

`GET /api/health` remains the Part 1 MongoDB health check.

## Environment setup

Requirements: Node.js 20.9+, npm, and MongoDB. For production, use MongoDB
Atlas with replica-set support.

Install dependencies and configure local environment:

```bash
npm install
Copy-Item .env.example .env.local
```

Do not overwrite an existing `.env.local`; add or update values manually.
Generate a strong session secret, for example:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

| Variable | Required | Notes |
| --- | --- | --- |
| `MONGODB_URI` | Yes for API/database features | Server-only MongoDB connection string. |
| `JWT_SECRET` | Yes for login/session verification | Must be at least 32 bytes of unpredictable secret data. Existing short values must be replaced manually. |
| `NEXT_PUBLIC_APP_URL` | Recommended | Canonical app origin used for origin checks and email links. |
| `REQUIRE_EMAIL_VERIFICATION` | No | Set to `false` for local development without SMTP; enable in production when email is configured. |
| `SMTP_HOST` | For real email | SMTP server hostname. |
| `SMTP_PORT` | For real email | SMTP port (typically 465 or 587). |
| `SMTP_USER` | For real email | SMTP account user. |
| `SMTP_PASSWORD` | For real email | SMTP account password. |
| `SMTP_FROM` | For real email | Verified sender address. |

With SMTP absent in local development, email content and verification/reset/
invitation URLs are printed as **development-only previews** in the server
console. Do not use this mode in production. In production, configure all SMTP
values; no credentials are included in this repository. Failed email delivery
is logged without exposing tokens in production logs.

## Running and testing

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Tests for validation, JWT claims/expiry, token utilities, and RBAC are in
`src/**/*.test.ts`. They do not write to a configured Atlas database. End-to-end
database flows should be exercised with a dedicated disposable test database,
not a production or shared workspace database.

## Manual walkthrough

1. Configure a test MongoDB URI and a JWT secret with at least 32 bytes.
2. Start the app using `npm run dev`, then create an account at `/signup`.
3. With `REQUIRE_EMAIL_VERIFICATION=false`, signup creates a MongoDB account,
   signs the user in immediately, and opens `/onboarding`. The creator becomes
   the organization's initial admin after completing setup.
4. From the team page, invite a separate test account, then accept the
   development preview link while signed in as that exact email.
5. Verify agent restrictions and workspace switching using accounts with
   different memberships.

The current local MongoDB and JWT values are intentionally not changed by this
setup. Ensure your local `JWT_SECRET` meets the minimum length before trying
authentication. Real SMTP delivery requires the SMTP variables above.
