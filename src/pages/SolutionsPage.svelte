<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    ArrowRight,
    CheckCircle2,
    GraduationCap,
    Monitor,
    Printer,
    Sparkles,
    Building2,
    Users,
    TrendingUp,
    Clock,
    Wallet,
    FileText,
    ShoppingBag,
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

  const solutions = [
    {
      icon: Printer,
      title: "Printing & Photocopy Shops",
      tagline: "Never lose track of a print job again",
      description:
        "Dedicated printing shops handle dozens of jobs daily — color prints, black & white copies, laminations, and bindings. Bizflow lets you log each job with the customer name, page count, and amount in Naira.",
      features: [
        "Log print jobs by type and quantity",
        "Track daily printing revenue",
        "Customer name on every record",
        "See today's total at a glance",
      ],
      stats: { label: "Avg. jobs per day", value: "40+" },
      color: "from-blue-500/10 to-primary/10",
      iconColor: "text-primary bg-primary/10",
    },
    {
      icon: Monitor,
      title: "Cyber Cafés & Business Centers",
      tagline: "One system for every service you offer",
      description:
        "Business centers combine printing, computer rentals, internet access, typing, and graphics into one operation. Bizflow supports all service types in a single transaction log, so nothing falls through the cracks.",
      features: [
        "5 service categories built-in",
        "Computer session tracking",
        "Multi-service daily totals",
        "Sidebar navigation for all modules",
      ],
      stats: { label: "Service types", value: "5+" },
      color: "from-cyan-500/10 to-blue-500/10",
      iconColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
    },
    {
      icon: GraduationCap,
      title: "Training & Education Centers",
      tagline: "Manage enrollments and session fees",
      description:
        "Training centers need to track course enrollments, session payments, and student records alongside their other services. Bizflow's flexible service logging handles training fees just like any other transaction.",
      features: [
        "Log training session payments",
        "Track student customers",
        "Combine with other services",
        "Monthly revenue summaries",
      ],
      stats: { label: "Students tracked", value: "100+" },
      color: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
    },
    {
      icon: Sparkles,
      title: "Graphics & Design Studios",
      tagline: "Track creative work and client payments",
      description:
        "Graphics designers handle logos, banners, flyers, and custom artwork with varying prices. Log each project with the client name, description, and agreed amount — keeping your creative business financially organized.",
      features: [
        "Project-based transaction logging",
        "Client name and description fields",
        "Flexible pricing per project",
        "Portfolio of completed work via records",
      ],
      stats: { label: "Projects per month", value: "25+" },
      color: "from-pink-500/10 to-orange-500/10",
      iconColor: "text-pink-600 dark:text-pink-400 bg-pink-500/10",
    },
    {
      icon: Building2,
      title: "Multi-Service Hubs",
      tagline: "Scale across locations and teams",
      description:
        "Growing business centers with multiple staff members need a shared system everyone can use. Bizflow's manager authentication and consistent interface make it easy for any team member to log transactions.",
      features: [
        "Manager-level access control",
        "Consistent UI across modules",
        "Shared transaction history",
        "Activity stream for team visibility",
      ],
      stats: { label: "Team members", value: "3–10" },
      color: "from-green-500/10 to-teal-500/10",
      iconColor: "text-green-600 dark:text-green-400 bg-green-500/10",
    },
    {
      icon: Users,
      title: "Freelance & Solo Operators",
      tagline: "Professional tools without the overhead",
      description:
        "Running a one-person business center? Bizflow gives you the same professional transaction tracking and revenue visibility as larger operations — without complexity or high costs.",
      features: [
        "Free to start",
        "No setup required",
        "Demo credentials available",
        "Works on any device",
      ],
      stats: { label: "Setup time", value: "< 5 min" },
      color: "from-amber-500/10 to-yellow-500/10",
      iconColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    },
  ];

  const painPoints = [
    {
      problem: "Lost revenue from unlogged services",
      solution: "Every transaction logged with amount, customer, and service type",
      icon: Wallet,
    },
    {
      problem: "No visibility into daily performance",
      solution: "Live dashboard with today's total and transaction count",
      icon: TrendingUp,
    },
    {
      problem: "Paper notebooks get lost or damaged",
      solution: "Digital records that persist and are always accessible",
      icon: FileText,
    },
    {
      problem: "Can't remember repeat customers",
      solution: "Customer names stored on every transaction for easy lookup",
      icon: Users,
    },
  ];
</script>

