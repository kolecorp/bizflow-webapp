<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    ArrowRight,
    BarChart3,
    Check,
    ChevronRight,
    Globe2,
    Layers3,
    MessageCircle,
    Monitor,
    Printer,
    ShieldCheck,
    Sparkles,
    UsersRound,
    WalletCards,
    Zap,
  } from "@lucide/svelte";
  import { Motion } from "svelte-motion";
  import LandingLayout from "$lib/components/landing/LandingLayout.svelte";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";
  import { Button } from "$lib/components/ui/button";

  const pillars = [
    {
      icon: Globe2,
      number: "01",
      title: "Reach customers",
      detail:
        "Meet customers where they already are with WhatsApp, SMS, USSD, and digital journeys.",
      items: ["Business alerts", "Customer receipts", "Marketing campaigns"],
    },
    {
      icon: WalletCards,
      number: "02",
      title: "Move money",
      detail:
        "Keep everyday sales and new revenue lines visible from the same workspace.",
      items: ["Transactions", "Wallet and payments", "VTU services"],
    },
    {
      icon: Monitor,
      number: "03",
      title: "Run operations",
      detail:
        "Give the team a shared operating picture for the work happening at the counter.",
      items: ["Computer sessions", "Printing workflows", "Team permissions"],
    },
    {
      icon: Zap,
      number: "04",
      title: "Work smarter",
      detail:
        "Use automation and AI to reduce repetitive work and make faster decisions.",
      items: ["Workflow automation", "Audit logs", "Activity insights"],
    },
  ];

  const audiences = [
    {
      icon: Printer,
      title: "Business centers",
      detail:
        "One system for printing, browsing, typing, graphics, training, and more.",
    },
    {
      icon: UsersRound,
      title: "Growing teams",
      detail: "Clear roles and shared context for owners, managers, and staff.",
    },
    {
      icon: Layers3,
      title: "Service businesses",
      detail:
        "Flexible tools that adapt as your offers and revenue streams expand.",
    },
  ];
</script>

