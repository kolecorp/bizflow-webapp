<script lang="ts">
  export let eyebrow = "";
  export let title = "";
  export let description = "";
</script>

<div class="surface-panel p-6">
  {#if eyebrow}
    <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
      {eyebrow}
    </p>
  {/if}
  {#if title}
    <p class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
      {title}
    </p>
  {/if}
  {#if description}
    <p class="mt-2 text-sm text-muted-foreground">{description}</p>
  {/if}
  {#if $$slots.actions}
    <div class="mt-4 flex flex-wrap gap-2">
      <slot name="actions" />
    </div>
  {/if}
</div>
