<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/auth";
  import { extensions } from "$lib/stores/extensions";
  import { toast } from "svelte-sonner";
  import AutomationBuilder from "$lib/components/builder/automation/AutomationBuilder.svelte";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";
  import {
    Activity,
    ArrowLeft,
    Bot,
    Braces,
    Check,
    ChevronDown,
    ChevronLeft,
    Circle,
    Clock,
    Code2,
    Database,
    FileText,
    GitBranch,
    Globe2,
    Image,
    LayoutGrid,
    Link2,
    MessageSquare,
    Pencil,
    Plus,
    Radio,
    RefreshCw,
    Search,
    Send,
    Settings2,
    Share2,
    Sparkles,
    Terminal,
    Trash2,
    Tv,
    Upload,
    X,
    Zap,
    Play,
    Bell,
    ChevronRight,
    Layers,
    PanelLeftClose,
    PanelLeftOpen,
    PanelRightClose,
    PanelRightOpen,
    ToggleLeft,
  } from "@lucide/svelte";

  // ─── Types ──────────────────────────────────────────────────────────────────
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

  type TelegramSetup = {
    id: string;
    botName?: string;
    botUsername?: string;
    capabilities?: { commandMappings?: CommandMapping[] };
  };

  type AutomationProject = {
    id: string;
    extension: string;
    name: string;
    detail: string;
    botId?: string;
  };

  type InspectorTab = "general" | "node" | "command" | "response" | "advanced";
  type LeftView =
    | "studio"
    | "commands"
    | "bot-settings"
    | "analytics"
    | "templates"
    | "integrations";

  // ─── Extension config driven by ?extension= param ───────────────────────────
  const extensionKey = $derived(
    page.url.searchParams.get("extension") ?? "telegram",
  );
  const requestedBotId = $derived(page.url.searchParams.get("botId"));
  const requestedCommand = $derived(page.url.searchParams.get("command"));

  const EXTENSION_CONFIGS: Record<
    string,
    {
      name: string;
      label: string;
      eyebrow: string;
      color: string;
      backHref: string;
      nodeGroups: {
        title: string;
        color: string;
        nodes: {
          label: string;
          desc: string;
          iconType: string;
          nodeType: string;
          actionType?: CommandMapping["actionType"];
        }[];
      }[];
    }
  > = {
    telegram: {
      name: "Telegram",
      label: "Telegram Bot",
      eyebrow: "Telegram automation",
      color: "var(--primary)",
      backHref: "/extensions/telegram/commands",
      nodeGroups: [
        {
          title: "Telegram actions",
          color: "var(--primary)",
          nodes: [
            {
              label: "Telegram Trigger",
              desc: "When a user sends a message",
              iconType: "trigger",
              nodeType: "trigger",
            },
            {
              label: "Buy Airtime",
              desc: "Use the connected VTU function",
              iconType: "airtime",
              nodeType: "action",
              actionType: "vtu_airtime",
            },
            {
              label: "Buy Data",
              desc: "Fulfil a data bundle request",
              iconType: "data",
              nodeType: "action",
              actionType: "vtu_data",
            },
            {
              label: "Sell PIN",
              desc: "Deliver a voucher or exam PIN",
              iconType: "pin",
              nodeType: "action",
              actionType: "vtu_pin",
            },
            {
              label: "Request Status",
              desc: "Check a customer transaction",
              iconType: "status",
              nodeType: "action",
              actionType: "vtu_status",
            },
            {
              label: "Send Message",
              desc: "Reply through Telegram",
              iconType: "send",
              nodeType: "action",
              actionType: "reply",
            },
          ],
        },
        {
          title: "Logic & Flow",
          color: "var(--chart-2, var(--primary))",
          nodes: [
            {
              label: "IF Condition",
              desc: "Branch based on conditions",
              iconType: "branch",
              nodeType: "condition",
            },
            {
              label: "Switch",
              desc: "Multiple condition branches",
              iconType: "switch",
              nodeType: "condition",
            },
            {
              label: "Delay",
              desc: "Wait for a period of time",
              iconType: "clock",
              nodeType: "action",
            },
            {
              label: "Merge",
              desc: "Combine multiple inputs",
              iconType: "merge",
              nodeType: "action",
            },
          ],
        },
        {
          title: "Custom nodes",
          color: "var(--chart-3, var(--primary))",
          nodes: [
            {
              label: "Set",
              desc: "Set variable or value",
              iconType: "set",
              nodeType: "action",
            },
            {
              label: "Get Data",
              desc: "Retrieve from database",
              iconType: "database",
              nodeType: "action",
            },
            {
              label: "HTTP Request",
              desc: "Call external API",
              iconType: "globe",
              nodeType: "action",
            },
            {
              label: "Send Photo",
              desc: "Send custom Telegram media",
              iconType: "image",
              nodeType: "action",
              actionType: "reply",
            },
            {
              label: "Send Document",
              desc: "Send a custom Telegram file",
              iconType: "file",
              nodeType: "action",
              actionType: "reply",
            },
          ],
        },
      ],
    },
    whatsapp: {
      name: "WhatsApp",
      label: "WhatsApp Business",
      eyebrow: "WhatsApp automation",
      color: "var(--primary)",
      backHref: "/extensions/whatsapp",
      nodeGroups: [
        {
          title: "WhatsApp Bot",
          color: "var(--primary)",
          nodes: [
            {
              label: "Message Trigger",
              desc: "When a user sends a message",
              iconType: "trigger",
              nodeType: "trigger",
            },
            {
              label: "Send Message",
              desc: "Send text to user",
              iconType: "send",
              nodeType: "action",
            },
            {
              label: "Send Template",
              desc: "Send a template message",
              iconType: "file",
              nodeType: "action",
            },
            {
              label: "Send Media",
              desc: "Send image or document",
              iconType: "image",
              nodeType: "action",
            },
          ],
        },
        {
          title: "Logic & Flow",
          color: "var(--chart-2, var(--primary))",
          nodes: [
            {
              label: "IF Condition",
              desc: "Branch based on conditions",
              iconType: "branch",
              nodeType: "condition",
            },
            {
              label: "Delay",
              desc: "Wait for a period of time",
              iconType: "clock",
              nodeType: "action",
            },
          ],
        },
        {
          title: "Data & Storage",
          color: "var(--chart-3, var(--primary))",
          nodes: [
            {
              label: "Set",
              desc: "Set variable or value",
              iconType: "set",
              nodeType: "action",
            },
            {
              label: "HTTP Request",
              desc: "Call external API",
              iconType: "globe",
              nodeType: "action",
            },
          ],
        },
      ],
    },
  };

  const extConfig = $derived(
    EXTENSION_CONFIGS[extensionKey] ?? EXTENSION_CONFIGS.telegram,
  );

  // ─── State ───────────────────────────────────────────────────────────────────
  const api =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";
  let loading = $state(false);
  let saving = $state(false);
  let commandRows = $state<CommandMapping[]>([]);
  let activeCommandIndex = $state(0);
  let commandFilter = $state<"all" | "enabled" | "disabled">("all");
  let search = $state("");
  let inspectorTab = $state<InspectorTab>("general");
  let leftView = $state<LeftView>("studio");
  let catalogOpen = $state(false);
  let inspectorOpen = $state(false);
  let minimapOpen = $state(true);
  let selectedNode = $state<any | null>(null);
  let triggerPickerOpen = $state(false);
  let nodesCatalogOpen = $state<Record<string, boolean>>({
    "Telegram actions": true,
    "Logic & Flow": true,
    "Custom nodes": true,
    "Data & Storage": true,
    "WhatsApp Bot": true,
  });
  let nodeSearch = $state("");
  let workflowName = $state("New automation");
  let workflowSaved = $state(true);
  let selectedBot = $state<TelegramSetup | null>(null);
  let projectMenuOpen = $state(false);
  let telegramBots = $state<TelegramSetup[]>([]);
  let showProjectContext = $state(false);

  let automationProjects = $derived.by<AutomationProject[]>(() => {
    const telegramProjects = telegramBots.map((bot) => ({
      id: `telegram:${bot.id}`,
      extension: "telegram",
      name: bot.botName ?? "Telegram bot",
      detail: bot.botUsername ? `@${bot.botUsername}` : "Telegram",
      botId: bot.id,
    }));
    const channelProjects = $extensions
      .filter(
        (extension) =>
          ["WHATSAPP_BUSINESS", "WHATSAPP_CUSTOMERS", "SMS", "USSD"].includes(
            extension.id,
          ) &&
          (extension.connected ||
            extension.status === "active" ||
            extension.subscribed),
      )
      .map((extension) => ({
        id: `extension:${extension.id}`,
        extension: "whatsapp",
        name: extension.name,
        detail: "Bizflow channel",
      }));
    return [...telegramProjects, ...channelProjects];
  });

  let currentProject = $derived(
    automationProjects.find(
      (project) =>
        project.extension === extensionKey &&
        (project.botId
          ? project.botId === (requestedBotId ?? selectedBot?.id)
          : true),
    ) ?? null,
  );

  let activeCommand = $derived(commandRows[activeCommandIndex] ?? null);
  let filteredCommands = $derived(
    commandRows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => {
        const matchesFilter =
          commandFilter === "all" ||
          (commandFilter === "enabled" ? row.enabled : !row.enabled);
        const q = search.trim().toLowerCase();
        return (
          matchesFilter &&
          (!q ||
            `${row.command} ${row.description} ${row.action}`
              .toLowerCase()
              .includes(q))
        );
      }),
  );

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  function ensureGraph(cmd: CommandMapping) {
    if (cmd.nodes && cmd.edges) return;
    cmd.nodes = [
      {
        id: "trigger",
        type: "trigger",
        position: { x: 180, y: 220 },
        data: {
          label: `${extConfig.name} Trigger`,
          description: `${cmd.command} command`,
          iconType: "trigger",
          outputs: 1,
        },
      },
    ];
    cmd.edges = [];
  }

  $effect(() => {
    if (activeCommand) ensureGraph(activeCommand);
  });

  async function request(path: string, init: RequestInit = {}) {
    const res = await fetch(`${api}${path}`, {
      credentials: "include",
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${$authStore.accessToken}`,
        ...(init.headers ?? {}),
      },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok)
      throw new Error(data?.message ?? `Request failed (${res.status})`);
    return data;
  }

  async function load() {
    loading = true;
    try {
      try {
        const projectPayload = (await request(
          "/integrations/telegram/setup",
        )) as {
          bots: TelegramSetup[];
        };
        telegramBots = projectPayload.bots ?? [];
      } catch {
        telegramBots = [];
      }
      if (extensionKey === "telegram") {
        const payload = { bots: telegramBots };
        const bot =
          payload.bots?.find((candidate) => candidate.id === requestedBotId) ??
          payload.bots?.[0] ??
          null;
        selectedBot = bot;
        commandRows = bot?.capabilities?.commandMappings?.length
          ? bot.capabilities.commandMappings.map((r: any) => ({
              ...r,
              actionConfig: r.actionConfig ?? {},
              telegramButton: r.telegramButton,
            }))
          : [];
      } else {
        const stored = localStorage.getItem(
          `bizflow:automations:${extensionKey}`,
        );
        commandRows = stored ? JSON.parse(stored) : [];
      }
      const requestedIndex = requestedCommand
        ? commandRows.findIndex(
            (row) =>
              row.command === requestedCommand ||
              `/${row.command.replace(/^\//, "")}` === requestedCommand,
          )
        : -1;
      activeCommandIndex = requestedIndex;
      if (requestedIndex >= 0) {
        catalogOpen = true;
        inspectorOpen = true;
      }
      workflowName =
        commandRows[activeCommandIndex]?.command ?? "/new-automation";
    } catch {
      commandRows = [];
      activeCommandIndex = -1;
      workflowName = commandRows[0]?.command ?? "/new-automation";
    } finally {
      loading = false;
    }
  }

  function selectProject(project: AutomationProject) {
    projectMenuOpen = false;
    const params = new URLSearchParams();
    params.set("extension", project.extension);
    if (project.botId) params.set("botId", project.botId);
    goto(`/automation-studio?${params.toString()}`);
  }

  function toggleProjectContext() {
    showProjectContext = !showProjectContext;
    localStorage.setItem(
      "bizflow:automation-studio:show-project-context",
      String(showProjectContext),
    );
  }

  async function save() {
    if (saving) return;
    saving = true;
    try {
      if (extensionKey === "telegram") {
        if (!selectedBot)
          throw new Error("Select a Telegram bot before saving.");
        await request(`/integrations/telegram/update/${selectedBot.id}`, {
          method: "POST",
          body: JSON.stringify({
            capabilities: { commandMappings: commandRows },
          }),
        });
      } else {
        localStorage.setItem(
          `bizflow:automations:${extensionKey}`,
          JSON.stringify(commandRows),
        );
      }
      workflowSaved = true;
      toast.success("Workflow saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to save");
    } finally {
      saving = false;
    }
  }

  function addCommand() {
    startAutomation();
  }

  function startAutomation() {
    triggerPickerOpen = true;
  }

  function createAutomation(trigger: "command" | "message") {
    const command = trigger === "command" ? "/new-command" : "/new-message";
    const nextCommand: CommandMapping = {
      command,
      description: "",
      action: "New workflow",
      target: "",
      aiConnector: "None",
      enabled: true,
      telegramButton: { enabled: false },
      response: "",
      actionType: "reply",
      actionConfig: {},
      nodes: [
        {
          id: "trigger",
          type: "trigger",
          position: { x: 180, y: 220 },
          data: {
            label:
              trigger === "command"
                ? `${extConfig.name} Command`
                : `${extConfig.name} Message`,
            description:
              trigger === "command"
                ? "Runs when this command is received"
                : "Runs when a message is received",
            iconType: "trigger",
            triggerType: trigger,
            outputs: 1,
          },
        },
      ],
      edges: [],
    };
    commandRows = [...commandRows, nextCommand];
    activeCommandIndex = commandRows.length - 1;
    workflowName = command;
    selectedNode = nextCommand.nodes?.[0] ?? null;
    inspectorTab = "node";
    catalogOpen = true;
    inspectorOpen = true;
    triggerPickerOpen = false;
    workflowSaved = false;
  }

  function selectCommand(index: number) {
    activeCommandIndex = index;
    workflowName = commandRows[index]?.command ?? "/new-automation";
    selectedNode = null;
    leftView = "studio";
  }

  function selectNode(node: any) {
    selectedNode = node;
    inspectorTab = "node";
    inspectorOpen = true;
  }

  function updateSelectedNode(field: "label" | "description", value: string) {
    if (!selectedNode || !activeCommand?.nodes) return;
    selectedNode.data = { ...selectedNode.data, [field]: value };
    activeCommand.nodes = activeCommand.nodes.map((node) =>
      node.id === selectedNode.id ? selectedNode : node,
    );
    commandRows = [...commandRows];
    workflowSaved = false;
  }

  function updateSelectedNodeConfig(
    field: "method" | "url" | "headers" | "body",
    value: string,
  ) {
    if (!selectedNode || !activeCommand?.nodes) return;
    selectedNode.data = {
      ...selectedNode.data,
      config: { ...(selectedNode.data?.config ?? {}), [field]: value },
    };
    activeCommand.nodes = activeCommand.nodes.map((node) =>
      node.id === selectedNode.id ? selectedNode : node,
    );
    commandRows = [...commandRows];
    workflowSaved = false;
  }

  function updateSelectedNodeActionType(
    value: NonNullable<CommandMapping["actionType"]>,
  ) {
    if (!selectedNode || !activeCommand?.nodes) return;
    selectedNode.data = { ...selectedNode.data, actionType: value };
    activeCommand.nodes = activeCommand.nodes.map((node) =>
      node.id === selectedNode.id ? selectedNode : node,
    );
    commandRows = [...commandRows];
    workflowSaved = false;
  }

  function deleteCommand() {
    if (!activeCommand) return;
    commandRows = commandRows.filter((_, i) => i !== activeCommandIndex);
    activeCommandIndex = Math.max(
      0,
      Math.min(activeCommandIndex, commandRows.length - 1),
    );
  }

  function dropNodeToCanvas(
    nodeType: string,
    nodeLabel: string,
    iconType: string,
    actionType?: CommandMapping["actionType"],
  ) {
    if (!activeCommand) return;
    ensureGraph(activeCommand);
    const id = `${nodeType}-${Date.now()}`;
    const newNode = {
      id,
      type: nodeType,
      position: { x: 200 + Math.random() * 300, y: 150 + Math.random() * 200 },
      data: {
        label: nodeLabel,
        description: "Configure this node",
        iconType,
        outputs: 1,
        actionType,
        config:
          iconType === "globe"
            ? { method: "POST", url: "", headers: "", body: "" }
            : {},
      },
    };
    activeCommand.nodes = [...(activeCommand.nodes ?? []), newNode];
    toast.success(`Added ${nodeLabel} node`);
  }

  function normalizeCommand(v: string) {
    return v.replace(/^\/+/, "");
  }

  // node search
  const filteredNodeGroups = $derived(
    extConfig.nodeGroups
      .map((g) => ({
        ...g,
        nodes: nodeSearch.trim()
          ? g.nodes.filter(
              (n) =>
                n.label.toLowerCase().includes(nodeSearch.toLowerCase()) ||
                n.desc.toLowerCase().includes(nodeSearch.toLowerCase()),
            )
          : g.nodes,
      }))
      .filter((g) => !nodeSearch.trim() || g.nodes.length > 0),
  );

  // nav labels
  const leftNavItems: { id: LeftView; label: string; icon: any }[] = [
    { id: "studio", label: "Automation Studio", icon: Layers },
    { id: "commands", label: "Commands", icon: Terminal },
    { id: "bot-settings", label: "Bot Settings", icon: Settings2 },
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "templates", label: "Templates", icon: LayoutGrid },
    { id: "integrations", label: "Integrations", icon: Link2 },
  ];

  onMount(() => {
    showProjectContext =
      localStorage.getItem("bizflow:automation-studio:show-project-context") ===
      "true";
    void load();
  });
</script>

<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<!--  AUTOMATION STUDIO SHELL                                                   -->
<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<div class="as-root" role="main" aria-label="Automation Studio">
  <!-- ── TOP NAV ─────────────────────────────────────────────────────────────── -->
  <header class="as-topnav">
    <!-- Left group: logo + workspace -->
    <div class="as-topnav__left">
      <a href="/" class="as-logo" aria-label="BizFlow home">
        <img
          class="as-logo__mark"
          src="/automation-studio-logo.svg"
          alt=""
          aria-hidden="true"
        />
        <span class="as-logo__name">Automation Studio</span>
      </a>

      <div class="as-project-selector">
        <button
          class="as-workspace-pill"
          onclick={() => (projectMenuOpen = !projectMenuOpen)}
          aria-haspopup="listbox"
          aria-expanded={projectMenuOpen}
        >
          <div class="as-workspace-icon"><LayoutGrid class="size-3.5" /></div>
          <span>{currentProject?.name ?? "Select a project"}</span>
          <ChevronDown class="size-3.5 text-muted-foreground" />
        </button>
        {#if projectMenuOpen}
          <div
            class="as-project-menu"
            role="listbox"
            aria-label="Automation projects"
          >
            {#if automationProjects.length}
              {#each automationProjects as project}
                <button
                  class="as-project-option"
                  class:active={currentProject?.id === project.id}
                  role="option"
                  aria-selected={currentProject?.id === project.id}
                  onclick={() => selectProject(project)}
                >
                  <span class="as-project-option__icon"
                    ><Bot class="size-3.5" /></span
                  >
                  <span>
                    <strong>{project.name}</strong>
                    <small>{project.detail}</small>
                  </span>
                  {#if currentProject?.id === project.id}<Check
                      class="size-3.5 ml-auto"
                    />{/if}
                </button>
              {/each}
            {:else}
              <div class="as-project-empty">
                Connect a Telegram or WhatsApp bot to create a project.
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <!-- Centre: file name -->
    <div class="as-topnav__centre">
      <div class="as-breadcrumb">
        <Pencil class="size-3.5 text-muted-foreground" />
        <input
          class="as-filename-input"
          bind:value={workflowName}
          oninput={() => (workflowSaved = false)}
          aria-label="Workflow name"
        />
        {#if showProjectContext}
          <span class="as-context-badge"
            >{extConfig.name}{selectedBot?.botUsername
              ? ` · @${selectedBot.botUsername}`
              : ""} · {activeCommand?.command ?? "No command"}</span
          >
        {/if}
        {#if workflowSaved}
          <span class="as-saved-badge"><Check class="size-3" /> Saved</span>
        {/if}
      </div>
    </div>

    <!-- Right group: actions -->
    <div class="as-topnav__right">
      <Bell class="size-4.5 text-muted-foreground cursor-pointer" />

      <button
        class="as-btn as-btn--ghost"
        onclick={() => (inspectorTab = "general")}
        title="Test Workflow"
      >
        <Play class="size-3.5" />
        Test Workflow
      </button>

      <button
        class="as-btn as-btn--outline"
        onclick={() => toast.info("Share coming soon")}
      >
        <Share2 class="size-3.5" />
        Share
      </button>

      <button
        class="as-btn as-btn--primary"
        onclick={() => void save()}
        disabled={saving}
      >
        <Upload class="size-3.5" />
        {saving ? "Publishing…" : "Publish"}
      </button>

      <!-- Avatar -->
      <div class="as-avatar">A</div>
    </div>
  </header>

  <!-- ── BODY (sidebar + nodes + canvas + inspector) ─────────────────────────── -->
  <div class="as-body">
    <!-- ── LEFT NAV RAIL ──────────────────────────────────────────────────────── -->
    <nav class="as-leftnav" aria-label="Studio navigation">
      {#each leftNavItems as item}
        {@const Icon = item.icon}
        <button
          class="as-leftnav__item"
          class:active={leftView === item.id && catalogOpen}
          onclick={() => {
            if (!activeCommand) return;
            if (leftView === item.id) {
              catalogOpen = !catalogOpen;
            } else {
              leftView = item.id;
              catalogOpen = true;
            }
          }}
          title={item.label}
          aria-label={item.label}
          aria-current={leftView === item.id ? "page" : undefined}
        >
          <Icon class="size-5" />
        </button>
      {/each}

      <div class="as-leftnav__spacer"></div>
    </nav>

    <!-- ── NODES CATALOG PANEL ────────────────────────────────────────────────── -->
    {#if catalogOpen}
      {#if leftView === "studio"}
        <aside class="as-catalog" aria-label="Node catalog">
          <!-- Search -->
          <div class="as-catalog__search-wrap">
            <div class="as-catalog__header-row">
              <span class="as-catalog__section-title">Nodes</span>
            </div>
            <div class="as-catalog__search">
              <Search class="size-3.5 text-muted-foreground" />
              <input
                class="as-catalog__search-input"
                bind:value={nodeSearch}
                placeholder="Search nodes..."
                aria-label="Search nodes"
              />
            </div>
          </div>

          <!-- Node groups -->
          <div class="as-catalog__groups">
            {#each filteredNodeGroups as group}
              <div class="as-catalog__group">
                <button
                  class="as-catalog__group-header"
                  onclick={() =>
                    (nodesCatalogOpen[group.title] =
                      !nodesCatalogOpen[group.title])}
                  aria-expanded={nodesCatalogOpen[group.title]}
                >
                  <div
                    class="as-catalog__group-dot"
                    style="background:{group.color}"
                  ></div>
                  <span>{group.title}</span>
                  <ChevronDown
                    class="size-3.5 text-muted-foreground ml-auto transition-transform"
                    style={nodesCatalogOpen[group.title]
                      ? ""
                      : "transform:rotate(-90deg)"}
                  />
                </button>

                {#if nodesCatalogOpen[group.title]}
                  <div class="as-catalog__nodes">
                    {#each group.nodes as n}
                      <button
                        class="as-catalog__node"
                        draggable="true"
                        onclick={() =>
                          dropNodeToCanvas(
                            n.nodeType,
                            n.label,
                            n.iconType,
                            n.actionType,
                          )}
                        title="Click or drag to add"
                        aria-label="Add {n.label} node"
                      >
                        <div
                          class="as-catalog__node-icon"
                          style="background:color-mix(in srgb,{group.color} 20%,transparent); color:{group.color}"
                        >
                          {#if n.iconType === "trigger"}<Zap class="size-3.5" />
                          {:else if n.iconType === "send"}<Send
                              class="size-3.5"
                            />
                          {:else if n.iconType === "edit"}<Pencil
                              class="size-3.5"
                            />
                          {:else if n.iconType === "image"}<Image
                              class="size-3.5"
                            />
                          {:else if n.iconType === "file"}<FileText
                              class="size-3.5"
                            />
                          {:else if n.iconType === "bot"}<Bot
                              class="size-3.5"
                            />
                          {:else if n.iconType === "branch"}<GitBranch
                              class="size-3.5"
                            />
                          {:else if n.iconType === "switch"}<ToggleLeft
                              class="size-3.5"
                            />
                          {:else if n.iconType === "clock"}<Clock
                              class="size-3.5"
                            />
                          {:else if n.iconType === "merge"}<Braces
                              class="size-3.5"
                            />
                          {:else if n.iconType === "set"}<Code2
                              class="size-3.5"
                            />
                          {:else if n.iconType === "database"}<Database
                              class="size-3.5"
                            />
                          {:else if n.iconType === "globe"}<Globe2
                              class="size-3.5"
                            />
                          {:else}<Sparkles class="size-3.5" />{/if}
                        </div>
                        <div class="as-catalog__node-text">
                          <strong>{n.label}</strong>
                          <small>{n.desc}</small>
                        </div>
                      </button>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </aside>
      {:else if leftView === "commands"}
        <!-- Commands list panel -->
        <aside class="as-catalog" aria-label="Commands list">
          <div class="as-catalog__search-wrap">
            <div class="as-catalog__header-row">
              <span class="as-catalog__section-title">Commands</span>
              <button
                class="as-icon-btn"
                onclick={addCommand}
                aria-label="Add command"
                title="New command"
              >
                <Plus class="size-4" />
              </button>
            </div>
            <div class="as-catalog__search">
              <Search class="size-3.5 text-muted-foreground" />
              <input
                class="as-catalog__search-input"
                bind:value={search}
                placeholder="Search commands..."
              />
            </div>
            <div class="as-filter-tabs">
              {#each [{ v: "all", l: "All" }, { v: "enabled", l: "Live" }, { v: "disabled", l: "Draft" }] as f}
                <button
                  class:active={commandFilter === f.v}
                  onclick={() => (commandFilter = f.v as any)}>{f.l}</button
                >
              {/each}
            </div>
          </div>

          <div class="as-command-list">
            {#each filteredCommands as { row, index }}
              <button
                class="as-command-item"
                class:active={activeCommandIndex === index}
                onclick={() => selectCommand(index)}
              >
                <span class="as-command-slash">/</span>
                <div class="as-command-item__text">
                  <strong>{row.command.replace(/^\//, "") || "untitled"}</strong
                  >
                  <small
                    >{row.description || row.action || "No description"}</small
                  >
                </div>
                <span class="as-status-dot" class:live={row.enabled}></span>
              </button>
            {:else}
              <div class="as-empty">
                <MessageSquare class="size-5" />
                <p>No commands found</p>
                <button onclick={addCommand}>Create one</button>
              </div>
            {/each}
          </div>
        </aside>
      {:else}
        <aside
          class="as-catalog as-catalog--placeholder"
          aria-label="{leftView} panel"
        >
          <div class="as-placeholder">
            <Settings2 class="size-8 text-muted-foreground" />
            <p>
              {leftNavItems.find((i) => i.id === leftView)?.label ?? leftView}
            </p>
            {#if leftView === "bot-settings"}
              <label class="as-setting-toggle">
                <span>
                  <strong>Show project context</strong>
                  <small>Show channel, bot, and command in the header</small>
                </span>
                <input
                  type="checkbox"
                  checked={showProjectContext}
                  onchange={toggleProjectContext}
                />
              </label>
            {:else}
              <small>Coming soon</small>
            {/if}
          </div>
        </aside>
      {/if}
    {/if}

    <!-- ── CANVAS ─────────────────────────────────────────────────────────────── -->
    <main class="as-canvas" aria-label="Workflow canvas">
      <div class="as-canvas-atmosphere" aria-hidden="true">
        <div class="as-canvas-glow as-canvas-glow--one"></div>
        <div class="as-canvas-glow as-canvas-glow--two"></div>
        <NoiseOverlay intensity="strong" />
      </div>
      {#if activeCommand && catalogOpen}
        <button
          class="as-sidebar-tab as-sidebar-tab--left"
          class:closed={!catalogOpen}
          onclick={() => (catalogOpen = false)}
          title="Hide left sidebar"
          aria-label="Hide left sidebar"
          aria-expanded="true"
        >
          <ChevronRight class="size-4 rotate-180" />
        </button>
      {:else if activeCommand}
        <button
          class="as-sidebar-tab as-sidebar-tab--left"
          class:closed={!catalogOpen}
          onclick={() => (catalogOpen = true)}
          title="Show left sidebar"
          aria-label="Show left sidebar"
          aria-expanded="false"
        >
          <ChevronRight class="size-4" />
        </button>
      {/if}
      {#if activeCommand && !inspectorOpen}
        <button
          class="as-canvas-toggle as-canvas-toggle--right"
          onclick={() => (inspectorOpen = true)}
          title="Open right sidebar"
          aria-label="Open right sidebar"
        >
          <PanelRightOpen class="size-4" />
        </button>
      {/if}
      {#if activeCommand}<button
          class="as-canvas-toggle as-canvas-toggle--minimap"
          class:active={minimapOpen}
          onclick={() => (minimapOpen = !minimapOpen)}
          title={minimapOpen ? "Hide minimap" : "Show minimap"}
          aria-label={minimapOpen ? "Hide minimap" : "Show minimap"}
          aria-pressed={minimapOpen}
        >
          <span class="as-minimap-icon" aria-hidden="true"></span>
        </button>{/if}
      {#if loading}
        <div class="as-canvas__empty">
          <div class="as-spinner"></div>
          <p>Loading your command flows…</p>
        </div>
      {:else if activeCommand && activeCommand.nodes && activeCommand.edges}
        <AutomationBuilder
          bind:nodes={activeCommand.nodes}
          bind:edges={activeCommand.edges}
          showMiniMap={minimapOpen}
          onNodeClick={selectNode}
        />
      {:else if !activeCommand}
        <div class="as-canvas__empty">
          {#if !triggerPickerOpen}
            <button
              class="as-start-trigger"
              onclick={startAutomation}
              aria-label="Add your first trigger"
            >
              <Plus class="size-5" />
            </button>
            <h2>Start with a trigger</h2>
            <p>Choose what starts this automation.</p>
            <button class="as-btn as-btn--primary" onclick={startAutomation}>
              Add first step
            </button>
          {:else}
            <div
              class="as-trigger-picker"
              role="dialog"
              aria-label="Choose a trigger"
            >
              <div class="as-trigger-picker__heading">
                <div>
                  <span class="as-eyebrow">New automation</span>
                  <h2>What starts this workflow?</h2>
                </div>
                <button
                  class="as-icon-btn"
                  onclick={() => (triggerPickerOpen = false)}
                  aria-label="Close trigger picker"
                  title="Close"><X class="size-4" /></button
                >
              </div>
              <div class="as-trigger-options">
                <button
                  class="as-trigger-option"
                  onclick={() => createAutomation("command")}
                >
                  <span class="as-trigger-option__icon"
                    ><Terminal class="size-5" /></span
                  >
                  <span
                    ><strong>{extConfig.name} command</strong><small
                      >Run when a command such as /start is received</small
                    ></span
                  >
                  <ChevronRight class="size-4" />
                </button>
                <button
                  class="as-trigger-option"
                  onclick={() => createAutomation("message")}
                >
                  <span class="as-trigger-option__icon"
                    ><MessageSquare class="size-5" /></span
                  >
                  <span
                    ><strong>Incoming message</strong><small
                      >Run when a user sends a message</small
                    ></span
                  >
                  <ChevronRight class="size-4" />
                </button>
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <div class="as-canvas__empty">
          <div class="as-spinner"></div>
        </div>
      {/if}
    </main>

    <!-- ── RIGHT PROPERTY INSPECTOR ──────────────────────────────────────────── -->
    {#if activeCommand && inspectorOpen}
      <aside class="as-inspector" aria-label="Property inspector">
        <!-- Inspector header -->
        <div class="as-inspector__header">
          <div class="as-inspector__title-row">
            <div
              class="as-inspector__icon"
              style="background:color-mix(in srgb,{extConfig.color} 15%,transparent)"
            >
              <Bot class="size-4" style="color:{extConfig.color}" />
            </div>
            <div>
              <h3 class="as-inspector__title">
                {selectedNode
                  ? (selectedNode.data?.label ?? "Node")
                  : `${extConfig.name} automation`}
              </h3>
              <p class="as-inspector__subtitle">
                {selectedNode
                  ? "Configure this workflow node"
                  : `Workflow for ${activeCommand.command}`}
              </p>
            </div>
          </div>
          <button
            class="as-icon-btn"
            onclick={() => (inspectorOpen = false)}
            aria-label="Collapse right sidebar"
            title="Collapse right sidebar"
            ><PanelRightClose class="size-4" /></button
          >
        </div>

        <!-- Tabs -->
        <div class="as-inspector__tabs" role="tablist">
          {#if selectedNode}
            <button
              role="tab"
              aria-selected={inspectorTab === "node"}
              class:active={inspectorTab === "node"}
              onclick={() => (inspectorTab = "node")}>Node</button
            >
          {/if}
          {#each [["general", "General"], ["command", "Command"], ["response", "Response"], ["advanced", "Advanced"]] as const as [t, l]}
            <button
              role="tab"
              aria-selected={inspectorTab === t}
              class:active={inspectorTab === t}
              onclick={() => (inspectorTab = t)}>{l}</button
            >
          {/each}
        </div>

        <!-- Tab content -->
        <div class="as-inspector__scroll">
          {#if inspectorTab === "node" && selectedNode}
            <div class="as-field">
              <label class="as-field__label" for="node-label">Node name</label>
              <input
                id="node-label"
                class="as-input"
                value={selectedNode.data?.label ?? ""}
                oninput={(event) =>
                  updateSelectedNode("label", event.currentTarget.value)}
                placeholder="Send Message"
              />
            </div>
            <div class="as-field">
              <label class="as-field__label" for="node-description"
                >Description</label
              >
              <textarea
                id="node-description"
                class="as-textarea"
                rows="4"
                value={selectedNode.data?.description ?? ""}
                oninput={(event) =>
                  updateSelectedNode("description", event.currentTarget.value)}
                placeholder="Describe what this node does"
              ></textarea>
            </div>
            <div class="as-field">
              <label class="as-field__label" for="node-type">Node type</label>
              <input
                id="node-type"
                class="as-input"
                value={selectedNode.type ?? "action"}
                readonly
              />
              <p class="as-field__hint">
                This node runs inside the {activeCommand.command} automation.
              </p>
            </div>
            {#if selectedNode.type === "action"}
              <div class="as-field">
                <label class="as-field__label" for="node-action"
                  >Telegram action</label
                >
                <select
                  id="node-action"
                  class="as-select"
                  value={selectedNode.data?.actionType ?? "reply"}
                  oninput={(event) =>
                    updateSelectedNodeActionType(
                      event.currentTarget.value as NonNullable<
                        CommandMapping["actionType"]
                      >,
                    )}
                >
                  <option value="reply">Send Telegram message</option>
                  <option value="vtu_airtime">Buy airtime</option>
                  <option value="vtu_data">Buy data</option>
                  <option value="vtu_pin">Sell PIN</option>
                  <option value="vtu_status">Request status</option>
                  <option value="http_request">Custom HTTP request</option>
                  <option value="ai">AI processing</option>
                </select>
              </div>
            {/if}
            {#if selectedNode.data?.iconType === "globe" || selectedNode.data?.label === "HTTP Request"}
              <div class="as-node-config-heading">
                <Globe2 class="size-4" />
                <span>HTTP request</span>
              </div>
              <div class="as-field">
                <label class="as-field__label" for="node-method">Method</label>
                <select
                  id="node-method"
                  class="as-select"
                  value={selectedNode.data?.config?.method ?? "POST"}
                  oninput={(event) =>
                    updateSelectedNodeConfig(
                      "method",
                      event.currentTarget.value,
                    )}
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>PATCH</option>
                  <option>DELETE</option>
                </select>
              </div>
              <div class="as-field">
                <label class="as-field__label" for="node-url">Request URL</label
                >
                <input
                  id="node-url"
                  class="as-input"
                  type="url"
                  value={selectedNode.data?.config?.url ?? ""}
                  oninput={(event) =>
                    updateSelectedNodeConfig("url", event.currentTarget.value)}
                  placeholder="https://api.example.com/v1/orders"
                />
              </div>
              <div class="as-field">
                <label class="as-field__label" for="node-headers">Headers</label
                >
                <textarea
                  id="node-headers"
                  class="as-textarea as-code-input"
                  rows="4"
                  value={selectedNode.data?.config?.headers ?? ""}
                  oninput={(event) =>
                    updateSelectedNodeConfig(
                      "headers",
                      event.currentTarget.value,
                    )}
                  placeholder={'{"Authorization":"Bearer {{token}}"}'}
                ></textarea>
              </div>
              <div class="as-field">
                <label class="as-field__label" for="node-body"
                  >Request body</label
                >
                <textarea
                  id="node-body"
                  class="as-textarea as-code-input"
                  rows="5"
                  value={selectedNode.data?.config?.body ?? ""}
                  oninput={(event) =>
                    updateSelectedNodeConfig("body", event.currentTarget.value)}
                  placeholder={'{"user_id":"{{user_id}}","message":"{{text}}"}'}
                ></textarea>
                <p class="as-field__hint">
                  Use variables such as <code
                    >&#123;&#123; user_id &#125;&#125;</code
                  >
                  and <code>&#123;&#123; text &#125;&#125;</code>.
                </p>
              </div>
            {/if}
          {:else if inspectorTab === "general"}
            <!-- Command name -->
            <div class="as-field">
              <div class="as-field__header">
                <label class="as-field__label" for="cmd-name"
                  >Command Name</label
                >
                <span class="as-field__counter">5/32</span>
              </div>
              <div class="as-command-input-wrap">
                <span class="as-command-input-prefix">/</span>
                <input
                  id="cmd-name"
                  class="as-input as-command-input"
                  value={activeCommand.command.replace(/^\//, "")}
                  oninput={(e) => {
                    activeCommand.command = normalizeCommand(
                      e.currentTarget.value,
                    );
                    workflowSaved = false;
                  }}
                  placeholder="start"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="as-field">
              <div class="as-field__header">
                <label class="as-field__label" for="cmd-desc">Description</label
                >
                <span class="as-field__counter"
                  >{(activeCommand.description ?? "").length}/120</span
                >
              </div>
              <textarea
                id="cmd-desc"
                class="as-textarea"
                bind:value={activeCommand.description}
                oninput={() => (workflowSaved = false)}
                rows="3"
                placeholder="Starts the onboarding flow for new users."
              ></textarea>
            </div>

            {#if extensionKey === "telegram"}
              <div class="as-field">
                <div class="as-toggle-row">
                  <div>
                    <span>Show in Telegram keyboard</span>
                    <small class="as-field__hint"
                      >Let users tap this command instead of typing it.</small
                    >
                  </div>
                  <button
                    type="button"
                    class="as-toggle"
                    class:on={activeCommand.telegramButton?.enabled}
                    role="switch"
                    aria-checked={activeCommand.telegramButton?.enabled ??
                      false}
                    aria-label="Show command in Telegram keyboard"
                    onclick={() => {
                      activeCommand.telegramButton = {
                        enabled: !activeCommand.telegramButton?.enabled,
                        label: activeCommand.telegramButton?.label,
                      };
                      workflowSaved = false;
                    }}
                  >
                    <span class="as-toggle__thumb"></span>
                  </button>
                </div>
                {#if activeCommand.telegramButton?.enabled}
                  <input
                    class="as-input"
                    value={activeCommand.telegramButton.label ?? ""}
                    oninput={(event) => {
                      activeCommand.telegramButton = {
                        enabled: true,
                        label: event.currentTarget.value,
                      };
                      workflowSaved = false;
                    }}
                    placeholder={activeCommand.command || "Button label"}
                    aria-label="Telegram button label"
                  />
                {/if}
              </div>
            {/if}

            <!-- Command type -->
            <div class="as-field">
              <label class="as-field__label">Command Type</label>
              <div class="as-radio-group">
                <label
                  class="as-radio-item"
                  class:active={activeCommand.actionType === "reply" ||
                    !activeCommand.actionType}
                >
                  <input
                    type="radio"
                    name="cmd-type"
                    value="reply"
                    bind:group={activeCommand.actionType}
                    class="sr-only"
                  />
                  <div
                    class="as-radio-dot"
                    class:checked={activeCommand.actionType === "reply" ||
                      !activeCommand.actionType}
                  ></div>
                  <div>
                    <strong>Standard Command</strong>
                    <small>Works with a specific command (e.g. /start)</small>
                  </div>
                </label>
                <label
                  class="as-radio-item"
                  class:active={activeCommand.actionType === "ai"}
                >
                  <input
                    type="radio"
                    name="cmd-type"
                    value="ai"
                    bind:group={activeCommand.actionType}
                    class="sr-only"
                  />
                  <div
                    class="as-radio-dot"
                    class:checked={activeCommand.actionType === "ai"}
                  ></div>
                  <div>
                    <strong>Regex Command</strong>
                    <small>Use pattern matching (e.g. /order [d]+)</small>
                  </div>
                </label>
              </div>
            </div>

            <!-- Access control -->
            <div class="as-field">
              <label class="as-field__label">Access Control</label>
              <div class="as-select-wrap">
                <select class="as-select" aria-label="Access control">
                  <option>Everyone</option>
                  <option>Admins only</option>
                  <option>Custom role</option>
                </select>
              </div>
              <p class="as-field__hint">Allow all users to use this command</p>
            </div>

            <!-- Toggles -->
            <div class="as-toggle-row">
              <span>Enable this command</span>
              <button
                class="as-toggle"
                class:on={activeCommand.enabled}
                role="switch"
                aria-checked={activeCommand.enabled}
                onclick={() => {
                  activeCommand.enabled = !activeCommand.enabled;
                  workflowSaved = false;
                }}
              >
                <span class="as-toggle__thumb"></span>
              </button>
            </div>

            <div class="as-toggle-row">
              <span>Send typing action</span>
              <button class="as-toggle" role="switch" aria-checked="false">
                <span class="as-toggle__thumb"></span>
              </button>
            </div>

            <!-- Additional settings collapsible -->
            <button class="as-collapsible-row">
              <X class="size-3.5 text-muted-foreground" />
              <span>Additional Settings</span>
              <ChevronRight class="size-3.5 text-muted-foreground ml-auto" />
            </button>
          {:else if inspectorTab === "command"}
            <div class="as-field">
              <label class="as-field__label" for="cmd-action">Action name</label
              >
              <input
                id="cmd-action"
                class="as-input"
                bind:value={activeCommand.action}
                oninput={() => (workflowSaved = false)}
                placeholder="Welcome flow"
              />
            </div>
            <div class="as-field">
              <label class="as-field__label" for="cmd-action-type"
                >Action type</label
              >
              <div class="as-select-wrap">
                <select
                  id="cmd-action-type"
                  class="as-select"
                  bind:value={activeCommand.actionType}
                  onchange={() => (workflowSaved = false)}
                >
                  <option value="reply">Reply message</option>
                  <option value="http_request">HTTP request</option>
                  <option value="vtu_airtime">VTU airtime</option>
                  <option value="vtu_data">VTU data</option>
                  <option value="ai">AI processing</option>
                </select>
              </div>
            </div>
            {#if activeCommand.actionType === "http_request"}
              <div class="as-field">
                <label class="as-field__label" for="cmd-url">Endpoint URL</label
                >
                <input
                  id="cmd-url"
                  class="as-input"
                  type="url"
                  bind:value={activeCommand.actionConfig.url}
                  placeholder="https://api.example.com/endpoint"
                />
              </div>
            {/if}
          {:else if inspectorTab === "response"}
            <div class="as-field">
              <label class="as-field__label" for="cmd-response"
                >{extConfig.name} response</label
              >
              <textarea
                id="cmd-response"
                class="as-textarea"
                bind:value={activeCommand.response}
                rows="5"
                placeholder="Write the message your customer receives…"
                oninput={() => (workflowSaved = false)}
              ></textarea>
              <p class="as-field__hint">
                Use &#123;&#123; name &#125;&#125; or &#123;&#123; user_id
                &#125;&#125; to insert dynamic values.
              </p>
            </div>
          {:else if inspectorTab === "advanced"}
            <div class="as-field">
              <label class="as-field__label" for="cmd-ai">AI connector</label>
              <div class="as-select-wrap">
                <select
                  id="cmd-ai"
                  class="as-select"
                  bind:value={activeCommand.aiConnector}
                >
                  <option value="None">None</option>
                  <option value="BizzyAI">Bizzy AI</option>
                  <option value="OpenAI">OpenAI</option>
                </select>
              </div>
            </div>
          {/if}

          <!-- Save CTA -->
          <div class="as-inspector__footer">
            <button
              class="as-btn as-btn--primary as-btn--full"
              onclick={() => void save()}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button class="as-delete-btn" onclick={deleteCommand}>
              <Trash2 class="size-3.5" /> Delete command
            </button>
          </div>
        </div>
      </aside>
    {/if}
  </div>
  <!-- /.as-body -->
</div>

<!-- /.as-root -->

<style>
  /* ══════════════════════════════════════════════════════════════════════════ */
  /*  ROOT – full-screen, no scroll on body                                    */
  /* ══════════════════════════════════════════════════════════════════════════ */
  .as-root {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: var(--background);
    color: var(--foreground);
    font-family: var(--sans);
  }

  /* ══════════════════════════════════════════════════════════════════════════ */
  /*  TOP NAV                                                                   */
  /* ══════════════════════════════════════════════════════════════════════════ */
  .as-topnav {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 12px;
    height: 44px;
    border-bottom: 1px solid var(--border);
    background: var(--card);
    flex-shrink: 0;
    z-index: 30;
  }

  .as-topnav__left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .as-topnav__centre {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .as-topnav__right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Logo */
  .as-logo {
    display: flex;
    align-items: center;
    gap: 7px;
    text-decoration: none;
    color: var(--foreground);
  }
  .as-logo__name {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: var(--foreground);
    font-family: var(--heading);
  }
  .as-logo__mark {
    width: 26px;
    height: 26px;
    object-fit: contain;
    flex: 0 0 auto;
    display: block;
  }

  /* Workspace pill */
  .as-workspace-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    background: var(--muted);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    color: var(--foreground);
    cursor: pointer;
    transition: background 0.15s;
  }
  .as-workspace-pill:hover {
    background: color-mix(in srgb, var(--muted) 70%, var(--border));
  }

  .as-project-selector {
    position: relative;
  }

  .as-project-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: 40;
    width: 260px;
    padding: 6px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--card);
  }

  .as-project-option {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 9px;
    width: 100%;
    padding: 8px;
    border: 1px solid transparent;
    border-radius: 7px;
    color: var(--foreground);
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  .as-project-option:hover,
  .as-project-option.active {
    border-color: var(--border);
    background: var(--muted);
  }

  .as-project-option__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 7px;
    color: var(--primary);
    background: color-mix(in srgb, var(--primary) 12%, transparent);
  }

  .as-project-option strong,
  .as-project-option small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .as-project-option strong {
    font-size: 12px;
  }

  .as-project-option small {
    margin-top: 2px;
    color: var(--muted-foreground);
    font-size: 10px;
  }

  .as-project-empty {
    padding: 10px;
    color: var(--muted-foreground);
    font-size: 11px;
    line-height: 1.4;
  }

  .as-workspace-icon {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-foreground);
  }

  /* Breadcrumb / filename */
  .as-breadcrumb {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    color: var(--foreground);
  }
  .as-filename-input {
    background: transparent;
    border: none;
    outline: none;
    font-size: 13px;
    font-weight: 600;
    color: var(--foreground);
    font-family: var(--sans);
    width: 180px;
    padding: 2px 4px;
    border-radius: 4px;
    transition: background 0.15s;
  }
  .as-filename-input:hover,
  .as-filename-input:focus {
    background: var(--muted);
  }

  .as-saved-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    color: var(--primary);
  }

  .as-context-badge {
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 3px 7px;
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--muted-foreground);
    font-size: 10px;
  }

  /* Buttons */
  .as-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .as-btn--ghost {
    background: transparent;
    color: var(--foreground);
  }
  .as-btn--ghost:hover {
    background: var(--muted);
  }

  .as-btn--outline {
    background: transparent;
    color: var(--foreground);
    border: 1px solid var(--border);
  }
  .as-btn--outline:hover {
    background: var(--muted);
  }

  .as-btn--primary {
    background: var(--primary);
    color: var(--primary-foreground);
  }
  .as-btn--primary:hover {
    background: color-mix(in srgb, var(--primary) 85%, var(--foreground));
  }
  .as-btn--primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .as-btn--full {
    width: 100%;
    justify-content: center;
    padding: 10px 12px;
    font-size: 13px;
  }

  /* Avatar */
  .as-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--primary);
    color: var(--primary-foreground);
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  /* Icon button */
  .as-icon-btn {
    width: 30px;
    height: 30px;
    border: none;
    background: transparent;
    color: var(--muted-foreground);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition:
      background 0.15s,
      color 0.15s;
  }
  .as-icon-btn:hover {
    background: var(--muted);
    color: var(--foreground);
  }

  /* ══════════════════════════════════════════════════════════════════════════ */
  /*  BODY LAYOUT                                                               */
  /* ══════════════════════════════════════════════════════════════════════════ */
  .as-body {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    position: relative;
  }

  /* ══════════════════════════════════════════════════════════════════════════ */
  /*  LEFT NAV RAIL (Sleek Icon-Only)                                           */
  /* ══════════════════════════════════════════════════════════════════════════ */
  .as-leftnav {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 48px;
    background: var(--card);
    border-right: 1px solid var(--border);
    padding: 10px 0;
    flex-shrink: 0;
    z-index: 20;
    gap: 8px;
  }

  .as-leftnav__item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 9px;
    color: var(--muted-foreground);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  }

  .as-leftnav__item:hover {
    color: var(--foreground);
    background: var(--muted);
    transform: scale(1.05);
  }

  .as-leftnav__item.active {
    color: var(--primary);
    background: color-mix(in srgb, var(--primary) 12%, transparent);
  }

  .as-leftnav__item.as-sidebar-toggle {
    color: var(--muted-foreground);
    background: transparent;
  }

  .as-leftnav__item.as-sidebar-toggle:hover {
    color: var(--foreground);
    background: var(--muted);
  }

  .as-leftnav__spacer {
    flex: 1;
  }

  .as-sidebar-tab {
    position: absolute;
    top: 50%;
    left: 272px;
    z-index: 25;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 56px;
    transform: translateY(-50%);
    color: var(--muted-foreground);
    background: var(--card);
    border: 1px solid var(--border);
    border-left: 0;
    border-radius: 0 9px 9px 0;
    cursor: pointer;
  }

  .as-sidebar-tab:hover {
    color: var(--foreground);
    background: var(--muted);
  }

  .as-sidebar-tab--left.closed {
    left: 48px;
  }

  /* ══════════════════════════════════════════════════════════════════════════ */
  /*  NODES CATALOG / COMMANDS PANEL                                            */
  /* ══════════════════════════════════════════════════════════════════════════ */
  .as-catalog {
    position: absolute;
    top: 8px;
    bottom: 8px;
    left: 56px;
    width: 216px;
    min-width: 216px;
    background: color-mix(in srgb, var(--card) 90%, transparent);
    border: 1px solid var(--border);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;
    z-index: 10;
  }
  .as-catalog--placeholder {
    align-items: center;
    justify-content: center;
  }
  .as-placeholder {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    padding: 24px;
    color: var(--muted-foreground);
  }
  .as-placeholder__close {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .as-placeholder p {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    color: var(--foreground);
  }
  .as-placeholder small {
    font-size: 12px;
  }

  .as-setting-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    margin-top: 12px;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    text-align: left;
    cursor: pointer;
  }

  .as-setting-toggle span {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 3px;
  }

  .as-setting-toggle strong {
    color: var(--foreground);
    font-size: 11px;
  }

  .as-setting-toggle small {
    color: var(--muted-foreground);
    font-size: 10px;
    line-height: 1.35;
  }

  /* Search wrapper */
  .as-catalog__search-wrap {
    padding: 10px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .as-catalog__header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .as-catalog__section-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--foreground);
  }

  .as-catalog__search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--muted);
    border: 1px solid transparent;
    border-radius: 10px;
    transition: all 0.2s;
  }
  .as-catalog__search:focus-within {
    border-color: var(--ring);
    background: var(--card);
  }
  .as-catalog__search-input {
    background: transparent;
    border: 0;
    outline: none;
    box-shadow: none;
    font-size: 13px;
    color: var(--foreground);
    flex: 1;
    font-family: var(--sans);
  }
  .as-catalog__search-input:focus {
    border: 0;
    outline: none;
    box-shadow: none;
  }
  .as-catalog__search-input::placeholder {
    color: var(--muted-foreground);
  }

  /* Filter tabs (commands panel) */
  .as-filter-tabs {
    display: flex;
    gap: 2px;
    background: var(--muted);
    border-radius: 6px;
    padding: 2px;
  }
  .as-filter-tabs button {
    flex: 1;
    padding: 4px 8px;
    border: none;
    background: transparent;
    font-size: 11px;
    font-weight: 500;
    color: var(--muted-foreground);
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .as-filter-tabs button.active {
    background: var(--card);
    color: var(--foreground);
    font-weight: 600;
  }

  /* Groups */
  .as-catalog__groups {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }
  .as-catalog__group {
    margin-bottom: 2px;
  }
  .as-catalog__group-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    width: 100%;
    background: transparent;
    border: none;
    font-size: 12px;
    font-weight: 700;
    color: var(--foreground);
    cursor: pointer;
    border-radius: 0;
    transition: background 0.15s;
  }
  .as-catalog__group-header:hover {
    background: var(--muted);
  }
  .as-catalog__group-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .as-catalog__nodes {
    padding: 2px 8px 8px;
  }
  .as-catalog__node {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    width: 100%;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
    text-align: left;
  }
  .as-catalog__node:hover {
    background: var(--muted);
    border-color: color-mix(in srgb, var(--border) 60%, transparent);
    transform: translateY(-1px);
  }

  .as-catalog__node-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .as-catalog__node-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .as-catalog__node-text strong {
    font-size: 13px;
    font-weight: 600;
    color: var(--foreground);
    display: block;
  }
  .as-catalog__node-text small {
    font-size: 11px;
    color: var(--muted-foreground);
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Commands list */
  .as-command-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .as-command-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
    width: 100%;
  }
  .as-command-item:hover {
    background: var(--muted);
  }
  .as-command-item.active {
    background: color-mix(in srgb, var(--primary) 8%, transparent);
    border-color: color-mix(in srgb, var(--primary) 30%, transparent);
  }
  .as-command-slash {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: var(--muted);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: var(--primary);
    flex-shrink: 0;
  }
  .as-command-item__text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-width: 0;
  }
  .as-command-item__text strong {
    font-size: 12px;
    font-weight: 600;
    color: var(--foreground);
    display: block;
  }
  .as-command-item__text small {
    font-size: 10px;
    color: var(--muted-foreground);
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .as-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--muted-foreground);
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .as-status-dot.live {
    background: var(--primary);
  }

  /* Empty state */
  .as-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 32px 16px;
    text-align: center;
    color: var(--muted-foreground);
  }
  .as-empty p {
    font-size: 13px;
    margin: 0;
  }
  .as-empty button {
    font-size: 12px;
    color: var(--primary);
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
    text-decoration: underline;
  }

  /* ══════════════════════════════════════════════════════════════════════════ */
  /*  CANVAS                                                                    */
  /* ══════════════════════════════════════════════════════════════════════════ */
  .as-canvas {
    flex: 1;
    width: 100%;
    min-width: 0;
    position: relative;
    background: var(--background);
    overflow: hidden;
    margin: 8px;
    border: 1px solid var(--border);
    border-radius: 10px;
  }

  .as-canvas-atmosphere {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    border-radius: inherit;
    background: radial-gradient(
        circle at 14% 8%,
        color-mix(in srgb, var(--primary) 14%, transparent),
        transparent 34%
      ),
      radial-gradient(
        circle at 86% 88%,
        color-mix(in srgb, var(--accent, var(--primary)) 12%, transparent),
        transparent 32%
      );
  }

  .as-canvas-atmosphere :global(.bg-noise) {
    opacity: 0.72 !important;
    mix-blend-mode: overlay;
  }

  .as-canvas-atmosphere :global(.bg-noise::before) {
    opacity: 0.42 !important;
    mix-blend-mode: overlay;
  }

  .as-canvas-glow {
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
  }

  .as-canvas-glow--one {
    top: -180px;
    left: 18%;
    background: var(--primary);
  }

  .as-canvas-glow--two {
    right: -160px;
    bottom: -160px;
    background: var(--primary);
  }

  .as-start-trigger {
    width: 44px;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid color-mix(in srgb, var(--primary) 45%, var(--border));
    border-radius: 12px;
    color: var(--primary-foreground);
    background: var(--primary);
    cursor: pointer;
  }

  .as-trigger-picker {
    width: min(360px, calc(100% - 32px));
    padding: 14px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: color-mix(in srgb, var(--card) 94%, transparent);
    text-align: left;
  }

  .as-trigger-picker__heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }

  .as-eyebrow {
    color: var(--primary);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .as-trigger-picker h2 {
    margin-top: 5px;
  }

  .as-trigger-options {
    display: grid;
    gap: 8px;
    padding-top: 14px;
  }

  .as-trigger-option {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 11px;
    width: 100%;
    padding: 11px;
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--foreground);
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  .as-trigger-option:hover {
    border-color: var(--primary);
    background: color-mix(in srgb, var(--primary) 6%, transparent);
  }

  .as-trigger-option__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 9px;
    color: var(--primary);
    background: color-mix(in srgb, var(--primary) 12%, transparent);
  }

  .as-trigger-option strong,
  .as-trigger-option small {
    display: block;
  }

  .as-trigger-option strong {
    font-size: 13px;
  }
  .as-trigger-option small {
    margin-top: 3px;
    color: var(--muted-foreground);
    font-size: 11px;
  }

  :global(.as-canvas > .vb-root) {
    position: relative;
    z-index: 1;
  }

  .as-canvas-toggle {
    position: absolute;
    top: 14px;
    z-index: 5;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted-foreground);
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
  }

  .as-canvas-toggle:hover {
    color: var(--foreground);
    background: var(--muted);
  }

  .as-canvas-toggle--left {
    left: 14px;
  }

  .as-canvas-toggle--right {
    right: 58px;
  }

  .as-canvas-toggle--minimap {
    right: 14px;
  }

  .as-canvas-toggle.active {
    color: var(--primary);
    border-color: color-mix(in srgb, var(--primary) 45%, var(--border));
  }

  .as-minimap-icon {
    width: 15px;
    height: 12px;
    border: 1.5px solid currentColor;
    border-radius: 2px;
    position: relative;
  }

  .as-minimap-icon::before,
  .as-minimap-icon::after {
    content: "";
    position: absolute;
    top: -1.5px;
    bottom: -1.5px;
    width: 4px;
    border-left: 1.5px solid currentColor;
    border-right: 1.5px solid currentColor;
    transform: skewY(-22deg);
  }

  .as-minimap-icon::before {
    left: 3px;
  }

  .as-minimap-icon::after {
    right: 2px;
  }
  .as-canvas__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
    color: var(--muted-foreground);
    text-align: center;
    padding: 24px;
  }
  .as-canvas__empty h2 {
    font-size: 20px;
    font-weight: 700;
    color: var(--foreground);
    margin: 0;
    font-family: var(--heading);
  }
  .as-canvas__empty p {
    font-size: 14px;
    margin: 0;
    max-width: 320px;
  }

  /* Spinner */
  .as-spinner {
    width: 32px;
    height: 32px;
    border: 2.5px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: as-spin 0.7s linear infinite;
  }
  @keyframes as-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ══════════════════════════════════════════════════════════════════════════ */
  /*  RIGHT INSPECTOR                                                           */
  /* ══════════════════════════════════════════════════════════════════════════ */
  .as-inspector {
    position: absolute;
    top: 8px;
    right: 8px;
    bottom: 8px;
    width: 288px;
    min-width: 288px;
    background: color-mix(in srgb, var(--card) 90%, transparent);
    border: 1px solid var(--border);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
    z-index: 20;
  }

  .as-inspector__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 14px 14px 10px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .as-inspector__title-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .as-inspector__icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .as-inspector__title {
    font-size: 14px;
    font-weight: 700;
    color: var(--foreground);
    margin: 0 0 2px;
    font-family: var(--heading);
  }
  .as-inspector__subtitle {
    font-size: 11px;
    color: var(--muted-foreground);
    margin: 0;
  }

  /* Inspector tabs */
  .as-inspector__tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    padding: 0 4px;
    flex-shrink: 0;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .as-inspector__tabs::-webkit-scrollbar {
    display: none;
  }
  .as-inspector__tabs button {
    padding: 8px 10px;
    font-size: 12px;
    font-weight: 500;
    color: var(--muted-foreground);
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
    margin-bottom: -1px;
  }
  .as-inspector__tabs button.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
    font-weight: 600;
  }
  .as-inspector__tabs button:hover:not(.active) {
    color: var(--foreground);
  }

  .as-inspector__scroll {
    flex: 1;
    overflow-y: auto;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .as-node-config-heading {
    display: flex;
    align-items: center;
    gap: 7px;
    padding-top: 8px;
    border-top: 1px solid var(--border);
    color: var(--primary);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .as-code-input {
    min-height: 0;
    resize: vertical;
    font-family: var(--mono, monospace);
    font-size: 12px;
    line-height: 1.5;
  }

  .as-field__hint code {
    padding: 1px 4px;
    border-radius: 4px;
    background: var(--muted);
    font-family: var(--mono, monospace);
    font-size: 10px;
  }

  /* Form elements */
  .as-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .as-field__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .as-field__label {
    font-size: 12px;
    font-weight: 600;
    color: var(--foreground);
  }
  .as-field__counter {
    font-size: 10px;
    color: var(--muted-foreground);
  }
  .as-field__hint {
    font-size: 11px;
    color: var(--muted-foreground);
    margin: 2px 0 0;
  }

  .as-input {
    width: 100%;
    padding: 8px 10px;
    background: var(--muted);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 13px;
    color: var(--foreground);
    font-family: var(--sans);
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  .as-input:focus {
    border-color: var(--ring);
    background: var(--card);
  }

  .as-command-input-wrap {
    display: flex;
    align-items: center;
    background: var(--muted);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.15s;
  }
  .as-command-input-wrap:focus-within {
    border-color: var(--ring);
    background: var(--card);
  }
  .as-command-input-prefix {
    padding: 8px 6px 8px 10px;
    font-size: 14px;
    font-weight: 700;
    color: var(--primary);
    flex-shrink: 0;
  }
  .as-command-input {
    border: none !important;
    background: transparent !important;
    border-radius: 0 !important;
    padding-left: 0 !important;
    flex: 1;
  }

  .as-textarea {
    width: 100%;
    padding: 8px 10px;
    background: var(--muted);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 13px;
    color: var(--foreground);
    font-family: var(--sans);
    outline: none;
    resize: vertical;
    transition: border-color 0.15s;
    box-sizing: border-box;
    min-height: 80px;
  }
  .as-textarea:focus {
    border-color: var(--ring);
    background: var(--card);
  }

  .as-select-wrap {
    position: relative;
  }
  .as-select {
    width: 100%;
    padding: 8px 30px 8px 10px;
    background: var(--muted);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 13px;
    color: var(--foreground);
    font-family: var(--sans);
    outline: none;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .as-select:focus {
    border-color: var(--ring);
    background: var(--card);
  }

  /* Radio group */
  .as-radio-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .as-radio-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    transition:
      border-color 0.15s,
      background 0.15s;
    background: var(--muted);
  }
  .as-radio-item:hover {
    border-color: var(--ring);
  }
  .as-radio-item.active {
    border-color: var(--primary);
    background: color-mix(in srgb, var(--primary) 5%, transparent);
  }
  .as-radio-item strong {
    font-size: 12px;
    font-weight: 600;
    color: var(--foreground);
    display: block;
  }
  .as-radio-item small {
    font-size: 11px;
    color: var(--muted-foreground);
    display: block;
    margin-top: 2px;
  }

  .as-radio-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid var(--border);
    flex-shrink: 0;
    margin-top: 1px;
    position: relative;
    transition: border-color 0.15s;
  }
  .as-radio-dot.checked {
    border-color: var(--primary);
    background: var(--primary);
  }
  .as-radio-dot.checked::after {
    content: "";
    position: absolute;
    inset: 3px;
    background: var(--primary-foreground);
    border-radius: 50%;
  }

  /* Toggles */
  .as-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 13px;
    color: var(--foreground);
  }
  .as-toggle {
    position: relative;
    width: 36px;
    height: 20px;
    border-radius: 10px;
    border: none;
    background: var(--muted);
    border: 1px solid var(--border);
    cursor: pointer;
    transition:
      background 0.2s,
      border-color 0.2s;
    padding: 0;
    flex-shrink: 0;
  }
  .as-toggle.on {
    background: var(--primary);
    border-color: var(--primary);
  }
  .as-toggle__thumb {
    position: absolute;
    left: 2px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--card);
    transition: left 0.2s;
  }
  .as-toggle.on .as-toggle__thumb {
    left: calc(100% - 16px);
  }

  /* Collapsible row */
  .as-collapsible-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: transparent;
    font-size: 12px;
    font-weight: 500;
    color: var(--foreground);
    cursor: pointer;
    width: 100%;
    transition: background 0.15s;
  }
  .as-collapsible-row:hover {
    background: var(--muted);
  }

  /* Inspector footer */
  .as-inspector__footer {
    padding-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .as-delete-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 7px;
    width: 100%;
    border: none;
    background: transparent;
    font-size: 12px;
    font-weight: 500;
    color: var(--destructive);
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .as-delete-btn:hover {
    background: color-mix(in srgb, var(--destructive) 8%, transparent);
  }

  /* Utility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
