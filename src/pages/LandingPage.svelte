<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    ArrowRight,
    BarChart3,
    Bot,
    Monitor,
    Printer,
    ShoppingBag,
    GraduationCap,
  } from "@lucide/svelte";
  import { Motion } from "svelte-motion";
  import LandingLayout from "$lib/components/landing/LandingLayout.svelte";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";

  function handleGetStarted() {
    goto("/register");
  }

  const stats = [
    { value: "01", label: "Workspace for your business" },
    { value: "₦", label: "Pricing built for local trade" },
    { value: "24/7", label: "A clearer view of operations" },
    { value: "1-click", label: "Fast daily recording" },
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
      title: "Create your workspace",
      description: "Set up your owner account and business in a few minutes.",
    },
    {
      step: "02",
      title: "Shape your day",
      description:
        "Configure services, pricing, and the workflow your team uses.",
    },
    {
      step: "03",
      title: "Bring your team in",
      description: "Let owners and staff sign in with the access they need.",
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
      class="relative overflow-hidden pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-16 lg:pb-12 bg-background bg-grid"
    >
      <NoiseOverlay intensity="medium" />
      <div class="hero-ambient" aria-hidden="true">
        <span class="hero-orb hero-orb-1"></span>
        <span class="hero-orb hero-orb-2"></span>
        <span class="hero-orb hero-orb-3"></span>
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        <div class="grid items-top gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div
              class="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
            >
              <span class="h-px w-8 bg-primary"></span>
              One calm place to run the day
            </div>

            <h1
              class="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[4rem] lg:leading-[1.1]"
            >
              Make every part of your business
              <span class="text-primary">flow better.</span>
            </h1>

            <p
              class="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              Bizflow brings sales, services, customers, and your team into one
              focused workspace, so you can spend less time catching up and more
              time moving the business forward.
            </p>

            <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                onclick={handleGetStarted}
                size="lg"
                class="h-12 px-8 text-sm font-semibold"
              >
                Create your workspace
                <ArrowRight class="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                class="h-12 px-8 text-sm font-semibold"
                onclick={() => goto("/features")}
              >
                See how it works
              </Button>
            </div>
          </div>

          <div class="hero-mascot-wrap relative">
            <img
              src="/bizflow-mascot.png"
              alt="Bizflow mascot holding business tools"
              class="hero-mascot relative z-10 block h-auto w-full object-contain"
            />

            <div
              class="hero-status absolute right-[10%] bottom-[10%] z-20 rounded-xl border border-white/20 bg-white/10 px-3 py-2 shadow-lg backdrop-blur-md dark:bg-black/20 sm:px-4 sm:py-3"
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
    <section use:motion class="border-y border-border/40 bg-card/30 py-12">
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
      class="relative overflow-hidden border-t border-border/40 bg-muted/20 py-24 bg-grid"
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
            Start with a clear workspace
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
      class="relative overflow-hidden border-t border-border/40 py-28 bg-grid"
    >
      <NoiseOverlay intensity="medium" />
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-t from-primary/10 via-transparent to-transparent"
      ></div>
      <div class="relative z-10 mx-auto max-w-3xl px-6 text-center sm:px-8">
        <h2
          class="font-heading text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl"
        >
          Give your business a better operating rhythm.
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          Create your business workspace today. Your team can sign in whenever
          they need to keep the day moving.
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
            Explore solutions
          </Button>
        </div>
      </div>
    </section>
  </Motion>
</LandingLayout>
