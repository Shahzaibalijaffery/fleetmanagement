# FleetLink Architecture

Production-grade car owner ↔ driver marketplace and fleet management platform.

## Monorepo Layout

```
fleetlink/
├── ARCHITECTURE.md          # This document
├── .cursor/rules/           # Cursor AI rules (mandatory compliance)
├── mobile/                  # React Native (Expo) + TypeScript
└── server/                  # Node.js + Express + TypeScript
```

---

## 1. Folder Structure

### Mobile (`mobile/src/`)

```
src/
├── app/                              # Application shell (not feature code)
│   ├── navigation/
│   │   ├── RootNavigator.tsx         # Navigation container + stack registration
│   │   ├── types.ts                  # RootStackParamList, typed routes
│   │   └── linking.ts                # Deep link config
│   ├── providers/
│   │   ├── AppProviders.tsx          # Composes all providers
│   │   └── QueryProvider.tsx         # TanStack React Query client
│   └── screens/
│       └── InitialScreen.tsx         # Bootstrap shell until auth flow exists
│
├── features/                         # Feature modules (primary unit)
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts                  # Public API — only export surface
│   ├── trips/
│   ├── fleet/
│   └── drivers/
│
├── shared/                           # Cross-feature infrastructure
│   ├── api/
│   │   ├── client.ts                 # Axios instance + interceptors
│   │   └── types.ts                  # ApiResponse, PaginatedResponse
│   ├── components/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── loading/                  # Skeleton, Shimmer, EmptyState, ErrorState
│   ├── config/
│   │   └── env.ts                    # EXPO_PUBLIC_* env access
│   ├── hooks/
│   ├── storage/
│   │   └── mmkv.ts                   # MMKV instance + key constants
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   ├── radius.ts
│   │   ├── shadows.ts
│   │   ├── useTheme.ts
│   │   └── index.ts
│   ├── types/
│   └── utils/
│       └── getErrorMessage.ts
│
└── stores/                           # Zustand — app state only
    ├── auth.store.ts
    └── ui.store.ts
```

### Server (`server/src/`)

```
src/
├── app.ts                            # Express app (middleware, routes)
├── server.ts                         # Bootstrap + DB connect + listen
├── config/
│   ├── env.ts                        # Zod-validated environment
│   └── database.ts                   # Mongoose connection
├── features/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.validation.ts
│   │   └── auth.types.ts
│   ├── trips/
│   ├── fleet/
│   └── drivers/
├── middleware/
│   ├── authenticate.ts
│   ├── authorize.ts
│   ├── validate.ts
│   └── errorHandler.ts
├── models/                           # Mongoose schemas (data shape only)
├── routes/
│   └── index.ts                      # Mounts /api/v1/* feature routes
└── shared/
    ├── errors/                       # AppError, NotFoundError, etc.
    ├── types/                        # Pagination, ApiResponse
    └── utils/
```

---

## 2. Architecture Explanation

### Style

**Feature-based modular monolith** on both mobile and server. Each domain (auth, trips, fleet, drivers) owns its folder end-to-end. Shared code lives in `shared/` only when used by 2+ features.

### Data Flow

```
Mobile:  Screen → Hook (React Query) → Service (Axios) → API
Server:  Route → Validation → Controller → Service → Repository → Model → MongoDB
```

Layers are never skipped. Controllers never call repositories. Components never call Axios.

### Mobile Layer Responsibilities

| Layer | Owns | Must NOT |
|-------|------|----------|
| `screens/` | Compose UI, wire hooks | Fetch data, business logic |
| `components/` | Presentational UI | API calls, global store access |
| `hooks/` | React Query wrappers | JSX |
| `services/` | Axios HTTP calls | React state |
| `stores/` | Session flags, theme, UI prefs | Server-fetched data |

### Server Layer Responsibilities

| Layer | Owns | Must NOT |
|-------|------|----------|
| `routes/` | HTTP mapping | Logic, DB queries |
| `controllers/` | req/res handling | Business rules, Mongoose |
| `services/` | Business logic | HTTP, direct DB in controllers |
| `repositories/` | Mongoose queries | Business rules |
| `models/` | Schema, indexes | Business logic |

