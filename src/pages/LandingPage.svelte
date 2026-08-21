<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    ArrowRight,
    BarChart3,
    Bot,
    CheckCircle2,
    LayoutGrid,
    Monitor,
    Printer,
    Sparkles,
    TrendingUp,
    Users,
    ShoppingBag,
    GraduationCap,
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

  const stats = [
    { value: "5+", label: "Service types tracked" },
    { value: "₦", label: "Naira-native pricing" },
    { value: "Real-time", label: "Daily sales totals" },
    { value: "1-click", label: "Transaction logging" },
  ];

  const featureHighlights = [
    {
      icon: ShoppingBag,
      title: "Transaction Logging",
      description:
        "Record printing, typing, graphics, and training services in seconds with customer details and amounts.",
      color: "text-primary bg-primary/10",
    },
    {
      icon: BarChart3,
      title: "Sales Dashboard",
      description:
        "See today's revenue, active services, and business health from a single control panel.",
      color: "text-green-600 dark:text-green-400 bg-green-500/10",
    },
    {
      icon: Bot,
      title: "AI Task Tracking",
      description:
        "Monitor features and improvements built with AI — transparent development progress for your team.",
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    },
  ];

  const solutions = [
    {
      icon: Printer,
      title: "Printing Shops",
      description:
        "Track every print job, photocopy, and binding service with customer names and amounts.",
    },
    {
      icon: Monitor,
      title: "Cyber Cafés",
      description:
        "Manage computer rentals, internet sessions, and bundled service packages effortlessly.",
    },
    {
      icon: GraduationCap,
      title: "Training Centers",
      description:
        "Log course enrollments, session fees, and student payments in one organized system.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Sign in",
      description: "Use your manager credentials to access your dashboard.",
    },
    {
      step: "02",
      title: "Log services",
      description:
        "Record each transaction — printing, typing, design, or training.",
    },
    {
      step: "03",
      title: "Track growth",
      description: "Watch daily totals climb and spot trends in your revenue.",
    },
  ];
</script>

