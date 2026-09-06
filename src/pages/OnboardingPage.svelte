<script lang="ts">
  import { goto } from "$app/navigation";
  import { ArrowRight, Check, MapPin, Users } from "@lucide/svelte";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { NativeSelect } from "$lib/components/ui/native-select";
  import { Button } from "$lib/components/ui/button";
  import BetaPill from "$lib/components/ui/beta-pill.svelte";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";
  import { authStore, completeOnboarding } from "$lib/stores/auth";
  import {
    initializeTeam,
    inviteMember,
    type TeamRole,
  } from "$lib/stores/team";
  import { toast } from "svelte-sonner";

  let businessName = "";
  let businessType = "";
  let address = "";
  let city = "";
  let country = "Nigeria";
  let teamSize = "1-5 people";
  let services = "Printing and documents";
  let loading = false;
  let currentStep = 1;
  let inviteName = "";
  let inviteEmail = "";
  let inviteRole: TeamRole = "STAFF";
  let inviteError = "";

  function continueToInvite() {
    currentStep = 2;
  }

  async function addInvite(event: SubmitEvent) {
    event.preventDefault();
    inviteError = "";
    if (!inviteName.trim() || !inviteEmail.trim()) {
      inviteError = "Add a name and email address, or skip this step.";
      return;
    }
    initializeTeam($authStore.user, businessName);
    try {
      await inviteMember({
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      await finishOnboarding();
    } catch (error) {
      toast.error("Invitation failed", {
        description:
          error instanceof Error ? error.message : "Unable to send invitation.",
      });
    }
  }

  async function finishOnboarding() {
    loading = true;

    try {
      await completeOnboarding({
        businessName,
        type: businessType,
        streetAddress: address,
        city,
        country,
        teamSize,
        primaryService: services,
      });

      initializeTeam($authStore.user, businessName);
      goto("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to complete onboarding.";
      toast.error("Workspace setup failed", {
        description: message,
      });
    } finally {
      loading = false;
    }
  }
</script>

<div
  class="onboarding-page relative min-h-screen overflow-hidden bg-background text-foreground"
>
  <NoiseOverlay intensity="medium" />
  <div class="onboarding-mascot-glow" aria-hidden="true"></div>
  <img
    src="/onboarding-bizzy.png"
    alt="Bizzy mascot looking toward the onboarding form"
    class="onboarding-mascot"
  />
  <header
    class="relative z-20 border-b border-border/50 bg-background/80 backdrop-blur-xl"
  >
    <div
      class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8"
    >
      <a href="/" class="flex items-center gap-3"
        ><img
          src="/cafe-logo.png"
          alt="Bizflow logo"
          class="size-10 object-contain"
        /><span class="flex items-center gap-2">
          <span class="font-heading text-xl font-black tracking-[-0.04em]"
            >Bizflow</span
          >
          <BetaPill class="hidden sm:inline-flex" />
        </span></a
      >
      <span
        class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
        >Workspace setup</span
      >
    </div>
  </header>

  <main class="relative z-10 mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:py-20">
    <div class="mb-12 max-w-2xl">
      <p
        class="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary"
      >
        One last step
      </p>
      <h1
        class="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl"
      >
        Make Bizflow fit your <span class="text-primary">day.</span>
      </h1>
      <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
        Tell us about your business so your first dashboard feels useful
        immediately.
      </p>
    </div>

    <div class="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-20">
      <aside class="border-l-2 border-primary/30 pl-6 lg:pt-3">
        <div class="flex flex-col gap-7">
          <div class={`flex gap-4 ${currentStep === 2 ? "text-primary" : ""}`}>
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
              ><Check class="size-4" /></span
            >
            <div>
              <p class="font-semibold">Owner account created</p>
              <p class="mt-1 text-sm text-muted-foreground">
                Your secure workspace access is ready.
              </p>
            </div>
          </div>
          <div class="flex gap-4">
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary text-primary"
              ><MapPin class="size-4" /></span
            >
            <div>
              <p class="font-semibold">Business profile</p>
              <p class="mt-1 text-sm text-muted-foreground">
                Add the details that shape your workspace.
              </p>
            </div>
          </div>
          <div class="flex gap-4">
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground"
              ><Users class="size-4" /></span
            >
            <div>
              <p class="font-semibold text-muted-foreground">
                Invite your team
              </p>
              <p class="mt-1 text-sm text-muted-foreground">
                Add staff from your dashboard whenever you are ready.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <section class="onboarding-card max-w-3xl rounded-2xl p-6 sm:p-10">
        <div class="relative z-10">
          {#if currentStep === 1}
            <div class="mb-8">
              <p
                class="text-xs font-semibold uppercase tracking-[0.2em] text-primary"
              >
                Business profile
              </p>
              <h2 class="mt-3 font-heading text-2xl font-bold">
                Set your starting point
              </h2>
              <p class="mt-2 text-sm text-muted-foreground">
                These details can be updated later.
              </p>
            </div>
            <div class="flex flex-col gap-6">
              <div class="grid gap-5 sm:grid-cols-2">
                <div class="flex flex-col gap-2">
                  <Label for="business-name">Business name</Label><Input
                    id="business-name"
                    bind:value={businessName}
                    required
                    placeholder="Aisha Business Center"
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="business-type">Type of business</Label
                  ><NativeSelect
                    id="business-type"
                    bind:value={businessType}
                    required
                    ><option value="" disabled>Select a type</option><option
                      >Business center</option
                    ><option>Printing shop</option><option>Cyber cafe</option
                    ><option>Training center</option><option>Other</option
                    ></NativeSelect
                  >
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <Label for="address">Street address</Label><Input
                  id="address"
                  bind:value={address}
                  required
                  placeholder="12 Market Street"
                />
              </div>
              <div class="grid gap-5 sm:grid-cols-2">
                <div class="flex flex-col gap-2">
                  <Label for="city">City</Label><Input
                    id="city"
                    bind:value={city}
                    required
                    placeholder="Lagos"
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="country">Country</Label><NativeSelect
                    id="country"
                    bind:value={country}
                    ><option>Nigeria</option><option>Ghana</option><option
                      >Kenya</option
                    ><option>Other</option></NativeSelect
                  >
                </div>
              </div>
              <div class="grid gap-5 sm:grid-cols-2">
                <div class="flex flex-col gap-2">
                  <Label for="team-size">Team size</Label><NativeSelect
                    id="team-size"
                    bind:value={teamSize}
                    ><option>Just me</option><option>1-5 people</option><option
                      >6-15 people</option
                    ><option>16+ people</option></NativeSelect
                  >
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="services">Primary services</Label><NativeSelect
                    id="services"
                    bind:value={services}
                    ><option>Printing and documents</option><option
                      >Computer and internet services</option
                    ><option>Training and classes</option><option
                      >A mix of services</option
                    ></NativeSelect
                  >
                </div>
              </div>
            </div>
            <Button
              type="button"
              onclick={continueToInvite}
              class="mt-8 w-full py-3"
            >
              Continue to team setup<ArrowRight class="size-4" />
            </Button>
          {:else}
            <div class="mb-8">
              <p
                class="text-xs font-semibold uppercase tracking-[0.2em] text-primary"
              >
                Invite your team
              </p>
              <h2 class="mt-3 font-heading text-2xl font-bold">
                Bring your people in
              </h2>
              <p class="mt-2 text-sm text-muted-foreground">
                Invite a teammate now, or skip this and manage everyone from
                your dashboard later.
              </p>
            </div>
            <form class="flex flex-col gap-5" onsubmit={addInvite}>
              <div class="flex flex-col gap-2">
                <Label for="invite-name">Full name</Label><Input
                  id="invite-name"
                  bind:value={inviteName}
                  placeholder="Tosin Adeyemi"
                />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="invite-email">Email address</Label><Input
                  id="invite-email"
                  type="email"
                  bind:value={inviteEmail}
                  placeholder="tosin@example.com"
                />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="invite-role">Workspace role</Label><NativeSelect
                  id="invite-role"
                  bind:value={inviteRole}
                  ><option value="STAFF">Staff</option><option value="ADMIN"
                    >Admin</option
                  ></NativeSelect
                >
              </div>
              {#if inviteError}<p class="text-sm text-destructive">
                  {inviteError}
                </p>{/if}
              <div class="mt-3 flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={loading} class="flex-1"
                  >{loading
                    ? "Opening your workspace..."
                    : "Send invite & open workspace"}<ArrowRight
                    class="size-4"
                  /></Button
                >
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onclick={finishOnboarding}
                  class="flex-1">Skip for now</Button
                >
              </div>
            </form>
          {/if}
        </div>
      </section>
    </div>
  </main>
</div>