### Feature Module Rules

1. Export public API via `features/{name}/index.ts` only.
2. No cross-feature deep imports.
3. Route params pass IDs — never full objects.
4. New features follow the checklist in `.cursor/rules/architecture-standards.mdc`.

---

## 3. Dependency List

### Mobile (`mobile/package.json`)

| Package | Purpose |
|---------|---------|
| `expo` | React Native toolchain |
| `react` / `react-native` | UI runtime |
| `@react-navigation/native` | Navigation core |
| `@react-navigation/native-stack` | Stack navigator |
| `react-native-screens` | Native screen primitives |
| `react-native-safe-area-context` | Safe area insets |
| `@tanstack/react-query` | Server state, caching |
| `zustand` | App/client state |
| `react-hook-form` | Form state |
| `@hookform/resolvers` | Zod resolver for RHF |
| `zod` | Runtime validation (forms) |
| `axios` | HTTP client |
| `@shopify/flash-list` | Virtualized lists |
| `react-native-mmkv` | Encrypted sync storage (tokens) |
| `expo-status-bar` | Status bar control |

**Dev:** `typescript`, `@types/react`, `babel-plugin-module-resolver`

### Server (`server/package.json`)

| Package | Purpose |
|---------|---------|
| `express` | HTTP server |
| `cors` | Cross-origin |
| `dotenv` | Environment variables |
| `mongoose` | MongoDB ODM |
| `zod` | Env + request validation |
| `jsonwebtoken` | JWT access tokens |
| `bcrypt` | Password hashing |
| `helmet` | Security headers |
| `express-rate-limit` | Rate limiting (auth routes) |

**Dev:** `typescript`, `tsx`, `nodemon`, `@types/express`, `@types/cors`, `@types/node`, `@types/jsonwebtoken`, `@types/bcrypt`

---

## 4. Theme Structure

Located in `mobile/src/shared/theme/`.

```
theme/
├── colors.ts       # lightColors + darkColors palettes
├── spacing.ts      # xs(4) → xxl(48) token scale
├── typography.ts   # heading1–3, body, caption, label
├── radius.ts       # sm, md, lg, full
├── shadows.ts      # card, modal elevations
├── useTheme.ts     # Hook: resolves palette from ui.store + system
└── index.ts        # Re-exports all tokens
```

### Rules

- **No hardcoded hex** in components — import from `useTheme().colors` or token files.
- **Light + dark** palettes defined in `colors.ts`; `ui.store` holds user preference (`light` | `dark` | `system`).
- **Spacing** via `spacing.md` etc. — screen padding defaults to `spacing.lg` (24).
- **Styles** live in sibling `.styles.ts` files — never inline (except dynamic layout values).

---

## 5. State Management Strategy

| Concern | Tool | Location |
|---------|------|----------|
| Server/API data | React Query | `features/{name}/hooks/` |
| Auth session flag | Zustand | `stores/auth.store.ts` |
| Theme preference | Zustand | `stores/ui.store.ts` |
| Access/refresh tokens | MMKV | `shared/storage/mmkv.ts` |
| Form fields | React Hook Form | Feature screens + `validation/` |

### Decision Flow

```
From API?           → React Query
Form field?         → React Hook Form
Persist locally?    → MMKV (tokens, flags)
Shared app state?   → Zustand
Component-local?    → useState
```

### React Query Defaults (`QueryProvider`)

- `staleTime`: 2 min (lists), 5 min (profiles), 30 min (config)
- `gcTime`: 10 min
- `retry`: 2 (queries), 0 (mutations)
- `refetchOnReconnect`: true

### Zustand Selectors

Always subscribe to slices: `useAuthStore((s) => s.isAuthenticated)` — never destructure entire store in components.

---

## 6. API Strategy

### Mobile

```
Screen → useTrips() [React Query] → tripService [Axios] → /api/v1/trips
```

| Piece | Location | Role |
|-------|----------|------|
| Axios client | `shared/api/client.ts` | Base URL, JWT interceptor, 401 refresh |
| Feature service | `features/{name}/services/` | Typed HTTP methods |
| Query keys | `features/{name}/hooks/` | Hierarchical cache keys |
| Hooks | `features/{name}/hooks/` | `useQuery` / `useMutation` wrappers |
| Error helper | `shared/utils/getErrorMessage.ts` | User-facing messages |

