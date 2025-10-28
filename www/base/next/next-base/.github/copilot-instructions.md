# AI contributor guide for next-base

Purpose: help AI coding agents be effective immediately in this codebase by following the actual patterns used here.

## Architecture in one glance

- App: Next.js 15 App Router under `src/app`. Root layout wraps the tree with `src/providers/index.tsx`.
- Providers stack: `QueryProvider` (TanStack Query defaults), `ThemeProvider` (next-themes), `AuthInitializer` (loads user on mount from store).
- State/auth: Zustand store in `src/lib/stores/auth.ts` persisted under key `auth-storage`; API tokens are also handled by `src/lib/api/auth.ts` (cookies, key `auth_tokens`). Prefer the Zustand + `authApi` flow; files under `src/contexts/` and `src/lib/api/index.ts` are legacy and should not be mixed.
- Permissions: `src/lib/permissions.ts` exposes `PermissionValidator`, `PERMISSIONS` and `ROLES`. UI guards are in `src/components/auth/protected-route.tsx` (`ProtectedRoute`, `ProtectedComponent`, and hooks `useHasPermission`, `useHasRole`).

## Data fetching patterns

- TanStack Query config lives in `src/providers/query-provider.tsx`:
  - queries: `staleTime=5m`, `gcTime=10m`, `retry` disabled on 401, max 3 otherwise, `refetchOnWindowFocus=false`; mutations `retry=false`.
- Use the auth-aware hooks in `src/hooks/use-auth-query.ts`:
  - `useProfile()` for profile
  - `useLogin()`, `useRegister()`, `useLogout()` as mutations
  - `useProtectedQuery()` to gate by auth; `usePermissionQuery()` to gate by permission.
- For new domains, add a service under `src/lib/api/<domain>.ts` (axios instance + interceptors like `auth.ts`) and consume via TanStack Query hooks.

## Auth flow and endpoints

- Service: `src/lib/api/auth.ts` (AuthApiService) attaches `Authorization` header and refreshes tokens on 401; base URL `${NEXT_PUBLIC_API_URL}/api/auth`.
- Tokens: set/cleared via cookies by `authApi`; Zustand store mirrors current auth state and user.
- UI: forms in `src/components/auth/*` use RHF + Zod and dispatch to store actions that call `authApi`.
- Guards: wrap pages with `ProtectedRoute` providing `permissions` (array of `{resource, action}`) and/or `roles`.

## Middleware and redirects

- Active middleware file is project root `middleware.ts`; it redirects unauthenticated users away from protected routes and away from auth routes when already authenticated.
- Note: there is also `src/middleware.ts` and multiple token keys in the repo (`auth-storage`, `auth_tokens`, `auth-tokens`). Treat `src/middleware.ts` and `src/contexts/*` as legacy. When changing auth checks, keep root `middleware.ts` as the source of truth and align the cookie/key it reads with the store/token strategy.

## Conventions to follow

- Place UI primitives in `src/components/ui/` and composed widgets in `src/components/common/*`.
- Centralize side-effectful logic in services under `src/lib/api/` and state in `src/lib/stores/`.
- Use `PERMISSIONS`/`ROLES` constants and `PermissionValidator` for access checks; prefer the provided hooks.
- Keep environment config minimal: `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:3001`), optional `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

## Dev workflows

- Install: pnpm is used (`pnpm-lock.yaml`).
- Scripts (package.json):
  - dev: `next dev`
  - build: `next build` → start: `next start`
  - lint: `biome check`, format: `biome format --write`
  - type-check: `tsc --noEmit`

## Examples you can mirror

- Protected page:
  `<ProtectedRoute permissions={[{ resource: "users", action: "read" }]} roles={["admin"]}><UsersPage/></ProtectedRoute>`
- Protected query:
  `usePermissionQuery(["users"], fetchUsers, { resource: "users", action: "read" })`

## Gotchas

- Don’t mix the legacy AuthContext (`src/contexts/auth-context.tsx`) / `api/index.ts` with the current Zustand + `authApi` stack.
- If you rely on middleware for auth, ensure the cookie/key it checks matches what your login flow sets; otherwise prefer client-side guards (`ProtectedRoute`) for fine-grained control.

Questions for maintainers: Should we standardize on a single token key and remove `src/middleware.ts` and `src/contexts/*`? If so, which key (`auth_tokens` or `auth-storage`) should middleware read?
