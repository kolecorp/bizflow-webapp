<script lang="ts">
  import { goto } from "$app/navigation";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";
  import * as Sheet from "$lib/components/ui/sheet";
  import { mode, toggleMode } from "mode-watcher";
  import { dndzone, type DndEvent } from "svelte-dnd-action";
  import CanvasNode from "$lib/components/builder/CanvasNode.svelte";
  import Inspector from "$lib/components/builder/Inspector.svelte";
  import LayersPanel from "$lib/components/builder/LayersPanel.svelte";
  import FontLibraryModal from "$lib/components/builder/FontLibraryModal.svelte";
  import { SYSTEM_FONTS } from "$lib/data/google-fonts";
  import PreviewCanvas from "$lib/components/builder/PreviewCanvas.svelte";
  import AiDesignModal from "$lib/components/builder/AiDesignModal.svelte";
  import { toast } from "svelte-sonner";
  import {
    createNewElement,
    type CanvasElement,
    type ElementType,
    PRESETS,
    PALETTE_ITEMS,
  } from "$lib/types/builder";
  import {
    updateElementInTree,
    handleDndInTree,
    deleteElementInTree,
    duplicateElementInTree,
    moveElementInTree,
    groupElementsInTree,
    unparentElementInTree,
    findElementInTree,
  } from "$lib/utils/builderDnd";
  import {
    ArrowLeft,
    BookOpen,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Code2,
    Copy,
    Eye,
    Gift,
    Globe,
    HelpCircle,
    Image,
    LayoutTemplate,
    LineChart,
    Mail,
    Minus,
    Monitor,
    MoreVertical,
    Pencil,
    Plus,
    Redo2,
    Rocket,
    RotateCcw,
    Search,
    Settings,
    Smartphone,
    Square,
    Star,
    Tablet,
    Trash2,
    Undo2,
    Video,
    WandSparkles,
    ZoomIn,
    ZoomOut,
    Keyboard,
    MousePointer2,
    Hand,
    ZoomIn as ZoomTool,
  } from "@lucide/svelte";
  import { startTour } from "$lib/config/tour";
  import { tourConfigurations } from "$lib/config/tourConfig";

  /* ─── Canvas State ─── */
  let pageTitle = $state("Untitled Page");
  let viewport = $state("Desktop");
  let published = $state(false);

  let canvasElements = $state<CanvasElement[]>([]);
  let selectedElementId = $state<string | null>(null);

  /* ─── History State ─── */
  let history = $state<string[]>([JSON.stringify([])]);
  let historyIndex = $state(0);

  /* ─── Sidebar State ─── */
  let leftSidebarOpen = $state(true);
  let rightSidebarOpen = $state(true);
  let sidebarMode = $state<"docked" | "floating">("docked");
  let leftTab = $state<"elements" | "presets">("presets");
  let selectedCategory = $state("layout");

  /* ─── Pan & Zoom State ─── */
  let panX = $state(0);
  let panY = $state(0);
  let zoom = $state(1);
  let isPanning = $state(false);
  let spaceHeld = $state(false);
  let lastPanX = $state(0);
  let lastPanY = $state(0);
  let canvasViewport: HTMLElement;

  /* ─── Cursor Mode ─── */
  type CursorMode = "select" | "pan";
  let cursorMode = $state<CursorMode>("select");
  const isInPanMode = $derived(cursorMode === "pan" || spaceHeld);

  /* ─── Settings & Preview ─── */
  let activeSetting = $state<string | null>(null);
  let showPresetConfirm = $state<string | null>(null);
  let showAiModal = $state(false);
  let showShortcuts = $state(false);
  let showFontLibrary = $state(false);
  let previewOpen = $state(false);
  let previewViewport = $state("Desktop");
  let rightTab = $state<"inspector" | "layers">("inspector");
  let showBuilderMenu = $state(false);
  let showPublishPanel = $state(false);
  let builderMenuElement: HTMLDivElement;
  let publishPanelElement: HTMLDivElement;
  let builderMenuTrigger: HTMLButtonElement;
  let publishPanelTrigger: HTMLButtonElement;

  // Publish settings
  let publishMethod = $state<"bizflow" | "gas" | "html" | "custom">("bizflow");
  let gasScriptUrl = $state("");
  let customDomain = $state("");
  let publishSlug = $state("my-page");
  let seoTitle = $state("");
  let seoDescription = $state("");
  let isPublishing = $state(false);

  function closeBuilderMenu() {
    showBuilderMenu = false;
    queueMicrotask(() => builderMenuTrigger?.focus());
  }

  function closePublishPanel() {
    showPublishPanel = false;
    queueMicrotask(() => publishPanelTrigger?.focus());
  }

  $effect(() => {
    if (showBuilderMenu) queueMicrotask(() => builderMenuElement?.focus());
    if (showPublishPanel) queueMicrotask(() => publishPanelElement?.focus());
  });

  function startBuilderTour() {
    closeBuilderMenu();
    const steps = tourConfigurations["/extensions/marketing/builder"];
    if (steps) startTour(steps);
  }

  async function handlePublish() {
    if (publishMethod === "gas" && !gasScriptUrl.trim()) {
      toast.error("Apps Script URL is required");
      return;
    }
    if (publishMethod === "custom" && !customDomain.trim()) {
      toast.error("Custom domain is required");
      return;
    }
    if (publishMethod === "html") {
      toast.info("HTML export is not available yet");
      return;
    }
    isPublishing = true;
    // Simulate publish
    await new Promise((r) => setTimeout(r, 1400));
    published = true;
    isPublishing = false;
    closePublishPanel();
  }
  let workspaceFonts = $state<string[]>(["Inter", "Roboto"]);

  /* ─── Page Settings Data ─── */
  let customHeadCode = $state("");
  let customBodyCode = $state("");
  let ga4Id = $state("");
  let fbPixelId = $state("");
  let gtmId = $state("");

  const pageSettings = [
    { name: "General Settings", icon: Settings },
    { name: "SEO & Social Share", icon: Globe },
    { name: "Custom Code", icon: Code2 },
    { name: "Tracking & Analytics", icon: LineChart },
  ];

  /* ─── Derived ─── */
  const selectedElement = $derived.by((): CanvasElement | null => {
    if (!selectedElementId) return null;
    let found: CanvasElement | null = null;
    const find = (arr: CanvasElement[]) => {
      for (const el of arr) {
        if (el.id === selectedElementId) found = el;
        if (!found && el.children?.length) find(el.children);
      }
    };
    find(canvasElements);
    return found;
  });

  const filteredPalette = $derived(
    PALETTE_ITEMS.filter((i) => i.category === selectedCategory),
  );

  /* ─── History Actions ─── */
  function commitHistory() {
    const serialized = JSON.stringify(canvasElements);
    if (history[historyIndex] === serialized) return; // No change
    // If we are not at the end of history, truncate the future
    if (historyIndex < history.length - 1) {
      history = history.slice(0, historyIndex + 1);
    }
    history.push(serialized);
    if (history.length > 50) history.shift(); // Keep last 50 states
    historyIndex = history.length - 1;
  }

  function undo() {
    if (historyIndex > 0) {
      historyIndex--;
      canvasElements = JSON.parse(history[historyIndex]);
      // Attempt to keep selection valid, otherwise clear
      if (
        selectedElementId &&
        !JSON.stringify(canvasElements).includes(selectedElementId)
      ) {
        selectedElementId = null;
      }
    }
  }

  function redo() {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      canvasElements = JSON.parse(history[historyIndex]);
    }
  }

  /* ─── Actions ─── */
  function publish() {
    published = !published;
  }

  function addElement(type: ElementType) {
    const el = createNewElement(type);
    canvasElements = [...canvasElements, el];
    selectedElementId = el.id;
    commitHistory();
  }

  function updateElement(id: string, updates: Partial<CanvasElement>) {
    canvasElements = updateElementInTree(canvasElements, id, updates);
    commitHistory();
  }

  function deleteElement(id: string) {
    canvasElements = deleteElementInTree(canvasElements, id);
    if (selectedElementId === id) selectedElementId = null;
    commitHistory();
  }

  function duplicateElement(id: string) {
    canvasElements = duplicateElementInTree(canvasElements, id);
    commitHistory();
  }

  function loadPreset(presetId: string) {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    canvasElements = preset.build();
    selectedElementId = null;
    showPresetConfirm = null;
    leftTab = "elements";
    commitHistory();
  }

  function moveElement(
    elementId: string,
    targetParentId: string,
    targetIndex: number,
  ) {
    canvasElements = moveElementInTree(
      canvasElements,
      elementId,
      targetParentId,
      targetIndex,
    );
    commitHistory();
  }

  function groupElements(ids: string[], containerType: "Section" | "Column") {
    canvasElements = groupElementsInTree(canvasElements, ids, containerType);
    selectedElementId = null;
    commitHistory();
  }

  function unparentElement(elementId: string) {
    canvasElements = unparentElementInTree(canvasElements, elementId);
    commitHistory();
  }

  /* ─── Font Library Handlers ─── */
  function handleInstallFont(family: string) {
    if (!workspaceFonts.includes(family)) {
      workspaceFonts = [...workspaceFonts, family];
    }
  }

  function handleSelectFont(family: string) {
    if (!selectedElementId) return;
    const el = findElementInTree(canvasElements, selectedElementId);
    if (!el) return;

    // We update via updateElementInTree to get history commit
    updateElement(selectedElementId, {
      properties: { ...el.properties, fontFamily: family },
    });
  }

  const loadedCanvasFonts = new Set<string>();

  function loadCanvasFont(family: string) {
    if (
      !family ||
      loadedCanvasFonts.has(family) ||
      SYSTEM_FONTS.some((f) => f.family === family)
    )
      return;
    loadedCanvasFonts.add(family);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@300;400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }

  $effect(() => {
    function loadFonts(elements: CanvasElement[]) {
      for (const el of elements) {
        if (el.properties.fontFamily) {
          loadCanvasFont(el.properties.fontFamily);
        }
        if (el.children) {
          loadFonts(el.children);
        }
      }
    }
    loadFonts(canvasElements);
  });

  /* ─── DND Handlers ─── */
  function handleDndConsider(
    containerId: string,
    e: CustomEvent<DndEvent<CanvasElement>>,
  ) {
    canvasElements = handleDndInTree(
      canvasElements,
      containerId,
      e.detail.items,
    );
  }

  function handleDndFinalize(
    containerId: string,
    e: CustomEvent<DndEvent<CanvasElement>>,
  ) {
    let newItems = [...e.detail.items];
    const draggedId = e.detail.info.id;
    if (draggedId.startsWith("palette-")) {
      const idx = newItems.findIndex((i) => i.id === draggedId);
      if (idx !== -1) {
        newItems[idx] = createNewElement(newItems[idx].type);
      }
    }
    canvasElements = handleDndInTree(canvasElements, containerId, newItems);
    commitHistory();
  }

  /* ─── Pan & Zoom Handlers ─── */
  function handleViewportMouseDown(e: MouseEvent) {
    if (isInPanMode || e.button === 1) {
      isPanning = true;
      lastPanX = e.clientX;
      lastPanY = e.clientY;
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function handleViewportMouseMove(e: MouseEvent) {
    if (!isPanning) return;
    panX += e.clientX - lastPanX;
    panY += e.clientY - lastPanY;
    lastPanX = e.clientX;
    lastPanY = e.clientY;
  }

  function handleViewportMouseUp() {
    isPanning = false;
  }

  function handleViewportWheel(e: WheelEvent) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      const newZoom = Math.max(0.2, Math.min(3, zoom + delta));
      // Zoom toward mouse position
      const rect = canvasViewport?.getBoundingClientRect();
      if (rect) {
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        panX = mx - (mx - panX) * (newZoom / zoom);
        panY = my - (my - panY) * (newZoom / zoom);
      }
      zoom = newZoom;
    } else if (spaceHeld) {
      e.preventDefault();
      panX -= e.deltaX;
      panY -= e.deltaY;
    }
  }

  function resetView() {
    panX = 0;
    panY = 0;
    zoom = 1;
  }

  /* ─── Keyboard shortcuts ─── */
  function handleKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    const isEditing =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target.isContentEditable;

    // Undo / Redo
    if ((e.ctrlKey || e.metaKey) && !isEditing) {
      if (e.key === "z") {
        if (e.shiftKey) redo();
        else undo();
        e.preventDefault();
        return;
      }
      if (e.key === "y") {
        redo();
        e.preventDefault();
        return;
      }
    }

    if (e.code === "Space" && !isEditing) {
      e.preventDefault();
      spaceHeld = true;
    }
    // Tool hotkeys
    if (!isEditing) {
      if (e.key === "v" || e.key === "V") cursorMode = "select";
      if (e.key === "h" || e.key === "H") cursorMode = "pan";
    }
    if (
      (e.key === "Delete" || e.key === "Backspace") &&
      selectedElementId &&
      !isEditing
    ) {
      deleteElement(selectedElementId);
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "=") {
      e.preventDefault();
      zoom = Math.min(3, zoom + 0.1);
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "-") {
      e.preventDefault();
      zoom = Math.max(0.2, zoom - 0.1);
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "0") {
      e.preventDefault();
      resetView();
    }
    if (
      (e.metaKey || e.ctrlKey) &&
      e.key === "d" &&
      selectedElementId &&
      !isEditing
    ) {
      e.preventDefault();
      duplicateElement(selectedElementId);
    }
  }
  function handleKeyUp(e: KeyboardEvent) {
    if (e.code === "Space") spaceHeld = false;
  }

  /* ─── Palette tiles for drag source ─── */
  const paletteDragItems = $derived(
    filteredPalette.map((item) => ({
      ...createNewElement(item.type),
      id: `palette-${item.type}`,
    })),
  );
