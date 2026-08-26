<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    ArrowRight,
    Check,
    ChevronDown,
    CirclePlus,
    Eye,
    FileText,
    GripVertical,
    Mail,
    MessageCircle,
    MoreHorizontal,
    Plus,
    Save,
    Send,
    Settings2,
    Sparkles,
    UserPlus,
    Users,
    X,
    Zap,
  } from "@lucide/svelte";

  let saved = $state(false);
  let activeField = $state("Phone number");
  let fields = $state(["Phone number", "Full name"]);
  let actions = $state(["Create lead", "Send WhatsApp message", "Add to campaign"]);

  const fieldOptions = ["Phone number", "Full name", "Email address", "Company name"];
  const actionOptions = [
    { name: "Create lead", detail: "Add submission to your leads", icon: UserPlus },
    { name: "Create customer", detail: "Create a customer profile", icon: Users },
    { name: "Send WhatsApp message", detail: "Start a customer conversation", icon: MessageCircle },
    { name: "Send email", detail: "Send a confirmation email", icon: Mail },
    { name: "Add to campaign", detail: "Keep the lead in this campaign", icon: Sparkles },
    { name: "Generate coupon", detail: "Reward the new lead", icon: Zap },
    { name: "Notify staff", detail: "Alert your team in Bizflow", icon: Send },
    { name: "Create order", detail: "Create an order from the form", icon: FileText },
  ];

  function toggleAction(action: string) {
    actions = actions.includes(action) ? actions.filter((item) => item !== action) : [...actions, action];
  }

  function addField(field: string) {
    if (!fields.includes(field)) fields = [...fields, field];
  }

  function removeField(field: string) {
    if (fields.length > 1) fields = fields.filter((item) => item !== field);
  }

  function saveForm() {
    saved = true;
    setTimeout(() => (saved = false), 2200);
  }
</script>

