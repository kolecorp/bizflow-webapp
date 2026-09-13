<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { authStore } from "$lib/stores/auth";
  import { toast } from "svelte-sonner";
  import { onMount } from "svelte";
  import { Motion } from "svelte-motion";
  import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    CircleX,
    LoaderCircle,
    Smartphone,
    Truck,
    Zap,
  } from "@lucide/svelte";

  const api =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

  let form = $state({
    productType: "AIRTIME",
    providerKey: "vtu.ng",
    network: "MTN",
    recipient: "",
    amount: "",
    planCode: "",
    channel: "API",
    reference: "",
  });
  let saving = $state(false);
  let catalogLoading = $state(false);
  let networkManuallySelected = $state(false);
  let bulkMode = $state(false);
  let recipientsInput = $state("");
  let requestState = $state<
    "idle" | "sending" | "success" | "partial" | "error"
  >("idle");
  let requestMessage = $state("");
  let requestResults = $state<
    { recipient: string; status: string; message?: string }[]
  >([]);
  const airtimeNetworks = ["MTN", "Airtel", "Glo", "9mobile"];
  let catalog = $state<
    {
      productType: string;
      network?: string;
      planCode?: string;
      label: string;
      providerCost: string;
      sellingPrice: string;
    }[]
  >([]);

  function updateProduct(productType: string) {
    form = { ...form, productType, network: "", planCode: "" };
    networkManuallySelected = false;
  }

  function updateNetwork(network: string) {
    form = { ...form, network, planCode: "" };
    networkManuallySelected = true;
  }

  function detectNetwork(value: string) {
    const digits = value.replace(/\D/g, "");
    const localNumber = digits.startsWith("234")
      ? `0${digits.slice(3)}`
      : digits;
    const prefix = localNumber.slice(0, 4);
    const prefixes: Record<string, string> = {
      "0701": "Airtel",
      "0705": "Glo",
      "0708": "Airtel",
      "0802": "Airtel",
      "0803": "MTN",
      "0805": "Glo",
      "0806": "MTN",
      "0807": "Glo",
      "0808": "Airtel",
      "0809": "9mobile",
      "0810": "MTN",
      "0811": "Glo",
      "0812": "Airtel",
      "0813": "MTN",
      "0814": "MTN",
      "0815": "Glo",
      "0816": "MTN",
      "0817": "9mobile",
      "0818": "9mobile",
      "0819": "9mobile",
      "0901": "Airtel",
      "0903": "MTN",
      "0905": "Glo",
      "0906": "MTN",
      "0907": "Airtel",
      "0908": "9mobile",
      "0909": "9mobile",
      "0912": "Airtel",
      "0913": "MTN",
      "0916": "MTN",
    };
    return prefixes[prefix] ?? null;
  }

  function updateRecipient(recipient: string) {
    form = { ...form, recipient };
    if (form.productType !== "AIRTIME" || networkManuallySelected) return;
    const detected = detectNetwork(recipient);
    const matchingNetwork = availableNetworks.find(
      (item) => item.toLowerCase() === detected?.toLowerCase(),
    );
    if (matchingNetwork) {
      form = { ...form, recipient, network: matchingNetwork, planCode: "" };
    }
  }

  function parseRecipients(value: string) {
    return Array.from(
      new Set(
        value
          .split(/[\n,;]+/)
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );
  }

  async function loadCatalog() {
    catalogLoading = true;
    try {
      const response = await fetch(
        `${api}/vtu/catalog?providerKey=${encodeURIComponent(form.providerKey)}`,
        {
          credentials: "include",
          headers: { Authorization: `Bearer ${$authStore.accessToken}` },
        },
      );
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload?.message ?? "Unable to load provider catalog");
      catalog = Array.isArray(payload) ? payload : [];
    } catch (error) {
      catalog = [];
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load provider catalog",
      );
    } finally {
      catalogLoading = false;
    }
  }

  const availableNetworks = $derived(
    form.productType === "AIRTIME"
      ? Array.from(
          new Set([
            ...airtimeNetworks,
            ...catalog
              .filter((item) => item.productType === "AIRTIME")
              .map((item) => item.network)
              .filter((network): network is string => Boolean(network)),
          ]),
        ).sort()
      : Array.from(
          new Set(
            catalog
              .filter((item) => item.productType === form.productType)
              .map((item) => item.network)
              .filter((network): network is string => Boolean(network)),
          ),
        ).sort(),
  );
  const availablePlans = $derived(
    catalog.filter(
      (item) =>
        item.productType === form.productType &&
        (!form.network || item.network === form.network),
    ),
  );

  const detectedNetwork = $derived(
    form.productType === "AIRTIME" ? detectNetwork(form.recipient) : null,
  );

  $effect(() => {
    if (
      form.productType === "AIRTIME" &&
      !networkManuallySelected &&
      detectedNetwork &&
      availableNetworks.length
    ) {
      const matchingNetwork = availableNetworks.find(
        (item) => item.toLowerCase() === detectedNetwork.toLowerCase(),
      );
      if (matchingNetwork && form.network !== matchingNetwork) {
        form = { ...form, network: matchingNetwork, planCode: "" };
      }
    }
  });

  onMount(() => {
    void loadCatalog();
  });

  async function submit() {
    const recipients = bulkMode
      ? parseRecipients(recipientsInput)
      : [form.recipient];
    if (recipients.some((recipient) => recipient.length < 3)) {
      toast.error("Enter at least one valid recipient number.");
      return;
    }
    if (bulkMode && recipients.length < 2) {
      toast.error("Enter at least two recipients for a bulk purchase.");
      return;
    }
    if (recipients.length > 100) {
      toast.error("You can send to a maximum of 100 recipients at once.");
      return;
    }
    let requestNetwork = form.network;
    if (form.productType === "AIRTIME" && !networkManuallySelected) {
      const detectedNetworks = Array.from(
        new Set(
          recipients
            .map(detectNetwork)
            .filter((network): network is string => Boolean(network)),
        ),
      );
      if (bulkMode && detectedNetworks.length !== 1) {
        toast.error(
          "Bulk airtime recipients must use one detectable network.",
          {
            description: "Choose the network manually to continue.",
          },
        );
        return;
      }
      if (detectedNetworks.length > 1) {
        toast.error("Bulk airtime recipients must use the same network.", {
          description: "Choose the network manually to continue.",
        });
        return;
      }
      const detected = detectedNetworks[0];
      const matchingNetwork = availableNetworks.find(
        (item) => item.toLowerCase() === detected?.toLowerCase(),
      );
      if (matchingNetwork) requestNetwork = matchingNetwork;
    }
    saving = true;
    requestState = "sending";
    requestMessage = bulkMode
      ? `Sending ${recipients.length} requests...`
      : "Sending your request...";
    requestResults = [];
    try {
      const response = await fetch(`${api}/vtu/purchase`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${$authStore.accessToken}`,
        },
        body: JSON.stringify({
          ...form,
          network: requestNetwork,
          recipient: recipients[0],
          amount: form.amount === "" ? undefined : String(form.amount),
          ...(bulkMode ? { recipients } : {}),
          reference: form.reference || `vtu-${Date.now()}`,
        }),
      });
      const text = await response.text();
      const payload = text ? JSON.parse(text) : null;
      if (!response.ok)
        throw new Error(
          payload?.message ?? `Purchase failed (${response.status})`,
        );
      if (payload?.bulk) {
        requestResults = payload.results ?? [];
        requestState = payload.failed > 0 ? "partial" : "success";
        requestMessage =
          payload.failed > 0
            ? `${payload.succeeded} succeeded, ${payload.failed} failed.`
            : `${payload.succeeded} requests completed successfully.`;
      } else {
        requestState = payload?.status === "FAILED" ? "error" : "success";
        requestMessage =
          payload?.status === "FAILED"
            ? (payload.message ??
              "The provider could not complete the request.")
            : "Your VTU request was submitted successfully.";
      }
      if (requestState === "error") {
        toast.error(requestMessage);
      } else {
        toast.success(
          requestState === "partial"
            ? "VTU batch completed with some failures"
            : bulkMode
              ? `${recipients.length} VTU requests submitted`
              : "VTU request submitted",
        );
      }
      form = { ...form, recipient: "", amount: "", reference: "" };
      recipientsInput = "";
    } catch (error) {
      requestState = "error";
      requestMessage =
        error instanceof Error ? error.message : "Unable to submit purchase";
      toast.error(requestMessage);
    } finally {
      saving = false;
    }
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="VTU · Fulfillment"
    title="New purchase"
    description="Submit a customer request through the same API used by future REST, WhatsApp, and Telegram channels."
  />

  <nav class="flex flex-wrap gap-2 border-b border-border/60 pb-4">
    <a
      href="/extensions/vtu"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Overview</a
    >
    <a
      href="/extensions/vtu/provider"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Provider setup</a
    >
    <a
      href="/extensions/vtu/purchase"
      class="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
      >New purchase</a
    >
    <a
      href="/extensions/vtu/transactions"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Transactions</a
    >
    <a
      href="/extensions/vtu/pricing"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Pricing</a
    >
  </nav>

  <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
    <form
      class="surface-panel p-6"
      onsubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div class="border-b border-border/70 pb-5">
        <div class="flex items-start justify-between gap-4">
          <div
            class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
          >
            <Smartphone class="h-5 w-5" />
          </div>
          <div>
            <h2 class="font-heading text-xl font-bold">Purchase details</h2>
            <p class="text-sm text-muted-foreground">
              Select a catalog offer, then enter the customer details.
            </p>
          </div>
          <span
            class="hidden rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex sm:items-center sm:gap-1.5"
          >
            <CheckCircle2 class="h-3.5 w-3.5" /> Catalog connected
          </span>
        </div>
        <p class="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          Choose the service and offer first, then provide the recipient and
          amount below.
        </p>
      </div>

      {#if requestState !== "idle"}
        <Motion
          let:motion
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <section
            use:motion
            class={`mt-5 overflow-hidden rounded-2xl border p-4 ${
              requestState === "error"
                ? "border-red-500/30 bg-red-500/5"
                : requestState === "partial"
                  ? "border-amber-500/30 bg-amber-500/5"
                  : requestState === "success"
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-primary/25 bg-primary/5"
            }`}
            aria-live="polite"
          >
            {#if requestState === "sending"}
              <div class="vtu-delivery-scene" aria-hidden="true">
                <div class="vtu-delivery-line"></div>
                <Truck class="vtu-delivery-truck h-8 w-8 text-primary" />
                <div class="vtu-delivery-destination">
                  <Smartphone class="h-5 w-5" />
                </div>
              </div>
              <div class="flex items-center gap-3">
                <LoaderCircle class="h-5 w-5 animate-spin text-primary" />
                <div>
                  <p class="font-semibold text-foreground">On the way</p>
                  <p class="text-sm text-muted-foreground">{requestMessage}</p>
                </div>
              </div>
            {:else if requestState === "error"}
              <div class="flex items-start gap-3">
                <div
                  class="vtu-error-icon flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600"
                >
                  <CircleX class="h-6 w-6" />
                </div>
                <div>
                  <p class="font-semibold text-red-700">Delivery stopped</p>
                  <p class="mt-1 text-sm text-muted-foreground">
                    {requestMessage}
                  </p>
                </div>
              </div>
            {:else if requestState === "partial"}
              <div class="flex items-start gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700"
                >
                  <AlertTriangle class="h-6 w-6" />
                </div>
                <div>
                  <p class="font-semibold text-amber-800">
                    Some deliveries need attention
                  </p>
                  <p class="mt-1 text-sm text-muted-foreground">
                    {requestMessage}
                  </p>
                </div>
              </div>
              <div class="mt-4 grid gap-2 sm:grid-cols-2">
                {#each requestResults as result}
                  <div
                    class="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-xs"
                  >
                    <span class="font-mono text-foreground"
                      >{result.recipient}</span
                    >
                    <span
                      class={result.status === "FAILED"
                        ? "text-red-600"
                        : "text-emerald-600"}
                    >
                      {result.status === "FAILED"
                        ? (result.message ?? "Failed")
                        : result.status}
                    </span>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="flex items-start gap-3">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600"
                >
                  <CheckCircle2 class="h-6 w-6" />
                </div>
                <div>
                  <p class="font-semibold text-emerald-700">
                    Delivered to the request queue
                  </p>
                  <p class="mt-1 text-sm text-muted-foreground">
                    {requestMessage}
                  </p>
                </div>
              </div>
            {/if}
          </section>
        </Motion>
      {/if}

      <div class="mt-6">
        <div class="mb-4 flex items-center gap-3">
          <span
            class="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
            >1</span
          >
          <div>
            <h3 class="text-sm font-bold text-foreground">Choose an offer</h3>
            <p class="text-xs text-muted-foreground">
              Plans and variations stay tied to the selected network.
            </p>
          </div>
        </div>
        <div
          class="grid gap-5 rounded-xl border border-border/70 bg-muted/15 p-4 sm:grid-cols-2"
        >
          <label class="space-y-2 text-sm font-semibold text-foreground">
            <span>Provider route</span>
            <input
              bind:value={form.providerKey}
              placeholder="vtu.ng or waec"
              class="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label class="space-y-2 text-sm font-semibold text-foreground">
            <span>Product</span>
            <select
              value={form.productType}
              onchange={(event) =>
                updateProduct((event.currentTarget as HTMLSelectElement).value)}
              class="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="AIRTIME">Airtime</option>
              <option value="DATA">Data</option>
              <option value="ELECTRICITY">Electricity</option>
              <option value="CABLE_TV">Cable TV</option>
              <option value="EXAM_PIN">Exam / recharge PIN</option>
            </select>
          </label>

          <label class="space-y-2 text-sm font-semibold text-foreground">
            <span>Network</span>
            <select
              value={form.network}
              onchange={(event) =>
                updateNetwork((event.currentTarget as HTMLSelectElement).value)}
              disabled={form.productType !== "AIRTIME" &&
                (catalogLoading || availableNetworks.length === 0)}
              class="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {catalogLoading ? "Loading networks..." : "Choose a network"}
              </option>
              {#each availableNetworks as network}
                <option value={network}>{network}</option>
              {/each}
            </select>
            {#if form.productType === "AIRTIME"}
              <span class="block text-xs font-normal text-muted-foreground">
                {#if detectedNetwork && !networkManuallySelected}
                  Detected from recipient: {detectedNetwork}
                {:else}
                  Choose manually, or enter a Nigerian number to detect it.
                {/if}
              </span>
            {/if}
          </label>

          <label class="space-y-2 text-sm font-semibold text-foreground">
            <span class="flex flex-wrap items-baseline gap-2">
              Plan / variation
              <span class="font-normal text-muted-foreground">
                {catalogLoading ? "Loading catalog" : "Filtered by network"}
              </span>
            </span>
            <select
              bind:value={form.planCode}
              disabled={catalogLoading || availablePlans.length === 0}
              class="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {availablePlans.length
                  ? "Choose a plan or variation"
                  : form.network
                    ? "No plans for this network"
                    : "Choose a network first"}
              </option>
              {#each availablePlans as plan}
                <option value={plan.planCode}>
                  {plan.label} · ₦{plan.sellingPrice}
                </option>
              {/each}
            </select>
          </label>
        </div>
      </div>

      <div class="mt-6 border-t border-border/70 pt-6">
        <div class="mb-4 flex items-center gap-3">
          <span
            class="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
            >2</span
          >
          <div>
            <h3 class="text-sm font-bold text-foreground">Customer details</h3>
            <p class="text-xs text-muted-foreground">
              We will use these details to submit the request.
            </p>
          </div>
        </div>
        <label
          class="mb-4 flex cursor-pointer items-center gap-3 rounded-lg border border-border/70 bg-muted/20 px-3 py-2.5 text-sm font-medium text-foreground"
        >
          <input
            type="checkbox"
            bind:checked={bulkMode}
            class="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          Send to multiple recipients
          <span class="ml-auto text-xs font-normal text-muted-foreground"
            >Up to 100</span
          >
        </label>
        <div class="grid gap-5 sm:grid-cols-2">
          <label class="space-y-2 text-sm font-semibold text-foreground">
            <span>{bulkMode ? "Recipients" : "Recipient"}</span>
            {#if bulkMode}
              <textarea
                required
                value={recipientsInput}
                oninput={(event) =>
                  (recipientsInput = (
                    event.currentTarget as HTMLTextAreaElement
                  ).value)}
                placeholder="08012345678, 08123456789"
                rows="4"
                class="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              ></textarea>
              <span class="block text-xs font-normal text-muted-foreground"
                >Separate numbers with commas, semicolons, or new lines.</span
              >
            {:else}
              <input
                required
                value={form.recipient}
                oninput={(event) =>
                  updateRecipient(
                    (event.currentTarget as HTMLInputElement).value,
                  )}
                placeholder="08012345678"
                inputmode="tel"
                class="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            {/if}
          </label>

          <label class="space-y-2 text-sm font-semibold text-foreground">
            <span>Amount</span>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              bind:value={form.amount}
              placeholder="1000.00"
              class="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label class="space-y-2 text-sm font-semibold text-foreground">
            <span>Sales channel</span>
            <select
              bind:value={form.channel}
              class="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="API">Web / API</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="TELEGRAM">Telegram</option>
            </select>
          </label>

          <label class="space-y-2 text-sm font-semibold text-foreground">
            <span>
              Reference
              <span class="font-normal text-muted-foreground">optional</span>
            </span>
            <input
              bind:value={form.reference}
              placeholder="order-2026-001"
              class="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>
      </div>

      <button
        class="btn-app-primary mt-6 w-full justify-center sm:w-auto"
        type="submit"
        disabled={saving ||
          catalogLoading ||
          (form.productType === "DATA" && !form.planCode)}
      >
        {saving ? "Submitting..." : "Submit purchase"}
        <ArrowRight class="h-4 w-4" />
      </button>
    </form>

    <aside class="surface-panel h-fit p-6">
      <Zap class="h-6 w-6 text-primary" />
      <h3 class="mt-4 font-heading text-lg font-bold">Built for channels</h3>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">
        This screen is one caller. The same normalized purchase contract is
        ready for API, WhatsApp, and Telegram orchestration.
      </p>
      <div class="mt-5 flex items-center gap-2 text-xs text-emerald-600">
        <CheckCircle2 class="h-4 w-4" /> Idempotent references
      </div>
    </aside>
  </div>
</AppShell>

<style>
  .vtu-delivery-scene {
    position: relative;
    height: 48px;
    margin-bottom: 12px;
    overflow: hidden;
    border-radius: 12px;
    background: linear-gradient(
      90deg,
      hsl(var(--primary) / 0.04),
      hsl(var(--primary) / 0.12)
    );
  }

  .vtu-delivery-line {
    position: absolute;
    inset: 50% 24px auto;
    height: 2px;
    border-top: 2px dashed hsl(var(--primary) / 0.35);
  }

  .vtu-delivery-truck {
    position: absolute;
    top: 10px;
    left: 8%;
    animation: vtu-delivery-drive 2.4s ease-in-out infinite;
  }

  .vtu-delivery-destination {
    position: absolute;
    top: 12px;
    right: 7%;
    color: hsl(var(--primary));
  }

  .vtu-error-icon {
    animation: vtu-error-shake 0.45s ease-in-out;
  }

  @keyframes vtu-delivery-drive {
    0%,
    100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(calc(100% + 180px));
    }
  }

  @keyframes vtu-error-shake {
    0%,
    100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-8deg);
    }
    75% {
      transform: rotate(8deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .vtu-delivery-truck,
    .vtu-error-icon {
      animation: none;
    }
  }
</style>
