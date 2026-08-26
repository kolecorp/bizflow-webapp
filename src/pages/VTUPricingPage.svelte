<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { Check, Save, Settings2 } from "@lucide/svelte";
  let saved = $state(false);
  let services = $state([
    { name: "MTN Airtime", cost: 980, price: 1000, enabled: true },
    { name: "Airtel Data 2GB", cost: 700, price: 750, enabled: true },
    { name: "Glo Data 1GB", cost: 380, price: 400, enabled: true },
    { name: "DSTV Compact", cost: 8750, price: 9000, enabled: false },
  ]);
  function save() {
    saved = true;
    setTimeout(() => (saved = false), 2200);
  }
</script>

<AppShell
  ><PageHeader
    eyebrow="VTU · Configuration"
    title="Rules & pricing"
    description="Set simple, transparent rules for what customers pay and what your business earns."
  />
  <div class="space-y-6">
    <div class="grid gap-4 md:grid-cols-4">
      <label class="surface-panel p-4 text-sm font-medium"
        >Minimum amount<input
          value="₦100"
          class="mt-2 w-full border-b border-border bg-transparent py-2 text-sm outline-none"
        /></label
      ><label class="surface-panel p-4 text-sm font-medium"
        >Maximum amount<input
          value="₦50,000"
          class="mt-2 w-full border-b border-border bg-transparent py-2 text-sm outline-none"
        /></label
      ><label class="surface-panel p-4 text-sm font-medium"
        >Customer daily limit<input
          value="10 transactions"
          class="mt-2 w-full border-b border-border bg-transparent py-2 text-sm outline-none"
        /></label
      ><label class="surface-panel p-4 text-sm font-medium"
        >Default commission<input
          value="2%"
          class="mt-2 w-full border-b border-border bg-transparent py-2 text-sm outline-none"
        /></label
      >
    </div>
    <div class="surface-panel overflow-hidden p-0">
      <div
        class="flex items-center justify-between border-b border-border/60 p-6"
      >
        <div>
          <h2 class="flex items-center gap-2 text-lg font-bold">
            <Settings2 class="h-5 w-5 text-primary" /> Service pricing
          </h2>
          <p class="mt-1 text-sm text-muted-foreground">
            Edit your markup and switch services on or off.
          </p>
        </div>
        {#if saved}<span
            class="flex items-center gap-1.5 text-xs font-semibold text-green-600"
            ><Check class="h-4 w-4" /> Saved</span
          >{/if}
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[680px] text-left text-sm">
          <thead class="bg-muted/30 text-xs text-muted-foreground"
            ><tr
              ><th class="p-4 font-medium">Service</th><th
                class="p-4 font-medium">Provider cost</th
              ><th class="p-4 font-medium">Customer price</th><th
                class="p-4 font-medium">Profit</th
              ><th class="p-4 font-medium">Available</th></tr
            ></thead
          ><tbody
            >{#each services as service, index}<tr
                class="border-t border-border/60"
                ><td class="p-4 font-medium text-foreground">{service.name}</td
                ><td class="p-4 text-muted-foreground"
                  >₦{service.cost.toLocaleString()}</td
                ><td class="p-4"
                  ><input
                    type="number"
                    bind:value={service.price}
                    class="w-28 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  /></td
                ><td class="p-4 font-semibold text-green-600"
                  >₦{(service.price - service.cost).toLocaleString()}</td
                ><td class="p-4"
                  ><button
                    type="button"
                    on:click={() =>
                      (services[index].enabled = !service.enabled)}
                    class={`relative h-5 w-9 rounded-full ${service.enabled ? "bg-primary" : "bg-muted"}`}
                    ><span
                      class={`absolute top-1 h-3 w-3 rounded-full bg-white ${service.enabled ? "left-5" : "left-1"}`}
                    ></span></button
                  ></td
                ></tr
              >{/each}</tbody
          >
        </table>
      </div>
      <div class="flex justify-end border-t border-border/60 p-5">
        <button type="button" on:click={save} class="btn-app-primary"
          ><Save class="h-4 w-4" /> Save pricing rules</button
        >
      </div>
    </div>
  </div></AppShell
>
