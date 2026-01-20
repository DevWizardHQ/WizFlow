# Tasks: Add Settings Screen

## Phase 1: Preferences Storage

### 1.1 Settings Service
- [x] Create `services/settingsService.ts`
- [x] Implement `getSetting(key)` - read preference
- [x] Implement `setSetting(key, value)` - save preference
- [x] Implement `getAllSettings()` - read all preferences
- [x] Implement `resetSettings()` - restore defaults

### 1.2 Settings Database Table
- [x] Add `settings` table to database schema
- [x] Key-value storage for preferences
- [x] Migration to add table

### 1.3 Settings Context
- [x] Create `contexts/SettingsContext.tsx`
- [x] Provide settings throughout app
- [x] Handle settings updates reactively

## Phase 2: Settings Screen

### 2.1 Update Settings Tab
- [x] Update `app/(tabs)/settings.tsx` with settings UI
- [x] Create grouped sections with headers
- [x] Implement list items with icons

### 2.2 Settings Sections
- [x] **Appearance Section**
  - [x] Theme selector (Light/Dark/System)
  - [x] Implement theme switching
- [x] **Defaults Section**
  - [x] Default account picker
  - [x] Base currency picker
- [x] **Preferences Section**
  - [x] Date format picker
  - [x] First day of week picker
- [x] **Data Section**
  - [x] Backup option (links to backup flow)
  - [x] Export option (links to export flow)
  - [x] Reset data option with confirmation
- [x] **About Section**
  - [x] App version
  - [x] Licenses (future)
  - [x] Rate app (future)

## Phase 3: Settings Components

### 3.1 Setting Item Components
- [x] Create `components/SettingItem.tsx` - Base setting row
- [x] Create `components/SettingToggle.tsx` - Switch setting
- [x] Create `components/SettingPicker.tsx` - Picker setting
- [x] Create `components/SettingLink.tsx` - Navigation setting

### 3.2 Theme Implementation
- [x] Update theme context to use settings
- [x] Apply theme changes immediately
- [x] Persist theme selection

## Phase 4: Data Management Options

### 4.1 Reset Data
- [x] Create reset confirmation dialog
- [x] Implement database reset
- [x] Re-seed default data after reset

### 4.2 About Screen
- [x] Create `app/about.tsx` if needed (Implemented in Settings screen)
- [x] Display app version and build
- [x] Show developer info

## Phase 5: Validation

### 5.1 Testing
- [ ] Verify all settings persist (User to verify)
- [ ] Test theme switching (User to verify)
- [ ] Test default account selection (User to verify)
- [ ] Test currency change (User to verify)
- [ ] Test data reset (User to verify)

## Dependencies
- Phase 1 must complete before Phase 2
- Phase 3 components used in Phase 2
- Phase 4 is independent

## Estimated Effort
- Phase 1: ~2 hours
- Phase 2: ~3-4 hours
- Phase 3: ~2 hours
- Phase 4: ~2 hours
- Phase 5: ~1 hour

**Total: ~10-11 hours**

