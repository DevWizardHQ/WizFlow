# Spec: Categories

## ADDED Requirements

### REQ-CAT-001: Categories Screen
The app SHALL provide a screen to manage categories.

#### Scenario: View Categories
- **Given** the user navigates to categories
- **When** the screen loads
- **Then** expense categories are displayed
- **And** income categories are displayed
- **And** sections are clearly separated

#### Scenario: Category Display
- **Given** categories are displayed
- **When** viewing a category item
- **Then** it shows the category icon
- **And** it shows the category name
- **And** it shows the category color
- **And** custom categories show edit option

---

### REQ-CAT-002: Add Custom Category
The app SHALL allow creating custom categories.

#### Scenario: Navigate to Add Category
- **Given** user is on categories screen
- **When** user taps "Add Category" in expense or income section
- **Then** Add Category screen opens
- **And** category type is pre-selected based on section

#### Scenario: Category Form Fields
- **Given** Add Category screen is open
- **When** viewing the form
- **Then** the following fields are available:
  - Name (required)
  - Icon (icon picker)
  - Color (color picker)

#### Scenario: Save Custom Category
- **Given** all required fields are filled
- **When** user taps save
- **Then** the category is created with is_custom=1
- **And** user returns to categories list
- **And** new category appears in the list

---

### REQ-CAT-003: Edit Category
The app SHALL allow editing custom categories.

#### Scenario: Navigate to Edit
- **Given** a custom category exists
- **When** user taps on the category or edit button
- **Then** Edit Category screen opens
- **And** form is pre-filled with current values

#### Scenario: Edit Category Fields
- **Given** Edit Category screen is open
- **When** viewing the form
- **Then** name can be changed
- **And** icon can be changed
- **And** color can be changed
- **And** type cannot be changed

#### Scenario: Save Category Changes
- **Given** user has modified category details
- **When** user taps save
- **Then** the category is updated
- **And** changes reflect everywhere category is used

---

### REQ-CAT-004: Delete Custom Category
The app SHALL allow deleting custom categories.

#### Scenario: Delete Option
- **Given** user is editing a custom category
- **When** viewing the edit screen
- **Then** a delete option is available

#### Scenario: Delete Confirmation
- **Given** user taps delete
- **When** category has transactions
- **Then** warning shows transaction count
- **And** user can choose to reassign or delete

#### Scenario: Delete Without Transactions
- **Given** category has no transactions
- **When** user confirms delete
- **Then** category is removed
- **And** user returns to categories list

---

### REQ-CAT-005: Default Categories Protection
Default categories SHALL be protected from deletion.

#### Scenario: View Default Category
- **Given** a default category exists (is_custom=0)
- **When** user taps on it
- **Then** details are shown
- **But** edit/delete options are not available

#### Scenario: Default Category Badge
- **Given** categories are displayed
- **When** viewing default categories
- **Then** a "Default" badge is shown

---

### REQ-CAT-006: Category Icon Picker
The app SHALL provide an icon picker for categories.

#### Scenario: Open Icon Picker
- **Given** user is adding/editing a category
- **When** user taps icon field
- **Then** icon picker modal opens

#### Scenario: Icon Grid
- **Given** icon picker is open
- **When** viewing available icons
- **Then** icons are displayed in a grid
- **And** icons include finance-related options
- **And** icons include general options (food, transport, etc.)

#### Scenario: Select Icon
- **Given** icon grid is displayed
- **When** user taps an icon
- **Then** the icon is selected
- **And** picker closes
- **And** selected icon shows in form

---

### REQ-CAT-007: Category Color Picker
The app SHALL provide a color picker for categories.

#### Scenario: Open Color Picker
- **Given** user is adding/editing a category
- **When** user taps color field
- **Then** color picker appears

#### Scenario: Color Options
- **Given** color picker is open
- **When** viewing available colors
- **Then** a palette of colors is shown
- **And** colors are visually distinct

#### Scenario: Select Color
- **Given** color palette is shown
- **When** user taps a color
- **Then** the color is selected
- **And** icon preview updates with new color

---

### REQ-CAT-008: Category Sort Order
Categories SHALL maintain a display order.

#### Scenario: Default Order
- **Given** categories are displayed
- **When** viewing the list
- **Then** default categories appear first
- **And** custom categories appear after

---

### REQ-CAT-009: Category in Pickers
Custom categories SHALL appear in transaction pickers.

#### Scenario: Transaction Category Picker
- **Given** user is adding a transaction
- **When** opening category picker
- **Then** custom categories are included
- **And** categories show their custom icons and colors