<AppShell>
  <PageHeader eyebrow="Marketing · Forms" title="Forms & lead actions" description="Build a focused capture form and connect every submission to the next step in your customer journey." />

  <div class="space-y-5">
    <div class="flex flex-col gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex min-w-0 items-center gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText class="h-5 w-5" /></div>
        <div class="min-w-0"><div class="flex items-center gap-2"><h2 class="truncate font-heading text-lg font-bold text-foreground">MTN Data Promo signup</h2><span class="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Draft</span></div><p class="mt-0.5 text-xs text-muted-foreground">Last edited just now · Connected to MTN Data Promo</p></div>
      </div>
      <div class="flex items-center gap-2"><button type="button" aria-label="Preview form" class="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Eye class="h-4 w-4" /></button><button type="button" aria-label="More form actions" class="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><MoreHorizontal class="h-4 w-4" /></button><button type="button" onclick={saveForm} class="btn-app-primary">{#if saved}<Check class="h-4 w-4" /> Saved{:else}<Save class="h-4 w-4" /> Save form{/if}</button></div>
    </div>

    <div class="grid items-start gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(420px,1.15fr)]">
      <section class="surface-panel overflow-hidden">
        <div class="border-b border-border/60 px-5 py-4"><div class="flex items-center justify-between"><div><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">01 · Capture</p><h3 class="mt-1 text-base font-bold text-foreground">Form details</h3></div><Settings2 class="h-4 w-4 text-muted-foreground" /></div><p class="mt-1 text-xs text-muted-foreground">Keep the ask simple so more people complete it.</p></div>
        <div class="space-y-4 p-5">
          <label class="block text-sm font-medium text-foreground">Form name<input value="MTN Data Promo signup" class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
          <label class="block text-sm font-medium text-foreground">Headline<input value="Get your first data bundle at a special price" class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
          <label class="block text-sm font-medium text-foreground">Supporting copy<textarea rows="2" class="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">Leave your details and we will send the offer to WhatsApp.</textarea></label>
          <div><div class="flex items-center justify-between"><label class="text-sm font-medium text-foreground">Fields</label><span class="text-[11px] text-muted-foreground">{fields.length} selected</span></div><div class="mt-2 space-y-2">{#each fields as field}<div class="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5"><GripVertical class="h-4 w-4 text-muted-foreground/50" /><span class="flex-1 text-sm text-foreground">{field}</span>{#if field === "Phone number"}<span class="text-[10px] font-medium text-primary">Required</span>{:else}<button type="button" aria-label={`Remove ${field}`} onclick={() => removeField(field)} class="text-muted-foreground hover:text-red-500"><X class="h-3.5 w-3.5" /></button>{/if}</div>{/each}</div><div class="relative mt-2"><select bind:value={activeField} onchange={(event) => addField(event.currentTarget.value)} class="w-full appearance-none rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2.5 pr-9 text-xs font-medium text-primary outline-none"><option value="">Add a field</option>{#each fieldOptions as field}<option value={field}>Add {field}</option>{/each}</select><Plus class="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-primary" /></div></div>
        </div>
      </section>

      <section class="surface-panel overflow-hidden">
        <div class="border-b border-border/60 px-5 py-4"><div class="flex items-center justify-between"><div><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">02 · Automate</p><h3 class="mt-1 text-base font-bold text-foreground">After submission</h3></div><span class="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">{actions.length} actions</span></div><p class="mt-1 text-xs text-muted-foreground">Choose what Bizflow should do, in order, when someone submits.</p></div>
        <div class="p-5"><div class="space-y-2">{#each actions as action, index}<div class="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-3"><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{index + 1}</span><span class="flex-1 text-sm font-medium text-foreground">{action}</span><button type="button" aria-label={`Remove ${action}`} onclick={() => toggleAction(action)} class="text-xs text-muted-foreground hover:text-red-500"><X class="h-3.5 w-3.5" /></button></div>{/each}</div><div class="my-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"><span class="h-px flex-1 bg-border"></span>Add an action<span class="h-px flex-1 bg-border"></span></div><div class="grid gap-2 sm:grid-cols-2">{#each actionOptions as action}<button type="button" onclick={() => toggleAction(action.name)} class={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition ${actions.includes(action.name) ? "border-primary/30 bg-muted/40" : "border-border/60 hover:border-primary/40 hover:bg-muted/20"}`}><span class={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${actions.includes(action.name) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}><svelte:component this={action.icon} class="h-3.5 w-3.5" /></span><span class="min-w-0"><span class="block truncate text-xs font-medium text-foreground">{action.name}</span><span class="mt-0.5 block truncate text-[10px] text-muted-foreground">{action.detail}</span></span>{#if actions.includes(action.name)}<Check class="ml-auto h-3.5 w-3.5 shrink-0 text-primary" />{:else}<CirclePlus class="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />{/if}</button>{/each}</div></div>
      </section>
    </div>

    <div class="grid items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)]">
      <section class="surface-panel overflow-hidden"><div class="border-b border-border/60 px-5 py-4"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">03 · Connect</p><h3 class="mt-1 text-base font-bold text-foreground">Connected journey</h3><p class="mt-1 text-xs text-muted-foreground">A clear path from campaign traffic to fulfilled order.</p></div><div class="flex flex-wrap items-center gap-2 p-5 text-xs"><span class="rounded-lg bg-muted px-3 py-2 font-medium text-foreground">Ad click</span><ArrowRight class="h-3.5 w-3.5 text-muted-foreground" /><span class="rounded-lg bg-primary/10 px-3 py-2 font-medium text-primary">Form submit</span><ArrowRight class="h-3.5 w-3.5 text-muted-foreground" /><span class="rounded-lg bg-muted px-3 py-2 font-medium text-foreground">Lead created</span><ArrowRight class="h-3.5 w-3.5 text-muted-foreground" /><span class="rounded-lg bg-green-500/10 px-3 py-2 font-medium text-green-600">WhatsApp + VTU</span></div></section>
      <section class="surface-panel overflow-hidden"><div class="flex items-center justify-between border-b border-border/60 px-5 py-4"><div><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Preview</p><h3 class="mt-1 text-base font-bold text-foreground">What customers see</h3></div><span class="flex items-center gap-1.5 text-[11px] text-green-600"><span class="h-1.5 w-1.5 rounded-full bg-green-500"></span> Live preview</span></div><div class="bg-muted/20 p-5"><div class="mx-auto max-w-sm rounded-xl border border-border/60 bg-background p-5 shadow-sm"><p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">MTN Data Promo</p><h4 class="mt-2 font-heading text-xl font-bold leading-tight text-foreground">Get your first data bundle at a special price</h4><p class="mt-2 text-xs leading-relaxed text-muted-foreground">Leave your details and we will send the offer to WhatsApp.</p><div class="mt-4 space-y-2"><div class="h-9 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">Phone number</div><div class="h-9 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">Full name</div><button type="button" class="btn-app-primary mt-2 w-full">Get the offer <Send class="h-3.5 w-3.5" /></button></div><p class="mt-3 text-center text-[10px] text-muted-foreground">By submitting, you agree to receive updates.</p></div></div></section>
    </div>
  </div>
</AppShell>
