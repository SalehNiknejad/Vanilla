import {
  categories as mockCategories,
  ingredients as mockIngredients,
  recipes as mockRecipes,
} from "./mockData";
import { supabase } from "./supabase";
import {
  Category,
  Ingredient,
  Recipe,
  RecipeIngredient,
  RecipeStep,
} from "../types";

const fallbackRecipes = mockRecipes;
const fallbackIngredients = mockIngredients;
const fallbackCategories = mockCategories;

const hasSupabaseConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_URL !== "https://demo.supabase.co",
);

const toRecipe = (row: Record<string, unknown>): Recipe => {
  const ingredients = Array.isArray(row.ingredients) ? row.ingredients : [];
  const categories = Array.isArray(row.categories) ? row.categories : [];
  const steps = Array.isArray(row.steps) ? row.steps : [];
  const cuisineEntry = Array.isArray(row.cuisines)
    ? (row.cuisines[0] as Record<string, unknown> | undefined)
    : undefined;
  const cuisineName =
    typeof cuisineEntry?.name === "string" ? cuisineEntry.name : "ایرانی";

  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? "بدون عنوان"),
    slug: String(row.slug ?? ""),
    description: String(row.description ?? ""),
    imageUrl: String(
      row.image_url ??
        row.imageUrl ??
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
    ),
    prepTime: Number(row.prep_time ?? row.prepTime ?? 0),
    cookTime: Number(row.cook_time ?? row.cookTime ?? 0),
    servings: Number(row.servings ?? 1),
    difficulty: (row.difficulty as Recipe["difficulty"]) ?? "آسان",
    cuisine: String(row.cuisine ?? cuisineName),
    categories: categories.map((item) =>
      String((item as Record<string, unknown>).name ?? item),
    ),
    tags: Array.isArray(row.tags) ? row.tags.map((item) => String(item)) : [],
    ingredients: ingredients.map((item) => {
      const entry = item as Record<string, unknown>;
      return {
        id: String(entry.id ?? ""),
        ingredientId: String(entry.ingredient_id ?? entry.ingredientId ?? ""),
        ingredientName: String(
          entry.ingredient_name ?? entry.ingredientName ?? entry.name ?? "ماده",
        ),
        amount: String(entry.amount ?? "1"),
        unit: String(entry.unit ?? "عدد"),
      } satisfies RecipeIngredient;
    }),
    steps: steps.map((item, index) => {
      const entry = item as Record<string, unknown>;
      return {
        id: String(entry.id ?? `${index + 1}`),
        title: String(entry.title ?? `مرحله ${index + 1}`),
        description: String(entry.description ?? ""),
      } satisfies RecipeStep;
    }),
    isPublic: Boolean(row.is_public ?? row.isPublic ?? true),
    author: String(row.author ?? "Vanilla User"),
    favorite: Boolean(row.favorite ?? false),
  };
};

export async function fetchCategories(): Promise<Category[]> {
  if (!hasSupabaseConfig) return fallbackCategories;

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });
    if (error || !data) throw error ?? new Error("No categories found");

    return data.map((item) => ({
      id: String(item.id),
      name: String(item.name),
      emoji: "🍽️",
      slug: String(item.slug ?? item.name),
    }));
  } catch (error) {
    console.error("fetchCategories failed:", error);
    return fallbackCategories;
  }
}

export async function fetchIngredients(): Promise<Ingredient[]> {
  if (!hasSupabaseConfig) return fallbackIngredients;

  try {
    const { data, error } = await supabase
      .from("ingredients")
      .select("*")
      .order("created_at", { ascending: true });
    if (error || !data) throw error ?? new Error("No ingredients found");

    return data.map((item) => ({
      id: String(item.id),
      name: String(item.name),
      emoji: "🥕",
      imageUrl: item.image_url ? String(item.image_url) : undefined,
      category: item.category ? String(item.category) : undefined,
    }));
  } catch (error) {
    console.error("fetchIngredients failed:", error);
    return fallbackIngredients;
  }
}

