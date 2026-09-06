<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import SendSMSModal from "$lib/components/modals/SendSMSModal.svelte";
  import NewSMSTemplateModal from "$lib/components/modals/NewSMSTemplateModal.svelte";
  import PasswordInput from "$lib/components/ui/password-input.svelte";
  import { authStore } from "$lib/stores/auth";
  import { toast } from "svelte-sonner";
  import {
    Mail,
    Send,
    Users,
    Settings2,
    CheckCircle2,
    AlertCircle,
    Clock,
    BarChart3,
    Plus,
    FileText,
    Bell,
    ShieldCheck,
  } from "@lucide/svelte";

  let { initialTab = "overview" } = $props();

  let connected = $state(false);
  let isConnecting = $state(false);
  let provider = $state("Termii");
  let senderId = $state("Bizflow");
  let apiKey = $state("");
  let activeTab = $state<"overview" | "templates" | "settings">(
    initialTab as "overview" | "templates" | "settings",
  );

  let sendModalOpen = $state(false);
  let templateModalOpen = $state(false);

  const providers = ["Termii", "Twilio", "Infobip", "Bulksmsnigeria"];

  let recentMessages = $state([
    {
      to: "0803•••218",
      message: "Your receipt for ₦5,000 is ready. Ref: TXN-001.",
      status: "Delivered",
      time: "2 min ago",
    },
    {
      to: "0706•••441",
      message: "Low balance alert: Your wallet has ₦200 left.",
      status: "Delivered",
      time: "15 min ago",
    },
    {
      to: "0814•••112",
      message: "New order confirmed. Order #ORD-0042 is processing.",
      status: "Failed",
      time: "1 hr ago",
    },
    {
      to: "0901•••773",
      message: "Staff shift reminder: Opens at 8AM tomorrow.",
      status: "Delivered",
      time: "3 hrs ago",
    },
  ]);

  let templates = $state([
    {
      id: "sms-template-transaction-receipt",
      name: "Transaction Receipt",
      trigger: "On payment",
      preview: "Your payment of {amount} was received. Ref: {ref}.",
    },
    {
      id: "sms-template-low-stock-alert",
      name: "Low Stock Alert",
      trigger: "Stock < threshold",
      preview: "Alert: {product} stock is low ({qty} remaining).",
    },
    {
      id: "sms-template-wallet-balance-alert",
      name: "Wallet Balance Alert",
      trigger: "Balance < ₦500",
      preview: "Your wallet balance is ₦{balance}. Fund now to continue.",
    },
    {
      id: "sms-template-daily-sales-summary",
      name: "Daily Sales Summary",
      trigger: "Daily 7PM",
      preview: "Today's sales: {count} transactions totalling ₦{amount}.",
    },
    {
      id: "sms-template-appointment-reminder",
      name: "Appointment Reminder",
      trigger: "1hr before",
      preview: "Reminder: Your appointment is at {time} today.",
    },
  ]);

  let stats = $state([
    { label: "Sent Today", value: "47" },
    { label: "Delivered", value: "44" },
    { label: "Failed", value: "3" },
    { label: "Balance (Units)", value: "1,200" },
  ]);

  async function connect() {
    isConnecting = true;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1"}/sms/connect`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${$authStore.accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({ provider, senderId, apiKey }),
        },
      );
      if (!response.ok) throw new Error("SMS provider connection failed.");
      connected = true;
    } catch (error) {
      toast.error("Unable to connect SMS provider", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      isConnecting = false;
    }
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension · SMS"
    title="SMS Notifications"
    description="Send transaction confirmations, alerts, and promotional messages to customers and staff via SMS."
  />

  {#if !connected}
    <!-- Setup state -->
    <div class="surface-panel overflow-hidden">
      <div class="p-8 sm:p-10">
        <div class="mx-auto max-w-lg text-center">
          <div
            class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
          >
            <Mail class="h-8 w-8 text-primary" />
          </div>
          <h2 class="font-heading text-2xl font-extrabold text-foreground">
            Connect your SMS provider
          </h2>
          <p class="mt-2 text-sm text-muted-foreground">
            Link Bizflow to your preferred SMS gateway to start sending
            automated messages.
          </p>
        </div>

        <div class="mx-auto mt-8 max-w-md space-y-4">
          <label class="block text-sm font-medium text-foreground">
            Provider
            <select
              bind:value={provider}
              class="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
            >
              {#each providers as p}<option value={p}>{p}</option>{/each}
            </select>
          </label>

          <label class="block text-sm font-medium text-foreground">
            Sender ID
            <input
              type="text"
              bind:value={senderId}
              placeholder="e.g. Bizflow"
              class="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
            />
          </label>

          <label class="block text-sm font-medium text-foreground">
            API Key
            <PasswordInput
              bind:value={apiKey}
              placeholder="Paste your {provider} API key"
              class="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-mono"
            />
          </label>

          <button
            type="button"
            onclick={connect}
            disabled={isConnecting || !apiKey}
            class="btn-app-primary w-full mt-2"
          >
            {isConnecting ? "Connecting…" : "Connect & Activate"}
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Connected dashboard -->
    <!-- Stats row -->
    <div class="grid gap-4 sm:grid-cols-4">
      {#each stats as stat}
        <div class="surface-stat p-5">
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            {stat.label}
          </p>
          <p
            class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-foreground"
          >
            {stat.value}
          </p>
        </div>
      {/each}
    </div>

    <!-- Tab nav -->
    <div
      class="flex items-center gap-1 rounded-xl border border-border/60 bg-card p-1 w-fit"
    >
      {#each ["overview", "templates", "settings"] as const as tab}
        <button
          type="button"
          onclick={() => (activeTab = tab)}
          class="rounded-lg px-4 py-2 text-sm font-semibold capitalize transition {activeTab ===
          tab
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'}"
        >
          {tab}
        </button>
      {/each}
    </div>

    {#if activeTab === "overview"}
      <!-- Recent messages -->
      <div class="surface-panel overflow-hidden">
        <div
          class="flex items-center justify-between border-b border-border/60 px-6 py-5"
        >
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-primary/10 p-2 text-primary">
              <Send class="h-4 w-4" />
            </div>
            <div>
              <h3 class="font-heading text-lg font-semibold text-foreground">
                Recent Messages
              </h3>
              <p class="text-xs text-muted-foreground mt-0.5">
                Latest outbound SMS activity
              </p>
            </div>
          </div>
          <button
            type="button"
            onclick={() => (sendModalOpen = true)}
            class="btn-app-primary text-xs"
          >
            <Plus class="h-3.5 w-3.5" /> Send SMS
          </button>
        </div>
        <div class="divide-y divide-border/40">
          {#each recentMessages as msg}
            <div
              class="flex items-start justify-between px-6 py-4 hover:bg-muted/20 transition"
            >
              <div class="flex items-start gap-3 min-w-0">
                <div
                  class="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground"
                >
                  {msg.to.slice(0, 2)}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-foreground">{msg.to}</p>
                  <p
                    class="text-xs text-muted-foreground mt-0.5 truncate max-w-md"
                  >
                    {msg.message}
                  </p>
                </div>
              </div>
              <div class="ml-4 shrink-0 text-right">
                <span
                  class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold {msg.status ===
                  'Delivered'
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-red-500/10 text-red-500'}"
                >
                  {#if msg.status === "Delivered"}<CheckCircle2
                      class="h-3 w-3"
                    />{:else}<AlertCircle class="h-3 w-3" />{/if}
                  {msg.status}
                </span>
                <p class="text-[10px] text-muted-foreground mt-1">{msg.time}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else if activeTab === "templates"}
      <!-- Templates -->
      <div class="surface-panel overflow-hidden">
        <div
          class="flex items-center justify-between border-b border-border/60 px-6 py-5"
        >
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-primary/10 p-2 text-primary">
              <FileText class="h-4 w-4" />
            </div>
            <h3 class="font-heading text-lg font-semibold text-foreground">
              Message Templates
            </h3>
          </div>
          <button
            type="button"
            onclick={() => (templateModalOpen = true)}
            class="btn-app-primary text-xs"
            ><Plus class="h-3.5 w-3.5" /> New template</button
          >
        </div>
        <div class="divide-y divide-border/40">
          {#each templates as tpl}
            <div
              class="flex items-start justify-between px-6 py-4 hover:bg-muted/20 transition group"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-semibold text-foreground">
                    {tpl.name}
                  </p>
                  <span
                    class="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                    >{tpl.trigger}</span
                  >
                </div>
                <p
                  class="mt-1 text-xs text-muted-foreground font-mono leading-relaxed"
                >
                  {tpl.preview}
                </p>
              </div>
              <button
                type="button"
                class="ml-4 shrink-0 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition"
                >Edit</button
              >
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Settings -->
      <div class="surface-panel p-6 sm:p-8 space-y-6">
        <div
          class="flex items-center justify-between pb-4 border-b border-border/60"
        >
          <div>
            <h3 class="font-heading text-lg font-semibold text-foreground">
              Provider: {provider}
            </h3>
            <p class="text-xs text-muted-foreground mt-0.5">
              Sender ID: {senderId}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-2 w-2 rounded-full bg-green-500"></div>
            <span
              class="text-xs font-semibold text-green-600 dark:text-green-400"
              >Connected</span
            >
          </div>
        </div>
        <div class="space-y-4 max-w-md">
          <label class="block text-sm font-medium">
            Sender ID
            <input
              type="text"
              bind:value={senderId}
              class="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
            />
          </label>
          <label class="block text-sm font-medium">
            API Key
            <PasswordInput
              value="••••••••••••••••"
              readonly
              class="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-mono"
            />
          </label>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" class="btn-app-primary text-sm"
            >Save Changes</button
          >
          <button
            type="button"
            onclick={() => (connected = false)}
            class="btn-app-secondary text-sm">Disconnect</button
          >
        </div>
      </div>
    {/if}
  {/if}

  <SendSMSModal
    open={sendModalOpen}
    onOpenChange={(open) => (sendModalOpen = open)}
    {templates}
    onConfirm={async (payload) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1"}/sms/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${$authStore.accessToken}`,
            },
            credentials: "include",
            body: JSON.stringify({
              ...payload,
              recipients: payload.recipients ?? [payload.to],
            }),
          },
        },
        );
        if (!response.ok) throw new Error("The provider rejected the message.");
        const result = await response.json().catch(() => ({}));
        recentMessages = [
        {
          to:
            payload.mode === "single"
              ? payload.to
              : `Bulk (${payload.recipientsCount} recipients)`,
          message: payload.message,
          status: result.status ?? "Pending",
          time: "Just now",
        },
        ...recentMessages,
        ];
        sendModalOpen = false;
        stats[0].value = (parseInt(stats[0].value) + 1).toString();
        if (result.status === "Delivered")
          stats[1].value = (parseInt(stats[1].value) + 1).toString();
      } catch (error) {
        toast.error("SMS was not accepted", {
          description:
            error instanceof Error ? error.message : "The provider rejected the message.",
        });
        throw error;
      }
    }}
  />

  <NewSMSTemplateModal
    open={templateModalOpen}
    onOpenChange={(open) => (templateModalOpen = open)}
    onConfirm={(name, trigger, preview) => {
      templates = [
        { id: `sms-template-${Date.now()}`, name, trigger, preview },
        ...templates,
      ];
      templateModalOpen = false;
    }}
  />
</AppShell>
