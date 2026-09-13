<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import {
    Bot,
    Check,
    ChevronRight,
    Command,
    CornerDownLeft,
    History,
    Lightbulb,
    MessageSquareText,
    Sparkles,
    X,
    Zap,
  } from "@lucide/svelte";

  let open = $state(false);
  let mode = $state<"agent" | "chat">("agent");
  let command = $state("");
  let status = $state("Ready when you are.");
  let entries = $state<
    Array<{ role: "user" | "assistant"; text: string; path?: string }>
  >([]);

  const shortcuts = [
    { label: "Show today's sales", command: "show today's sales", icon: "₦" },
    { label: "Review low stock", command: "open inventory", icon: "▦" },
    { label: "Open VTU pricing", command: "go to vtu pricing", icon: "↗" },
    {
      label: "Configure WhatsApp",
      command: "open whatsapp customers",
      icon: "◌",
    },
  ];

  function getDestination(input: string): [string, string] | null {
    if (input.includes("vtu") && input.includes("transaction"))
      return ["/extensions/vtu/transactions", "Opening VTU Transactions"];
    if (
      input.includes("vtu") &&
      (input.includes("pricing") || input.includes("rules"))
    )
      return ["/extensions/vtu/pricing", "Opening VTU Rules & Pricing"];
    if (
      input.includes("vtu") &&
      (input.includes("purchase") || input.includes("buy"))
    )
      return ["/extensions/vtu/purchase", "Opening New VTU Purchase"];
    if (input.includes("transaction"))
      return ["/transactions", "Opening Transactions"];
    if (
      input.includes("vtu") &&
      (input.includes("provider") || input.includes("setup"))
    )
      return ["/extensions/vtu/provider", "Opening VTU Provider Setup"];
    if (input.includes("vtu"))
      return ["/extensions/vtu", "Opening VTU Platform"];
    if (input.includes("sales") || input.includes("revenue"))
      return ["/reports", "Opening Daily Sales"];
    if (input.includes("inventory") || input.includes("stock"))
      return ["/inventory", "Opening Stock & Inventory"];
    if (input.includes("whatsapp"))
      return [
        "/extensions/whatsapp/customers",
        "Opening WhatsApp Customer Bot",
      ];
    if (input.includes("setting")) return ["/settings", "Opening Settings"];
    return null;
  }

  function runCommand(value = command) {
    const raw = value.trim();
    const input = raw.toLowerCase();
    if (!input) return;
    command = "";
    entries = [...entries, { role: "user", text: raw }];
    const destination = getDestination(input);

    if (mode === "agent" && destination) {
      status = `${destination[1]}...`;
      entries = [
        ...entries,
        { role: "assistant", text: `${destination[1]}.`, path: destination[0] },
      ];
      setTimeout(() => goto(destination[0]), 300);
      return;
    }

    const response = input.includes("help")
      ? "I can navigate your workspace and take actions for you. Try asking me to open a page, review stock, or show today's sales."
      : mode === "chat"
        ? `I can help you think through '${raw}'. Ask me about sales, inventory, VTU, customers, or your workspace.`
        : "I understand the request, but that action is not connected yet. Try one of the suggested commands below.";
    status = "Completed";
    entries = [...entries, { role: "assistant", text: response }];
  }

  function handleKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open = !open;
    }
    if (open && event.key === "Escape") open = false;
    if (
      open &&
      event.key === "/" &&
      document.activeElement?.tagName !== "INPUT"
    ) {
      event.preventDefault();
      mode = mode === "agent" ? "chat" : "agent";
    }
  }

  $effect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });
</script>

<button
  type="button"
  onclick={() => (open = true)}
  aria-label="Open Bizzy workspace"
  class="group fixed bottom-5 right-5 z-40 flex items-end gap-2 text-left"
>
  <span
    class="mb-1 hidden rounded-md border border-border bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground sm:block opacity-0 transition group-hover:opacity-100"
    >Ctrl K</span
  >
  <span
    class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card transition group-hover:border-primary/50"
  >
    <img
      src="/bizflow-ai.png"
      alt=""
      aria-hidden="true"
      class="h-full w-full object-cover"
    />
  </span>
</button>

