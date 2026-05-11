import { zfd } from 'zod-form-data';
import z from 'zod';
import { writeFile } from 'fs/promises';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import Fuse from 'fuse.js';

const baseSchema = z.object({
  recipeName: zfd.text(z.string().optional()),
  recipeDescription: zfd.text(z.string().optional()),
  recipeReferences: zfd.repeatable(z.array(zfd.text(z.string().optional()))),
  recipeImageUrl: zfd.text(z.string().optional()),
  recipeImageSrc: zfd.text(z.string().optional()),
  imageTab: zfd.text(z.string().optional()),
  recipeDifficulty: zfd.text(z.string().optional()),
  recipeServings: zfd.numeric(z.number().optional()),
  recipeActiveTime: zfd.text(z.string().optional()),
  recipeInactiveTime: zfd.text(z.string().optional()),
});

const baseForm = zfd.formData(baseSchema);

const removeReferenceForm = zfd.formData(baseSchema.extend({
  indexOfReferenceToRemove: zfd.numeric()
}));

const toggleImageTabForm = zfd.formData(baseSchema.extend({
  imageTabToSwitchTo: zfd.text(z.enum(["url", "upload"]))
}));

const saveImageUrlForm = zfd.formData(baseSchema.extend({
  recipeImageUrl: zfd.text(z.url().or(z.string().length(0)))
}));

const saveImageFileForm = zfd.formData(baseSchema.extend({
  recipeImageFile: zfd.file(z.instanceof(File).optional()),
}));

const searchCuisinesForm = zfd.formData(baseSchema.extend({
  recipeCuisineSearchQuery: zfd.text(z.string().optional()),
}));

const saveRecipeForm = zfd.formData(
  baseSchema.extend({})
);

export const actions = {
  addReference: async ({ request }) => {
    const data = baseForm.parse(await request.formData());

    return {
      ...data,
      recipeReferences: [...data.recipeReferences, ""],
    }
  },
  removeReference: async ({ request }) => {
    const data = removeReferenceForm.parse(await request.formData());

    return {
      ...data,
      recipeReferences: data.recipeReferences.filter((_, i) => i !== data.indexOfReferenceToRemove),
    }
  },
  toggleImageTab: async ({ request }) => {
    const data = toggleImageTabForm.parse(await request.formData());

    return {
      ...data,
      imageTab: data.imageTabToSwitchTo,
    }
  },
  saveImageUrl: async ({ request }) => {
    const data = saveImageUrlForm.parse(await request.formData());

    return {
      ...data,
      recipeImageSrc: data.recipeImageUrl
    };
  },
  saveImageFile: async ({ request }) => {
    const {
      recipeImageFile,
      ...base
    } = saveImageFileForm.parse(await request.formData());

    if (recipeImageFile && recipeImageFile.size > 0) {
      const buffer = Buffer.from(await recipeImageFile.arrayBuffer());
      const ext = recipeImageFile.name.split(".").pop();
      const filename = `${crypto.randomUUID()}.${ext}`;
      await writeFile(`static/tmp/${filename}`, buffer);
      return {
        ...base,
        recipeImageSrc: `/tmp/${filename}`
      };
    }

    return {
      ...base,
      recipeImageSrc: ""
    };
  },
  searchCuisines: async ({ request }) => {
    const {
      recipeCuisineSearchQuery,
      ...base
    } = searchCuisinesForm.parse(await request.formData());

    const allCuisines = db.all(sql`
      WITH RECURSIVE cuisine_tree AS (
        SELECT id, label, parent_id, label AS path
        FROM cuisines
        WHERE parent_id = 0
        UNION ALL
        SELECT c.id, c.label, c.parent_id, ct.path || ' > ' || c.label
        FROM cuisines c
        JOIN cuisine_tree ct ON c.parent_id = ct.id
      )
      SELECT id, label, path
      FROM cuisine_tree
    `);

    const fuse = new Fuse(allCuisines, {
      keys: ['label', 'path'],
      threshold: 0.2,
    });

    return {
      ...base,
      recipeCuisineSearchResults: recipeCuisineSearchQuery
        ? fuse.search(recipeCuisineSearchQuery).map(r => r.item)
        : allCuisines,
    };
  }
}