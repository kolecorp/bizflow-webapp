<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import { ListTree, Plus, X } from "@lucide/svelte";

  let {
    open = false,
    onOpenChange,
    onConfirm,
  } = $props<{
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: (code: string, label: string, subItems: string[]) => void;
  }>();

  let code = $state("");
  let label = $state("");
  let subItems = $state<string[]>([""]);
  let isProcessing = $state(false);

  function handleConfirm() {
    if (!/^\d+$/.test(code.trim()) || !label.trim()) return;
    isProcessing = true;
    setTimeout(() => {
      isProcessing = false;
      onConfirm(
        code.trim(),
        label.trim(),
        subItems.filter((s) => s.trim() !== ""),
      );
      code = "";
      label = "";
      subItems = [""];
    }, 1000);
  }

  function addSubItem() {
    subItems = [...subItems, ""];
  }

  function removeSubItem(index: number) {
    subItems = subItems.filter((_, i) => i !== index);
    if (subItems.length === 0) subItems = [""];
  }
</script>

<Dialog.Root {open} {onOpenChange}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2">
        <ListTree class="h-5 w-5 text-primary" />
        Add USSD Menu Item
      </Dialog.Title>
      <Dialog.Description>
        Add a new root option to your USSD tree (e.g., "Check Balance").
      </Dialog.Description>
    </Dialog.Header>

    <div class="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
      <div class="flex gap-4">
        <label class="block w-24 shrink-0 text-sm font-medium">
          Menu Code
          <input
            type="text"
            bind:value={code}
            placeholder="e.g. 5"
            class="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm font-mono"
          />
        </label>

        <label class="block flex-1 text-sm font-medium">
          Menu Label
          <input
            type="text"
            bind:value={label}
            placeholder="e.g. Account Services"
            class="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm"
          />
        </label>
      </div>

      <div class="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-foreground">Sub-menu Items</p>
            <p class="text-[11px] text-muted-foreground mt-0.5">
              Optional nested choices for users.
            </p>
          </div>
          <button
            type="button"
            onclick={addSubItem}
            class="btn-app-secondary px-3 py-1.5 text-xs h-auto"
          >
            <Plus class="h-3.5 w-3.5" /> Add
          </button>
        </div>

        <div class="space-y-2.5 pt-2">
          {#each subItems as item, i}
            <div class="flex items-center gap-2 relative group">
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background border border-border font-mono text-xs font-bold text-muted-foreground"
              >
                {i + 1}.
              </div>
              <input
                type="text"
                bind:value={subItems[i]}
                placeholder="e.g. Mini Statement"
                class="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm shadow-sm transition focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              <button
                type="button"
                onclick={() => removeSubItem(i)}
                class="shrink-0 p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition opacity-50 hover:opacity-100"
                title="Remove item"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <Dialog.Footer class="gap-2 border-t-0 bg-transparent p-0 pt-2 sm:gap-0">
      <Button
        variant="outline"
        onclick={() => onOpenChange(false)}
        disabled={isProcessing}>Cancel</Button
      >
      <Button
        onclick={handleConfirm}
        disabled={isProcessing || !code.trim() || !label.trim()}
      >
        {isProcessing ? "Saving..." : "Add to Tree"}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
