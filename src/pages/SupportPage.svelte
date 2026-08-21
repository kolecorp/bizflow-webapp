<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { authStore } from "$lib/stores/auth";
  import { canAccess } from "$lib/stores/permissions";
  import {
    chatChannels,
    chatMessages,
    supportTickets,
    ticketComments,
    sendChatMessage,
    createTicket,
    updateTicketStatus,
    addTicketComment,
  } from "$lib/stores/communications";
  import { computers } from "$lib/stores/businessData";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import {
    MessageSquare,
    Ticket,
    Send,
    CheckCircle2,
    User,
    Monitor,
    Plus,
  } from "@lucide/svelte";
  import type { SupportTicket, TicketStatus } from "$lib/types/communications";

  type Tab = "chat" | "tickets";

  let activeTab: Tab = "chat";
  let selectedChannelId = "ch-team";
  let chatDraft = "";
  let selectedTicketId: string | null = "TKT-1042";
  let commentDraft = "";
  let showNewTicket = false;

  let newTicket = {
    subject: "",
    customer: "",
    description: "",
    priority: "medium" as SupportTicket["priority"],
    computerId: "",
  };

  $: userRole = $authStore.user?.role ?? "staff";
  $: canManage = canAccess(userRole, "support.manage");
  $: channelMessages = $chatMessages.filter((m) => m.channelId === selectedChannelId);
  $: selectedTicket = $supportTickets.find((t) => t.id === selectedTicketId) ?? null;
  $: ticketThread = selectedTicket
    ? $ticketComments.filter((c) => c.ticketId === selectedTicket.id)
    : [];

  function sendMessage() {
    if (!chatDraft.trim()) return;
    sendChatMessage(selectedChannelId, chatDraft);
    chatDraft = "";
  }

  function handleChatKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function statusBadge(status: TicketStatus) {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-600";
      case "in_progress":
        return "bg-amber-500/10 text-amber-600";
      case "waiting":
        return "bg-purple-500/10 text-purple-600";
      case "resolved":
        return "bg-green-500/10 text-green-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  }

  function priorityBadge(priority: SupportTicket["priority"]) {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-600";
      case "high":
        return "bg-orange-500/10 text-orange-600";
      case "medium":
        return "bg-amber-500/10 text-amber-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  }

  function submitComment() {
    if (!selectedTicket || !commentDraft.trim()) return;
    addTicketComment(selectedTicket.id, commentDraft, true);
    commentDraft = "";
  }

  function resolveTicket() {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, "resolved", $authStore.user?.name);
  }

  function assignToMe() {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, "in_progress", $authStore.user?.name ?? "Staff");
  }

  function submitNewTicket() {
    if (!newTicket.subject || !newTicket.customer) return;
    const pc = $computers.find((c) => c.id === newTicket.computerId);
    const ticket = createTicket({
      subject: newTicket.subject,
      customer: newTicket.customer,
      description: newTicket.description,
      priority: newTicket.priority,
      computerId: pc?.id,
      computerName: pc?.name,
    });
    selectedTicketId = ticket.id;
    showNewTicket = false;
    newTicket = {
      subject: "",
      customer: "",
      description: "",
      priority: "medium",
      computerId: "",
    };
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Collaboration"
    title="Support & staff chat"
    description="RPC-backed staff messaging, customer ticket resolution, and coordination across workstations."
  />

  <div class="flex flex-wrap gap-2">
    <button
      type="button"
      on:click={() => (activeTab = "chat")}
      class={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
        activeTab === "chat"
          ? "bg-foreground text-background"
          : "border border-border bg-background text-muted-foreground hover:text-foreground"
      }`}
    >
      <MessageSquare class="h-4 w-4" />
      Staff chat
    </button>
    <button
      type="button"
      on:click={() => (activeTab = "tickets")}
      class={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
        activeTab === "tickets"
          ? "bg-foreground text-background"
          : "border border-border bg-background text-muted-foreground hover:text-foreground"
      }`}
    >
      <Ticket class="h-4 w-4" />
      Customer tickets
      <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
        {$supportTickets.filter((t) => t.status !== "resolved" && t.status !== "closed").length}
      </span>
    </button>
  </div>

  {#if activeTab === "chat"}
    <div class="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div class="surface-panel p-4 space-y-2">
        <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
          Channels
        </p>
        {#each $chatChannels as channel}
          <button
            type="button"
            on:click={() => (selectedChannelId = channel.id)}
            class={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
              selectedChannelId === channel.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <MessageSquare class="h-4 w-4 shrink-0" />
            <span class="truncate">{channel.name}</span>
          </button>
        {/each}
      </div>

      <div class="surface-panel flex min-h-[420px] flex-col">
        <div class="border-b border-border px-4 py-3">
          <p class="font-semibold text-foreground">
            {$chatChannels.find((c) => c.id === selectedChannelId)?.name ?? "Chat"}
          </p>
          <p class="text-xs text-muted-foreground">
            Messages route through Bizflow RPC when workstation agents are online.
          </p>
        </div>

        <div class="flex-1 space-y-3 overflow-y-auto p-4">
          {#each channelMessages as message (message.id)}
            <div class="flex gap-3">
              <div
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
              >
                {message.senderName.charAt(0)}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-sm font-medium text-foreground">{message.senderName}</span>
                  <span class="text-xs text-muted-foreground">{message.sentAt}</span>
                  {#if message.rpcId}
                    <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {message.rpcId}
                    </span>
                  {/if}
                </div>
                <p class="mt-1 text-sm text-foreground">{message.body}</p>
              </div>
            </div>
          {/each}
        </div>

        <div class="border-t border-border p-4">
          <div class="flex gap-2">
            <Textarea
              bind:value={chatDraft}
              onkeydown={handleChatKeydown}
              placeholder="Message the team…"
              rows={2}
              class="min-h-[60px] resize-none"
            />
            <button
              type="button"
              on:click={sendMessage}
              disabled={!chatDraft.trim()}
              class="btn-app-primary self-end"
            >
              <Send class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div class="surface-panel p-4">
        <div class="mb-3 flex items-center justify-between">
          <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Open tickets
          </p>
          <button
            type="button"
            on:click={() => (showNewTicket = !showNewTicket)}
            class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus class="h-3.5 w-3.5" />
            New
          </button>
        </div>

        {#if showNewTicket}
          <div class="mb-4 space-y-3 rounded-lg border border-border bg-muted/30 p-3">
            <div class="space-y-1">
              <Label for="ticket-subject">Subject</Label>
              <Input id="ticket-subject" bind:value={newTicket.subject} />
            </div>
            <div class="space-y-1">
              <Label for="ticket-customer">Customer</Label>
              <Input id="ticket-customer" bind:value={newTicket.customer} />
            </div>
            <div class="space-y-1">
              <Label for="ticket-priority">Priority</Label>
              <select
                id="ticket-priority"
                bind:value={newTicket.priority}
                class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div class="space-y-1">
              <Label for="ticket-pc">Workstation</Label>
              <select
                id="ticket-pc"
                bind:value={newTicket.computerId}
                class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">None</option>
                {#each $computers as pc}
                  <option value={pc.id}>{pc.name} — {pc.label}</option>
                {/each}
              </select>
            </div>
            <Textarea
              bind:value={newTicket.description}
              placeholder="Describe the issue…"
              rows={3}
            />
            <button type="button" on:click={submitNewTicket} class="btn-app-primary w-full">
              Create ticket
            </button>
          </div>
        {/if}

        <div class="space-y-2">
          {#each $supportTickets as ticket (ticket.id)}
            <button
              type="button"
              on:click={() => (selectedTicketId = ticket.id)}
              class={`w-full rounded-lg border px-3 py-3 text-left transition ${
                selectedTicketId === ticket.id
                  ? "border-primary/30 bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <div class="flex items-start justify-between gap-2">
                <p class="text-sm font-medium text-foreground">{ticket.id}</p>
                <span
                  class={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusBadge(ticket.status)}`}
                >
                  {ticket.status.replace("_", " ")}
                </span>
              </div>
              <p class="mt-1 text-sm text-foreground line-clamp-1">{ticket.subject}</p>
              <p class="mt-1 text-xs text-muted-foreground">{ticket.customer}</p>
            </button>
          {/each}
        </div>
      </div>

      {#if selectedTicket}
        <div class="surface-panel flex min-h-[480px] flex-col">
          <div class="border-b border-border px-5 py-4">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="text-lg font-semibold text-foreground">{selectedTicket.subject}</p>
                <p class="mt-1 text-sm text-muted-foreground">{selectedTicket.id}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  class={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${priorityBadge(selectedTicket.priority)}`}
                >
                  {selectedTicket.priority}
                </span>
                <span
                  class={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${statusBadge(selectedTicket.status)}`}
                >
                  {selectedTicket.status.replace("_", " ")}
                </span>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span class="inline-flex items-center gap-1.5">
                <User class="h-3.5 w-3.5" />
                {selectedTicket.customer}
              </span>
              {#if selectedTicket.computerName}
                <span class="inline-flex items-center gap-1.5">
                  <Monitor class="h-3.5 w-3.5" />
                  {selectedTicket.computerName}
                </span>
              {/if}
              {#if selectedTicket.assignedTo}
                <span>Assigned: {selectedTicket.assignedTo}</span>
              {/if}
            </div>

            <p class="mt-4 text-sm text-foreground">{selectedTicket.description}</p>

            {#if selectedTicket.status !== "resolved" && selectedTicket.status !== "closed"}
              <div class="mt-4 flex flex-wrap gap-2">
                {#if !selectedTicket.assignedTo}
                  <button type="button" on:click={assignToMe} class="btn-app-secondary">
                    Assign to me
                  </button>
                {/if}
                {#if canManage || selectedTicket.assignedTo === $authStore.user?.name}
                  <button type="button" on:click={resolveTicket} class="btn-app-primary">
                    <CheckCircle2 class="h-4 w-4" />
                    Resolve ticket
                  </button>
                {/if}
              </div>
            {/if}
          </div>

          <div class="flex-1 space-y-3 overflow-y-auto p-5">
            <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Activity
            </p>
            {#each ticketThread as comment (comment.id)}
              <div class="rounded-lg border border-border bg-muted/20 px-4 py-3">
                <div class="flex items-center gap-2 text-xs text-muted-foreground">
                  <span class="font-medium text-foreground">{comment.author}</span>
                  <span>{comment.createdAt}</span>
                  {#if comment.internal}
                    <span class="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                      Internal
                    </span>
                  {/if}
                </div>
                <p class="mt-2 text-sm text-foreground">{comment.body}</p>
              </div>
            {/each}
          </div>

          {#if selectedTicket.status !== "resolved" && selectedTicket.status !== "closed"}
            <div class="border-t border-border p-4">
              <Textarea
                bind:value={commentDraft}
                placeholder="Add an internal note or customer update…"
                rows={2}
              />
              <button
                type="button"
                on:click={submitComment}
                disabled={!commentDraft.trim()}
                class="btn-app-primary mt-3"
              >
                Add comment
              </button>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</AppShell>