<LandingLayout>
  <Motion
    let:motion
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    <section
      use:motion
      class="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32"
    >
      <NoiseOverlay intensity="medium" />
      <div class="hero-ambient" aria-hidden="true">
        <span class="hero-orb hero-orb-1"></span>
        <span class="hero-orb hero-orb-2"></span>
        <span class="hero-orb hero-orb-3"></span>
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge
              variant="outline"
              class="mb-6 gap-2 border-primary/30 bg-primary/10 px-3 py-1 text-primary"
            >
              <Sparkles class="h-3.5 w-3.5" />
              Built for African business centers
            </Badge>

            <h1
              class="font-heading text-4xl font-black tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl"
            >
              Run your business center
              <span class="text-primary">like a pro</span>
            </h1>

            <p
              class="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              Bizflow helps printing shops, cyber cafés, and training centers
              track every service, every customer, and every naira — all from
              one sleek dashboard.
            </p>

            <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                onclick={handleGetStarted}
                size="lg"
                class="h-12 px-8 text-sm font-semibold"
              >
                Start for free
                <ArrowRight class="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                class="h-12 px-8 text-sm font-semibold"
                onclick={() => goto("/features")}
              >
                Explore features
              </Button>
            </div>

            <div class="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {#each ["Printing", "Typing", "Graphics", "Training"] as tag}
                <span
                  class="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <CheckCircle2 class="h-4 w-4 text-primary" />
                  {tag}
                </span>
              {/each}
            </div>
          </div>

          <div class="relative">
            <div
              class="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_80px_rgba(0,82,204,0.12)]"
            >
              <NoiseOverlay intensity="light" class="rounded-2xl" />
              <div class="relative z-10 p-5 sm:p-6">
                <div class="mb-4 flex items-center justify-between">
                  <div>
                    <p
                      class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      Today's overview
                    </p>
                    <p
                      class="font-heading text-2xl font-black tracking-[-0.04em] text-foreground"
                    >
                      ₦13,700
                    </p>
                  </div>
                  <Badge
                    class="bg-green-500/10 text-green-600 dark:text-green-400"
                  >
                    <TrendingUp class="h-3 w-3" />
                    +18%
                  </Badge>
                </div>

                <div class="grid grid-cols-3 gap-3 mb-5">
                  {#each [{ label: "Transactions", value: "12", icon: ShoppingBag }, { label: "Services", value: "5", icon: LayoutGrid }, { label: "Customers", value: "8", icon: Users }] as stat}
                    <div
                      class="rounded-xl border border-border/60 bg-background/80 p-3"
                    >
                      <stat.icon class="h-4 w-4 text-primary mb-1.5" />
                      <p
                        class="font-heading text-lg font-black tracking-[-0.04em]"
                      >
                        {stat.value}
                      </p>
                      <p class="text-[10px] text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  {/each}
                </div>

                <div class="space-y-2">
                  <p
                    class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2"
                  >
                    Recent transactions
                  </p>
                  {#each [{ service: "Printing", customer: "Adebayo T.", amount: "₦5,500" }, { service: "Typing", customer: "Grace C.", amount: "₦8,200" }] as tx}
                    <div
                      class="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 px-3 py-2.5"
                    >
                      <div>
                        <p class="text-sm font-medium text-foreground">
                          {tx.service}
                        </p>
                        <p class="text-xs text-muted-foreground">
                          {tx.customer}
                        </p>
                      </div>
                      <p class="text-sm font-semibold text-foreground">
                        {tx.amount}
                      </p>
                    </div>
                  {/each}
                </div>
              </div>
            </div>

            <div
              class="absolute -bottom-4 -left-4 rounded-xl border border-border bg-card px-4 py-3 shadow-lg"
            >
              <div class="flex items-center gap-2">
                <div
                  class="h-2 w-2 rounded-full bg-green-500 animate-pulse"
                ></div>
                <p class="text-xs font-medium text-foreground">
                  Live tracking active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Motion>

  <Motion
    let:motion
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
  >
    <section use:motion class="border-y border-border/50 bg-card/50 py-10">
      <div class="mx-auto max-w-7xl px-6 sm:px-8">
        <div class="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {#each stats as stat}
            <div class="text-center sm:text-left">
              <p
                class="font-heading text-2xl font-black tracking-[-0.04em] text-primary"
              >
                {stat.value}
              </p>
              <p class="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>
  </Motion>

  <Motion
    let:motion
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
  >
    <section use:motion class="py-24">
      <div class="mx-auto max-w-7xl px-6 sm:px-8">
        <div class="mx-auto max-w-2xl text-center mb-14">
          <p class="text-[10px] uppercase tracking-[0.2em] text-primary mb-3">
            Core features
          </p>
          <h2
            class="font-heading text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl"
          >
            Everything your center needs
          </h2>
          <p class="mt-4 text-lg text-muted-foreground">
            Stop juggling notebooks and spreadsheets. Bizflow keeps your
            operations organized and your revenue visible.
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each featureHighlights as feature, index}
            <Motion
              let:motion
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.08 + index * 0.1,
                ease: "easeOut",
              }}
            >
              <div use:motion>
                <Card.Root
                  class="h-full border-border/60 bg-card transition hover:shadow-md hover:border-primary/20"
                >
                  <Card.Header>
                    <div
                      class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg {feature.color}"
                    >
                      <feature.icon class="h-5 w-5" />
                    </div>
                    <Card.Title
                      class="font-heading text-lg font-bold tracking-[-0.03em]"
                    >
                      {feature.title}
                    </Card.Title>
                    <Card.Description class="text-sm leading-relaxed">
                      {feature.description}
                    </Card.Description>
                  </Card.Header>
                </Card.Root>
              </div>
            </Motion>
          {/each}
        </div>

        <div class="mt-10 text-center">
          <Button
            variant="outline"
            onclick={() => goto("/features")}
            class="gap-2"
          >
            View all features
            <ArrowRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  </Motion>

  <Motion
    let:motion
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.14 }}
  >
    <section
      use:motion
      class="relative overflow-hidden border-t border-border/50 bg-muted/30 py-24"
    >
      <NoiseOverlay intensity="light" />
      <div class="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        <div class="mx-auto max-w-2xl text-center mb-14">
          <p class="text-[10px] uppercase tracking-[0.2em] text-primary mb-3">
            Solutions
          </p>
          <h2
            class="font-heading text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl"
          >
            Built for your type of business
          </h2>
          <p class="mt-4 text-lg text-muted-foreground">
            Whether you run a print shop or a full business center, Bizflow
            adapts to how you work.
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-3">
          {#each solutions as solution, index}
            <Motion
              let:motion
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.06 + index * 0.12,
                ease: "easeOut",
              }}
            >
              <div
                use:motion
                class="group rounded-2xl border border-border/60 bg-card p-8 transition hover:border-primary/30 hover:shadow-lg"
              >
                <div
                  class="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <solution.icon class="h-6 w-6" />
                </div>
                <h3
                  class="font-heading text-xl font-bold tracking-[-0.03em] text-foreground"
                >
                  {solution.title}
                </h3>
                <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {solution.description}
                </p>
              </div>
            </Motion>
          {/each}
        </div>

        <div class="mt-10 text-center">
          <Button
            variant="outline"
            onclick={() => goto("/solutions")}
            class="gap-2"
          >
            See all solutions
            <ArrowRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  </Motion>

  <Motion
    let:motion
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}
  >
    <section use:motion class="py-24">
      <div class="mx-auto max-w-7xl px-6 sm:px-8">
        <div class="mx-auto max-w-2xl text-center mb-14">
          <p class="text-[10px] uppercase tracking-[0.2em] text-primary mb-3">
            How it works
          </p>
          <h2
            class="font-heading text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl"
          >
            Up and running in minutes
          </h2>
        </div>

        <div class="relative">
          <div class="grid gap-8 sm:grid-cols-3">
            {#each steps as item, i}
              <div class="text-center sm:text-left">
                <p
                  class="font-heading text-4xl font-black tracking-[-0.06em] text-primary/30"
                >
                  {item.step}
                </p>
                <h3
                  class="mt-2 font-heading text-xl font-bold tracking-[-0.03em] text-foreground"
                >
                  {item.title}
                </h3>
                <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            {/each}
          </div>

          {#each steps as _, i}
            {#if i < steps.length - 1}
              <div
                class="absolute top-8 hidden sm:block h-px bg-border"
                style="left: calc(33.333% + 4rem); width: calc(33.333% - 8rem); z-index: -1;"
              ></div>
            {/if}
          {/each}
        </div>
      </div>
    </section>
  </Motion>

  <Motion
    let:motion
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
  >
    <section
      use:motion
      class="relative overflow-hidden border-t border-border/50 py-24"
    >
      <NoiseOverlay intensity="medium" />
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-cyan-400/5"
      ></div>
      <div class="relative z-10 mx-auto max-w-3xl px-6 text-center sm:px-8">
        <h2
          class="font-heading text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl"
        >
          Ready to modernize your business center?
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          Join business centers already using Bizflow to track services, grow
          revenue, and run operations with clarity.
        </p>
        <div
          class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Button
            onclick={handleGetStarted}
            size="lg"
            class="h-12 px-8 text-sm font-semibold"
          >
            Get started free
            <ArrowRight class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="h-12 px-8 text-sm font-semibold"
            onclick={() => goto("/solutions")}
          >
            Find your solution
          </Button>
        </div>
      </div>
    </section>
  </Motion>
</LandingLayout>
