import * as v from 'valibot';

export const RECIPE_LIMITS = {
  title: { minChars: 2, maxChars: 35 },
  description: { minChars: 10, maxChars: 150 },
  references: { maxCount: 5, minChars: 10, maxChars: 50 },
  imageUrl: { minChars: 10, maxChars: 150 },
  mealTypes: { minCount: 1, maxCount: 10 },
  servings: { minValue: 1, maxValue: 50 },
  yield: { minChars: 5, maxChars: 20 },
  activeTime: { minChars: 1, maxChars: 10 },
  inactiveTime: { minChars: 1, maxChars: 10 },
  customCuisine: { minChars: 2, maxChars: 35 },
  generalNotes: { maxCount: 3, minChars: 20, maxChars: 150 },
  ingredients: { 
    minCount: 1,
    maxCount: 40, 
    minChars: 2, 
    maxChars: 100, 
    notes: {
      maxCount: 3,
      minChars: 20,
      maxChars: 150
    }
  },
  instructions: {
    minCount: 1,
    maxCount: 20,
    minChars: 5,
    maxChars: 250,
    notes: {
      maxCount: 3,
      minChars: 20,
      maxChars: 150
    }
  },
} as const;

const minMaxString = (name: string, min: number, max: number) => {
  return v.pipe(
    v.string(`${name} must be valid text`), 
    v.trim(),
    v.minLength(min, `${name} must be at least ${min} characters long`),
    v.maxLength(max, `${name} cannot be more than ${max} characters long`
    )
  )
}

const TimeSchema = v.object({
  input: v.pipe(
    v.string("You must enter a time"),
    v.check((value) =>
      /^\s*-?\d+\s*(-\s*-?\d+\s*)?$/.test(value),
      "Time must be a number (e.g. 20) or a range (e.g. 20-40)"
    ),
    v.transform((value) => {
      const [a, b] = value.replace(/\s+/g, '').split('-');

      const start = parseInt(a, 10);
      const end = b === undefined ? start : parseInt(b, 10);

      return {
        starting: Math.min(start, end),
        ending: Math.max(start, end),
      };
    }),
    v.check(({ starting, ending }) => {
      if (!Number.isInteger(starting) || !Number.isInteger(ending)) return false;
      if (starting === 0 || ending === 0) return false;
      return true;
    })
  ),
  unit: v.picklist([
    "minute",
    "hour",
    "day",
    "week"
  ])
});
export const RecipeSchema = v.pipe(v.object({
  title: minMaxString("Title", RECIPE_LIMITS.title.minChars, RECIPE_LIMITS.title.maxChars),
  description: minMaxString("Description", RECIPE_LIMITS.description.minChars, RECIPE_LIMITS.description.maxChars),
  references: v.pipe(
    v.array(minMaxString("References", RECIPE_LIMITS.references.minChars, RECIPE_LIMITS.references.maxChars)),
    v.maxLength(
      RECIPE_LIMITS.references.maxCount,
      `There cannot be more than ${RECIPE_LIMITS.references.maxCount} references`
    )
  ),
  image: v.object({
    isUrlTab: v.boolean(),
    url: minMaxString("Image URL", RECIPE_LIMITS.imageUrl.minChars, RECIPE_LIMITS.imageUrl.maxChars)
  }),
  difficulty: v.picklist([
    "very_easy",
    "easy",
    "moderate",
    "hard",
    "very_hard",
    "nightmare"
  ], "Select one of the difficulties"),
  mealTypes: v.pipe(
    v.array(v.picklist([
      "breakfast",
      "brunch",
      "lunch",
      "dinner",
      "snack",
      "dessert",
      "drink",
      "side",
      "appetizer",
      "condiment"
    ])),
    v.minLength(RECIPE_LIMITS.mealTypes.minCount),
    v.maxLength(RECIPE_LIMITS.mealTypes.maxCount)
  ),
  servings: v.pipe(
    v.number("Servings is required"),
    v.integer("Servings must be an integer; decimal values are not allowed"),
    v.minValue(
      RECIPE_LIMITS.servings.minValue,
      `Servings value be lower than ${RECIPE_LIMITS.servings.minValue}`
    ),
    v.maxValue(
      RECIPE_LIMITS.servings.maxValue,
      `Servings value cannot exceed ${RECIPE_LIMITS.servings.maxValue}`
    )
  ),
  yield: v.optional(minMaxString("Yield", RECIPE_LIMITS.yield.minChars, RECIPE_LIMITS.yield.maxChars)),
  activeTime: TimeSchema,
  inactiveTime: TimeSchema,
  cuisineSelectionPath: v.pipe(
    v.array(v.pipe(v.number("Array must hold numbers"), v.integer("Array must hold integers"))),
    v.transform((cuisineIds) => cuisineIds.at(-1))
  ),
  customCuisine: v.nullable(
    minMaxString(
      "Custom cuisine", 
      RECIPE_LIMITS.customCuisine.minChars,
      RECIPE_LIMITS.customCuisine.maxChars
    )
  ),
  generalNotes: v.pipe(
    v.array(v.object({
      text: minMaxString("General note", RECIPE_LIMITS.generalNotes.minChars, RECIPE_LIMITS.generalNotes.maxChars),
      isImportant: v.boolean()
    })),
    v.maxLength(RECIPE_LIMITS.generalNotes.maxCount)
  ),
  ingredients: v.pipe(
    v.array(v.object({
      text: minMaxString("Ingredient", RECIPE_LIMITS.ingredients.minChars, RECIPE_LIMITS.ingredients.maxChars),
      notes: v.array(
        minMaxString("Note", RECIPE_LIMITS.ingredients.notes.minChars, RECIPE_LIMITS.ingredients.notes.maxChars)
      )
    })),
    v.minLength(
      RECIPE_LIMITS.ingredients.minCount,
      `There must be at least ${RECIPE_LIMITS.ingredients.minCount} ingredients`
    ),
    v.maxLength(
      RECIPE_LIMITS.ingredients.maxCount,
      `There cannot be more than ${RECIPE_LIMITS.ingredients.maxChars} ingredients`
    )
  ),
  instructions: v.pipe(
    v.array(v.object({
      text: minMaxString("Instruction", RECIPE_LIMITS.instructions.minChars, RECIPE_LIMITS.instructions.maxChars),
      notes: v.array(
        minMaxString("Note", RECIPE_LIMITS.instructions.notes.minChars, RECIPE_LIMITS.instructions.notes.maxChars)
      )
    })),
    v.minLength(
      RECIPE_LIMITS.instructions.minCount,
      `There must be at least ${RECIPE_LIMITS.instructions.minCount} instructions`
    ),
    v.maxLength(
      RECIPE_LIMITS.instructions.maxCount,
      `There cannot be more than ${RECIPE_LIMITS.instructions.maxChars} instructions`
    )
  ),
}),
v.check((recipe) => 
  recipe.cuisineSelectionPath !== undefined ||
  recipe.customCuisine !== null,
  "You must either select a cuisine or enter a custom one"
),
v.transform(({ cuisineSelectionPath, customCuisine, ...rest }) => {
  if (customCuisine !== null) {
    return {
      cuisine: {
        type: "custom" as const,
        text: customCuisine
      },
      ...rest
    }
  }
  return {
    cuisine: {
      type: "existing" as const,
      id: cuisineSelectionPath
    },
    ...rest
  }
})
);