export async function fetchRecipes(): Promise<Recipe[]> {
  if (!hasSupabaseConfig) return fallbackRecipes;

  try {
    const { data, error } = await supabase
      .from("recipes")
      .select(
        `
        id,
        title,
        slug,
        description,
        image_url,
        prep_time,
        cook_time,
        servings,
        difficulty,
        is_public,
        steps,
        recipe_ingredients (
          id,
          amount,
          unit,
          ingredient_id,
          ingredients (id, name)
        ),
        recipe_categories (
          categories (id, name, slug)
        ),
        recipe_cuisines (
          cuisines (id, name, slug)
        )
      `,
      )
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error || !data) throw error ?? new Error("No recipes found");

    return data.map((row) => {
      const source = row as Record<string, unknown>;
      const ingredients = Array.isArray(source.recipe_ingredients)
        ? source.recipe_ingredients
        : [];
      const categories = Array.isArray(source.recipe_categories)
        ? source.recipe_categories
        : [];
      const cuisines = Array.isArray(source.recipe_cuisines)
        ? source.recipe_cuisines
        : [];
      return toRecipe({
        ...source,
        imageUrl: source.image_url,
        prepTime: source.prep_time,
        cookTime: source.cook_time,
        isPublic: source.is_public,
        ingredients: ingredients.map((entry) => {
          const current = entry as Record<string, unknown>;
          const ingredientData = current.ingredients as
            | Record<string, unknown>
            | undefined;
          return {
            id: String(current.id ?? ""),
            ingredient_id: String(
              current.ingredient_id ?? ingredientData?.id ?? "",
            ),
            ingredient_name: String(ingredientData?.name ?? "ماده"),
            amount: String(current.amount ?? "1"),
            unit: String(current.unit ?? "عدد"),
          };
        }),
        categories: categories.map(
          (entry) =>
            (entry as Record<string, unknown>).categories as Record<
              string,
              unknown
            >,
        ),
        cuisine: cuisines[0]
          ? (
              (cuisines[0] as Record<string, unknown>).cuisines as Record<
                string,
                unknown
              >
            )?.name
          : "ایرانی",
        tags: [],
        steps: Array.isArray(source.steps) ? source.steps : [],
      });
    });
  } catch (error) {
    console.error("fetchRecipes failed:", error);
    return fallbackRecipes;
  }
}

export async function fetchRecipeBySlug(slug: string): Promise<Recipe | null> {
  if (!hasSupabaseConfig) {
    return mockRecipes.find((recipe) => recipe.slug === slug) ?? null;
  }

  try {
    const { data, error } = await supabase
      .from("recipes")
      .select(
        `
        id,
        title,
        slug,
        description,
        image_url,
        prep_time,
        cook_time,
        servings,
        difficulty,
        is_public,
        steps,
        recipe_ingredients (
          id,
          amount,
          unit,
          ingredient_id,
          ingredients (id, name)
        ),
        recipe_categories (
          categories (id, name, slug)
        ),
        recipe_cuisines (
          cuisines (id, name, slug)
        )
      `,
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data)
      return mockRecipes.find((recipe) => recipe.slug === slug) ?? null;

    return toRecipe({
      ...data,
      imageUrl: data.image_url,
      prepTime: data.prep_time,
      cookTime: data.cook_time,
      isPublic: data.is_public,
      ingredients: (
        ((data as Record<string, unknown>).recipe_ingredients as unknown[]) ??
        []
      ).map((item) => {
        const entry = item as Record<string, unknown>;
        const ingredientData = entry.ingredients as
          | Record<string, unknown>
          | undefined;
        return {
          id: String(entry.id ?? ""),
          ingredient_id: String(
            entry.ingredient_id ?? ingredientData?.id ?? "",
          ),
          ingredient_name: String(ingredientData?.name ?? "ماده"),
          amount: String(entry.amount ?? "1"),
          unit: String(entry.unit ?? "عدد"),
        };
      }),
      categories: (
        ((data as Record<string, unknown>).recipe_categories as unknown[]) ?? []
      ).map((item) => {
        const current = item as Record<string, unknown>;
        return current.categories as Record<string, unknown>;
      }),
      cuisine: (
        (((data as Record<string, unknown>).recipe_cuisines as unknown[]) ??
          [])[0] as Record<string, unknown>
      )?.cuisines
        ? ((
            (
              (((data as Record<string, unknown>)
                .recipe_cuisines as unknown[]) ?? [])[0] as Record<
                string,
                unknown
              >
            ).cuisines as Record<string, unknown>
          )?.name ?? "ایرانی")
        : "ایرانی",
      steps: Array.isArray((data as Record<string, unknown>).steps)
        ? ((data as Record<string, unknown>).steps as unknown[])
        : [],
    });
  } catch (error) {
    console.error("fetchRecipeBySlug failed:", error);
    return mockRecipes.find((recipe) => recipe.slug === slug) ?? null;
  }
}
