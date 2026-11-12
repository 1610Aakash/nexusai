# NexusAI development conventions

- Always use TypeScript and keep strict type checking enabled.
- Follow MVVM for every feature and keep features in a feature-based modular structure.
- Prefer Next.js Server Components by default; use Client Components only when interaction requires them.
- Follow Next.js App Router conventions and keep `page.tsx` files minimal.
- Keep API communication and request/response types in feature models or appropriate API clients.
- Keep UI business logic, validation orchestration, state, and event handling in ViewModels.
- Keep feature-specific reusable UI in that feature's `components/` directory.
- Keep feature views focused on composing components and connecting ViewModels.
- Keep Mongoose schemas in `src/server/models/` and backend business logic in `src/server/services/`.
- Use Zod to validate external input and use the centralized MongoDB connection in `src/lib/mongodb.ts`.
- Prefer reusable UI, Tailwind CSS, shadcn/ui, and Lucide React icons.
- Avoid unnecessary dependencies and keep code clean, readable, and maintainable.
- Never expose secrets or server-only configuration to the browser.
- Enforce organization-level data isolation for every organization-owned resource and verify permissions on the backend.
- Resolve organization roles from active memberships, never from global user claims or client-provided organization IDs.
- Use HttpOnly same-site cookies for sessions; never store session tokens in browser storage.
- Hash passwords and one-time tokens before storing them. Check token expiry and single-use status in application code in addition to TTL indexes.
