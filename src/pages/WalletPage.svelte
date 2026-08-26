<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    ArrowDownLeft,
    ArrowUpRight,
    CheckCircle2,
    CreditCard,
    Plus,
    WalletCards,
  } from "@lucide/svelte";
  let provider = $state("Monnify");
  let connected = $state(false);
  let fundingAmount = $state(10000);
  const history = [
    ["Funded business wallet", "Monnify", "+₦50,000", "Today"],
    ["Customer wallet purchase", "Ibrahim · MTN Data", "-₦750", "Today"],
    ["Provider settlement", "VTPass", "-₦18,400", "Yesterday"],
    ["Funded customer wallet", "Flutterwave", "+₦5,000", "Yesterday"],
  ];
</script>

<AppShell
  ><PageHeader
    eyebrow="Extension · Payments"
    title="Wallet & payments"
    description="Keep provider funding, VTU float, and customer balances clear in one place."
  />
  <div class="space-y-6">
    <div class="grid gap-4 lg:grid-cols-3">
      <div class="surface-panel relative overflow-hidden p-6">
        <div
          class="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-primary/5"
          aria-hidden="true"
        ></div>
        <div class="relative flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-medium text-muted-foreground">
              Business wallet
            </p>
            <p class="mt-3 font-heading text-3xl font-bold text-foreground">
              ₦248,600
            </p>
            <p class="mt-2 flex items-center gap-1.5 text-xs text-green-600">
              <CheckCircle2 class="h-3.5 w-3.5" /> Available VTU float
            </p>
          </div>
          <span
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
            ><WalletCards class="h-5 w-5" /></span
          >
        </div>
        <button type="button" class="btn-app-primary mt-5 text-xs"
          ><Plus class="h-4 w-4" /> Fund business wallet</button
        >
      </div>
      <div class="surface-panel p-6">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-medium text-muted-foreground">
              Customer wallets
            </p>
            <p class="mt-3 font-heading text-3xl font-bold text-foreground">
              ₦84,200
            </p>
            <p class="mt-2 text-xs text-primary">126 active customers</p>
          </div>
          <span
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600"
            ><ArrowDownLeft class="h-5 w-5" /></span
          >
        </div>
        <button
          type="button"
          class="mt-5 text-xs font-semibold text-primary hover:underline"
          >View customer balances</button
        >
      </div>
      <div class="surface-panel p-6">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-medium text-muted-foreground">
              Pending transactions
            </p>
            <p class="mt-3 font-heading text-3xl font-bold text-foreground">
              7
            </p>
            <p class="mt-2 text-xs text-amber-600">₦12,450 in review</p>
          </div>
          <span
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600"
            ><ArrowUpRight class="h-5 w-5" /></span
          >
        </div>
        <button
          type="button"
          class="mt-5 text-xs font-semibold text-primary hover:underline"
          >Review queue</button
        >
      </div>
    </div>
    <div
      class="grid items-start gap-6 lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.2fr)]"
    >
      <div class="surface-panel p-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="flex items-center gap-2 text-lg font-bold">
              <CreditCard class="h-5 w-5 text-primary" /> Payment providers
            </h2>
            <p class="mt-1 text-sm text-muted-foreground">
              Connect where customers fund wallets.
            </p>
          </div>
          <CheckCircle2 class="h-5 w-5 text-green-500" />
        </div>
        <div class="mt-5 space-y-3">
          <button
            type="button"
            on:click={() => (provider = "Monnify")}
            class={`flex w-full items-center justify-between rounded-xl border p-4 text-left ${provider === "Monnify" ? "border-primary bg-primary/5" : "border-border/60"}`}
            ><span
              ><span class="block font-semibold text-foreground">Monnify</span
              ><span class="block text-xs text-muted-foreground"
                >Card, transfer, USSD</span
              ></span
            ><span class="text-xs font-semibold text-green-600"
              >{provider === "Monnify" && connected
                ? "Connected"
                : "Select"}</span
            ></button
          ><button
            type="button"
            on:click={() => (provider = "Flutterwave")}
            class={`flex w-full items-center justify-between rounded-xl border p-4 text-left ${provider === "Flutterwave" ? "border-primary bg-primary/5" : "border-border/60"}`}
            ><span
              ><span class="block font-semibold text-foreground"
                >Flutterwave</span
              ><span class="block text-xs text-muted-foreground"
                >Cards and mobile money</span
              ></span
            ><span class="text-xs text-muted-foreground">Select</span></button
          ><label class="mt-4 block text-sm font-medium"
            >Test amount<input
              type="number"
              bind:value={fundingAmount}
              class="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5"
            /></label
          ><button
            type="button"
            on:click={() => (connected = true)}
            class="btn-app-primary mt-4 w-full"
            ><WalletCards class="h-4 w-4" />
            {connected ? "Provider connected" : `Connect ${provider}`}</button
          >
        </div>
      </div>
      <div class="surface-panel p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold">Transaction history</h2>
            <p class="mt-1 text-sm text-muted-foreground">
              Business wallet and customer wallet activity.
            </p>
          </div>
          <button type="button" class="text-sm font-medium text-primary"
            >Export</button
          >
        </div>
        <div class="mt-5 space-y-2">
          {#each history as item}<div
              class="flex items-center gap-3 rounded-xl border border-border/60 p-3"
            >
              <span
                class={`flex h-9 w-9 items-center justify-center rounded-lg ${item[2].startsWith("+") ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}
                >{#if item[2].startsWith("+")}<ArrowDownLeft
                    class="h-4 w-4"
                  />{:else}<ArrowUpRight class="h-4 w-4" />{/if}</span
              ><span class="min-w-0 flex-1"
                ><span class="block text-sm font-medium text-foreground"
                  >{item[0]}</span
                ><span class="block truncate text-xs text-muted-foreground"
                  >{item[1]} · {item[3]}</span
                ></span
              ><span
                class={`text-sm font-semibold ${item[2].startsWith("+") ? "text-green-600" : "text-foreground"}`}
                >{item[2]}</span
              >
            </div>{/each}
        </div>
      </div>
    </div>
  </div></AppShell
>
