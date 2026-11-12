# Database layer

The shared Mongoose connection lives in `src/lib/mongodb.ts`. Keep database
schemas in `src/server/models/`, persistence adapters in `repositories/`, and
application business logic in `services/`.
