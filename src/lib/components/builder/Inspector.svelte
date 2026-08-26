<script lang="ts">
  import type { CanvasElement } from "$lib/types/builder";

  let {
    element,
    onUpdate,
    onDelete,
    onDuplicate,
    onOpenFontLibrary,
  }: {
    element: CanvasElement | null;
    onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onOpenFontLibrary?: () => void;
  } = $props();

  function set(key: string, value: any) {
    if (!element) return;
    onUpdate(element.id, { properties: { ...element.properties, [key]: value } });
  }

  function setMany(updates: Record<string, any>) {
    if (!element) return;
    onUpdate(element.id, { properties: { ...element.properties, ...updates } });
  }

  // Bullet list item management
  let newBulletItem = $state('');
  function addBulletItem() {
    if (!element || !newBulletItem.trim()) return;
    const items = [...(element.properties.items ?? []), newBulletItem.trim()];
    set('items', items);
    newBulletItem = '';
  }
  function removeBulletItem(i: number) {
    if (!element) return;
    const items = (element.properties.items ?? []).filter((_: any, idx: number) => idx !== i);
    set('items', items);
  }

  // Logo strip management
  let newLogo = $state('');
  function addLogo() {
    if (!element || !newLogo.trim()) return;
    const logos = [...(element.properties.logos ?? []), newLogo.trim()];
    set('logos', logos);
    newLogo = '';
  }
  function removeLogo(i: number) {
    if (!element) return;
    const logos = (element.properties.logos ?? []).filter((_: any, idx: number) => idx !== i);
    set('logos', logos);
  }

  // Track which fonts have already been loaded
  const loadedFonts = new Set<string>();

  function loadGoogleFont(fontName: string) {
    if (!fontName || loadedFonts.has(fontName)) return;
    loadedFonts.add(fontName);
    const family = fontName.replace(/ /g, '+');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@300;400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  }

  // Load current font on element selection
  $effect(() => {
    if (element?.properties?.fontFamily) {
      loadGoogleFont(element.properties.fontFamily);
    }
  });
</script>

