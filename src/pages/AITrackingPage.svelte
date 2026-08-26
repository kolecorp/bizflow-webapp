<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    Bot,
    CheckCircle2,
    CircleDot,
    Clock3,
    MoreHorizontal,
    TerminalSquare,
  } from "@lucide/svelte";

  const aiTasks = [
    {
      id: "AI-101",
      title: "Rebuild dashboard for business centers",
      status: "Done",
      date: "Today",
      author: "Antigravity",
      tags: ["UI/UX", "Feature"],
    },
    {
      id: "AI-102",
      title: "Print Agent architecture & printing module",
      status: "In Progress",
      date: "Today",
      author: "Antigravity",
      tags: ["Printing", "Feature"],
    },
    {
      id: "AI-103",
      title: "Stock taking & inventory UI",
      status: "In Progress",
      date: "Today",
      author: "Antigravity",
      tags: ["Inventory"],
    },
    {
      id: "AI-104",
      title: "RBAC permission gates (placeholder)",
      status: "To Do",
      date: "Pending",
      author: "System",
      tags: ["Security"],
    },
  ];

  function getStatusClass(status: string) {
    switch (status) {
      case "Done":
        return "border-primary/25 bg-primary/10 text-primary";
      case "In Progress":
        return "border-accent bg-accent text-accent-foreground";
      default:
        return "border-border bg-muted text-muted-foreground";
    }
  }

  function getStatusIcon(status: string) {
    if (status === "Done") return CheckCircle2;
    if (status === "In Progress") return Clock3;
    return CircleDot;
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="System"
    title="AI Tracking (.ai)"
    description="Track features, modules, and changes made with AI assistance."
  />

  <div class="grid gap-4 sm:grid-cols-3">
    <div class="surface-stat p-5">
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Tracked tasks
      </p>
      <p
        class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-foreground"
      >
        {aiTasks.length}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">Across the workspace</p>
    </div>
    <div class="surface-stat p-5">
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        In progress
      </p>
      <p
        class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-foreground"
      >
        {aiTasks.filter((task) => task.status === "In Progress").length}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">Currently being shaped</p>
    </div>
    <div class="surface-stat p-5">
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Completed
      </p>
      <p
        class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-foreground"
      >
        {aiTasks.filter((task) => task.status === "Done").length}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">Ready in the workspace</p>
    </div>
  </div>

  <div class="surface-panel overflow-hidden">
    <div
      class="flex items-center justify-between border-b border-border/60 px-6 py-5"
    >
      <div class="flex items-center gap-3">
        <div class="rounded-lg bg-primary/10 p-2 text-primary">
          <TerminalSquare class="h-4 w-4" />
        </div>
        <div>
          <h3 class="font-heading text-lg font-semibold text-foreground">
            Development tasks
          </h3>
          <p class="mt-1 text-xs text-muted-foreground">
            A living record of work shaped with AI assistance.
          </p>
        </div>
      </div>
      <span class="hidden text-xs text-muted-foreground sm:block"
        >{aiTasks.length} items</span
      >
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr
            class="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground"
          >
            <th class="px-6 py-3 font-semibold">Key</th>
            <th class="px-4 py-3 font-semibold">Summary</th>
            <th class="px-4 py-3 font-semibold">Status</th>
            <th class="px-4 py-3 font-semibold">Author</th>
            <th class="px-4 py-3 font-semibold">Date</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {#each aiTasks as task}
            {@const StatusIcon = getStatusIcon(task.status)}
            <tr class="border-b border-border/40 hover:bg-muted/30 group">
              <td class="px-6 py-4 font-mono text-xs text-muted-foreground"
                >{task.id}</td
              >
              <td class="px-4 py-4">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-medium text-foreground">{task.title}</span>
                  {#each task.tags as tag}
                    <span
                      class="rounded-md border border-border/60 bg-muted/60 px-2 py-1 text-[10px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  {/each}
                </div>
              </td>
              <td class="px-4 py-4">
                <span
                  class={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${getStatusClass(task.status)}`}
                >
                  <StatusIcon class="h-3.5 w-3.5" />
                  {task.status}
                </span>
              </td>
              <td
                class="px-4 py-4 text-muted-foreground flex items-center gap-1.5"
              >
                <Bot class="h-3.5 w-3.5" />
                {task.author}
              </td>
              <td class="px-4 py-4 text-muted-foreground">{task.date}</td>
              <td class="px-4 py-4">
                <button
                  type="button"
                  class="rounded p-1 opacity-0 group-hover:opacity-100 hover:bg-muted transition"
                >
                  <MoreHorizontal class="h-4 w-4 text-muted-foreground" />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</AppShell>
