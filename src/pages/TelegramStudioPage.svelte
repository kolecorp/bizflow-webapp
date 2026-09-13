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
    ArrowLeft,
    ArrowRight,
    Activity,
    ChevronLeft,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen,
    PanelRightClose,
    PanelRightOpen,
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
    Plus,
    Power,
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
    response?: string;
    actionType?: "reply" | "vtu_airtime" | "vtu_data" | "http_request" | "ai";
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
  let filterOptions = [
    { val: "all", label: "All" },
    { val: "enabled", label: "Enabled" },
    { val: "disabled", label: "Disabled" },
  ];
  let commandFilter = $state<"all" | "enabled" | "disabled">("all");
  let localMode = $state(false);
  let commandRows = $state<CommandMapping[]>([]);
  let studioPanel = $state<"build" | "resources" | "test">("build");
  let selectedNode = $state<string>("action");
  let testInput = $state("/status");
  let testRunning = $state(false);
  let testOutput = $state("Run a command to inspect the response payload.");
  let resourceConnected = $state(false);
  let leftSidebarCollapsed = $state(false);
  let rightSidebarCollapsed = $state(false);
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
          response: row.response ?? "",
          actionType: row.actionType ?? "reply",
          actionConfig: row.actionConfig ?? {},
        }))
      : defaultCommandRows();
    activeCommandIndex = 0;
  }

  async function request(path: string, init: RequestInit = {}) {
    const response = await fetch(`${api}${path}`, {
      credentials: "include",
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${$authStore.accessToken}`,
        ...(init.headers ?? {}),
      },
    });
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
          logoUrl: logoUrl.trim() || undefined,
          extensionId: selectedExtension || undefined,
        }),
      })) as Setup;
      setup = connected;
      bots = [connected, ...bots.filter((bot) => bot.id !== connected.id)];
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
    if (!setup || saving) return;
    saving = true;
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
    } finally {
      saving = false;
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
    const nodeSpacing = 360;
    cmd.nodes = [
      {
        id: "trigger",
        type: "trigger",
        position: { x: 80, y: 220 },
        data: { command: cmd.command, description: cmd.description },
      },
      {
        id: "logic",
        type: "logic",
        position: { x: 80 + nodeSpacing, y: 220 },
        data: { label: "Prepare context", detail: "Text, user ID, variables" },
      },
      {
        id: "action",
        type: "action",
        position: { x: 80 + nodeSpacing * 2, y: 220 },
        data: { label: cmd.action || "Action", detail: cmd.target || "Target" },
      },
      {
        id: "response",
        type: "response",
        position: { x: 80 + nodeSpacing * 3, y: 220 },
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
    type: "trigger" | "branch" | "ai" | "logic" | "action" | "response",
  ) {
    if (!activeCommand || !activeCommand.nodes) return;
    const id = `${type}-${Date.now()}`;
    const nodeDataMap: Record<string, any> = {
      trigger: {
        command: activeCommand.command,
        description: activeCommand.description,
      },
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
      position: {
        x: 80 + activeCommand.nodes.length * 360,
        y: 220,
      },
      data: nodeDataMap[type] ?? { label: type },
    };
    activeCommand.nodes = [...activeCommand.nodes, newNode];
    selectedNode = type;
  }

  onMount(() => void load());
</script>

<section class="cs" aria-labelledby="command-studio-title">
  <!-- ── Top Header (Rigid Full Width) ── -->
  <header class="cs-topbar">
    <div class="cs-topbar__left">
      <a
        href="/extensions/telegram/commands"
        class="cs-icon-btn mr-2"
        aria-label="Go back"
      >
        <ArrowLeft class="size-4" />
      </a>
      <div class="cs-topbar__title-wrapper">
        <span class="cs-topbar__eyebrow"
          ><Sparkles class="size-3" /> Command Studio</span
        >
        <h2 id="command-studio-title" class="cs-topbar__title">
          {activeCommand
            ? activeCommand.command || "/untitled"
            : (setup?.botName ?? "Telegram bot")}
        </h2>
      </div>
    </div>

    <div class="cs-topbar__center">
      {#if activeCommand}
        <!-- Test/Build tabs in center -->
        <div class="cs-inspector-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={studioPanel === "build"}
            onclick={() => (studioPanel = "build")}
            ><Workflow class="size-3.5" />Build</button
          >
          <button
            type="button"
            role="tab"
            aria-selected={studioPanel === "resources"}
            onclick={() => (studioPanel = "resources")}
            ><Globe2 class="size-3.5" />Connect</button
          >
          <button
            type="button"
            role="tab"
            aria-selected={studioPanel === "test"}
            onclick={() => (studioPanel = "test")}
            ><Terminal class="size-3.5" />Test</button
          >
        </div>
      {/if}
    </div>

    <div class="cs-topbar__right">
      <span class="cs-status" class:cs-status--live={!localMode}>
        <span class="cs-status__dot"></span>
        {localMode ? "Local mode" : "Live routing"}
      </span>
      <button
        type="button"
        class="cs-save-btn"
        disabled={saving}
        onclick={() => void saveLocalMappings()}
      >
        <Save class="size-3.5" /> Deploy
      </button>
      {#if activeCommand}
        <button
          class="cs-icon-btn ml-2"
          onclick={() => (rightSidebarCollapsed = !rightSidebarCollapsed)}
          title="Toggle Inspector"
        >
          {#if rightSidebarCollapsed}
            <PanelRightOpen class="size-4 text-muted-foreground" />
          {:else}
            <PanelRightClose class="size-4 text-muted-foreground" />
          {/if}
        </button>
      {/if}
    </div>
  </header>

  <div class="cs-body">
    <!-- ── Left Sidebar: Command Library ── -->
    <aside
      class="cs-sidebar cs-sidebar--left"
      class:collapsed={leftSidebarCollapsed}
    >
      <div class="cs-sidebar__inner">
        <div class="cs-library__header">
          <span class="cs-section-label">Commands</span>
          <button
            type="button"
            class="cs-icon-btn"
            title="New command"
            onclick={addCommand}
          >
            <Plus class="size-4" />
          </button>
        </div>

        <div class="cs-library__filters" role="tablist">
          {#each filterOptions as { val, label }}
            <button
              type="button"
              role="tab"
              aria-selected={commandFilter === val}
              onclick={() => (commandFilter = val as any)}
            >
              {label}
            </button>
          {/each}
        </div>

        <div class="cs-library__list">
          {#each filteredCommandRows as item (item.index)}
            <button
              type="button"
              class="cs-cmd-item"
              class:cs-cmd-item--active={activeCommandIndex === item.index}
              onclick={() => (activeCommandIndex = item.index)}
            >
              <span class="cs-cmd-item__slash">/</span>
              <span class="cs-cmd-item__body">
                <strong
                  >{item.row.command.replace(/^\//, "") || "untitled"}</strong
                >
                <small
                  >{item.row.description ||
                    item.row.action ||
                    "No description"}</small
                >
              </span>
              <span
                class="cs-cmd-item__dot"
                class:cs-cmd-item__dot--live={item.row.enabled}
                title={item.row.enabled ? "Live" : "Draft"}
              ></span>
            </button>
          {:else}
            <p class="cs-library__empty">
              No commands. <button type="button" onclick={addCommand}
                >Create one.</button
              >
            </p>
          {/each}
        </div>
      </div>

      <!-- Collapse Toggle -->
      <button
        class="cs-sidebar__toggle cs-sidebar__toggle--left"
        onclick={() => (leftSidebarCollapsed = !leftSidebarCollapsed)}
        title="Toggle Sidebar"
      >
        {#if leftSidebarCollapsed}
          <ChevronRight class="size-3.5" />
        {:else}
          <ChevronLeft class="size-3.5" />
        {/if}
      </button>
    </aside>

    <!-- ── Base Layer: Visual Canvas ── -->
    <main class="cs-canvas" aria-label="Visual workflow builder">
      {#if activeCommand}
        {#if activeCommand.nodes && activeCommand.edges}
          <VisualBuilder
            bind:nodes={activeCommand.nodes}
            bind:edges={activeCommand.edges}
            onNodeClick={handleNodeClick}
          />
        {/if}
        <!-- Canvas overlay: command name badge -->
        <div class="cs-canvas__badge">
          <code>{activeCommand.command || "/untitled"}</code>
          <span
            class="cs-canvas__badge-status"
            class:live={activeCommand.enabled}
          >
            {activeCommand.enabled ? "Published" : "Draft"}
          </span>
        </div>

        <!-- Bottom Floating Dock -->
        <div class="bottom-panel">
          <div class="cs-palette" role="toolbar" aria-label="Add node">
            <button
              type="button"
              class="cs-palette__btn"
              title="Add Trigger"
              onclick={() => addNodeToGraph("trigger")}
            >
              <Zap class="size-3.5" />Trigger
            </button>
            <button
              type="button"
              class="cs-palette__btn"
              title="Add Transform"
              onclick={() => addNodeToGraph("logic")}
            >
              <Braces class="size-3.5" />Transform
            </button>
            <button
              type="button"
              class="cs-palette__btn"
              title="Add Branch"
              onclick={() => addNodeToGraph("branch")}
            >
              <GitBranch class="size-3.5" />Branch
            </button>
            <button
              type="button"
              class="cs-palette__btn"
              title="Add API action"
              onclick={() => addNodeToGraph("action")}
            >
              <Globe2 class="size-3.5" />API
            </button>
            <button
              type="button"
              class="cs-palette__btn cs-palette__btn--ai"
              title="Add AI node"
              onclick={() => addNodeToGraph("ai")}
            >
              <Sparkles class="size-3.5" />AI
            </button>
            <button
              type="button"
              class="cs-palette__btn"
              title="Add Response"
              onclick={() => addNodeToGraph("response")}
            >
              <MessagesSquare class="size-3.5" />Response
            </button>
          </div>
        </div>
      {:else}
        <div class="cs-canvas__empty">
          <Workflow class="size-10 text-muted-foreground/40" />
          <p>Select a command from the left to start building its flow.</p>
        </div>
      {/if}
    </main>

    <!-- ── Right Sidebar: Inspector ── -->
    {#if activeCommand}
      <aside
        class="cs-sidebar cs-sidebar--right"
        class:collapsed={rightSidebarCollapsed}
      >
        <div class="cs-sidebar__inner">
          {#if studioPanel === "build"}
            <div class="cs-inspector__header">
              <div>
                <span class="cs-section-label">
                  {selectedNode === "trigger"
                    ? "⚡ Trigger"
                    : selectedNode === "logic"
                      ? "⚙ Transform"
                      : selectedNode === "action"
                        ? "🌐 Action"
                        : selectedNode === "branch"
                          ? "⑂ Branch"
                          : selectedNode === "ai"
                            ? "✦ AI Node"
                            : "💬 Response"}
                </span>
                <h3 class="cs-inspector__title">
                  {selectedNode === "trigger"
                    ? "Trigger settings"
                    : selectedNode === "logic"
                      ? "Context mapping"
                      : selectedNode === "action"
                        ? "Action settings"
                        : selectedNode === "branch"
                          ? "Branch conditions"
                          : selectedNode === "ai"
                            ? "AI connector"
                            : "Response message"}
                </h3>
              </div>
              <Code2 class="size-4 text-muted-foreground/60" />
            </div>

            <div class="cs-field-group">
              <label class="cs-field">
                <span>Command</span>
                <div class="cs-trigger-input">
                  <span class="cs-trigger-input__prefix">/</span>
                  <input
                    bind:value={activeCommand.command}
                    oninput={(e) =>
                      (activeCommand.command = normalizeCommand(
                        e.currentTarget.value,
                      ))}
                    placeholder="start"
                  />
                </div>
              </label>
              <label class="cs-field">
                <span>Description <em>(optional)</em></span>
                <input
                  bind:value={activeCommand.description}
                  placeholder="What does this command do?"
                />
              </label>
              <label class="cs-field-toggle">
                <span>Enable command</span>
                <div
                  class="toggle-wrapper"
                  class:active={activeCommand.enabled}
                >
                  <button
                    type="button"
                    class="toggle-switch"
                    role="switch"
                    aria-checked={activeCommand.enabled}
                    onclick={() =>
                      (activeCommand.enabled = !activeCommand.enabled)}
                  >
                    <span class="toggle-knob"></span>
                  </button>
                </div>
              </label>
            </div>

            {#if selectedNode === "action" || selectedNode === "branch" || selectedNode === "trigger"}
              <div class="cs-divider"></div>
              <div class="cs-field-group">
                <span class="cs-section-label">Action Configuration</span>
                <label class="cs-field">
                  <span>Action Type</span>
                  <select bind:value={activeCommand.actionType}>
                    <option value="reply">Reply message</option>
                    <option value="http_request"
                      >HTTP Request (External API)</option
                    >
                    <option value="vtu_airtime">VTU airtime</option>
                    <option value="vtu_data">VTU data</option>
                    <option value="ai">AI processing</option>
                  </select>
                </label>
                {#if activeCommand.actionType === "http_request"}
                  <label class="cs-field">
                    <span>Method</span>
                    <select bind:value={activeCommand.actionConfig.method}>
                      <option value="GET">GET</option><option value="POST"
                        >POST</option
                      ><option value="PUT">PUT</option><option value="DELETE"
                        >DELETE</option
                      >
                    </select>
                  </label>
                  <label class="cs-field">
                    <span>Endpoint URL</span>
                    <input
                      type="url"
                      bind:value={activeCommand.actionConfig.url}
                      placeholder="https://api.example.com/endpoint"
                    />
                  </label>
                  <label class="cs-field">
                    <span>Headers (JSON)</span>
                    <textarea
                      bind:value={activeCommand.actionConfig.headers}
                      rows="2"
                      placeholder="&#123;&quot;Authorization&quot;: &quot;Bearer token&quot;&#125;"
                    ></textarea>
                  </label>
                  {#if ["POST", "PUT"].includes(activeCommand.actionConfig.method ?? "POST")}
                    <label class="cs-field">
                      <span>Body Payload (JSON)</span>
                      <textarea
                        bind:value={activeCommand.actionConfig.body}
                        rows="3"
                        placeholder="&#123;&quot;user&quot;: &quot;&#123;&#123;user_id&#125;&#125;&quot;&#125;"
                      ></textarea>
                      <small class="cs-hint"
                        >Use &#123;&#123;variable&#125;&#125; to inject data.</small
                      >
                    </label>
                  {/if}
                {/if}
              </div>
            {/if}

            {#if selectedNode === "ai"}
              <div class="cs-divider"></div>
              <div class="cs-field-group">
                <span class="cs-section-label">AI Processing</span>
                <label class="cs-field">
                  <span>Select AI Model</span>
                  <select bind:value={activeCommand.aiConnector}>
                    <option value="None">None</option>
                    <option value="BizzyAI">Bizzy AI (Default)</option>
                    <option value="OpenAI">OpenAI GPT-4o</option>
                  </select>
                </label>
                {#if activeCommand.aiConnector !== "None"}
                  <label class="cs-field">
                    <span>System Prompt</span>
                    <textarea
                      rows="4"
                      placeholder="You are a helpful assistant..."
                    ></textarea>
                  </label>
                {/if}
              </div>
            {/if}

            <div class="cs-divider"></div>
            <div class="cs-field-group">
              <span class="cs-section-label">Response Template</span>
              <label class="cs-field">
                <span>Message text</span>
                <textarea
                  bind:value={activeCommand.response}
                  rows="4"
                  placeholder="Hello! Welcome to our bot."
                ></textarea>
                <small class="cs-hint"
                  >Supports Markdown and variables e.g.,
                  &#123;&#123;name&#125;&#125;.</small
                >
              </label>
            </div>

            <div class="cs-inspector__footer">
              <span class="cs-inspector__bot-name"
                >@{setup?.botUsername || "your_bot"}</span
              >
              <button
                class="cs-btn cs-btn--danger"
                onclick={() => removeActiveCommand()}
              >
                <Trash2 class="size-3.5" /> Delete
              </button>
            </div>
          {:else if studioPanel === "test"}
            <div class="cs-inspector__header">
              <div>
                <span class="cs-section-label">🧪 Test execution</span>
                <h3 class="cs-inspector__title">Run simulator</h3>
              </div>
            </div>
            <div class="cs-field-group">
              <label class="cs-field">
                <span>Message Input</span>
                <textarea
                  bind:value={testInput}
                  rows="2"
                  placeholder="e.g. /status 12345"
                ></textarea>
              </label>
              <button
                class="cs-save-btn w-full justify-center mt-2"
                onclick={runCommandPreview}
                disabled={testRunning}
              >
                {#if testRunning}
                  <RefreshCw class="size-4 animate-spin" /> Running...
                {:else}
                  <Play class="size-4" /> Run Test
                {/if}
              </button>
            </div>
            <div class="cs-divider"></div>
            <div class="cs-field-group">
              <span class="cs-section-label">Execution Result</span>
              <pre class="cs-code-block">{testOutput}</pre>
            </div>
          {:else if studioPanel === "resources"}
            <div class="cs-inspector__header">
              <div>
                <span class="cs-section-label">🌐 Connections</span>
                <h3 class="cs-inspector__title">External Resources</h3>
              </div>
            </div>
            <div class="cs-resource-panel">
              {#if !resourceConnected}
                <div class="cs-resource-empty">
                  <Database class="size-8 text-muted-foreground/50 mb-3" />
                  <p class="text-sm font-medium mb-1">No database connected</p>
                  <p class="text-xs text-muted-foreground mb-4">
                    Connect to your existing API, database, or VTU provider to
                    dynamically process this command.
                  </p>
                  <button
                    class="cs-save-btn w-full justify-center"
                    onclick={connectExternalResource}
                  >
                    <Link2 class="size-4" /> Connect API
                  </button>
                </div>
              {:else}
                <div class="cs-resource-active">
                  <div class="cs-resource-active__header">
                    <CheckCircle2 class="size-5 text-green-500" />
                    <div>
                      <h4 class="text-sm font-bold">API Connected</h4>
                      <p class="text-xs text-muted-foreground">
                        HTTP request active
                      </p>
                    </div>
                  </div>
                  <div class="cs-field-group mt-4">
                    <label class="cs-field">
                      <span>Mapped Endpoint</span>
                      <input
                        type="text"
                        value={activeCommand?.actionConfig?.url || ""}
                        readonly
                        class="bg-muted opacity-70"
                      />
                    </label>
                    <button
                      class="cs-btn w-full justify-center mt-2"
                      onclick={() => (resourceConnected = false)}
                      >Disconnect</button
                    >
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Collapse Toggle Right -->
        <button
          class="cs-sidebar__toggle cs-sidebar__toggle--right"
          onclick={() => (rightSidebarCollapsed = !rightSidebarCollapsed)}
          title="Toggle Sidebar"
        >
          {#if rightSidebarCollapsed}
            <ChevronLeft class="size-3.5" />
          {:else}
            <ChevronRight class="size-3.5" />
          {/if}
        </button>
      </aside>
    {/if}
  </div>
</section>

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
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
    border-radius: 0.85rem;
    background: var(--card);
    text-align: left;
    transition:
      border-color 150ms ease,
      box-shadow 150ms ease,
      transform 150ms ease;
  }
  .project-card:hover,
  .project-card.active {
    border-color: color-mix(in srgb, var(--primary) 55%, var(--border));
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 12%, transparent);
    transform: translateY(-1px);
  }
  .project-card:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
  .project-card-preview {
    display: grid;
    height: 150px;
    place-items: center;
    background: linear-gradient(
      135deg,
      var(--muted),
      color-mix(in srgb, var(--primary) 8%, transparent)
    );
  }
  .project-card-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 99px;
    background: var(--card);
    border: 1px solid var(--border);
    color: var(--foreground);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
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

  /* Keep the editor readable at desktop widths and usable on smaller screens. */
  .cs-topbar {
    min-height: 68px;
    padding-inline: 1.25rem;
  }

  .cs-topbar__left,
  .cs-topbar__right {
    width: auto;
    min-width: 0;
  }

  .cs-topbar__left {
    flex: 1 1 0;
  }

  .cs-topbar__right {
    flex: 1 1 0;
    gap: 0.65rem;
  }

  .cs-sidebar--left {
    width: 300px;
  }

  .cs-sidebar--right {
    width: 380px;
  }

  .cs-sidebar__inner {
    width: 100%;
    min-width: 0;
    padding: 1.25rem;
  }

  .cs-sidebar--right .cs-sidebar__inner {
    min-width: 0;
  }

  .cs-canvas {
    min-width: 0;
    background-color: color-mix(in srgb, var(--muted) 28%, var(--background));
  }

  .bottom-panel {
    bottom: 1.25rem;
    max-width: calc(100% - 2rem);
    overflow-x: auto;
  }

  .cs-palette {
    flex-wrap: nowrap;
    white-space: nowrap;
  }

  @media (max-width: 1100px) {
    .cs-sidebar--right {
      width: 340px;
    }

    .cs-topbar__center {
      display: none;
    }
  }

  @media (max-width: 820px) {
    .cs-topbar {
      gap: 0.75rem;
      padding-inline: 0.75rem;
    }

    .cs-topbar__right .cs-status {
      display: none;
    }

    .cs-sidebar--left {
      width: 240px;
    }

    .cs-sidebar--right {
      position: absolute;
      inset: 0 0 0 auto;
      width: min(360px, calc(100vw - 3rem));
      box-shadow: -12px 0 30px
        color-mix(in srgb, var(--foreground) 12%, transparent);
    }

    .cs-sidebar--right.collapsed {
      width: 0;
    }

    .cs-canvas__badge {
      top: 0.75rem;
      left: 0.75rem;
    }

    .cs-palette__btn {
      padding: 0.55rem 0.75rem;
      font-size: 0.72rem;
    }
  }

  @media (max-width: 560px) {
    .cs-topbar__title {
      max-width: 10rem;
    }

    .cs-sidebar--left {
      width: 210px;
    }

    .cs-save-btn {
      padding-inline: 0.65rem;
    }

    .cs-save-btn :global(svg) {
      display: none;
    }
  }

  /* Premium Rigid Layout UI (n8n/Figma style) */
  .cs {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    z-index: 9999; /* Max z-index to break completely out */
    display: flex;
    flex-direction: column;
    background-color: var(--background);
    overflow: hidden;
  }

  .cs-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px; /* Premium slightly taller header */
    padding: 0 24px;
    background-color: var(--card);
    border-bottom: 1px solid var(--border);
    z-index: 20;
    flex-shrink: 0;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  }

  .cs-topbar__left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    justify-content: flex-start;
  }

  .cs-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--muted-foreground);
    transition: all 0.2s ease;
  }

  .cs-icon-btn:hover {
    background: var(--muted);
    color: var(--foreground);
  }

  .cs-topbar__title-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .cs-topbar__eyebrow {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted-foreground);
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
  }

  .cs-topbar__title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--foreground);
    margin: 0;
    line-height: 1.2;
  }

  .cs-topbar__center {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .cs-inspector-tabs {
    display: flex;
    align-items: center;
    background: var(--muted);
    padding: 4px;
    border-radius: 8px;
    gap: 4px;
  }

  .cs-inspector-tabs button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--muted-foreground);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cs-inspector-tabs button[aria-selected="true"] {
    background: var(--background);
    color: var(--foreground);
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  }

  .cs-topbar__right {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
    justify-content: flex-end;
  }

  .cs-save-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 20px;
    border-radius: 8px;
    background: var(--primary);
    color: var(--primary-foreground);
    font-weight: 600;
    font-size: 0.85rem;
    border: none;
    cursor: pointer;
    transition: filter 0.2s;
    box-shadow: 0 2px 4px rgb(0 0 0 / 0.05);
  }

  .cs-save-btn:hover {
    filter: brightness(1.1);
  }

  .cs-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--muted-foreground);
  }

  .cs-status__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f59e0b;
  }

  .cs-status--live .cs-status__dot {
    background: #10b981;
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
  }

  .cs-body {
    display: flex;
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .cs-sidebar {
    position: relative;
    height: 100%;
    background-color: var(--card);
    transition: width 0.3s cubic-bezier(0.2, 0, 0, 1);
    z-index: 10;
    display: flex;
  }

  .cs-sidebar--left {
    width: 340px;
    border-right: 1px solid var(--border);
  }

  .cs-sidebar--left.collapsed {
    width: 0;
    border-right: none;
  }

  .cs-sidebar--right {
    width: 400px;
    border-left: 1px solid var(--border);
  }

  .cs-sidebar--right.collapsed {
    width: 0;
    border-left: none;
  }

  .cs-sidebar__inner {
    width: inherit;
    min-width: 320px; /* Prevent squishing during animation */
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    opacity: 1;
    padding: 24px;
    transition: opacity 0.2s;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .cs-sidebar.collapsed .cs-sidebar__inner {
    opacity: 0;
    pointer-events: none;
  }

  .cs-sidebar--right .cs-sidebar__inner {
    min-width: 360px;
  }

  .cs-sidebar__toggle {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 56px;
    background: var(--card);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 15;
    color: var(--muted-foreground);
    border-radius: 6px;
    transition:
      background 0.2s,
      color 0.2s;
  }

  .cs-sidebar__toggle:hover {
    background: var(--muted);
    color: var(--foreground);
  }

  .cs-sidebar__toggle--left {
    right: -21px;
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .cs-sidebar__toggle--right {
    left: -21px;
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .cs-library__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cs-section-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
    color: var(--muted-foreground);
  }

  .cs-library__filters {
    display: flex;
    background: var(--muted);
    border-radius: 8px;
    padding: 4px;
    margin-bottom: 8px;
  }

  .cs-library__filters button {
    flex: 1;
    padding: 6px 0;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted-foreground);
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
  }

  .cs-library__filters button[aria-selected="true"] {
    background: var(--background);
    color: var(--foreground);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.1);
  }

  .cs-library__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .cs-cmd-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
  }

  .cs-cmd-item:hover {
    border-color: color-mix(in srgb, var(--primary) 40%, transparent);
    background: color-mix(in srgb, var(--primary) 2%, transparent);
  }

  .cs-cmd-item--active {
    border-color: var(--primary);
    background: color-mix(in srgb, var(--primary) 5%, transparent);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--primary) 8%, transparent);
  }

  .cs-cmd-item__slash {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: color-mix(in srgb, var(--primary) 10%, transparent);
    color: var(--primary);
    border-radius: 8px;
    font-weight: 700;
    font-size: 1.1rem;
    font-family: var(--font-mono, monospace);
  }

  .cs-cmd-item__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .cs-cmd-item__body strong {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--foreground);
  }

  .cs-cmd-item__body small {
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }

  .cs-cmd-item__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--muted-foreground);
    opacity: 0.5;
  }

  .cs-cmd-item__dot--live {
    background: #10b981;
    opacity: 1;
  }

  .cs-inspector__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .cs-inspector__title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 4px;
  }

  .cs-field-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .cs-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cs-field > span {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--foreground);
  }

  .cs-field input,
  .cs-field select,
  .cs-field textarea {
    width: 100%;
    padding: 10px 12px;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.9rem;
    color: var(--foreground);
    transition: border-color 0.2s;
  }

  .cs-field input:focus,
  .cs-field select:focus,
  .cs-field textarea:focus {
    outline: none;
    border-color: var(--primary);
  }

  .cs-trigger-input {
    position: relative;
    display: flex;
    align-items: center;
  }

  .cs-trigger-input__prefix {
    position: absolute;
    left: 12px;
    color: var(--muted-foreground);
    font-family: var(--font-mono, monospace);
    font-weight: 700;
  }

  .cs-trigger-input input {
    padding-left: 28px;
    font-family: var(--font-mono, monospace);
  }

  .cs-field-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 8px;
  }

  .cs-field-toggle span {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .toggle-wrapper {
    width: 44px;
    height: 24px;
    background: var(--muted);
    border-radius: 99px;
    position: relative;
    transition: background 0.2s;
  }

  .toggle-wrapper.active {
    background: #10b981;
  }

  .toggle-switch {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
  }

  .toggle-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    pointer-events: none;
  }

  .toggle-wrapper.active .toggle-knob {
    transform: translateX(20px);
  }

  .cs-divider {
    height: 1px;
    background: var(--border);
    margin: 4px 0;
  }

  .cs-inspector__footer {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;
  }

  .cs-inspector__bot-name {
    font-size: 0.85rem;
    color: var(--muted-foreground);
    font-family: var(--font-mono, monospace);
  }

  .cs-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid var(--border);
    background: var(--background);
    color: var(--foreground);
    cursor: pointer;
    transition: all 0.2s;
  }

  .cs-btn:hover {
    background: var(--muted);
  }

  .cs-btn--danger {
    color: #ef4444;
    border-color: color-mix(in srgb, #ef4444 20%, transparent);
    background: color-mix(in srgb, #ef4444 5%, transparent);
  }

  .cs-btn--danger:hover {
    background: color-mix(in srgb, #ef4444 15%, transparent);
  }

  .cs-canvas {
    flex: 1;
    position: relative;
    background-color: var(--background);
    overflow: hidden;
  }

  .cs-canvas__badge {
    position: absolute;
    top: 24px;
    left: 24px;
    background: var(--card);
    padding: 8px 16px;
    border-radius: 99px;
    border: 1px solid var(--border);
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.05);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 5;
  }

  .cs-canvas__badge code {
    font-size: 0.95rem;
    font-family: var(--font-mono, monospace);
    font-weight: 700;
  }

  .cs-canvas__badge-status {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted-foreground);
  }

  .cs-canvas__badge-status.live {
    color: #10b981;
  }

  .cs-canvas__empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: var(--muted-foreground);
    text-align: center;
  }

  .bottom-panel {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    z-index: 5;
    pointer-events: none; /* Let clicks pass through the wrapper */
  }

  .cs-palette {
    display: flex;
    gap: 12px;
    pointer-events: auto; /* Re-enable clicks on buttons */
  }

  .cs-palette__btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 99px;
    background: transparent;
    border: none;
    color: var(--foreground);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cs-palette__btn:hover {
    background: var(--muted);
  }

  .cs-palette__btn--ai {
    background: color-mix(in srgb, #a855f7 10%, transparent);
    color: #9333ea;
  }

  .cs-palette__btn--ai:hover {
    background: color-mix(in srgb, #a855f7 20%, transparent);
  }

  /* Final editor layout overrides. Keep these after the legacy base rules above. */
  .cs-topbar {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) auto minmax(220px, 1fr);
    align-items: center;
    gap: 1rem;
    min-height: 68px;
    padding: 0.75rem 1.25rem;
    box-sizing: border-box;
  }

  .cs-topbar__left,
  .cs-topbar__right {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .cs-topbar__left {
    justify-content: flex-start;
    gap: 0.75rem;
  }

  .cs-topbar__right {
    justify-content: flex-end;
    gap: 0.65rem;
    white-space: nowrap;
  }

  .cs-topbar__center {
    min-width: max-content;
  }

  .cs-topbar__title-wrapper {
    min-width: 0;
  }

  .cs-sidebar--left {
    width: 300px;
  }

  .cs-sidebar--right {
    width: 380px;
  }

  .cs-sidebar__inner,
  .cs-sidebar--right .cs-sidebar__inner {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .cs-canvas {
    min-width: 0;
    background-color: color-mix(in srgb, var(--muted) 28%, var(--background));
  }

  .bottom-panel {
    left: 50%;
    bottom: 1.5rem;
    width: max-content;
    max-width: calc(100% - 3rem);
    box-sizing: border-box;
    padding: 0.35rem;
    border: 1px solid color-mix(in srgb, var(--border) 85%, transparent);
    border-radius: 0.85rem;
    background: color-mix(in srgb, var(--card) 94%, transparent);
    box-shadow: 0 12px 30px
      color-mix(in srgb, var(--foreground) 14%, transparent);
    overflow-x: auto;
    scrollbar-width: thin;
  }

  .cs-palette {
    gap: 0.2rem;
    flex-wrap: nowrap;
    white-space: nowrap;
  }

  .cs-palette__btn {
    flex: 0 0 auto;
    min-height: 2.5rem;
    padding: 0.6rem 0.8rem;
    border-radius: 0.6rem;
  }

  @media (max-width: 1100px) {
    .cs-sidebar--right {
      width: 340px;
    }

    .cs-topbar__center {
      display: none;
    }
  }

  @media (max-width: 820px) {
    .cs-topbar {
      gap: 0.75rem;
      padding-inline: 0.75rem;
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .cs-topbar__center {
      display: none;
    }

    .cs-topbar__right .cs-status {
      display: none;
    }

    .cs-sidebar--left {
      width: 240px;
    }

    .cs-sidebar--right {
      position: absolute;
      inset: 0 0 0 auto;
      width: min(360px, calc(100vw - 3rem));
      box-shadow: -12px 0 30px
        color-mix(in srgb, var(--foreground) 12%, transparent);
    }

    .cs-sidebar--right.collapsed {
      width: 0;
    }

    .cs-canvas__badge {
      top: 0.75rem;
      left: 0.75rem;
    }

    .cs-palette__btn {
      padding: 0.55rem 0.75rem;
      font-size: 0.72rem;
    }

    .bottom-panel {
      bottom: 1rem;
      max-width: calc(100% - 1.5rem);
    }
  }

  @media (max-width: 560px) {
    .cs-topbar__title {
      max-width: 10rem;
    }

    .cs-sidebar--left {
      width: 210px;
    }

    .cs-save-btn {
      padding-inline: 0.65rem;
    }

    .cs-save-btn :global(svg) {
      display: none;
    }
  }
</style>
