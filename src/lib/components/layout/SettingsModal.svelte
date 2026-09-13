<script lang="ts">
  import { modals } from "$lib/stores/modals";
  import * as Dialog from "$lib/components/ui/dialog";
  import {
    Bell,
    Building2,
    LockKeyhole,
    Palette,
    UserRound,
    Check,
    Moon,
    SunMedium,
    Monitor,
  } from "@lucide/svelte";
  import { mode, setMode } from "mode-watcher";
  import { authStore, loadCurrentUser } from "$lib/stores/auth";
  import { toast } from "svelte-sonner";

  const notificationPreferencesKey = "bizflow-notification-preferences";
  const savedNotificationPreferences =
    typeof window === "undefined"
      ? {}
      : JSON.parse(
          window.localStorage.getItem(notificationPreferencesKey) ?? "{}",
        );

  let open = $derived($modals.settings);
  let activeSection = $derived($modals.settingsSection);
  let density = $state("Comfortable");
  let businessName = $state($authStore.user?.business?.name ?? "");
  let userName = $state($authStore.user?.name ?? "");
  let city = $state($authStore.user?.business?.city ?? "");
  let country = $state($authStore.user?.business?.country ?? "");
  let saving = $state(false);
  let currentPassword = $state("");
  let newPassword = $state("");
  let notifySales = $state(savedNotificationPreferences.notifySales ?? true);
  let notifyStock = $state(savedNotificationPreferences.notifyStock ?? true);
  let notifyTeam = $state(savedNotificationPreferences.notifyTeam ?? true);
  function handleOpenChange(value: boolean) {
    if (!value) modals.closeSettings();
  }

  async function request(path: string, body: unknown) {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1"}${path}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${$authStore.accessToken}`,
        },
        body: JSON.stringify(body),
      },
    );
    if (!response.ok)
      throw new Error(
        (await response.json().catch(() => null))?.message ??
          "Unable to save settings.",
      );
    return response.json();
  }

  async function saveProfile() {
    saving = true;
    try {
      await request("/businesses/profile", { businessName, city, country });
      await request("/auth/profile", { name: userName });
      await loadCurrentUser();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save profile.",
      );
    } finally {
      saving = false;
    }
  }

  async function savePassword() {
    saving = true;
    try {
      await request("/auth/change-password", { currentPassword, newPassword });
      currentPassword = "";
      newPassword = "";
      toast.success("Password updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update password.",
      );
    } finally {
      saving = false;
    }
  }

  function saveNotifications() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        notificationPreferencesKey,
        JSON.stringify({ notifySales, notifyStock, notifyTeam }),
      );
    }
    toast.success("Notification preferences saved");
  }
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
  <Dialog.Content class="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-3xl">
    <Dialog.Header
      ><Dialog.Title>Workspace settings</Dialog.Title><Dialog.Description
        >Manage your business, account, alerts, and appearance.</Dialog.Description
      ></Dialog.Header
    >
    <div class="grid gap-7 md:grid-cols-[200px_minmax(0,1fr)]">
      <nav
        class="flex gap-1 overflow-x-auto md:flex-col"
        aria-label="Settings sections"
      >
        {#each [{ icon: Building2, title: "Profile", key: "profile" }, { icon: UserRound, title: "Team & roles", key: "team" }, { icon: Bell, title: "Notifications", key: "notifications" }, { icon: Palette, title: "Appearance", key: "appearance" }, { icon: LockKeyhole, title: "Security", key: "security" }] as setting}
          <button
            type="button"
            onclick={() => modals.openSettings(setting.key)}
            class={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition ${activeSection === setting.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            ><setting.icon class="h-4 w-4" />{setting.title}</button
          >
        {/each}
      </nav>
      <section
        class="min-h-72 min-w-0 rounded-xl border border-border/60 bg-muted/15 p-6"
      >
        {#if activeSection === "profile"}
          <h3 class="font-heading text-base font-bold text-foreground">
            Business profile
          </h3>
          <p class="mt-1 text-xs text-muted-foreground">
            The identity your team sees across Bizflow.
          </p>
          <label class="mt-5 block text-sm font-medium text-foreground"
            >Your name<input
              bind:value={userName}
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            /></label
          ><label class="mt-4 block text-sm font-medium text-foreground"
            >Business name<input
              bind:value={businessName}
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            /></label
          >
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <label class="text-sm font-medium text-foreground"
              >City<input
                bind:value={city}
                class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              /></label
            ><label class="text-sm font-medium text-foreground"
              >Country<input
                bind:value={country}
                class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              /></label
            >
          </div>
          <button
            type="button"
            class="btn-app-primary mt-5"
            disabled={saving}
            onclick={() => void saveProfile()}
            >{saving ? "Saving..." : "Save profile"}</button
          >
          <div
            class="mt-4 flex items-center justify-between rounded-lg border border-border/60 bg-background p-3"
          >
            <span
              ><span class="block text-sm font-medium text-foreground"
                >Business logo</span
              ><span class="block text-xs text-muted-foreground"
                >{businessName || "Business"} logo</span
              ></span
            ><button type="button" class="text-xs font-semibold text-primary"
              >Change</button
            >
          </div>
        {:else if activeSection === "appearance"}
          <h3 class="font-heading text-base font-bold text-foreground">
            Appearance
          </h3>
          <p class="mt-1 text-xs text-muted-foreground">
            Make the workspace comfortable for your team.
          </p>
          <div class="mt-5 grid grid-cols-3 gap-2">
            <button
              type="button"
              onclick={() => setMode("light")}
              class={`flex flex-col items-center gap-2 rounded-lg border p-3 text-xs ${mode.current === "light" ? "border-primary bg-primary/5 text-primary" : "border-border/60 text-muted-foreground"}`}
              ><SunMedium class="h-4 w-4" />Light</button
            ><button
              type="button"
              onclick={() => setMode("dark")}
              class={`flex flex-col items-center gap-2 rounded-lg border p-3 text-xs ${mode.current === "dark" ? "border-primary bg-primary/5 text-primary" : "border-border/60 text-muted-foreground"}`}
              ><Moon class="h-4 w-4" />Dark</button
            ><button
              type="button"
              onclick={() => setMode("system")}
              class="flex flex-col items-center gap-2 rounded-lg border border-border/60 p-3 text-xs text-muted-foreground"
              ><Monitor class="h-4 w-4" />System</button
            >
          </div>
          <label class="mt-5 block text-sm font-medium text-foreground"
            >Content density<select
              bind:value={density}
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              ><option>Comfortable</option><option>Compact</option></select
            ></label
          >
        {:else if activeSection === "notifications"}
          <h3 class="font-heading text-base font-bold text-foreground">
            Notifications
          </h3>
          <p class="mt-1 text-xs text-muted-foreground">
            Choose which operational events appear in your workspace alerts.
          </p>
          <div class="mt-5 space-y-3">
            <label
              class="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-background p-3 text-sm"
              ><span
                ><span class="block font-medium text-foreground"
                  >Sales activity</span
                ><span class="block text-xs text-muted-foreground"
                  >New transactions and daily sales updates</span
                ></span
              ><input
                type="checkbox"
                bind:checked={notifySales}
                class="size-4 accent-primary"
              /></label
            >
            <label
              class="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-background p-3 text-sm"
              ><span
                ><span class="block font-medium text-foreground"
                  >Stock alerts</span
                ><span class="block text-xs text-muted-foreground"
                  >Low inventory and adjustment activity</span
                ></span
              ><input
                type="checkbox"
                bind:checked={notifyStock}
                class="size-4 accent-primary"
              /></label
            >
            <label
              class="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-background p-3 text-sm"
              ><span
                ><span class="block font-medium text-foreground"
                  >Team activity</span
                ><span class="block text-xs text-muted-foreground"
                  >Invitations and access changes</span
                ></span
              ><input
                type="checkbox"
                bind:checked={notifyTeam}
                class="size-4 accent-primary"
              /></label
            >
          </div>
          <button
            type="button"
            class="btn-app-primary mt-5"
            onclick={saveNotifications}>Save notification settings</button
          >
        {:else if activeSection === "team"}
          <h3 class="font-heading text-base font-bold text-foreground">
            Team & roles
          </h3>
          <p class="mt-1 text-sm text-muted-foreground">
            Manage members, invitations, roles, and permissions in the dedicated
            team workspace.
          </p>
          <button
            type="button"
            class="btn-app-primary mt-5"
            onclick={() => {
              modals.closeSettings();
              window.location.href = "/team";
            }}>Open team workspace</button
          >
        {:else if activeSection === "security"}
          <h3 class="font-heading text-base font-bold text-foreground">
            Security
          </h3>
          <p class="mt-1 text-xs text-muted-foreground">
            Update the password for your Bizflow account.
          </p>
          <label class="mt-5 block text-sm font-medium text-foreground"
            >Current password<input
              type="password"
              bind:value={currentPassword}
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            /></label
          >
          <label class="mt-4 block text-sm font-medium text-foreground"
            >New password<input
              type="password"
              minlength="8"
              bind:value={newPassword}
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            /></label
          >
          <button
            type="button"
            class="btn-app-primary mt-5"
            disabled={saving || !currentPassword || newPassword.length < 8}
            onclick={() => void savePassword()}
            >{saving ? "Updating..." : "Update password"}</button
          >
        {:else}
          <h3 class="font-heading text-base font-bold text-foreground">
            {activeSection === "team"
              ? "Team & roles"
              : activeSection === "notifications"
                ? "Notifications"
                : "Security"}
          </h3>
          <p class="mt-2 text-sm text-muted-foreground">
            This section is ready for configuration. Your current workspace
            settings remain active.
          </p>
          <div
            class="mt-5 flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground"
          >
            <Check class="h-4 w-4 text-primary" /> No changes are required here.
          </div>
        {/if}
      </section>
    </div>
  </Dialog.Content>
</Dialog.Root>
