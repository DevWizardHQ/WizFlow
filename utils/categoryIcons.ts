/**
 * Category Icons - Curated list of icons for transaction categories
 * Uses Ionicons from @expo/vector-icons
 */

// Finance & Money icons
export const FINANCE_ICONS = [
  'wallet', 'cash', 'card', 'business', 'briefcase',
  'calculator', 'receipt', 'pricetag', 'pricetags',
  'trending-up', 'trending-down', 'stats-chart', 'bar-chart', 'pie-chart',
  'logo-bitcoin', 'logo-usd',
];

// Shopping & Commerce
export const SHOPPING_ICONS = [
  'cart', 'bag', 'bag-handle', 'basket', 'storefront',
  'gift', 'diamond', 'shirt', 'glasses',
];

// Food & Dining
export const FOOD_ICONS = [
  'restaurant', 'fast-food', 'pizza', 'cafe', 'beer',
  'wine', 'nutrition', 'ice-cream',
];

// Transport
export const TRANSPORT_ICONS = [
  'car', 'car-sport', 'bus', 'train', 'subway',
  'airplane', 'boat', 'bicycle', 'walk',
];

// Home & Living
export const HOME_ICONS = [
  'home', 'bed', 'tv', 'desktop', 'laptop',
  'phone-portrait', 'flash', 'water', 'flame',
  'construct', 'hammer', 'key',
];

// Health & Wellness
export const HEALTH_ICONS = [
  'medkit', 'fitness', 'heart', 'pulse', 'bandage',
  'thermometer', 'eye', 'body',
];

// Education & Work
export const EDUCATION_ICONS = [
  'school', 'library', 'book', 'reader', 'documents',
  'newspaper', 'clipboard', 'create', 'pencil',
];

// Entertainment & Leisure
export const ENTERTAINMENT_ICONS = [
  'game-controller', 'musical-notes', 'film', 'ticket',
  'headset', 'camera', 'image', 'images',
  'football', 'golf', 'tennisball',
];

// Travel & Places
export const TRAVEL_ICONS = [
  'earth', 'globe', 'map', 'navigate', 'compass',
  'location', 'trail-sign', 'bed',
];

// People & Social
export const PEOPLE_ICONS = [
  'person', 'people', 'person-add', 'happy',
  'chatbubble', 'call', 'mail', 'at',
];

// General & Misc
export const GENERAL_ICONS = [
  'star', 'bookmark', 'flag', 'ribbon', 'trophy',
  'shield-checkmark', 'checkmark-circle', 'alert-circle',
  'help-circle', 'information-circle',
  'time', 'calendar', 'alarm', 'hourglass',
  'cube', 'layers', 'folder', 'archive',
  'cloud', 'sunny', 'moon', 'leaf',
  'paw', 'cut', 'brush', 'color-palette',
  'add-circle', 'remove-circle', 'ellipsis-horizontal',
];

// All icons grouped by category
export const CATEGORY_ICON_GROUPS = [
  { name: 'Finance', icons: FINANCE_ICONS },
  { name: 'Shopping', icons: SHOPPING_ICONS },
  { name: 'Food & Dining', icons: FOOD_ICONS },
  { name: 'Transport', icons: TRANSPORT_ICONS },
  { name: 'Home', icons: HOME_ICONS },
  { name: 'Health', icons: HEALTH_ICONS },
  { name: 'Education', icons: EDUCATION_ICONS },
  { name: 'Entertainment', icons: ENTERTAINMENT_ICONS },
  { name: 'Travel', icons: TRAVEL_ICONS },
  { name: 'People', icons: PEOPLE_ICONS },
  { name: 'General', icons: GENERAL_ICONS },
];

// Flat list of all icons
export const ALL_CATEGORY_ICONS = [
  ...FINANCE_ICONS,
  ...SHOPPING_ICONS,
  ...FOOD_ICONS,
  ...TRANSPORT_ICONS,
  ...HOME_ICONS,
  ...HEALTH_ICONS,
  ...EDUCATION_ICONS,
  ...ENTERTAINMENT_ICONS,
  ...TRAVEL_ICONS,
  ...PEOPLE_ICONS,
  ...GENERAL_ICONS,
];

// Default icon for new categories
export const DEFAULT_CATEGORY_ICON = 'folder';

