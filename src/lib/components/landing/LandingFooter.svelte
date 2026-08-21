<script lang="ts">
  import { goto } from "$app/navigation";

  function navigate(path: string) {
    goto(path);
  }

  const footerLinks = [
    { label: "Features", path: "/features" },
    { label: "Solutions", path: "/solutions" },
    { label: "Sign in", path: "/login" },
  ];
</script>

<footer class="border-t border-border bg-card/50 py-12">
  <div class="mx-auto max-w-7xl px-6 sm:px-8">
    <div
      class="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-border bg-background shadow-sm"
        >
          <img
            src="/cafe-logo.png"
            alt="Bizflow logo"
            class="h-6 w-6 object-contain"
          />
        </div>
        <div>
          <p class="font-heading text-sm font-black tracking-[-0.04em] text-foreground">
            Bizflow
          </p>
          <p class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Business center management
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-6">
        {#each footerLinks as link}
          <button
            type="button"
            onclick={() => navigate(link.path)}
            class="text-sm text-muted-foreground transition hover:text-foreground"
          >
            {link.label}
          </button>
        {/each}
      </div>
    </div>

    <div
      class="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row sm:items-center"
    >
      <p class="text-xs text-muted-foreground">
        © 2026 Bizflow. Built for business centers across Africa.
      </p>
      <p class="text-xs text-muted-foreground">
        Printing · Typing · Graphics · Training
      </p>
    </div>
  </div>
</footer>
