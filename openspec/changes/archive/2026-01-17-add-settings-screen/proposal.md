# Proposal: Add Settings Screen

## Change ID
`add-settings-screen`

## Summary
Implement the Settings screen with app preferences, theme selection, default account configuration, and data management options.

## Motivation
Users need to customize the app to their preferences:
- Theme (light/dark/system)
- Default currency and account
- Date format preferences
- Data management (backup, export, reset)

## Scope
- Settings screen with grouped options
- Theme picker (Light/Dark/System)
- Default account selector
- Base currency selector
- Date format options
- About section

## Prerequisites
- `add-core-foundation` change completed
- `add-account-management` change completed

## Dependencies
- `expo-constants` for app version
- `useColorScheme` hook

## Risks
- **Settings persistence**: Need to store preferences reliably
- **Theme switching**: Must update all screens instantly

## Success Criteria
- [ ] Settings screen displays all options
- [ ] Theme change takes effect immediately
- [ ] Default account selection persists
- [ ] Currency selection works
- [ ] About section shows app info

## Related Specs
- `specs/settings/spec.md` - Settings UI/UX

