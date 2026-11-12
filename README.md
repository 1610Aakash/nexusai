# NexusAI

NexusAI is an AI-powered customer support automation SaaS foundation. The
project is being built in parts; this release establishes its Next.js
architecture, public landing page, dashboard shell, and MongoDB health check.

> Existing repository description: AI-powered customer support automation SaaS.

## What is included

- Responsive marketing landing page with product preview.
- Dashboard shell with responsive sidebar, active route navigation, and
  collapsible desktop navigation.
- Sample dashboard overview and clearly labeled demo content.
- Route shells for login, signup, tickets, inbox, customers, knowledge base,
  AI agents, team, analytics, and settings.
- Centralized Mongoose connection utility and `/api/health` route.
- Feature-based MVVM structure, strict TypeScript, Tailwind CSS, shadcn/ui, and
  ESLint.

## Implementation status

### Implemented in Part 1

- Next.js App Router application foundation.
- Feature-based MVVM organization and shared UI primitives.
- Marketing landing page and responsive dashboard navigation.
- Clearly labeled, static sample dashboard data.
- Placeholder routes for future product areas.
- MongoDB connection caching and API health endpoint.
- Global loading, error, and not-found states.

### Planned for later parts

Authentication, organization provisioning, authorization, ticket and customer
CRUD, real-time messaging, document ingestion and embeddings, retrieval
augmented generation (RAG), AI agents, billing, and live analytics are not
implemented in this release.

## Technology

- Next.js App Router, React, TypeScript (strict mode)
- Tailwind CSS and shadcn/ui
- Lucide React
- Next.js Route Handlers
- Mongoose and MongoDB Atlas
- Zod
- npm and ESLint

## Project structure

```text
src/
  app/
    (marketing)/             Public landing page
    (auth)/                  Login and signup shells
    (dashboard)/             Dashboard routes and shared layout
    api/health/              MongoDB-backed health endpoint
  components/
    layout/                  Shared dashboard layout components
    ui/                      shadcn/ui components
  features/
    landing/                 Marketing page MVVM
    auth/                    Login and signup MVVM
    dashboard/               Overview and dashboard shell features
    tickets/, inbox/, ...    Feature-specific MVVM modules
  lib/                       Shared utilities and MongoDB connection
  server/
    database/                Database-layer conventions
    models/                  Mongoose models (future features)
    repositories/             Persistence adapters (as needed)
    services/                Backend business logic
    validators/              Shared Zod schemas
```

Each feature keeps its frontend model, viewmodel, reusable components, and
composed view under its own directory. Backend Mongoose models are separate in
`src/server/models/`.

## Requirements

- Node.js 20.9 or newer
- npm
- A MongoDB Atlas connection string for a successful database health check

## Installation

```bash
npm install
```

Copy `.env.example` to `.env.local` if it is not already present, then set the
values described below. Never commit `.env.local`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | No | Public application URL (defaults to `http://localhost:3000` for local work). |
| `MONGODB_URI` | For database health | MongoDB Atlas connection string. Keep it server-only. |
| `JWT_SECRET` | No, reserved | Reserved for the future authentication implementation; no JWT functionality is included yet. |

No credentials are included in this repository. Add your own MongoDB Atlas URI
to `.env.local` to enable the connected health response. Without it, the health
route returns HTTP 500 and a sanitized database status.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Other useful commands:

```bash
npm run lint
npm run build
npm run start
```

## MongoDB and API health

MongoDB access is centralized in `src/lib/mongodb.ts`. The Mongoose connection
and in-flight connection promise are cached across development reloads; failed
connection attempts clear the cached promise so a later request can retry.

`GET /api/health` attempts to connect to MongoDB. A successful response is:

```json
{
  "success": true,
  "message": "NexusAI API is running",
  "database": "Connected"
}
```

If MongoDB is not configured or unavailable, the route responds with HTTP 500
and does not disclose credentials or internal connection details.

## UI component setup

shadcn/ui is initialized in `components.json`. The requested initial components
are in `src/components/ui/`: button, card, input, label, badge, avatar,
separator, dropdown-menu, sheet, skeleton, tooltip, table, dialog, and select.

