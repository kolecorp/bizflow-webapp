<script lang="ts">
  import type { Component } from "svelte";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";

  type GlowVariant = "emerald" | "blue" | "amber" | "violet" | "rose" | "primary";

  let {
    label,
    value,
    subtext = "",
    icon: Icon,
    variant = "primary",
    class: className = "",
  }: {
    label: string;
    value: string | number;
    subtext?: string;
    icon?: Component<{ class?: string }>;
    variant?: GlowVariant;
    class?: string;
  } = $props();

  const glowMap: Record<GlowVariant, string> = {
    emerald: "glow-emerald",
    blue: "glow-blue",
    amber: "glow-amber",
    violet: "glow-violet",
    rose: "glow-rose",
    primary: "glow-primary",
  };

  const iconColorMap: Record<GlowVariant, string> = {
    emerald: "text-emerald-500",
    blue: "text-blue-500",
    amber: "text-amber-500",
    violet: "text-violet-500",
    rose: "text-rose-500",
    primary: "text-primary",
  };
</script>

<div class="glow-stat-card {glowMap[variant]} {className}">
  <div class="glow-stat-card__inner relative overflow-hidden p-5">
    <NoiseOverlay intensity="light" class="rounded-[inherit]" />
    <div class="relative z-10">
      <div class="flex items-start justify-between gap-3">
        <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        {#if Icon}
          <div class="rounded-lg bg-background/60 p-2 ring-1 ring-border/40 backdrop-blur-sm">
            <Icon class="h-4 w-4 {iconColorMap[variant]}" />
          </div>
        {/if}
      </div>
      <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-foreground">
        {value}
      </p>
      {#if subtext}
        <p class="mt-1.5 text-xs text-muted-foreground">{subtext}</p>
      {/if}
    </div>
  </div>
</div>
