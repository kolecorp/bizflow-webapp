<script lang="ts">
  import { dndzone, type DndEvent } from "svelte-dnd-action";
  import type { CanvasElement } from "$lib/types/builder";
  import TiptapEditor from "./TiptapEditor.svelte";
  import CanvasNode from "./CanvasNode.svelte";
  import { onMount, onDestroy } from "svelte";

  let {
    element,
    selectedElementId,
    onSelect,
    onUpdateElement,
    onDelete,
    onDuplicate,
    onDndConsider,
    onDndFinalize,
  }: {
    element: CanvasElement;
    selectedElementId: string | null;
    onSelect: (id: string) => void;
    onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onDndConsider: (id: string, e: CustomEvent<DndEvent<CanvasElement>>) => void;
    onDndFinalize: (id: string, e: CustomEvent<DndEvent<CanvasElement>>) => void;
  } = $props();

  const p = $derived(element.properties);
  const isSelected = $derived(selectedElementId === element.id);
  const isContainer = $derived(['Section', 'Grid', 'Column'].includes(element.type));

  // ─── Computed style from properties ──────────────────────────────────────
  const computedStyle = $derived.by(() => {
    const s: string[] = [];
    const props = element.properties;

    switch (element.type) {
      case 'Section':
        if (props.bgColor) s.push(`background-color: ${props.bgColor}`);
        if (props.bgImage) s.push(`background-image: url(${props.bgImage}); background-size: cover; background-position: center`);
        s.push(`padding: ${props.paddingTop ?? 48}px ${props.paddingRight ?? 24}px ${props.paddingBottom ?? 48}px ${props.paddingLeft ?? 24}px`);
        break;
      case 'Grid':
        if (props.bgColor && props.bgColor !== 'transparent') s.push(`background-color: ${props.bgColor}`);
        if (props.bgImage) s.push(`background-image: url(${props.bgImage}); background-size: cover; background-position: center`);
        s.push(`display: grid; grid-template-columns: repeat(${props.cols ?? 2}, 1fr); gap: ${props.gap ?? 24}px`);
        if (props.paddingTop !== undefined || props.paddingBottom !== undefined || props.paddingLeft !== undefined || props.paddingRight !== undefined) {
          s.push(`padding: ${props.paddingTop ?? 0}px ${props.paddingRight ?? 0}px ${props.paddingBottom ?? 0}px ${props.paddingLeft ?? 0}px`);
        }
        break;
      case 'Column':
        if (props.bgColor && props.bgColor !== 'transparent') s.push(`background-color: ${props.bgColor}`);
        if (props.bgImage) s.push(`background-image: url(${props.bgImage}); background-size: cover; background-position: center`);
        s.push(`display: flex; flex-direction: column; gap: ${props.gap ?? 16}px; align-items: ${props.align ?? 'start'}`);
        if (props.paddingTop !== undefined || props.paddingBottom !== undefined || props.paddingLeft !== undefined || props.paddingRight !== undefined) {
          s.push(`padding: ${props.paddingTop ?? 0}px ${props.paddingRight ?? 0}px ${props.paddingBottom ?? 0}px ${props.paddingLeft ?? 0}px`);
        }
        break;
      case 'Headline':
      case 'Subheadline':
      case 'Paragraph':
        if (props.fontFamily) s.push(`font-family: '${props.fontFamily}', sans-serif`);
        s.push(`color: ${props.color ?? '#111827'}`);
        s.push(`font-size: ${props.fontSize ?? 16}px`);
        s.push(`font-weight: ${props.fontWeight ?? 'normal'}`);
        s.push(`line-height: ${props.lineHeight ?? 1.5}`);
        s.push(`text-align: ${props.align ?? 'left'}`);
        break;
      case 'Button':
        // computed per-render below
        break;
      case 'Divider':
        s.push(`margin-top: ${props.marginTop ?? 32}px; margin-bottom: ${props.marginBottom ?? 32}px`);
        break;
    }

    // Global effects & positioning
    if (props.opacity !== undefined) s.push(`opacity: ${props.opacity}`);
    if (props.blur !== undefined && props.blur > 0) s.push(`filter: blur(${props.blur}px)`);
    if (props.position && props.position !== 'static') {
      s.push(`position: ${props.position}`);
      if (props.top) s.push(`top: ${props.top}`);
      if (props.bottom) s.push(`bottom: ${props.bottom}`);
      if (props.left) s.push(`left: ${props.left}`);
      if (props.right) s.push(`right: ${props.right}`);
      if (props.zIndex !== undefined) s.push(`z-index: ${props.zIndex}`);
      if (props.width) s.push(`width: ${props.width}`);
      if (props.height) s.push(`height: ${props.height}`);
    }

    return s.join('; ');
  });

  const dndOptions = $derived({
    items: element.children,
    flipDurationMs: 200,
    dropTargetStyle: { outline: '2px dashed rgba(124,58,237,0.7)', outlineOffset: '-2px', backgroundColor: 'rgba(124,58,237,0.05)' },
  });

  // ─── Countdown Timer ─────────────────────────────────────────────────────
  let timerDays = $state('00');
  let timerHours = $state('00');
  let timerMins = $state('00');
  let timerSecs = $state('00');
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  function pad(n: number) { return String(Math.max(0, n)).padStart(2, '0'); }

  function updateTimer() {
    if (element.type !== 'CountdownTimer') return;
    const target = new Date(element.properties.targetDate + 'T23:59:59');
    const diff = Math.max(0, target.getTime() - Date.now());
    timerDays = pad(Math.floor(diff / 86400000));
    timerHours = pad(Math.floor((diff % 86400000) / 3600000));
    timerMins = pad(Math.floor((diff % 3600000) / 60000));
    timerSecs = pad(Math.floor((diff % 60000) / 1000));
  }

  onMount(() => {
    if (element.type === 'CountdownTimer') {
      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);
    }
  });

  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
  });

  // ─── Event handlers ───────────────────────────────────────────────────────
  function handleSelect(e: MouseEvent) {
    e.stopPropagation();
    onSelect(element.id);
  }

  function handleTextUpdate(html: string) {
    onUpdateElement(element.id, { content: html });
  }

  function getVideoEmbedUrl(url: string): string {
    if (!url) return '';
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return url;
  }
