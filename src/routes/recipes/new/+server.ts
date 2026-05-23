import { json } from '@sveltejs/kit';
import * as v from "valibot"
import { RecipeSchema } from '$lib/domain/recipe.js';
import OpenAI from 'openai';
import { DEEPSEEK_API_KEY } from "$env/static/private"

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

  let id = 0;
  const ingredients = result.output.ingredients.map((ingredient) => {
    id += 1;
    return {
      ...ingredient,
      id,
    }
  })

  id = 0;
  const instructions = result.output.instructions.map((instruction) => {
    id += 1;
    return {
      ...instruction,
      id,
    }
  })

  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: DEEPSEEK_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    messages: [{ 
      role: "system", 
      content: `
You are a recipe ingredient-instruction linker. You are given:

{
  ingredients: {
    id: number,
    text: string,
    notes: string[]
  }[]

  instructions: {
    id: number,
    text: string,
    notes: string[]
  }[]
}

For each instruction, determine which ingredients are used or referenced.

Return an array of reference objects:

{
  instructionId: number,
  ingredientIds: number[]
}[]

Rules:
- Only reference ingredient IDs that actually appear in the provided ingredients list
- Include ingredients even if only implied by the instruction
- Do not invent ingredients
- Preserve original instruction text and notes exactly
- Return ONLY valid JSON with no markdown or explanation`},
{
  role: "user",
  content: JSON.stringify({
    ingredients,
    instructions
  })
}],
    model: "deepseek-v4-flash",
    thinking: { "type": "disabled" },
    stream: false,
  } as any);

  if (completion.choices[0].message.content) {
    console.dir(JSON.parse(completion.choices[0].message.content), { depth: null })
  } else {
    console.log("EEEEEEEEEEEEEEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARGHHH")
  }

  return json({
    success: true,
  });
}