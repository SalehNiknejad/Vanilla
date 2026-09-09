export type Difficulty = "آسان" | "متوسط" | "سخت";

export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  imageUrl?: string;
  category?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  slug: string;
}

export interface Cuisine {
  id: string;
  name: string;
  slug: string;
}

export interface RecipeIngredient {
  id: string;
  ingredientId: string;
  ingredientName: string;
  amount: string;
  unit: string;
}

export interface RecipeStep {
  id: string;
  title: string;
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: Difficulty;
  cuisine: string;
  categories: string[];
  tags: string[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  isPublic: boolean;
  author: string;
  favorite: boolean;
}
