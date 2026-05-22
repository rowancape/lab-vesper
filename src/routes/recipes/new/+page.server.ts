import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

export const load = async () => {
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
    SELECT id, parent_id AS parentId, label, path
    FROM cuisine_tree
  `);

  return {
    allCuisines
  }
}