<div class="inspector-panel">
  {#if !element}
    <div class="inspector-empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="inspector-empty-icon">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
      </svg>
      <p>Click any element on<br/>the canvas to edit it</p>
    </div>
  {:else}
    <!-- Header -->
    <div class="inspector-header">
      <div class="inspector-header-info">
        <span class="inspector-type-badge">{element.type}</span>
        <span class="inspector-id">{element.id.slice(0, 8)}</span>
      </div>
      <div class="inspector-header-actions">
        <button type="button" onclick={() => onDuplicate(element!.id)} class="inspector-icon-btn" title="Duplicate">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        </button>
        <button type="button" onclick={() => onDelete(element!.id)} class="inspector-icon-btn inspector-icon-btn--danger" title="Delete element">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
    </div>

    <div class="inspector-scroll">

      <!-- ─── SECTION ─────────────────────────────────────────── -->
      {#if element.type === 'Section'}
        <div class="inspector-group">
          <p class="inspector-group-title">Background</p>
          <div class="inspector-row">
            <span class="inspector-label">Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.bgColor ?? '#ffffff'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.bgColor ?? '#ffffff'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Image URL</span>
            <input type="url" value={element.properties.bgImage ?? ''} oninput={(e) => set('bgImage', e.currentTarget.value)} class="inspector-text-input" placeholder="https://..." />
          </div>
        </div>

        <div class="inspector-group">
          <p class="inspector-group-title">Spacing (px)</p>
          <div class="inspector-grid-4">
            {#each [['paddingTop','Top'], ['paddingRight','Right'], ['paddingBottom','Bottom'], ['paddingLeft','Left']] as [key, label]}
              <div class="inspector-num-box">
                <span class="inspector-num-label">{label}</span>
                <input type="number" value={element.properties[key] ?? 48} oninput={(e) => set(key, parseInt(e.currentTarget.value))} class="inspector-num-input" />
              </div>
            {/each}
          </div>
        </div>

      <!-- ─── GRID ────────────────────────────────────────────── -->
      {:else if element.type === 'Grid'}
        <div class="inspector-group">
          <p class="inspector-group-title">Background</p>
          <div class="inspector-row">
            <span class="inspector-label">Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.bgColor ?? 'transparent'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.bgColor ?? 'transparent'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Image URL</span>
            <input type="url" value={element.properties.bgImage ?? ''} oninput={(e) => set('bgImage', e.currentTarget.value)} class="inspector-text-input" placeholder="https://..." />
          </div>
        </div>

        <div class="inspector-group">
          <p class="inspector-group-title">Spacing (px)</p>
          <div class="inspector-grid-4">
            {#each [['paddingTop','Top'], ['paddingRight','Right'], ['paddingBottom','Bottom'], ['paddingLeft','Left']] as [key, label]}
              <div class="inspector-num-box">
                <span class="inspector-num-label">{label}</span>
                <input type="number" value={element.properties[key] ?? 0} oninput={(e) => set(key, parseInt(e.currentTarget.value))} class="inspector-num-input" />
              </div>
            {/each}
          </div>
        </div>

        <div class="inspector-group">
          <p class="inspector-group-title">Layout</p>
          <div class="inspector-row">
            <span class="inspector-label">Columns</span>
            <div class="inspector-seg-btn-row">
              {#each [1,2,3,4] as n}
                <button type="button" onclick={() => set('cols', n)} class="inspector-seg-btn {element.properties.cols === n ? 'is-active' : ''}">{n}</button>
              {/each}
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Gap (px)</span>
            <input type="number" value={element.properties.gap ?? 24} oninput={(e) => set('gap', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
        </div>

      <!-- ─── COLUMN ──────────────────────────────────────────── -->
      {:else if element.type === 'Column'}
        <div class="inspector-group">
          <p class="inspector-group-title">Background</p>
          <div class="inspector-row">
            <span class="inspector-label">Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.bgColor ?? 'transparent'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.bgColor ?? 'transparent'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Image URL</span>
            <input type="url" value={element.properties.bgImage ?? ''} oninput={(e) => set('bgImage', e.currentTarget.value)} class="inspector-text-input" placeholder="https://..." />
          </div>
        </div>

        <div class="inspector-group">
          <p class="inspector-group-title">Spacing (px)</p>
          <div class="inspector-grid-4">
            {#each [['paddingTop','Top'], ['paddingRight','Right'], ['paddingBottom','Bottom'], ['paddingLeft','Left']] as [key, label]}
              <div class="inspector-num-box">
                <span class="inspector-num-label">{label}</span>
                <input type="number" value={element.properties[key] ?? 0} oninput={(e) => set(key, parseInt(e.currentTarget.value))} class="inspector-num-input" />
              </div>
            {/each}
          </div>
        </div>

        <div class="inspector-group">
          <div class="inspector-row">
            <span class="inspector-label">Gap (px)</span>
            <input type="number" value={element.properties.gap ?? 16} oninput={(e) => set('gap', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Align</span>
            <select value={element.properties.align ?? 'start'} onchange={(e) => set('align', e.currentTarget.value)} class="inspector-select">
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>
        </div>

      <!-- ─── HEADLINE / SUBHEADLINE / PARAGRAPH ──────────────── -->
      {:else if ['Headline', 'Subheadline', 'Paragraph'].includes(element.type)}
        <div class="inspector-group">
          <p class="inspector-group-title">Typography</p>
          <div class="inspector-row" style="position: relative;">
            <span class="inspector-label">Font</span>
            <div class="font-picker-wrapper">
              <button type="button" class="font-picker-trigger" onclick={() => onOpenFontLibrary?.()}
                style="font-family: '{element.properties.fontFamily ?? 'Inter'}', sans-serif;">
                {element.properties.fontFamily ?? 'Inter'}
                <span class="font-change-label">(Change)</span>
              </button>
            </div>
          </div>
          {#if element.type !== 'Paragraph'}
            <div class="inspector-row">
              <span class="inspector-label">Tag</span>
              <select value={element.properties.tag ?? 'h1'} onchange={(e) => set('tag', e.currentTarget.value)} class="inspector-select">
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
              </select>
            </div>
          {/if}
          <div class="inspector-row">
            <span class="inspector-label">Size (px)</span>
            <input type="number" value={element.properties.fontSize ?? 16} oninput={(e) => set('fontSize', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Weight</span>
            <select value={element.properties.fontWeight ?? 'normal'} onchange={(e) => set('fontWeight', e.currentTarget.value)} class="inspector-select">
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semibold (600)</option>
              <option value="bold">Bold (700)</option>
              <option value="800">Extrabold (800)</option>
            </select>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Line Height</span>
            <input type="number" step="0.05" value={element.properties.lineHeight ?? 1.5} oninput={(e) => set('lineHeight', parseFloat(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
        </div>
        <div class="inspector-group">
          <p class="inspector-group-title">Appearance</p>
          <div class="inspector-row">
            <span class="inspector-label">Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.color ?? '#111827'} oninput={(e) => set('color', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.color ?? '#111827'} oninput={(e) => set('color', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Align</span>
            <div class="inspector-seg-btn-row">
              {#each ['left','center','right'] as a}
                <button type="button" onclick={() => set('align', a)} class="inspector-seg-btn {element.properties.align === a ? 'is-active' : ''}">{a[0].toUpperCase()}</button>
              {/each}
            </div>
          </div>
        </div>

      <!-- ─── BUTTON ──────────────────────────────────────────── -->
      {:else if element.type === 'Button'}
        <div class="inspector-group">
          <p class="inspector-group-title">Label & Action</p>
          <div class="inspector-row">
            <span class="inspector-label">Button Text</span>
            <input type="text" value={element.properties.label ?? ''} oninput={(e) => set('label', e.currentTarget.value)} class="inspector-text-input" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Link / Anchor</span>
            <input type="text" value={element.properties.href ?? '#'} oninput={(e) => set('href', e.currentTarget.value)} class="inspector-text-input font-mono" placeholder="#section-id or https://..." />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Open in</span>
            <select value={element.properties.openInNewTab ? '_blank' : '_self'} onchange={(e) => set('openInNewTab', e.currentTarget.value === '_blank')} class="inspector-select">
              <option value="_self">Same Tab</option>
              <option value="_blank">New Tab</option>
            </select>
          </div>
        </div>
        <div class="inspector-group">
          <p class="inspector-group-title">Style</p>
          <div class="inspector-row">
            <span class="inspector-label">Alignment</span>
            <div class="inspector-seg-btn-row">
              {#each ['left','center','right'] as a}
                <button type="button" onclick={() => set('align', a)} class="inspector-seg-btn {element.properties.align === a ? 'is-active' : ''}">{a[0].toUpperCase()}</button>
              {/each}
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Size</span>
            <select value={element.properties.size ?? 'lg'} onchange={(e) => set('size', e.currentTarget.value)} class="inspector-select">
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">BG Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.bgColor ?? '#7c3aed'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.bgColor ?? '#7c3aed'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Text Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.textColor ?? '#ffffff'} oninput={(e) => set('textColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.textColor ?? '#ffffff'} oninput={(e) => set('textColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Radius (px)</span>
            <input type="number" value={element.properties.borderRadius ?? 8} oninput={(e) => set('borderRadius', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Full Width</span>
            <button type="button" onclick={() => set('fullWidth', !element!.properties.fullWidth)} aria-label="Toggle option" class="inspector-toggle {element.properties.fullWidth ? 'is-on' : ''}">
              <span aria-label="Toggle option" class="inspector-toggle-thumb"></span>
            </button>
          </div>
        </div>
        <div class="inspector-group">
          <p class="inspector-group-title">Padding (px)</p>
          <div class="inspector-grid-2">
            <div class="inspector-num-box"><span class="inspector-num-label">H (X)</span><input type="number" value={element.properties.paddingX ?? 32} oninput={(e) => set('paddingX', parseInt(e.currentTarget.value))} class="inspector-num-input" /></div>
            <div class="inspector-num-box"><span class="inspector-num-label">V (Y)</span><input type="number" value={element.properties.paddingY ?? 14} oninput={(e) => set('paddingY', parseInt(e.currentTarget.value))} class="inspector-num-input" /></div>
          </div>
        </div>

      <!-- ─── IMAGE ───────────────────────────────────────────── -->
      {:else if element.type === 'Image'}
        <div class="inspector-group">
          <p class="inspector-group-title">Image</p>
          <div class="inspector-row">
            <span class="inspector-label">URL / Path</span>
            <input type="url" value={element.properties.src ?? ''} oninput={(e) => set('src', e.currentTarget.value)} class="inspector-text-input font-mono" placeholder="https://..." />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Alt Text</span>
            <input type="text" value={element.properties.alt ?? ''} oninput={(e) => set('alt', e.currentTarget.value)} class="inspector-text-input" placeholder="Describe the image..." />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Link (href)</span>
            <input type="url" value={element.properties.link ?? ''} oninput={(e) => set('link', e.currentTarget.value)} class="inspector-text-input font-mono" placeholder="Optional link URL" />
          </div>
        </div>
        <div class="inspector-group">
          <p class="inspector-group-title">Display</p>
          <div class="inspector-row">
            <span class="inspector-label">Object Fit</span>
            <select value={element.properties.objectFit ?? 'cover'} onchange={(e) => set('objectFit', e.currentTarget.value)} class="inspector-select">
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </select>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Width (%)</span>
            <input type="number" min="10" max="100" value={element.properties.width ?? 100} oninput={(e) => set('width', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Radius (px)</span>
            <input type="number" value={element.properties.borderRadius ?? 12} oninput={(e) => set('borderRadius', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Shadow</span>
            <button type="button" onclick={() => set('shadow', !element!.properties.shadow)} aria-label="Toggle option" class="inspector-toggle {element.properties.shadow ? 'is-on' : ''}">
              <span aria-label="Toggle option" class="inspector-toggle-thumb"></span>
            </button>
          </div>
        </div>

      <!-- ─── VIDEO ───────────────────────────────────────────── -->
      {:else if element.type === 'Video'}
        <div class="inspector-group">
          <p class="inspector-group-title">Video</p>
          <div class="inspector-row">
            <span class="inspector-label">URL</span>
            <input type="url" value={element.properties.url ?? ''} oninput={(e) => set('url', e.currentTarget.value)} class="inspector-text-input font-mono" placeholder="YouTube or Vimeo URL" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Aspect Ratio</span>
            <select value={String(element.properties.aspectRatio ?? 56.25)} onchange={(e) => set('aspectRatio', parseFloat(e.currentTarget.value))} class="inspector-select">
              <option value="56.25">16:9 (Landscape)</option>
              <option value="75">4:3 (Standard)</option>
              <option value="100">1:1 (Square)</option>
              <option value="177.78">9:16 (Portrait)</option>
            </select>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Autoplay</span>
            <button type="button" onclick={() => set('autoplay', !element!.properties.autoplay)} aria-label="Toggle option" class="inspector-toggle {element.properties.autoplay ? 'is-on' : ''}">
              <span aria-label="Toggle option" class="inspector-toggle-thumb"></span>
            </button>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Shadow</span>
            <button type="button" onclick={() => set('shadow', !element!.properties.shadow)} aria-label="Toggle option" class="inspector-toggle {element.properties.shadow ? 'is-on' : ''}">
              <span aria-label="Toggle option" class="inspector-toggle-thumb"></span>
            </button>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Radius (px)</span>
            <input type="number" value={element.properties.borderRadius ?? 12} oninput={(e) => set('borderRadius', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
        </div>

      <!-- ─── OPT-IN FORM ─────────────────────────────────────── -->
      {:else if element.type === 'OptInForm'}
        <div class="inspector-group">
          <p class="inspector-group-title">Content</p>
          <div class="inspector-row">
            <span class="inspector-label">Headline</span>
            <input type="text" value={element.properties.headline ?? ''} oninput={(e) => set('headline', e.currentTarget.value)} class="inspector-text-input" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Subheadline</span>
            <input type="text" value={element.properties.subheadline ?? ''} oninput={(e) => set('subheadline', e.currentTarget.value)} class="inspector-text-input" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Show Name Field</span>
            <button type="button" onclick={() => set('showName', !element!.properties.showName)} aria-label="Toggle option" class="inspector-toggle {element.properties.showName ? 'is-on' : ''}">
              <span aria-label="Toggle option" class="inspector-toggle-thumb"></span>
            </button>
          </div>
          {#if element.properties.showName}
            <div class="inspector-row">
              <span class="inspector-label">Name Placeholder</span>
              <input type="text" value={element.properties.namePlaceholder ?? ''} oninput={(e) => set('namePlaceholder', e.currentTarget.value)} class="inspector-text-input" />
            </div>
          {/if}
          <div class="inspector-row">
            <span class="inspector-label">Email Placeholder</span>
            <input type="text" value={element.properties.emailPlaceholder ?? ''} oninput={(e) => set('emailPlaceholder', e.currentTarget.value)} class="inspector-text-input" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Button Label</span>
            <input type="text" value={element.properties.buttonLabel ?? ''} oninput={(e) => set('buttonLabel', e.currentTarget.value)} class="inspector-text-input" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Disclaimer</span>
            <input type="text" value={element.properties.disclaimer ?? ''} oninput={(e) => set('disclaimer', e.currentTarget.value)} class="inspector-text-input" />
          </div>
        </div>
        <div class="inspector-group">
          <p class="inspector-group-title">Button Style</p>
          <div class="inspector-row">
            <span class="inspector-label">BG Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.buttonBg ?? '#7c3aed'} oninput={(e) => set('buttonBg', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.buttonBg ?? '#7c3aed'} oninput={(e) => set('buttonBg', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Text Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.buttonTextColor ?? '#ffffff'} oninput={(e) => set('buttonTextColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.buttonTextColor ?? '#ffffff'} oninput={(e) => set('buttonTextColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
        </div>
        <div class="inspector-group">
          <p class="inspector-group-title">Form Box Style</p>
          <div class="inspector-row">
            <span class="inspector-label">BG Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.bgColor ?? '#f8fafc'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.bgColor ?? '#f8fafc'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Border Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.borderColor ?? '#e2e8f0'} oninput={(e) => set('borderColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.borderColor ?? '#e2e8f0'} oninput={(e) => set('borderColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Padding (px)</span>
            <input type="number" value={element.properties.padding ?? 32} oninput={(e) => set('padding', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Radius (px)</span>
            <input type="number" value={element.properties.borderRadius ?? 8} oninput={(e) => set('borderRadius', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
        </div>

      <!-- ─── DIVIDER ──────────────────────────────────────────── -->
      {:else if element.type === 'Divider'}
        <div class="inspector-group">
          <div class="inspector-row">
            <span class="inspector-label">Style</span>
            <select value={element.properties.style ?? 'solid'} onchange={(e) => set('style', e.currentTarget.value)} class="inspector-select">
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.color ?? '#e5e7eb'} oninput={(e) => set('color', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.color ?? '#e5e7eb'} oninput={(e) => set('color', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Thickness (px)</span>
            <input type="number" min="1" max="10" value={element.properties.thickness ?? 1} oninput={(e) => set('thickness', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Width (%)</span>
            <input type="number" min="10" max="100" value={element.properties.widthPercent ?? 100} oninput={(e) => set('widthPercent', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
          <div class="inspector-grid-2">
            <div class="inspector-num-box"><span class="inspector-num-label">Top</span><input type="number" value={element.properties.marginTop ?? 32} oninput={(e) => set('marginTop', parseInt(e.currentTarget.value))} class="inspector-num-input" /></div>
            <div class="inspector-num-box"><span class="inspector-num-label">Bottom</span><input type="number" value={element.properties.marginBottom ?? 32} oninput={(e) => set('marginBottom', parseInt(e.currentTarget.value))} class="inspector-num-input" /></div>
          </div>
        </div>

      <!-- ─── COUNTDOWN TIMER ─────────────────────────────────── -->
      {:else if element.type === 'CountdownTimer'}
        <div class="inspector-group">
          <p class="inspector-group-title">Target</p>
          <div class="inspector-row">
            <span class="inspector-label">End Date</span>
            <input type="date" value={element.properties.targetDate ?? ''} oninput={(e) => set('targetDate', e.currentTarget.value)} class="inspector-text-input" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Expired Message</span>
            <input type="text" value={element.properties.expiredMessage ?? ''} oninput={(e) => set('expiredMessage', e.currentTarget.value)} class="inspector-text-input" />
          </div>
        </div>
        <div class="inspector-group">
          <p class="inspector-group-title">Colors</p>
          <div class="inspector-row">
            <span class="inspector-label">Background</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.bgColor ?? '#1e1b4b'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.bgColor ?? '#1e1b4b'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Block BG</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.blockBg ?? '#312e81'} oninput={(e) => set('blockBg', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.blockBg ?? '#312e81'} oninput={(e) => set('blockBg', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Text Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.textColor ?? '#ffffff'} oninput={(e) => set('textColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.textColor ?? '#ffffff'} oninput={(e) => set('textColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Accent Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.accentColor ?? '#7c3aed'} oninput={(e) => set('accentColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.accentColor ?? '#7c3aed'} oninput={(e) => set('accentColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
        </div>
        <div class="inspector-group">
          <p class="inspector-group-title">Labels</p>
          {#each [['labelDays','Days'], ['labelHours','Hours'], ['labelMinutes','Minutes'], ['labelSeconds','Seconds']] as [key, label]}
            <div class="inspector-row">
              <span class="inspector-label">{label}</span>
              <input type="text" value={element.properties[key] ?? label.toUpperCase().slice(0,4)} oninput={(e) => set(key, e.currentTarget.value)} class="inspector-text-input" />
            </div>
          {/each}
        </div>

      <!-- ─── BULLET LIST ──────────────────────────────────────── -->
      {:else if element.type === 'BulletList'}
        <div class="inspector-group">
          <p class="inspector-group-title">Items</p>
          <div class="space-y-1.5 mb-2">
            {#each (element.properties.items ?? []) as item, i}
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="flex: 1; font-size: 12px; color: var(--foreground); padding: 6px 8px; border-radius: 5px; border: 1px solid var(--border); background: var(--card); word-break: break-word;">{item}</span>
                <button type="button" onclick={() => removeBulletItem(i)} aria-label="Remove" class="toolbar-btn toolbar-btn--danger" style="width: 24px; height: 24px; font-size: 14px; border: 1px solid var(--border); border-radius: 5px; flex-shrink: 0;">✕</button>
              </div>
            {/each}
          </div>
          <div style="display: flex; gap: 6px;">
            <input type="text" bind:value={newBulletItem} class="inspector-text-input flex-1" placeholder="New item..." onkeydown={(e) => e.key === 'Enter' && addBulletItem()} />
            <button type="button" onclick={addBulletItem} aria-label="Add" class="inspector-add-btn">+</button>
          </div>
        </div>
        <div class="inspector-group">
          <p class="inspector-group-title">Style</p>
          <div class="inspector-row">
            <span class="inspector-label">Icon</span>
            <select value={element.properties.icon ?? 'check'} onchange={(e) => set('icon', e.currentTarget.value)} class="inspector-select">
              <option value="check">✓ Checkmark</option>
              <option value="star">★ Star</option>
              <option value="arrow">→ Arrow</option>
              <option value="dot">• Dot</option>
            </select>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Icon Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.iconColor ?? '#7c3aed'} oninput={(e) => set('iconColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.iconColor ?? '#7c3aed'} oninput={(e) => set('iconColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Text Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.textColor ?? '#374151'} oninput={(e) => set('textColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.textColor ?? '#374151'} oninput={(e) => set('textColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Font Size (px)</span>
            <input type="number" value={element.properties.fontSize ?? 16} oninput={(e) => set('fontSize', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Gap (px)</span>
            <input type="number" value={element.properties.gap ?? 12} oninput={(e) => set('gap', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
        </div>

      <!-- ─── TESTIMONIAL ──────────────────────────────────────── -->
      {:else if element.type === 'Testimonial'}
        <div class="inspector-group">
          <p class="inspector-group-title">Content</p>
          <div class="inspector-row">
            <span class="inspector-label">Quote</span>
            <textarea oninput={(e) => set('quote', e.currentTarget.value)} class="inspector-text-input" style="min-height: 80px; resize: vertical;">{element.properties.quote ?? ''}</textarea>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Name</span>
            <input type="text" value={element.properties.name ?? ''} oninput={(e) => set('name', e.currentTarget.value)} class="inspector-text-input" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Role / Company</span>
            <input type="text" value={element.properties.role ?? ''} oninput={(e) => set('role', e.currentTarget.value)} class="inspector-text-input" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Avatar URL</span>
            <input type="url" value={element.properties.avatar ?? ''} oninput={(e) => set('avatar', e.currentTarget.value)} class="inspector-text-input font-mono" placeholder="https://..." />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Rating (1–5)</span>
            <div class="inspector-seg-btn-row">
              {#each [1,2,3,4,5] as n}
                <button type="button" onclick={() => set('rating', n)} class="inspector-seg-btn {element.properties.rating === n ? 'is-active' : ''}">{n}★</button>
              {/each}
            </div>
          </div>
        </div>
        <div class="inspector-group">
          <p class="inspector-group-title">Appearance</p>
          <div class="inspector-row">
            <span class="inspector-label">BG Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.bgColor ?? '#f9fafb'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.bgColor ?? '#f9fafb'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Border Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.borderColor ?? '#e5e7eb'} oninput={(e) => set('borderColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.borderColor ?? '#e5e7eb'} oninput={(e) => set('borderColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Radius (px)</span>
            <input type="number" value={element.properties.borderRadius ?? 12} oninput={(e) => set('borderRadius', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
        </div>

      <!-- ─── SOCIAL PROOF ─────────────────────────────────────── -->
      {:else if element.type === 'SocialProof'}
        <div class="inspector-group">
          <div class="inspector-row">
            <span class="inspector-label">Headline</span>
            <input type="text" value={element.properties.headline ?? ''} oninput={(e) => set('headline', e.currentTarget.value)} class="inspector-text-input" />
          </div>
          <div class="inspector-row">
            <span class="inspector-label">BG Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.bgColor ?? '#f9fafb'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.bgColor ?? '#f9fafb'} oninput={(e) => set('bgColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Logo Color</span>
            <div class="inspector-color-row">
              <input type="color" value={element.properties.textColor ?? '#9ca3af'} oninput={(e) => set('textColor', e.currentTarget.value)} class="inspector-color-swatch" />
              <input type="text" value={element.properties.textColor ?? '#9ca3af'} oninput={(e) => set('textColor', e.currentTarget.value)} class="inspector-text-input flex-1 font-mono uppercase" />
            </div>
          </div>
        </div>
        <div class="inspector-group">
          <p class="inspector-group-title">Logos</p>
          <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px;">
            {#each (element.properties.logos ?? []) as logo, i}
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="flex: 1; font-size: 12px; padding: 5px 8px; border-radius: 5px; border: 1px solid var(--border); background: var(--card);">{logo}</span>
                <button type="button" onclick={() => removeLogo(i)} aria-label="Remove" class="toolbar-btn toolbar-btn--danger" style="width: 24px; height: 24px; font-size: 14px; border: 1px solid var(--border); border-radius: 5px; flex-shrink: 0;">✕</button>
              </div>
            {/each}
          </div>
          <div style="display: flex; gap: 6px;">
            <input type="text" bind:value={newLogo} class="inspector-text-input flex-1" placeholder="Brand name..." onkeydown={(e) => e.key === 'Enter' && addLogo()} />
            <button type="button" onclick={addLogo} aria-label="Add" class="inspector-add-btn">+</button>
          </div>
        </div>
      {/if}

      <!-- ─── Effects & Position ────────────────────────────── -->
      <div class="inspector-group">
        <p class="inspector-group-title">Effects & Position</p>
        <div class="inspector-row">
          <span class="inspector-label">Opacity</span>
          <input type="range" min="0" max="1" step="0.1" value={element.properties.opacity ?? 1} oninput={(e) => set('opacity', parseFloat(e.currentTarget.value))} style="flex: 1;" />
          <span style="font-size: 10px; min-width: 20px; text-align: right; color: var(--muted-foreground);">{element.properties.opacity ?? 1}</span>
        </div>
        <div class="inspector-row">
          <span class="inspector-label">Blur (px)</span>
          <input type="number" value={element.properties.blur ?? 0} oninput={(e) => set('blur', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
        </div>
        <div class="inspector-row">
          <span class="inspector-label">Position</span>
          <select value={element.properties.position ?? 'static'} onchange={(e) => set('position', e.currentTarget.value)} class="inspector-select">
            <option value="static">Static</option>
            <option value="relative">Relative</option>
            <option value="absolute">Absolute</option>
            <option value="fixed">Fixed</option>
            <option value="sticky">Sticky</option>
          </select>
        </div>
        {#if element.properties.position && element.properties.position !== 'static'}
          <div class="inspector-grid-2" style="margin-bottom: 8px;">
            <div class="inspector-num-box"><span class="inspector-num-label">Top</span><input type="text" value={element.properties.top ?? ''} oninput={(e) => set('top', e.currentTarget.value)} class="inspector-text-input" placeholder="auto" /></div>
            <div class="inspector-num-box"><span class="inspector-num-label">Bottom</span><input type="text" value={element.properties.bottom ?? ''} oninput={(e) => set('bottom', e.currentTarget.value)} class="inspector-text-input" placeholder="auto" /></div>
            <div class="inspector-num-box"><span class="inspector-num-label">Left</span><input type="text" value={element.properties.left ?? ''} oninput={(e) => set('left', e.currentTarget.value)} class="inspector-text-input" placeholder="auto" /></div>
            <div class="inspector-num-box"><span class="inspector-num-label">Right</span><input type="text" value={element.properties.right ?? ''} oninput={(e) => set('right', e.currentTarget.value)} class="inspector-text-input" placeholder="auto" /></div>
          </div>
          <div class="inspector-grid-2" style="margin-bottom: 8px;">
            <div class="inspector-num-box"><span class="inspector-num-label">Width</span><input type="text" value={element.properties.width ?? ''} oninput={(e) => set('width', e.currentTarget.value)} class="inspector-text-input" placeholder="auto" /></div>
            <div class="inspector-num-box"><span class="inspector-num-label">Height</span><input type="text" value={element.properties.height ?? ''} oninput={(e) => set('height', e.currentTarget.value)} class="inspector-text-input" placeholder="auto" /></div>
          </div>
          <div class="inspector-row">
            <span class="inspector-label">Z-Index</span>
            <input type="number" value={element.properties.zIndex ?? 0} oninput={(e) => set('zIndex', parseInt(e.currentTarget.value))} class="inspector-num-input w-24" />
          </div>
        {/if}
      </div>

      <!-- ─── Advanced: Extra Classes ─────────────────────────── -->
      <div class="inspector-group">
        <p class="inspector-group-title">Advanced</p>
        <div class="inspector-row">
          <span class="inspector-label">Extra Classes</span>
          <input type="text" value={element.styles} oninput={(e) => onUpdate(element!.id, { styles: e.currentTarget.value })} class="inspector-text-input font-mono" placeholder="e.g. rounded-xl shadow-lg" />
        </div>
      </div>

    </div><!-- /inspector-scroll -->
  {/if}
</div>

<style>
  .inspector-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }
  .inspector-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 32px;
    text-align: center;
    color: var(--muted-foreground);
    font-size: 13px;
    line-height: 1.6;
  }
  .inspector-empty-icon {
    opacity: 0.3;
  }
  .inspector-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .inspector-header-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .inspector-type-badge {
    background: var(--primary);
    color: var(--primary-foreground);
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .inspector-id {
    font-size: 10px;
    color: var(--muted-foreground);
    font-family: monospace;
    opacity: 0.6;
  }
  .inspector-header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .inspector-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    color: var(--muted-foreground);
    border: 1px solid var(--border);
    background: var(--card);
    cursor: pointer;
    transition: all 0.15s;
  }
  .inspector-icon-btn:hover {
    background: var(--muted);
    color: var(--foreground);
  }
  .inspector-icon-btn--danger:hover {
    background: rgba(239,68,68,0.1);
    border-color: rgba(239,68,68,0.4);
    color: #ef4444;
  }
  .inspector-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0 40px;
    scrollbar-width: thin;
  }
  .inspector-group {
    padding: 10px 14px 14px;
    border-bottom: 1px solid var(--border);
  }
  .inspector-group-title {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--muted-foreground);
    margin-bottom: 10px;
  }
  .inspector-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    min-width: 0;
    overflow: hidden;
  }
  .inspector-label {
    font-size: 10px;
    font-weight: 500;
    color: var(--muted-foreground);
    width: 72px;
    min-width: 72px;
    flex-shrink: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .inspector-text-input {
    flex: 1;
    min-width: 0;
    border: 1px solid var(--border);
    border-radius: 5px;
    background: var(--background);
    padding: 4px 7px;
    color: var(--foreground);
    font-size: 11px;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
    max-width: 100%;
  }
  .inspector-text-input:focus {
    border-color: var(--primary);
  }
  .inspector-select {
    flex: 1;
    min-width: 0;
    border: 1px solid var(--border);
    border-radius: 5px;
    background: var(--background);
    padding: 4px 7px;
    color: var(--foreground);
    font-size: 11px;
    outline: none;
    box-sizing: border-box;
    max-width: 100%;
  }
  .inspector-select:focus {
    border-color: var(--primary);
  }
  .inspector-color-row {
    display: flex;
    align-items: center;
    gap: 5px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }
  .inspector-color-swatch {
    width: 28px;
    height: 28px;
    border-radius: 5px;
    border: 1px solid var(--border);
    cursor: pointer;
    padding: 1px;
    flex-shrink: 0;
    background: transparent;
  }
  .inspector-num-input {
    border: 1px solid var(--border);
    border-radius: 5px;
    background: var(--background);
    padding: 4px 4px;
    color: var(--foreground);
    font-size: 11px;
    outline: none;
    text-align: center;
    transition: border-color 0.15s;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
  .inspector-num-input:focus {
    border-color: var(--primary);
  }
  .inspector-grid-4 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 5px;
    overflow: hidden;
  }
  .inspector-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
    overflow: hidden;
  }
  .inspector-num-box {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }
  .inspector-num-label {
    font-size: 9px;
    font-weight: 600;
    text-align: center;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .inspector-seg-btn-row {
    display: flex;
    gap: 3px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }
  .inspector-seg-btn {
    flex: 1;
    min-width: 0;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--card);
    padding: 3px 0;
    font-size: 10px;
    font-weight: 600;
    color: var(--muted-foreground);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .inspector-seg-btn:hover {
    background: var(--muted);
    color: var(--foreground);
  }
  .inspector-seg-btn.is-active {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--primary-foreground);
  }
  /* Toggle switch */
  .inspector-toggle {
    position: relative;
    width: 36px;
    height: 20px;
    border-radius: 10px;
    background: var(--muted);
    border: none;
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
  }
  .inspector-toggle.is-on {
    background: var(--primary);
  }
  .inspector-toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    background: white;
    transition: transform 0.2s;
    display: block;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .inspector-toggle.is-on .inspector-toggle-thumb {
    transform: translateX(16px);
  }
  .inspector-add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 5px;
    background: var(--primary);
    color: var(--primary-foreground);
    border: none;
    font-size: 18px;
    cursor: pointer;
    flex-shrink: 0;
    font-weight: 300;
    line-height: 1;
    transition: background 0.15s;
  }
  .inspector-add-btn:hover {
    background: color-mix(in srgb, var(--primary) 85%, black);
  }
  .toolbar-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    background: transparent;
    transition: all 0.15s;
  }
  .toolbar-btn--danger:hover {
    background: rgba(239,68,68,0.1);
    color: #ef4444;
  }
  :global(.flex-1) { flex: 1 1 0%; }
  :global(.font-mono) { font-family: ui-monospace, monospace; }
  :global(.uppercase) { text-transform: uppercase; }

  /* ─── Font Picker ─── */
  .font-picker-wrapper {
    flex: 1;
    position: relative;
    min-width: 0;
  }
  .font-picker-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    width: 100%;
    height: 28px;
    padding: 0 8px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--background);
    color: var(--foreground);
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .font-picker-trigger:hover {
    border-color: var(--primary);
  }
  .font-picker-trigger:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px hsl(var(--primary) / 0.15);
  }
</style>
