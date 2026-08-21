<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    ArrowRight,
    BarChart3,
    Bot,
    CheckCircle2,
    LayoutGrid,
    Monitor,
    Package,
    Printer,
    ShoppingBag,
    Sparkles,
    TrendingUp,
    Users,
    Wallet,
    Zap,
    FileText,
    Shield,
    Clock,
  } from "@lucide/svelte";
  import { Motion } from "svelte-motion";
  import LandingLayout from "$lib/components/landing/LandingLayout.svelte";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import * as Card from "$lib/components/ui/card";

  function handleGetStarted() {
    goto("/login");
  }

  const features = [
    {
      icon: ShoppingBag,
      title: "Transaction Logging",
      description:
        "Record every service sale in seconds. Select the service type, enter the customer name, amount in Naira, and optional notes.",
      benefits: ["5 service categories", "Instant daily totals", "Delete & edit records"],
      color: "text-primary bg-primary/10",
      featured: true,
    },
    {
      icon: BarChart3,
      title: "Sales Dashboard",
      description:
        "A real-time overview of your business health. See resolved issues, active automations, and system status at a glance.",
      benefits: ["Live stats cards", "Activity stream", "Task tracking"],
      color: "text-green-600 dark:text-green-400 bg-green-500/10",
      featured: false,
    },
    {
      icon: LayoutGrid,
      title: "Unified Control Panel",
      description:
        "Navigate between dashboard, transactions, computers, services, and AI tracking from a consistent sidebar layout.",
      benefits: ["Sidebar navigation", "Sticky headers", "Dark mode support"],
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
      featured: false,
    },
    {
      icon: Monitor,
      title: "Computer Management",
      description:
        "Track which computers are in use, session durations, and rental fees for your cyber café or business center.",
      benefits: ["Session tracking", "Status overview", "Revenue per machine"],
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
      featured: false,
    },
    {
      icon: Package,
      title: "Inventory Tracking",
      description:
        "Monitor paper stock, ink levels, and consumables. Get alerts before you run out during a busy day.",
      benefits: ["Stock levels", "Low-stock alerts", "Usage history"],
      color: "text-orange-600 dark:text-orange-400 bg-orange-500/10",
      featured: false,
    },
    {
      icon: Users,
      title: "Customer Records",
      description:
        "Keep a history of every customer interaction. Know who ordered what, how often they visit, and their total spend.",
      benefits: ["Customer history", "Repeat visitor tracking", "Contact notes"],
      color: "text-pink-600 dark:text-pink-400 bg-pink-500/10",
      featured: false,
    },
    {
      icon: Wallet,
      title: "Expense Management",
      description:
        "Log business expenses alongside revenue. Track ink purchases, paper stock, maintenance, and utility costs.",
      benefits: ["Expense categories", "Monthly summaries", "Profit calculation"],
      color: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10",
      featured: false,
    },
    {
      icon: FileText,
      title: "Reports & Analytics",
      description:
        "Generate sales reports, inventory summaries, and period comparisons to understand what's driving your revenue.",
      benefits: ["Sales reports", "Inventory reports", "Export ready"],
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
      featured: false,
    },
    {
      icon: Bot,
      title: "AI Task Tracking",
      description:
        "A dedicated tracker for features and improvements built with AI assistance. Transparent development progress for your team.",
      benefits: ["Task board", "AI-authored tags", "Progress timeline"],
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
      featured: true,
    },
    {
      icon: Zap,
      title: "Workflow Automations",
      description:
        "Set up automated workflows to reduce manual work. Trigger actions when transactions are logged or thresholds are hit.",
      benefits: ["Rule builder", "Auto-notifications", "Time savings"],
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
      featured: false,
    },
    {
      icon: Shield,
      title: "Secure Access",
      description:
        "Manager-level authentication keeps your business data private. Sign in with credentials and sign out when done.",
      benefits: ["Session persistence", "Route protection", "Sign-out control"],
      color: "text-red-600 dark:text-red-400 bg-red-500/10",
      featured: false,
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description:
        "Transactions appear instantly in your list and daily total updates the moment you save. No refresh needed.",
      benefits: ["Instant feedback", "Live totals", "Time stamps"],
      color: "text-teal-600 dark:text-teal-400 bg-teal-500/10",
      featured: false,
    },
  ];

  const serviceTypes = [
    { icon: Printer, label: "Printing & Photocopy" },
    { icon: FileText, label: "Typing & Data Entry" },
    { icon: Sparkles, label: "Graphics Design" },
    { icon: TrendingUp, label: "Training Sessions" },
    { icon: ShoppingBag, label: "Other Services" },
  ];
