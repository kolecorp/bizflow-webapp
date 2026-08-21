<script lang="ts">
  import { modals } from "$lib/stores/modals";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Button } from "$lib/components/ui/button";
  import { Plus } from "@lucide/svelte";
  import { get } from "svelte/store";
  import { addTransaction, services } from "$lib/stores/businessData";
  import { authStore } from "$lib/stores/auth";

  let formData = {
    service: "",
    customer: "",
    amount: "",
    description: "",
  };

  $: open = $modals.newTransaction;

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      modals.closeNewTransaction();
      formData = { service: "", customer: "", amount: "", description: "" };
    }
  }

  function handleSubmit() {
    if (!formData.service || !formData.customer || !formData.amount) return;

    const svc = get(services).find((s) => s.id === formData.service);
    const today = new Date().toISOString().split("T")[0];
    const user = get(authStore).user;

    addTransaction({
      service: svc?.name ?? formData.service,
      customer: formData.customer,
      amount: parseInt(formData.amount, 10),
      date: today,
      description: formData.description,
      recordedBy: user?.name ?? "Unknown",
      recordedById: user?.id,
    });

    modals.closeNewTransaction();
  }
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2">
        <Plus class="h-5 w-5 text-primary" />
        New transaction
      </Dialog.Title>
      <Dialog.Description>Record a new service transaction</Dialog.Description>
    </Dialog.Header>

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div class="space-y-2">
        <Label for="modal-service">Service</Label>
        <select
          id="modal-service"
          bind:value={formData.service}
          class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Select a service</option>
          {#each $services.filter((s) => s.active) as s}
            <option value={s.id}>{s.name}</option>
          {/each}
        </select>
      </div>
      <div class="space-y-2">
        <Label for="modal-customer">Customer name</Label>
        <Input id="modal-customer" placeholder="Customer name" bind:value={formData.customer} />
      </div>
      <div class="space-y-2">
        <Label for="modal-amount">Amount (₦)</Label>
        <Input id="modal-amount" type="number" placeholder="0" bind:value={formData.amount} />
      </div>
      <div class="space-y-2">
        <Label for="modal-description">Description (optional)</Label>
        <textarea
          id="modal-description"
          bind:value={formData.description}
          class="h-20 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        ></textarea>
      </div>
      <Dialog.Footer class="border-t-0 bg-transparent p-0 pt-2">
        <Button type="button" variant="outline" onclick={() => modals.closeNewTransaction()}>
          Cancel
        </Button>
        <Button type="submit">Create</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