<LandingLayout active="/solutions">
  <Motion let:motion initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
    <section use:motion class="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
      <NoiseOverlay intensity="medium" />
      <div
        class="absolute -top-24 left-1/2 -z-10 h-[30rem] w-[60rem] -translate-x-1/2 opacity-20 dark:opacity-10"
      >
        <div
          class="absolute inset-0 rounded-[100%] bg-gradient-to-br from-primary via-purple-400 to-pink-300 blur-3xl dark:from-primary dark:via-purple-800 dark:to-pink-900"
        ></div>
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-6 text-center sm:px-8">
        <Badge
          variant="outline"
          class="mb-6 gap-2 border-primary/30 bg-primary/10 px-3 py-1 text-primary"
        >
          <Sparkles class="h-3.5 w-3.5" />
          Industry solutions
        </Badge>
        <h1
          class="font-heading text-4xl font-black tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl"
        >
          The right fit for
          <span class="text-primary">your business</span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Bizflow isn't generic software — it's built specifically for the service
          businesses that power communities across Africa.
        </p>
      </div>
    </section>
  </Motion>

  <Motion let:motion initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}>
    <section use:motion class="border-y border-border/50 bg-card/50 py-16">
      <div class="mx-auto max-w-7xl px-6 sm:px-8">
        <p class="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-8">
          Common challenges we solve
        </p>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {#each painPoints as item, index}
            <Motion let:motion initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.06 + index * 0.08, ease: "easeOut" }}>
              <div use:motion class="rounded-xl border border-border/60 bg-background p-5">
                <item.icon class="h-5 w-5 text-primary mb-3" />
                <p class="text-sm font-medium text-foreground mb-2">{item.problem}</p>
                <p class="text-xs leading-relaxed text-muted-foreground flex items-start gap-1.5">
                  <CheckCircle2 class="h-3.5 w-3.5 shrink-0 text-green-500 mt-0.5" />
                  {item.solution}
                </p>
              </div>
            </Motion>
          {/each}
        </div>
      </div>
    </section>
  </Motion>

  <Motion let:motion initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}>
    <section use:motion class="py-24">
      <div class="mx-auto max-w-7xl px-6 sm:px-8">
        <div class="space-y-8">
          {#each solutions as solution, i}
            <Motion let:motion initial={{ opacity: 0, x: i % 2 === 0 ? -18 : 18, y: 18 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.5, delay: 0.08 + i * 0.08, ease: "easeOut" }}>
              <div use:motion class="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br {solution.color}">
                <NoiseOverlay intensity="light" class="rounded-2xl" />
                <div class="relative z-10 grid items-center gap-8 p-8 lg:grid-cols-2 lg:p-10">
                  <div class={i % 2 === 1 ? "lg:order-2" : ""}>
                    <div
                      class="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl {solution.iconColor}"
                    >
                      <solution.icon class="h-6 w-6" />
                    </div>
                    <h2
                      class="font-heading text-2xl font-black tracking-[-0.04em] text-foreground sm:text-3xl"
                    >
                      {solution.title}
                    </h2>
                    <p class="mt-1 text-sm font-medium text-primary">{solution.tagline}</p>
                    <p class="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {solution.description}
                    </p>
                    <ul class="mt-6 space-y-2.5">
                      {#each solution.features as feature}
                        <li class="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle2 class="h-4 w-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      {/each}
                    </ul>
                  </div>

                  <div class={i % 2 === 1 ? "lg:order-1" : ""}>
                    <Card.Root class="border-border/60 bg-card/80 backdrop-blur-sm">
                      <Card.Content class="p-6">
                        <div class="mb-6 flex items-center justify-between">
                          <div>
                            <p class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                              Key metric
                            </p>
                            <p
                              class="font-heading text-3xl font-black tracking-[-0.04em] text-primary"
                            >
                              {solution.stats.value}
                            </p>
                          </div>
                          <Badge variant="outline" class="text-xs">{solution.stats.label}</Badge>
                        </div>

                        <div class="space-y-3">
                          <p class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            Sample transactions
                          </p>
                          {#each [
                            { service: "Service", customer: "Customer", amount: "₦4,500" },
                            { service: "Service", customer: "Customer", amount: "₦2,800" },
                          ] as tx}
                            <div
                              class="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 px-3 py-2.5"
                            >
                              <div class="flex items-center gap-2">
                                <ShoppingBag class="h-4 w-4 text-primary" />
                                <div>
                                  <p class="text-sm font-medium">{tx.service}</p>
                                  <p class="text-xs text-muted-foreground">{tx.customer}</p>
                                </div>
                              </div>
                              <p class="text-sm font-semibold">{tx.amount}</p>
                            </div>
                          {/each}
                        </div>

                        <div class="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock class="h-3.5 w-3.5" />
                          Updated in real-time
                        </div>
                      </Card.Content>
                    </Card.Root>
                  </div>
                </div>
              </div>
            </Motion>
          {/each}
        </div>
      </div>
    </section>
  </Motion>

  <Motion let:motion initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}>
    <section use:motion class="relative overflow-hidden border-t border-border/50 py-20">
      <NoiseOverlay intensity="medium" />
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-purple-400/5"
      ></div>
      <div class="relative z-10 mx-auto max-w-3xl px-6 text-center sm:px-8">
        <h2
          class="font-heading text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl"
        >
          Find your perfect setup
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          No matter your business type, Bizflow adapts to how you work. Start free
          and see the difference in your first day.
        </p>
        <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onclick={handleGetStarted} size="lg" class="h-12 px-8 text-sm font-semibold">
            Get started free
            <ArrowRight class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="h-12 px-8 text-sm font-semibold"
            onclick={() => goto("/features")}
          >
            View all features
          </Button>
        </div>
      </div>
    </section>
  </Motion>
</LandingLayout>
