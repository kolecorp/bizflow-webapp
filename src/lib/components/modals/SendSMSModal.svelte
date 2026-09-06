<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import { Send, Contact, Users, FileText, Upload, Plus } from "@lucide/svelte";

  export type SMSPayload = {
    mode: "single" | "bulk";
    to: string;
    recipientsCount?: number;
    message: string;
  };

  let { open = false, onOpenChange, onConfirm, templates = [] } = $props<{
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: (payload: SMSPayload) => void;
    templates?: any[];
  }>();

  let mode = $state<"single" | "bulk">("single");
  let to = $state("");
  let bulkInput = $state("");
  let selectedTemplateId = $state<string>("none");
  let message = $state("");
  let isProcessing = $state(false);

  // Derive variables found in message
  let detectedVariables = $derived(
    Array.from(message.matchAll(/\{([^}]+)\}/g)).map((m) => m[1])
  );

  function handleTemplateChange() {
    if (selectedTemplateId === "none") return;
    const tmpl = templates.find((t) => t.id === selectedTemplateId);
    if (tmpl) {
      message = tmpl.preview || "";
    }
  }

  function insertVariable(variable: string) {
    message += `{${variable}}`;
  }

  function handleConfirm() {
    if (mode === "single" && (!to || !message)) return;
    if (mode === "bulk" && (!bulkInput || !message)) return;

    isProcessing = true;
    setTimeout(() => {
      isProcessing = false;
      const recipientsCount = mode === "bulk" ? bulkInput.split(",").length : 1;
      onConfirm({
        mode,
        to: mode === "single" ? to : "",
        recipientsCount,
        message,
      });
      to = "";
      bulkInput = "";
      message = "";
      mode = "single";
      selectedTemplateId = "none";
    }, 1000);
  }
</script>

<Dialog.Root {open} {onOpenChange}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2">
        <Send class="h-5 w-5 text-primary" />
        Send SMS
      </Dialog.Title>
      <Dialog.Description>
        Send an SMS immediately. Use bulk to message multiple customers at once.
      </Dialog.Description>
    </Dialog.Header>

    <div class="space-y-4 py-4">
      <!-- Mode Switcher -->
      <div class="flex rounded-xl border border-border p-1 bg-muted/30">
        <button
          type="button"
          onclick={() => (mode = "single")}
          class={`flex-1 rounded-lg py-1.5 text-sm font-medium transition ${mode === "single" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Single
        </button>
        <button
          type="button"
          onclick={() => (mode = "bulk")}
          class={`flex-1 rounded-lg py-1.5 text-sm font-medium transition ${mode === "bulk" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Bulk
        </button>
      </div>

      {#if mode === "single"}
        <label class="block text-sm font-medium">
          Recipient Phone Number
          <div class="relative mt-2">
            <Contact class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              bind:value={to}
              placeholder="e.g. 08030000000"
              class="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm shadow-sm transition focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </label>
      {:else}
        <label class="block text-sm font-medium">
          Recipients (Comma separated)
          <div class="relative mt-2">
            <Users class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <textarea
              bind:value={bulkInput}
              rows="2"
              placeholder="0803..., 0904..., 0701..."
              class="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm shadow-sm resize-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
            ></textarea>
          </div>
        </label>
        <div class="flex items-center justify-between mt-1">
          <p class="text-xs text-muted-foreground">Or upload a list</p>
          <button type="button" class="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
            <Upload class="h-3 w-3" /> Upload CSV
          </button>
        </div>
      {/if}

      <div class="border-t border-border/60 my-4"></div>

      <!-- Template Selection -->
      {#if templates && templates.length > 0}
        <label class="block text-sm font-medium mb-3">
          Load Template
          <div class="relative mt-2">
            <FileText class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <select
              bind:value={selectedTemplateId}
              onchange={handleTemplateChange}
              class="w-full appearance-none rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm shadow-sm transition focus:border-primary focus:ring-1 focus:ring-primary/20"
            >
              <option value="none">-- Select a Template --</option>
              {#each templates as t}
                <option value={t.id}>{t.name}</option>
              {/each}
            </select>
          </div>
        </label>
      {/if}

      <label class="block text-sm font-medium">
        Message
        <textarea
          bind:value={message}
          rows="4"
          placeholder="Type your message here... Use {'{name}'} for variables"
          class="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-sm resize-none transition focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono text-xs"
        ></textarea>
        
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-wrap gap-1">
            <button type="button" onclick={() => insertVariable('name')} class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted/80 transition">
              <Plus class="h-2.5 w-2.5" /> {'{name}'}
            </button>
            <button type="button" onclick={() => insertVariable('amount')} class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted/80 transition">
              <Plus class="h-2.5 w-2.5" /> {'{amount}'}
            </button>
          </div>
          <p class="text-xs text-muted-foreground text-right">
            {message.length} / 160 chars (1 page)
          </p>
        </div>
      </label>
      
      {#if detectedVariables.length > 0}
        <div class="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
          <p class="text-[11px] text-blue-600 dark:text-blue-400 font-medium mb-1">Detected Variables:</p>
          <div class="flex flex-wrap gap-1">
            {#each detectedVariables as v}
              <span class="inline-flex rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                {v}
              </span>
            {/each}
          </div>
          {#if mode === "bulk"}
            <p class="text-[10px] text-blue-600/70 mt-1.5 leading-tight">These will be mapped to headers in your CSV or contact list.</p>
          {/if}
        </div>
      {/if}
    </div>

    <Dialog.Footer class="gap-2 border-t-0 bg-transparent p-0 pt-2 sm:gap-0">
      <Button variant="outline" onclick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
      <Button onclick={handleConfirm} disabled={isProcessing || (mode === 'single' ? !to : !bulkInput) || !message}>
        {isProcessing ? "Sending..." : "Send Message"}
        {#if !isProcessing}<Send class="ml-2 h-4 w-4" />{/if}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
