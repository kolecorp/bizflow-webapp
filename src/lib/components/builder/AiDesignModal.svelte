<script lang="ts">
  import { WandSparkles, X, Sparkles, CheckCircle2, ArrowUp, Paperclip, Image as ImageIcon, Link, Zap } from "@lucide/svelte";
  import { PRESETS, type CanvasElement } from "$lib/types/builder";
  import { onDestroy } from "svelte";
  import { fade, scale } from "svelte/transition";

  let { 
    onClose,
    onGenerate
  }: { 
    onClose: () => void;
    onGenerate: (elements: CanvasElement[]) => void;
  } = $props();

  let prompt = $state("");
  let status = $state<"idle" | "generating" | "success">("idle");
  let progressStep = $state(0);

  let simTimeout: ReturnType<typeof setTimeout> | null = null;
  onDestroy(() => { if (simTimeout) clearTimeout(simTimeout); });

  const steps = [
    "Analyzing your requirements…",
    "Selecting optimal layout…",
    "Drafting persuasive copy…",
    "Configuring conversion elements…",
    "Finalizing design schema…"
  ];

  const quickPrompts = [
    { label: "SaaS Waitlist", icon: "🚀", text: "A clean SaaS waitlist page with a hero, feature grid, and an email opt-in form at the bottom." },
    { label: "Webinar Page", icon: "🎙️", text: "A webinar registration page with a countdown timer, host bio, and bullet points of what they'll learn." },
    { label: "Product Launch", icon: "⚡", text: "A high-converting product launch page with hero, social proof, features, and a bold CTA." },
    { label: "Lead Magnet", icon: "🎁", text: "A lead magnet landing page offering a free guide in exchange for an email address." },
    { label: "Agency Portfolio", icon: "✨", text: "A sleek agency portfolio page showcasing case studies, testimonials, and a contact form." },
  ];

  function startGeneration() {
    if (!prompt.trim()) return;
    status = "generating";
    progressStep = 0;
    let idx = 0;
    const next = () => {
      idx++;
      if (idx < steps.length) {
        progressStep = idx;
        simTimeout = setTimeout(next, 700 + Math.random() * 600);
      } else {
        finishGeneration();
      }
    };
    simTimeout = setTimeout(next, 800);
  }

  function finishGeneration() {
    status = "success";
    const mockResult = PRESETS[Math.floor(Math.random() * PRESETS.length)].build();
    simTimeout = setTimeout(() => { onGenerate(mockResult); }, 1200);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      startGeneration();
    }
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Backdrop -->
<div
  class="ai-backdrop"
  transition:fade={{ duration: 200 }}
  onclick={status === 'idle' ? onClose : undefined}
  role="presentation"
