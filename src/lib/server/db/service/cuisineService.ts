import type { CuisineNode } from "$lib/domain/cuisines";

type CuisineRow = {
  id: number
  label: string
  parentId: number
}

export function buildCuisineTree(rows: CuisineRow[]) {
  const map = new Map<number, CuisineNode>();
  const roots: CuisineNode[] = [];

  for (const row of rows) {
    map.set(
      row.id, {
        label: row.label,
        children: []
      }
    );
  }

  for (const row of rows) {
    const node = map.get(row.id)!;

    if (row.parentId === 0) {
      roots.push(node);
    } else {
      const parent = map.get(row.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  }

  return roots;
}