{#if open}
  <div
    class="fixed inset-0 z-50 flex justify-end bg-foreground/10"
    role="presentation"
    onclick={(event) => event.target === event.currentTarget && (open = false)}
  >
    <section
      class="flex h-full w-full max-w-110 flex-col overflow-hidden border-l border-border bg-popover text-popover-foreground sm:max-w-110"
      role="dialog"
      aria-modal="true"
      aria-label="Bizzy workspace"
    >
      <header
        class="flex items-center justify-between border-b border-border/60 px-5 py-4"
      >
        <div class="flex items-center gap-3">
          <span
            class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-border bg-card"
            ><img
              src="/bizflow-ai.png"
              alt=""
              aria-hidden="true"
              class="h-full w-full object-cover"
            /></span
          >
          <div>
            <div class="flex items-center gap-2">
              <h2 class="font-heading text-sm font-bold">Bizzy workspace</h2>
              <span
                class="flex items-center gap-1 text-[10px] font-medium text-green-600"
                ><span class="h-1.5 w-1.5 rounded-full bg-green-500"></span> Online</span
              >
            </div>
            <p class="mt-0.5 text-xs text-muted-foreground">
              Your shortcut into the entire workspace
            </p>
          </div>
        </div>
        <button
          type="button"
          onclick={() => (open = false)}
          aria-label="Close Bizzy workspace"
          class="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          ><X class="h-4 w-4" /></button
        >
      </header>
      <div
        class="flex items-center justify-between border-b border-border/60 px-5 py-3"
      >
        <div class="flex rounded-xl bg-muted/60 p-1">
          <button
            type="button"
            onclick={() => (mode = "agent")}
            class={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${mode === "agent" ? "bg-background text-foreground ring-1 ring-border" : "text-muted-foreground"}`}
            ><Zap class="h-3.5 w-3.5" />Agent</button
          ><button
            type="button"
            onclick={() => (mode = "chat")}
            class={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${mode === "chat" ? "bg-background text-foreground ring-1 ring-border" : "text-muted-foreground"}`}
            ><MessageSquareText class="h-3.5 w-3.5" />Chat</button
          >
        </div>
        <span class="hidden text-[10px] text-muted-foreground sm:block"
          >Press <kbd
            class="rounded border border-border bg-muted px-1.5 py-0.5 font-mono"
            >/</kbd
          > to switch modes</span
        >
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div class="rounded-2xl bg-muted/35 p-2 sm:p-2.5">
          <div class="flex items-center justify-between px-2 pb-2">
            <div
              class="flex items-center gap-2 text-[11px] font-semibold text-foreground"
            >
              <span
                class="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary"
              >
                {#if mode === "agent"}<Zap
                    class="h-3 w-3"
                  />{:else}<MessageSquareText class="h-3 w-3" />{/if}
              </span>
              {mode === "agent" ? "Agent command" : "Ask Bizzy"}
            </div>
            <span class="text-[10px] text-muted-foreground"
              >{mode === "agent"
                ? "Navigate and act"
                : "Explore and understand"}</span
            >
          </div>
          <form
            class="flex items-center gap-3 rounded-xl border border-transparent bg-background px-3.5 py-3.5 transition-colors focus-within:border-primary/50"
            onsubmit={(event) => {
              event.preventDefault();
              runCommand();
            }}
          >
            <span class="text-xs font-semibold text-primary"
              >{mode === "agent" ? ">" : "?"}</span
            ><input
              bind:value={command}
              autofocus
              placeholder={mode === "agent"
                ? "Tell Bizzy what to do..."
                : "Ask Bizzy a question..."}
              class="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-foreground outline-none ring-0 placeholder:text-muted-foreground/55 focus:border-0 focus:outline-none focus:ring-0"
            /><button
              type="submit"
              disabled={!command.trim()}
              aria-label="Run request"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
              ><CornerDownLeft class="h-4 w-4" /></button
            >
          </form>
          <div
            class="flex items-center justify-between px-2 pt-2 text-[10px] text-muted-foreground"
          >
            <span>{status}</span><span class="hidden items-center gap-1 sm:flex"
              ><CornerDownLeft class="h-3 w-3" /> Enter to run</span
            >
          </div>
        </div>
        {#if entries.length > 0}<div class="mt-5 space-y-3">
            {#each entries as entry}<div
                class={`flex gap-3 ${entry.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  class={`max-w-[85%] rounded-2xl px-3.5 py-3 text-xs leading-relaxed ${entry.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border border-border/60 bg-background text-foreground"}`}
                >
                  <p>{entry.text}</p>
                  {#if entry.path}<button
                      type="button"
                      onclick={() => goto(entry.path!)}
                      class="mt-2 flex items-center gap-1 font-semibold text-primary hover:underline"
                      >Go there <ChevronRight class="h-3.5 w-3.5" /></button
                    >{/if}
                </div>
              </div>{/each}
          </div>{/if}
        <div class="mt-6">
          <div
            class="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            <Lightbulb class="h-3.5 w-3.5" /> Try asking
          </div>
          <div class="mt-3 grid gap-2 sm:grid-cols-2">
            {#each shortcuts as shortcut}<button
                type="button"
                onclick={() => runCommand(shortcut.command)}
                class="flex items-center gap-3 rounded-xl border border-border/60 p-3 text-left transition hover:border-primary/40 hover:bg-primary/4"
                ><span
                  class="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-primary"
                  >{shortcut.icon}</span
                ><span
                  class="min-w-0 flex-1 text-xs font-medium text-foreground"
                  >{shortcut.label}</span
                ><ChevronRight
                  class="h-3.5 w-3.5 text-muted-foreground"
                /></button
              >{/each}
          </div>
        </div>
      </div>
      <footer
        class="flex items-center justify-between border-t border-border/60 bg-muted/20 px-5 py-3 text-[10px] text-muted-foreground"
      >
        <span class="flex items-center gap-1.5"
          ><History class="h-3.5 w-3.5" />
          {entries.length
            ? `${entries.length} recent requests`
            : "No recent requests"}</span
        ><span class="hidden sm:block">Current page: {page.url.pathname}</span
        ><button
          type="button"
          onclick={() => {
            entries = [];
            status = "Ready when you are.";
          }}
          class="flex items-center gap-1 text-primary hover:underline"
          ><Check class="h-3.5 w-3.5" /> Clear</button
        >
      </footer>
    </section>
  </div>
{/if}