>
  <!-- Modal -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="ai-modal"
    onclick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    aria-label="AI Design Generator"
    transition:scale={{ start: 0.95, duration: 300 }}
  >

    {#if status === 'idle'}
      <!-- ─── IDLE STATE ─── -->
      <div class="ai-header">
        <div class="ai-header-icon">
          <WandSparkles class="size-4" />
        </div>
        <div class="ai-header-text">
          <h2>AI Design Generator</h2>
          <p>Describe your page and let AI build it instantly.</p>
        </div>
        <button type="button" class="ai-close" onclick={onClose} aria-label="Close">
          <X class="size-4" />
        </button>
      </div>

      <div class="ai-body">
        <!-- Prompt area -->
        <div class="ai-prompt-area">
          <div class="ai-textarea-wrapper">
            <textarea
              bind:value={prompt}
              placeholder="E.g., Build a high-converting landing page for a coffee shop. It needs a hero, menu highlights, testimonials, and a reservation form…"
              class="ai-textarea"
              rows={5}
            ></textarea>
            <div class="ai-textarea-footer">
              <div class="ai-attachments">
                <button type="button" title="Attach image" class="ai-attach-btn">
                  <ImageIcon class="size-3.5" />
                </button>
                <button type="button" title="Add URL context" class="ai-attach-btn">
                  <Link class="size-3.5" />
                </button>
                <span class="ai-engine-label">
                  <Zap class="size-3" />
                  Design Engine v2
                </span>
              </div>
              <button
                type="button"
                onclick={startGeneration}
                disabled={!prompt.trim()}
                class="ai-send-btn"
                aria-label="Generate"
              >
                <ArrowUp class="size-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Quick prompts -->
        {#if !prompt}
          <div class="ai-quick-prompts">
            <p class="ai-quick-label">Start with a template</p>
            <div class="ai-quick-chips">
              {#each quickPrompts as qp}
                <button
                  type="button"
                  class="ai-chip"
                  onclick={() => prompt = qp.text}
                >
                  <span class="ai-chip-icon">{qp.icon}</span>
                  {qp.label}
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>

    {:else if status === 'generating'}
      <!-- ─── GENERATING STATE ─── -->
      <div class="ai-state-body">
        <div class="ai-generating">
          <div class="ai-orb">
            <div class="ai-orb-ring"></div>
            <div class="ai-orb-ring ai-orb-ring--2"></div>
            <Sparkles class="size-6 ai-orb-icon" />
          </div>
          <div class="ai-gen-text">
            <h3>Building your page</h3>
            <div class="ai-steps">
              {#each steps as step, i}
                <div class="ai-step {i < progressStep ? 'done' : i === progressStep ? 'active' : 'pending'}">
                  <div class="ai-step-dot"></div>
                  <span>{step}</span>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>

    {:else if status === 'success'}
      <!-- ─── SUCCESS STATE ─── -->
      <div class="ai-state-body">
        <div class="ai-success">
          <div class="ai-success-icon">
            <CheckCircle2 class="size-8" />
          </div>
          <h3>Design Ready!</h3>
          <p>Applying layout to canvas…</p>
        </div>
      </div>
    {/if}

  </div>
</div>

<style>
  .ai-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .ai-modal {
    width: 100%;
    max-width: 600px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 24px 48px rgba(0, 0, 0, 0.25),
      0 4px 12px rgba(0,0,0,0.1);
    animation: ai-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes ai-in {
    from { opacity: 0; transform: scale(0.97) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* ─── Header ─── */
  .ai-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    background: color-mix(in srgb, var(--primary) 4%, var(--card));
  }

  .ai-header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.1));
    border: 1px solid hsl(var(--primary) / 0.2);
    color: var(--primary);
    flex-shrink: 0;
  }

  .ai-header-text {
    flex: 1;
    min-width: 0;
  }
  .ai-header-text h2 {
    font-size: 14px;
    font-weight: 700;
    color: var(--foreground);
    margin: 0 0 2px;
    letter-spacing: -0.01em;
  }
  .ai-header-text p {
    font-size: 12px;
    color: var(--muted-foreground);
    margin: 0;
  }

  .ai-close {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--muted-foreground);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .ai-close:hover {
    background: var(--muted);
    color: var(--foreground);
  }

  /* ─── Body ─── */
  .ai-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ─── Textarea ─── */
  .ai-textarea-wrapper {
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    transition: border-color 0.2s;
    background: var(--background);
  }
  .ai-textarea-wrapper:focus-within {
    border-color: hsl(var(--primary) / 0.4);
  }

  .ai-textarea {
    width: 100%;
    padding: 16px;
    border: none;
    background: transparent;
    color: var(--foreground);
    font-size: 14px;
    line-height: 1.6;
    resize: none;
    outline: none;
    font-family: inherit;
  }
  .ai-textarea::placeholder {
    color: var(--muted-foreground);
    opacity: 0.7;
  }

  .ai-textarea-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-top: 1px solid var(--border);
    background: color-mix(in srgb, var(--muted) 40%, transparent);
  }

  .ai-attachments {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .ai-attach-btn {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: var(--muted-foreground);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .ai-attach-btn:hover {
    background: var(--muted);
    color: var(--foreground);
  }

  .ai-engine-label {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
    padding: 3px 8px;
    border-radius: 100px;
    border: 1px solid hsl(var(--primary) / 0.2);
    background: hsl(var(--primary) / 0.06);
    color: hsl(var(--primary) / 0.8);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .ai-send-btn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: none;
    background: var(--primary);
    color: var(--primary-foreground);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .ai-send-btn:hover:not(:disabled) {
    background: color-mix(in srgb, var(--primary) 85%, black);
    transform: scale(1.05);
  }
  .ai-send-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  /* ─── Quick Prompts ─── */
  .ai-quick-prompts {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ai-quick-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0;
  }
  .ai-quick-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .ai-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--card);
    color: var(--muted-foreground);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .ai-chip:hover {
    border-color: hsl(var(--primary) / 0.4);
    color: var(--foreground);
    background: hsl(var(--primary) / 0.05);
  }
  .ai-chip-icon {
    font-size: 13px;
    line-height: 1;
  }

  /* ─── State Body (generating / success) ─── */
  .ai-state-body {
    padding: 48px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Generating */
  .ai-generating {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    text-align: center;
    width: 100%;
    max-width: 340px;
  }

  .ai-orb {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ai-orb-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid hsl(var(--primary) / 0.3);
    border-top-color: var(--primary);
    animation: spin 1.2s linear infinite;
  }
  .ai-orb-ring--2 {
    inset: 8px;
    border-top-color: hsl(var(--primary) / 0.5);
    animation-duration: 0.8s;
    animation-direction: reverse;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .ai-orb-icon {
    color: var(--primary);
    animation: pulse 2s ease-in-out infinite;
    position: relative;
    z-index: 1;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.6; transform: scale(0.9); }
  }

  .ai-gen-text {
    width: 100%;
  }
  .ai-gen-text h3 {
    font-size: 17px;
    font-weight: 700;
    color: var(--foreground);
    margin: 0 0 20px;
    letter-spacing: -0.02em;
  }

  .ai-steps {
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: left;
  }
  .ai-step {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    transition: all 0.3s;
  }
  .ai-step-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    transition: all 0.3s;
  }
  .ai-step.pending { color: var(--muted-foreground); opacity: 0.5; }
  .ai-step.pending .ai-step-dot { background: var(--muted-foreground); opacity: 0.3; }

  .ai-step.active { color: var(--primary); font-weight: 600; }
  .ai-step.active .ai-step-dot {
    background: var(--primary);
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.2);
    animation: dot-pulse 1s ease-in-out infinite;
  }
  @keyframes dot-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.4); }
  }

  .ai-step.done { color: #10b981; }
  .ai-step.done .ai-step-dot { background: #10b981; }

  /* Success */
  .ai-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
    animation: success-in 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes success-in {
    from { opacity: 0; transform: scale(0.8); }
    to   { opacity: 1; transform: scale(1); }
  }
  .ai-success-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(16, 185, 129, 0.12);
    border: 2px solid rgba(16, 185, 129, 0.3);
    color: #10b981;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 40px rgba(16, 185, 129, 0.15);
  }
  .ai-success h3 {
    font-size: 18px;
    font-weight: 700;
    color: var(--foreground);
    margin: 0;
    letter-spacing: -0.02em;
  }
  .ai-success p {
    font-size: 13px;
    color: var(--muted-foreground);
    margin: 0;
  }
</style>
