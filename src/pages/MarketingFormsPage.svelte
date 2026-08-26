<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    Check,
    ChevronDown,
    ListChecks,
    Plus,
    Save,
    Zap,
  } from "@lucide/svelte";
  let saved = $state(false);
  let actions = $state([
    "Create lead",
    "Send WhatsApp message",
    "Add to campaign",
  ]);
  const available = [
    "Create lead",
    "Create customer",
    "Send WhatsApp message",
    "Send email",
    "Add to campaign",
    "Generate coupon",
    "Notify staff",
    "Create order",
    "Redirect to another page",
  ];
  function toggle(action: string) {
    actions = actions.includes(action)
      ? actions.filter((item) => item !== action)
      : [...actions, action];
  }
</script>

<AppShell
  ><PageHeader
    eyebrow="Marketing · Forms"
    title="Forms & lead actions"
    description="Collect a phone number once, then let Bizflow run the follow-up automatically."
    ><svelte:fragment slot="actions"
      ><button
        type="button"
        on:click={() => (saved = true)}
        class="btn-app-primary"
        ><Save class="h-4 w-4" /> {saved ? "Saved" : "Save form"}</button
      ></svelte:fragment
    ></PageHeader
  >
  <div class="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
    <div class="surface-panel p-6">
      <h2 class="flex items-center gap-2 text-lg font-bold">
        <ListChecks class="h-5 w-5 text-primary" /> Lead form
      </h2>
      <p class="mt-1 text-sm text-muted-foreground">MTN Data Promo signup</p>
      <div class="mt-5 space-y-4">
        <label class="block text-sm font-medium"
          >Form name<input
            value="MTN Data Promo signup"
            class="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5"
          /></label
        ><label class="block text-sm font-medium"
          >Headline<input
            value="Get your first data bundle at a special price"
            class="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5"
          /></label
        ><label class="block text-sm font-medium"
          >Fields<select
            class="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5"
            ><option>Phone number + name</option><option
              >Phone number only</option
            ><option>Phone + email + name</option></select
          ></label
        >
        <div class="rounded-xl border border-border/60 bg-muted/20 p-4">
          <p class="text-sm font-semibold text-foreground">After submission</p>
          <p class="mt-1 text-xs text-muted-foreground">
            Run selected actions in order.
          </p>
          <div class="mt-4 space-y-2">
            {#each actions as action, index}<div
                class="flex items-center gap-2 rounded-lg bg-background p-2.5 text-sm"
              >
                <span
                  class="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                  >{index + 1}</span
                >{action}<button
                  type="button"
                  on:click={() => toggle(action)}
                  class="ml-auto text-xs text-red-500">Remove</button
                >
              </div>{/each}
          </div>
        </div>
      </div>
    </div>
    <div class="surface-panel p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="flex items-center gap-2 text-lg font-bold">
            <Zap class="h-5 w-5 text-primary" /> Workflow actions
          </h2>
          <p class="mt-1 text-sm text-muted-foreground">
            Select the connected modules this form should trigger.
          </p>
        </div>
        <ChevronDown class="h-5 w-5 text-muted-foreground" />
      </div>
      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        {#each available as action}<button
            type="button"
            on:click={() => toggle(action)}
            class={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${actions.includes(action) ? "border-primary bg-primary/5" : "border-border/60 hover:bg-muted/20"}`}
            ><span
              class={`flex h-7 w-7 items-center justify-center rounded-lg ${actions.includes(action) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >{#if actions.includes(action)}<Check
                  class="h-4 w-4"
                />{:else}<Plus class="h-4 w-4" />{/if}</span
            ><span class="text-sm font-medium text-foreground">{action}</span
            ></button
          >{/each}
      </div>
      <div
        class="mt-6 rounded-2xl border border-green-500/20 bg-green-500/5 p-5"
      >
        <p class="font-semibold text-foreground">Connected journey</p>
        <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
          Ad click → landing page → form submission → lead created → WhatsApp
          message → AI bot → payment → VTU order confirmation.
        </p>
      </div>
    </div>
  </div></AppShell
>
