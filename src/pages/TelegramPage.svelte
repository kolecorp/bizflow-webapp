<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import VisualBuilder from "$lib/components/builder/telegram/VisualBuilder.svelte";
  import { authStore } from "$lib/stores/auth";
  import { extensions } from "$lib/stores/extensions";
  import { toast } from "svelte-sonner";
  import {
    ArrowRight,
    Activity,
    Bot,
    Braces,
    Check,
    CheckCircle2,
    Code2,
    Copy,
    Database,
    Eye,
    FolderOpen,
    GitBranch,
    Globe2,
    Link2,
    LockKeyhole,
    Play,
    MessagesSquare,
    MessageSquare,
    Plus,
    Power,
    Radio,
    RefreshCw,
    Save,
    ShieldCheck,
    Sparkles,
    Store,
    Terminal,
    Trash2,
    Workflow,
    X,
    Zap,
  } from "@lucide/svelte";

  type Setup = {
    id: string;
    botUsername?: string;
    botName?: string;
    logoUrl?: string;
    description?: string;
    enabled?: boolean;
    webhookActive?: boolean;
    webhookUrl: string;
    extensionId?: string;
    tokenConfigured?: boolean;
    capabilities?: {
      vtu?: boolean;
      pos?: boolean;
      notifications?: boolean;
      localMode?: boolean;
      commandMappings?: CommandMapping[];
    };
  };

  type CommandMapping = {
    command: string;
    description?: string;
    action: string;
    target: string;
    aiConnector: string;
    enabled: boolean;
    telegramButton?: { enabled: boolean; label?: string };
    response?: string;
    actionType?:
      | "reply"
      | "vtu_airtime"
      | "vtu_data"
      | "vtu_pin"
      | "vtu_status"
      | "http_request"
      | "ai";
    actionConfig: {
      method?: string;
      url?: string;
      headers?: string;
      body?: string;
    };
    nodes?: any[];
    edges?: any[];
  };

  type TelegramView = "overview" | "commands" | "setup" | "guide";

  const api =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";
  let setup = $state<Setup | null>(null);
  let bots = $state<Setup[]>([]);
  let botImageUrls = $state<Record<string, string>>({});
  let loading = $state(true);
  let saving = $state(false);
  let disconnecting = $state(false);
  let botToken = $state("");
  let botName = $state("");
  let logoUrl = $state("");
  let showCreateModal = $state(false);
  let showDetailsModal = $state(false);
  let createStep = $state<"start" | "connect" | "extension">("start");
  let selectedExtension = $state("VTU");
  let connectedExtension = $state<string | null>(null);
  let projectDescription = $state("");
  let showGuide = $state(false);
  let activeCommandIndex = $state(0);
  let commandFilter = $state<"all" | "enabled" | "disabled">("all");
  let localMode = $state(false);
  let commandRows = $state<CommandMapping[]>([]);
  let studioPanel = $state<"build" | "resources" | "test">("build");
  let selectedNode = $state<string>("action");
  let testInput = $state("/status");
  let testRunning = $state(false);
  let testOutput = $state("Run a command to inspect the response payload.");
  let resourceConnected = $state(false);
  let currentView = $derived.by<TelegramView>(() => {
    const path = page.url.pathname;
    if (path.endsWith("/commands")) return "commands";
    if (path.endsWith("/setup")) return "setup";
    if (path.endsWith("/guide")) return "guide";
    return "overview";
  });

  let filteredCommandRows = $derived(
    commandRows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) =>
        commandFilter === "all"
          ? true
          : commandFilter === "enabled"
            ? row.enabled
            : !row.enabled,
      ),
  );
  let activeCommand = $derived(commandRows[activeCommandIndex] ?? null);

  const predefinedCommands = [
    {
      id: "vtu_airtime",
      command: "/airtime",
      name: "Buy airtime",
      detail: "Sell airtime through the connected VTU extension",
      icon: Zap,
    },
    {
      id: "vtu_data",
      command: "/data",
      name: "Buy data",
      detail: "Sell a data bundle through the connected VTU extension",
      icon: Radio,
    },
    {
      id: "vtu_pin",
      command: "/pin",
      name: "Sell PIN",
      detail: "Sell a VTU recharge PIN",
      icon: ShieldCheck,
    },
    {
      id: "vtu_status",
      command: "/status",
      name: "Request status",
      detail: "Check the customer’s latest transaction",
      icon: Activity,
    },
    {
      id: "reply",
      command: "/help",
      name: "Send a reply",
      detail: "Reply with a fixed Telegram message",
      icon: MessageSquare,
    },
  ] as const;
  let selectedPredefined = $state(predefinedCommands[0].id);
  let quickCommand = $state(predefinedCommands[0].command);
  let quickDescription = $state(predefinedCommands[0].detail);
  let quickResponse = $state("Choose an option to continue.");
  let quickButtonEnabled = $state(false);
  let quickButtonLabel = $state("");

  const projectSuggestions = [
    { name: "VTU", detail: "Airtime, data and customer requests", icon: Store },
    {
      name: "Commerce",
      detail: "Conversational sales and orders",
      icon: MessagesSquare,
    },
    {
      name: "Support",
      detail: "Customer care and team workflows",
      icon: Workflow,
    },
  ];

  let availableExtensions = $derived(
    $extensions.filter(
      (extension) =>
        extension.id !== "TELEGRAM" &&
        (extension.status === "active" || extension.subscribed),
    ),
  );

  function defaultCommandRows(): CommandMapping[] {
    return [
      {
        command: "/start",
        description: "Open the BizFlow bot",
        action: "Welcome flow",
        target: "App welcome",
        aiConnector: "None",
        enabled: true,
        response: "Welcome to {{bot_name}}. How can we help today?",
        actionType: "reply",
        actionConfig: {},
      },
      {
        command: "/buy",
        description: "Start a VTU purchase",
        action: "VTU purchase",
        target: "VTU",
        aiConnector: "None",
        enabled: true,
        response: "Send /airtime or /data with the recipient and network.",
        actionType: "reply",
        actionConfig: {},
      },
      {
        command: "/status",
        description: "Check the latest request",
        action: "Latest request status",
        target: "VTU status",
        aiConnector: "None",
        enabled: true,
        response: "Your latest request status is {{last_status}}.",
        actionType: "reply",
        actionConfig: {},
      },
    ];
  }

  function hydrateCommandRows(bot: Setup | null) {
    commandRows = bot?.capabilities?.commandMappings?.length
      ? bot.capabilities.commandMappings.map((row) => ({
          command: row.command ?? "/start",
          description: row.description ?? "",
          action: row.action ?? "Welcome flow",
          target: row.target ?? "App welcome",
          aiConnector: row.aiConnector ?? "None",
          enabled: row.enabled ?? true,
          telegramButton: row.telegramButton,
          response: row.response ?? "",
          actionType: row.actionType ?? "reply",
          actionConfig: row.actionConfig ?? {},
        }))
      : [];
    activeCommandIndex = 0;
  }

  async function request(path: string, init: RequestInit = {}) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    const response = await fetch(`${api}${path}`, {
      credentials: "include",
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${$authStore.accessToken}`,
        ...(init.headers ?? {}),
      },
    }).finally(() => window.clearTimeout(timeout));
    const payload = await response.json().catch(() => null);
    if (!response.ok)
      throw new Error(
        payload?.message ?? `Request failed (${response.status})`,
      );
    return payload;
  }

  async function load() {
    loading = true;
    try {
      const payload = (await request("/integrations/telegram/setup")) as {
        configured: boolean;
        bots: Setup[];
      };
      bots = payload.bots ?? [];
      void loadBotImages(bots);
      setup = bots[0] ?? null;
      connectedExtension = setup?.extensionId ?? null;
      botName = setup?.botName ?? "";
      logoUrl = setup?.logoUrl ?? "";
      localMode = !!setup?.capabilities?.localMode;
      hydrateCommandRows(setup);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load Telegram setup",
      );
    } finally {
      loading = false;
    }
  }

  async function loadBotImage(bot: Setup) {
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      const response = await fetch(
        `${api}/integrations/telegram/photo/${bot.id}`,
        {
          credentials: "include",
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${$authStore.accessToken}`,
          },
        },
      ).finally(() => window.clearTimeout(timeout));
      if (!response.ok) return;

      const previous = botImageUrls[bot.id];
      if (previous) window.URL.revokeObjectURL(previous);
      botImageUrls = {
        ...botImageUrls,
        [bot.id]: window.URL.createObjectURL(await response.blob()),
      };
    } catch {
      // A bot may not have a Telegram profile photo; the card uses its fallback.
    }
  }

  async function loadBotImages(nextBots: Setup[]) {
    await Promise.all(nextBots.map((bot) => loadBotImage(bot)));
  }

  async function connect() {
    if (!botToken.trim()) {
      toast.error("Paste the bot token from BotFather first.");
      return;
    }
    saving = true;
    try {
      const connected = (await request("/integrations/telegram/connect", {
        method: "POST",
        body: JSON.stringify({
          botToken: botToken.trim(),
          botName: botName.trim() || undefined,
          description: projectDescription.trim() || undefined,
          logoUrl: logoUrl.trim() || undefined,
          extensionId: selectedExtension || undefined,
        }),
      })) as Setup;
      setup = connected;
      bots = [connected, ...bots.filter((bot) => bot.id !== connected.id)];
      void loadBotImage(connected);
      botToken = "";
      connectedExtension = selectedExtension;
      showCreateModal = false;
      toast.success("Telegram bot connected and webhook enabled");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to connect Telegram bot",
      );
    } finally {
      saving = false;
    }
  }

  async function disconnect() {
    disconnecting = true;
    try {
      if (!setup) return;
      await request(`/integrations/telegram/disconnect/${setup.id}`, {
        method: "POST",
      });
      bots = bots.filter((bot) => bot.id !== setup?.id);
      setup = bots[0] ?? null;
      connectedExtension = setup?.extensionId ?? null;
      toast.success("Telegram bot disconnected");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to disconnect Telegram bot",
      );
    } finally {
      disconnecting = false;
    }
  }

  async function saveLocalMappings() {
    if (!setup) return;
    try {
      const payload = (await request(
        `/integrations/telegram/update/${setup.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            capabilities: {
              localMode,
              commandMappings: commandRows,
              aiConnectors: commandRows
                .filter((row) => row.aiConnector && row.aiConnector !== "None")
                .map((row) => ({ name: row.aiConnector, enabled: true })),
            },
          }),
        },
      )) as Setup;
      setup = payload;
      localMode = !!payload.capabilities?.localMode;
      toast.success("Telegram command studio changes saved");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update local command mappings",
      );
    }
  }

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  }

  function openCreate() {
    createStep = "start";
    botName = "";
    botToken = "";
    logoUrl = "";
    projectDescription = "";
    selectedExtension = availableExtensions[0]?.id ?? "VTU";
    showCreateModal = true;
  }

  function selectSuggestion(name: string) {
    botName = `${name} bot`;
    projectDescription =
      projectSuggestions.find((suggestion) => suggestion.name === name)
        ?.detail ?? "";
    createStep = "connect";
  }

  function selectBlankProject() {
    botName = "";
    projectDescription = "";
    createStep = "connect";
  }

  function selectBot(bot: Setup) {
    setup = bot;
    connectedExtension = bot.extensionId ?? null;
    localMode = !!bot.capabilities?.localMode;
    hydrateCommandRows(bot);
  }

  function addCommand() {
    commandRows = [
      ...commandRows,
      {
        command: "/new-command",
        description: "",
        action: "New workflow",
        target: "Choose a destination",
        aiConnector: "None",
        enabled: true,
        response: "Command received.",
        actionType: "reply",
        actionConfig: {},
      },
    ];
    activeCommandIndex = commandRows.length - 1;
    commandFilter = "all";
  }

  function selectPredefinedCommand(id: string) {
    const option =
      predefinedCommands.find((item) => item.id === id) ??
      predefinedCommands[0];
    selectedPredefined = option.id;
    quickCommand = option.command;
    quickDescription = option.detail;
    quickResponse =
      option.id === "reply"
        ? "Hi {{name}}, how can we help?"
        : "Your request is being processed.";
    quickButtonEnabled = false;
    quickButtonLabel = "";
  }

  function registerQuickCommand() {
    if (!setup || !quickCommand.trim()) return;
    const command = `/${normalizeCommand(quickCommand)}`;
    const existingIndex = commandRows.findIndex(
      (row) => row.command === command,
    );
    const option =
      predefinedCommands.find((item) => item.id === selectedPredefined) ??
      predefinedCommands[0];
    const mapping: CommandMapping = {
      command,
      description: quickDescription,
      action: option.name,
      target: "Telegram",
      aiConnector: "None",
      enabled: true,
      telegramButton: {
        enabled: quickButtonEnabled,
        label: quickButtonLabel.trim() || undefined,
      },
      response: quickResponse,
      actionType: selectedPredefined,
      actionConfig: {},
    };
    commandRows =
      existingIndex >= 0
        ? commandRows.map((row, index) =>
            index === existingIndex ? mapping : row,
          )
        : [...commandRows, mapping];
    activeCommandIndex =
      existingIndex >= 0 ? existingIndex : commandRows.length - 1;
    void saveLocalMappings();
  }

  function removeActiveCommand() {
    if (!activeCommand) return;
    commandRows = commandRows.filter(
      (_, index) => index !== activeCommandIndex,
    );
    activeCommandIndex = Math.max(
      0,
      Math.min(activeCommandIndex, commandRows.length - 1),
    );
  }

  function normalizeCommand(value: string) {
    return value.replace(/^\/+/, "");
  }

  function connectExternalResource() {
    if (!activeCommand) return;
    activeCommand.actionType = "http_request";
    activeCommand.action = activeCommand.action || "Call external resource";
    activeCommand.target = activeCommand.target || "External API";
    activeCommand.actionConfig = {
      method: activeCommand.actionConfig.method ?? "POST",
      url: activeCommand.actionConfig.url ?? "https://api.example.com/orders",
      headers:
        activeCommand.actionConfig.headers ?? '{"Authorization":"Bearer ..."}',
      body:
        activeCommand.actionConfig.body ??
        '{"message":"{{text}}","user":"{{user_id}}"}',
    };
    resourceConnected = true;
    studioPanel = "resources";
    selectedNode = "action";
  }

  function runCommandPreview() {
    if (!activeCommand) return;
    testRunning = true;
    testOutput = `Executing ${testInput || activeCommand.command} through ${activeCommand.actionType === "http_request" ? "the external resource" : "the command flow"}...`;
    window.setTimeout(() => {
      testRunning = false;
      testOutput =
        activeCommand.actionType === "http_request"
          ? `200 OK  ·  ${activeCommand.actionConfig.method ?? "POST"} ${activeCommand.actionConfig.url || "resource not configured"}\n\nResponse mapped to Telegram: ${activeCommand.response || "Command completed."}`
          : activeCommand.response ||
            "Command completed without a response template.";
    }, 450);
  }

  function ensureGraphState(cmd: CommandMapping) {
    if (cmd.nodes && cmd.edges) return;
    cmd.nodes = [
      {
        id: "trigger",
        type: "trigger",
        position: { x: 50, y: 150 },
        data: { command: cmd.command, description: cmd.description },
      },
      {
        id: "logic",
        type: "logic",
        position: { x: 350, y: 150 },
        data: { label: "Prepare context", detail: "Text, user ID, variables" },
      },
      {
        id: "action",
        type: "action",
        position: { x: 650, y: 150 },
        data: { label: cmd.action || "Action", detail: cmd.target || "Target" },
      },
      {
        id: "response",
        type: "response",
        position: { x: 950, y: 150 },
        data: { label: "Reply", detail: cmd.response || "Response" },
      },
    ];
    cmd.edges = [
      { id: "e1", source: "trigger", target: "logic" },
      { id: "e2", source: "logic", target: "action" },
      { id: "e3", source: "action", target: "response" },
    ];
  }

  $effect(() => {
    if (activeCommand) ensureGraphState(activeCommand);
  });

  function handleNodeClick(node: any) {
    selectedNode = node.type ?? "action";
  }

  function addNodeToGraph(
    type: "branch" | "ai" | "logic" | "action" | "response",
  ) {
    if (!activeCommand || !activeCommand.nodes) return;
    const id = `${type}-${Date.now()}`;
    const nodeDataMap: Record<string, any> = {
      branch: {
        label: "Condition split",
        conditionA: "True path",
        conditionB: "False path",
      },
      ai: { label: "AI processing", detail: "Interprets message intent" },
      logic: { label: "Prepare context", detail: "Text, user ID, variables" },
      action: { label: "New action", detail: "Choose a destination" },
      response: { label: "Reply", detail: "Set a response message" },
    };
    const newNode = {
      id,
      type,
      position: { x: 300 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: nodeDataMap[type] ?? { label: type },
    };
    activeCommand.nodes = [...activeCommand.nodes, newNode];
    selectedNode = type;
  }

  onMount(() => void load());
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension · Telegram"
    title="Telegram"
    description="Connect Telegram bots to BizFlow workflows and manage your customer-facing channel."
    infographic="/telegram_infographics.png"
  />

  <nav
    class="flex flex-wrap gap-2 border-b border-border/60 pb-4"
    aria-label="Telegram workspace"
  >
    <a
      href="/extensions/telegram"
      class:active={currentView === "overview"}
      class="telegram-nav-item">Overview</a
    >
    <a
      href="/extensions/telegram/commands"
      class:active={currentView === "commands"}
      class="telegram-nav-item"
      >Command studio <span>{commandRows.length}</span></a
    >
    <a
      href="/extensions/telegram/setup"
      class:active={currentView === "setup"}
      class="telegram-nav-item">Bot setup</a
    >
    <a
      href="/extensions/telegram/guide"
      class:active={currentView === "guide"}
      class="telegram-nav-item">BotFather guide</a
    >
  </nav>

  {#if loading}
    <div
      class="surface-panel flex min-h-56 items-center justify-center text-sm text-muted-foreground"
    >
      <RefreshCw class="mr-2 h-4 w-4 animate-spin" />Loading workspace
    </div>
  {:else if currentView === "guide"}
    <section class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p
            class="text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
          >
            BotFather guide
          </p>
          <h2 class="mt-2 font-heading text-2xl font-bold">
            Create your Telegram bot
          </h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Use Telegram's official BotFather to create a bot, copy its token,
            then connect it to a BizFlow project.
          </p>
        </div>
        <a href="/extensions/telegram" class="btn-app-secondary text-xs"
          >Back to overview</a
        >
      </div>
      <div class="grid gap-5 lg:grid-cols-2">
        {#each [["01", "Find BotFather", "Search for @BotFather in Telegram and open the verified account.", "01-botfather-search.png.svg"], ["02", "Start a new bot", "Send /newbot and choose a display name for your business bot.", "02-newbot.png.svg"], ["03", "Choose a username", "Choose a unique username ending in bot. This becomes the public bot link.", "03-bot-username.png.svg"], ["04", "Copy the API token", "Copy the token BotFather gives you and keep it private.", "04-token.png.svg"], ["05", "Set commands", "Use /setcommands to add commands such as start, buy, airtime, data, and status.", "05-setcommands.png.svg"], ["06", "Finish the profile", "Use /setuserpic and /setdescription to complete the customer-facing profile.", "06-branding.png.svg"]] as step}
          <article class="surface-panel overflow-hidden">
            <img
              class="guide-image"
              src={`/telegram-guide/${step[3]}`}
              alt={step[1]}
            />
            <div class="p-5">
              <p class="text-xs font-bold tracking-[0.16em] text-primary">
                {step[0]}
              </p>
              <h3 class="mt-2 font-heading text-lg font-bold">{step[1]}</h3>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">
                {step[2]}
              </p>
            </div>
          </article>
        {/each}
      </div>
      <div class="surface-panel flex items-start gap-3 p-5 text-sm leading-6">
        <ShieldCheck class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p class="text-muted-foreground">
          <strong class="text-foreground">Keep your token private.</strong> Paste
          it only into the Bot setup flow. BizFlow encrypts it before storage and
          registers the webhook for you.
        </p>
      </div>
    </section>
  {:else if currentView === "overview"}
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-foreground">
            Telegram workspace
          </p>
          <p class="mt-1 text-sm text-muted-foreground">
            Your connected bots and channel configuration.
          </p>
        </div>
        <button
          type="button"
          class="btn-app-primary text-xs"
          onclick={openCreate}><Plus class="h-4 w-4" />New project</button
        >
      </div>
      {#if bots.length > 0 && setup}
        <div class="telegram-studio-grid">
          <div class="telegram-bot-grid">
            {#each bots as bot (bot.id)}
              <button
                type="button"
                class:active={setup.id === bot.id}
                class="project-card text-left"
                onclick={() => selectBot(bot)}
              >
                <div class="project-card-body">
                  <div class="flex min-w-0 items-start gap-3">
                    {#if botImageUrls[bot.id]}
                      <img
                        class="project-card-avatar"
                        src={botImageUrls[bot.id]}
                        alt={`${bot.botName ?? "Telegram bot"} profile photo`}
                      />
                    {:else}
                      <span
                        class="project-card-avatar project-card-avatar-fallback"
                        ><Bot class="h-4 w-4 text-primary" /></span
                      >
                    {/if}
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <h3 class="truncate font-semibold">
                          {bot.botName ?? "Untitled Telegram bot"}
                        </h3>
                        <span
                          class:inactive={!bot.webhookActive}
                          class="project-card-status"
                          >{bot.webhookActive ? "Live" : "Paused"}</span
                        >
                      </div>
                      <p class="mt-1 truncate text-xs text-muted-foreground">
                        {bot.botUsername
                          ? `@${bot.botUsername}`
                          : "Telegram project"}
                      </p>
                      {#if bot.description}
                        <p
                          class="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground"
                        >
                          {bot.description}
                        </p>
                      {/if}
                    </div>
                  </div>
                  <span class="project-card-arrow" aria-hidden="true"
                    ><ArrowRight class="h-4 w-4" /></span
                  >
                </div>
                <div class="project-card-footer">
                  <span>Telegram bot</span>
                  <span
                    >{bot.capabilities?.commandMappings?.length ?? 0} commands</span
                  >
                </div>
              </button>
            {/each}
          </div>
          <aside class="surface-panel p-5">
            <p
              class="text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
            >
              Channel setup
            </p>
            <h2 class="mt-2 font-heading text-lg font-bold">
              {setup.botName ?? "Telegram bot"}
            </h2>
            <div class="mt-5 space-y-3 text-sm">
              <div
                class="flex items-center justify-between gap-3 border-b border-border/60 pb-3"
              >
                <span class="text-muted-foreground">Connection</span><span
                  class="font-semibold text-primary"
                  >{setup.webhookActive ? "Active" : "Inactive"}</span
                >
              </div>
              <div
                class="flex items-center justify-between gap-3 border-b border-border/60 pb-3"
              >
                <span class="text-muted-foreground">Extension</span><span
                  class="font-semibold"
                  >{availableExtensions.find(
                    (extension) => extension.id === connectedExtension,
                  )?.name ?? "Not assigned"}</span
                >
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="text-muted-foreground">Bot username</span><span
                  class="max-w-48 truncate font-semibold"
                  >{setup.botUsername
                    ? `@${setup.botUsername}`
                    : "Not available"}</span
                >
              </div>
            </div>
            <button
              type="button"
              class="btn-app-secondary mt-5 w-full text-xs"
              onclick={() => (showDetailsModal = true)}
              ><FolderOpen class="h-4 w-4" />Open project details</button
            >
          </aside>
        </div>
      {:else}
        <div
          class="surface-panel flex min-h-90 flex-col items-center justify-center px-6 py-12 text-center"
        >
          <div
            class="flex size-16 items-center justify-center rounded-2xl border border-border bg-muted/40 text-primary"
          >
            <Bot class="h-8 w-8" />
          </div>
          <h2 class="mt-6 font-heading text-2xl font-bold">
            Telegram is not connected
          </h2>
          <p class="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Connect a Telegram bot to make it available to your customers and
            BizFlow workflows.
          </p>
          <button
            type="button"
            class="btn-app-primary mt-6"
            onclick={openCreate}
            ><Plus class="h-4 w-4" />Connect Telegram</button
          >
        </div>
      {/if}
    </div>
  {:else if currentView === "commands" && setup}
    <section
      class="command-registration"
      aria-labelledby="command-studio-title"
    >
      <div class="command-registration__header">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            {setup.botName ?? "Telegram bot"}
          </p>
          <h2
            id="command-studio-title"
            class="mt-2 font-heading text-2xl font-bold text-foreground"
          >
            Register bot commands
          </h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Connect a Telegram command to a Bizflow capability. These predefined
            actions do not need a workflow.
          </p>
        </div>
        <a
          href={`/automation-studio?extension=telegram&botId=${encodeURIComponent(setup.id)}`}
          class="btn-app-secondary inline-flex items-center gap-2"
        >
          <Workflow class="h-4 w-4" /> Advanced automation <ArrowRight
            class="h-4 w-4"
          />
        </a>
      </div>
      <div class="command-registration__grid">
        <div class="command-action-list">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="font-heading text-lg font-bold">Bizflow actions</h3>
              <p class="mt-1 text-xs text-muted-foreground">
                Powered by your connected extensions
              </p>
            </div>
            <span class="command-count">{commandRows.length} registered</span>
          </div>
          <div class="mt-5 grid gap-2">
            {#each predefinedCommands as option}
              {@const Icon = option.icon}
              <button
                class="command-action-card"
                class:selected={selectedPredefined === option.id}
                onclick={() => selectPredefinedCommand(option.id)}
              >
                <span class="command-action-card__icon"
                  ><Icon class="h-4 w-4" /></span
                >
                <span class="min-w-0 text-left"
                  ><strong>{option.name}</strong><small>{option.detail}</small
                  ></span
                >
                <span class="command-action-card__command"
                  >{option.command}</span
                >
              </button>
            {/each}
          </div>
        </div>
        <div class="command-registration__form">
          <div>
            <p
              class="text-xs font-bold uppercase tracking-[0.16em] text-primary"
            >
              Selected action
            </p>
            <h3 class="mt-2 font-heading text-xl font-bold">
              {predefinedCommands.find((item) => item.id === selectedPredefined)
                ?.name}
            </h3>
          </div>
          <label class="command-field"
            ><span>Telegram command</span>
            <div class="command-input-wrap">
              <b>/</b><input
                value={quickCommand.replace(/^\//, "")}
                oninput={(event) =>
                  (quickCommand = `/${normalizeCommand(event.currentTarget.value)}`)}
              />
            </div></label
          >
          <label class="command-field"
            ><span>Description</span><input
              value={quickDescription}
              oninput={(event) =>
                (quickDescription = event.currentTarget.value)}
            /></label
          >
          <label class="command-field"
            ><span>Reply template</span><textarea
              rows="4"
              value={quickResponse}
              oninput={(event) => (quickResponse = event.currentTarget.value)}
            ></textarea></label
          >
          <label class="command-toggle-field">
            <span>
              <strong>Show as Telegram button</strong>
              <small>Add this command to the bot's reply keyboard.</small>
            </span>
            <input type="checkbox" bind:checked={quickButtonEnabled} />
          </label>
          {#if quickButtonEnabled}
            <label class="command-field"
              ><span>Button label</span><input
                value={quickButtonLabel}
                oninput={(event) =>
                  (quickButtonLabel = event.currentTarget.value)}
                placeholder={quickCommand || "/command"}
              /></label
            >
          {/if}
          <button class="btn-app-primary w-full" onclick={registerQuickCommand}
            ><Plus class="h-4 w-4" /> Register command</button
          >
          <p class="text-xs leading-5 text-muted-foreground">
            Use Advanced automation when this command needs branching, an
            external API, delays, or custom nodes.
          </p>
        </div>
      </div>
    </section>
  {:else if currentView === "setup"}
    <section class="surface-panel p-6 sm:p-8">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 class="mt-2 font-heading text-2xl font-bold">
            Connect a Telegram bot
          </h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Create a new Telegram project or connect another bot to this
            business. Each bot keeps its own commands and workflow assignments.
          </p>
          {#if setup}
            <a
              class="btn-app-secondary mt-4 inline-flex text-xs"
              href={`/automation-studio?extension=telegram&botId=${encodeURIComponent(setup.id)}`}
            >
              Open automation studio <ArrowRight class="h-4 w-4" />
            </a>
          {/if}
        </div>
        <button
          type="button"
          class="btn-app-primary text-xs"
          onclick={() => {
            openCreate();
            createStep = "connect";
          }}><Plus class="h-4 w-4" />Connect bot</button
        >
      </div>
    </section>
  {/if}

  {#if showCreateModal}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
      role="presentation"
      onclick={() => (showCreateModal = false)}
      onkeydown={(event) => event.key === "Escape" && (showCreateModal = false)}
    >
      <div
        class="surface-panel max-h-[90vh] w-full max-w-4xl overflow-y-auto shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-telegram-title"
        tabindex="-1"
        onclick={(event) => event.stopPropagation()}
        onkeydown={(event) => event.stopPropagation()}
      >
        <div class="project-modal-header">
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            >
              <Bot class="h-5 w-5" />
            </div>
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                New Telegram project
              </p>
              <h2
                id="create-telegram-title"
                class="mt-1 font-heading text-xl font-bold"
              >
                {createStep === "start"
                  ? "What do you want to make?"
                  : createStep === "connect"
                    ? "Connect your bot"
                    : "Choose where it works"}
              </h2>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close create project dialog"
            class="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            onclick={() => (showCreateModal = false)}
            ><X class="h-4 w-4" /></button
          >
        </div>
        <div class="project-stepper">
          <span class:active={createStep === "start"}><b>01</b> Start</span
          ><span class:active={createStep === "connect"}><b>02</b> Connect</span
          ><span class:active={createStep === "extension"}
            ><b>03</b> Assign</span
          >
        </div>
        {#if createStep === "start"}
          <div class="p-6">
            <div class="mb-5">
              <p class="text-sm font-medium">Choose a starting point</p>
              <p class="mt-1 text-xs text-muted-foreground">
                These are shortcuts, not limits. You can shape the project
                however you like.
              </p>
            </div>
            <div class="suggestion-grid">
              {#each projectSuggestions as suggestion}<button
                  type="button"
                  class="suggestion-tile"
                  onclick={() => selectSuggestion(suggestion.name)}
                  ><span class="suggestion-icon"
                    ><svelte:component
                      this={suggestion.icon}
                      class="h-5 w-5"
                    /></span
                  ><span class="suggestion-copy"
                    ><strong>{suggestion.name}</strong><small
                      >{suggestion.detail}</small
                    ></span
                  ><ArrowRight class="suggestion-arrow h-4 w-4" /></button
                >{/each}<button
                type="button"
                class="suggestion-tile blank"
                onclick={selectBlankProject}
                ><span class="suggestion-icon"><Plus class="h-5 w-5" /></span
                ><span class="suggestion-copy"
                  ><strong>Start blank</strong><small
                    >Build your own flow from scratch</small
                  ></span
                ><ArrowRight class="suggestion-arrow h-4 w-4" /></button
              >
            </div>
          </div>
        {:else if createStep === "connect"}
          <div class="p-6">
            <div class="grid gap-5 md:grid-cols-[1fr_0.8fr]">
              <div class="space-y-4">
                <label class="block space-y-2 text-sm font-semibold"
                  >Project name<input
                    bind:value={botName}
                    placeholder="Untitled Telegram project"
                    class="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  /></label
                ><label class="block space-y-2 text-sm font-semibold"
                  >What is this project for? <span
                    class="font-normal text-muted-foreground">optional</span
                  ><textarea
                    bind:value={projectDescription}
                    rows="3"
                    placeholder="Describe the experience you want to build"
                    class="w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  ></textarea></label
                ><label class="block space-y-2 text-sm font-semibold"
                  >Bot API token<input
                    bind:value={botToken}
                    type="password"
                    autocomplete="off"
                    placeholder="Paste the token from BotFather"
                    class="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  /><span
                    class="block text-xs font-normal text-muted-foreground"
                    >Encrypted before storage. BizFlow never displays the saved
                    token.</span
                  ></label
                ><label class="block space-y-2 text-sm font-semibold"
                  >Logo URL <span class="font-normal text-muted-foreground"
                    >optional</span
                  ><input
                    bind:value={logoUrl}
                    type="url"
                    placeholder="https://.../logo.png"
                    class="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  /></label
                >
              </div>
              <div class="connect-guide">
                <div
                  class="flex size-10 items-center justify-center rounded-xl bg-muted text-primary"
                >
                  <ShieldCheck class="h-5 w-5" />
                </div>
                <h3 class="mt-4 font-semibold">Get your bot token</h3>
                <p class="mt-2 text-sm leading-6 text-muted-foreground">
                  Open Telegram, message <strong>@BotFather</strong>, choose
                  <code>/newbot</code>, and paste the token here. BizFlow
                  registers the webhook after verification.
                </p>
                <button
                  type="button"
                  class="mt-4 text-sm font-semibold text-primary hover:underline"
                  onclick={() => (createStep = "extension")}
                  >I have a token <ArrowRight
                    class="ml-1 inline h-4 w-4"
                  /></button
                >
              </div>
            </div>
            <div class="mt-6 flex justify-between gap-3">
              <button
                type="button"
                class="btn-app-secondary"
                onclick={() => (createStep = "start")}>Back</button
              ><button
                type="button"
                class="btn-app-primary"
                onclick={() => (createStep = "extension")}
                ><ArrowRight class="h-4 w-4" />Continue</button
              >
            </div>
          </div>
        {:else}
          <div class="p-6">
            <div class="mb-5">
              <p class="text-sm font-medium">
                Connect this bot to a BizFlow extension
              </p>
              <p class="mt-1 text-xs text-muted-foreground">
                This determines which installed business workflow receives
                Telegram activity.
              </p>
            </div>
            {#if availableExtensions.length > 0}<div class="extension-picker">
                {#each availableExtensions as extension}<button
                    type="button"
                    class:selected={selectedExtension === extension.id}
                    onclick={() => (selectedExtension = extension.id)}
                    ><span class="extension-picker-icon"
                      ><svelte:component
                        this={extension.icon}
                        class="h-5 w-5"
                      /></span
                    ><span
                      ><strong>{extension.name}</strong><small
                        >{extension.description}</small
                      ></span
                    >{#if selectedExtension === extension.id}<CheckCircle2
                        class="ml-auto h-4 w-4 text-primary"
                      />{/if}</button
                  >{/each}
              </div>{:else}<div
                class="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground"
              >
                Install an extension first, then return here to assign this
                Telegram project.
              </div>{/if}
            <div class="mt-6 flex justify-between gap-3">
              <button
                type="button"
                class="btn-app-secondary"
                onclick={() => (createStep = "connect")}>Back</button
              ><button
                type="button"
                class="btn-app-primary"
                disabled={saving || !botToken.trim()}
                onclick={() => void connect()}
                ><Link2 class="h-4 w-4" />{saving
                  ? "Connecting..."
                  : "Create and connect"}</button
              >
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if showDetailsModal && setup}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
      role="presentation"
      onclick={() => (showDetailsModal = false)}
      onkeydown={(event) =>
        event.key === "Escape" && (showDetailsModal = false)}
    >
      <div
        class="surface-panel w-full max-w-lg p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="telegram-project-title"
        tabindex="-1"
        onclick={(event) => event.stopPropagation()}
        onkeydown={(event) => event.stopPropagation()}
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.16em] text-primary"
            >
              Telegram project
            </p>
            <h2
              id="telegram-project-title"
              class="mt-2 font-heading text-xl font-bold"
            >
              {setup.botName ?? "Untitled Telegram bot"}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close project details"
            class="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            onclick={() => (showDetailsModal = false)}
            ><X class="h-4 w-4" /></button
          >
        </div>
        <div class="mt-6 space-y-4">
          <div
            class="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 p-4"
          >
            <ShieldCheck class="h-5 w-5 text-primary" />
            <div>
              <p class="text-sm font-semibold">
                {setup.webhookActive ? "Connected and active" : "Connected"}
              </p>
              <p class="mt-1 text-xs text-muted-foreground">
                {setup.botUsername ? `@${setup.botUsername}` : "Telegram bot"}
              </p>
            </div>
          </div>
          <div
            class="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 p-4"
          >
            <Link2 class="h-5 w-5 text-primary" />
            <div>
              <p class="text-xs text-muted-foreground">Connected extension</p>
              <p class="mt-1 text-sm font-semibold">
                {availableExtensions.find(
                  (extension) => extension.id === connectedExtension,
                )?.name ?? "Not assigned"}
              </p>
            </div>
          </div>
          <div class="rounded-xl border border-border/70 bg-muted/20 p-4">
            <p
              class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Local mode
            </p>
            <div class="mt-3 flex items-center justify-between gap-3">
              <span class="text-sm">Webhook paused for local testing</span>
              <span
                class="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-600"
              >
                {localMode ? "Local" : "Live"}
              </span>
            </div>
          </div>
          <div
            class="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-muted/20 p-4"
          >
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                Command studio
              </p>
              <p class="mt-1 text-sm text-muted-foreground">
                {commandRows.length} commands configured for this bot.
              </p>
            </div>
            <button
              type="button"
              class="btn-app-secondary shrink-0 text-xs"
              onclick={() => {
                showDetailsModal = false;
                void goto("/extensions/telegram/commands");
              }}
            >
              Open studio <ArrowRight class="h-4 w-4" />
            </button>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            type="button"
            class="btn-app-secondary text-red-600 hover:bg-red-500/10"
            disabled={disconnecting}
            onclick={() => void disconnect()}
            ><Power class="h-4 w-4" />{disconnecting
              ? "Disconnecting..."
              : "Disconnect project"}</button
          >
        </div>
      </div>
    </div>
  {/if}
</AppShell>

<style>
  .telegram-studio-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(18rem, 0.75fr);
    gap: 1.5rem;
  }
  .telegram-bot-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  .guide-image {
    display: block;
    width: 100%;
    height: 12rem;
    object-fit: cover;
    background: var(--muted);
  }
  .project-card {
    border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
    border-radius: 0.7rem;
    background: var(--card);
    text-align: left;
    transition:
      border-color 150ms ease,
      transform 150ms ease,
      background 150ms ease;
  }
  .project-card:hover {
    border-color: color-mix(in srgb, var(--primary) 45%, var(--border));
    background: color-mix(in srgb, var(--primary) 2%, var(--card));
    transform: translateY(-2px);
  }
  .project-card.active {
    border-color: color-mix(in srgb, var(--primary) 60%, var(--border));
  }
  .project-card:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
  .project-card-body {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
  }
  .project-card-footer {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    border-top: 1px solid color-mix(in srgb, var(--border) 65%, transparent);
    padding: 0.65rem 1rem;
    color: var(--muted-foreground);
    font-size: 0.68rem;
  }
  .project-card-status {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    border-radius: 999px;
    background: color-mix(in srgb, #16a34a 12%, transparent);
    padding: 0.2rem 0.45rem;
    color: #15803d;
    font-size: 0.6rem;
    font-weight: 700;
    line-height: 1;
  }
  .project-card-status.inactive {
    background: var(--muted);
    color: var(--muted-foreground);
  }
  .project-card-arrow {
    display: grid;
    height: 2rem;
    width: 2rem;
    flex-shrink: 0;
    place-items: center;
    border-radius: 0.5rem;
    background: color-mix(in srgb, var(--primary) 9%, transparent);
    color: var(--primary);
    transition: transform 150ms ease;
  }
  .project-card:hover .project-card-arrow,
  .project-card.active .project-card-arrow {
    transform: translateX(2px);
  }
  .project-card-avatar {
    height: 2.5rem;
    width: 2.5rem;
    flex-shrink: 0;
    border-radius: 0.7rem;
    object-fit: cover;
  }
  .project-card-avatar-fallback {
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--primary) 10%, transparent);
  }
  .project-modal {
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 0.65rem;
    background: var(--card);
    opacity: 1;
    box-shadow: 0 24px 70px
      color-mix(in srgb, var(--foreground) 18%, transparent);
    color: var(--card-foreground);
  }
  .telegram-details-modal {
    border: 1px solid var(--border);
    border-radius: 0.65rem;
    background: var(--card);
    opacity: 1;
    box-shadow: 0 24px 70px
      color-mix(in srgb, var(--foreground) 18%, transparent);
    color: var(--card-foreground);
  }
  .project-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
    background: color-mix(in srgb, var(--muted) 20%, transparent);
    padding: 1rem 1.25rem;
  }
  .project-stepper {
    display: flex;
    gap: 1.25rem;
    border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
    background: color-mix(in srgb, var(--muted) 35%, transparent);
    padding: 0.65rem 1.25rem;
    color: var(--muted-foreground);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .project-stepper span {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
  .project-stepper b {
    display: inline-flex;
    height: 1.35rem;
    width: 1.35rem;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
    border-radius: 999px;
    font-size: 0.6rem;
  }
  .project-stepper span.active {
    color: var(--primary);
  }
  .project-stepper span.active b {
    border-color: var(--primary);
    background: var(--primary);
    color: var(--primary-foreground);
  }
  .suggestion-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.55rem;
  }
  .suggestion-tile {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    min-height: 4.5rem;
    border: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
    background: var(--background);
    border-radius: 0.55rem;
    padding: 0.65rem 0.75rem;
    text-align: left;
    transition:
      border-color 150ms ease,
      background 150ms ease,
      transform 150ms ease;
  }
  .suggestion-tile:hover {
    border-color: color-mix(in srgb, var(--primary) 45%, transparent);
    background: color-mix(in srgb, var(--primary) 4%, transparent);
    transform: translateY(-1px);
  }
  .suggestion-icon {
    display: flex;
    height: 2rem;
    width: 2rem;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    background: color-mix(in srgb, var(--primary) 10%, transparent);
    color: var(--primary);
  }
  .suggestion-copy {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 0.15rem;
  }
  .suggestion-copy strong {
    font-size: 0.875rem;
  }
  .suggestion-copy small,
  .extension-picker small {
    color: var(--muted-foreground);
    font-size: 0.75rem;
  }
  .suggestion-arrow {
    color: var(--muted-foreground);
  }
  .connect-guide {
    border-left: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
    padding: 0.25rem 0 0.25rem 1.25rem;
  }
  .extension-picker {
    display: grid;
    gap: 0.5rem;
  }
  .extension-picker button {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border: 1px solid color-mix(in srgb, var(--border) 75%, transparent);
    background: var(--background);
    border-radius: 0.55rem;
    padding: 0.65rem 0.75rem;
    text-align: left;
  }
  .extension-picker button.selected {
    border-color: color-mix(in srgb, var(--primary) 55%, transparent);
    background: color-mix(in srgb, var(--primary) 6%, transparent);
  }
  .extension-picker button > span:nth-child(2) {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 0.15rem;
  }
  .extension-picker-icon {
    display: flex;
    height: 2.25rem;
    width: 2.25rem;
    align-items: center;
    justify-content: center;
    border-radius: 0.65rem;
    background: var(--muted);
    color: var(--primary);
  }
  code {
    border-radius: 0.35rem;
    background: var(--muted);
    padding: 0.15rem 0.35rem;
    font-family: var(--font-mono);
    font-size: 0.85em;
  }
  .telegram-nav-item {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    border-radius: 0.55rem;
    padding: 0.5rem 0.75rem;
    color: var(--muted-foreground);
    font-size: 0.75rem;
    font-weight: 700;
    transition:
      background 150ms ease,
      color 150ms ease;
  }
  .telegram-nav-item:hover,
  .telegram-nav-item.active {
    background: color-mix(in srgb, var(--primary) 10%, transparent);
    color: var(--primary);
  }
  .telegram-nav-item span {
    display: inline-flex;
    min-width: 1.25rem;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary) 12%, transparent);
    padding: 0.1rem 0.35rem;
    font-size: 0.65rem;
  }
  /* ╔═══════════════════════════════════════════════════════════╗
   * ║                   COMMAND STUDIO (CS)                   ║
   * ╚═══════════════════════════════════════════════════════════╝ */
  .command-registration {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem 0 3rem;
  }

  .command-registration__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--border);
  }

  .command-registration__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
    gap: 1.25rem;
    align-items: start;
  }

  .command-action-list,
  .command-registration__form {
    border: 1px solid var(--border);
    border-radius: 0.9rem;
    background: var(--card);
  }

  .command-action-list {
    padding: 1.25rem;
  }

  .command-registration__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
  }

  .command-count {
    border-radius: 999px;
    padding: 0.25rem 0.55rem;
    color: var(--muted-foreground);
    background: var(--muted);
    font-size: 0.68rem;
    font-weight: 700;
  }

  .command-action-card {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem;
    border: 1px solid transparent;
    border-radius: 0.7rem;
    color: var(--foreground);
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition:
      background 150ms ease,
      border-color 150ms ease;
  }

  .command-action-card:hover,
  .command-action-card.selected {
    border-color: color-mix(in srgb, var(--primary) 35%, var(--border));
    background: color-mix(in srgb, var(--primary) 7%, transparent);
  }

  .command-action-card__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.55rem;
    color: var(--primary);
    background: color-mix(in srgb, var(--primary) 12%, transparent);
  }

  .command-action-card strong,
  .command-action-card small {
    display: block;
  }

  .command-action-card strong {
    font-size: 0.8rem;
    font-weight: 700;
  }

  .command-action-card small {
    margin-top: 0.2rem;
    color: var(--muted-foreground);
    font-size: 0.68rem;
    line-height: 1.35;
  }

  .command-action-card__command {
    color: var(--primary);
    font-family: var(--font-mono, monospace);
    font-size: 0.7rem;
    font-weight: 700;
  }

  .command-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    color: var(--foreground);
    font-size: 0.72rem;
    font-weight: 700;
  }

  .command-field input,
  .command-field textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--border);
    border-radius: 0.55rem;
    padding: 0.65rem 0.7rem;
    color: var(--foreground);
    background: var(--muted);
    font: inherit;
    font-weight: 400;
    outline: none;
  }

  .command-field input:focus,
  .command-field textarea:focus {
    border-color: var(--ring);
    background: var(--card);
  }

  .command-toggle-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border: 1px solid var(--border);
    border-radius: 0.55rem;
    padding: 0.75rem;
  }

  .command-toggle-field span {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .command-toggle-field small {
    color: var(--muted-foreground);
    font-size: 0.7rem;
  }

  .command-toggle-field input {
    height: 1rem;
    width: 1rem;
    accent-color: var(--primary);
  }

  .command-input-wrap {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 0.55rem;
    background: var(--muted);
    overflow: hidden;
  }

  .command-input-wrap:focus-within {
    border-color: var(--ring);
    background: var(--card);
  }

  .command-input-wrap b {
    padding-left: 0.7rem;
    color: var(--primary);
  }

  .command-input-wrap input {
    border: 0;
    background: transparent;
    box-shadow: none;
    outline: none;
  }

  .command-input-wrap input:focus {
    border: 0;
    box-shadow: none;
    outline: none;
  }

  @media (max-width: 800px) {
    .command-registration__header {
      flex-direction: column;
    }

    .command-registration__grid {
      grid-template-columns: 1fr;
    }
  }

  .cs {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 4.5rem); /* fill remaining height below header */
    margin: 0 -1.5rem -1.5rem -1.5rem; /* pull to edge of layout container */
    background: var(--background);
    overflow: hidden;
  }

  /* ─── Topbar ─── */
  .cs-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    background: var(--card);
    border-bottom: 1px solid var(--border);
    z-index: 20;
    box-shadow: 0 4px 20px color-mix(in srgb, var(--foreground) 3%, transparent);
  }
  .cs-topbar__left {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    width: 280px; /* match library width */
  }
  .cs-topbar__eyebrow {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.55rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--primary);
  }
  .cs-topbar__title {
    font-family: var(--font-mono, monospace);
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Palette */
  .cs-palette {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: var(--muted);
    padding: 0.25rem;
    border-radius: 0.65rem;
    border: 1px solid var(--border);
  }
  .cs-palette__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.65rem;
    border-radius: 0.45rem;
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--muted-foreground);
    transition:
      background 150ms ease,
      color 150ms ease;
  }
  .cs-palette__btn:hover {
    background: var(--card);
    color: var(--foreground);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--foreground) 6%, transparent);
  }
  .cs-palette__btn--ai {
    color: #db2777;
    background: color-mix(in srgb, #ec4899 8%, transparent);
  }
  .cs-palette__btn--ai:hover {
    background: color-mix(in srgb, #ec4899 15%, transparent);
    color: #be185d;
  }

  /* Topbar Right */
  .cs-topbar__right {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 320px; /* match inspector width */
    justify-content: flex-end;
  }
  .cs-status {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--muted-foreground);
    padding: 0.25rem 0.6rem;
    border-radius: 99px;
    background: var(--muted);
  }
  .cs-status--live {
    color: #16a34a;
    background: color-mix(in srgb, #22c55e 12%, transparent);
  }
  .cs-status__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
  .cs-inspector-tabs {
    display: flex;
    background: var(--muted);
    border-radius: 0.55rem;
    padding: 0.2rem;
  }
  .cs-inspector-tabs button {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.6rem;
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--muted-foreground);
    border-radius: 0.4rem;
  }
  .cs-inspector-tabs button[aria-selected="true"] {
    background: var(--card);
    color: var(--foreground);
    box-shadow: 0 2px 6px color-mix(in srgb, var(--foreground) 8%, transparent);
  }
  .cs-save-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.85rem;
    border-radius: 0.55rem;
    background: var(--primary);
    color: var(--primary-foreground);
    font-size: 0.72rem;
    font-weight: 700;
    transition: filter 150ms ease;
  }
  .cs-save-btn:hover {
    filter: brightness(1.1);
  }

  /* ─── Body Layout ─── */
  .cs-body {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  /* ─── Shared Panels ─── */
  .cs-library,
  .cs-inspector {
    display: flex;
    flex-direction: column;
    background: var(--card);
    z-index: 10;
  }
  .cs-library {
    width: 280px;
    border-right: 1px solid var(--border);
  }
  .cs-inspector {
    width: 320px;
    border-left: 1px solid var(--border);
    overflow-y: auto;
  }
  .cs-section-label {
    font-size: 0.62rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted-foreground);
  }

  /* ─── Library Sidebar ─── */
  .cs-library__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem 0.5rem;
  }
  .cs-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.45rem;
    color: var(--primary);
    background: color-mix(in srgb, var(--primary) 10%, transparent);
  }
  .cs-icon-btn:hover {
    background: color-mix(in srgb, var(--primary) 18%, transparent);
  }
  .cs-library__filters {
    display: flex;
    padding: 0 0.75rem;
    border-bottom: 1px solid var(--border);
  }
  .cs-library__filters button {
    flex: 1;
    padding: 0.6rem 0;
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--muted-foreground);
    border-bottom: 2px solid transparent;
  }
  .cs-library__filters button[aria-selected="true"] {
    color: var(--primary);
    border-bottom-color: var(--primary);
  }
  .cs-library__list {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .cs-cmd-item {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.65rem;
    border-radius: 0.5rem;
    text-align: left;
    border: 1px solid transparent;
  }
  .cs-cmd-item:hover {
    background: var(--muted);
  }
  .cs-cmd-item--active {
    background: color-mix(in srgb, var(--primary) 6%, transparent);
    border-color: color-mix(in srgb, var(--primary) 20%, transparent);
  }
  .cs-cmd-item__slash {
    font-family: var(--font-mono, monospace);
    font-size: 0.9rem;
    font-weight: 800;
    color: color-mix(in srgb, var(--primary) 50%, var(--muted-foreground));
  }
  .cs-cmd-item__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .cs-cmd-item__body strong {
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    color: var(--foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cs-cmd-item__body small {
    font-size: 0.62rem;
    color: var(--muted-foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cs-cmd-item__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--muted-foreground);
    flex-shrink: 0;
  }
  .cs-cmd-item__dot--live {
    background: #16a34a;
    box-shadow: 0 0 0 2px color-mix(in srgb, #22c55e 20%, transparent);
  }
  .cs-library__empty {
    padding: 2rem 1rem;
    text-align: center;
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }
  .cs-library__empty button {
    color: var(--primary);
    font-weight: 600;
    text-decoration: underline;
  }
  .cs-library__stats {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    border-top: 1px solid var(--border);
    background: var(--muted);
    font-size: 0.62rem;
    color: var(--muted-foreground);
  }
  .cs-library__stats strong {
    color: var(--foreground);
  }

  /* ─── Canvas Center ─── */
  .cs-canvas {
    flex: 1;
    position: relative;
    background: var(--background); /* Dots handled by SvelteFlow Background */
  }
  .cs-canvas__empty {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: var(--muted-foreground);
    font-size: 0.85rem;
  }
  .cs-canvas__badge {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 99px;
    box-shadow: 0 4px 16px color-mix(in srgb, var(--foreground) 5%, transparent);
    pointer-events: none;
    z-index: 5;
  }
  .cs-canvas__badge code {
    font-family: var(--font-mono, monospace);
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--primary);
  }
  .cs-canvas__badge-status {
    font-size: 0.62rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted-foreground);
  }
  .cs-canvas__badge-status.live {
    color: #16a34a;
  }

  /* ─── Inspector Right ─── */
  .cs-inspector__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .cs-inspector__title {
    font-family: var(--font-heading, sans-serif);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--foreground);
    margin-top: 0.25rem;
  }
  .cs-inspector__footer {
    margin-top: auto;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .cs-inspector__bot-name {
    font-size: 0.68rem;
    color: var(--muted-foreground);
  }

  /* Form elements */
  .cs-field-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px dashed var(--border);
  }
  .cs-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .cs-field--row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .cs-field > span {
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--foreground);
    display: flex;
    justify-content: space-between;
  }
  .cs-field > span em {
    font-style: normal;
    color: var(--muted-foreground);
    font-weight: 400;
  }
  .cs-field input,
  .cs-field select,
  .cs-field textarea {
    width: 100%;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.45rem;
    padding: 0.5rem 0.65rem;
    color: var(--foreground);
    font-size: 0.75rem;
    transition:
      border-color 150ms ease,
      box-shadow 150ms ease;
  }
  .cs-field input:focus,
  .cs-field select:focus,
  .cs-field textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent);
  }
  .cs-field textarea {
    resize: vertical;
    font-family: inherit;
  }
  .cs-field textarea.cs-code {
    font-family: var(--font-mono, monospace);
    font-size: 0.7rem;
    background: var(--muted);
  }
  .cs-trigger-input {
    position: relative;
    display: flex;
    align-items: center;
  }
  .cs-trigger-input__prefix {
    position: absolute;
    left: 0.75rem;
    color: var(--muted-foreground);
    font-family: var(--font-mono, monospace);
    font-weight: 700;
  }
  .cs-trigger-input input {
    padding-left: 1.5rem;
    font-family: var(--font-mono, monospace);
  }

  /* Toggle Switch */
  .cs-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  .cs-toggle input {
    appearance: none;
    width: 2.2rem;
    height: 1.2rem;
    background: var(--muted-foreground);
    border-radius: 99px;
    position: relative;
    transition: background 200ms ease;
    margin: 0;
    cursor: pointer;
  }
  .cs-toggle input::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: calc(1.2rem - 4px);
    height: calc(1.2rem - 4px);
    background: white;
    border-radius: 50%;
    transition: transform 200ms ease;
  }
  .cs-toggle input:checked {
    background: #16a34a;
  }
  .cs-toggle input:checked::before {
    transform: translateX(1rem);
  }
  .cs-toggle span {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--foreground);
  }

  /* Action Grid */
  .cs-action-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  .cs-action-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    text-align: left;
    transition: all 150ms ease;
  }
  .cs-action-btn:hover {
    border-color: color-mix(in srgb, var(--primary) 40%, transparent);
    background: color-mix(in srgb, var(--primary) 4%, transparent);
  }
  .cs-action-btn--active {
    border-color: var(--primary);
    background: color-mix(in srgb, var(--primary) 8%, transparent);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--primary) 10%, transparent);
  }
  .cs-action-btn > span {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
  .cs-action-btn strong {
    font-size: 0.7rem;
    color: var(--foreground);
  }
  .cs-action-btn small {
    font-size: 0.58rem;
    color: var(--muted-foreground);
  }

  /* Variable Chips */
  .cs-variable-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.25rem;
  }
  .cs-variable-chips button {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.5rem;
    background: var(--muted);
    border: 1px solid var(--border);
    border-radius: 0.35rem;
    font-size: 0.62rem;
    transition: border-color 150ms ease;
  }
  .cs-variable-chips button:hover {
    border-color: var(--primary);
  }
  .cs-variable-chips code {
    color: var(--primary);
    font-family: var(--font-mono, monospace);
  }

  /* HTTP Panel */
  .cs-http-panel {
    background: color-mix(in srgb, var(--muted) 40%, transparent);
    border: 1px solid var(--border);
    border-radius: 0.65rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .cs-http-panel__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    font-weight: 700;
  }
  .cs-http-row {
    display: flex;
    gap: 0.75rem;
  }

  /* Helpers */
  .cs-hint {
    font-size: 0.68rem;
    color: var(--muted-foreground);
    line-height: 1.5;
  }
  .cs-callout {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.68rem;
    line-height: 1.5;
  }
  .cs-callout--info {
    background: color-mix(in srgb, #3b82f6 10%, transparent);
    color: #2563eb;
    border: 1px solid color-mix(in srgb, #3b82f6 20%, transparent);
  }
  .cs-callout--ai {
    background: color-mix(in srgb, #ec4899 10%, transparent);
    color: #db2777;
    border: 1px solid color-mix(in srgb, #ec4899 20%, transparent);
  }
  .cs-callout code {
    background: color-mix(in srgb, currentColor 10%, transparent);
    padding: 0.1rem 0.25rem;
    border-radius: 0.25rem;
    font-family: var(--font-mono, monospace);
  }
  .cs-danger-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: #ef4444;
    font-size: 0.68rem;
    font-weight: 600;
    padding: 0.4rem 0.6rem;
    border-radius: 0.45rem;
    transition: background 150ms ease;
  }
  .cs-danger-btn:hover {
    background: color-mix(in srgb, #ef4444 10%, transparent);
  }
  .cs-route-label {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
  .cs-route-label::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .cs-route-label--a::before {
    background: #22c55e;
  }
  .cs-route-label--b::before {
    background: #f97316;
  }

  /* Resources Tab */
  .cs-resource-btn {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    width: 100%;
    padding: 0.85rem;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.65rem;
    text-align: left;
    margin-bottom: 0.5rem;
    transition:
      border-color 150ms ease,
      box-shadow 150ms ease;
  }
  .cs-resource-btn:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--primary) 10%, transparent);
  }
  .cs-resource-btn--muted {
    opacity: 0.6;
    pointer-events: none;
  }
  .cs-resource-btn__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.5rem;
  }
  .cs-resource-btn__icon--orange {
    background: color-mix(in srgb, #f97316 15%, transparent);
    color: #ea580c;
  }
  .cs-resource-btn__icon--violet {
    background: color-mix(in srgb, #a855f7 15%, transparent);
    color: #9333ea;
  }
  .cs-resource-btn span {
    display: flex;
    flex-direction: column;
  }
  .cs-resource-btn strong {
    font-size: 0.75rem;
    color: var(--foreground);
  }
  .cs-resource-btn small {
    font-size: 0.62rem;
    color: var(--muted-foreground);
  }
  .cs-soon {
    font-size: 0.55rem;
    font-weight: 800;
    text-transform: uppercase;
    padding: 0.2rem 0.4rem;
    background: var(--muted);
    border-radius: 99px;
    margin-left: auto;
  }
  .cs-steps {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }
  .cs-step {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }
  .cs-step b {
    font-family: var(--font-mono, monospace);
    font-size: 0.65rem;
    color: var(--primary);
  }
  .cs-step span {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .cs-step strong {
    font-size: 0.68rem;
    color: var(--foreground);
  }
  .cs-step small {
    font-size: 0.62rem;
    color: var(--muted-foreground);
    line-height: 1.4;
  }

  /* Test Sandbox */
  .cs-run-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    width: 100%;
    padding: 0.65rem;
    background: var(--primary);
    color: var(--primary-foreground);
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 0.5rem;
    margin-top: 0.5rem;
    transition: filter 150ms ease;
  }
  .cs-run-btn:hover:not(:disabled) {
    filter: brightness(1.1);
  }
  .cs-run-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  .cs-output {
    margin-top: 1rem;
    padding: 1rem;
    background: #0f172a;
    color: #60a5fa;
    border-radius: 0.5rem;
    font-family: var(--font-mono, monospace);
    font-size: 0.68rem;
    line-height: 1.5;
    white-space: pre-wrap;
    border: 1px solid #1e293b;
    min-height: 8rem;
  }
</style>
