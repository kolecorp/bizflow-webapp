import type { CanvasElement } from "$lib/types/builder";

/** Recursively update an element anywhere in the tree */
export function updateElementInTree(
  tree: CanvasElement[],
  id: string,
  updates: Partial<CanvasElement>
): CanvasElement[] {
  return tree.map(el => {
    if (el.id === id) return { ...el, ...updates };
    if (el.children?.length) return { ...el, children: updateElementInTree(el.children, id, updates) };
    return el;
  });
}

/** Recursively find an element anywhere in the tree */
export function findElementInTree(tree: CanvasElement[], id: string): CanvasElement | undefined {
  for (const el of tree) {
    if (el.id === id) return el;
    if (el.children?.length) {
      const found = findElementInTree(el.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

/** Recursively update a dnd-zone's children list anywhere in the tree */
export function handleDndInTree(
  tree: CanvasElement[],
  containerId: string,
  newChildren: CanvasElement[]
): CanvasElement[] {
  if (containerId === 'root') return newChildren;
  return tree.map(el => {
    if (el.id === containerId) return { ...el, children: newChildren };
    if (el.children?.length) return { ...el, children: handleDndInTree(el.children, containerId, newChildren) };
    return el;
  });
}

/** Delete an element by ID anywhere in the tree */
export function deleteElementInTree(tree: CanvasElement[], id: string): CanvasElement[] {
  return tree
    .filter(el => el.id !== id)
    .map(el => el.children?.length ? { ...el, children: deleteElementInTree(el.children, id) } : el);
}

/** Duplicate an element by ID (inserts clone immediately after) */
export function duplicateElementInTree(tree: CanvasElement[], id: string): CanvasElement[] {
  const result: CanvasElement[] = [];
  for (const el of tree) {
    result.push({ ...el, children: el.children?.length ? duplicateElementInTree(el.children, id) : el.children });
    if (el.id === id) {
      result.push(deepCloneWithNewIds(el));
    }
  }
  return result;
}

function deepCloneWithNewIds(el: CanvasElement): CanvasElement {
  return {
    ...el,
    id: crypto.randomUUID(),
    properties: { ...el.properties },
    inlineStyles: { ...el.inlineStyles },
    children: el.children?.map(deepCloneWithNewIds) ?? [],
  };
}

/** Extract an element from the tree (removes and returns it) */
function extractElement(tree: CanvasElement[], id: string): { tree: CanvasElement[]; extracted: CanvasElement | null } {
  let extracted: CanvasElement | null = null;
  const walk = (arr: CanvasElement[]): CanvasElement[] =>
    arr.filter(el => {
      if (el.id === id) { extracted = el; return false; }
      return true;
    }).map(el => el.children?.length ? { ...el, children: walk(el.children) } : el);
  return { tree: walk(tree), extracted };
}

/** Move an element to a new position: targetParentId='root' means top-level, targetIndex is insertion position */
export function moveElementInTree(
  tree: CanvasElement[],
  elementId: string,
  targetParentId: string,
  targetIndex: number
): CanvasElement[] {
  const { tree: pruned, extracted } = extractElement(tree, elementId);
  if (!extracted) return tree;

  const insert = (arr: CanvasElement[], parentId: string): CanvasElement[] => {
    if (parentId === 'root') {
      const result = [...arr];
      result.splice(targetIndex, 0, extracted!);
      return result;
    }
    return arr.map(el => {
      if (el.id === parentId) {
        const children = [...(el.children ?? [])];
        children.splice(targetIndex, 0, extracted!);
        return { ...el, children };
      }
      if (el.children?.length) return { ...el, children: insert(el.children, parentId) };
      return el;
    });
  };
  return insert(pruned, targetParentId);
}

/** Wrap a list of element IDs into a new Section container at the position of the first selected element */
export function groupElementsInTree(
  tree: CanvasElement[],
  ids: string[],
  containerType: 'Section' | 'Column' = 'Section'
): CanvasElement[] {
  const idSet = new Set(ids);
  // Collect elements in order from root level only (cross-level grouping not supported)
  const toGroup = tree.filter(el => idSet.has(el.id));
  if (toGroup.length < 2) return tree;

  const firstIdx = tree.findIndex(el => idSet.has(el.id));
  const container: CanvasElement = {
    id: crypto.randomUUID(),
    type: containerType,
    content: '',
    styles: '',
    properties: containerType === 'Section'
      ? { bgColor: 'transparent', paddingTop: 48, paddingBottom: 48, paddingLeft: 24, paddingRight: 24 }
      : { gap: 16, align: 'start' },
    inlineStyles: {},
    children: toGroup,
  };
  const remaining = tree.filter(el => !idSet.has(el.id));
  remaining.splice(firstIdx, 0, container);
  return remaining;
}

/** Lift a child element out of its container to the root level (just below the container) */
export function unparentElementInTree(tree: CanvasElement[], elementId: string): CanvasElement[] {
  const result: CanvasElement[] = [];
  for (const el of tree) {
    if (el.children?.length) {
      const child = el.children.find(c => c.id === elementId);
      if (child) {
        result.push({ ...el, children: el.children.filter(c => c.id !== elementId) });
        result.push(child);
        continue;
      }
      result.push({ ...el, children: unparentElementInTree(el.children, elementId) });
    } else {
      result.push(el);
    }
  }
  return result;
}

/** Find the parent ID of an element */
export function findParentId(tree: CanvasElement[], elementId: string, parentId: string = 'root'): string | null {
  for (const el of tree) {
    if (el.id === elementId) return parentId;
    if (el.children?.length) {
      const found = findParentId(el.children, elementId, el.id);
      if (found !== null) return found;
    }
  }
  return null;
}

/** Flatten tree to ordered list with depth info */
export function flattenTree(tree: CanvasElement[], depth = 0): Array<{ el: CanvasElement; depth: number; parentId: string }> {
  const result: Array<{ el: CanvasElement; depth: number; parentId: string }> = [];
  const walk = (arr: CanvasElement[], d: number, pid: string) => {
    for (const el of arr) {
      result.push({ el, depth: d, parentId: pid });
      if (el.children?.length) walk(el.children, d + 1, el.id);
    }
  };
  walk(tree, depth, 'root');
  return result;
}
