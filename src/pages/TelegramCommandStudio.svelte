<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { authStore } from "$lib/stores/auth";
  import { toast } from "svelte-sonner";
  import VisualBuilder from "$lib/components/builder/telegram/VisualBuilder.svelte";
  import {
    ArrowLeft,
    Bot,
    Braces,
    Check,
    ChevronDown,
    Circle,
    Code2,
    Database,
    GitBranch,
    Globe2,
    MessageSquare,
    PanelRight,
    Play,
    Plus,
    Save,
    Search,
    Send,
    Settings2,
    Sparkles,
    Trash2,
    Webhook,
    X,
    Zap,
  } from "@lucide/svelte";

  type Setup = {
    id: string;
    botUsername?: string;
    botName?: string;
    enabled?: boolean;
    webhookActive?: boolean;
    webhookUrl: string;
    extensionId?: string;
    capabilities?: {
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

  type InspectorMode = "build" | "test" | "connections";
  type Filter = "all" | "enabled" | "disabled";

  const api =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";
  let setup = $state<Setup | null>(null);
  let loading = $state(true);
  let saving = $state(false);
  let commandRows = $state<CommandMapping[]>([]);
  let activeCommandIndex = $state(0);
  let commandFilter = $state<Filter>("all");
  let search = $state("");
  let selectedNode = $state("action");
  let inspectorMode = $state<InspectorMode>("build");
  let testInput = $state("/status");
  let testRunning = $state(false);
  let testOutput = $state("Send a command to see the simulated response.");
  let resourceConnected = $state(false);
  let localMode = $state(false);
  let inspectorOpen = $state(true);

  let activeCommand = $derived(commandRows[activeCommandIndex] ?? null);
  let filteredCommands = $derived(
    commandRows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => {
        const matchesFilter =
          commandFilter === "all" ||
          (commandFilter === "enabled" ? row.enabled : !row.enabled);
        const query = search.trim().toLowerCase();
        return (
          matchesFilter &&
          (!query ||
            `${row.command} ${row.description} ${row.action}`
              .toLowerCase()
              .includes(query))
        );
      }),
  );

  function defaults(): CommandMapping[] {
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

  function hydrate(bot: Setup | null) {
    setup = bot;
    localMode = !!bot?.capabilities?.localMode;
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
      : defaults();
    activeCommandIndex = 0;
  }

  async function load() {
    loading = true;
    try {
      const payload = (await request("/integrations/telegram/setup")) as {
        bots: Setup[];
      };
      hydrate(payload.bots?.[0] ?? null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load Telegram setup",
      );
      hydrate(null);
    } finally {
      loading = false;
    }
  }

  async function save() {
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
      hydrate(payload);
      toast.success("Command studio saved");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save command studio",
      );
    } finally {
      saving = false;
    }
  }

  function ensureGraph(command: CommandMapping) {
    if (command.nodes && command.edges) return;
    const gap = 390;
    command.nodes = [
      {
        id: "trigger",
        type: "trigger",
        position: { x: 80, y: 220 },
        data: { command: command.command, description: command.description },
      },
      {
        id: "logic",
        type: "logic",
        position: { x: 80 + gap, y: 220 },
        data: { label: "Prepare context", detail: "Text, user ID, variables" },
      },
      {
        id: "action",
        type: "action",
        position: { x: 80 + gap * 2, y: 220 },
        data: {
          label: command.action || "Action",
          detail: command.target || "Target",
        },
      },
      {
        id: "response",
        type: "response",
        position: { x: 80 + gap * 3, y: 220 },
        data: { label: "Reply", detail: command.response || "Response" },
      },
    ];
    command.edges = [
      { id: "edge-trigger-logic", source: "trigger", target: "logic" },
      { id: "edge-logic-action", source: "logic", target: "action" },
      { id: "edge-action-response", source: "action", target: "response" },
    ];
  }

  $effect(() => {
    if (activeCommand) ensureGraph(activeCommand);
  });

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
    search = "";
  }

  function deleteCommand() {
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

  function addNode(type: "branch" | "ai" | "logic" | "action" | "response") {
    if (!activeCommand?.nodes) return;
    const id = `${type}-${Date.now()}`;
    const data: Record<string, any> = {
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
    activeCommand.nodes = [
      ...activeCommand.nodes,
      {
        id,
        type,
        position: { x: 100 + activeCommand.nodes.length * 390, y: 220 },
        data: data[type],
      },
    ];
    selectedNode = type;
  }

  function connectResource() {
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
    selectedNode = "action";
    inspectorMode = "connections";
  }

  function runTest() {
    if (!activeCommand || testRunning) return;
    testRunning = true;
    testOutput = `Running ${testInput || activeCommand.command} through the command flow...`;
    window.setTimeout(() => {
      testRunning = false;
      testOutput =
        activeCommand.actionType === "http_request"
          ? `200 OK\n${activeCommand.actionConfig.method ?? "POST"} ${activeCommand.actionConfig.url || "resource not configured"}\n\nMapped response:\n${activeCommand.response || "Command completed."}`
          : activeCommand.response ||
            "Command completed without a response template.";
    }, 450);
  }

  function selectCommand(index: number) {
    activeCommandIndex = index;
    inspectorMode = "build";
  }

  onMount(() => void load());
</script>

<svelte:head><title>Command Studio | BizFlow</title></svelte:head>

<section class="studio" aria-labelledby="studio-title">
  <header class="studio-header">
    <div class="header-brand">
      <a
        class="icon-button"
        href="/extensions/telegram/commands"
        aria-label="Back to Telegram commands"><ArrowLeft size={18} /></a
      >
      <div class="brand-mark"><Bot size={18} /></div>
      <div class="brand-copy">
        <span class="eyebrow">Telegram automation</span>
        <h1 id="studio-title">Command Studio</h1>
      </div>
    </div>
    <div class="header-command" aria-live="polite">
      {#if activeCommand}
        <span class="command-token">{activeCommand.command || "/untitled"}</span
        >
        <span class:published={activeCommand.enabled} class="state-pill"
          ><Circle size={8} fill="currentColor" />{activeCommand.enabled
            ? "Published"
            : "Draft"}</span
        >
      {:else}
        <span class="muted-text">No command selected</span>
      {/if}
    </div>
    <div class="header-actions">
      <span class:local={localMode} class="connection-state"
        ><span class="status-dot"></span>{localMode
          ? "Local mode"
          : "Live routing"}</span
      >
      <button
        class="button button-primary"
        onclick={() => void save()}
        disabled={saving}
        ><Save size={16} />{saving ? "Saving" : "Save changes"}</button
      >
      <button
        class="icon-button header-inspector-toggle"
        onclick={() => (inspectorOpen = !inspectorOpen)}
        aria-label="Toggle inspector"
        title="Toggle inspector"><PanelRight size={18} /></button
      >
    </div>
  </header>

  <div class="studio-body">
    <aside class="command-rail" aria-label="Command library">
      <div class="rail-heading">
        <div>
          <span class="eyebrow">Flows</span>
          <h2>Commands</h2>
        </div>
        <button
          class="icon-button subtle"
          onclick={addCommand}
          aria-label="Create command"
          title="Create command"><Plus size={17} /></button
        >
      </div>
      <label class="search-field"
        ><Search size={15} /><input
          bind:value={search}
          placeholder="Search commands"
          aria-label="Search commands"
        /><kbd>/</kbd></label
      >
      <div class="filter-tabs" role="tablist" aria-label="Command filter">
        {#each [{ value: "all", label: "All" }, { value: "enabled", label: "Live" }, { value: "disabled", label: "Draft" }] as filter}
          <button
            role="tab"
            aria-selected={commandFilter === filter.value}
            onclick={() => (commandFilter = filter.value as Filter)}
            >{filter.label}</button
          >
        {/each}
      </div>
      <div class="command-list">
        {#each filteredCommands as item (item.index)}
          <button
            class:active={activeCommandIndex === item.index}
            class="command-item"
            onclick={() => selectCommand(item.index)}
          >
            <span class="command-icon">/</span>
            <span class="command-item-copy"
              ><strong
                >{item.row.command.replace(/^\//, "") || "untitled"}</strong
              ><small
                >{item.row.description ||
                  item.row.action ||
                  "No description"}</small
              ></span
            >
            <span class:live={item.row.enabled} class="command-dot"></span>
          </button>
        {:else}
          <div class="empty-list">
            <MessageSquare size={22} />
            <p>No commands found</p>
            <button onclick={addCommand}>Create a command</button>
          </div>
        {/each}
      </div>
      <div class="rail-footer">
        <span>{commandRows.length} total</span><span
          >{commandRows.filter((row) => row.enabled).length} live</span
        >
      </div>
    </aside>

    <main class="workspace" aria-label="Workflow canvas">
      {#if loading}
        <div class="workspace-empty">
          <div class="loading-ring"></div>
          <p>Loading your command flows...</p>
        </div>
      {:else if activeCommand}
        <div class="canvas-toolbar">
          <div>
            <span class="eyebrow">Workflow</span><strong
              >{activeCommand.description ||
                "Build a conversation flow"}</strong
            >
          </div>
          <div class="canvas-toolbar-actions">
            <button class="tool-button" onclick={() => (inspectorMode = "test")}
              ><Play size={15} />Test flow</button
            ><button
              class="tool-button"
              onclick={() => (inspectorOpen = !inspectorOpen)}
              ><Settings2 size={15} />Inspector</button
            >
          </div>
        </div>
        {#if activeCommand.nodes && activeCommand.edges}<VisualBuilder
            bind:nodes={activeCommand.nodes}
            bind:edges={activeCommand.edges}
            onNodeClick={(node) => {
              selectedNode = node.type ?? "action";
              inspectorMode = "build";
            }}
          />{/if}
        <div class="node-dock">
          <div class="dock-label"><Plus size={14} /><span>Add step</span></div>
          <button onclick={() => addNode("logic")} title="Add transform"
            ><Braces size={16} /><span>Transform</span></button
          >
          <button onclick={() => addNode("branch")} title="Add branch"
            ><GitBranch size={16} /><span>Branch</span></button
          >
          <button onclick={() => addNode("action")} title="Add API action"
            ><Globe2 size={16} /><span>API call</span></button
          >
          <button onclick={() => addNode("ai")} class="ai" title="Add AI step"
            ><Sparkles size={16} /><span>AI step</span></button
          >
          <button onclick={() => addNode("response")} title="Add response"
            ><Send size={16} /><span>Reply</span></button
          >
        </div>
      {:else}
        <div class="workspace-empty">
          <Webhook size={34} />
          <h2>Create your first command</h2>
          <p>
            Define a Telegram command, then connect the steps that should run.
          </p>
          <button class="button button-primary" onclick={addCommand}
            ><Plus size={16} />New command</button
          >
        </div>
      {/if}
    </main>

    {#if activeCommand && inspectorOpen}
      <aside class="inspector" aria-label="Command inspector">
        <div class="inspector-header">
          <div>
            <span class="eyebrow">Configure</span>
            <h2>
              {inspectorMode === "build"
                ? "Command settings"
                : inspectorMode === "test"
                  ? "Test flow"
                  : "Connections"}
            </h2>
          </div>
          <button
            class="icon-button subtle"
            onclick={() => (inspectorOpen = false)}
            aria-label="Close inspector"><X size={17} /></button
          >
        </div>
        <nav class="inspector-tabs" aria-label="Inspector mode">
          <button
            class:active={inspectorMode === "build"}
            onclick={() => (inspectorMode = "build")}
            ><Code2 size={15} />Build</button
          >
          <button
            class:active={inspectorMode === "connections"}
            onclick={() => (inspectorMode = "connections")}
            ><Database size={15} />Connect</button
          >
          <button
            class:active={inspectorMode === "test"}
            onclick={() => (inspectorMode = "test")}
            ><Play size={15} />Test</button
          >
        </nav>
        <div class="inspector-scroll">
          {#if inspectorMode === "build"}
            <section class="inspector-section">
              <div class="section-heading">
                <span>Command</span><span class="node-badge"
                  >{selectedNode}</span
                >
              </div>
              <label class="field"
                ><span>Command name</span>
                <div class="command-input">
                  <b>/</b><input
                    bind:value={activeCommand.command}
                    oninput={(event) =>
                      (activeCommand.command = normalizeCommand(
                        event.currentTarget.value,
                      ))}
                    placeholder="start"
                  />
                </div></label
              >
              <label class="field"
                ><span>Description</span><input
                  bind:value={activeCommand.description}
                  placeholder="What should this command do?"
                /></label
              >
              <label class="switch-row"
                ><span
                  ><b>Publish command</b><small
                    >Allow Telegram users to trigger this flow</small
                  ></span
                ><button
                  class:checked={activeCommand.enabled}
                  class="switch"
                  role="switch"
                  aria-label="Publish command"
                  aria-checked={activeCommand.enabled}
                  onclick={() =>
                    (activeCommand.enabled = !activeCommand.enabled)}
                  ><span></span></button
                ></label
              >
            </section>
            <section class="inspector-section">
              <div class="section-heading">
                <span>Action</span><span class="step-number">02</span>
              </div>
              <label class="field"
                ><span>Action name</span><input
                  bind:value={activeCommand.action}
                  placeholder="Welcome flow"
                /></label
              >
              <label class="field"
                ><span>Action type</span><select
                  bind:value={activeCommand.actionType}
                  ><option value="reply">Reply message</option><option
                    value="http_request">HTTP request</option
                  ><option value="vtu_airtime">VTU airtime</option><option
                    value="vtu_data">VTU data</option
                  ><option value="ai">AI processing</option><option
                    value="custom_flow">Internal workflow</option
                  ><option value="none">No action</option></select
                ></label
              >
              {#if activeCommand.actionType === "http_request"}
                <label class="field"
                  ><span>Endpoint URL</span><input
                    type="url"
                    bind:value={activeCommand.actionConfig.url}
                    placeholder="https://api.example.com/endpoint"
                  /></label
                >
                <div class="field-row">
                  <label class="field"
                    ><span>Method</span><select
                      bind:value={activeCommand.actionConfig.method}
                      ><option>GET</option><option>POST</option><option
                        >PUT</option
                      ><option>DELETE</option></select
                    ></label
                  >
                  <label class="field"
                    ><span>Target</span><input
                      bind:value={activeCommand.target}
                      placeholder="API response"
                    /></label
                  >
                </div>
                <label class="field"
                  ><span>Headers (JSON)</span><textarea
                    bind:value={activeCommand.actionConfig.headers}
                    rows="3"
                    placeholder="&#123;&quot;Authorization&quot;: &quot;Bearer token&quot;&#125;"
                  ></textarea></label
                >
                {#if ["POST", "PUT"].includes(activeCommand.actionConfig.method ?? "POST")}
                  <label class="field"
                    ><span>Body payload (JSON)</span><textarea
                      bind:value={activeCommand.actionConfig.body}
                      rows="4"
                      placeholder="&#123;&quot;user&quot;: &quot;&#123;&#123;user_id&#125;&#125;&quot;&#125;"
                    ></textarea></label
                  >
                {/if}
              {:else if activeCommand.actionType === "ai"}
                <label class="field"
                  ><span>AI connector</span><select
                    bind:value={activeCommand.aiConnector}
                    ><option value="None">None</option><option value="BizzyAI"
                      >Bizzy AI</option
                    ><option value="OpenAI">OpenAI</option></select
                  ></label
                >
                <label class="field"
                  ><span>Instruction</span><textarea
                    rows="4"
                    placeholder="Describe how the assistant should process this message..."
                  ></textarea></label
                >
              {/if}
            </section>
            <section class="inspector-section">
              <div class="section-heading">
                <span>Response</span><span class="step-number">03</span>
              </div>
              <label class="field"
                ><span>Telegram message</span><textarea
                  bind:value={activeCommand.response}
                  rows="5"
                  placeholder="Write the message your customer receives..."
                ></textarea><small
                  >Use {{ name }} or {{ user_id }} to insert values.</small
                ></label
              >
            </section>
            <button class="delete-button" onclick={deleteCommand}
              ><Trash2 size={15} />Delete command</button
            >
          {:else if inspectorMode === "test"}
            <section class="inspector-section">
              <div class="test-intro">
                <div class="test-icon"><Play size={18} /></div>
                <div>
                  <h3>Run a live preview</h3>
                  <p>Test this flow before deploying it to Telegram.</p>
                </div>
              </div>
              <label class="field"
                ><span>Incoming message</span><textarea
                  bind:value={testInput}
                  rows="3"
                  placeholder="/status 12345"
                ></textarea></label
              ><button
                class="button button-primary full"
                onclick={runTest}
                disabled={testRunning}
                >{#if testRunning}<span class="loading-ring small"
                  ></span>Running...{:else}<Play size={15} />Run test{/if}</button
              >
            </section>
            <section class="inspector-section">
              <div class="section-heading">
                <span>Response</span><span class="live-label"
                  ><Check size={13} />Preview</span
                >
              </div>
              <pre class="test-output">{testOutput}</pre>
            </section>
          {:else}
            <section class="inspector-section">
              <div class="test-intro">
                <div class="test-icon connection"><Database size={18} /></div>
                <div>
                  <h3>External resources</h3>
                  <p>Connect an API or provider to enrich this command.</p>
                </div>
              </div>
              {#if !resourceConnected}<button
                  class="connection-card"
                  onclick={connectResource}
                  ><Globe2 size={18} /><span
                    ><b>Connect an API</b><small
                      >HTTP request and response mapping</small
                    ></span
                  ><ChevronDown size={15} /></button
                >{:else}<div class="connected-card">
                  <div>
                    <Check size={16} /><span
                      ><b>API connected</b><small
                        >{activeCommand.actionConfig.url}</small
                      ></span
                    >
                  </div>
                  <button onclick={() => (resourceConnected = false)}
                    >Disconnect</button
                  >
                </div>{/if}
            </section>
          {/if}
        </div>
      </aside>
    {/if}
  </div>
</section>

<style>
  :global(html),
  :global(body) {
    margin: 0;
    min-height: 100%;
  }
  :global(body) {
    overflow: hidden;
  }
  .studio {
    --studio-ink: var(--foreground);
    --studio-muted: var(--muted-foreground);
    --studio-line: var(--border);
    --studio-soft: var(--muted);
    --studio-accent: var(--primary);
    --studio-accent-soft: var(--accent);
    --studio-warm: #d99a22;
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    color: var(--studio-ink);
    background: var(--background);
    font-family: var(--sans, sans-serif);
    overflow: hidden;
  }
  .studio-header {
    z-index: 10;
    display: grid;
    grid-template-columns: minmax(250px, 1fr) auto minmax(250px, 1fr);
    align-items: center;
    gap: 24px;
    min-height: 76px;
    padding: 0 28px;
    background: var(--card);
    border-bottom: 1px solid var(--studio-line);
  }
  .header-brand,
  .header-actions,
  .header-command,
  .rail-heading,
  .canvas-toolbar,
  .canvas-toolbar-actions,
  .test-intro,
  .section-heading,
  .switch-row,
  .connected-card > div {
    display: flex;
    align-items: center;
  }
  .header-brand {
    min-width: 0;
    gap: 12px;
  }
  .brand-mark {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    flex: 0 0 auto;
    color: var(--primary-foreground);
    background: var(--studio-accent);
    border-radius: 10px;
  }
  .brand-copy {
    min-width: 0;
  }
  .brand-copy h1,
  .rail-heading h2,
  .inspector-header h2,
  .workspace-empty h2 {
    margin: 0;
    font-size: 16px;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }
  .eyebrow {
    display: block;
    margin-bottom: 4px;
    color: var(--studio-muted);
    font-size: 10px;
    font-weight: 750;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }
  .header-command {
    justify-content: center;
    gap: 12px;
    min-width: 0;
  }
  .command-token {
    padding: 8px 12px;
    color: var(--accent-foreground);
    background: var(--studio-accent-soft);
    border-radius: 7px;
    font: 700 13px var(--mono, monospace);
  }
  .state-pill,
  .connection-state,
  .live-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--studio-muted);
    font-size: 11px;
    font-weight: 700;
  }
  .state-pill.published,
  .live-label {
    color: #13856d;
  }
  .header-actions {
    justify-content: flex-end;
    gap: 10px;
    min-width: 0;
  }
  .connection-state {
    padding-right: 10px;
    border-right: 1px solid var(--studio-line);
  }
  .connection-state.local {
    color: #b77718;
  }
  .status-dot,
  .command-dot {
    width: 7px;
    height: 7px;
    flex: 0 0 auto;
    background: #b8c1ca;
    border-radius: 50%;
  }
  .connection-state:not(.local) .status-dot,
  .command-dot.live {
    background: #1cb184;
    box-shadow: 0 0 0 3px #e0f7ed;
  }
  .button,
  .tool-button,
  .icon-button,
  .node-dock button,
  .inspector-tabs button,
  .filter-tabs button,
  .command-item,
  .connection-card,
  .connected-card button,
  .delete-button {
    border: 0;
    font: inherit;
    cursor: pointer;
  }
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 38px;
    padding: 0 14px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 750;
  }
  .button-primary {
    color: var(--primary-foreground);
    background: var(--studio-accent);
    box-shadow: 0 3px 8px color-mix(in srgb, var(--primary) 22%, transparent);
  }
  .button-primary:hover {
    filter: brightness(0.94);
  }
  .button:disabled {
    opacity: 0.55;
    cursor: wait;
  }
  .icon-button {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    flex: 0 0 auto;
    color: var(--studio-muted);
    background: transparent;
    border-radius: 7px;
  }
  .icon-button:hover,
  .icon-button.subtle:hover {
    color: var(--studio-ink);
    background: var(--studio-soft);
  }
  .studio-body {
    display: grid;
    grid-template-columns: 276px minmax(0, 1fr) 340px;
    flex: 1;
    min-height: 0;
    min-width: 0;
  }
  .command-rail,
  .inspector {
    min-width: 0;
    background: var(--card);
    overflow: hidden;
  }
  .command-rail {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--studio-line);
  }
  .search-field {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 16px 12px;
    padding: 0 10px;
    color: #94a0ad;
    background: var(--studio-soft);
    border: 1px solid transparent;
    border-radius: 7px;
  }
  .search-field:focus-within {
    border-color: #9fd8d5;
    background: var(--card);
    box-shadow: 0 0 0 3px #dff3f1;
  }
  .search-field input {
    width: 100%;
    min-width: 0;
    height: 36px;
    padding: 0;
    color: var(--studio-ink);
    background: transparent;
    border: 0;
    outline: 0;
    font-size: 12px;
  }
  .search-field kbd {
    padding: 2px 5px;
    color: #9aa5af;
    background: var(--card);
    border: 1px solid var(--studio-line);
    border-radius: 4px;
    font-size: 10px;
  }
  .filter-tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
    margin: 0 16px 12px;
    padding: 3px;
    background: var(--studio-soft);
    border-radius: 7px;
  }
  .filter-tabs button {
    padding: 7px 4px;
    color: var(--studio-muted);
    background: transparent;
    border-radius: 5px;
    font-size: 10px;
    font-weight: 750;
  }
  .filter-tabs button[aria-selected="true"] {
    color: var(--studio-ink);
    background: var(--card);
    box-shadow: 0 1px 3px #17202a12;
  }
  .command-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 5px;
    min-height: 0;
    padding: 4px 12px;
    overflow-y: auto;
  }
  .command-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 58px;
    padding: 9px 8px;
    color: var(--studio-ink);
    text-align: left;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 8px;
  }
  .command-item:hover {
    background: var(--studio-soft);
  }
  .command-item.active {
    background: #eaf7f5;
    border-color: #c6e8e5;
  }
  .command-icon {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    flex: 0 0 auto;
    color: var(--studio-accent);
    background: var(--card);
    border-radius: 7px;
    font: 700 15px var(--mono, monospace);
  }
  .command-item-copy strong,
  .command-item-copy small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .command-item-copy strong {
    font: 700 12px var(--font-mono, monospace);
  }
  .command-item-copy small {
    color: var(--studio-muted);
    font-size: 10px;
  }
  .empty-list,
  .workspace-empty {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    color: var(--studio-muted);
    text-align: center;
  }
  .empty-list {
    gap: 8px;
    padding: 48px 16px;
    font-size: 11px;
  }
  .empty-list p {
    margin: 0;
  }
  .empty-list button {
    padding: 0;
    color: var(--studio-accent);
    background: none;
    border: 0;
    font-size: 11px;
    font-weight: 750;
    cursor: pointer;
  }
  .rail-footer {
    display: flex;
    justify-content: space-between;
    padding: 12px 20px;
    color: var(--studio-muted);
    border-top: 1px solid var(--studio-line);
    font-size: 10px;
  }
  .workspace {
    position: relative;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    background: color-mix(in srgb, var(--muted) 42%, var(--background));
  }
  .canvas-toolbar {
    position: absolute;
    z-index: 4;
    top: 20px;
    left: 24px;
    right: 24px;
    justify-content: space-between;
    gap: 16px;
    pointer-events: none;
  }
  .canvas-toolbar > div,
  .canvas-toolbar-actions {
    pointer-events: auto;
  }
  .canvas-toolbar strong {
    display: block;
    max-width: 380px;
    overflow: hidden;
    color: #34434f;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .canvas-toolbar-actions {
    gap: 6px;
  }
  .tool-button {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 32px;
    padding: 0 10px;
    color: #50616d;
    background: var(--card);
    border: 1px solid #dfe7e8;
    border-radius: 6px;
    box-shadow: 0 3px 10px #17202a0d;
    font-size: 11px;
    font-weight: 700;
  }
  .tool-button:hover {
    color: var(--studio-accent);
    border-color: #a9d8d5;
  }
  .workspace-empty {
    position: absolute;
    inset: 0;
    gap: 12px;
    padding: 24px;
  }
  .workspace-empty h2 {
    color: var(--studio-ink);
  }
  .workspace-empty p {
    max-width: 300px;
    margin: 0 0 8px;
    font-size: 12px;
    line-height: 1.6;
  }
  .loading-ring {
    width: 24px;
    height: 24px;
    border: 2px solid #cde4e2;
    border-top-color: var(--studio-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .loading-ring.small {
    width: 14px;
    height: 14px;
    border-width: 2px;
    border-top-color: var(--primary-foreground);
    border-left-color: color-mix(in srgb, var(--primary-foreground) 40%, transparent);
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .node-dock {
    position: absolute;
    z-index: 5;
    bottom: 22px;
    left: 50%;
    display: flex;
    align-items: center;
    gap: 3px;
    width: max-content;
    max-width: calc(100% - 48px);
    box-sizing: border-box;
    padding: 6px;
    overflow-x: auto;
    background: color-mix(in srgb, var(--card) 96%, transparent);
    border: 1px solid var(--border);
    border-radius: 10px;
    box-shadow: 0 12px 28px
      color-mix(in srgb, var(--foreground) 12%, transparent);
    transform: translateX(-50%);
  }
  .node-dock button {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    flex: 0 0 auto;
    min-height: 34px;
    padding: 0 10px;
    color: #52616d;
    background: transparent;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
  }
  .node-dock button:hover,
  .node-dock button.ai:hover {
    color: var(--studio-accent);
    background: var(--studio-soft);
  }
  .node-dock button.ai {
    color: #9b4d9e;
  }
  .dock-label {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0 9px 0 5px;
    color: var(--studio-muted);
    border-right: 1px solid var(--studio-line);
    font-size: 10px;
    font-weight: 750;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }
  .inspector {
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--studio-line);
  }
  .inspector-header {
    justify-content: space-between;
    padding: 24px 20px 16px;
  }
  .inspector-tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
    margin: 0 16px;
    padding: 3px;
    background: var(--studio-soft);
    border-radius: 7px;
  }
  .inspector-tabs button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-height: 32px;
    color: var(--studio-muted);
    background: transparent;
    border-radius: 5px;
    font-size: 10px;
    font-weight: 750;
  }
  .inspector-tabs button.active {
    color: var(--studio-ink);
    background: var(--card);
    box-shadow: 0 1px 3px #17202a12;
  }
  .inspector-scroll {
    flex: 1;
    min-height: 0;
    padding: 18px 20px 24px;
    overflow-y: auto;
  }
  .inspector-section {
    padding: 0 0 22px;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--studio-line);
  }
  .section-heading {
    justify-content: space-between;
    margin-bottom: 16px;
    color: #33434e;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .node-badge,
  .step-number {
    padding: 4px 6px;
    color: var(--studio-accent);
    background: var(--studio-accent-soft);
    border-radius: 4px;
    font-size: 9px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
  .step-number {
    color: #95a0a8;
    background: var(--studio-soft);
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
  }
  .field > span {
    color: #54636e;
    font-size: 10px;
    font-weight: 750;
  }
  .field > small,
  .switch-row small {
    color: var(--studio-muted);
    font-size: 10px;
    line-height: 1.5;
  }
  .field input,
  .field select,
  .field textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 9px 10px;
    color: var(--studio-ink);
    background: var(--card);
    border: 1px solid #d9e1e5;
    border-radius: 6px;
    outline: 0;
    font: 12px var(--font-body, sans-serif);
  }
  .field textarea {
    resize: vertical;
    line-height: 1.5;
  }
  .field input:focus,
  .field select:focus,
  .field textarea:focus {
    border-color: #67bcb7;
    box-shadow: 0 0 0 3px #dff3f1;
  }
  .command-input {
    display: flex;
    align-items: center;
    border: 1px solid #d9e1e5;
    border-radius: 6px;
  }
  .command-input:focus-within {
    border-color: #67bcb7;
    box-shadow: 0 0 0 3px #dff3f1;
  }
  .command-input b {
    padding-left: 10px;
    color: var(--studio-accent);
    font: 700 13px var(--font-mono, monospace);
  }
  .command-input input {
    border: 0;
    box-shadow: none;
    font-family: var(--font-mono, monospace);
  }
  .field-row {
    display: grid;
    grid-template-columns: 0.7fr 1.3fr;
    gap: 8px;
  }
  .switch-row {
    justify-content: space-between;
    gap: 12px;
    margin-top: 18px;
  }
  .switch-row > span {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .switch-row b {
    font-size: 11px;
  }
  .switch {
    width: 34px;
    height: 20px;
    padding: 2px;
    flex: 0 0 auto;
    background: #c3cdd4;
    border: 0;
    border-radius: 20px;
    cursor: pointer;
  }
  .switch span {
    display: block;
    width: 16px;
    height: 16px;
    background: var(--card);
    border-radius: 50%;
    box-shadow: 0 1px 3px #17202a30;
    transition: transform 150ms ease;
  }
  .switch.checked {
    background: #1ca57f;
  }
  .switch.checked span {
    transform: translateX(14px);
  }
  .delete-button {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 0;
    color: #ba5b5b;
    background: transparent;
    font-size: 11px;
    font-weight: 750;
  }
  .delete-button:hover {
    color: #983c3c;
  }
  .test-intro {
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 18px;
  }
  .test-icon {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    flex: 0 0 auto;
    color: var(--studio-accent);
    background: var(--studio-accent-soft);
    border-radius: 8px;
  }
  .test-icon.connection {
    color: #b77718;
    background: color-mix(in srgb, #d99a22 18%, var(--card));
  }
  .test-intro h3 {
    margin: 0 0 4px;
    font-size: 13px;
  }
  .test-intro p {
    margin: 0;
    color: var(--studio-muted);
    font-size: 10px;
    line-height: 1.5;
  }
  .full {
    width: 100%;
  }
  .test-output {
    min-height: 130px;
    margin: 0;
    padding: 12px;
    overflow: auto;
    color: var(--primary);
    background: var(--foreground);
    border-radius: 7px;
    font: 10px/1.6 var(--mono, monospace);
    white-space: pre-wrap;
  }
  .connection-card,
  .connected-card {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    color: var(--studio-ink);
    background: var(--card);
    border: 1px solid #dbe4e5;
    border-radius: 7px;
    text-align: left;
  }
  .connection-card:hover {
    border-color: #78c2bd;
    background: var(--studio-soft);
  }
  .connection-card > span,
  .connected-card span {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 3px;
  }
  .connection-card b,
  .connected-card b {
    font-size: 11px;
  }
  .connection-card small,
  .connected-card small {
    max-width: 235px;
    overflow: hidden;
    color: var(--studio-muted);
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .connected-card {
    justify-content: space-between;
    background: #eefaf4;
    border-color: #bfe5d1;
  }
  .connected-card > div {
    gap: 8px;
    color: #17815f;
  }
  .connected-card button {
    padding: 0;
    color: #8a6c6c;
    background: transparent;
    font-size: 10px;
  }
  .muted-text {
    color: var(--studio-muted);
    font-size: 11px;
  }
  @media (max-width: 1080px) {
    .studio-header {
      grid-template-columns: 1fr auto;
    }
    .header-command {
      display: none;
    }
    .studio-body {
      grid-template-columns: 248px minmax(0, 1fr) 320px;
    }
  }
  @media (max-width: 820px) {
    :global(body) {
      overflow: auto;
    }
    .studio {
      position: relative;
      min-height: 100vh;
      overflow: visible;
    }
    .studio-header {
      grid-template-columns: 1fr auto;
      min-height: 68px;
      padding: 0 14px;
    }
    .header-actions .connection-state,
    .header-inspector-toggle {
      display: none;
    }
    .studio-body {
      grid-template-columns: 220px minmax(0, 1fr);
      min-height: calc(100vh - 68px);
    }
    .inspector {
      position: absolute;
      z-index: 20;
      top: 68px;
      right: 0;
      bottom: 0;
      width: min(340px, calc(100vw - 34px));
      box-shadow: -14px 0 30px #17202a20;
    }
    .node-dock {
      bottom: 14px;
      max-width: calc(100% - 24px);
    }
  }
  @media (max-width: 560px) {
    .studio-body {
      display: block;
    }
    .command-rail {
      height: 230px;
      border-right: 0;
      border-bottom: 1px solid var(--studio-line);
    }
    .command-list {
      flex-direction: row;
      overflow-x: auto;
      overflow-y: hidden;
    }
    .command-item {
      width: 190px;
      flex: 0 0 auto;
    }
    .rail-footer {
      display: none;
    }
    .workspace {
      height: calc(100vh - 298px);
      min-height: 420px;
    }
    .brand-copy .eyebrow {
      display: none;
    }
    .brand-copy h1 {
      font-size: 14px;
    }
    .button-primary {
      padding: 0 10px;
    }
  }
</style>
