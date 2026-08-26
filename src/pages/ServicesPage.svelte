<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import {
    addService,
    deleteService,
    services,
    toggleService,
    updateService,
  } from "$lib/stores/businessData";
  import {
    BriefcaseBusiness,
    CheckCircle2,
    Edit3,
    Plus,
    Search,
    Trash2,
    X,
    XCircle,
  } from "@lucide/svelte";
  import type { ServiceCatalogItem } from "$lib/types/business";

  let selectedId = $state<string | null>(null);
  let search = $state("");
  let editing = $state(false);
  let formError = $state("");
  let form = $state({
    name: "",
    category: "Business service",
    price: "",
    unit: "per job",
    description: "",
  });

  let categories = $derived([
    ...new Set($services.map((service) => service.category)),
  ]);
  let filteredServices = $derived(
    $services.filter((service) => {
      const query = search.trim().toLowerCase();
      return (
        !query ||
        service.name.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query)
      );
    }),
  );
  let selectedService = $derived(
    $services.find((service) => service.id === selectedId),
  );
  let activeCount = $derived(
    $services.filter((service) => service.active).length,
  );

  function selectService(service: ServiceCatalogItem) {
    selectedId = service.id;
    editing = false;
  }
  function startCreate() {
    selectedId = null;
    editing = true;
    formError = "";
    form = {
      name: "",
      category: "Business service",
      price: "",
      unit: "per job",
      description: "",
    };
  }
  function startEdit(service: ServiceCatalogItem) {
    selectedId = service.id;
    editing = true;
    formError = "";
    form = {
      name: service.name,
      category: service.category,
      price: String(service.price),
      unit: service.unit,
      description: service.description ?? "",
    };
  }
  function saveService(event: SubmitEvent) {
    event.preventDefault();
    const price = Number(form.price);
    if (
      !form.name.trim() ||
      !Number.isFinite(price) ||
      price < 0 ||
      !form.unit.trim()
    ) {
      formError = "Enter a service name, price, and unit.";
      return;
    }
    const changes = {
      name: form.name.trim(),
      category: form.category.trim() || "Business service",
      price,
      unit: form.unit.trim(),
      description: form.description.trim() || undefined,
    };
    if (selectedId) updateService(selectedId, changes);
    else selectedId = addService({ ...changes, active: true }).id;
    editing = false;
    formError = "";
  }
  function removeSelected() {
    if (!selectedService) return;
    deleteService(selectedService.id);
    selectedId = null;
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Catalog"
    title="Services & pricing"
    description="Create, organize, and manage the services your business offers to customers."
  />
  <div class="grid gap-4 sm:grid-cols-3">
    <div class="surface-stat p-5">
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Total services
      </p>
      <p class="mt-2 font-heading text-3xl font-black text-foreground">
        {$services.length}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">In your pricebook</p>
    </div>
    <div class="surface-stat p-5">
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Active services
      </p>
      <p class="mt-2 font-heading text-3xl font-black text-foreground">
        {activeCount}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">Available to your team</p>
    </div>
    <div class="surface-stat p-5">
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Categories
      </p>
      <p class="mt-2 font-heading text-3xl font-black text-foreground">
        {categories.length}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">Ways you serve customers</p>
    </div>
  </div>

  <section class="surface-panel overflow-hidden">
    <div
      class="flex flex-col gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div>
        <h2
          class="flex items-center gap-2 font-heading text-xl font-bold text-foreground"
        >
          <BriefcaseBusiness class="h-5 w-5 text-primary" />Service pricebook
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          These services appear when your team records a transaction.
        </p>
      </div>
      <Button type="button" onclick={startCreate}
        ><Plus class="h-4 w-4" />Create service</Button
      >
    </div>
    <div class="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div class="min-w-0 border-b border-border/70 lg:border-b-0 lg:border-r">
        <div class="border-b border-border/60 p-4">
          <label class="relative block"
            ><Search
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            /><Input
              bind:value={search}
              class="pl-9"
              placeholder="Search services"
              aria-label="Search services"
            /></label
          >
        </div>
        {#if filteredServices.length === 0}<div class="p-10 text-center">
            <BriefcaseBusiness
              class="mx-auto h-8 w-8 text-muted-foreground/40"
            />
            <p class="mt-3 text-sm font-semibold text-foreground">
              No services found
            </p>
            <p class="mt-1 text-xs text-muted-foreground">
              Create a service or try another search.
            </p>
          </div>{:else}<div class="divide-y divide-border/60">
            {#each filteredServices as service (service.id)}<div
                role="button"
                tabindex="0"
                class={`flex cursor-pointer items-center justify-between gap-4 p-4 text-left transition hover:bg-muted/30 ${selectedId === service.id ? "bg-primary/5" : ""}`}
                onclick={() => selectService(service)}
                onkeydown={(event) =>
                  event.key === "Enter" && selectService(service)}
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div
                    class={`flex size-9 shrink-0 items-center justify-center rounded-lg ${service.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    {#if service.active}<CheckCircle2
                        class="h-4 w-4"
                      />{:else}<XCircle class="h-4 w-4" />{/if}
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-foreground">
                      {service.name}
                    </p>
                    <p class="truncate text-xs text-muted-foreground">
                      {service.category} · {service.unit}
                    </p>
                  </div>
                </div>
                <p class="shrink-0 text-sm font-bold text-foreground">
                  ₦{service.price.toLocaleString()}
                </p>
              </div>{/each}
          </div>{/if}
      </div>
      <div class:min-h-80={editing} class="min-w-0 bg-muted/10 p-5 sm:p-6">
        {#if editing}<div class:hidden={editing}>
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-[0.18em] text-primary"
                >
                  {selectedId ? "Edit service" : "New service"}
                </p>
                <h3 class="mt-2 font-heading text-xl font-bold text-foreground">
                  {selectedId
                    ? "Update the pricebook entry"
                    : "Add a customer service"}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close editor"
                title="Close editor"
                onclick={() => (editing = false)}
                class="rounded-md p-2 text-muted-foreground hover:bg-muted"
                ><X class="h-4 w-4" /></button
              >
            </div>
            <form class="mt-6 space-y-4" onsubmit={saveService}>
              <div class="flex flex-col gap-2">
                <Label for="service-name">Service name</Label><Input
                  id="service-name"
                  bind:value={form.name}
                  placeholder="e.g. Document scanning"
                />
              </div>
              <div class="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:flex">
                <div class="flex flex-col gap-2">
                  <Label for="service-category">Category</Label><Input
                    id="service-category"
                    bind:value={form.category}
                    list="service-categories"
                  /><datalist id="service-categories"
                    >{#each categories as category}<option value={category}
                      ></option>{/each}</datalist
                  >
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="service-price">Price (₦)</Label><Input
                    id="service-price"
                    type="number"
                    min="0"
                    bind:value={form.price}
                  />
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <Label for="service-unit">Unit</Label><Input
                  id="service-unit"
                  bind:value={form.unit}
                  placeholder="per job"
                />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="service-description">Description</Label><Input
                  id="service-description"
                  bind:value={form.description}
                  placeholder="Short description for your team"
                />
              </div>
              {#if formError}<p class="text-xs font-medium text-destructive">
                  {formError}
                </p>{/if}<Button type="submit" class="w-full"
                >{selectedId ? "Save changes" : "Create service"}</Button
              >
            </form>
          </div>{:else if selectedService}<div>
            <div class="flex items-start justify-between gap-4">
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-[0.18em] text-primary"
                >
                  Service details
                </p>
                <h3
                  class="mt-2 font-heading text-2xl font-bold text-foreground"
                >
                  {selectedService.name}
                </h3>
                <p class="mt-1 text-sm text-muted-foreground">
                  {selectedService.category}
                </p>
              </div>
              <span
                class={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${selectedService.active ? "bg-emerald-500/10 text-emerald-700" : "bg-muted text-muted-foreground"}`}
                >{selectedService.active ? "Active" : "Inactive"}</span
              >
            </div>
            <div class="mt-8 rounded-xl border border-border/70 bg-card p-5">
              <p
                class="text-xs uppercase tracking-[0.16em] text-muted-foreground"
              >
                Customer price
              </p>
              <p class="mt-2 font-heading text-3xl font-black text-foreground">
                ₦{selectedService.price.toLocaleString()}
              </p>
              <p class="mt-1 text-sm text-muted-foreground">
                {selectedService.unit}
              </p>
              {#if selectedService.description}<p
                  class="mt-5 border-t border-border/60 pt-4 text-sm leading-relaxed text-muted-foreground"
                >
                  {selectedService.description}
                </p>{/if}
            </div>
            <div class="mt-6 grid gap-2">
              <Button type="button" onclick={() => startEdit(selectedService)}
                ><Edit3 class="h-4 w-4" />Edit service</Button
              ><Button
                type="button"
                variant="outline"
                onclick={() => toggleService(selectedService.id)}
                >{selectedService.active
                  ? "Deactivate service"
                  : "Activate service"}</Button
              ><Button
                type="button"
                variant="destructive"
                onclick={removeSelected}
                ><Trash2 class="h-4 w-4" />Delete service</Button
              >
            </div>
          </div>{:else}<div
            class="flex min-h-80 flex-col items-center justify-center text-center"
          >
            <BriefcaseBusiness class="h-9 w-9 text-primary/50" />
            <p class="mt-4 text-sm font-semibold text-foreground">
              Select a service to view it
            </p>
            <p
              class="mt-1 max-w-56 text-xs leading-relaxed text-muted-foreground"
            >
              Open details, edit pricing, change availability, or delete an
              entry.
            </p>
            <Button
              type="button"
              variant="outline"
              onclick={startCreate}
              class="mt-5"
              ><Plus class="h-4 w-4" />Create your first service</Button
            >
          </div>{/if}
      </div>
    </div>
  </section>

  <Dialog.Root open={editing} onOpenChange={(open) => (editing = open)}>
    <Dialog.Content
      class="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl"
    >
      <Dialog.Header>
        <Dialog.Title
          >{selectedId ? "Edit service" : "Create service"}</Dialog.Title
        >
        <Dialog.Description
          >{selectedId
            ? "Update this service in your customer pricebook."
            : "Add a service your team can record for customers."}</Dialog.Description
        >
      </Dialog.Header>
      <form class="grid gap-4 sm:grid-cols-2" onsubmit={saveService}>
        <div class="flex flex-col gap-2 sm:col-span-2">
          <Label for="modal-service-name">Service name</Label><Input
            id="modal-service-name"
            bind:value={form.name}
            placeholder="e.g. Document scanning"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="modal-service-category">Category</Label><Input
            id="modal-service-category"
            bind:value={form.category}
            list="modal-service-categories"
          /><datalist id="modal-service-categories"
            >{#each categories as category}<option value={category}
              ></option>{/each}</datalist
          >
        </div>
        <div class="flex flex-col gap-2">
          <Label for="modal-service-price">Price (₦)</Label><Input
            id="modal-service-price"
            type="number"
            min="0"
            bind:value={form.price}
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="modal-service-unit">Unit</Label><Input
            id="modal-service-unit"
            bind:value={form.unit}
            placeholder="per job"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="modal-service-description">Description</Label><Input
            id="modal-service-description"
            bind:value={form.description}
            placeholder="Short description for your team"
          />
        </div>
        {#if formError}<p
            class="text-xs font-medium text-destructive sm:col-span-2"
          >
            {formError}
          </p>{/if}
        <Button type="submit" class="sm:col-span-2"
          >{selectedId ? "Save changes" : "Create service"}</Button
        >
      </form>
    </Dialog.Content>
  </Dialog.Root>
</AppShell>
