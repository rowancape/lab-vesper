import { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { cuisines } from "../schema";
import { and, eq } from "drizzle-orm";
import { CUISINES, type CuisineNode } from "./data";

export async function initCuisines(db: BunSQLiteDatabase) {
  console.log("Initializing cuisines...");

  await upsertTree(db, CUISINES);

  await db
    .delete(cuisines)
    .where(
      eq(cuisines.isSystem, true)
    );

  console.log("✅ Done");
}

async function upsertOne(
  db: BunSQLiteDatabase,
  node: CuisineNode,
  parentId: number = 0
) {
  await db
    .insert(cuisines)
    .values({
      label: node.label,
      weight: node.weight,
      parentId
    })
    .onConflictDoNothing();

  const found = await db
    .select({ id: cuisines.id })
    .from(cuisines)
    .where(
      and(
        eq(cuisines.parentId, parentId), 
        eq(cuisines.label, node.label)
      )
    );

  if (found.length === 0) throw new Error("Could not insert or find cuisine!");
  if (found.length > 1) throw new Error("Duplicate cuisines found!");

  return found[0].id;
}

async function upsertTree(
  db: BunSQLiteDatabase,
  nodes: CuisineNode[],
  parentId: number = 0
) {
  for (const node of nodes) {
    const id = await upsertOne(db, node, parentId);

    if (node.children?.length) {
      await upsertTree(db, node.children, id);
    }
  }
}