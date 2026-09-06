
export type Language = 'en' | 'id';

export interface RecipeIngredient {
  name: string;
  quantityValue: number;
  quantityUnit: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
}

export interface Recipe {
  id?: number; // For IndexedDB key
  title: string;
  description: string;
  spiritType: string; // Represents the broader "beverage type" now
  skillLevel: string;
  prepTimeMinutes: number;
  fermentationTimeDays: number;
  safetyPrecautions: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  finalABV: number;
  targetVolumeLiters: number;
  equipmentUsed?: string[];

  // Beer specific
  beerStyle?: string;
  ibu?: number; // International Bitterness Units
  srm?: number; // Standard Reference Method (color)
  originalGravity?: number;
  finalGravity?: number;

  // Wine specific
  wineType?: string;

  // Nutritional Information
  caloriesPerServing?: number;
  sugarPerServingGrams?: number;
  servingSizeMl?: number;
}