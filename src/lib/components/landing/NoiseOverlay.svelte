<script lang="ts">
  let {
    intensity = "medium",
    class: className = "",
  }: {
    intensity?: "light" | "medium" | "strong";
    class?: string;
  } = $props();

  const opacityMap = {
    light: "opacity-[0.35] dark:opacity-[0.25]",
    medium: "opacity-[0.55] dark:opacity-[0.4]",
    strong: "opacity-[0.75] dark:opacity-[0.55]",
  };
</script>

<div
  class="pointer-events-none absolute inset-0 bg-noise {opacityMap[intensity]} {className}"
  aria-hidden="true"
></div>
