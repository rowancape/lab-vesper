import z from "zod";

export const RECIPE_LIMITS = {
  name: { min: 2, max: 60 },
  desc: { min: 10, max: 150 },
  reference: { min: 5, max: 80 },
  servings: { max: 30, maxDigits: 2 },
  duration: { max: 2880 },

  ingredient: { min: 2, max: 60, minCount: 1, maxCount: 30 },
  instruction: { min: 2, max: 250, minCount: 1, maxCount: 30 },

  note: { min: 5, max: 150, maxCount: 3 },

  cuisine: { min: 2, max: 35 }
} as const;

const CookingTimeSchema = z
  .string()
  .trim()
  .regex(/^\d+\s*(-\s*\d+)?$/, "Must be a number or range like 30-45")
  .transform((val) => {
    if (val.includes("-")) {
      const [min, max] = val.split("-").map(v => Number(v.trim()));
      if (Number.isNaN(min) || Number.isNaN(max)) {
        throw new Error("Invalid number");
      }
      return { min, max };
    }
    const num = Number(val);
    if (Number.isNaN(num)) {
      throw new Error("Invalid number");
    }
    return { min: num, max: num };
  })
  .refine((val) => val.min <= val.max, {
    message: "Left side must be less than right side"
  })
  .refine((val) => val.max <= RECIPE_LIMITS.duration.max, {
    message: `Cooking time cannot exceed ${RECIPE_LIMITS.duration.max} minutes`
  });

const IngredientSchema = z.object({
  text: z.string()
    .trim()
    .min(
      RECIPE_LIMITS.ingredient.min,
      { error: `Ingredient must have at least ${RECIPE_LIMITS.ingredient.min} characters` }
    )
    .max(
      RECIPE_LIMITS.ingredient.max,
      { error: `Ingredient cannot have more than ${RECIPE_LIMITS.ingredient.max} characters` }
    ),
  notes: z.array(
    z.string()
      .trim()
      .min(
        RECIPE_LIMITS.note.min,
        { error: `Note must have at least ${RECIPE_LIMITS.note.min} characters` }
      )
      .max(
        RECIPE_LIMITS.note.max,
        { error: `Note cannot have more than ${RECIPE_LIMITS.note.max} characters` }
      )
  ).max(
    RECIPE_LIMITS.note.maxCount,
    { error: `There cannot be more than ${RECIPE_LIMITS.note.max - 1} notes` }
  ).optional()
});

const InstructionSchema = z.object({
  text: z.string()
    .trim()
    .min(
      RECIPE_LIMITS.instruction.min,
      { error: `Instruction must have at least ${RECIPE_LIMITS.instruction.min} characters` }
    )
    .max(
      RECIPE_LIMITS.instruction.max,
      { error: `Instruction cannot have more than ${RECIPE_LIMITS.instruction.max} characters` }
    ),
  notes: z.array(
    z.string()
      .trim()
      .min(
        RECIPE_LIMITS.note.min,
        { error: `Note must have at least ${RECIPE_LIMITS.note.min} characters` }
      )
      .max(
        RECIPE_LIMITS.note.max,
        { error: `Note cannot have more than ${RECIPE_LIMITS.note.max} characters` }
      )
  ).max(
    RECIPE_LIMITS.note.maxCount, 
    { error: `There cannot be more than ${RECIPE_LIMITS.note.max - 1} notes` }
  ).optional()
});

export const RecipeSchema = z.object({
  name: z.string()
    .trim()
    .min(RECIPE_LIMITS.name.min, { error: `Name must be at least ${RECIPE_LIMITS.name.min} characters long` })
    .max(RECIPE_LIMITS.name.max, { error: `Name must be less than ${RECIPE_LIMITS.name.max} characters long` }),
  desc: z.string()
    .trim()
    .min(RECIPE_LIMITS.desc.min, { error: `Description must be at least ${RECIPE_LIMITS.desc.min} characters long` })
    .max(RECIPE_LIMITS.desc.max, { error: `Description must be less than ${RECIPE_LIMITS.desc.max} characters long` }),
  reference: z.string()
    .trim()
    .min(
      RECIPE_LIMITS.reference.min, 
      { error: `Reference must be at least ${RECIPE_LIMITS.reference.min} characters long` }
    )
    .max(
      RECIPE_LIMITS.reference.max,
      { error: `Reference must be less than ${RECIPE_LIMITS.reference.max} characters long` }
    ),
  servings: z.coerce.number<string>()
    .int({ error: "Servings must be an integer" })
    .positive({ error: "Servings cannot be a negative number" })
    .max(
      RECIPE_LIMITS.servings.max, 
      { error: `Servings cannot be more than ${RECIPE_LIMITS.servings.maxDigits} digits long` }
    ),
  cuisine: z.string()
    .trim()
    .min(
      RECIPE_LIMITS.cuisine.min,
      { error: `Cuisine must be at least ${RECIPE_LIMITS.cuisine.min} characters long` }
    )
    .max(
      RECIPE_LIMITS.cuisine.max,
      { error: `Cuisine must be less than ${RECIPE_LIMITS.cuisine.max} characters long` }
    ),
  ingredients: z.array(IngredientSchema)
    .min(
      RECIPE_LIMITS.ingredient.minCount,
      { error: `There has to be at least ${RECIPE_LIMITS.ingredient.minCount} ingredients` }
    )
    .max(
      RECIPE_LIMITS.ingredient.maxCount,
      { error: `There cannot be more than ${RECIPE_LIMITS.ingredient.maxCount} ingredients` }
    ),
  instructions: z.array(InstructionSchema)
    .min(
      RECIPE_LIMITS.instruction.minCount,
      { error: `There has to be at least ${RECIPE_LIMITS.instruction.minCount} instructions` }
    )
    .max(
      RECIPE_LIMITS.instruction.maxCount,
      { error: `There cannot be more than ${RECIPE_LIMITS.instruction.maxCount} instructions` }
    ),
  
  diff: z.enum(
    ["very_easy", "easy", "moderate", "hard", "very_hard", "nightmare"],
    { error: "You must select one of the difficulties" }
  ),
  activeTime: CookingTimeSchema,
  inactiveTime: CookingTimeSchema,
})

export type Ingredient = z.input<typeof IngredientSchema>;
export type Instruction = z.input<typeof InstructionSchema>;
export type Recipe = z.input<typeof RecipeSchema>;
