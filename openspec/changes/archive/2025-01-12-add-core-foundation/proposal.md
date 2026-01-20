# Proposal: Add Core Foundation

## Change ID
`add-core-foundation`

## Summary
Establish the foundational architecture for the WizFlow personal finance tracker app, including database setup with SQLite, core data models, and the base navigation structure.

## Motivation
The project currently contains only the default Expo starter template. To build the finance tracker described in `project.md`, we need to establish:
1. SQLite database schema and initialization
2. Core data operations (CRUD)
3. Base navigation structure with tabs
4. Theme and styling foundation

## Scope
This change covers Phase 1 prerequisites:
- Database layer (`database/` folder)
- Core types and interfaces (`types/` folder)  
- Constants and configuration (`utils/constants.ts`)
- Tab navigation setup (Home, Accounts, Stats, Settings)
- Root layout with SQLite provider

## Dependencies
- `expo-sqlite` (already installed)
- `@expo/vector-icons` (already installed)

## Risks
- **SQLite initialization timing**: Ensure database is ready before UI renders
- **Migration management**: Plan for future schema changes from the start

## Success Criteria
- [x] App launches with SQLite database initialized
- [x] Four tabs visible (Home, Accounts, Stats, Settings)
- [x] Database tables created successfully
- [x] Type definitions match project.md schema

## Related Specs
- `specs/database/spec.md` - Database operations
- `specs/navigation/spec.md` - Navigation structure