<LandingLayout active="/solutions">
  <Motion
    let:motion
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.7 }}
  >
    <section use:motion class="relative overflow-hidden bg-background bg-grid">
      <NoiseOverlay intensity="medium" />
      <div class="hero-ambient" aria-hidden="true">
        <span class="hero-orb hero-orb-1"></span><span
          class="hero-orb hero-orb-2"
        ></span><span class="hero-orb hero-orb-3"></span>
      </div>
      <div class="solutions-hero__content relative z-10 mx-auto max-w-7xl">
        <div class="min-w-0 max-w-4xl">
          <p
            class="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary"
          >
            <Sparkles class="h-4 w-4" />Solutions for the way business moves
          </p>
          <h1
            class="mt-7 max-w-4xl font-heading text-5xl font-black leading-[1.03] tracking-tighter text-foreground sm:text-7xl lg:text-[5.5rem]"
          >
            One workspace.<br /><span class="text-primary"
              >Every opportunity.</span
            >
          </h1>
          <p
            class="mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground sm:text-2xl"
          >
            Bizflow connects the services, people, and decisions behind a modern
            business center, so you can grow beyond one counter and one revenue
            stream.
          </p>
          <div class="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              class="h-12 px-7"
              onclick={() => goto("/register")}
              >Start your workspace <ArrowRight class="h-4 w-4" /></Button
            ><Button
              size="lg"
              variant="outline"
              class="h-12 px-7"
              onclick={() => goto("/features")}>Explore the platform</Button
            >
          </div>
        </div>
        <div class="solutions-reel-wrap relative min-w-0" aria-hidden="true">
          <div class="solutions-reel-glow" aria-hidden="true"></div>
          <div class="solutions-reel relative overflow-hidden">
            <div class="solutions-reel__topline">
              <span></span><span></span><span></span>
              <p>Bizflow / connected workspace</p>
            </div>
            <div class="solutions-reel__viewport">
              <div class="solutions-reel__track">
                <svg
                  class="solutions-reel__scene"
                  viewBox="0 0 420 270"
                  role="img"
                  aria-label="Workspace switcher and service overview"
                >
                  <rect
                    width="420"
                    height="270"
                    rx="14"
                    fill="currentColor"
                    opacity=".035"
                  />
                  <rect
                    x="22"
                    y="22"
                    width="116"
                    height="226"
                    rx="8"
                    fill="currentColor"
                    opacity=".08"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="13"
                    fill="#339933"
                    opacity=".8"
                  /><rect
                    x="70"
                    y="42"
                    width="48"
                    height="7"
                    rx="3.5"
                    fill="currentColor"
                    opacity=".5"
                  />
                  <rect
                    x="38"
                    y="86"
                    width="78"
                    height="9"
                    rx="4"
                    fill="#339933"
                    opacity=".7"
                  /><rect
                    x="38"
                    y="111"
                    width="62"
                    height="7"
                    rx="3"
                    fill="currentColor"
                    opacity=".3"
                  /><rect
                    x="38"
                    y="135"
                    width="70"
                    height="7"
                    rx="3"
                    fill="currentColor"
                    opacity=".3"
                  />
                  <rect
                    x="158"
                    y="22"
                    width="240"
                    height="42"
                    rx="8"
                    fill="currentColor"
                    opacity=".08"
                  /><rect
                    x="178"
                    y="38"
                    width="92"
                    height="9"
                    rx="4"
                    fill="currentColor"
                    opacity=".55"
                  /><rect
                    x="332"
                    y="36"
                    width="44"
                    height="13"
                    rx="6"
                    fill="#339933"
                    opacity=".7"
                  />
                  <rect
                    x="158"
                    y="82"
                    width="112"
                    height="72"
                    rx="8"
                    fill="#339933"
                    opacity=".12"
                  /><rect
                    x="286"
                    y="82"
                    width="112"
                    height="72"
                    rx="8"
                    fill="currentColor"
                    opacity=".08"
                  /><text
                    x="178"
                    y="108"
                    fill="currentColor"
                    opacity=".55"
                    font-size="10">WORKSPACE</text
                  ><text
                    x="178"
                    y="137"
                    fill="currentColor"
                    font-size="25"
                    font-weight="700">Free</text
                  ><text
                    x="306"
                    y="108"
                    fill="currentColor"
                    opacity=".55"
                    font-size="10">SERVICES</text
                  ><text
                    x="306"
                    y="137"
                    fill="#339933"
                    font-size="25"
                    font-weight="700">08</text
                  >
                  <rect
                    x="158"
                    y="174"
                    width="240"
                    height="74"
                    rx="8"
                    fill="currentColor"
                    opacity=".08"
                  /><path
                    d="M180 226 218 207l34 10 38-25 38 12 32-30"
                    fill="none"
                    stroke="#339933"
                    stroke-width="3"
                    opacity=".8"
                  /><circle cx="360" cy="174" r="4" fill="#339933" />
                </svg>
                <svg
                  class="solutions-reel__scene"
                  viewBox="0 0 420 270"
                  role="img"
                  aria-label="Service integrations flowing into Bizflow"
                >
                  <rect
                    width="420"
                    height="270"
                    rx="14"
                    fill="currentColor"
                    opacity=".035"
                  /><text
                    x="26"
                    y="36"
                    fill="currentColor"
                    opacity=".55"
                    font-size="11"
                    letter-spacing="2">SERVICE INTEGRATIONS</text
                  >
                  <g
                    fill="currentColor"
                    opacity=".08"
                    stroke="#339933"
                    stroke-opacity=".7"
                    ><rect x="26" y="65" width="104" height="62" rx="9" /><rect
                      x="26"
                      y="145"
                      width="104"
                      height="62"
                      rx="9"
                    /><rect x="290" y="105" width="104" height="62" rx="9" /></g
                  >
                  <g fill="#339933" opacity=".8"
                    ><circle cx="53" cy="91" r="10" /><circle
                      cx="53"
                      cy="171"
                      r="10"
                    /><circle cx="317" cy="131" r="10" /></g
                  >
                  <g fill="currentColor" opacity=".7" font-size="11"
                    ><text x="72" y="95">WhatsApp</text><text x="72" y="175"
                      >Payments</text
                    ><text x="336" y="135">Bizflow</text></g
                  >
                  <path
                    d="M130 96h74q24 0 24 35v0q0 35 24 35h38M130 176h74q24 0 24-35v0q0-35 24-35h38"
                    fill="none"
                    stroke="#339933"
                    stroke-width="2"
                    stroke-dasharray="5 6"
                    opacity=".8"
                  /><circle
                    cx="270"
                    cy="131"
                    r="24"
                    fill="#339933"
                    opacity=".15"
                  /><path
                    d="m260 131 7 7 14-16"
                    fill="none"
                    stroke="#339933"
                    stroke-width="3"
                  />
                </svg>
                <svg
                  class="solutions-reel__scene"
                  viewBox="0 0 420 270"
                  role="img"
                  aria-label="Team roles and business activity"
                >
                  <rect
                    width="420"
                    height="270"
                    rx="14"
                    fill="currentColor"
                    opacity=".035"
                  /><text
                    x="26"
                    y="38"
                    fill="currentColor"
                    opacity=".55"
                    font-size="11"
                    letter-spacing="2">TEAM CONTROL</text
                  >
                  <rect
                    x="26"
                    y="62"
                    width="368"
                    height="42"
                    rx="8"
                    fill="currentColor"
                    opacity=".08"
                  /><rect
                    x="26"
                    y="116"
                    width="368"
                    height="42"
                    rx="8"
                    fill="currentColor"
                    opacity=".08"
                  /><rect
                    x="26"
                    y="170"
                    width="368"
                    height="42"
                    rx="8"
                    fill="currentColor"
                    opacity=".08"
                  />
                  <g fill="#339933"
                    ><circle cx="52" cy="83" r="11" /><circle
                      cx="52"
                      cy="137"
                      r="11"
                    /><circle cx="52" cy="191" r="11" /></g
                  ><g fill="currentColor" opacity=".7" font-size="11"
                    ><text x="75" y="80">Owner account</text><text
                      x="75"
                      y="94"
                      opacity=".5">Full workspace access</text
                    ><text x="75" y="134">Operations manager</text><text
                      x="75"
                      y="148"
                      opacity=".5">Team and reports</text
                    ><text x="75" y="188">Service staff</text><text
                      x="75"
                      y="202"
                      opacity=".5">Focused daily access</text
                    ></g
                  ><g fill="#339933" font-size="10"
                    ><text x="340" y="87">ACTIVE</text><text x="340" y="141"
                      >ACTIVE</text
                    ><text x="340" y="195">ACTIVE</text></g
                  >
                </svg>
              </div>
            </div>
            <div class="solutions-reel__fade" aria-hidden="true"></div>
            <div class="solutions-reel__footer">
              <span
                class="font-mono text-[10px] uppercase tracking-[0.18em] text-primary"
                >Scroll through your system</span
              ><span class="solutions-reel__line"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Motion>

  <section class="solutions-section border-y border-border/60 bg-card/40">
    <div class="solutions-section__content mx-auto max-w-7xl">
      <div class="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            The connected business
          </p>
          <h2
            class="mt-5 font-heading text-4xl font-black leading-tight tracking-tighter text-foreground sm:text-5xl"
          >
            Stop operating in pieces.
          </h2>
          <p class="mt-6 text-base leading-relaxed text-muted-foreground">
            Your customer conversations, transactions, team, and tools belong in
            the same picture. Bizflow gives them a common operating layer.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          {#each pillars as pillar}<article
              class="group rounded-xl border border-border/70 bg-background p-5 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
            >
              <div class="flex items-center justify-between">
                <div
                  class="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
                >
                  <pillar.icon class="h-5 w-5" />
                </div>
                <span class="font-mono text-xs font-bold text-primary"
                  >{pillar.number}</span
                >
              </div>
              <h3 class="mt-6 font-heading text-lg font-bold text-foreground">
                {pillar.title}
              </h3>
              <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
                {pillar.detail}
              </p>
              <ul class="mt-6 space-y-2 border-t border-border/60 pt-5">
                {#each pillar.items as item}<li
                    class="flex items-center gap-2 text-xs font-semibold text-foreground"
                  >
                    <Check class="h-3.5 w-3.5 text-primary" />{item}
                  </li>{/each}
              </ul>
              <ChevronRight
                class="mt-6 h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary"
              />
            </article>{/each}
        </div>
      </div>
    </div>
  </section>

  <section
    class="solutions-section relative overflow-hidden bg-background bg-grid"
  >
    <NoiseOverlay intensity="light" />
    <div class="solutions-section__content relative z-10 mx-auto max-w-7xl">
      <div
        class="flex flex-col gap-8 border-b border-border/70 pb-12 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Made for the next version of your business
          </p>
          <h2
            class="mt-5 max-w-2xl font-heading text-4xl font-black leading-tight tracking-tighter text-foreground sm:text-5xl"
          >
            Start where you are.<br />Build what comes next.
          </h2>
        </div>
        <p class="max-w-md text-base leading-relaxed text-muted-foreground">
          Whether you run solo or lead a growing team, Bizflow gives you the
          structure to add services without adding chaos.
        </p>
      </div>
      <div class="mt-12 grid gap-4 lg:grid-cols-3">
        {#each audiences as audience}<article
            class="rounded-xl border border-border/70 bg-card/90 p-5 backdrop-blur-sm"
          >
            <div
              class="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <audience.icon class="h-5 w-5" />
            </div>
            <h3 class="mt-6 font-heading text-lg font-bold text-foreground">
              {audience.title}
            </h3>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
              {audience.detail}
            </p>
          </article>{/each}
      </div>
    </div>
  </section>

  <section
    class="solutions-section relative overflow-hidden border-t border-border/60 bg-background bg-grid"
  >
    <NoiseOverlay intensity="light" />
    <div
      class="solutions-cta relative z-10 mx-auto flex max-w-7xl flex-col gap-10 rounded-2xl border border-primary/20 bg-primary/5 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="max-w-2xl">
        <p
          class="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary"
        >
          <ShieldCheck class="h-4 w-4" />A platform that stays open
        </p>
        <h2
          class="mt-5 font-heading text-3xl font-black leading-tight tracking-tighter text-foreground sm:text-5xl"
        >
          The foundation is free.<br />Your growth is yours.
        </h2>
        <p
          class="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground"
        >
          Use the workspace without a platform fee. Activate the services that
          make sense for your business, and keep building from one trusted
          system.
        </p>
      </div>
      <Button
        size="lg"
        class="h-12 shrink-0 px-7"
        onclick={() => goto("/register")}
        >Create your workspace <ArrowRight class="h-4 w-4" /></Button
      >
    </div>
  </section>
</LandingLayout>

<style>
  .solutions-reel-wrap {
    isolation: isolate;
    display: none;
  }

  @media (min-width: 1024px) {
    .solutions-reel-wrap {
      position: absolute;
      top: 43%;
      right: clamp(-24rem, -18vw, -10rem);
      display: block;
      width: min(52rem, 66vw);
      transform: translateY(-50%) rotate(45deg);
      opacity: 0.28;
      pointer-events: none;
    }
  }

  .solutions-reel-glow {
    position: absolute;
    inset: 12% -12% -10%;
    z-index: -1;
    border-radius: 999px;
    background: radial-gradient(
      circle,
      rgba(51, 153, 51, 0.22),
      transparent 68%
    );
    filter: blur(28px);
  }

  .solutions-reel {
    overflow: visible !important;
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    -webkit-mask-image: linear-gradient(
      90deg,
      transparent 0%,
      transparent 18%,
      rgba(0, 0, 0, 0.45) 38%,
      black 62%,
      black 100%
    );
    mask-image: linear-gradient(
      90deg,
      transparent 0%,
      transparent 18%,
      rgba(0, 0, 0, 0.45) 38%,
      black 62%,
      black 100%
    );
  }

  .solutions-reel__topline,
  .solutions-reel__footer {
    display: none;
    align-items: center;
    gap: 0.4rem;
    padding: 0.8rem 1rem;
    border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  }

  .solutions-reel__topline span {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 999px;
    background: var(--primary);
    opacity: 0.55;
  }

  .solutions-reel__topline p {
    margin-left: 0.45rem;
    overflow: hidden;
    color: var(--muted-foreground);
    font-family: var(--mono);
    font-size: 0.6rem;
    letter-spacing: 0.12em;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .solutions-reel__viewport {
    position: relative;
    height: clamp(28rem, 64vh, 44rem);
    overflow: hidden;
    mask-image: radial-gradient(ellipse at center, black 36%, transparent 76%);
    -webkit-mask-image: radial-gradient(
      ellipse at center,
      black 36%,
      transparent 76%
    );
  }

  .solutions-reel__track {
    display: flex;
    flex-direction: column;
    animation: solutions-reel-scroll 15s ease-in-out infinite;
  }

  .solutions-reel__scene {
    display: block;
    flex: 0 0 auto;
    width: 100%;
    height: auto;
    padding: 0.75rem;
    color: var(--foreground);
  }

  .solutions-reel__fade {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 48%;
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      color-mix(in srgb, var(--background) 72%, transparent) 76%,
      var(--background) 100%
    );
  }

  .solutions-reel__footer {
    justify-content: space-between;
    border-top: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
    border-bottom: 0;
  }

  .solutions-reel__line {
    width: 3rem;
    height: 1px;
    background: var(--primary);
    opacity: 0.6;
  }

  @keyframes solutions-reel-scroll {
    0%,
    24% {
      transform: translateY(0);
    }
    34%,
    57% {
      transform: translateY(-33.333%);
    }
    67%,
    90% {
      transform: translateY(-66.666%);
    }
    100% {
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .solutions-reel__track {
      animation: none;
      transform: translateY(0);
    }
  }

  @media (max-width: 1023px) {
    .solutions-reel-wrap {
      display: block;
      width: min(100%, 34rem);
      margin: 2rem auto 0;
      opacity: 0.38;
      transform: rotate(18deg);
    }

    .solutions-reel__viewport {
      height: 16rem;
    }

    .solutions-reel__footer,
    .solutions-reel__topline {
      padding-block: 0.6rem;
    }
  }

  .solutions-hero__content {
    padding: clamp(5rem, 10vw, 8rem) 1.5rem;
  }

  .solutions-section__content {
    padding: clamp(4.5rem, 8vw, 7rem) 1.5rem;
  }

  .solutions-cta {
    padding: clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 5vw, 3rem);
  }

  @media (min-width: 640px) {
    .solutions-hero__content,
    .solutions-section__content {
      padding-inline: 2rem;
    }
  }
</style>
