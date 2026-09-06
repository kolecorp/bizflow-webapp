<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet";
  import { Button } from "$lib/components/ui/button";
  import { CheckCircle2, CreditCard, Sparkles, ShieldCheck, Zap, X } from "@lucide/svelte";
  import type { Extension } from "$lib/stores/extensions";

  let { open = false, extension = null, onOpenChange, onConfirm } = $props<{
    open: boolean;
    extension: Extension | null;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: () => void;
  }>();

  let isProcessing = $state(false);

  function handleConfirm() {
    isProcessing = true;
    setTimeout(() => {
      isProcessing = false;
      onConfirm();
    }, 1500);
  }
</script>

<Sheet.Root {open} {onOpenChange}>
  <Sheet.Content
    showCloseButton={false}
    class="sheet-floating flex flex-col overflow-hidden border-none bg-transparent shadow-none p-0"
    style="top: 1rem; bottom: 1rem; right: 1rem; height: auto; width: min(34rem, calc(100vw - 2rem));"
  >
    <!-- The actual floating card -->
    <div class="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-popover shadow-2xl">
      
      <!-- Header -->
      <div class="flex shrink-0 items-start justify-between gap-4 border-b border-border/40 px-6 py-5">
        <div>
          <p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Sparkles class="h-3.5 w-3.5 text-primary" />
            Extension Marketplace
          </p>
          <h2 class="mt-1 font-heading text-xl font-extrabold tracking-tight text-foreground">
            {extension?.name ?? ""}
          </h2>
        </div>
        <button
          type="button"
          onclick={() => onOpenChange(false)}
          class="mt-0.5 shrink-0 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Scrollable body -->
      <div class="flex-1 overflow-y-auto px-6 py-6 space-y-6">

        <!-- Extension preview card -->
        <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div class="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/10 blur-xl" aria-hidden="true"></div>
          <div class="relative flex items-center gap-4">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-background shadow-sm">
              {#if extension?.icon}
                <extension.icon class="h-7 w-7 text-primary" />
              {/if}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-wider text-primary/70">{extension?.category}</p>
              <h3 class="font-heading text-base font-bold text-foreground leading-snug">{extension?.name}</h3>
            </div>
            <div class="ml-auto shrink-0 text-right">
              <p class="font-heading text-2xl font-extrabold text-primary leading-none">
                {#if extension?.price === "Free"}Free{:else}{extension?.price?.replace("/mo", "") ?? ""}{/if}
              </p>
              {#if extension?.price && extension.price !== "Free"}
                <p class="text-[10px] font-medium text-muted-foreground">per month</p>
              {/if}
            </div>
          </div>
          <p class="relative mt-4 text-sm text-muted-foreground leading-relaxed">{extension?.description}</p>
        </div>

        <!-- Included features -->
        <div class="space-y-3">
          <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">What's included</p>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                <CheckCircle2 class="h-4 w-4" />
              </div>
              <div class="pt-0.5">
                <p class="text-sm font-semibold text-foreground">Full feature access</p>
                <p class="text-xs text-muted-foreground mt-0.5">Everything you need to scale your operations from day one.</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                <Zap class="h-4 w-4" />
              </div>
              <div class="pt-0.5">
                <p class="text-sm font-semibold text-foreground">Unlimited staff access</p>
                <p class="text-xs text-muted-foreground mt-0.5">Your whole team can use this module with no per-seat fees.</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                <ShieldCheck class="h-4 w-4" />
              </div>
              <div class="pt-0.5">
                <p class="text-sm font-semibold text-foreground">Priority support & onboarding</p>
                <p class="text-xs text-muted-foreground mt-0.5">Dedicated setup assistance and priority ticket queue.</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Billing note -->
        <div class="rounded-xl border border-border/50 bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          Billed monthly. Cancel anytime — billing pauses automatically if you deactivate the extension.
        </div>
      </div>

      <!-- Footer -->
      <div class="shrink-0 border-t border-border/40 bg-popover px-6 py-4 flex items-center gap-3">
        <Button
          variant="outline"
          class="flex-1 rounded-xl"
          onclick={() => onOpenChange(false)}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          class="flex-[2] rounded-xl"
          onclick={handleConfirm}
          disabled={isProcessing}
        >
          <CreditCard class="mr-2 h-4 w-4" />
          {isProcessing ? "Processing…" : extension?.price === "Free" ? "Activate Free" : `Subscribe · ${extension?.price}`}
        </Button>
      </div>
    </div>
  </Sheet.Content>
</Sheet.Root>
