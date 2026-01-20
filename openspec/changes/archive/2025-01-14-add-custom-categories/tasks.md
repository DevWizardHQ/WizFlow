# Tasks: Add Custom Categories

## Phase 1: Category List Screen

### 1.1 Categories Screen
- [x] Create `app/categories/index.tsx` - Categories main screen
- [x] Display expense categories section
- [x] Display income categories section
- [x] Show category icon, name, color
- [x] Add "Add Category" button per section

### 1.2 Category List Components
- [x] Create `components/CategoryItem.tsx` - Category list row
- [x] Create `components/CategorySection.tsx` - Section with header
- [x] Show edit icon for custom categories
- [x] Show "Default" badge for preset categories

## Phase 2: Add/Edit Category

### 2.1 Add Category Screen
- [x] Create `app/categories/add.tsx` - Add category form
- [x] Type selection (income/expense)
- [x] Name input field
- [x] Icon picker integration
- [x] Color picker integration
- [x] Save button with validation

### 2.2 Edit Category Screen
- [x] Create `app/categories/[id].tsx` - Edit category form
- [x] Pre-fill existing values
- [x] Allow editing name, icon, color
- [x] Prevent editing type (income/expense)
- [x] Delete button for custom categories

### 2.3 Form Components
- [x] Create `components/CategoryIconPicker.tsx` - Icon grid
- [x] Use icons from @expo/vector-icons
- [x] Organize by category (finance, general, etc.)
- [x] Highlight selected icon

## Phase 3: Icon Library

### 3.1 Define Icon Set
- [x] Create `utils/categoryIcons.ts`
- [x] Define curated list of relevant icons (~50-100)
- [x] Include finance icons (wallet, card, bank, etc.)
- [x] Include general icons (food, car, home, etc.)
- [x] Group by category for easy browsing

### 3.2 Icon Picker UI
- [x] Grid layout with scrolling
- [x] Search/filter capability (optional)
- [x] Icon name labels
- [x] Tap to select

## Phase 4: Delete Category

### 4.1 Delete Logic
- [x] Add delete confirmation dialog
- [x] Warn if transactions use this category
- [x] Option to reassign transactions
- [x] Prevent deletion of default categories

### 4.2 Reassignment
- [x] Show list of alternative categories
- [x] Update all transactions with deleted category
- [x] Handle gracefully if no transactions affected

## Phase 5: Category Order

### 5.1 Reorder Categories (Optional)
- [x] Implement drag-to-reorder
- [x] Save sort_order to database
- [x] Categories appear in picker by sort_order

## Phase 6: Integration

### 6.1 Update Category Picker
- [x] Ensure picker shows custom categories
- [x] Order by sort_order
- [x] Show custom badge if applicable

### 6.2 Link from Settings
- [x] Add "Manage Categories" in Settings
- [x] Navigate to categories screen

## Phase 7: Validation

### 7.1 Testing
- [x] Create custom expense category
- [x] Create custom income category
- [x] Edit category name and icon
- [x] Delete custom category
- [x] Verify transactions update
- [x] Verify picker updates

## Dependencies
- Phase 1 and 3 can be parallel
- Phase 2 depends on Phase 3 (icon picker)
- Phase 4 depends on Phase 1
- Phase 6 depends on Phase 2

## Estimated Effort
- Phase 1: ~2 hours
- Phase 2: ~3 hours
- Phase 3: ~2 hours
- Phase 4: ~2 hours
- Phase 5: ~2 hours (optional)
- Phase 6: ~1 hour
- Phase 7: ~1 hour

**Total: ~13-15 hours**

