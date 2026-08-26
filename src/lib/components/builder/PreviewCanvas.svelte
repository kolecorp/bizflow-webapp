<script lang="ts">
  import type { CanvasElement } from "$lib/types/builder";
  import PreviewCanvas from "./PreviewCanvas.svelte";
  import { onMount, onDestroy } from "svelte";

  let { element }: { element: CanvasElement } = $props();

  const p = $derived(element.properties);

  const computedStyle = $derived.by(() => {
    const s: string[] = [];
    switch (element.type) {
      case 'Section':
        if (p.bgColor) s.push(`background-color: ${p.bgColor}`);
        if (p.bgImage) s.push(`background-image: url(${p.bgImage}); background-size: cover; background-position: center`);
        s.push(`padding: ${p.paddingTop ?? 48}px ${p.paddingRight ?? 24}px ${p.paddingBottom ?? 48}px ${p.paddingLeft ?? 24}px`);
        break;
      case 'Grid':
        s.push(`display: grid; grid-template-columns: repeat(${p.cols ?? 2}, 1fr); gap: ${p.gap ?? 24}px`);
        break;
      case 'Column':
        s.push(`display: flex; flex-direction: column; gap: ${p.gap ?? 16}px; align-items: ${p.align ?? 'start'}`);
        break;
      case 'Headline': case 'Subheadline': case 'Paragraph':
        s.push(`color: ${p.color ?? '#111827'}; font-size: ${p.fontSize ?? 16}px; font-weight: ${p.fontWeight ?? 'normal'}; line-height: ${p.lineHeight ?? 1.5}; text-align: ${p.align ?? 'left'}`);
        break;
    }
    return s.join('; ');
  });

  // Countdown timer live
  let timerDays = $state('00'), timerHours = $state('00'), timerMins = $state('00'), timerSecs = $state('00');
  let interval: ReturnType<typeof setInterval> | null = null;
  function pad(n: number) { return String(Math.max(0, n)).padStart(2, '0'); }

  onMount(() => {
    if (element.type === 'CountdownTimer') {
      const tick = () => {
        const target = new Date(element.properties.targetDate + 'T23:59:59');
        const diff = Math.max(0, target.getTime() - Date.now());
        timerDays = pad(Math.floor(diff / 86400000));
        timerHours = pad(Math.floor((diff % 86400000) / 3600000));
        timerMins = pad(Math.floor((diff % 3600000) / 60000));
        timerSecs = pad(Math.floor((diff % 60000) / 1000));
      };
      tick();
      interval = setInterval(tick, 1000);
    }
  });
  onDestroy(() => { if (interval) clearInterval(interval); });

  function getVideoEmbedUrl(url: string) {
    if (!url) return '';
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return url;
  }
</script>

