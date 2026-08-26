<script lang="ts">
  import type { CanvasElement } from "$lib/types/builder";
  import { flattenTree, moveElementInTree, groupElementsInTree, unparentElementInTree } from "$lib/utils/builderDnd";

  let {
    elements,
    selectedElementId,
    onSelect,
    onDelete,
    onMoveElement,
    onGroupElements,
    onUnparentElement,
  }: {
    elements: CanvasElement[];
    selectedElementId: string | null;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onMoveElement: (elementId: string, targetParentId: string, targetIndex: number) => void;
    onGroupElements: (ids: string[], containerType: 'Section' | 'Column') => void;
    onUnparentElement: (elementId: string) => void;
  } = $props();

  // ─── State ───────────────────────────────────────────────────────────
  let collapsed = $state<Record<string, boolean>>({});
  let multiSelected = $state<Set<string>>(new Set());
  let contextMenu = $state<{ x: number; y: number; id: string; parentId: string } | null>(null);
  let draggingId = $state<string | null>(null);
  let dragOverInfo = $state<{ id: string; position: 'before' | 'after' | 'inside' } | null>(null);

  // ─── Derived ─────────────────────────────────────────────────────────
  const flat = $derived(flattenTree(elements));

  // ─── Icons / helpers ─────────────────────────────────────────────────
  const ELEMENT_ICONS: Record<string, string> = {
    Section: '⬜', Grid: '⊞', Column: '▤', Headline: 'H₁', Subheadline: 'H₂',
    Paragraph: '¶', Button: '◉', Image: '🖼', Video: '▶', OptInForm: '✉',
    Divider: '─', CountdownTimer: '⏱', BulletList: '☑', Testimonial: '❝', SocialProof: '⭐',
  };

  const CONTAINER_TYPES = ['Section', 'Grid', 'Column'];
  const isContainer = (type: string) => CONTAINER_TYPES.includes(type);

  function getLabel(el: CanvasElement): string {
    if (el.content) {
      const stripped = el.content.replace(/<[^>]+>/g, '').trim();
      if (stripped) return stripped.slice(0, 28) + (stripped.length > 28 ? '…' : '');
    }
    if (el.properties?.label) return el.properties.label;
    if (el.properties?.headline) return el.properties.headline;
    if (el.properties?.name) return el.properties.name;
    return el.type;
  }

  // ─── Collapse ────────────────────────────────────────────────────────
  function toggle(id: string) {
    collapsed[id] = !collapsed[id];
  }

  // ─── Multi-select ─────────────────────────────────────────────────────
  function handleRowClick(e: MouseEvent, id: string) {
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      const next = new Set(multiSelected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      multiSelected = next;
    } else {
      multiSelected = new Set();
      onSelect(id);
    }
  }

  // ─── Context menu ─────────────────────────────────────────────────────
  function openContextMenu(e: MouseEvent, id: string, parentId: string) {
    e.preventDefault();
    e.stopPropagation();
    contextMenu = { x: e.clientX, y: e.clientY, id, parentId };
  }

  function closeContextMenu() { contextMenu = null; }

  function ctxSelect() {
    if (!contextMenu) return;
    onSelect(contextMenu.id);
    closeContextMenu();
  }

  function ctxDelete() {
    if (!contextMenu) return;
    onDelete(contextMenu.id);
    closeContextMenu();
  }

  function ctxGroupAsSection() {
    if (!contextMenu) return;
    const ids = multiSelected.size >= 2 ? [...multiSelected] : [contextMenu.id];
    onGroupElements(ids, 'Section');
    multiSelected = new Set();
    closeContextMenu();
  }

  function ctxGroupAsColumn() {
    if (!contextMenu) return;
    const ids = multiSelected.size >= 2 ? [...multiSelected] : [contextMenu.id];
    onGroupElements(ids, 'Column');
    multiSelected = new Set();
    closeContextMenu();
  }

  function ctxUnparent() {
    if (!contextMenu) return;
    onUnparentElement(contextMenu.id);
    closeContextMenu();
  }

  // ─── Drag & Drop reorder ──────────────────────────────────────────────
  function handleDragStart(e: DragEvent, id: string) {
    draggingId = id;
    e.dataTransfer?.setData('text/plain', id);
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnd() {
    draggingId = null;
    dragOverInfo = null;
  }

  function handleDragOver(e: DragEvent, id: string, depth: number, parentId: string) {
    e.preventDefault();
    if (!draggingId || draggingId === id) return;
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const h = rect.height;

    let position: 'before' | 'after' | 'inside';
    if (isContainer(flat.find(f => f.el.id === id)?.el.type ?? '')) {
      if (relY < h * 0.25) position = 'before';
      else if (relY > h * 0.75) position = 'after';
      else position = 'inside';
    } else {
      position = relY < h / 2 ? 'before' : 'after';
    }
    dragOverInfo = { id, position };
  }

  function handleDrop(e: DragEvent, targetId: string, targetParentId: string, targetDepthIndex: number) {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;
    if (!dragOverInfo) return;

    const { position } = dragOverInfo;

    if (position === 'inside') {
      // Make dragging element a child of target container
      onMoveElement(draggingId, targetId, 0);
    } else {
      // Reorder: find target index within its parent
      const siblings = flat.filter(f => f.parentId === targetParentId);
      const targetSiblingIdx = siblings.findIndex(f => f.el.id === targetId);
      const insertAt = position === 'before' ? targetSiblingIdx : targetSiblingIdx + 1;
      onMoveElement(draggingId, targetParentId, Math.max(0, insertAt));
    }

    draggingId = null;
    dragOverInfo = null;
  }
</script>

<!-- Click outside closes context menu -->
<svelte:window onclick={closeContextMenu} />

<div class="layers-panel">
  {#if flat.length === 0}
    <div class="layers-empty">
      <p>No elements yet</p>
      <p class="layers-empty-sub">Add elements from the left panel</p>
    </div>
  {:else}
    <div class="layers-header">
      <span class="layers-header-label">Layers</span>
      {#if multiSelected.size >= 2}
        <div class="layers-group-actions">
          <button type="button" onclick={() => { onGroupElements([...multiSelected], 'Section'); multiSelected = new Set(); }} class="layers-group-btn" title="Group as Section">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            Group ({multiSelected.size})
          </button>
        </div>
      {/if}
    </div>

    <div class="layers-list">
      {#each flat as { el, depth, parentId }, i}
        {@const isSelected = selectedElementId === el.id}
        {@const isMulti = multiSelected.has(el.id)}
        {@const isDragging = draggingId === el.id}
        {@const dropIndicator = dragOverInfo?.id === el.id ? dragOverInfo.position : null}
        {@const hasChildren = (el.children?.length ?? 0) > 0}
        {@const isCollapsed = collapsed[el.id]}

        <!-- Skip children of collapsed containers -->
        {#if !flat.slice(0, i).some(prev => isContainer(prev.el.type) && collapsed[prev.el.id] && depth > prev.depth && parentId !== 'root' || (collapsed[prev.el.id] && flat.find(f => f.el.id === parentId)?.parentId === prev.el.id))}

        <div
          class="layer-row
            {isSelected ? 'layer-row--selected' : ''}
            {isMulti ? 'layer-row--multi' : ''}
            {isDragging ? 'layer-row--dragging' : ''}
            {dropIndicator === 'before' ? 'drop-before' : ''}
            {dropIndicator === 'after' ? 'drop-after' : ''}
            {dropIndicator === 'inside' ? 'drop-inside' : ''}
          "
          style="padding-left: {8 + depth * 14}px;"
          draggable="true"
          ondragstart={(e) => handleDragStart(e, el.id)}
          ondragend={handleDragEnd}
          ondragover={(e) => handleDragOver(e, el.id, depth, parentId)}
          ondrop={(e) => handleDrop(e, el.id, parentId, i)}
          onclick={(e) => handleRowClick(e, el.id)}
          oncontextmenu={(e) => openContextMenu(e, el.id, parentId)}
          role="button"
          tabindex="0"
          onkeydown={(e) => e.key === 'Enter' && onSelect(el.id)}
        >
          <!-- Drag handle -->
          <span class="layer-drag-handle" title="Drag to reorder">⠿</span>

          <!-- Collapse toggle (containers only) -->
          <button
            type="button"
            class="layer-toggle {isContainer(el.type) ? '' : 'layer-toggle--hidden'}"
            onclick={(e) => { e.stopPropagation(); toggle(el.id); }}
            aria-label="Toggle collapse"
          >
            {#if isContainer(el.type)}
              <svg width="10" height="10" viewBox="0 0 10 10" style="transform: rotate({isCollapsed ? '-90' : '0'}deg); transition: transform 0.15s;">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
              </svg>
            {/if}
          </button>

          <!-- Icon -->
          <span class="layer-icon">{ELEMENT_ICONS[el.type] ?? '◻'}</span>

          <!-- Label -->
          <span class="layer-label" title={getLabel(el)}>{getLabel(el)}</span>

          <!-- Type badge -->
          <span class="layer-type">{el.type}</span>

          <!-- Multi-select checkbox -->
          <button
            type="button"
            class="layer-check {isMulti ? 'is-checked' : ''}"
            onclick={(e) => { e.stopPropagation(); const next = new Set(multiSelected); isMulti ? next.delete(el.id) : next.add(el.id); multiSelected = next; }}
            aria-label="Toggle selection"
            aria-pressed={isMulti}
          >
            {#if isMulti}✓{/if}
          </button>

          <!-- Delete -->
          <button
            type="button"
            class="layer-delete"
            onclick={(e) => { e.stopPropagation(); onDelete(el.id); }}
            title="Delete"
            aria-label="Delete"
          >✕</button>
        </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<!-- Context Menu -->
{#if contextMenu}
  <div
    class="ctx-menu"
    style="top: {contextMenu.y}px; left: {contextMenu.x}px;"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => { e.stopPropagation(); if (e.key === 'Escape') closeContextMenu(); }}
    role="menu"
    aria-label="Element options"
    tabindex="-1"
  >
    <button type="button" class="ctx-item" onclick={ctxSelect}>Select</button>
    <div class="ctx-divider"></div>
    {#if contextMenu.parentId !== 'root'}
      <button type="button" class="ctx-item" onclick={ctxUnparent}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        Move to root (ungroup)
      </button>
    {/if}
    <button type="button" class="ctx-item" onclick={ctxGroupAsSection}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
      {multiSelected.size >= 2 ? `Group ${multiSelected.size} as Section` : 'Wrap in Section'}
    </button>
    <button type="button" class="ctx-item" onclick={ctxGroupAsColumn}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/></svg>
      {multiSelected.size >= 2 ? `Group ${multiSelected.size} as Column` : 'Wrap in Column'}
    </button>
    <div class="ctx-divider"></div>
    <button type="button" class="ctx-item ctx-item--danger" onclick={ctxDelete}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
      Delete
    </button>
  </div>
{/if}

<style>
  .layers-panel { display: flex; flex-direction: column; height: 100%; position: relative; }

  .layers-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 10px 4px; flex-shrink: 0;
  }
  .layers-header-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--muted-foreground);
  }
  .layers-group-btn {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 600; color: var(--primary);
    background: hsl(var(--primary) / 0.1); border: 1px solid hsl(var(--primary) / 0.2);
    border-radius: 5px; padding: 2px 8px; cursor: pointer;
    transition: background 0.15s;
  }
  .layers-group-btn:hover { background: hsl(var(--primary) / 0.18); }

  .layers-list { display: flex; flex-direction: column; flex: 1; overflow-y: auto; padding: 2px 4px; }

  .layer-row {
    display: flex; align-items: center; gap: 4px;
    padding-top: 3px; padding-bottom: 3px; padding-right: 6px;
    border-radius: 5px; cursor: pointer;
    transition: background 0.1s;
    min-height: 28px; user-select: none;
    border: 1.5px solid transparent;
    position: relative;
  }
  .layer-row:hover { background: var(--muted); }
  .layer-row--selected { background: hsl(var(--primary) / 0.1); }
  .layer-row--selected .layer-label { color: var(--primary); }
  .layer-row--multi { background: hsl(var(--primary) / 0.06); border-color: hsl(var(--primary) / 0.3); }
  .layer-row--dragging { opacity: 0.4; }

  /* Drop indicators */
  .drop-before::before {
    content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 2px;
    background: var(--primary); border-radius: 1px; z-index: 10;
  }
  .drop-after::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px;
    background: var(--primary); border-radius: 1px; z-index: 10;
  }
  .drop-inside { border-color: var(--primary) !important; background: hsl(var(--primary) / 0.08) !important; }

  .layer-drag-handle {
    font-size: 12px; color: var(--muted-foreground); opacity: 0;
    cursor: grab; flex-shrink: 0; line-height: 1; padding: 0 2px;
    transition: opacity 0.1s;
  }
  .layer-row:hover .layer-drag-handle { opacity: 0.5; }

  .layer-toggle {
    width: 16px; height: 16px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border-radius: 3px; color: var(--muted-foreground);
    background: transparent; border: none; cursor: pointer;
    transition: background 0.1s;
  }
  .layer-toggle--hidden { pointer-events: none; opacity: 0; }
  .layer-toggle:hover { background: var(--border); }

  .layer-icon {
    font-size: 11px; width: 16px; text-align: center; flex-shrink: 0;
    color: var(--muted-foreground); line-height: 1;
  }

  .layer-label {
    flex: 1; font-size: 12px; color: var(--foreground);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
  }

  .layer-type {
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; color: var(--muted-foreground); opacity: 0;
    flex-shrink: 0; transition: opacity 0.1s;
  }
  .layer-row:hover .layer-type { opacity: 0.4; }

  .layer-check {
    width: 14px; height: 14px; border-radius: 3px;
    border: 1.5px solid var(--border); display: flex;
    align-items: center; justify-content: center;
    font-size: 9px; flex-shrink: 0; cursor: pointer;
    transition: all 0.1s; opacity: 0; color: var(--primary-foreground);
  }
  .layer-check.is-checked { background: var(--primary); border-color: var(--primary); opacity: 1 !important; }
  .layer-row:hover .layer-check { opacity: 0.5; }

  .layer-delete {
    width: 14px; height: 14px; border-radius: 3px; border: none;
    background: transparent; cursor: pointer; display: flex; align-items: center;
    justify-content: center; font-size: 10px; color: var(--muted-foreground);
    opacity: 0; transition: all 0.1s; flex-shrink: 0;
  }
  .layer-row:hover .layer-delete { opacity: 1; }
  .layer-delete:hover { background: rgba(239,68,68,0.15); color: #ef4444; }

  .layers-empty {
    padding: 32px 16px; text-align: center;
    color: var(--muted-foreground); font-size: 12px;
  }
  .layers-empty-sub { font-size: 11px; margin-top: 4px; opacity: 0.6; }

  /* Context Menu */
  .ctx-menu {
    position: fixed; z-index: 9999;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 8px; padding: 4px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    min-width: 190px;
  }
  .ctx-item {
    display: flex; align-items: center; gap: 8px; width: 100%;
    padding: 6px 10px; border-radius: 5px; border: none;
    background: transparent; color: var(--foreground);
    font-size: 12px; font-weight: 500; text-align: left;
    cursor: pointer; transition: background 0.1s;
  }
  .ctx-item:hover { background: var(--muted); }
  .ctx-item--danger { color: #ef4444; }
  .ctx-item--danger:hover { background: rgba(239,68,68,0.1); }
  .ctx-divider { height: 1px; background: var(--border); margin: 3px 0; }
</style>
