# Technical decision document

This repo uses:

- [Better Auth](https://better-auth.com/) for authentication
- [Turso](https://turso.tech/) (libSQL) as the backing database for Better Auth’s store
- [Drizzle ORM](https://orm.drizzle.team/) as the ORM

Last updated: 2026-04-06
Status: Accepted

## Decisions

### Authentication: Better Auth (instead of OpenAuth)

We will use Better Auth as the application authentication layer.

**Alternatives considered**

- OpenAuth: not chosen due to the team’s preference for Better Auth’s API surface and its fit with the Turso + Drizzle stack.

**Why**

- Good TypeScript ergonomics and a modern API surface.
- Straightforward database-backed sessions and account linking.
- Works cleanly with SQL-first tooling (see Drizzle + Turso decisions below).

### Auth store / infrastructure: Turso (libSQL)

Better Auth’s persistent store (users, accounts, sessions, etc.) will live in Turso.

**Why**

- Managed SQLite (libSQL) is operationally lightweight while still being “real SQL.”
- Pairs well with edge/serverless deployment models.
- Keeps the auth data model simple and portable.

### ORM preference: Drizzle ORM

When we need an ORM/query builder, we’ll use Drizzle.

**Why**

- SQL-first and strongly typed (TypeScript) without hiding SQL behind a heavy abstraction.
- Works well with SQLite/libSQL (Turso).
- Makes schema + migrations explicit and reviewable.

## Consequences

- Database migrations should be done via Drizzle migrations.
- Turso becomes a core dependency for auth persistence; local development should include an easy path to run against a local SQLite/libSQL DB.
- Any future auth provider / session model changes should be validated against the Better Auth schema expectations.
