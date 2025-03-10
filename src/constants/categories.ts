
// Define subcategories for each main category
export const SUBCATEGORIES = {
  "Rocket Kits": ["Beginner", "Intermediate", "Advanced", "Educational"],
  "Engines": ["A Class", "B Class", "C Class", "D Class", "Bulk Packs"],
  "Tools": ["Launch Controllers", "Construction Tools", "Safety Equipment"],
  "Materials": ["Body Tubes", "Nose Cones", "Fins", "Parachutes"],
  "UKROC": ["Competition Kits", "Egg Lofters", "Supplies"],
  "Accessories": ["Display Stands", "Decals", "Recovery Wadding", "Books"]
};

// Map URL slugs to category names
export const CATEGORY_MAP = {
  "rocket-kits": "Rocket Kits",
  "engines": "Engines",
  "tools": "Tools",
  "materials": "Materials",
  "ukroc": "UKROC",
  "accessories": "Accessories"
};

// Export Category type
export type Category = keyof typeof SUBCATEGORIES;
