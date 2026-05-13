# Monorepo Structure

This repository is being migrated into a monorepo structure.

apps/
web/ # Existing React + Vite web dashboard
mobile/ # React Native mobile app (Expo)

packages/
shared/ # Cross-platform shared logic only

The mobile app is intended primarily for store owners (점주) to monitor events, alerts, and store status in real time.

---

# Shared Code Rules

Only platform-independent logic should be shared.

Recommended shared areas:

- api
- types
- utils
- constants
- queryKeys
- business logic
- pure hooks without DOM dependencies

Do NOT aggressively share UI components between web and mobile.

Avoid placing these inside shared:

- web-specific UI
- React Native UI
- layouts
- navigation
- DOM-dependent hooks
- browser APIs

Web and mobile should maintain separate UI implementations.

---

# React Native Stack

Mobile app stack:

- React Native
- Expo (prebuild)
- EAS
- NativeWind v4
- React Navigation
- Zustand
- TanStack Query

---

# State Management Rules

TanStack Query:

- server state only

Examples:

- API responses
- remote entities
- loading/error states
- caching
- mutations

Zustand:

- client/UI state only

Examples:

- modal state
- selected filters
- tab state
- temporary UI state
- app-level UI preferences

Avoid storing server-fetched entities in Zustand unless explicitly necessary.

---

# Styling Rules

Web:

- Tailwind CSS v4
- semantic design tokens

Mobile:

- NativeWind v4
- shared semantic token naming

Never hardcode color values.

Always prefer semantic token-based styling.

Examples:

- bg-monitor-bg
- text-event-critical
- border-monitor-border

---

# React Native Development Guidelines

Do not implement React Native code using web mental models.

Prefer:

- FlatList for large lists
- reusable hooks
- token-based styling
- platform-aware components
- separation of business logic and UI

Avoid:

- DOM-specific logic
- browser APIs
- excessive useEffect usage
- over-sharing UI between platforms

---

# Migration Principles

The migration should follow:

1. Analysis
2. Architecture design
3. Shared logic extraction
4. Feature-by-feature migration

Avoid generating the entire mobile app at once.

Prioritize:

- maintainability
- scalability
- clear separation between web and mobile
- stable shared architecture
