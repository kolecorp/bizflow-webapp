<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    printAgents,
    discoveredPrinters,
    pairingCode,
    agentSearching,
    generatePairingCode,
    simulateAgentSearch,
    connectDiscoveredPrinter,
  } from "$lib/stores/businessData";
  import {
    Download,
    Wifi,
    Printer,
    CheckCircle2,
    Loader2,
    Copy,
    Plus,
  } from "@lucide/svelte";

  let codeEntered = "";
  let paired = true;

  function handleGenerateCode() {
    generatePairingCode();
    paired = false;
  }

  function handlePair() {
    if (codeEntered.length >= 6) {
      paired = true;
      codeEntered = "";
    }
  }

  function handleSearch() {
    simulateAgentSearch();
  }

  function copyCode(code: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Settings"
    title="Connect your printing system"
    description="Install the Bizflow Print Agent on a computer on your local network. The agent discovers printers and maintains a secure outbound connection to Bizflow Cloud."
  />

  <!-- Architecture diagram -->
  <div class="surface-muted p-6 font-mono text-xs text-muted-foreground leading-relaxed">
    <pre class="whitespace-pre-wrap">
Browser → Bizflow Cloud → Print Agent → Local Printer

The agent uses outbound WebSocket/HTTPS — no port forwarding required.
IPP is the preferred protocol; Windows Spooler, CUPS, USB supported via agent.
    </pre>
  </div>

  <div class="grid gap-6 lg:grid-cols-2">
    <!-- Step 1: Install agent -->
    <div class="surface-panel p-6">
      <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-3">
        Step 1
      </p>
      <h3 class="text-lg font-semibold text-foreground">Install Bizflow Print Agent</h3>
      <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
        A small application that runs on a computer connected to your printers. It
        discovers devices on the local network and reports status to Bizflow Cloud.
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          class="btn-app-primary"
        >
          <Download class="h-4 w-4" />
          Windows installer
        </button>
        <button
          type="button"
          class="btn-app-secondary"
        >
          <Download class="h-4 w-4" />
          Linux package
        </button>
      </div>
    </div>

    <!-- Step 2: Pair agent -->
    <div class="surface-panel p-6">
      <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-3">
        Step 2
      </p>
      <h3 class="text-lg font-semibold text-foreground">Connect agent to Bizflow</h3>
      <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
        Generate a connection code in Bizflow and enter it in the Print Agent to pair
        securely with your business.
      </p>

      {#if $pairingCode && !paired}
        <div class="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p class="text-[10px] uppercase tracking-wider text-muted-foreground">Connection code</p>
          <div class="mt-2 flex items-center gap-3">
            <p class="font-mono text-2xl font-bold tracking-widest text-primary">{$pairingCode}</p>
            <button
              type="button"
              on:click={() => copyCode($pairingCode ?? "")}
              class="rounded-lg border border-border p-2 hover:bg-muted"
              title="Copy code"
            >
              <Copy class="h-4 w-4" />
            </button>
          </div>
          <p class="mt-2 text-xs text-muted-foreground">Expires in 15 minutes</p>
        </div>
      {/if}

      <div class="mt-4 space-y-3">
        <button
          type="button"
          on:click={handleGenerateCode}
          class="btn-app-secondary w-full py-2.5"
        >
          Generate connection code
        </button>
        <div class="flex gap-2">
          <input
            type="text"
            placeholder="Enter code from agent"
            bind:value={codeEntered}
            class="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
          <button
            type="button"
            on:click={handlePair}
            class="btn-app-primary"
          >
            Pair
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Connected agents -->
  <div class="surface-panel p-6">
    <h3 class="text-lg font-semibold text-foreground mb-4">Connected agents</h3>
    <div class="space-y-3">
      {#each $printAgents as agent}
        <div class="surface-row flex items-center justify-between px-4 py-4">
          <div class="flex items-center gap-3">
            <span
              class={`h-2.5 w-2.5 rounded-full ${agent.status === "online" ? "bg-green-500" : "bg-muted-foreground"}`}
            ></span>
            <div>
              <p class="text-sm font-medium text-foreground">{agent.name}</p>
              <p class="text-xs text-muted-foreground">
                {agent.machine} · {agent.printersConnected} printers · {agent.lastSeen}
              </p>
            </div>
          </div>
          <span class="text-xs font-medium text-green-600 dark:text-green-400">Connected</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- Step 3: Discover printers -->
  <div class="surface-panel p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-1">
          Step 3
        </p>
        <h3 class="text-lg font-semibold text-foreground">Discover & connect printers</h3>
        <p class="text-sm text-muted-foreground mt-1">
          The agent searches your local network using IPP/DNS-SD discovery.
        </p>
      </div>
      <button
        type="button"
        on:click={handleSearch}
        disabled={$agentSearching}
        class="btn-app-primary disabled:opacity-60"
      >
        {#if $agentSearching}
          <Loader2 class="h-4 w-4 animate-spin" />
          Searching...
        {:else}
          <Wifi class="h-4 w-4" />
          Search network
        {/if}
      </button>
    </div>

    {#if $agentSearching}
      <div class="rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
        <Loader2 class="h-6 w-6 animate-spin mx-auto text-primary" />
        <p class="mt-3 text-sm text-muted-foreground">Searching for printers on local network...</p>
      </div>
    {:else if $discoveredPrinters.length === 0}
      <div class="rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
        All discovered printers are connected. Run search again after adding new devices.
      </div>
    {:else}
      <div class="grid gap-4 sm:grid-cols-2">
        {#each $discoveredPrinters as disc}
          <div class="surface-muted p-5">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <Printer class="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p class="text-sm font-semibold text-foreground">{disc.name}</p>
                  <p class="text-xs text-muted-foreground">{disc.ip}</p>
                  <p class="text-xs text-muted-foreground mt-1">{disc.protocol}</p>
                </div>
              </div>
            </div>
            <div class="mt-3 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
              <span class="rounded border border-border px-1.5 py-0.5">
                {disc.supportsColor ? "Colour" : "B&W"}
              </span>
              <span class="rounded border border-border px-1.5 py-0.5">
                {disc.supportsDuplex ? "Duplex" : "Simplex"}
              </span>
              <span class="rounded border border-border px-1.5 py-0.5">
                {disc.paperSizes.join(", ")}
              </span>
            </div>
            <button
              type="button"
              on:click={() => connectDiscoveredPrinter(disc.id)}
              class="btn-app-primary w-full mt-4"
            >
              <Plus class="h-4 w-4" />
              Connect
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Security note -->
  <div class="rounded-2xl border border-green-500/20 bg-green-500/5 p-5 flex items-start gap-3">
    <CheckCircle2 class="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
    <div>
      <p class="text-sm font-medium text-foreground">Secure multi-tenant architecture</p>
      <p class="mt-1 text-sm text-muted-foreground">
        Each agent belongs to one business. Printers are never exposed to the internet —
        the agent initiates an outbound encrypted connection. Tenant isolation is enforced
        at the API level (tenant_id, agent_id, device_id).
      </p>
    </div>
  </div>
</AppShell>
