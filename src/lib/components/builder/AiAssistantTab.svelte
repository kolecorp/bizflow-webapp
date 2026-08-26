<script lang="ts">
  import type { CanvasElement } from "$lib/types/builder";
  import { WandSparkles, Loader2, Sparkles, MoveRight, CheckCircle2, RotateCcw } from "@lucide/svelte";
  import { onMount, onDestroy } from "svelte";

  let {
    element,
    onUpdate
  }: {
    element: CanvasElement | null;
    onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  } = $props();

  let customPrompt = $state("");
  let isGenerating = $state(false);
  let generatedResult = $state<string | null>(null);

  // Type definitions for what we can extract
  type TextTarget = { type: 'content' } | { type: 'property', key: string };
  
  const textTargets: Record<string, TextTarget> = {
    'Headline': { type: 'content' },
    'Subheadline': { type: 'content' },
    'Paragraph': { type: 'content' },
    'Button': { type: 'property', key: 'label' },
    'Testimonial': { type: 'property', key: 'quote' },
    'OptInForm': { type: 'property', key: 'headline' }, // Can be headline or subheadline, keep it simple for now
  };

  const isSupported = $derived(element && textTargets[element.type] !== undefined);
  
  const originalText = $derived.by(() => {
    if (!element || !isSupported) return "";
    const target = textTargets[element.type];
    if (target.type === 'content') {
      return (element.content ?? "").replace(/<[^>]+>/g, '').trim();
    } else {
      return (element.properties[target.key] as string) ?? "";
    }
  });

  const suggestions = [
    { label: "Make it punchier", prompt: "Make this text more concise, energetic, and punchy." },
    { label: "More persuasive", prompt: "Rewrite this to be highly persuasive and conversion-focused." },
    { label: "Fix spelling & grammar", prompt: "Correct any spelling or grammar mistakes without changing the meaning." },
    { label: "Shorten", prompt: "Make this significantly shorter while keeping the core message." }
  ];

  let simTimeout: ReturnType<typeof setTimeout> | null = null;
  onDestroy(() => { if (simTimeout) clearTimeout(simTimeout); });

  // Simulate an AI generation effect
  function simulateGeneration(promptAction: string) {
    if (!element || !isSupported) return;
    
    isGenerating = true;
    generatedResult = null;
    
    // Fake typing effect simulation for demo purposes
    simTimeout = setTimeout(() => {
      isGenerating = false;
      const baseText = originalText || "New text";
      // Just mock responses based on action
      if (promptAction.includes("short")) {
        generatedResult = baseText.split(" ").slice(0, Math.max(3, Math.floor(baseText.split(" ").length / 2))).join(" ") + ".";
      } else if (promptAction.includes("punch")) {
        generatedResult = "Boost Your Conversions Instantly!";
      } else {
        generatedResult = `[AI Generated] ${baseText} - improved!`;
      }
    }, 1500);
  }

  function handleApply() {
    if (!element || !generatedResult || !isSupported) return;
    
    const target = textTargets[element.type];
    if (target.type === 'content') {
      onUpdate(element.id, { content: generatedResult });
    } else {
      onUpdate(element.id, { 
        properties: { ...element.properties, [target.key]: generatedResult } 
      });
    }
    generatedResult = null;
    customPrompt = "";
  }

  // Reset state when element changes
  $effect(() => {
    if (element?.id) {
      generatedResult = null;
      customPrompt = "";
      isGenerating = false;
      if (simTimeout) clearTimeout(simTimeout);
    }
  });
</script>