export type RecipePrimitive = {
  title: string
  description: string
  references: string[]
  image: { isUrlTab: boolean, url: string }
  difficulty: string
  mealTypes: string[]
  servings: number | null
  yield: string
  activeTime: { input: string, unit: string }
  inactiveTime: { input: string, unit: string }
  cuisineSelectionPath: number[]
  customCuisine: string | null
  generalNotes: { text: string, isImportant: boolean }[]
  ingredients: { text: string, notes: string[] }[]
  instructions: { text: string, notes: string[] }[]
}

export const sanitizeRecipe = (recipe: RecipePrimitive) => {
  recipe.references = recipe.references.filter((ref) => ref.length > 0);
  recipe.generalNotes = recipe.generalNotes.filter(
    (note) => note.text.length > 0,
  );
  recipe.ingredients = recipe.ingredients.filter(
    (ingredient) => ingredient.text.length > 0,
  );
  recipe.ingredients = recipe.ingredients.map(({ text, notes }) => {
    return {
      text,
      notes: notes.filter((note) => note.length > 0),
    };
  });
  recipe.instructions = recipe.instructions.filter(
    (instruction) => instruction.text.length > 0,
  );
  recipe.instructions = recipe.instructions.map(({ text, notes }) => {
    return {
      text,
      notes: notes.filter((note) => note.length > 0),
    };
  });
}

export type Errors = Record<string, string[]>;

export const getErrors = (path: string, errors: Errors) => {
  return errors[path] ?? [];
}

export const getAllErrors = (pattern: string, errors: Errors) => {
  const escaped = pattern.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
  const regexPattern = escaped.replace(/%/g, "\\d+");
  const regex = new RegExp(`^${regexPattern}$`);
  return Object.entries(errors)
    .filter(([key]) => regex.test(key))
    .flatMap(([, messages]) => messages);
}