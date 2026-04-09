# Agent guidelines

## Code structure

- Keep source code files to 200 lines maximum.
- Organize code by concern.
- Avoid classes unless state is essential and truly needs to be encapsulated.

## Naming and directories

- Constants use `camelCase`.
- Prefer `helpers` over `utils`.
- Never use a `lib` directory.
- Filenames use kebab-case (no exceptions).

## Errors

- Never throw a bare `Error`.
- Apps should define a `BaseError` type/class and all thrown errors should extend it.
- `BaseError` must accept a `code` property in its constructor.
- Error codes must be uppercase, underscore-delimited, and start with `ERR_` (for example, `ERR_AN_EXAMPLE`).

## TypeScript / modules / imports

- Use ESM modules with TypeScript.
- Prefer workspace import paths (for example, `@outboundiq/core`) over deep relative hops.

## Svelte / UI

- Stay on Svelte 5 with Runes; avoid legacy Svelte 3/4 patterns or API imports.
- UI primitives come from the Svelte 5 + Tailwind v4 build of `shadcn-svelte`; do not mix React or older Svelte variants.

## General principles

- Prefer DRY (Do Not Repeat Yourself).
- Prefer KISS (Keep It Simple Stupid).
- Don't over-optimize error handling/checking; use Valibot schemas for argument and parameter validation.
- Don't be over-protective; use sane, reasonable data protection and error checking/throwing.