</script>

<!-- ═══ Wrapper ════════════════════════════════════════════════════════════ -->
<div
  class="canvas-node group relative {isContainer ? '' : ''} {isSelected ? 'is-selected' : ''} {element.styles}"
  style={computedStyle}
  onclick={handleSelect}
  role="presentation"
>
  <!-- Selection / hover ring -->
  {#if isSelected}
    <!-- Action toolbar -->
    <div class="element-toolbar" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="toolbar" aria-label="Element actions" tabindex="0">
      <span class="element-type-badge">{element.type}</span>
      <div class="element-toolbar-actions">
        <button type="button" onclick={() => onDuplicate(element.id)} title="Duplicate" class="toolbar-btn">⎘</button>
        <button type="button" onclick={() => onDelete(element.id)} title="Delete" class="toolbar-btn toolbar-btn--danger">✕</button>
      </div>
    </div>
  {/if}

  <!-- ═══ Element Renders ════════════════════════════════════════════════ -->

  {#if element.type === 'Headline' || element.type === 'Subheadline' || element.type === 'Paragraph'}
    <TiptapEditor content={element.content} onUpdate={handleTextUpdate} />

  {:else if element.type === 'Button'}
    {@const bp = element.properties}
    <div style="text-align: {bp.align ?? 'center'}; pointer-events: none;">
      <span
        style="
          display: inline-block;
          background: {bp.bgColor ?? '#7c3aed'};
          color: {bp.textColor ?? '#ffffff'};
          border-radius: {bp.borderRadius ?? 8}px;
          padding: {bp.paddingY ?? 14}px {bp.paddingX ?? 32}px;
          font-size: {bp.size === 'sm' ? '13px' : bp.size === 'xl' ? '20px' : bp.size === 'lg' ? '17px' : '15px'};
          font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          box-shadow: 0 4px 14px -2px {bp.bgColor ?? '#7c3aed'}60;
          width: {bp.fullWidth ? '100%' : 'auto'};
          text-align: center;
        "
      >{bp.label ?? 'Click Here'}</span>
    </div>

  {:else if element.type === 'Image'}
    {@const ip = element.properties}
    <div style="width: {ip.width ?? 100}%;">
      <img
        src={ip.src ?? 'https://placehold.co/800x450'}
        alt={ip.alt ?? ''}
        style="
          display: block; width: 100%; height: auto;
          object-fit: {ip.objectFit ?? 'cover'};
          border-radius: {ip.borderRadius ?? 12}px;
          {ip.shadow ? 'box-shadow: 0 10px 30px rgba(0,0,0,0.12);' : ''}
        "
        draggable="false"
      />
    </div>

  {:else if element.type === 'Video'}
    {@const vp = element.properties}
    {@const embedUrl = getVideoEmbedUrl(vp.url ?? '')}
    <div
      style="
        position: relative; width: 100%; padding-bottom: {vp.aspectRatio ?? 56.25}%;
        border-radius: {vp.borderRadius ?? 12}px; overflow: hidden;
        {vp.shadow ? 'box-shadow: 0 10px 30px rgba(0,0,0,0.2);' : ''}
        background: #0f0f1a;
      "
    >
      {#if embedUrl}
        <iframe
          src="{embedUrl}{vp.autoplay ? '?autoplay=1&mute=1' : ''}"
          title="Video embed"
          frameborder="0"
          allow="autoplay; encrypted-media; fullscreen"
          style="position: absolute; inset: 0; width: 100%; height: 100%; border: none;"
        ></iframe>
      {:else}
        <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; color: rgba(255,255,255,0.4);">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          <span style="font-size: 13px; font-weight: 500;">Paste your video URL in the inspector</span>
        </div>
      {/if}
    </div>

  {:else if element.type === 'OptInForm'}
    {@const fp = element.properties}
    <div
      style="
        background: {fp.bgColor ?? '#f8fafc'};
        border: 1px solid {fp.borderColor ?? '#e2e8f0'};
        border-radius: {fp.borderRadius ?? 8}px;
        padding: {fp.padding ?? 32}px;
        pointer-events: none;
        max-width: 480px;
        margin: 0 auto;
      "
    >
      {#if fp.headline}
        <p style="font-size: 20px; font-weight: 700; color: {fp.borderColor?.startsWith('rgba') ? '#ffffff' : '#111827'}; text-align: center; margin-bottom: 8px;">{fp.headline}</p>
      {/if}
      {#if fp.subheadline}
        <p style="font-size: 14px; color: {fp.borderColor?.startsWith('rgba') ? 'rgba(255,255,255,0.7)' : '#6b7280'}; text-align: center; margin-bottom: 20px;">{fp.subheadline}</p>
      {/if}
      {#if fp.showName}
        <input type="text" placeholder={fp.namePlaceholder ?? 'Your first name'} disabled
          style="display: block; width: 100%; border: 1px solid rgba(0,0,0,0.12); border-radius: {(fp.borderRadius ?? 8) - 2}px; padding: 11px 14px; font-size: 15px; margin-bottom: 10px; background: rgba(255,255,255,0.9); box-sizing: border-box;" />
      {/if}
      <input type="email" placeholder={fp.emailPlaceholder ?? 'Your best email address...'} disabled
        style="display: block; width: 100%; border: 1px solid rgba(0,0,0,0.12); border-radius: {(fp.borderRadius ?? 8) - 2}px; padding: 11px 14px; font-size: 15px; margin-bottom: 12px; background: rgba(255,255,255,0.9); box-sizing: border-box;" />
      <button type="button" disabled
        style="display: block; width: 100%; background: {fp.buttonBg ?? '#7c3aed'}; color: {fp.buttonTextColor ?? '#fff'}; border: none; border-radius: {(fp.borderRadius ?? 8) - 2}px; padding: 14px 24px; font-size: 16px; font-weight: 700; cursor: default; box-shadow: 0 4px 14px -2px {fp.buttonBg ?? '#7c3aed'}60;"
      >{fp.buttonLabel ?? 'Get Access Now →'}</button>
      {#if fp.disclaimer}
        <p style="font-size: 12px; text-align: center; margin-top: 12px; opacity: 0.65; color: {fp.borderColor?.startsWith('rgba') ? '#ffffff' : '#6b7280'};">{fp.disclaimer}</p>
      {/if}
    </div>

  {:else if element.type === 'Divider'}
    {@const dp = element.properties}
    <div style="margin-top: {dp.marginTop ?? 32}px; margin-bottom: {dp.marginBottom ?? 32}px; display: flex; justify-content: center; pointer-events: none;">
      <hr style="width: {dp.widthPercent ?? 100}%; border: none; border-top: {dp.thickness ?? 1}px {dp.style ?? 'solid'} {dp.color ?? '#e5e7eb'};" />
    </div>

  {:else if element.type === 'CountdownTimer'}
    {@const cp = element.properties}
    <div style="background: {cp.bgColor ?? '#1e1b4b'}; padding: 32px 16px; text-align: center; pointer-events: none;">
      <div style="display: flex; align-items: flex-start; justify-content: center; gap: 12px; flex-wrap: wrap;">
        {#each [
          { v: timerDays, l: cp.labelDays ?? 'DAYS', show: cp.showDays !== false },
          { v: timerHours, l: cp.labelHours ?? 'HRS', show: cp.showHours !== false },
          { v: timerMins, l: cp.labelMinutes ?? 'MINS', show: cp.showMinutes !== false },
          { v: timerSecs, l: cp.labelSeconds ?? 'SECS', show: cp.showSeconds !== false },
        ] as seg, i}
          {#if seg.show}
            {#if i > 0}
              <span style="font-size: 36px; font-weight: 700; color: {cp.textColor ?? '#fff'}; opacity: 0.5; line-height: 1; padding-top: 8px;">:</span>
            {/if}
            <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
              <div style="background: {cp.blockBg ?? '#312e81'}; border-radius: 8px; padding: 12px 18px; min-width: 72px; box-shadow: 0 4px 14px rgba(0,0,0,0.3);">
                <span style="font-size: 38px; font-weight: 800; color: {cp.textColor ?? '#fff'}; font-variant-numeric: tabular-nums; line-height: 1;">{seg.v}</span>
              </div>
              <span style="font-size: 10px; font-weight: 700; letter-spacing: 0.15em; color: {cp.accentColor ?? '#a78bfa'};">{seg.l}</span>
            </div>
          {/if}
        {/each}
      </div>
    </div>

  {:else if element.type === 'BulletList'}
    {@const blp = element.properties}
    <div style="display: flex; flex-direction: column; gap: {blp.gap ?? 12}px; pointer-events: none;">
      {#each (blp.items ?? []) as item}
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <span style="flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: {blp.iconColor ?? '#7c3aed'}20; margin-top: 1px;">
            {#if blp.icon === 'star'}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="{blp.iconColor ?? '#7c3aed'}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            {:else if blp.icon === 'arrow'}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="{blp.iconColor ?? '#7c3aed'}" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            {:else if blp.icon === 'dot'}
              <span style="width: 6px; height: 6px; border-radius: 50%; background: {blp.iconColor ?? '#7c3aed'};"></span>
            {:else}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="{blp.iconColor ?? '#7c3aed'}" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
            {/if}
          </span>
          <span style="font-size: {blp.fontSize ?? 16}px; color: {blp.textColor ?? '#374151'}; line-height: 1.6;">{item}</span>
        </div>
      {/each}
    </div>

  {:else if element.type === 'Testimonial'}
    {@const tp = element.properties}
    <div style="background: {tp.bgColor ?? '#f9fafb'}; border: 1px solid {tp.borderColor ?? '#e5e7eb'}; border-radius: {tp.borderRadius ?? 12}px; padding: {tp.padding ?? 24}px; pointer-events: none;">
      <!-- Stars -->
      <div style="display: flex; gap: 3px; margin-bottom: 14px;">
        {#each Array(5) as _, i}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="{i < (tp.rating ?? 5) ? '#f59e0b' : '#e5e7eb'}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        {/each}
      </div>
      <!-- Quote -->
      <p style="font-size: 16px; font-style: italic; line-height: 1.7; color: {tp.textColor ?? '#374151'}; margin-bottom: 20px;">{tp.quote}</p>
      <!-- Author -->
      <div style="display: flex; align-items: center; gap: 12px;">
        {#if tp.avatar}
          <img src={tp.avatar} alt={tp.name} style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" draggable="false" />
        {:else}
          <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #4f46e5); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px; flex-shrink: 0;">{(tp.name ?? 'S')[0]}</div>
        {/if}
        <div>
          <p style="font-weight: 700; font-size: 15px; color: {tp.textColor ?? '#111827'};">{tp.name ?? 'Jane Smith'}</p>
          <p style="font-size: 13px; color: {tp.textColor ?? '#6b7280'}; opacity: 0.7;">{tp.role ?? 'Customer'}</p>
        </div>
      </div>
    </div>

  {:else if element.type === 'SocialProof'}
    {@const sp = element.properties}
    <div style="background: {sp.bgColor ?? '#f9fafb'}; padding: {sp.padding ?? 32}px 24px; text-align: center; pointer-events: none;">
      {#if sp.headline}
        <p style="font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: {sp.textColor ?? '#9ca3af'}; margin-bottom: 24px;">{sp.headline}</p>
      {/if}
      <div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 32px;">
        {#each (sp.logos ?? []) as logo}
          <span style="font-size: 18px; font-weight: 800; color: {sp.textColor ?? '#9ca3af'}; letter-spacing: -0.02em; font-family: system-ui, sans-serif;">{logo}</span>
        {/each}
      </div>
    </div>

  {:else}
    <!-- ─── Container: Section / Grid / Column ─── -->
    <div
      use:dndzone={dndOptions}
      onconsider={(e) => onDndConsider(element.id, e)}
      onfinalize={(e) => onDndFinalize(element.id, e)}
      class="dnd-container {element.children.length === 0 ? 'dnd-container--empty' : ''}"
      style={element.type === 'Grid' ? `display: grid; grid-template-columns: repeat(${p.cols ?? 2}, 1fr); gap: ${p.gap ?? 24}px;` : element.type === 'Column' ? `display: flex; flex-direction: column; gap: ${p.gap ?? 16}px;` : ''}
    >
      {#each element.children as child (child.id)}
        <CanvasNode
          element={child}
          {selectedElementId}
          {onSelect}
          {onUpdateElement}
          {onDelete}
          {onDuplicate}
          {onDndConsider}
          {onDndFinalize}
        />
      {/each}
      {#if element.children.length === 0}
        <div class="empty-drop-hint" style="pointer-events: none;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>
          Drop elements here
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .canvas-node {
    position: relative;
    transition: outline 0.1s ease;
    outline: 2px solid transparent;
    outline-offset: -2px;
  }
  .canvas-node:hover {
    outline-color: rgba(124, 58, 237, 0.35);
  }
  .canvas-node.is-selected {
    outline-color: #7c3aed;
    outline-width: 2px;
  }

  /* Element action toolbar */
  .element-toolbar {
    position: absolute;
    top: -32px;
    left: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 6px;
    pointer-events: auto;
  }
  .element-type-badge {
    background: #7c3aed;
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px 4px 0 0;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }
  .element-toolbar-actions {
    display: flex;
    align-items: center;
    gap: 2px;
    background: #7c3aed;
    border-radius: 4px 4px 0 0;
    padding: 2px 4px;
  }
  .toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 3px;
    font-size: 12px;
    color: rgba(255,255,255,0.85);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
    line-height: 1;
  }
  .toolbar-btn:hover {
    background: rgba(255,255,255,0.2);
    color: white;
  }
  .toolbar-btn--danger:hover {
    background: rgba(239,68,68,0.5);
    color: white;
  }

  /* DND container drop zone */
  .dnd-container {
    min-height: 60px;
    width: 100%;
  }
  .dnd-container--empty {
    border: 1.5px dashed rgba(124,58,237,0.25);
    border-radius: 6px;
    background: rgba(124,58,237,0.02);
  }
  .empty-drop-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 60px;
    color: rgba(124,58,237,0.4);
    font-size: 13px;
    font-weight: 500;
  }
</style>
