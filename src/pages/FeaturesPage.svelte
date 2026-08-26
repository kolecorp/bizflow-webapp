<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    ArrowRight,
    BarChart3,
    Bot,
    CheckCircle2,
    LayoutGrid,
    MessageCircle,
    Monitor,
    Package,
    Printer,
    Smartphone,
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

  const whatsappFeatures = {
    business: {
      title: "WhatsApp for Business",
      description:
        "Manage your entire operation directly from your phone. Receive instant sales alerts, approve manager requests, and check your dashboard via WhatsApp without needing to log in.",
      benefits: [
        "Instant sales alerts",
        "Daily summary reports",
        "Manager approvals",
        "Live dashboard access",
      ],
      icon: LayoutGrid,
    },
    customer: {
      title: "WhatsApp for Customers",
      description:
        "Give your customers a premium experience. Automatically send digital receipts, order status updates, and provide a direct, familiar support channel.",
      benefits: [
        "Digital transaction receipts",
        "Order status updates",
        "Direct support channel",
        "Service catalogs",
      ],
      icon: Smartphone,
    },
  };

  const coreFeatures = [
    {
      icon: ShoppingBag,
      title: "Lightning-fast Transaction Logging",
      description:
        "Record every service sale in seconds. Complete with customer names, service types, and real-time daily totals.",
      span: "lg:col-span-2",
      color: "text-primary bg-primary/10",
    },
    {
      icon: BarChart3,
      title: "Real-time Sales Dashboard",
      description:
        "Your business health at a glance. See resolved issues, active automations, and total revenue across all branches instantly.",
      span: "lg:col-span-1",
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    },
    {
      icon: Package,
      title: "Smart Inventory Tracking",
      description:
        "Monitor paper stock, ink levels, and consumables. Get automated alerts before you run out during a busy day.",
      span: "lg:col-span-1",
      color: "text-orange-600 dark:text-orange-400 bg-orange-500/10",
    },
    {
      icon: Zap,
      title: "Workflow Automations",
      description:
        "Set up automated workflows to reduce manual work. Trigger alerts and actions when specific thresholds are hit.",
      span: "lg:col-span-2",
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    },
  ];

  const microFeatures = [
    { icon: Monitor, label: "Computer Tracking" },
    { icon: Users, label: "Customer CRM" },
    { icon: Wallet, label: "Expense Management" },
    { icon: FileText, label: "Exportable Reports" },
    { icon: Bot, label: "AI Task Board" },
    { icon: Shield, label: "Manager Auth" },
  ];
</script>

<LandingLayout active="/features">
  <!-- Hero Section -->
  <Motion
    let:motion
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    <section
      use:motion
      class="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-24 bg-background bg-grid"
    >
      <NoiseOverlay intensity="medium" />
      <div class="hero-ambient" aria-hidden="true">
        <span class="hero-orb hero-orb-1"></span>
        <span class="hero-orb hero-orb-2"></span>
        <span class="hero-orb hero-orb-3"></span>
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-6 text-center sm:px-8">
        <Badge
          variant="outline"
          class="mb-6 gap-2 border-primary/30 bg-primary/10 px-3 py-1 text-primary"
        >
          <Sparkles class="h-3.5 w-3.5" />
          The complete platform
        </Badge>
        <h1
          class="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[4rem] lg:leading-[1.1]"
        >
          Powerful tools for
          <span class="text-primary">every operation</span>
        </h1>
        <p
          class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          From the dashboard on your desk to the WhatsApp alerts in your pocket — 
          Bizflow is the central nervous system for your business.
        </p>
      </div>
    </section>
  </Motion>

  <!-- Dual WhatsApp Section -->
  <Motion
    let:motion
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
  >
    <section use:motion class="py-24 bg-card/30 border-y border-border/50">
      <div class="mx-auto max-w-7xl px-6 sm:px-8">
        <div class="text-center mb-16">
          <h2
            class="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-4"
          >
            The Dual-WhatsApp Architecture
          </h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            We don't just give you a dashboard. We give you a direct pipeline to your business and your customers, powered entirely by WhatsApp.
          </p>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <!-- WhatsApp for Business -->
          <div class="relative overflow-hidden rounded-3xl glow-panel bg-card/60 border border-border/60 p-8 sm:p-10">
            <NoiseOverlay intensity="light" />
            <div class="relative z-10">
              <div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                <MessageCircle class="h-6 w-6" />
              </div>
              <h3 class="font-heading text-2xl font-bold text-foreground mb-3">
                {whatsappFeatures.business.title}
              </h3>
              <p class="text-muted-foreground leading-relaxed mb-8">
                {whatsappFeatures.business.description}
              </p>
              <div class="grid sm:grid-cols-2 gap-4">
                {#each whatsappFeatures.business.benefits as benefit}
                  <div class="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2 class="h-4 w-4 text-[#25D366]" />
                    {benefit}
                  </div>
                {/each}
              </div>
            </div>
          </div>

          <!-- WhatsApp for Customers -->
          <div class="relative overflow-hidden rounded-3xl glow-panel bg-card/60 border border-border/60 p-8 sm:p-10">
            <NoiseOverlay intensity="light" />
            <div class="relative z-10">
              <div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Smartphone class="h-6 w-6" />
              </div>
              <h3 class="font-heading text-2xl font-bold text-foreground mb-3">
                {whatsappFeatures.customer.title}
              </h3>
              <p class="text-muted-foreground leading-relaxed mb-8">
                {whatsappFeatures.customer.description}
              </p>
              <div class="grid sm:grid-cols-2 gap-4">
                {#each whatsappFeatures.customer.benefits as benefit}
                  <div class="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2 class="h-4 w-4 text-blue-500" />
                    {benefit}
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Motion>

  <!-- Core Bento Grid -->
  <Motion
    let:motion
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}
  >
    <section use:motion class="py-24">
      <div class="mx-auto max-w-7xl px-6 sm:px-8">
        <div class="mb-12">
          <h2
            class="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Core Platform Features
          </h2>
          <p class="mt-3 text-lg text-muted-foreground">
            Everything you need, built natively into the dashboard.
          </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          {#each coreFeatures as feature}
            <div class="{feature.span} relative overflow-hidden rounded-3xl surface-panel border-border/60 p-8 transition hover:border-primary/30">
              <div class="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div class="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg {feature.color}">
                    <feature.icon class="h-5 w-5" />
                  </div>
                  <h3 class="font-heading text-xl font-bold tracking-tight text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p class="text-sm leading-relaxed text-muted-foreground max-w-[85%]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Micro Features Footer -->
        <div class="mt-12 flex flex-wrap justify-center gap-3 sm:gap-4">
          {#each microFeatures as feature}
            <Badge variant="secondary" class="px-4 py-2 text-xs font-medium border-border/40 gap-2 bg-card">
              <feature.icon class="h-3.5 w-3.5 text-primary" />
              {feature.label}
            </Badge>
          {/each}
        </div>
      </div>
    </section>
  </Motion>

  <!-- CTA -->
  <Motion
    let:motion
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
  >
    <section use:motion class="relative overflow-hidden border-t border-border/50 py-24 bg-grid">
      <NoiseOverlay intensity="light" />
      <div class="relative z-10 mx-auto max-w-3xl px-6 text-center sm:px-8">
        <h2
          class="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          See it in action
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          Sign in with demo credentials and explore the full dashboard, transaction
          logging, and the WhatsApp integrations — no setup required.
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
