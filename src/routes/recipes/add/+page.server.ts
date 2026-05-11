import { db } from '$lib/server/db/index.js';
import { cuisines } from '$lib/server/db/schema.js';
import { buildCuisineTree } from '$lib/server/db/service/cuisineService.js';
import { desc } from 'drizzle-orm';

export const load = async () => {
  try {
    const rows = await db
      .select({
        id: cuisines.id,
        label: cuisines.label,
        parentId: cuisines.parentId
      })
      .from(cuisines)
      .orderBy(desc(cuisines.weight));

    const cuisineTree = buildCuisineTree(rows);

    return {
      cuisines: cuisineTree
    }
  } catch (err) {
    console.error(err);
  }
}


export const actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const payload = JSON.parse(data.get("payload") as string);

    console.log(payload);
    console.log(payload.ingredients[0].notes);
  }
}