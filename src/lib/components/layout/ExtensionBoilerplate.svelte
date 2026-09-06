<script lang="ts">
  import type { Component } from "svelte";
  import { ArrowRight, Sparkles } from "@lucide/svelte";

  let {
    title,
    description,
    icon: Icon,
    accentClass = "bg-primary/10 text-primary",
    stats = [
      { label: "Setup", value: "In progress" },
      { label: "Automation", value: "Planned" },
      { label: "Insights", value: "Live" },
    ],
  }: {
    title: string;
    description: string;
    icon: Component<{ class?: string }>;
    accentClass?: string;
    stats?: Array<{ label: string; value: string }>;
  } = $props();
</script>

<section
  class="relative overflow-hidden rounded-xl border border-border/60 bg-card/80 p-5 shadow-sm ring-1 ring-foreground/5 sm:p-6 lg:p-7"
>
  <div
    class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"
    aria-hidden="true"
  ></div>

  <div class="relative z-10">
    <div
      class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="flex items-center gap-4">
        <div
          class={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border/60 ${accentClass}`}
        >
          <Icon class="h-6 w-6" />
        </div>
        <div>
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Coming soon
          </p>
          <h3
            class="mt-2 font-heading text-2xl font-bold tracking-[-0.05em] text-foreground sm:text-3xl"
          >
            {title}
          </h3>
        </div>
      </div>

      <span
        class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        <Sparkles class="h-3.5 w-3.5 text-primary" />
        Beta preview
      </span>
    </div>

    <p
      class="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"
    >
      {description}
    </p>

    <div class="mt-6 grid gap-3 md:grid-cols-3">
      {#each stats as item}
        <div class="rounded-lg border border-border/60 bg-background/80 p-4">
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            {item.label}
          </p>
          <p
            class="mt-2 font-heading text-xl font-bold tracking-[-0.05em] text-foreground"
          >
            {item.value}
          </p>
        </div>
      {/each}
    </div>

    <div
      class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div
        class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
      >
        <span class="h-2 w-2 rounded-full bg-primary"></span>
        Module under active build
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 self-start rounded-lg border border-border/60 bg-background px-3.5 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
      >
        View roadmap
        <ArrowRight class="h-4 w-4" />
      </button>
    </div>
  </div>
</section>
