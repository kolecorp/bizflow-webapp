<script lang="ts">
  import { page } from "$app/state";
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    extensions,
    connectExtension,
    disconnectExtension,
  } from "$lib/stores/extensions";
  import {
    MessageCircle,
    Smartphone,
    Settings2,
    Users,
    Receipt,
    Send,
    ShieldCheck,
    CheckCircle2,
    Phone,
    KeyRound,
    Bell,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Unplug,
    Sparkles,
    Clock,
    TrendingUp,
    PackageMinus,
    Bot,
    BrainCircuit,
    CreditCard,
    PlugZap,
    SlidersHorizontal,
    SendHorizontal,
    MessageSquareText,
    ShoppingBag,
    Zap,
    Plus,
    MoreHorizontal,
    ExternalLink,
    RotateCcw,
    Activity,
    ChevronRight,
  } from "@lucide/svelte";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";

  // This page is the customer-facing bot studio. Business operations live on
  // the separate /extensions/whatsapp/business route.
  let activeTab = "customers";

  // ─── Extension state ─────────────────────────────────────
  let businessExt = $derived(
    $extensions.find((e) => e.id === "whatsapp-business"),
  );
  let customersExt = $derived(
    $extensions.find((e) => e.id === "whatsapp-customers"),
  );
  let businessConnected = $derived(businessExt?.connected ?? false);
  let customersConnected = $derived(customersExt?.connected ?? false);

  // ─── Business onboarding ─────────────────────────────────
  let bizStep = $state(1);
  let bizPhone = $state("");
  let bizOtp = $state(["", "", "", "", "", ""]);
  let bizVerifying = $state(false);
  let bizNotifPrefs = $state({
    dailySummaries: true,
    largeTransactions: true,
    lowStock: false,
  });
  let botEnabled = $state(true);
  let selectedModel = $state("gpt-4o-mini");
  let botName = $state("Kemi");
  let botTone = $state("Warm and helpful");
  let botInstructions = $state(
    "Help customers find products, place orders, and check delivery status. Escalate payment issues to a team member.",
  );
  let testMessage = $state("");
  let testMessages = $state([
    {
      from: "bot",
      text: "Hi! I’m Kemi from Cafe Bloom. What can I help you find today?",
    },
    { from: "user", text: "Do you have scratch cards?" },
    {
      from: "bot",
      text: "We do. We have ₦500 and ₦1,000 cards in stock. How many would you like?",
    },
  ]);
  let apiSaved = $state(false);

  const models = [
    {
      id: "gpt-4o-mini",
      name: "GPT-4o mini",
      description: "Fast replies for everyday customer questions",
      price: "₦0.18 / 1K tokens",
      tag: "Best value",
    },
    {
      id: "claude-3-5-haiku",
      name: "Claude 3.5 Haiku",
      description: "Natural, thoughtful conversations at speed",
      price: "₦0.24 / 1K tokens",
      tag: "Popular",
    },
    {
      id: "gemini-2-flash",
      name: "Gemini 2.0 Flash",
      description: "Great with product lists and rich context",
      price: "₦0.12 / 1K tokens",
      tag: "Lowest cost",
    },
  ];

  const workflows = [
    {
      icon: ShoppingBag,
      title: "Product questions",
      description: "Answer from your inventory and price list",
      enabled: true,
    },
    {
      icon: CreditCard,
      title: "Order and payment links",
      description: "Create orders and send secure payment requests",
      enabled: true,
    },
    {
      icon: Activity,
      title: "Human handoff",
      description: "Route complex conversations to your team",
      enabled: true,
    },
    {
      icon: Bell,
      title: "Delivery updates",
      description: "Proactively notify customers about their order",
      enabled: false,
    },
  ];

  let workflowStates = $state(workflows.map((workflow) => workflow.enabled));

  function toggleWorkflow(index: number) {
    workflowStates[index] = !workflowStates[index];
  }

  function sendTestMessage() {
    if (!testMessage.trim()) return;
    testMessages = [
      ...testMessages,
      { from: "user", text: testMessage.trim() },
      {
        from: "bot",
        text: "Got it. I can help with that. Let me check our latest stock and options for you.",
      },
    ];
    testMessage = "";
  }

  function saveBotSettings() {
    apiSaved = true;
    setTimeout(() => (apiSaved = false), 2500);
  }

  function bizOtpInput(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    bizOtp[index] = digit;
    if (digit && index < 5) {
      document.getElementById(`biz-otp-${index + 1}`)?.focus();
    }
  }

  function bizOtpKeydown(index: number, e: KeyboardEvent) {
    if (e.key === "Backspace" && !bizOtp[index] && index > 0) {
      document.getElementById(`biz-otp-${index - 1}`)?.focus();
    }
  }

  function bizVerifyOtp() {
    bizVerifying = true;
    setTimeout(() => {
      bizVerifying = false;
      bizStep = 3;
    }, 1500);
  }

  function bizComplete() {
    connectExtension("whatsapp-business", {
      phone: bizPhone,
      notifications: { ...bizNotifPrefs },
      linkedNumbers: [{ label: "Primary", phone: bizPhone, verified: true }],
      connectedAt: new Date().toISOString(),
    });
    bizStep = 1;
    bizPhone = "";
    bizOtp = ["", "", "", "", "", ""];
  }

  // ─── Customers onboarding ────────────────────────────────
  let custStep = $state(1);
  let custBusinessName = $state("");
  let custTemplates = $state({
    receipts: true,
    orderUpdates: true,
    supportMessages: false,
  });

  function custComplete() {
    connectExtension("whatsapp-customers", {
      businessName: custBusinessName,
      apiConfigured: true,
      templates: { ...custTemplates },
      connectedAt: new Date().toISOString(),
    });
    custStep = 1;
    custBusinessName = "";
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension"
    title="WhatsApp Customer Bot"
    description="Configure the AI agent that sells, supports, and follows up with your customers on WhatsApp."
  ></PageHeader>

  <!-- ════════ BUSINESS TAB ════════ -->
  {#if activeTab === "business"}
    {#if !businessConnected}
      <div class="space-y-6">
        <!-- Hero with preview -->
        <div
          class="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8"
        >
          <NoiseOverlay intensity="light" />
          <div
            class="relative z-10 flex flex-col md:flex-row gap-8 items-center"
          >
            <div class="flex-1 space-y-4">
              <div
                class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600"
              >
                <MessageCircle class="h-6 w-6" />
              </div>
              <h2
                class="font-heading text-2xl font-extrabold tracking-tight text-foreground"
              >
                Connect WhatsApp for Business
              </h2>
              <p class="text-muted-foreground max-w-lg">
                Get instant sales alerts, daily summaries, and manage approvals
                directly from WhatsApp. Complete the setup below to connect your
                business number.
              </p>
              <!-- Step dots -->
              <div class="flex items-center gap-2 pt-2">
                {#each [1, 2, 3, 4] as step}
                  <div class="flex items-center gap-2">
                    <div
                      class={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${bizStep > step ? "bg-green-500 text-white" : bizStep === step ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-muted text-muted-foreground"}`}
                    >
                      {#if bizStep > step}<CheckCircle2
                          class="h-4 w-4"
                        />{:else}{step}{/if}
                    </div>
                    {#if step < 4}<div
                        class={`h-0.5 w-6 rounded-full transition-all duration-300 ${bizStep > step ? "bg-green-500" : "bg-border"}`}
                      ></div>{/if}
                  </div>
                {/each}
              </div>
            </div>
            <!-- Dimmed chat preview -->
            <div
              class="w-full md:w-72 bg-background border border-border/60 rounded-2xl p-4 shadow-sm opacity-40 grayscale pointer-events-none select-none"
            >
              <div
                class="flex items-center gap-2 mb-4 border-b border-border/60 pb-3"
              >
                <div
                  class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <ShieldCheck class="h-4 w-4 text-white" />
                </div>
                <div>
                  <p class="text-sm font-bold">Bizflow Alerts</p>
                  <p class="text-[10px] text-muted-foreground">Preview</p>
                </div>
              </div>
              <div
                class="bg-muted/50 rounded-lg rounded-tl-none p-3 text-xs w-[85%]"
              >
                <p class="font-bold mb-1">Daily Summary 📊</p>
                <p class="text-muted-foreground">
                  Connect to start receiving alerts
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Wizard steps -->
        <div class="surface-panel p-8">
          {#if bizStep === 1}
            <div class="max-w-md mx-auto text-center space-y-6 wa-fade-in">
              <div
                class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-600 mx-auto"
              >
                <Phone class="h-7 w-7" />
              </div>
              <div>
                <h3 class="font-heading text-xl font-bold text-foreground">
                  Enter your WhatsApp number
                </h3>
                <p class="mt-2 text-sm text-muted-foreground">
                  This is the phone number that will receive business alerts and
                  notifications from Bizflow.
                </p>
              </div>
              <div class="text-left space-y-2">
                <label
                  for="biz-phone"
                  class="text-sm font-medium text-foreground"
                  >Phone number</label
                >
                <div class="flex items-center gap-2">
                  <span
                    class="inline-flex items-center rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground font-mono"
                    >+234</span
                  >
                  <input
                    id="biz-phone"
                    type="tel"
                    bind:value={bizPhone}
                    placeholder="801 234 5678"
                    class="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-mono tracking-wider"
                  />
                </div>
              </div>
              <button
                type="button"
                disabled={bizPhone.replace(/\D/g, "").length < 7}
                on:click={() => (bizStep = 2)}
                class="btn-app-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight class="h-4 w-4" />
              </button>
            </div>
          {:else if bizStep === 2}
            <div class="max-w-md mx-auto text-center space-y-6 wa-fade-in">
              <div
                class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mx-auto"
              >
                <KeyRound class="h-7 w-7" />
              </div>
              <div>
                <h3 class="font-heading text-xl font-bold text-foreground">
                  Verify your number
                </h3>
                <p class="mt-2 text-sm text-muted-foreground">
                  We've sent a 6-digit code to <strong class="text-foreground"
                    >+234 {bizPhone}</strong
                  >
                </p>
              </div>
              <div class="flex justify-center gap-2">
                {#each bizOtp as digit, i}
                  <input
                    id="biz-otp-{i}"
                    type="text"
                    inputmode="numeric"
                    maxlength="1"
                    value={digit}
                    on:input={(e) => bizOtpInput(i, e.currentTarget.value)}
                    on:keydown={(e) => bizOtpKeydown(i, e)}
                    class="h-12 w-12 rounded-xl border border-border bg-background text-center text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-mono"
                  />
                {/each}
              </div>
              <div class="flex gap-3">
                <button
                  type="button"
                  on:click={() => (bizStep = 1)}
                  class="btn-app-secondary flex-1"
                  ><ArrowLeft class="h-4 w-4" /> Back</button
                >
                <button
                  type="button"
                  disabled={bizOtp.some((d) => !d) || bizVerifying}
                  on:click={bizVerifyOtp}
                  class="btn-app-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {#if bizVerifying}<Loader2 class="h-4 w-4 animate-spin" /> Verifying…{:else}Verify
                    code <ArrowRight class="h-4 w-4" />{/if}
                </button>
              </div>
              <button type="button" class="text-xs text-primary hover:underline"
                >Resend code</button
              >
            </div>
          {:else if bizStep === 3}
            <div class="max-w-md mx-auto space-y-6 wa-fade-in">
              <div class="text-center">
                <div
                  class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto"
                >
                  <Bell class="h-7 w-7" />
                </div>
                <h3 class="mt-4 font-heading text-xl font-bold text-foreground">
                  Choose your notifications
                </h3>
                <p class="mt-2 text-sm text-muted-foreground">
                  Select what alerts you want to receive on WhatsApp. You can
                  change these later.
                </p>
              </div>
              <div class="space-y-3">
                <label
                  class="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:bg-muted/30 cursor-pointer transition"
                >
                  <div class="flex items-center gap-3">
                    <div class="rounded-lg bg-primary/10 p-2">
                      <Clock class="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p class="font-medium text-sm text-foreground">
                        Daily Summaries
                      </p>
                      <p class="text-xs text-muted-foreground">
                        Receive a summary of sales at end of day
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    bind:checked={bizNotifPrefs.dailySummaries}
                    class="accent-primary w-4 h-4"
                  />
                </label>
                <label
                  class="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:bg-muted/30 cursor-pointer transition"
                >
                  <div class="flex items-center gap-3">
                    <div class="rounded-lg bg-emerald-500/10 p-2">
                      <TrendingUp class="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p class="font-medium text-sm text-foreground">
                        Large Transactions
                      </p>
                      <p class="text-xs text-muted-foreground">
                        Alerts for transactions over ₦50,000
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    bind:checked={bizNotifPrefs.largeTransactions}
                    class="accent-primary w-4 h-4"
                  />
                </label>
                <label
                  class="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:bg-muted/30 cursor-pointer transition"
                >
                  <div class="flex items-center gap-3">
                    <div class="rounded-lg bg-amber-500/10 p-2">
                      <PackageMinus class="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p class="font-medium text-sm text-foreground">
                        Low Stock Alerts
                      </p>
                      <p class="text-xs text-muted-foreground">
                        Instant notification when inventory is low
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    bind:checked={bizNotifPrefs.lowStock}
                    class="accent-primary w-4 h-4"
                  />
                </label>
              </div>
              <div class="flex gap-3">
                <button
                  type="button"
                  on:click={() => (bizStep = 2)}
                  class="btn-app-secondary flex-1"
                  ><ArrowLeft class="h-4 w-4" /> Back</button
                >
                <button
                  type="button"
                  on:click={() => (bizStep = 4)}
                  class="btn-app-primary flex-1"
                  >Continue <ArrowRight class="h-4 w-4" /></button
                >
              </div>
            </div>
          {:else if bizStep === 4}
            <div class="max-w-md mx-auto text-center space-y-6 wa-fade-in">
              <div
                class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500 mx-auto wa-scale-in"
              >
                <CheckCircle2 class="h-8 w-8" />
              </div>
              <div>
                <h3 class="font-heading text-xl font-bold text-foreground">
                  You're all set! 🎉
                </h3>
                <p class="mt-2 text-sm text-muted-foreground">
                  WhatsApp Business is now connected to <strong
                    class="text-foreground">+234 {bizPhone}</strong
                  >. You'll start receiving notifications based on your
                  preferences.
                </p>
              </div>
              <div
                class="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 text-left space-y-2"
              >
                <p
                  class="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Sparkles class="h-4 w-4 text-green-500" /> Your setup
                </p>
                <div class="text-xs text-muted-foreground space-y-1">
                  <p>📱 Number: +234 {bizPhone}</p>
                  <p>
                    📊 Daily summaries: {bizNotifPrefs.dailySummaries
                      ? "On"
                      : "Off"}
                  </p>
                  <p>
                    💰 Large transaction alerts: {bizNotifPrefs.largeTransactions
                      ? "On"
                      : "Off"}
                  </p>
                  <p>
                    📦 Low stock alerts: {bizNotifPrefs.lowStock ? "On" : "Off"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                on:click={bizComplete}
                class="btn-app-primary w-full"
                ><Sparkles class="h-4 w-4" /> Go to dashboard</button
              >
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <!-- ─── Business connected dashboard ─── -->
      {@const data = businessExt?.connectionData ?? {}}
      {@const phone = String(data.phone ?? "")}
      <div class="space-y-6">
        <div
          class="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8"
        >
          <NoiseOverlay intensity="light" />
          <div class="relative z-10 space-y-6">
            <div
              class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"
            >
              <div class="flex items-start gap-4">
                <div
                  class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-600"
                >
                  <Bot class="h-6 w-6" />
                </div>
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <h2
                      class="font-heading text-2xl font-extrabold tracking-tight text-foreground"
                    >
                      WhatsApp Business Agent
                    </h2>
                    <span
                      class="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold text-green-600"
                      ><span class="h-1.5 w-1.5 rounded-full bg-green-500"
                      ></span> Live</span
                    >
                  </div>
                  <p class="mt-2 max-w-2xl text-muted-foreground">
                    Kemi helps customers discover products, place orders, and
                    get answers while your team focuses on the counter.
                  </p>
                  <div
                    class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground"
                  >
                    <span class="flex items-center gap-1.5 font-mono"
                      ><Phone class="h-3.5 w-3.5" /> +234 {phone}</span
                    >
                    <span class="flex items-center gap-1.5"
                      ><PlugZap class="h-3.5 w-3.5 text-green-500" /> WhatsApp API
                      connected</span
                    >
                    <span class="flex items-center gap-1.5"
                      ><Activity class="h-3.5 w-3.5 text-green-500" /> 99.8% uptime</span
                    >
                  </div>
                </div>
              </div>
              <label
                class="flex shrink-0 items-center gap-3 rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm font-medium text-foreground"
              >
                <span class="text-right"
                  ><span class="block">Agent status</span><span
                    class="block text-xs font-normal text-muted-foreground"
                    >Accepting new chats</span
                  ></span
                >
                <input
                  type="checkbox"
                  bind:checked={botEnabled}
                  class="peer sr-only"
                />
                <span
                  class="relative h-6 w-11 rounded-full bg-muted transition peer-checked:bg-green-500"
                  ><span
                    class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5"
                  ></span></span
                >
              </label>
            </div>
            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div
                class="rounded-2xl border border-border/60 bg-background/70 p-4"
              >
                <p class="text-xs text-muted-foreground">Conversations today</p>
                <p class="mt-2 font-heading text-2xl font-bold text-foreground">
                  148
                </p>
                <p class="mt-1 text-xs text-green-600">+18.4% vs yesterday</p>
              </div>
              <div
                class="rounded-2xl border border-border/60 bg-background/70 p-4"
              >
                <p class="text-xs text-muted-foreground">Resolved by Kemi</p>
                <p class="mt-2 font-heading text-2xl font-bold text-foreground">
                  91%
                </p>
                <p class="mt-1 text-xs text-muted-foreground">
                  34 handoffs this week
                </p>
              </div>
              <div
                class="rounded-2xl border border-border/60 bg-background/70 p-4"
              >
                <p class="text-xs text-muted-foreground">
                  Orders from WhatsApp
                </p>
                <p class="mt-2 font-heading text-2xl font-bold text-foreground">
                  ₦284,600
                </p>
                <p class="mt-1 text-xs text-green-600">+₦42,300 this week</p>
              </div>
              <div
                class="rounded-2xl border border-border/60 bg-background/70 p-4"
              >
                <p class="text-xs text-muted-foreground">AI usage this month</p>
                <p class="mt-2 font-heading text-2xl font-bold text-foreground">
                  ₦3,420
                </p>
                <p class="mt-1 text-xs text-muted-foreground">
                  34% of ₦10,000 budget
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div class="surface-panel p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="flex items-center gap-2 font-bold text-lg">
                  <BrainCircuit class="h-5 w-5 text-primary" /> AI model & budget
                </h3>
                <p class="mt-1 text-sm text-muted-foreground">
                  Choose the model that powers customer conversations.
                </p>
              </div>
              <a
                href="#usage"
                class="hidden items-center gap-1 text-xs font-medium text-primary hover:underline sm:flex"
                >View usage <ChevronRight class="h-3.5 w-3.5" /></a
              >
            </div>
            <div class="mt-5 grid gap-3">
              {#each models as model}
                <button
                  type="button"
                  on:click={() => (selectedModel = model.id)}
                  class={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${selectedModel === model.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border/60 hover:border-primary/40 hover:bg-muted/20"}`}
                >
                  <span
                    class={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selectedModel === model.id ? "border-primary" : "border-muted-foreground/40"}`}
                    ><span
                      class={`h-2.5 w-2.5 rounded-full bg-primary ${selectedModel === model.id ? "opacity-100" : "opacity-0"}`}
                    ></span></span
                  >
                  <span class="min-w-0 flex-1"
                    ><span
                      class="flex flex-wrap items-center gap-2 font-semibold text-sm text-foreground"
                      >{model.name}<span
                        class="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >{model.tag}</span
                      ></span
                    ><span class="mt-1 block text-xs text-muted-foreground"
                      >{model.description}</span
                    ></span
                  >
                  <span class="shrink-0 text-xs font-mono text-muted-foreground"
                    >{model.price}</span
                  >
                </button>
              {/each}
            </div>
            <div
              id="usage"
              class="mt-5 rounded-xl border border-border/60 bg-muted/20 p-4"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium text-foreground"
                  >Monthly AI budget</span
                ><span class="font-mono text-muted-foreground"
                  >₦3,420 / ₦10,000</span
                >
              </div>
              <div class="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div class="h-full w-[34%] rounded-full bg-primary"></div>
              </div>
              <div
                class="mt-2 flex items-center justify-between text-[11px] text-muted-foreground"
              >
                <span>Resets in 12 days</span><button
                  type="button"
                  class="font-medium text-primary hover:underline"
                  >Change budget</button
                >
              </div>
            </div>
          </div>

          <div class="surface-panel p-6">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="flex items-center gap-2 font-bold text-lg">
                  <PlugZap class="h-5 w-5 text-primary" /> WhatsApp API
                </h3>
                <p class="mt-1 text-sm text-muted-foreground">
                  Your personal API connection is healthy.
                </p>
              </div>
              <span
                class="rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold text-green-600"
                >Connected</span
              >
            </div>
            <div class="mt-5 space-y-3">
              <div
                class="flex items-center justify-between rounded-xl border border-border/60 p-3"
              >
                <div>
                  <p class="text-xs text-muted-foreground">Phone number ID</p>
                  <p class="mt-1 font-mono text-sm text-foreground">
                    •••• 4821
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Reveal phone number ID"
                  class="text-muted-foreground hover:text-foreground"
                  ><MoreHorizontal class="h-4 w-4" /></button
                >
              </div>
              <div
                class="flex items-center justify-between rounded-xl border border-border/60 p-3"
              >
                <div>
                  <p class="text-xs text-muted-foreground">Access token</p>
                  <p class="mt-1 font-mono text-sm text-foreground">
                    ••••••••••••••••
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Rotate access token"
                  class="text-muted-foreground hover:text-foreground"
                  ><RotateCcw class="h-4 w-4" /></button
                >
              </div>
              <div
                class="flex items-center gap-2 rounded-xl bg-green-500/5 p-3 text-xs text-muted-foreground"
              >
                <CheckCircle2 class="h-4 w-4 shrink-0 text-green-500" /> Last checked
                just now. Webhook events are being received.
              </div>
              <button type="button" class="btn-app-secondary w-full text-sm"
                ><SlidersHorizontal class="h-4 w-4" /> Manage API connection</button
              >
            </div>
          </div>
        </div>

        <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div class="surface-panel p-6">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="flex items-center gap-2 font-bold text-lg">
                  <Zap class="h-5 w-5 text-primary" /> Bot workflows
                </h3>
                <p class="mt-1 text-sm text-muted-foreground">
                  Give Kemi the tools to take action for customers.
                </p>
              </div>
              <button
                type="button"
                aria-label="Add workflow"
                class="rounded-lg p-2 text-primary hover:bg-primary/10"
                ><Plus class="h-4 w-4" /></button
              >
            </div>
            <div class="mt-5 space-y-2">
              {#each workflows as workflow, i}
                <button
                  type="button"
                  on:click={() => toggleWorkflow(i)}
                  class="flex w-full items-center gap-3 rounded-xl border border-border/60 p-3 text-left transition hover:bg-muted/20"
                >
                  <span
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    ><svelte:component
                      this={workflow.icon}
                      class="h-4 w-4"
                    /></span
                  >
                  <span class="min-w-0 flex-1"
                    ><span class="block text-sm font-medium text-foreground"
                      >{workflow.title}</span
                    ><span
                      class="mt-0.5 block truncate text-xs text-muted-foreground"
                      >{workflow.description}</span
                    ></span
                  >
                  <span
                    class={`relative h-5 w-9 shrink-0 rounded-full transition ${workflowStates[i] ? "bg-primary" : "bg-muted"}`}
                    ><span
                      class={`absolute top-1 h-3 w-3 rounded-full bg-white transition ${workflowStates[i] ? "left-5" : "left-1"}`}
                    ></span></span
                  >
                </button>
              {/each}
            </div>
          </div>

          <div
            class="surface-panel flex min-h-[390px] flex-col overflow-hidden p-0"
          >
            <div
              class="flex items-center justify-between border-b border-border/60 px-6 py-4"
            >
              <div>
                <h3 class="flex items-center gap-2 font-bold text-lg">
                  <MessageSquareText class="h-5 w-5 text-primary" /> Test your agent
                </h3>
                <p class="mt-1 text-xs text-muted-foreground">
                  Try a conversation before customers do.
                </p>
              </div>
              <span class="flex items-center gap-1.5 text-xs text-green-600"
                ><span class="h-1.5 w-1.5 rounded-full bg-green-500"></span> Sandbox</span
              >
            </div>
            <div
              class="flex flex-1 flex-col gap-3 overflow-y-auto bg-muted/10 p-5"
            >
              {#each testMessages as message}
                <div
                  class={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    class={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${message.from === "user" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border border-border/60 bg-background text-foreground"}`}
                  >
                    {message.text}
                  </div>
                </div>
              {/each}
            </div>
            <form
              class="flex gap-2 border-t border-border/60 p-4"
              on:submit|preventDefault={sendTestMessage}
            >
              <input
                bind:value={testMessage}
                aria-label="Test message"
                placeholder="Ask Kemi anything..."
                class="min-w-0 flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              /><button
                type="submit"
                aria-label="Send test message"
                class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary/90"
                ><SendHorizontal class="h-4 w-4" /></button
              >
            </form>
          </div>
        </div>

        <div class="surface-panel p-6">
          <div
            class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <h3 class="flex items-center gap-2 font-bold text-lg">
                <Bot class="h-5 w-5 text-primary" /> Agent personality
              </h3>
              <p class="mt-1 text-sm text-muted-foreground">
                Shape how your business sounds in every conversation.
              </p>
            </div>
            {#if apiSaved}<span
                class="flex items-center gap-1.5 text-xs font-medium text-green-600"
                ><CheckCircle2 class="h-4 w-4" /> Changes saved</span
              >{/if}
          </div>
          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <label class="text-sm font-medium text-foreground"
              >Agent name<input
                bind:value={botName}
                class="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-normal text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              /></label
            >
            <label class="text-sm font-medium text-foreground"
              >Conversation tone<select
                bind:value={botTone}
                class="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-normal text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                ><option>Warm and helpful</option><option
                  >Short and direct</option
                ><option>Playful and upbeat</option><option>Professional</option
                ></select
              ></label
            >
            <label class="text-sm font-medium text-foreground md:col-span-2"
              >Business instructions<textarea
                bind:value={botInstructions}
                rows="3"
                class="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-normal leading-relaxed text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              ></textarea></label
            >
          </div>
          <div
            class="mt-4 flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <p class="text-xs text-muted-foreground">
              Connected to your inventory, orders, and team handoff rules.
            </p>
            <button
              type="button"
              on:click={saveBotSettings}
              class="btn-app-primary text-sm"
              ><Sparkles class="h-4 w-4" /> Save agent settings</button
            >
          </div>
        </div>

        <div
          class="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-2"
        >
          <a
            href="https://developers.facebook.com/docs/whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            ><ExternalLink class="h-4 w-4" /> WhatsApp API documentation</a
          >
          <button
            type="button"
            on:click={() => disconnectExtension("whatsapp-business")}
            class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 transition"
            ><Unplug class="h-4 w-4" /> Disconnect WhatsApp</button
          >
        </div>
      </div>
    {/if}

    <!-- ════════ CUSTOMERS TAB ════════ -->
  {:else if !customersConnected}
    <div class="space-y-6">
      <div
        class="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8"
      >
        <NoiseOverlay intensity="light" />
        <div class="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div class="flex-1 space-y-4">
            <div
              class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
            >
              <Smartphone class="h-6 w-6" />
            </div>
            <h2
              class="font-heading text-2xl font-extrabold tracking-tight text-foreground"
            >
              Connect WhatsApp for Customers
            </h2>
            <p class="text-muted-foreground max-w-lg">
              Send automated digital receipts, order updates, and provide a
              direct support line for your customers via WhatsApp.
            </p>
            <div class="flex items-center gap-2 pt-2">
              {#each [1, 2, 3] as step}
                <div class="flex items-center gap-2">
                  <div
                    class={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${custStep > step ? "bg-green-500 text-white" : custStep === step ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-muted text-muted-foreground"}`}
                  >
                    {#if custStep > step}<CheckCircle2
                        class="h-4 w-4"
                      />{:else}{step}{/if}
                  </div>
                  {#if step < 3}<div
                      class={`h-0.5 w-6 rounded-full transition-all duration-300 ${custStep > step ? "bg-green-500" : "bg-border"}`}
                    ></div>{/if}
                </div>
              {/each}
            </div>
          </div>
          <div
            class="w-full md:w-72 bg-background border border-border/60 rounded-2xl p-4 shadow-sm opacity-40 grayscale pointer-events-none select-none"
          >
            <div
              class="flex items-center gap-2 mb-4 border-b border-border/60 pb-3"
            >
              <div
                class="h-8 w-8 rounded-full bg-primary flex items-center justify-center"
              >
                <Receipt class="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p class="text-sm font-bold">Your Business</p>
                <p class="text-[10px] text-muted-foreground">
                  Official Account
                </p>
              </div>
            </div>
            <div
              class="bg-muted/50 rounded-lg rounded-tl-none p-3 text-xs w-[85%]"
            >
              <p class="font-bold mb-1">Digital Receipt</p>
              <p class="text-muted-foreground">Connect to start sending</p>
            </div>
          </div>
        </div>
      </div>

      <div class="surface-panel p-8">
        {#if custStep === 1}
          <div class="max-w-md mx-auto space-y-6 wa-fade-in">
            <div class="text-center">
              <div
                class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto"
              >
                <ShieldCheck class="h-7 w-7" />
              </div>
              <h3 class="mt-4 font-heading text-xl font-bold text-foreground">
                Business API Setup
              </h3>
              <p class="mt-2 text-sm text-muted-foreground">
                Tell us about your business and we will prepare your customer
                channel. No API keys or technical setup required.
              </p>
            </div>
            <div class="space-y-4">
              <div class="space-y-2">
                <label
                  for="cust-name"
                  class="text-sm font-medium text-foreground"
                  >Business Display Name</label
                >
                <input
                  id="cust-name"
                  type="text"
                  bind:value={custBusinessName}
                  placeholder="e.g. Cafe Bloom"
                  class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
              <div class="rounded-xl border border-border/60 bg-muted/20 p-3">
                <p class="text-xs text-muted-foreground">
                  <strong class="text-foreground">What happens next?</strong> Bizflow
                  handles the connection and keeps your customer messages flowing.
                  You can finish the rest of the setup in the next step.
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={!custBusinessName.trim()}
              on:click={() => (custStep = 2)}
              class="btn-app-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight class="h-4 w-4" />
            </button>
          </div>
        {:else if custStep === 2}
          <div class="max-w-md mx-auto space-y-6 wa-fade-in">
            <div class="text-center">
              <div
                class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto"
              >
                <Send class="h-7 w-7" />
              </div>
              <h3 class="mt-4 font-heading text-xl font-bold text-foreground">
                Message Templates
              </h3>
              <p class="mt-2 text-sm text-muted-foreground">
                Choose which automated messages to enable for your customers.
              </p>
            </div>
            <div class="space-y-3">
              <label
                class="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:bg-muted/30 cursor-pointer transition"
              >
                <div class="flex items-center gap-3">
                  <div class="rounded-lg bg-green-500/10 p-2">
                    <Receipt class="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p class="font-medium text-sm text-foreground">
                      Digital Receipts
                    </p>
                    <p class="text-xs text-muted-foreground">
                      Send receipts after every transaction
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  bind:checked={custTemplates.receipts}
                  class="accent-primary w-4 h-4"
                />
              </label>
              <label
                class="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:bg-muted/30 cursor-pointer transition"
              >
                <div class="flex items-center gap-3">
                  <div class="rounded-lg bg-primary/10 p-2">
                    <Bell class="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p class="font-medium text-sm text-foreground">
                      Order Updates
                    </p>
                    <p class="text-xs text-muted-foreground">
                      Notify customers about print job progress
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  bind:checked={custTemplates.orderUpdates}
                  class="accent-primary w-4 h-4"
                />
              </label>
              <label
                class="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:bg-muted/30 cursor-pointer transition"
              >
                <div class="flex items-center gap-3">
                  <div class="rounded-lg bg-violet-500/10 p-2">
                    <MessageCircle class="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <p class="font-medium text-sm text-foreground">
                      Support Messages
                    </p>
                    <p class="text-xs text-muted-foreground">
                      Allow customers to send support queries
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  bind:checked={custTemplates.supportMessages}
                  class="accent-primary w-4 h-4"
                />
              </label>
            </div>
            <div class="flex gap-3">
              <button
                type="button"
                on:click={() => (custStep = 1)}
                class="btn-app-secondary flex-1"
                ><ArrowLeft class="h-4 w-4" /> Back</button
              >
              <button
                type="button"
                on:click={() => (custStep = 3)}
                class="btn-app-primary flex-1"
                >Continue <ArrowRight class="h-4 w-4" /></button
              >
            </div>
          </div>
        {:else if custStep === 3}
          <div class="max-w-md mx-auto text-center space-y-6 wa-fade-in">
            <div
              class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500 mx-auto wa-scale-in"
            >
              <CheckCircle2 class="h-8 w-8" />
            </div>
            <div>
              <h3 class="font-heading text-xl font-bold text-foreground">
                Customer Channel Ready! 🎉
              </h3>
              <p class="mt-2 text-sm text-muted-foreground">
                Your customers can now receive automated WhatsApp messages from <strong
                  class="text-foreground">{custBusinessName}</strong
                >.
              </p>
            </div>
            <div
              class="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 text-left space-y-2"
            >
              <p
                class="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Sparkles class="h-4 w-4 text-green-500" /> Your setup
              </p>
              <div class="text-xs text-muted-foreground space-y-1">
                <p>🏢 Business: {custBusinessName}</p>
                <p>
                  🧾 Digital receipts: {custTemplates.receipts ? "On" : "Off"}
                </p>
                <p>
                  📦 Order updates: {custTemplates.orderUpdates ? "On" : "Off"}
                </p>
                <p>
                  💬 Support messages: {custTemplates.supportMessages
                    ? "On"
                    : "Off"}
                </p>
              </div>
            </div>
            <button
              type="button"
              on:click={custComplete}
              class="btn-app-primary w-full"
              ><Sparkles class="h-4 w-4" /> Go to dashboard</button
            >
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <!-- ─── Customers connected dashboard ─── -->
    {@const custData = customersExt?.connectionData ?? {}}
    {@const custName = String(custData.businessName ?? "Your Business")}
    {@const custTpls = (custData.templates ?? {}) as Record<string, boolean>}
    <div class="space-y-6">
      <div
        class="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8"
      >
        <NoiseOverlay intensity="light" />
        <div class="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div class="flex-1 space-y-4">
            <div
              class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
            >
              <Smartphone class="h-6 w-6" />
            </div>
            <h2
              class="font-heading text-2xl font-extrabold tracking-tight text-foreground"
            >
              WhatsApp for Customers
            </h2>
            <p class="text-muted-foreground max-w-lg">
              Send automated digital receipts, print job updates, and provide a
              direct support line for your customers.
            </p>
            <div class="flex items-center gap-3 pt-2">
              <div
                class="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400"
              >
                <CheckCircle2 class="h-4 w-4" /> Connected
              </div>
              <span
                class="text-muted-foreground text-sm border-l border-border/60 pl-3"
                >{custName}</span
              >
            </div>
          </div>
          <div
            class="w-full md:w-72 bg-background border border-border/60 rounded-2xl p-4 shadow-sm"
          >
            <div
              class="flex items-center gap-2 mb-4 border-b border-border/60 pb-3"
            >
              <div
                class="h-8 w-8 rounded-full bg-primary flex items-center justify-center"
              >
                <Receipt class="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p class="text-sm font-bold">{custName}</p>
                <p class="text-[10px] text-primary">
                  Official Business Account
                </p>
              </div>
            </div>
            <div
              class="bg-muted/50 rounded-lg rounded-tl-none p-3 text-xs w-[85%]"
            >
              <p class="font-bold mb-1">Receipt for your order</p>
              <p>Your digital receipt is ready.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="surface-panel p-6">
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
            <Send class="h-5 w-5 text-primary" /> Message Templates
          </h3>
          <div class="space-y-4">
            <label
              class="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:bg-muted/30 cursor-pointer"
            >
              <div>
                <p class="font-medium text-sm text-foreground">
                  Digital Receipts
                </p>
                <p class="text-xs text-muted-foreground">
                  Send receipts after every transaction
                </p>
              </div>
              <input
                type="checkbox"
                checked={custTpls.receipts ?? false}
                class="accent-primary w-4 h-4"
              />
            </label>
            <label
              class="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:bg-muted/30 cursor-pointer"
            >
              <div>
                <p class="font-medium text-sm text-foreground">Order Updates</p>
                <p class="text-xs text-muted-foreground">
                  Notify customers about print job progress
                </p>
              </div>
              <input
                type="checkbox"
                checked={custTpls.orderUpdates ?? false}
                class="accent-primary w-4 h-4"
              />
            </label>
            <label
              class="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:bg-muted/30 cursor-pointer"
            >
              <div>
                <p class="font-medium text-sm text-foreground">
                  Support Messages
                </p>
                <p class="text-xs text-muted-foreground">
                  Allow customers to send support queries
                </p>
              </div>
              <input
                type="checkbox"
                checked={custTpls.supportMessages ?? false}
                class="accent-primary w-4 h-4"
              />
            </label>
          </div>
        </div>
        <div class="surface-panel p-6">
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
            <Settings2 class="h-5 w-5 text-primary" /> Connection Settings
          </h3>
          <div class="space-y-4">
            <div class="p-3 rounded-xl border border-border/60 bg-muted/10">
              <p class="text-sm font-medium text-foreground">Business Name</p>
              <p class="text-xs text-muted-foreground mt-1">{custName}</p>
            </div>
            <div class="p-3 rounded-xl border border-border/60 bg-muted/10">
              <p class="text-sm font-medium text-foreground">API Status</p>
              <p
                class="text-xs text-green-500 font-medium mt-1 flex items-center gap-1"
              >
                <CheckCircle2 class="h-3 w-3" /> Connected and active
              </p>
            </div>
            <button class="btn-app-secondary w-full text-sm"
              ><Settings2 class="h-4 w-4" /> Manage connection</button
            >
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          on:click={() => disconnectExtension("whatsapp-customers")}
          class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 transition"
        >
          <Unplug class="h-4 w-4" /> Disconnect Customer Channel
        </button>
      </div>
    </div>
  {/if}
</AppShell>

<style>
  .wa-fade-in {
    animation: waFadeIn 0.3s ease-out;
  }
  .wa-scale-in {
    animation: waScaleIn 0.4s ease-out;
  }
  @keyframes waFadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes waScaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