<div class="ai-assistant-wrapper">
  {#if !element}
    <div class="ai-empty">
      <WandSparkles class="size-8 text-muted-foreground/40 mb-3" />
      <p class="font-medium text-foreground">No element selected</p>
      <p class="text-xs text-muted-foreground mt-1">Select a text element on the canvas to use the AI assistant.</p>
    </div>
  {:else if !isSupported}
    <div class="ai-empty">
      <div class="flex items-center justify-center size-10 rounded-full bg-muted mb-3">
        <Sparkles class="size-5 text-muted-foreground" />
      </div>
      <p class="font-medium text-foreground">AI not available</p>
      <p class="text-xs text-muted-foreground mt-1">AI editing is only supported for text, headlines, and buttons.</p>
    </div>
  {:else}
    <div class="ai-content">
      <div class="ai-section">
        <label class="ai-label">Original Text</label>
        <div class="ai-original-box">
          {originalText || "Empty"}
        </div>
      </div>

      {#if generatedResult}
        <div class="ai-section">
          <label class="ai-label text-primary flex items-center gap-1">
            <Sparkles class="size-3" /> AI Suggestion
          </label>
          <div class="ai-result-box">
            {generatedResult}
          </div>
          <div class="flex gap-2 mt-3">
            <button class="ai-btn ai-btn-outline flex-1" onclick={() => generatedResult = null}>
              <RotateCcw class="size-3.5 mr-1.5" /> Discard
            </button>
            <button class="ai-btn ai-btn-primary flex-1" onclick={handleApply}>
              <CheckCircle2 class="size-3.5 mr-1.5" /> Apply to Canvas
            </button>
          </div>
        </div>
      {:else}
        <div class="ai-section">
          <label class="ai-label">Quick Actions</label>
          <div class="ai-grid">
            {#each suggestions as s}
              <button class="ai-quick-btn" onclick={() => simulateGeneration(s.prompt)} disabled={isGenerating}>
                {s.label}
              </button>
            {/each}
          </div>
        </div>

        <div class="ai-section relative">
          <label class="ai-label">Custom Instruction</label>
          <textarea 
            bind:value={customPrompt}
            placeholder="E.g., rewrite this to sound like a fitness coach..."
            class="ai-textarea"
            rows="3"
            disabled={isGenerating}
          ></textarea>
          <button 
            class="ai-submit-btn" 
            disabled={!customPrompt.trim() || isGenerating}
            onclick={() => simulateGeneration(customPrompt)}
          >
            {#if isGenerating}
              <Loader2 class="size-4 animate-spin text-primary" />
            {:else}
              <MoveRight class="size-4 text-primary-foreground" />
            {/if}
          </button>
        </div>
        
        {#if isGenerating}
          <div class="ai-generating">
            <Loader2 class="size-4 animate-spin text-primary" />
            <span class="text-xs font-medium text-primary">AI is writing...</span>
          </div>
        {/if}
      {/if}
    </div>
  {/if}
</div>

<style>
  .ai-assistant-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 16px;
    box-sizing: border-box;
  }

  .ai-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    padding: 24px;
    opacity: 0.8;
  }

  .ai-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .ai-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ai-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted-foreground);
  }

  .ai-original-box {
    padding: 10px 12px;
    background: var(--muted);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 12px;
    color: var(--muted-foreground);
    line-height: 1.5;
    max-height: 120px;
    overflow-y: auto;
    font-style: italic;
  }

  .ai-result-box {
    padding: 12px 14px;
    background: color-mix(in srgb, var(--primary) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
    border-radius: 8px;
    font-size: 13px;
    color: var(--foreground);
    line-height: 1.5;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  }

  .ai-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .ai-quick-btn {
    padding: 8px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 11px;
    font-weight: 500;
    color: var(--foreground);
    text-align: left;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }

  .ai-quick-btn:hover:not(:disabled) {
    background: var(--muted);
    border-color: color-mix(in srgb, var(--primary) 40%, var(--border));
  }

  .ai-quick-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ai-textarea {
    width: 100%;
    padding: 10px 12px;
    padding-right: 40px;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 12px;
    color: var(--foreground);
    resize: none;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .ai-textarea:focus {
    border-color: var(--primary);
  }

  .ai-submit-btn {
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: var(--primary);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
  }

  .ai-submit-btn:hover:not(:disabled) {
    background: color-mix(in srgb, var(--primary) 80%, black);
  }

  .ai-submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--muted);
  }

  .ai-generating {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: color-mix(in srgb, var(--primary) 5%, transparent);
    border-radius: 8px;
    border: 1px solid color-mix(in srgb, var(--primary) 15%, transparent);
  }

  .ai-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid transparent;
  }

  .ai-btn-primary {
    background: var(--primary);
    color: var(--primary-foreground);
    box-shadow: 0 2px 8px -2px color-mix(in srgb, var(--primary) 50%, transparent);
  }

  .ai-btn-primary:hover {
    background: color-mix(in srgb, var(--primary) 85%, black);
  }

  .ai-btn-outline {
    background: transparent;
    border-color: var(--border);
    color: var(--foreground);
  }

  .ai-btn-outline:hover {
    background: var(--muted);
  }
</style>
