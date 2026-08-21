<script lang="ts">
  import { modals } from "$lib/stores/modals";
  import { sendFileToComputer } from "$lib/stores/communications";
  import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
  } from "$lib/components/ui/alert-dialog";
  import { Label } from "$lib/components/ui/label";
  import { X, Upload, Monitor } from "@lucide/svelte";

  let open = false;
  let target: { computerId: string; computerName: string } | null = null;
  let selectedFile: File | null = null;
  let sending = false;

  modals.subscribe((state) => {
    open = state.sendFile;
    target = state.sendFileTarget;
    if (!open) {
      selectedFile = null;
      sending = false;
    }
  });

  function handleFileChange(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    selectedFile = input.files?.[0] ?? null;
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function handleSubmit() {
    if (!target || !selectedFile || sending) return;

    sending = true;
    sendFileToComputer({
      computerId: target.computerId,
      computerName: target.computerName,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
    });

    setTimeout(() => {
      modals.closeSendFile();
    }, 400);
  }
</script>

<AlertDialog bind:open>
  <AlertDialogContent>
    <AlertDialogHeader>
      <div class="flex items-center justify-between">
        <AlertDialogTitle class="flex items-center gap-2">
          <Upload class="h-5 w-5 text-foreground" />
          Send file to workstation
        </AlertDialogTitle>
        <button
          type="button"
          on:click={() => modals.closeSendFile()}
          class="rounded-full p-1 hover:bg-muted"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
      <AlertDialogDescription>
        Push a file to the customer PC via the Workstation Agent RPC channel. The
        customer must have allowed incoming files on their end.
      </AlertDialogDescription>
    </AlertDialogHeader>

    {#if target}
      <div class="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
        <div class="flex items-center gap-2 font-medium text-foreground">
          <Monitor class="h-4 w-4 text-primary" />
          {target.computerName}
        </div>
      </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-4 py-2">
      <div class="space-y-2">
        <Label for="send-file-input">Choose file</Label>
        <input
          id="send-file-input"
          type="file"
          on:change={handleFileChange}
          class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-primary-foreground"
        />
        {#if selectedFile}
          <p class="text-xs text-muted-foreground">
            {selectedFile.name} · {formatSize(selectedFile.size)}
          </p>
        {/if}
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <AlertDialogCancel type="button" onclick={() => modals.closeSendFile()}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          type="submit"
          disabled={!selectedFile || sending}
          class="btn-app-primary"
        >
          {sending ? "Sending…" : "Send file"}
        </AlertDialogAction>
      </div>
    </form>
  </AlertDialogContent>
</AlertDialog>
