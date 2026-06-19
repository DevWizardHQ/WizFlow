# AGENTS.md

This file provides guidance to AI AGENT when working with code in this repository.

## Commands

```bash
# Start dev server (opens QR for Expo Go / emulator)
npx expo start

# Run on specific platform
npx expo run:android
npx expo run:ios

# Lint (uses ESLint + Prettier)
npx expo lint

# Check for dependency/config issues
npx expo-doctor
```

There is no test suite configured. Type-check via `tsc --noEmit`.

## Architecture

**WizFlow** is a personal finance tracker built with Expo (React Native), using file-based routing via `expo-router` and a local SQLite database via `expo-sqlite` (synchronous API).

### Routing (`app/`)

`expo-router` maps the file tree directly to routes:

- `(tabs)/` — bottom-tab shell: Home (`index`), Accounts, Stats, Settings
- `transaction/add`, `transaction/[id]`, `transaction/transfer` — transaction CRUD
- `account/add`, `account/[id]`, `account/detail/[id]` — account management
- `categories/` — category list, add, edit
- `backup/`, `export/`, `import/` — data portability screens

The root `_layout.tsx` initialises the database (`runMigrations` → `seedDatabase`) on first mount and wraps the entire tree in `SettingsProvider`.

### Database (`database/`)

- `db.ts` — singleton `SQLiteDatabase` via `openDatabaseSync`
- `migrations.ts` — versioned schema migrations (current version: 2). Tables: `accounts`, `categories`, `transactions`, `settings`, `migrations`
- `operations/` — typed query helpers split by entity (`accounts.ts`, `categories.ts`, `transactions.ts`, `settings.ts`)
- All DB calls are **synchronous** (`.execSync`, `.runSync`, `.getFirstSync`, `.getAllSync`)

### State / Context (`contexts/`)

`SettingsContext` is the only global React context. It loads persisted settings from SQLite on mount and exposes `settings`, `updateSetting`, and `resetSettings`. Settings include: `theme`, `currency`/`currencySymbol`, `dateFormat`, `defaultAccountId`, `firstDayOfWeek`.

### Services (`services/`)

Thin layer over DB operations and Expo APIs:

| Service | Purpose |
|---|---|
| `analyticsService` | Income/expense summaries, category breakdowns, time-series data |
| `backupService` | Full JSON backup (accounts + categories + transactions + settings + base64 attachments) via `expo-sharing` |
| `exportService` | CSV export |
| `importService` | Restore from backup JSON |
| `restoreService` | Selective restore logic |
| `settingsService` | Read/write individual settings rows |

### Path aliases

`@/` maps to the project root (configured in `tsconfig.json`). Use `@/database`, `@/services`, `@/components`, etc. everywhere — never use relative `../` imports that cross directory boundaries.

### Types (`types/`)

All shared types re-exported from `types/database.ts`. Key types: `Account`, `Transaction`, `Category`, `TransactionType` (`'income' | 'expense' | 'transfer'`).

## Security notice

`eslint.config.js` was found to contain injected obfuscated JavaScript appended after the legitimate config. Run `git checkout eslint.config.js` to restore it and audit the environment for potential credential exposure.
