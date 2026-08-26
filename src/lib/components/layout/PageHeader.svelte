<script lang="ts">
  export let eyebrow = "";
  export let title = "";
  export let description = "";
</script>

<div class="dashboard-page-header surface-panel p-6 sm:p-7">
  {#if eyebrow}
    <p
      class="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary"
    >
      {eyebrow}
    </p>
  {/if}
  {#if title}
    <p
      class="mt-2 font-heading text-2xl font-bold tracking-[-0.04em] text-foreground"
    >
      {title}
    </p>
  {/if}
  {#if description}
    <p class="mt-2 text-sm text-muted-foreground">{description}</p>
  {/if}
  {#if $$slots.actions}
    <div class="dashboard-page-header__actions mt-5 flex flex-wrap gap-2">
      <slot name="actions" />
    </div>
  {/if}
</div>