{#if element.type === 'Headline' || element.type === 'Subheadline' || element.type === 'Paragraph'}
  <div style={computedStyle} class={element.styles}>
    {@html element.content ?? ''}
  </div>

{:else if element.type === 'Button'}
  {@const bp = element.properties}
  <div style="text-align: {bp.align ?? 'center'};">
    <a
      href={bp.href ?? '#'}
      target={bp.openInNewTab ? '_blank' : '_self'}
      style="
        display: inline-block;
        background: {bp.bgColor ?? '#7c3aed'}; color: {bp.textColor ?? '#ffffff'};
        border-radius: {bp.borderRadius ?? 8}px;
        padding: {bp.paddingY ?? 14}px {bp.paddingX ?? 32}px;
        font-size: {bp.size === 'xl' ? '20px' : bp.size === 'lg' ? '17px' : bp.size === 'sm' ? '13px' : '15px'};
        font-weight: 700; text-decoration: none; cursor: pointer;
        box-shadow: 0 4px 14px -2px {bp.bgColor ?? '#7c3aed'}60;
        width: {bp.fullWidth ? '100%' : 'auto'}; text-align: center;
      "
    >{bp.label ?? 'Click Here'}</a>
  </div>

{:else if element.type === 'Image'}
  {@const ip = element.properties}
  <div style="width: {ip.width ?? 100}%;">
    {#if ip.link}
      <a href={ip.link} target={ip.openInNewTab ? '_blank' : '_self'}>
        <img src={ip.src} alt={ip.alt ?? ''} draggable="false"
          style="display:block;width:100%;height:auto;object-fit:{ip.objectFit ?? 'cover'};border-radius:{ip.borderRadius ?? 12}px;{ip.shadow ? 'box-shadow:0 10px 30px rgba(0,0,0,0.12);' : ''}" />
      </a>
    {:else}
      <img src={ip.src} alt={ip.alt ?? ''} draggable="false"
        style="display:block;width:100%;height:auto;object-fit:{ip.objectFit ?? 'cover'};border-radius:{ip.borderRadius ?? 12}px;{ip.shadow ? 'box-shadow:0 10px 30px rgba(0,0,0,0.12);' : ''}" />
    {/if}
  </div>

{:else if element.type === 'Video'}
  {@const vp = element.properties}
  {@const embedUrl = getVideoEmbedUrl(vp.url ?? '')}
  <div style="position:relative;width:100%;padding-bottom:{vp.aspectRatio ?? 56.25}%;border-radius:{vp.borderRadius ?? 12}px;overflow:hidden;{vp.shadow ? 'box-shadow:0 10px 30px rgba(0,0,0,0.2);' : ''}background:#0f0f1a;">
    {#if embedUrl}
      <iframe src="{embedUrl}{vp.autoplay ? '?autoplay=1&mute=1' : ''}" title="Video"
        frameborder="0" allow="autoplay;encrypted-media;fullscreen"
        style="position:absolute;inset:0;width:100%;height:100%;border:none;"></iframe>
    {:else}
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:14px;">No video URL set</div>
    {/if}
  </div>

{:else if element.type === 'OptInForm'}
  {@const fp = element.properties}
  <form onsubmit={(e) => e.preventDefault()} style="background:{fp.bgColor ?? '#f8fafc'};border:1px solid {fp.borderColor ?? '#e2e8f0'};border-radius:{fp.borderRadius ?? 8}px;padding:{fp.padding ?? 32}px;max-width:480px;margin:0 auto;">
    {#if fp.headline}
      <p style="font-size:20px;font-weight:700;color:#111827;text-align:center;margin-bottom:8px;">{fp.headline}</p>
    {/if}
    {#if fp.subheadline}
      <p style="font-size:14px;color:#6b7280;text-align:center;margin-bottom:20px;">{fp.subheadline}</p>
    {/if}
    {#if fp.showName}
      <input type="text" placeholder={fp.namePlaceholder ?? 'Your first name'}
        style="display:block;width:100%;border:1px solid rgba(0,0,0,0.12);border-radius:{(fp.borderRadius??8)-2}px;padding:11px 14px;font-size:15px;margin-bottom:10px;background:rgba(255,255,255,0.9);box-sizing:border-box;" />
    {/if}
    <input type="email" placeholder={fp.emailPlaceholder ?? 'Your best email address...'}
      style="display:block;width:100%;border:1px solid rgba(0,0,0,0.12);border-radius:{(fp.borderRadius??8)-2}px;padding:11px 14px;font-size:15px;margin-bottom:12px;background:rgba(255,255,255,0.9);box-sizing:border-box;" />
    <button type="submit"
      style="display:block;width:100%;background:{fp.buttonBg ?? '#7c3aed'};color:{fp.buttonTextColor ?? '#fff'};border:none;border-radius:{(fp.borderRadius??8)-2}px;padding:14px 24px;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px -2px {fp.buttonBg ?? '#7c3aed'}60;"
    >{fp.buttonLabel ?? 'Get Access Now →'}</button>
    {#if fp.disclaimer}
      <p style="font-size:12px;text-align:center;margin-top:12px;opacity:0.65;color:#6b7280;">{fp.disclaimer}</p>
    {/if}
  </form>

{:else if element.type === 'Divider'}
  {@const dp = element.properties}
  <div style="margin-top:{dp.marginTop ?? 32}px;margin-bottom:{dp.marginBottom ?? 32}px;display:flex;justify-content:center;">
    <hr style="width:{dp.widthPercent ?? 100}%;border:none;border-top:{dp.thickness ?? 1}px {dp.style ?? 'solid'} {dp.color ?? '#e5e7eb'};" />
  </div>

{:else if element.type === 'CountdownTimer'}
  {@const cp = element.properties}
  <div style="background:{cp.bgColor ?? '#1e1b4b'};padding:32px 16px;text-align:center;">
    <div style="display:flex;align-items:flex-start;justify-content:center;gap:12px;flex-wrap:wrap;">
      {#each [
        { v: timerDays, l: cp.labelDays ?? 'DAYS', show: cp.showDays !== false },
        { v: timerHours, l: cp.labelHours ?? 'HRS', show: cp.showHours !== false },
        { v: timerMins, l: cp.labelMinutes ?? 'MINS', show: cp.showMinutes !== false },
        { v: timerSecs, l: cp.labelSeconds ?? 'SECS', show: cp.showSeconds !== false },
      ] as seg, i}
        {#if seg.show}
          {#if i > 0}<span style="font-size:36px;font-weight:700;color:{cp.textColor ?? '#fff'};opacity:0.5;line-height:1;padding-top:8px;">:</span>{/if}
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
            <div style="background:{cp.blockBg ?? '#312e81'};border-radius:8px;padding:12px 18px;min-width:72px;box-shadow:0 4px 14px rgba(0,0,0,0.3);">
              <span style="font-size:38px;font-weight:800;color:{cp.textColor ?? '#fff'};font-variant-numeric:tabular-nums;line-height:1;">{seg.v}</span>
            </div>
            <span style="font-size:10px;font-weight:700;letter-spacing:0.15em;color:{cp.accentColor ?? '#a78bfa'};">{seg.l}</span>
          </div>
        {/if}
      {/each}
    </div>
  </div>

{:else if element.type === 'BulletList'}
  {@const blp = element.properties}
  <div style="display:flex;flex-direction:column;gap:{blp.gap ?? 12}px;">
    {#each (blp.items ?? []) as item}
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <span style="flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:{blp.iconColor ?? '#7c3aed'}20;margin-top:1px;">
          {#if blp.icon === 'star'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="{blp.iconColor ?? '#7c3aed'}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          {:else if blp.icon === 'arrow'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="{blp.iconColor ?? '#7c3aed'}" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          {:else if blp.icon === 'dot'}
            <span style="width:6px;height:6px;border-radius:50%;background:{blp.iconColor ?? '#7c3aed'};"></span>
          {:else}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="{blp.iconColor ?? '#7c3aed'}" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
          {/if}
        </span>
        <span style="font-size:{blp.fontSize ?? 16}px;color:{blp.textColor ?? '#374151'};line-height:1.6;">{item}</span>
      </div>
    {/each}
  </div>

{:else if element.type === 'Testimonial'}
  {@const tp = element.properties}
  <div style="background:{tp.bgColor ?? '#f9fafb'};border:1px solid {tp.borderColor ?? '#e5e7eb'};border-radius:{tp.borderRadius ?? 12}px;padding:{tp.padding ?? 24}px;">
    <div style="display:flex;gap:3px;margin-bottom:14px;">
      {#each Array(5) as _, i}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="{i < (tp.rating ?? 5) ? '#f59e0b' : '#e5e7eb'}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      {/each}
    </div>
    <p style="font-size:16px;font-style:italic;line-height:1.7;color:{tp.textColor ?? '#374151'};margin-bottom:20px;">{tp.quote}</p>
    <div style="display:flex;align-items:center;gap:12px;">
      {#if tp.avatar}
        <img src={tp.avatar} alt={tp.name} style="width:44px;height:44px;border-radius:50%;object-fit:cover;" />
      {:else}
        <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#4f46e5);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:18px;flex-shrink:0;">{(tp.name ?? 'S')[0]}</div>
      {/if}
      <div>
        <p style="font-weight:700;font-size:15px;color:{tp.textColor ?? '#111827'};">{tp.name ?? 'Jane Smith'}</p>
        <p style="font-size:13px;color:{tp.textColor ?? '#6b7280'};opacity:0.7;">{tp.role ?? 'Customer'}</p>
      </div>
    </div>
  </div>

{:else if element.type === 'SocialProof'}
  {@const sp = element.properties}
  <div style="background:{sp.bgColor ?? '#f9fafb'};padding:{sp.padding ?? 32}px 24px;text-align:center;">
    {#if sp.headline}
      <p style="font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:{sp.textColor ?? '#9ca3af'};margin-bottom:24px;">{sp.headline}</p>
    {/if}
    <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:32px;">
      {#each (sp.logos ?? []) as logo}
        <span style="font-size:18px;font-weight:800;color:{sp.textColor ?? '#9ca3af'};letter-spacing:-0.02em;">{logo}</span>
      {/each}
    </div>
  </div>

{:else}
  <!-- Section / Grid / Column — render children -->
  <div style={computedStyle} class={element.styles}>
    {#each element.children as child (child.id)}
      <PreviewCanvas element={child} />
    {/each}
  </div>
{/if}