</script>

<svelte:window onkeydown={handleKeyDown} onkeyup={handleKeyUp} />
<svelte:head><title>{pageTitle} | MK Builder</title></svelte:head>

<!-- Preset confirmation modal -->
{#if showPresetConfirm}
  {@const preset = PRESETS.find((p) => p.id === showPresetConfirm)}
  <div
    class="preset-confirm-overlay"
    onclick={() => (showPresetConfirm = null)}
    role="dialog"
    aria-modal="true"
  >
    <div
      class="preset-confirm-modal"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
    >
      <div class="mb-4 flex justify-center">
        <LayoutTemplate class="size-10 text-primary" />
      </div>
      <h3 class="preset-confirm-title">Load "{preset?.name}"?</h3>
      <p class="preset-confirm-desc">
        This will replace your current canvas. This action cannot be undone.
      </p>
      <div class="preset-confirm-actions">
        <button
          type="button"
          onclick={() => (showPresetConfirm = null)}
          class="btn-secondary">Cancel</button
        >
        <button
          type="button"
          onclick={() => loadPreset(showPresetConfirm!)}
          class="btn-primary">Yes, Load Preset</button
        >
      </div>
    </div>
  </div>
{/if}

<main
  class="h-dvh w-full overflow-hidden flex flex-col bg-background text-foreground font-sans"
  style="user-select: {isPanning ? 'none' : 'auto'};"
>
  <!-- ═══ TOP BAR ═══ -->
  <header
    class="dashboard-page-header flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border/60 px-3 z-10"
  >
    <NoiseOverlay intensity="light" />

    <!-- Left -->
    <div
      class="flex flex-1 min-w-0 items-center justify-start gap-2 relative z-10"
    >
      <button
        type="button"
        aria-label="Go back"
        onclick={() => goto("/extensions/marketing")}
        class="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft class="size-4" />
      </button>
      <span class="h-4 w-px bg-border/60 mx-1"></span>
      <div
        class="hidden sm:flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
      >
        <WandSparkles class="size-4" />
      </div>
      <div class="min-w-0 hidden md:block pl-1 mr-4">
        <p class="text-sm font-bold text-foreground truncate">MK Builder</p>
        <p class="text-xs text-muted-foreground truncate">
          Marketing Page Builder
        </p>
      </div>
    </div>

    <!-- Center: Page name + viewport -->
    <div
      class="hidden sm:flex flex-1 min-w-0 items-center justify-center gap-4 relative z-10"
    >
      <div class="flex items-center justify-center min-w-0 max-w-full group">
        <input
          bind:value={pageTitle}
          aria-label="Page name"
          class="min-w-0 max-w-[160px] lg:max-w-[220px] truncate border-0 bg-transparent text-xs font-semibold text-foreground outline-none text-center hover:bg-muted focus:bg-muted rounded px-2 py-1 transition-colors"
        />
        <Pencil
          class="size-3 ml-1 text-muted-foreground opacity-0 group-hover:opacity-60 transition-opacity"
        />
      </div>
      <span class="hidden lg:block h-4 w-px shrink-0 bg-border/60"></span>
      <!-- Viewport switcher -->
      <div
        class="hidden lg:flex shrink-0 items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-1"
      >
        <button
          type="button"
          aria-label="Desktop view"
          onclick={() => (viewport = "Desktop")}
          class="rounded-md p-2 transition-all {viewport === 'Desktop'
            ? 'bg-card shadow-sm text-foreground scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
        >
          <Monitor class="size-4" />
        </button>
        <button
          type="button"
          aria-label="Tablet view"
          onclick={() => (viewport = "Tablet")}
          class="rounded-md p-2 transition-all {viewport === 'Tablet'
            ? 'bg-card shadow-sm text-foreground scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
        >
          <Tablet class="size-4" />
        </button>
        <button
          type="button"
          aria-label="Mobile view"
          onclick={() => (viewport = "Mobile")}
          class="rounded-md p-2 transition-all {viewport === 'Mobile'
            ? 'bg-card shadow-sm text-foreground scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
        >
          <Smartphone class="size-4" />
        </button>
      </div>
    </div>

    <!-- Right: Actions -->
    <div
      class="flex flex-1 min-w-0 items-center justify-end gap-2 relative z-10"
    >
      <!-- Sidebar mode -->
      <div
        class="hidden md:flex shrink-0 items-center rounded-lg border border-border/60 bg-muted/30 p-1"
      >
        <button
          type="button"
          onclick={() => (sidebarMode = "docked")}
          class="rounded-md px-2.5 py-1 text-xs font-semibold transition-colors {sidebarMode ===
          'docked'
            ? 'bg-card shadow-sm text-foreground'
            : 'text-muted-foreground hover:text-foreground'}"
        >
          Docked
        </button>
        <button
          type="button"
          onclick={() => (sidebarMode = "floating")}
          class="rounded-md px-2.5 py-1 text-xs font-semibold transition-colors {sidebarMode ===
          'floating'
            ? 'bg-card shadow-sm text-foreground'
            : 'text-muted-foreground hover:text-foreground'}"
        >
          Float
        </button>
      </div>

      <!-- Undo / Redo -->
      <button
        type="button"
        class="builder-icon-btn disabled:opacity-30"
        title="Undo (Ctrl+Z)"
        onclick={undo}
        disabled={historyIndex === 0}><Undo2 class="size-4" /></button
      >
      <button
        type="button"
        class="builder-icon-btn disabled:opacity-30"
        title="Redo (Ctrl+Y)"
        onclick={redo}
        disabled={historyIndex === history.length - 1}
        ><Redo2 class="size-4" /></button
      >

      <button
        type="button"
        bind:this={publishPanelTrigger}
        onclick={() => (showPublishPanel = true)}
        class="builder-publish shrink-0 ml-2"
      >
        {published ? "Published" : "Publish"}
        <ChevronDown class="size-4" />
      </button>

      <!-- Builder hamburger menu trigger -->
      <button
        type="button"
        bind:this={builderMenuTrigger}
        class="builder-icon-btn"
        title="More options"
        onclick={() => (showBuilderMenu = !showBuilderMenu)}
      >
        <MoreVertical class="size-4" />
      </button>
    </div>
  </header>

  <!-- ═══ MAIN AREA ═══ -->
  <div class="flex flex-1 overflow-hidden relative">
    <!-- ─── LEFT SIDEBAR ─── -->
    <div
      class="h-full shrink-0 flex transition-all duration-300 ease-in-out z-40 {sidebarMode ===
      'floating'
        ? 'absolute top-0 bottom-0 left-0 shadow-2xl'
        : 'relative'}"
      style="margin-left: {leftSidebarOpen ? '0' : '-460px'};"
    >
      <div
        class="w-[460px] h-full flex shrink-0 bg-card border-r border-border/60 shadow-sm relative"
      >
        <!-- Sidebar toggle tab -->
        <button
          onclick={() => (leftSidebarOpen = !leftSidebarOpen)}
          aria-label="Toggle left sidebar"
          class="absolute top-1/2 -right-8 z-50 flex h-16 w-8 -translate-y-1/2 items-center justify-center rounded-r-xl border border-l-0 border-border/60 bg-card shadow-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight
            class="size-4 transition-transform duration-300 {leftSidebarOpen
              ? 'rotate-180'
              : ''}"
          />
        </button>

        <!-- ─── Presets Column ─── -->
        <aside
          class="w-[200px] shrink-0 h-full flex flex-col border-r border-border/60 relative overflow-hidden"
        >
          <NoiseOverlay intensity="light" />
          <div class="app-sidebar__glow" aria-hidden="true"></div>

          <div class="p-4 pb-3 shrink-0 relative z-10">
            <p class="builder-label">Campaign Presets</p>
          </div>

          <div
            class="flex-1 overflow-y-auto px-3 space-y-1.5 pb-4 custom-scrollbar relative z-10"
          >
            {#each PRESETS as preset}
              <button
                type="button"
                onclick={() => (showPresetConfirm = preset.id)}
                class="preset-card group w-full text-left"
              >
                <div class="flex items-start gap-3">
                  <div class="mt-0.5">
                    <LayoutTemplate
                      class="size-4 text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p
                      class="text-xs font-semibold leading-tight text-foreground truncate"
                    >
                      {preset.name}
                    </p>
                    <p
                      class="text-[10px] text-muted-foreground mt-0.5 leading-snug line-clamp-2"
                    >
                      {preset.description}
                    </p>
                  </div>
                </div>
              </button>
            {/each}
            <div class="pt-2 border-t border-border/60 mt-2">
              <button
                type="button"
                onclick={() => {
                  canvasElements = [];
                  selectedElementId = null;
                }}
                class="preset-card group w-full text-left"
              >
                <div class="flex items-start gap-3">
                  <div class="mt-0.5">
                    <Square
                      class="size-4 text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p
                      class="text-xs font-semibold leading-tight text-foreground"
                    >
                      Blank Canvas
                    </p>
                    <p class="text-[10px] text-muted-foreground mt-0.5">
                      Start from scratch
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Settings -->
          <div class="shrink-0 border-t border-border/60 bg-card relative z-10">
            <div class="px-3 py-3">
              <p class="builder-label mb-2">Page Settings</p>
              <div class="space-y-0.5">
                {#each pageSettings as setting}
                  <button
                    type="button"
                    onclick={() => (activeSetting = setting.name)}
                    class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <setting.icon class="size-3.5 shrink-0" />
                    <span class="truncate">{setting.name}</span>
                  </button>
                {/each}
              </div>
            </div>

            <!-- AI Design Generator -->
            <div
              class="mx-3 mb-3 overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-3 relative"
            >
              <div class="flex items-center gap-2">
                <WandSparkles class="size-3.5 text-primary" />
                <span class="text-xs font-semibold text-foreground"
                  >AI Design Generator</span
                >
                <span
                  class="rounded bg-primary px-1.5 py-0.5 text-[8px] font-bold text-primary-foreground ml-auto"
                  >NEW</span
                >
              </div>
              <button
                type="button"
                onclick={() => (showAiModal = true)}
                class="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Generate Design
              </button>
            </div>
          </div>
        </aside>

        <!-- ─── Elements Column ─── -->
        <aside class="w-[260px] shrink-0 h-full flex flex-col bg-muted/5">
          <div class="p-4 pb-3 shrink-0 border-b border-border/60">
            <p class="builder-label">Add Elements</p>
            <!-- Category tabs -->
            <div
              class="mt-3 grid grid-cols-2 gap-1 rounded-lg border border-border/40 bg-muted/30 p-1"
            >
              {#each [["layout", "Layout"], ["content", "Content"], ["conversion", "Convert"], ["media", "Media"]] as [cat, label]}
                <button
                  type="button"
                  onclick={() => (selectedCategory = cat)}
                  class="rounded-md px-2 py-1.5 text-[10px] font-semibold transition-colors {selectedCategory ===
                  cat
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'}"
                >
                  {label}
                </button>
              {/each}
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-3 py-3 custom-scrollbar">
            <div class="grid grid-cols-2 gap-2">
              {#each filteredPalette as item}
                <button
                  type="button"
                  onclick={() => addElement(item.type)}
                  class="palette-tile group"
                >
                  <div class="palette-tile-preview">
                    <!-- Mini visual preview per type -->
                    {#if item.type === "Section"}
                      <div class="mini-section"></div>
                    {:else if item.type === "Grid"}
                      <div class="mini-grid"><span></span><span></span></div>
                    {:else if item.type === "Column"}
                      <div class="mini-column">
                        <span></span><span></span><span></span>
                      </div>
                    {:else if item.type === "Headline"}
                      <div class="mini-headline">Aa</div>
                    {:else if item.type === "Subheadline"}
                      <div class="mini-subheadline">Aa</div>
                    {:else if item.type === "Paragraph"}
                      <div class="mini-para">
                        <span></span><span></span><span style="width:65%"
                        ></span>
                      </div>
                    {:else if item.type === "Button"}
                      <div class="mini-button">CTA</div>
                    {:else if item.type === "Image"}
                      <div class="mini-image">🖼</div>
                    {:else if item.type === "Video"}
                      <div class="mini-video">▶</div>
                    {:else if item.type === "OptInForm"}
                      <div class="mini-form">
                        <span></span><span class="mini-form-btn"></span>
                      </div>
                    {:else if item.type === "Divider"}
                      <div class="mini-divider"></div>
                    {:else if item.type === "CountdownTimer"}
                      <div class="mini-timer">
                        <span>00</span><span>:</span><span>00</span>
                      </div>
                    {:else if item.type === "BulletList"}
                      <div class="mini-list">
                        <span></span><span></span><span></span>
                      </div>
                    {:else if item.type === "Testimonial"}
                      <div class="mini-testimonial">
                        <span class="mini-stars">★★★</span><span
                          class="mini-quote"
                        ></span>
                        <div class="mini-author">
                          <span></span><span></span>
                        </div>
                      </div>
                    {:else if item.type === "SocialProof"}
                      <div class="mini-logos">
                        <span>Aa</span><span>Bb</span><span>Cc</span>
                      </div>
                    {/if}
                  </div>
                  <span class="palette-tile-label">{item.label}</span>
                </button>
              {/each}
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- ═══ CANVAS VIEWPORT ═══ -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <section
      class="flex-1 h-full min-w-0 overflow-hidden relative canvas-bg"
      style="cursor: {isPanning
        ? 'grabbing'
        : isInPanMode
          ? 'grab'
          : 'default'};"
      bind:this={canvasViewport}
      onmousedown={handleViewportMouseDown}
      onmousemove={handleViewportMouseMove}
      onmouseup={handleViewportMouseUp}
      onmouseleave={handleViewportMouseUp}
      onwheel={handleViewportWheel}
      aria-label="Canvas"
      onclick={(e) => {
        if (
          !isInPanMode &&
          (e.target === canvasViewport ||
            (e.target as HTMLElement).classList.contains("canvas-bg"))
        )
          selectedElementId = null;
      }}
    >
      <!-- Canvas transform container -->
      <div
        style="transform: translate({panX}px, {panY}px) scale({zoom}); transform-origin: 0 0; will-change: transform; position: absolute; top: 60px; left: 50%; margin-left: {viewport ===
        'Mobile'
          ? '-187px'
          : viewport === 'Tablet'
            ? '-270px'
            : '-560px'};"
      >
        <div
          class="canvas-page-sheet"
          style="width: {viewport === 'Mobile'
            ? '375px'
            : viewport === 'Tablet'
              ? '540px'
              : '1120px'}; min-height: 700px;"
          use:dndzone={{
            items: canvasElements,
            flipDurationMs: 200,
            dropTargetStyle: {
              outline: "2px dashed hsl(var(--primary))",
              outlineOffset: "-2px",
              background: "hsl(var(--primary) / 0.04)",
            },
          }}
          onconsider={(e) => handleDndConsider("root", e)}
          onfinalize={(e) => handleDndFinalize("root", e)}
          onclick={(e) => {
            if (e.currentTarget === e.target) selectedElementId = null;
          }}
        >
          {#each canvasElements as el (el.id)}
            <CanvasNode
              element={el}
              {selectedElementId}
              onSelect={(id) => (selectedElementId = id)}
              onUpdateElement={updateElement}
              onDelete={deleteElement}
              onDuplicate={duplicateElement}
              onDndConsider={handleDndConsider}
              onDndFinalize={handleDndFinalize}
            />
          {/each}
          {#if canvasElements.length === 0}
            <div class="canvas-empty-state">
              <div class="canvas-empty-icon">🎨</div>
              <h3>Your canvas is empty</h3>
              <p>
                Choose a preset on the left to start with a full template,<br
                />or click any element in the panel to add it.
              </p>
              <div class="canvas-empty-shortcuts">
                <kbd>Space</kbd><span>+ drag to pan</span>
                <kbd>Ctrl</kbd><span>+ scroll to zoom</span>
                <kbd>Del</kbd><span>to delete selected</span>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Pan mode overlay: absorbs all pointer events so DND/clicks can't fire on elements -->
      {#if isInPanMode}
        <div
          style="position: absolute; inset: 0; z-index: 50; cursor: {isPanning
            ? 'grabbing'
            : 'grab'};"
          onmousedown={handleViewportMouseDown}
        ></div>
      {/if}

      <!-- Zoom Controls Overlay -->
      <div class="canvas-zoom-controls">
        <button
          type="button"
          onclick={() => (zoom = Math.max(0.2, zoom - 0.1))}
          class="zoom-btn"
          title="Zoom out"
        >
          <ZoomOut class="size-4" />
        </button>
        <button
          type="button"
          onclick={resetView}
          class="zoom-pct"
          title="Reset view"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onclick={() => (zoom = Math.min(3, zoom + 0.1))}
          class="zoom-btn"
          title="Zoom in"
        >
          <ZoomIn class="size-4" />
        </button>
      </div>

      <!-- Cursor Mode Toolbar -->
      <div class="canvas-cursor-tools">
        <button
          type="button"
          class="cursor-tool-btn {cursorMode === 'select' ? 'is-active' : ''}"
          onclick={() => (cursorMode = "select")}
          title="Select (V)"
        >
          <MousePointer2 class="size-4" />
        </button>
        <button
          type="button"
          class="cursor-tool-btn {cursorMode === 'pan' ? 'is-active' : ''}"
          onclick={() => (cursorMode = "pan")}
          title="Pan / Hand (H)"
        >
          <Hand class="size-4" />
        </button>
      </div>

      <!-- Viewport indicator -->
      <div class="canvas-viewport-indicator">
        <Monitor class="size-3" />
        {viewport}
        {#if selectedElement}
          <span class="canvas-viewport-sep">·</span>
          <span class="canvas-selected-badge">{selectedElement.type}</span>
          <button
            type="button"
            onclick={() => deleteElement(selectedElementId!)}
            class="canvas-delete-btn"
            title="Delete"
          >
            <Trash2 class="size-3" />
          </button>
        {/if}
      </div>
    </section>

    <!-- ─── RIGHT INSPECTOR ─── -->
    <div
      class="h-full shrink-0 flex transition-all duration-300 ease-in-out z-40 {sidebarMode ===
      'floating'
        ? 'absolute top-0 bottom-0 right-0 shadow-2xl'
        : 'relative'}"
      style="margin-right: {rightSidebarOpen ? '0' : '-320px'};"
    >
      <div
        class="w-[320px] h-full flex flex-col shrink-0 bg-card border-l border-border/60 shadow-sm relative overflow-visible"
      >
        <!-- Toggle tab -->
        <button
          onclick={() => (rightSidebarOpen = !rightSidebarOpen)}
          aria-label="Toggle right sidebar"
          class="absolute top-1/2 -left-8 z-50 flex h-16 w-8 -translate-y-1/2 items-center justify-center rounded-l-xl border border-r-0 border-border/60 bg-card shadow-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft
            class="size-4 transition-transform duration-300 {rightSidebarOpen
              ? 'rotate-180'
              : ''}"
          />
        </button>

        <NoiseOverlay intensity="light" />
        <div
          class="app-sidebar__glow"
          aria-hidden="true"
          style="inset: 0 -35% 0 auto; transform: scaleX(-1);"
        ></div>

        <!-- Right sidebar tabs -->
        <div
          class="shrink-0 flex border-b border-border/60 bg-muted/10 relative z-10"
        >
          <button
            type="button"
            onclick={() => (rightTab = "inspector")}
            class="flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors {rightTab ===
            'inspector'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'}"
          >
            Inspector
          </button>
          <button
            type="button"
            onclick={() => (rightTab = "layers")}
            class="flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors {rightTab ===
            'layers'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'}"
          >
            Layers
          </button>
        </div>

        <!-- Tab bodies -->
        <div class="flex-1 overflow-hidden relative z-10">
          {#if rightTab === "inspector"}
            <div class="h-full overflow-y-auto" style="scrollbar-width:thin;">
              <Inspector
                element={selectedElement}
                onUpdate={updateElement}
                onDelete={deleteElement}
                onDuplicate={duplicateElement}
                onOpenFontLibrary={() => (showFontLibrary = true)}
              />
            </div>
          {:else if rightTab === "layers"}
            <div
              class="h-full overflow-y-auto py-2"
              style="scrollbar-width:thin;"
            >
              <LayersPanel
                elements={canvasElements}
                {selectedElementId}
                onSelect={(id) => {
                  selectedElementId = id;
                  rightTab = "inspector";
                }}
                onDelete={deleteElement}
                onMoveElement={moveElement}
                onGroupElements={groupElements}
                onUnparentElement={unparentElement}
              />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</main>

{#if showBuilderMenu}
  <!-- Backdrop -->
  <div
    class="fixed inset-0"
    style="z-index: 9998;"
    role="presentation"
    onclick={closeBuilderMenu}
  ></div>

  <!-- Floating menu -->
  <div
    bind:this={builderMenuElement}
    class="builder-floating-menu"
    role="menu"
    tabindex="-1"
    onkeydown={(event) => event.key === "Escape" && closeBuilderMenu()}
  >
    <div class="builder-floating-menu__header">
      <WandSparkles class="size-3.5 text-primary" />
      <span>MK Builder</span>
    </div>

    <div class="builder-floating-menu__section">
      <button
        type="button"
        role="menuitem"
        class="builder-floating-menu__item"
        onclick={startBuilderTour}
      >
        <span class="builder-floating-menu__item-icon">
          <HelpCircle class="size-4" />
        </span>
        <span class="builder-floating-menu__item-body">
          <span class="builder-floating-menu__item-label">Page Tour</span>
          <span class="builder-floating-menu__item-desc"
            >Guided walkthrough of the builder</span
          >
        </span>
      </button>

      <button
        type="button"
        role="menuitem"
        class="builder-floating-menu__item"
        onclick={() => {
          closeBuilderMenu();
          showShortcuts = true;
        }}
      >
        <span class="builder-floating-menu__item-icon">
          <Keyboard class="size-4" />
        </span>
        <span class="builder-floating-menu__item-body">
          <span class="builder-floating-menu__item-label"
            >Keyboard Shortcuts</span
          >
          <span class="builder-floating-menu__item-desc">View all hotkeys</span>
        </span>
      </button>

      <button
        type="button"
        role="menuitem"
        class="builder-floating-menu__item"
        onclick={() => {
          closeBuilderMenu();
          showAiModal = true;
        }}
      >
        <span class="builder-floating-menu__item-icon">
          <WandSparkles class="size-4" />
        </span>
        <span class="builder-floating-menu__item-body">
          <span class="builder-floating-menu__item-label"
            >AI Design Generator</span
          >
          <span class="builder-floating-menu__item-desc"
            >Generate a layout with AI</span
          >
        </span>
        <span class="builder-floating-menu__badge">NEW</span>
      </button>
    </div>

    <div class="builder-floating-menu__divider"></div>

    <div class="builder-floating-menu__section">
      <button
        type="button"
        role="menuitem"
        class="builder-floating-menu__item"
        onclick={() => {
          closeBuilderMenu();
          previewOpen = true;
          previewViewport = viewport;
        }}
      >
        <span class="builder-floating-menu__item-icon">
          <Eye class="size-4" />
        </span>
        <span class="builder-floating-menu__item-body">
          <span class="builder-floating-menu__item-label">Preview Page</span>
          <span class="builder-floating-menu__item-desc"
            >See how your page looks live</span
          >
        </span>
      </button>

      <button
        type="button"
        role="menuitem"
        class="builder-floating-menu__item"
        onclick={() => {
          closeBuilderMenu();
          resetView();
        }}
      >
        <span class="builder-floating-menu__item-icon">
          <RotateCcw class="size-4" />
        </span>
        <span class="builder-floating-menu__item-body">
          <span class="builder-floating-menu__item-label">Reset View</span>
          <span class="builder-floating-menu__item-desc"
            >Snap canvas back to 100%</span
          >
        </span>
      </button>
    </div>
  </div>
{/if}

<!-- ═══ PUBLISH PANEL ═══ -->
{#if showPublishPanel}
  <div
    class="fixed inset-0"
    style="z-index: 9998;"
    role="presentation"
    onclick={closePublishPanel}
  ></div>
  <div
    bind:this={publishPanelElement}
    class="publish-panel"
    role="dialog"
    aria-label="Publish settings"
    tabindex="-1"
    onkeydown={(event) => event.key === "Escape" && closePublishPanel()}
  >
    <!-- Panel header -->
    <div class="publish-panel__header">
      <div class="publish-panel__header-left">
        <div class="publish-panel__header-icon">
          <Rocket class="size-4" />
        </div>
        <div>
          <p class="publish-panel__title">Publish Page</p>
          <p class="publish-panel__subtitle">{pageTitle}</p>
        </div>
      </div>
      <button
        type="button"
        onclick={closePublishPanel}
        class="publish-panel__close"
        aria-label="Close">✕</button
      >
    </div>

    <div class="publish-panel__body">
      <!-- Publish method tabs -->
      <div class="publish-panel__methods">
        <p class="publish-panel__section-label">Publish Method</p>
        <div class="publish-panel__method-grid">
          <button
            type="button"
            class="publish-method-card {publishMethod === 'bizflow'
              ? 'is-active'
              : ''}"
            onclick={() => (publishMethod = "bizflow")}
          >
            <div class="publish-method-card__icon">
              <Globe class="size-5" />
            </div>
            <p class="publish-method-card__name">Bizflow Hosting</p>
            <p class="publish-method-card__desc">
              Hosted on Bizflow's CDN with a free subdomain
            </p>
            {#if publishMethod === "bizflow"}<span
                class="publish-method-card__check"
                ><Check class="size-3" /></span
              >{/if}
          </button>

          <button
            type="button"
            class="publish-method-card {publishMethod === 'gas'
              ? 'is-active'
              : ''}"
            onclick={() => (publishMethod = "gas")}
          >
            <div class="publish-method-card__icon">
              <Code2 class="size-5" />
            </div>
            <p class="publish-method-card__name">Google Apps Script</p>
            <p class="publish-method-card__desc">
              Self-host on your personal GAS URL, powered by our API
            </p>
            {#if publishMethod === "gas"}<span
                class="publish-method-card__check"
                ><Check class="size-3" /></span
              >{/if}
          </button>

          <button
            type="button"
            class="publish-method-card {publishMethod === 'html'
              ? 'is-active'
              : ''}"
            onclick={() => (publishMethod = "html")}
          >
            <div class="publish-method-card__icon"><Copy class="size-5" /></div>
            <p class="publish-method-card__name">Export HTML</p>
            <p class="publish-method-card__desc">
              Download a standalone HTML file to host anywhere
            </p>
            {#if publishMethod === "html"}<span
                class="publish-method-card__check"
                ><Check class="size-3" /></span
              >{/if}
          </button>

          <button
            type="button"
            class="publish-method-card {publishMethod === 'custom'
              ? 'is-active'
              : ''}"
            onclick={() => (publishMethod = "custom")}
          >
            <div class="publish-method-card__icon"><Star class="size-5" /></div>
            <p class="publish-method-card__name">Custom Domain</p>
            <p class="publish-method-card__desc">
              Connect your own domain via DNS or CNAME record
            </p>
            {#if publishMethod === "custom"}<span
                class="publish-method-card__check"
                ><Check class="size-3" /></span
              >{/if}
          </button>
        </div>
      </div>

      <!-- Method-specific settings -->
      <div class="publish-panel__settings">
        {#if publishMethod === "bizflow"}
          <p class="publish-panel__section-label">Page URL</p>
          <div class="publish-url-row">
            <span class="publish-url-prefix">bizflow.page/</span>
            <input
              class="publish-url-input"
              bind:value={publishSlug}
              placeholder="my-page"
            />
          </div>
          <p class="publish-panel__hint">
            Your page will be live at <strong
              >bizflow.page/{publishSlug || "my-page"}</strong
            >
          </p>
        {:else if publishMethod === "gas"}
          <p class="publish-panel__section-label">
            Your Apps Script Web App URL
          </p>
          <input
            class="publish-field-input"
            bind:value={gasScriptUrl}
            placeholder="https://script.google.com/macros/s/..."
            type="url"
          />
          <div class="publish-panel__info-box">
            <Code2 class="size-3.5 shrink-0 mt-0.5" />
            <p>
              Deploy a Bizflow GAS adapter in your script editor. Your page
              content is served from your URL while form submissions and
              analytics connect back to Bizflow's API.
            </p>
          </div>
          <a
            href="https://docs.bizflow.app/gas-hosting"
            class="publish-panel__link"
            target="_blank"
            rel="noopener"
          >
            <BookOpen class="size-3.5" /> View GAS setup guide
          </a>
        {:else if publishMethod === "html"}
          <div class="publish-panel__info-box">
            <Globe class="size-3.5 shrink-0 mt-0.5" />
            <p>
              Downloads a self-contained HTML file with all styles and content
              inlined. Form integrations will require the Bizflow embed script
              to be added manually.
            </p>
          </div>
        {:else if publishMethod === "custom"}
          <p class="publish-panel__section-label">Custom Domain</p>
          <input
            class="publish-field-input"
            bind:value={customDomain}
            placeholder="squeeze.yourbusiness.com"
            type="text"
          />
          <div class="publish-panel__info-box">
            <Globe class="size-3.5 shrink-0 mt-0.5" />
            <p>
              Add a CNAME record pointing to <strong>pages.bizflow.app</strong> in
              your DNS settings. SSL is provisioned automatically.
            </p>
          </div>
        {/if}

        <!-- SEO Settings (shared) -->
        {#if publishMethod !== "html"}
          <p class="publish-panel__section-label mt-4">SEO & Meta</p>
          <div class="publish-panel__field-row">
            <input
              class="publish-field-input"
              bind:value={seoTitle}
              placeholder="Page title for search engines…"
            />
            <textarea
              class="publish-field-input resize-none"
              rows="2"
              bind:value={seoDescription}
              placeholder="Meta description (150 chars)…"
            ></textarea>
          </div>
        {/if}
      </div>
    </div>

    <!-- Footer actions -->
    <div class="publish-panel__footer">
      {#if published}
        <div class="publish-live-badge">
          <span class="publish-live-dot"></span>
          Live
        </div>
      {/if}
      <button
        type="button"
        onclick={() => {
          closePublishPanel();
          previewOpen = true;
          previewViewport = viewport;
        }}
        class="publish-panel__preview-btn"
      >
        <Eye class="size-4" /> Preview first
      </button>
      <button
        type="button"
        onclick={handlePublish}
        disabled={isPublishing}
        class="publish-panel__publish-btn"
      >
        {#if isPublishing}
          <span class="publish-spinner"></span> Publishing…
        {:else if publishMethod === "html"}
          <Copy class="size-4" /> Export HTML
        {:else}
          <Rocket class="size-4" /> {published ? "Update" : "Publish Now"}
        {/if}
      </button>
    </div>
  </div>
{/if}

<!-- Preview Overlay -->
{#if previewOpen}
  <div
    class="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex flex-col"
  >
    <!-- Preview Header -->
    <div
      class="h-14 border-b border-border/60 bg-card flex items-center justify-between px-6 shrink-0 shadow-sm"
    >
      <div class="flex items-center gap-4">
        <button
          type="button"
          onclick={() => (previewOpen = false)}
          class="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft class="size-4" /> Exit Preview
        </button>
        <div class="h-4 w-px bg-border/60 hidden sm:block"></div>
        <p class="text-sm font-semibold hidden sm:block">{pageTitle}</p>
      </div>

      <!-- Preview Viewport Switcher -->
      <div
        class="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-1"
      >
        <button
          type="button"
          aria-label="Desktop view"
          onclick={() => (previewViewport = "Desktop")}
          class="rounded-md p-1.5 transition-all {previewViewport === 'Desktop'
            ? 'bg-card shadow-sm text-foreground scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
        >
          <Monitor class="size-4" />
        </button>
        <button
          type="button"
          aria-label="Tablet view"
          onclick={() => (previewViewport = "Tablet")}
          class="rounded-md p-1.5 transition-all {previewViewport === 'Tablet'
            ? 'bg-card shadow-sm text-foreground scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
        >
          <Tablet class="size-4" />
        </button>
        <button
          type="button"
          aria-label="Mobile view"
          onclick={() => (previewViewport = "Mobile")}
          class="rounded-md p-1.5 transition-all {previewViewport === 'Mobile'
            ? 'bg-card shadow-sm text-foreground scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
        >
          <Smartphone class="size-4" />
        </button>
      </div>
    </div>

    <!-- Preview Content Area -->
    <div
      class="flex-1 overflow-auto bg-muted/30 flex justify-center py-8 px-4"
      style="perspective: 1000px;"
    >
      <div
        class="bg-background shadow-2xl rounded-lg overflow-hidden border border-border/50 transition-all duration-300"
        style="
          width: {previewViewport === 'Mobile'
          ? '375px'
          : previewViewport === 'Tablet'
            ? '768px'
            : '100%'};
          max-width: {previewViewport === 'Desktop' ? '1200px' : 'none'};
          min-height: 100%;
        "
      >
        {#each canvasElements as el (el.id)}
          <PreviewCanvas element={el} />
        {/each}
        {#if canvasElements.length === 0}
          <div
            class="h-full flex items-center justify-center text-muted-foreground"
          >
            No elements to preview.
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<!-- Settings Sheet -->
<Sheet.Root
  open={activeSetting !== null}
  onOpenChange={(open) => {
    if (!open) activeSetting = null;
  }}
>
  <Sheet.Content
    side="left"
    class="w-full sm:max-w-md p-0 flex flex-col gap-0 border-r border-border/60"
  >
    <Sheet.Header class="px-6 py-4 border-b border-border/60">
      <Sheet.Title class="text-lg">{activeSetting}</Sheet.Title>
      <Sheet.Description class="text-sm"
        >Configure {activeSetting?.toLowerCase()} for this page.</Sheet.Description
      >
    </Sheet.Header>
    <div class="p-6 flex-1 overflow-y-auto">
      {#if activeSetting === "General Settings"}
        <div class="space-y-4">
          <div class="space-y-2">
            <label for="page-name" class="text-sm font-medium">Page Title</label
            >
            <input
              id="page-name"
              bind:value={pageTitle}
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div class="space-y-2">
            <label for="page-url" class="text-sm font-medium"
              >Custom URL Slug</label
            >
            <input
              id="page-url"
              placeholder="e.g. my-free-guide"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <!-- Theme Toggle -->
          <div
            class="flex items-center justify-between pt-2 border-t border-border"
          >
            <div>
              <p class="text-sm font-medium">Builder Theme</p>
              <p class="text-xs text-muted-foreground mt-0.5">
                Switch between light and dark mode.
              </p>
            </div>
            <button
              type="button"
              onclick={toggleMode}
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors {mode.current ===
              'dark'
                ? 'bg-primary'
                : 'bg-muted'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              role="switch"
              aria-checked={mode.current === "dark"}
              aria-label="Toggle theme"
            >
              <span
                class="pointer-events-none inline-block size-5 rounded-full bg-white shadow-lg transition-transform {mode.current ===
                'dark'
                  ? 'translate-x-5'
                  : 'translate-x-0'}"
              ></span>
            </button>
          </div>
        </div>
      {:else if activeSetting === "SEO & Social Share"}
        <div class="space-y-4">
          <div class="space-y-2">
            <label for="seo-title" class="text-sm font-medium"
              >SEO Meta Title</label
            >
            <input
              id="seo-title"
              placeholder="SEO Title"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div class="space-y-2">
            <label for="seo-desc" class="text-sm font-medium"
              >SEO Meta Description</label
            >
            <textarea
              id="seo-desc"
              placeholder="Brief description for search engines"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            ></textarea>
          </div>
          <div class="space-y-2 pt-2">
            <label class="text-sm font-medium">Social Share Image</label>
            <div
              class="mt-1 flex justify-center rounded-lg border border-dashed border-border/60 px-6 py-10 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div class="text-center">
                <Image class="mx-auto size-8 text-muted-foreground/50" />
                <div class="mt-4 flex text-sm leading-6 text-muted-foreground">
                  <span
                    class="relative rounded-md bg-transparent font-semibold text-primary focus-within:outline-none hover:text-primary/80"
                    >Upload a file</span
                  >
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>
          </div>
        </div>
      {:else if activeSetting === "Custom Code"}
        <div class="space-y-4">
          <div class="space-y-2">
            <label for="head-code" class="text-sm font-medium"
              >Code in &lt;head&gt;</label
            >
            <textarea
              id="head-code"
              placeholder="<!-- Add meta tags, fonts, etc. -->"
              class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            ></textarea>
          </div>
          <div class="space-y-2">
            <label for="body-code" class="text-sm font-medium"
              >Code before &lt;/body&gt;</label
            >
            <textarea
              id="body-code"
              placeholder="<!-- Add scripts, widgets, etc. -->"
              class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            ></textarea>
          </div>
        </div>
      {:else if activeSetting === "Tracking & Analytics"}
        <div class="space-y-4">
          <div class="space-y-2">
            <label for="ga-id" class="text-sm font-medium"
              >Google Analytics ID</label
            >
            <input
              id="ga-id"
              placeholder="G-XXXXXXXXXX"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div class="space-y-2">
            <label for="fb-pixel" class="text-sm font-medium"
              >Meta Pixel ID</label
            >
            <input
              id="fb-pixel"
              placeholder="123456789012345"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div class="space-y-2">
            <label for="gtm-id" class="text-sm font-medium"
              >Google Tag Manager</label
            >
            <input
              id="gtm-id"
              placeholder="GTM-XXXXXXX"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>
      {/if}
    </div>
    <div
      class="px-6 py-4 border-t border-border/60 bg-muted/20 flex justify-end gap-3"
    >
      <button
        type="button"
        onclick={() => (activeSetting = null)}
        class="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >Cancel</button
      >
      <button
        type="button"
        onclick={() => (activeSetting = null)}
        class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >Save Changes</button
      >
    </div>
  </Sheet.Content>
</Sheet.Root>

<!-- AI Design Modal -->
{#if showAiModal}
  <AiDesignModal
    onClose={() => (showAiModal = false)}
    onGenerate={(elements: any[]) => {
      canvasElements = elements;
      showAiModal = false;
      commitHistory();
    }}
  />
{/if}

<FontLibraryModal
  isOpen={showFontLibrary}
  {workspaceFonts}
  onClose={() => (showFontLibrary = false)}
  onSelectFont={handleSelectFont}
  onInstallFont={handleInstallFont}
/>

<!-- Shortcuts Modal -->
{#if showShortcuts}
  <div
    class="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    onclick={() => (showShortcuts = false)}
    onkeydown={(e) => e.key === "Escape" && (showShortcuts = false)}
    role="dialog"
    aria-modal="true"
    aria-label="Keyboard Shortcuts"
  >
    <div
      class="bg-card w-full max-w-2xl rounded-xl border border-border/60 shadow-2xl overflow-hidden flex flex-col"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
    >
      <div
        class="px-6 py-4 border-b border-border/60 flex items-center justify-between"
      >
        <h2 class="text-lg font-bold flex items-center gap-2">
          <Keyboard class="size-5 text-primary" /> Keyboard Shortcuts
        </h2>
        <button
          type="button"
          onclick={() => (showShortcuts = false)}
          class="text-muted-foreground hover:text-foreground">✕</button
        >
      </div>
      <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8 bg-muted/20">
        <div>
          <h3
            class="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4"
          >
            Canvas Navigation
          </h3>
          <ul class="space-y-3 text-sm">
            <li class="flex items-center justify-between">
              <span>Select Tool</span>
              <div class="flex gap-1">
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >V</kbd
                >
              </div>
            </li>
            <li class="flex items-center justify-between">
              <span>Pan Tool</span>
              <div class="flex gap-1">
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >H</kbd
                >
              </div>
            </li>
            <li class="flex items-center justify-between">
              <span>Temp Pan</span>
              <div class="flex gap-1">
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >Space</kbd
                > + Drag
              </div>
            </li>
            <li class="flex items-center justify-between">
              <span>Zoom In/Out</span>
              <div class="flex gap-1">
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >Ctrl/⌘</kbd
                > + Scroll
              </div>
            </li>
            <li class="flex items-center justify-between">
              <span>Zoom In</span>
              <div class="flex gap-1">
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >Ctrl/⌘</kbd
                >
                +
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >=</kbd
                >
              </div>
            </li>
            <li class="flex items-center justify-between">
              <span>Zoom Out</span>
              <div class="flex gap-1">
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >Ctrl/⌘</kbd
                >
                +
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >-</kbd
                >
              </div>
            </li>
            <li class="flex items-center justify-between">
              <span>Reset Zoom</span>
              <div class="flex gap-1">
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >Ctrl/⌘</kbd
                >
                +
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >0</kbd
                >
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h3
            class="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4"
          >
            Element Actions
          </h3>
          <ul class="space-y-3 text-sm">
            <li class="flex items-center justify-between">
              <span>Undo</span>
              <div class="flex gap-1">
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >Ctrl/⌘</kbd
                >
                +
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >Z</kbd
                >
              </div>
            </li>
            <li class="flex items-center justify-between">
              <span>Redo</span>
              <div class="flex gap-1">
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >Ctrl/⌘</kbd
                >
                +
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >Y</kbd
                >
              </div>
            </li>
            <li class="flex items-center justify-between">
              <span>Duplicate</span>
              <div class="flex gap-1">
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >Ctrl/⌘</kbd
                >
                +
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >D</kbd
                >
              </div>
            </li>
            <li class="flex items-center justify-between">
              <span>Delete Element</span>
              <div class="flex gap-1">
                <kbd
                  class="px-2 py-1 rounded border border-border bg-card shadow-sm text-xs"
                  >Del / Backspace</kbd
                >
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="px-6 py-4 border-t border-border/60 bg-card text-center">
        <button
          type="button"
          onclick={() => (showShortcuts = false)}
          class="btn-primary w-full sm:w-auto">Got it</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  /* ─── Scrollbar ─── */
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--foreground) 12%, transparent);
    border-radius: 10px;
  }
  .custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--foreground) 22%, transparent);
  }

  /* ─── Labels ─── */
  .builder-label {
    color: var(--muted-foreground);
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0;
  }

  /* ─── Header buttons ─── */
  .builder-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    color: var(--muted-foreground);
    transition: all 0.15s;
    border: 1px solid transparent;
  }
  .builder-icon-btn:hover {
    background: var(--muted);
    color: var(--foreground);
    border-color: var(--border);
  }

  .builder-action {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border-radius: 0.5rem;
    padding: 0.45rem 0.8rem;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid var(--border);
    color: var(--foreground);
    background: var(--card);
    transition: all 0.15s;
  }
  .builder-action:hover {
    background: var(--muted);
    transform: translateY(-1px);
  }

  .builder-publish {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border-radius: 0.5rem;
    padding: 0.45rem 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    background: var(--primary);
    color: var(--primary-foreground);
    transition: all 0.15s;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--primary) 35%, transparent);
  }
  .builder-publish:hover {
    background: color-mix(in srgb, var(--primary) 85%, black);
    transform: translateY(-1px);
  }

  /* ─── Builder floating menu ─── */
  .builder-floating-menu {
    position: fixed;
    top: 60px;
    right: 12px;
    z-index: 9999;
    width: 240px;
    border-radius: 0.875rem;
    border: 1px solid var(--border);
    background-color: var(--card);
    color: var(--card-foreground);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.12),
      0 16px 40px -4px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    animation: menu-in 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes menu-in {
    from {
      opacity: 0;
      transform: translateY(-6px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  .builder-floating-menu__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted-foreground);
    border-bottom: 1px solid var(--border);
    background-color: var(--muted);
  }
  .builder-floating-menu__section {
    padding: 0.375rem;
  }
  .builder-floating-menu__divider {
    height: 1px;
    background: var(--border);
    margin: 0;
  }
  .builder-floating-menu__item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    width: 100%;
    padding: 0.5rem 0.625rem;
    border-radius: 0.5rem;
    text-align: left;
    transition: background 0.12s;
    color: var(--card-foreground);
  }
  .builder-floating-menu__item:hover {
    background-color: var(--muted);
  }
  .builder-floating-menu__item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.375rem;
    background-color: var(--secondary);
    color: var(--foreground);
    flex-shrink: 0;
  }
  .builder-floating-menu__item-body {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    flex: 1;
    min-width: 0;
  }
  .builder-floating-menu__item-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--foreground);
    line-height: 1.2;
  }
  .builder-floating-menu__item-desc {
    font-size: 0.7rem;
    color: var(--muted-foreground);
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .builder-floating-menu__badge {
    flex-shrink: 0;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 0.15rem 0.4rem;
    border-radius: 9999px;
    background: var(--primary);
    color: var(--primary-foreground);
  }

  /* ─── Presets ─── */
  .preset-card {
    padding: 0.6rem 0.7rem;
    border-radius: 0.6rem;
    border: 1px solid transparent;
    transition: all 0.15s;
  }
  .preset-card:hover {
    background: var(--muted);
    border-color: var(--border);
  }

  /* ─── Palette tiles ─── */
  .palette-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 10px 8px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--card);
    transition: all 0.18s;
    cursor: pointer;
  }
  .palette-tile:hover {
    border-color: var(--primary);
    background: color-mix(in srgb, var(--primary) 5%, var(--card));
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  .palette-tile-preview {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    overflow: hidden;
    background: color-mix(in srgb, var(--muted) 50%, transparent);
  }
  .palette-tile-label {
    font-size: 10px;
    font-weight: 600;
    color: var(--muted-foreground);
    white-space: nowrap;
  }
  .palette-tile:hover .palette-tile-label {
    color: var(--foreground);
  }

  /* Mini previews */
  .mini-section {
    width: 80%;
    height: 30px;
    border: 1.5px dashed var(--border);
    border-radius: 4px;
  }
  .mini-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    width: 80%;
  }
  .mini-grid span {
    height: 24px;
    background: var(--border);
    border-radius: 3px;
  }
  .mini-column {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 80%;
  }
  .mini-column span {
    height: 8px;
    background: var(--border);
    border-radius: 3px;
  }
  .mini-headline {
    font-size: 20px;
    font-weight: 800;
    color: var(--foreground);
    opacity: 0.7;
  }
  .mini-subheadline {
    font-size: 14px;
    font-weight: 600;
    color: var(--muted-foreground);
  }
  .mini-para {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 85%;
  }
  .mini-para span {
    height: 5px;
    background: var(--muted-foreground);
    opacity: 0.3;
    border-radius: 3px;
    width: 100%;
  }
  .mini-button {
    background: var(--primary);
    color: var(--primary-foreground);
    font-size: 9px;
    font-weight: 700;
    padding: 5px 14px;
    border-radius: 5px;
  }
  .mini-image {
    font-size: 24px;
    opacity: 0.5;
  }
  .mini-video {
    font-size: 20px;
    opacity: 0.5;
    color: var(--muted-foreground);
  }
  .mini-form {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 85%;
  }
  .mini-form span {
    height: 12px;
    background: var(--border);
    border-radius: 3px;
  }
  .mini-form-btn {
    background: var(--primary) !important;
    height: 14px !important;
    border-radius: 4px !important;
  }
  .mini-divider {
    width: 80%;
    height: 1.5px;
    background: var(--border);
  }
  .mini-timer {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .mini-timer span {
    font-size: 11px;
    font-weight: 800;
    color: var(--primary);
  }
  .mini-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 85%;
  }
  .mini-list span {
    height: 6px;
    background: var(--muted-foreground);
    opacity: 0.25;
    border-radius: 3px;
  }
  .mini-testimonial {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 90%;
  }
  .mini-stars {
    font-size: 10px;
    color: #f59e0b;
  }
  .mini-quote {
    height: 5px;
    background: var(--border);
    border-radius: 3px;
  }
  .mini-author {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .mini-author span:first-child {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary);
    opacity: 0.5;
  }
  .mini-author span:last-child {
    height: 4px;
    flex: 1;
    background: var(--border);
    border-radius: 2px;
  }
  .mini-logos {
    display: flex;
    gap: 8px;
    font-size: 9px;
    font-weight: 800;
    color: var(--muted-foreground);
    opacity: 0.5;
  }

  /* ─── Canvas ─── */
  .canvas-bg {
    background: var(--muted);
    background-image: radial-gradient(var(--border) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  .canvas-page-sheet {
    background: white;
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.35),
      0 0 0 1px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }
  .canvas-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 600px;
    text-align: center;
    padding: 60px 40px;
    color: #6b7280;
  }
  .canvas-empty-icon {
    font-size: 48px;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  .canvas-empty-state h3 {
    font-size: 20px;
    font-weight: 700;
    color: #374151;
    margin-bottom: 10px;
  }
  .canvas-empty-state p {
    font-size: 14px;
    line-height: 1.7;
    color: #9ca3af;
    max-width: 360px;
  }
  .canvas-empty-shortcuts {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 32px;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 12px;
    color: #9ca3af;
  }
  .canvas-empty-shortcuts kbd {
    background: #1f2937;
    color: #e5e7eb;
    border: 1px solid #374151;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-family: monospace;
  }
  .canvas-empty-shortcuts span {
    color: #6b7280;
  }

  .canvas-zoom-controls {
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    gap: 1px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .zoom-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: var(--muted-foreground);
    transition: all 0.15s;
    border: none;
    background: transparent;
    cursor: pointer;
  }
  .zoom-btn:hover {
    background: var(--muted);
    color: var(--foreground);
  }
  .zoom-pct {
    padding: 0 10px;
    height: 32px;
    font-size: 12px;
    font-weight: 600;
    color: var(--foreground);
    border: none;
    background: transparent;
    cursor: pointer;
    min-width: 52px;
    transition: background 0.15s;
  }
  .zoom-pct:hover {
    background: var(--muted);
  }

  .canvas-cursor-tools {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 30;
  }
  .cursor-tool-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 32px;
    color: var(--muted-foreground);
    transition: all 0.15s;
    border: none;
    background: transparent;
    cursor: pointer;
  }
  .cursor-tool-btn:hover {
    background: var(--muted);
    color: var(--foreground);
  }
  .cursor-tool-btn.is-active {
    background: hsl(var(--primary) / 0.12);
    color: var(--primary);
  }

  .canvas-viewport-indicator {
    position: absolute;
    bottom: 16px;
    left: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    color: var(--muted-foreground);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .canvas-viewport-sep {
    opacity: 0.4;
  }
  .canvas-selected-badge {
    background: var(--primary);
    color: var(--primary-foreground);
    font-size: 10px;
    padding: 1px 7px;
    border-radius: 4px;
    font-weight: 700;
  }
  .canvas-delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: none;
    background: transparent;
    color: var(--muted-foreground);
    cursor: pointer;
    transition: all 0.15s;
  }
  .canvas-delete-btn:hover {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }

  /* ─── Preset confirm modal ─── */
  .preset-confirm-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .preset-confirm-modal {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    max-width: 380px;
    width: 90%;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
  }
  .preset-confirm-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }
  .preset-confirm-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 10px;
  }
  .preset-confirm-desc {
    font-size: 13px;
    color: var(--muted-foreground);
    line-height: 1.6;
    margin-bottom: 24px;
  }
  .preset-confirm-actions {
    display: flex;
    gap: 10px;
  }
  .btn-secondary {
    flex: 1;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    font-weight: 600;
    background: var(--background);
    color: var(--foreground);
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-secondary:hover {
    background: var(--muted);
  }
  .btn-primary {
    flex: 1;
    border: none;
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    font-weight: 600;
    background: var(--primary);
    color: var(--primary-foreground);
    cursor: pointer;
    transition: background 0.15s;
    box-shadow: 0 4px 12px color-mix(in srgb, var(--primary) 30%, transparent);
  }
  .btn-primary:hover {
    background: color-mix(in srgb, var(--primary) 85%, black);
  }

  /* ─── Publish Panel (Sheet) ─── */
  .publish-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    width: 400px;
    background-color: var(--card);
    color: var(--card-foreground);
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
    animation: slide-in-right 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--border);
  }
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  .publish-panel__body {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .publish-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.125rem;
    border-bottom: 1px solid var(--border);
    background-color: var(--muted);
    gap: 0.75rem;
    flex-shrink: 0;
  }
  .publish-panel__header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .publish-panel__header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background-color: var(--primary);
    color: var(--primary-foreground);
    flex-shrink: 0;
  }
  .publish-panel__title {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--foreground);
    line-height: 1.2;
  }
  .publish-panel__subtitle {
    font-size: 0.7rem;
    color: var(--muted-foreground);
    margin-top: 0.1rem;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .publish-panel__close {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: var(--muted-foreground);
    transition: all 0.12s;
    flex-shrink: 0;
  }
  .publish-panel__close:hover {
    background-color: var(--secondary);
    color: var(--foreground);
  }
  .publish-panel__methods {
    padding: 1rem 1.125rem 0.75rem;
    border-bottom: 1px solid var(--border);
  }
  .publish-panel__method-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .publish-method-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.375rem;
    padding: 0.625rem 0.75rem;
    border-radius: 0.625rem;
    border: 1.5px solid var(--border);
    background-color: var(--background);
    text-align: left;
    transition: all 0.15s;
    cursor: pointer;
  }
  .publish-method-card:hover {
    border-color: var(--primary);
    background-color: var(--muted);
  }
  .publish-method-card.is-active {
    border-color: var(--primary);
    background-color: color-mix(in srgb, var(--primary) 8%, var(--background));
  }
  .publish-method-card__icon {
    color: var(--muted-foreground);
    margin-bottom: 0.125rem;
  }
  .publish-method-card.is-active .publish-method-card__icon {
    color: var(--primary);
  }
  .publish-method-card__name {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--foreground);
    line-height: 1.2;
  }
  .publish-method-card__desc {
    font-size: 0.65rem;
    color: var(--muted-foreground);
    line-height: 1.35;
  }
  .publish-method-card__check {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 50%;
    background-color: var(--primary);
    color: var(--primary-foreground);
  }
  .publish-panel__settings {
    padding: 1rem 1.125rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .publish-panel__section-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted-foreground);
    margin-bottom: 0.25rem;
  }
  .publish-url-row {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: var(--background);
  }
  .publish-url-prefix {
    padding: 0.5rem 0.625rem;
    font-size: 0.78rem;
    color: var(--muted-foreground);
    background-color: var(--muted);
    border-right: 1px solid var(--border);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .publish-url-input {
    flex: 1;
    padding: 0.5rem 0.625rem;
    font-size: 0.8rem;
    background: transparent;
    border: none;
    outline: none;
    color: var(--foreground);
    min-width: 0;
  }
  .publish-field-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    background-color: var(--background);
    color: var(--foreground);
    outline: none;
    transition: border-color 0.15s;
  }
  .publish-field-input:focus {
    border-color: var(--primary);
  }
  .publish-panel__info-box {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    padding: 0.625rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border);
    background-color: var(--muted);
    font-size: 0.72rem;
    color: var(--muted-foreground);
    line-height: 1.5;
  }
  .publish-panel__hint {
    font-size: 0.7rem;
    color: var(--muted-foreground);
  }
  .publish-panel__link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--primary);
    text-decoration: none;
    margin-top: 0.25rem;
  }
  .publish-panel__link:hover {
    text-decoration: underline;
  }
  .publish-panel__field-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .publish-panel__footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.125rem;
    background-color: var(--background);
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }
  .publish-live-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.7rem;
    font-weight: 700;
    color: #22c55e;
    background: color-mix(in srgb, #22c55e 12%, transparent);
    border: 1px solid color-mix(in srgb, #22c55e 30%, transparent);
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    margin-right: auto;
  }
  .publish-live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
  .publish-panel__preview-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.875rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border);
    background-color: var(--background);
    color: var(--foreground);
    font-size: 0.8rem;
    font-weight: 600;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .publish-panel__preview-btn:hover {
    background-color: var(--muted);
  }
  .publish-panel__publish-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1.125rem;
    border-radius: 0.5rem;
    border: none;
    background-color: var(--primary);
    color: var(--primary-foreground);
    font-size: 0.8rem;
    font-weight: 700;
    transition: all 0.15s;
    white-space: nowrap;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--primary) 35%, transparent);
    flex: 1;
    justify-content: center;
  }
  .publish-panel__publish-btn:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--primary) 85%, black);
    transform: translateY(-1px);
  }
  .publish-panel__publish-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
  .publish-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
