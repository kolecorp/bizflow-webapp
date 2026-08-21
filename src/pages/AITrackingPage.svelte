<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { Bot, MoreHorizontal, TerminalSquare } from "@lucide/svelte";

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

  function getStatusColor(status: string) {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="System"
    title="AI Tracking (.ai)"
    description="Track features, modules, and changes made with AI assistance."
  />

  <div class="surface-panel overflow-hidden">
    <div class="border-b border-border/60 px-6 py-4 flex items-center gap-3">
      <TerminalSquare class="h-5 w-5 text-primary" />
      <h3 class="text-lg font-semibold text-foreground">Development tasks</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
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
            <tr class="border-b border-border/40 hover:bg-muted/30 group">
              <td class="px-6 py-4 font-mono text-xs text-muted-foreground">{task.id}</td>
              <td class="px-4 py-4">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-medium text-foreground">{task.title}</span>
                  {#each task.tags as tag}
                    <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {tag}
                    </span>
                  {/each}
                </div>
              </td>
              <td class="px-4 py-4">
                <span
                  class={`inline-flex rounded border px-2 py-0.5 text-xs font-semibold ${getStatusColor(task.status)}`}
                >
                  {task.status}
                </span>
              </td>
              <td class="px-4 py-4 text-muted-foreground flex items-center gap-1.5">
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