### Server

| Piece | Location | Role |
|-------|----------|------|
| Routes | `features/{name}/{name}.routes.ts` | Method + path + middleware |
| Validation | `features/{name}/{name}.validation.ts` | Zod schemas |
| Controller | `features/{name}/{name}.controller.ts` | req → service → res |
| Service | `features/{name}/{name}.service.ts` | Business logic |
| Repository | `features/{name}/{name}.repository.ts` | Mongoose queries |

### Response Envelope

```json
{ "data": T }
{ "data": T[], "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 } }
{ "error": { "code": "NOT_FOUND", "message": "..." } }
```

### Base Path

`/api/v1/`

---

## 7. Navigation Strategy

### Structure

```
app/navigation/
├── types.ts           # RootStackParamList, AuthStackParamList, etc.
├── RootNavigator.tsx  # Top-level: Auth vs Main switch
├── AuthNavigator.tsx  # Login, Register (feature screens)
├── MainNavigator.tsx  # Tab or stack for authenticated app
└── linking.ts         # Deep links
```

### Rules

- **Typed routes** — every `navigate()` call is type-checked via `RootStackParamList`.
- **Params are IDs** — `TripDetail: { tripId: string }`, not full `Trip` objects.
- **Feature screens** live in `features/{name}/screens/` — registered in navigators from `app/navigation/`.
- **Auth gate** — `RootNavigator` reads `auth.store` + MMKV token; shows Auth or Main stack.
- **No navigation in shared components** — pass `onPress` from screens.

### Navigator Hierarchy (Planned)

```
RootNavigator
├── AuthStack (unauthenticated)
│   ├── Login
│   └── Register
└── MainStack (authenticated)
    ├── MainTabs
    │   ├── TripsTab
    │   ├── FleetTab
    │   └── ProfileTab
    └── TripDetail (modal/stack)
```

---

## 8. Reusable Component Strategy

### Location

`mobile/src/shared/components/` — all generic UI primitives.

### Required Components

| Component | Folder | Variants / Props |
|-----------|--------|------------------|
| `Button` | `Button/` | primary, secondary, outline, danger, ghost; sm, md, lg; loading |
| `Input` | `Input/` | label, error, RHF Controller support |
| `Card` | `Card/` | padding tokens, optional onPress |
| `Modal` | `Modal/` | title, onClose, backdrop dismiss |
| `Skeleton` | `loading/Skeleton` | width, height, borderRadius |
| `Shimmer` | `loading/Shimmer` | animated wrapper |
| `EmptyState` | `loading/EmptyState` | icon, title, message, action |
| `ErrorState` | `loading/ErrorState` | message, onRetry |

### File Convention Per Component

```
Button/
├── Button.tsx
├── Button.styles.ts
├── Button.types.ts
└── index.ts
```

### Rules

1. **Build shared first** — before creating feature-local buttons/inputs.
2. **Theme tokens only** — colors, spacing, typography from `shared/theme/`.
3. **Domain components stay in features** — `TripCard` in `features/trips/components/`, but uses shared `Card`.
4. **Loading primitives mandatory** — every list screen uses `ListSkeleton` + `EmptyState` + `ErrorState`.
5. **Extend via variants** — add `variant` prop to `Button`, don't fork new button files.

### When to Create a New Shared Component

- Used (or will be used) in **2+ features**
- Generic enough to have no domain knowledge
- Otherwise: keep in `features/{name}/components/`

---

## Adding a New Feature

### Mobile

```
features/bookings/
  components/
  hooks/
  screens/
  services/
  types/
  index.ts
```

Register screens in `app/navigation/`. Add service methods + React Query hooks.

### Server

```
features/bookings/
  bookings.controller.ts
  bookings.service.ts
  bookings.repository.ts
  bookings.routes.ts
  bookings.validation.ts
  bookings.types.ts
```

Mount in `routes/index.ts`. Add model in `models/` if new collection.
