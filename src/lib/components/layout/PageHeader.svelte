<script lang="ts">
  export let eyebrow = "";
  export let title = "";
  export let description = "";
  export let infographic = "";
  export let infographicAlt = "";
</script>

<div
  class="dashboard-page-header surface-panel relative isolate overflow-hidden p-6 sm:p-7"
>
  {#if infographic}
    <div
      class="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[42%] overflow-hidden sm:block"
    >
      <img
        src={infographic}
        alt={infographicAlt || `${title} overview`}
        class="h-full w-full object-cover object-center opacity-95"
        loading="eager"
      />
      <div
        class="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-card via-card/85 to-transparent"
      ></div>
    </div>
  {/if}
  <div class={`relative z-10 ${infographic ? "sm:max-w-[60%]" : ""}`}>
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
</div>
