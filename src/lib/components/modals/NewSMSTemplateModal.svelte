<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import { FileText, Zap } from "@lucide/svelte";

  let { open = false, onOpenChange, onConfirm } = $props<{
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: (name: string, trigger: string, preview: string) => void;
  }>();

  let name = $state("");
  let trigger = $state("On Payment");
  let preview = $state("");
  let isProcessing = $state(false);

  const triggers = [
    "On Payment",
    "On Order Shipped",
    "Low Stock Alert",
    "Custom API",
    "Scheduled Daily"
  ];

  function handleConfirm() {
    if (!name || !preview) return;
    isProcessing = true;
    setTimeout(() => {
      isProcessing = false;
      onConfirm(name, trigger, preview);
      name = "";
      trigger = "On Payment";
      preview = "";
    }, 1000);
  }
</script>

<Dialog.Root {open} {onOpenChange}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2">
        <FileText class="h-5 w-5 text-primary" />
        New SMS Template
      </Dialog.Title>
      <Dialog.Description>
        Create an automated message template with dynamic variables.
      </Dialog.Description>
    </Dialog.Header>

    <div class="space-y-4 py-4">
      <label class="block text-sm font-medium">
        Template Name
        <input
          type="text"
          bind:value={name}
          placeholder="e.g. Appointment Reminder"
          class="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm"
        />
      </label>

      <label class="block text-sm font-medium">
        Trigger Event
        <div class="relative mt-2">
          <Zap class="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <select
            bind:value={trigger}
            class="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm shadow-sm"
          >
            {#each triggers as t}
              <option value={t}>{t}</option>
            {/each}
          </select>
        </div>
      </label>

      <label class="block text-sm font-medium">
        Message Body
        <textarea
          bind:value={preview}
          rows="4"
          placeholder="Use {'{amount}'} or {'{name}'} for variables..."
          class="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-sm resize-none font-mono text-xs"
        ></textarea>
        <div class="mt-2 flex gap-2">
          <span class="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground cursor-pointer hover:bg-primary/20" onclick={() => preview += "{name}"}>name</span>
          <span class="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground cursor-pointer hover:bg-primary/20" onclick={() => preview += "{amount}"}>amount</span>
          <span class="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground cursor-pointer hover:bg-primary/20" onclick={() => preview += "{date}"}>date</span>
        </div>
      </label>
    </div>

    <Dialog.Footer class="gap-2 border-t-0 bg-transparent p-0 pt-2 sm:gap-0">
      <Button variant="outline" onclick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
      <Button onclick={handleConfirm} disabled={isProcessing || !name || !preview}>
        {isProcessing ? "Saving..." : "Save Template"}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
