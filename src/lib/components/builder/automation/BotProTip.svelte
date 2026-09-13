<script lang="ts">
  import { Bot, Lightbulb, X } from '@lucide/svelte';
  
  let showTip = $state(true);
</script>

{#if showTip}
<div class="bot-widget">
  <div class="pro-tip">
    <div class="tip-header">
      <div class="tip-icon-wrap">
        <Bot class="size-4 text-primary" />
      </div>
      <div class="tip-title-wrap">
        <Lightbulb class="size-3 text-yellow-500" />
        <span class="tip-title">Pro tip</span>
      </div>
      <button class="close-btn" onclick={() => showTip = false} aria-label="Dismiss tip">
        <X class="size-3.5 text-muted-foreground" />
      </button>
    </div>
    <p class="tip-text">
      Use the <strong>IF node</strong> to create different flows for new and returning users.
    </p>
  </div>
</div>
{/if}

<style>
  .bot-widget {
    position: absolute;
    bottom: 24px;
    left: 24px;
    z-index: 10;
    pointer-events: auto;
    animation: slide-up 0.3s cubic-bezier(0.2, 0, 0, 1);
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .pro-tip {
    background: color-mix(in srgb, var(--card) 85%, transparent);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px;
    width: 260px;
    box-shadow: 0 8px 24px color-mix(in srgb, var(--foreground) 8%, transparent);
  }

  .tip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .tip-icon-wrap {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: color-mix(in srgb, var(--primary) 12%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tip-title-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
  }

  .tip-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--foreground);
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  
  .close-btn:hover {
    background: var(--muted);
    color: var(--foreground);
  }

  .tip-text {
    font-size: 12px;
    color: var(--muted-foreground);
    margin: 0;
    line-height: 1.4;
  }
</style>
