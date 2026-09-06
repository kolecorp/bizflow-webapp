<script lang="ts">
  import Eye from "@lucide/svelte/icons/eye";
  import EyeOff from "@lucide/svelte/icons/eye-off";
  import { Input } from "$lib/components/ui/input";
  import { cn } from "$lib/utils.js";
  import type { HTMLInputAttributes } from "svelte/elements";

  type Props = HTMLInputAttributes & {
    value?: string;
    class?: string;
  };

  let {
    value = $bindable(),
    class: className,
    ...restProps
  }: Props = $props();

  let showPassword = $state(false);

  function togglePassword() {
    showPassword = !showPassword;
  }
</script>

<div class="relative">
  <Input
    bind:value
    type={showPassword ? "text" : "password"}
    class={cn("pr-10", className)}
    {...restProps}
  />

  <button
    type="button"
    aria-label={showPassword ? "Hide password" : "Show password"}
    onclick={togglePassword}
    class="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground transition hover:text-foreground"
  >
    {#if showPassword}
      <EyeOff class="h-4 w-4" />
    {:else}
      <Eye class="h-4 w-4" />
    {/if}
  </button>
</div>