</script>

<LandingLayout active="/features">
  <Motion let:motion initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
    <section use:motion class="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
      <NoiseOverlay intensity="medium" />
      <div
        class="absolute -top-24 left-1/2 -z-10 h-[30rem] w-[60rem] -translate-x-1/2 opacity-20 dark:opacity-10"
      >
        <div
          class="absolute inset-0 rounded-[100%] bg-gradient-to-r from-primary to-blue-300 blur-3xl dark:to-blue-900"
        ></div>
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-6 text-center sm:px-8">
        <Badge
          variant="outline"
          class="mb-6 gap-2 border-primary/30 bg-primary/10 px-3 py-1 text-primary"
        >
          <Sparkles class="h-3.5 w-3.5" />
          Full feature set
        </Badge>
        <h1
          class="font-heading text-4xl font-black tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl"
        >
          Powerful tools for
          <span class="text-primary">every operation</span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          From logging a ₦500 print job to generating monthly revenue reports — Bizflow
          covers every part of running a modern business center.
        </p>
      </div>
    </section>
  </Motion>

  <Motion let:motion initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}>
    <section use:motion class="border-y border-border/50 bg-card/50 py-8">
      <div class="mx-auto max-w-7xl px-6 sm:px-8">
        <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {#each serviceTypes as service}
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <service.icon class="h-4 w-4 text-primary" />
              {service.label}
            </div>
          {/each}
        </div>
      </div>
    </section>
  </Motion>

  <Motion let:motion initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}>
    <section use:motion class="py-24">
      <div class="mx-auto max-w-7xl px-6 sm:px-8">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each features as feature, index}
            <Motion let:motion initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.06 + index * 0.08, ease: "easeOut" }}>
              <div use:motion>
                <Card.Root
                  class="h-full border-border/60 bg-card transition hover:shadow-md hover:border-primary/20 {feature.featured
                    ? 'ring-1 ring-primary/20'
                    : ''}"
                >
                  <Card.Header>
                    {#if feature.featured}
                      <Badge class="mb-3 bg-primary/10 text-primary text-[10px]">Popular</Badge>
                    {/if}
                    <div
                      class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg {feature.color}"
                    >
                      <feature.icon class="h-5 w-5" />
                    </div>
                    <Card.Title class="font-heading text-lg font-bold tracking-[-0.03em]">
                      {feature.title}
                    </Card.Title>
                    <Card.Description class="text-sm leading-relaxed">
                      {feature.description}
                    </Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <ul class="space-y-2">
                      {#each feature.benefits as benefit}
                        <li class="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 class="h-3.5 w-3.5 shrink-0 text-primary" />
                          {benefit}
                        </li>
                      {/each}
                    </ul>
                  </Card.Content>
                </Card.Root>
              </div>
            </Motion>
          {/each}
        </div>
      </div>
    </section>
  </Motion>

  <Motion let:motion initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}>
    <section use:motion class="relative overflow-hidden border-t border-border/50 py-20">
      <NoiseOverlay intensity="light" />
      <div class="relative z-10 mx-auto max-w-3xl px-6 text-center sm:px-8">
        <h2
          class="font-heading text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl"
        >
          See it in action
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          Sign in with demo credentials and explore the full dashboard, transaction
          logging, and AI tracking — no setup required.
        </p>
        <Button
          onclick={handleGetStarted}
          size="lg"
          class="mt-8 h-12 px-8 text-sm font-semibold"
        >
          Try Bizflow free
          <ArrowRight class="h-4 w-4" />
        </Button>
      </div>
    </section>
  </Motion>
</LandingLayout>
