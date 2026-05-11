import { json } from '@sveltejs/kit';
import { RecipeSchema } from '$lib/domain/recipe';
import z from 'zod';

function normalizeErrorTree(node: any): any {
  if (!node) return { errors: [] };

  if (node.items) {
    const arr: any = node.items.map((item: any) => normalizeErrorTree(item));
    arr.errors = node.errors ?? [];
    return arr;
  }

  const result: any = {
    errors: node.errors ?? []
  };

  if (node.properties) {
    for (const key in node.properties) {
      result[key] = normalizeErrorTree(node.properties[key]);
    }
  }

  return result;
}

function buildErrorShape(data: any): any {
  if (Array.isArray(data)) {
    return data.map(buildErrorShape);
  }

  if (typeof data === "object" && data !== null) {
    const result: any = { errors: [] };

    for (const key in data) {
      result[key] = buildErrorShape(data[key]);
    }

    return result;
  }

  return { errors: [] };
}

function mergeErrors(shape: any, errors: any): any {
  if (!errors) return shape;

  if (Array.isArray(shape)) {
    return shape.map((item, i) =>
      mergeErrors(item, errors[i])
    );
  }

  const result: any = {
    errors: errors.errors ?? []
  };

  for (const key in shape) {
    if (key === "errors") continue;

    result[key] = mergeErrors(shape[key], errors[key]);
  }

  return result;
}

export async function POST({ request }) {
  const req = await request.json();

  const result = RecipeSchema.safeParse(req);

  if (!result.success) {
    const tree = z.treeifyError(result.error);
    
    const normalized = normalizeErrorTree(tree);
    const shape = buildErrorShape(req);
    const fullErrors = mergeErrors(shape, normalized);

    console.log(fullErrors);

    return json(
      { type: "error", errors: fullErrors }, 
      { status: 400 }
    )
  }

  return json(
    { type: "success", redirectTo: "/recipes" }, 
    { status: 201 }
  )
}