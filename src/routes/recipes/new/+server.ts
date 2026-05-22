import { json } from '@sveltejs/kit';
import * as v from "valibot"
import { RecipeSchema } from '$lib/domain/recipe.js';

export const POST = async ({ request }) => {
  const data = await request.formData();

  const recipe = JSON.parse(
    data.get("recipe") as string
  );
  const image = data.get("image");

  const result = v.safeParse(RecipeSchema, recipe)
  if (!result.success) {
    return json({
      success: false,
      errors: v.flatten(result.issues).nested
    })
  }

  return json({
    success: true,
  });
}