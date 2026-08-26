<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { X, Search, Check, Type, Plus } from "lucide-svelte";
  import { SYSTEM_FONTS, GOOGLE_FONTS, type FontCategory } from "$lib/data/google-fonts";
  import { onMount } from "svelte";

  let {
    isOpen = false,
    workspaceFonts = [],
    onClose,
    onSelectFont,
    onInstallFont,
  }: {
    isOpen: boolean;
    workspaceFonts: string[];
    onClose: () => void;
    onSelectFont: (font: string) => void;
    onInstallFont: (font: string) => void;
  } = $props();

  let activeTab = $state<'my-fonts' | 'google-fonts'>('my-fonts');
  let searchQuery = $state('');
  let selectedCategory = $state<FontCategory | 'All'>('All');

  // Load Google Fonts for preview dynamically
  const loadedPreviewFonts = new Set<string>();

  function loadFontPreview(family: string) {
    if (loadedPreviewFonts.has(family) || SYSTEM_FONTS.some(f => f.family === family)) return;
    loadedPreviewFonts.add(family);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}&text=${encodeURIComponent(family)}&display=swap`;
    document.head.appendChild(link);
  }

  // Pre-load workspace fonts
  $effect(() => {
    if (isOpen) {
      workspaceFonts.forEach(loadFontPreview);
    }
  });

  const filteredMyFonts = $derived(
    [...SYSTEM_FONTS.map(f => f.family), ...workspaceFonts]
      .filter(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((v, i, a) => a.indexOf(v) === i) // unique
  );

  const filteredGoogleFonts = $derived(
    GOOGLE_FONTS.filter(f => {
      const matchSearch = f.family.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || f.category === selectedCategory;
      return matchSearch && matchCat;
    })
  );

  function handleSelect(family: string) {
    onSelectFont(family);
    onClose();
  }

  function handleInstall(family: string) {
    onInstallFont(family);
    // Don't close immediately so they can install multiple
  }

  // Handle escape key
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div
    class="font-modal-backdrop"
    transition:fade={{ duration: 150 }}
    onclick={onClose}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
    role="dialog"
    aria-modal="true"
    aria-label="Font Library"
    tabindex="-1"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div class="font-modal" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="document">
      <!-- Header -->
      <header class="font-modal-header">
        <div>
          <h2>Font Library</h2>
          <p>Select a font or install new ones from Google Fonts.</p>
        </div>
        <button type="button" class="close-btn" onclick={onClose} aria-label="Close">
          <X class="size-5" />
        </button>
      </header>

      <!-- Tabs & Search -->
      <div class="font-modal-controls">
        <div class="tabs">
          <button
            type="button"
            class="tab-btn {activeTab === 'my-fonts' ? 'is-active' : ''}"
            onclick={() => { activeTab = 'my-fonts'; searchQuery = ''; }}
          >
            My Fonts
          </button>
          <button
            type="button"
            class="tab-btn {activeTab === 'google-fonts' ? 'is-active' : ''}"
            onclick={() => { activeTab = 'google-fonts'; searchQuery = ''; }}
          >
            Google Fonts
          </button>
        </div>

        <div class="search-box">
          <Search class="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fonts..."
            bind:value={searchQuery}
            class="search-input"
          />
        </div>
      </div>

      <!-- Content -->
      <div class="font-modal-content">
        {#if activeTab === 'my-fonts'}
          {#if filteredMyFonts.length === 0}
            <div class="empty-state">No fonts found for "{searchQuery}"</div>
          {:else}
            <div class="font-grid">
              {#each filteredMyFonts as family}
                <button
                  type="button"
                  class="font-card"
                  onclick={() => handleSelect(family)}
                  onmouseenter={() => loadFontPreview(family)}
                >
                  <div class="font-preview" style="font-family: '{family}', sans-serif;">
                    {family}
                  </div>
                  <div class="font-meta">
                    <span>{SYSTEM_FONTS.some(f => f.family === family) ? 'System Font' : 'Google Font'}</span>
                  </div>
                </button>
              {/each}
            </div>
          {/if}

        {:else if activeTab === 'google-fonts'}
          <div class="category-filters">
            {#each ['All', 'Sans-Serif', 'Serif', 'Display', 'Handwriting', 'Monospace'] as cat}
              <button
                type="button"
                class="cat-pill {selectedCategory === cat ? 'is-active' : ''}"
                onclick={() => selectedCategory = cat as FontCategory | 'All'}
              >
                {cat}
              </button>
            {/each}
          </div>

          {#if filteredGoogleFonts.length === 0}
            <div class="empty-state">No Google Fonts match your search.</div>
          {:else}
            <div class="font-grid">
              {#each filteredGoogleFonts as font}
                {@const isInstalled = workspaceFonts.includes(font.family)}
                <div
                  class="font-card font-card--google"
                  onmouseenter={() => loadFontPreview(font.family)}
                  role="presentation"
                >
                  <button
                    type="button"
                    class="font-preview-btn"
                    onclick={() => handleSelect(font.family)}
                    title="Use this font"
                  >
                    <div class="font-preview" style="font-family: '{font.family}', sans-serif;">
                      {font.family}
                    </div>
                  </button>
                  <div class="font-actions">
                    <span class="font-cat-label">{font.category}</span>
                    {#if isInstalled}
                      <span class="installed-badge"><Check class="size-3" /> Installed</span>
                    {:else}
                      <button
                        type="button"
                        class="install-btn"
                        onclick={() => handleInstall(font.family)}
                      >
                        <Plus class="size-3" /> Install
                      </button>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .font-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .font-modal {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    width: 100%;
    max-width: 760px;
    height: 85vh;
    max-height: 700px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 24px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05) inset;
    overflow: hidden;
  }

  .font-modal-header {
    padding: 24px 28px 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .font-modal-header h2 {
    font-size: 20px;
    font-weight: 700;
    color: var(--foreground);
    margin: 0 0 6px 0;
    letter-spacing: -0.02em;
  }
  .font-modal-header p {
    font-size: 13px;
    color: var(--muted-foreground);
    margin: 0;
  }
  .close-btn {
    background: transparent;
    border: none;
    color: var(--muted-foreground);
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    transition: all 0.2s;
  }
  .close-btn:hover {
    background: var(--muted);
    color: var(--foreground);
  }

  .font-modal-controls {
    padding: 0 28px 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .tabs {
    display: flex;
    gap: 4px;
    background: var(--muted);
    padding: 4px;
    border-radius: 8px;
  }
  .tab-btn {
    padding: 6px 16px;
    border-radius: 6px;
    border: none;
    background: transparent;
    font-size: 13px;
    font-weight: 600;
    color: var(--muted-foreground);
    cursor: pointer;
    transition: all 0.2s;
  }
  .tab-btn:hover {
    color: var(--foreground);
  }
  .tab-btn.is-active {
    background: var(--card);
    color: var(--foreground);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02);
  }

  .search-box {
    position: relative;
    flex: 1;
    max-width: 280px;
  }
  .search-input {
    width: 100%;
    height: 36px;
    padding: 0 12px 0 36px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--foreground);
    font-size: 13px;
    transition: all 0.2s;
  }
  .search-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }

  .font-modal-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px 28px;
    background: color-mix(in srgb, var(--muted) 30%, transparent);
  }

  .category-filters {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .cat-pill {
    padding: 6px 14px;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--card);
    font-size: 12px;
    font-weight: 500;
    color: var(--muted-foreground);
    cursor: pointer;
    transition: all 0.2s;
  }
  .cat-pill:hover {
    border-color: color-mix(in srgb, var(--primary) 50%, transparent);
    color: var(--foreground);
  }
  .cat-pill.is-active {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--primary-foreground);
  }

  .font-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  .font-card {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--card);
    overflow: hidden;
    transition: all 0.2s ease;
    text-align: left;
    padding: 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }
  button.font-card {
    cursor: pointer;
  }
  button.font-card:hover {
    border-color: color-mix(in srgb, var(--primary) 50%, transparent);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
  }
  
  .font-card--google {
    border-color: var(--border);
  }
  .font-card--google:hover {
    border-color: var(--border);
    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
  }

  .font-preview-btn {
    display: block;
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
  }
  .font-preview-btn:hover .font-preview {
    color: var(--primary);
  }

  .font-preview {
    padding: 16px 20px;
    font-size: 20px;
    line-height: 1.4;
    color: var(--foreground);
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s;
  }

  .font-meta, .font-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: transparent;
    font-size: 11px;
    font-weight: 500;
    color: var(--muted-foreground);
  }

  .font-cat-label {
    background: var(--muted);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .install-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--card);
    color: var(--foreground);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .install-btn:hover {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--primary-foreground);
  }

  .installed-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #10b981; /* emerald-500 */
    font-weight: 600;
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
    color: var(--muted-foreground);
    font-size: 14px;
  }
</style>
