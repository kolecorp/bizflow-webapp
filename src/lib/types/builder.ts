// src/lib/types/builder.ts

export type ElementType =
  | 'Section'
  | 'Grid'
  | 'Column'
  | 'Headline'
  | 'Subheadline'
  | 'Paragraph'
  | 'Button'
  | 'Image'
  | 'Video'
  | 'OptInForm'
  | 'Divider'
  | 'CountdownTimer'
  | 'BulletList'
  | 'Testimonial'
  | 'SocialProof';

export interface CanvasElement {
  id: string;
  type: ElementType;
  styles: string;              // Extra static Tailwind classes
  inlineStyles: Record<string, string>;
  content?: string;            // Tiptap HTML (for text-type elements)
  properties: Record<string, any>;
  children: CanvasElement[];
}

export interface BuilderPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  build: () => CanvasElement[];
}

function uid(): string {
  return crypto.randomUUID();
}

function buildDefaults(type: ElementType): Omit<CanvasElement, 'id'> {
  const base = { type, styles: '', inlineStyles: {}, children: [], properties: {} };
  switch (type) {
    case 'Section':
      return { ...base, properties: { bgColor: '#ffffff', bgImage: '', paddingTop: 48, paddingBottom: 48, paddingLeft: 24, paddingRight: 24, maxWidth: '' } };
    case 'Grid':
      return { ...base, properties: { cols: 2, gap: 24 } };
    case 'Column':
      return { ...base, properties: { gap: 16, align: 'start' } };
    case 'Headline':
      return { ...base, content: '<p>Your Compelling Headline Here</p>', properties: { tag: 'h1', align: 'left', color: '#111827', fontSize: 44, fontWeight: 'bold', lineHeight: 1.15 } };
    case 'Subheadline':
      return { ...base, content: '<p>Supporting subheadline that expands on your offer</p>', properties: { tag: 'h2', align: 'left', color: '#374151', fontSize: 26, fontWeight: '600', lineHeight: 1.35 } };
    case 'Paragraph':
      return { ...base, content: "<p>Add your compelling copy here. Speak directly to your reader's problem and the transformation you offer.</p>", properties: { align: 'left', color: '#4b5563', fontSize: 16, lineHeight: 1.7 } };
    case 'Button':
      return { ...base, properties: { label: 'Yes! I Want Access →', href: '#', action: 'url', variant: 'primary', size: 'lg', align: 'center', openInNewTab: false, bgColor: '#7c3aed', textColor: '#ffffff', borderRadius: 8, fullWidth: false, paddingX: 32, paddingY: 14 } };
    case 'Image':
      return { ...base, properties: { src: 'https://placehold.co/800x450/f3f4f6/9ca3af?text=Your+Image', alt: '', objectFit: 'cover', borderRadius: 12, link: '', openInNewTab: false, width: 100, shadow: true } };
    case 'Video':
      return { ...base, properties: { url: '', aspectRatio: 56.25, controls: true, autoplay: false, borderRadius: 12, shadow: true } };
    case 'OptInForm':
      return { ...base, properties: { headline: "Get Instant Access — It's Free!", subheadline: 'Join 10,000+ marketers already growing.', showName: false, namePlaceholder: 'Your first name', emailPlaceholder: 'Your best email address...', buttonLabel: 'Yes! Send Me The Guide →', buttonBg: '#7c3aed', buttonTextColor: '#ffffff', borderRadius: 8, disclaimer: '🔒 100% Privacy. Zero spam, ever.', bgColor: '#f8fafc', borderColor: '#e2e8f0', padding: 32 } };
    case 'Divider':
      return { ...base, properties: { style: 'solid', color: '#e5e7eb', thickness: 1, widthPercent: 100, marginTop: 32, marginBottom: 32 } };
    case 'CountdownTimer':
      return { ...base, properties: { targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], timerStyle: 'blocks', bgColor: '#1e1b4b', blockBg: '#312e81', textColor: '#ffffff', accentColor: '#7c3aed', showDays: true, showHours: true, showMinutes: true, showSeconds: true, expiredMessage: 'This offer has expired!', labelDays: 'DAYS', labelHours: 'HRS', labelMinutes: 'MINS', labelSeconds: 'SECS' } };
    case 'BulletList':
      return { ...base, properties: { items: ['Proven strategy that works in any niche', 'Step-by-step framework, no guesswork', 'Real examples and templates included'], icon: 'check', iconColor: '#7c3aed', textColor: '#374151', fontSize: 16, gap: 12 } };
    case 'Testimonial':
      return { ...base, properties: { quote: '"This completely transformed how I generate leads. I went from 50 to 500 sign-ups in just 30 days!"', name: 'Sarah Johnson', role: 'Marketing Director, GrowthCo', avatar: '', rating: 5, bgColor: '#f9fafb', borderColor: '#e5e7eb', textColor: '#374151', borderRadius: 12, padding: 24 } };
    case 'SocialProof':
      return { ...base, properties: { headline: 'Trusted by 10,000+ marketers worldwide', logos: ['HubSpot', 'Forbes', 'foundr', 'Entrepreneur', 'Inc.'], bgColor: '#f9fafb', textColor: '#9ca3af', padding: 32 } };
    default:
      return base;
  }
}

export function createNewElement(type: ElementType, overrides: Partial<CanvasElement> = {}): CanvasElement {
  const defaults = buildDefaults(type);
  return {
    ...defaults,
    ...overrides,
    id: uid(),
    type,
    properties: { ...defaults.properties, ...(overrides.properties || {}) },
    inlineStyles: { ...defaults.inlineStyles, ...(overrides.inlineStyles || {}) },
    children: overrides.children ?? [],
  };
}

// ─── Preset builder helper ───────────────────────────────────
function el(
  type: ElementType,
  overrides: Partial<CanvasElement> = {},
  children: CanvasElement[] = []
): CanvasElement {
  return { ...createNewElement(type, { ...overrides, children: [] }), children };
}

// ─── Presets ─────────────────────────────────────────────────
export const PRESETS: BuilderPreset[] = [
  {
    id: 'lead-magnet',
    name: 'Lead Magnet / Freebie',
    description: 'Optimized for free guide & ebook downloads',
    icon: '📘',
    build: () => [
      el('Section', { properties: { bgColor: '#1e1b4b', paddingTop: 80, paddingBottom: 80, paddingLeft: 40, paddingRight: 40 } }, [
        el('Headline', { content: '<p>Get the FREE Blueprint to <em>2x Your Leads</em></p>', properties: { tag: 'h1', align: 'center', color: '#ffffff', fontSize: 48, fontWeight: 'bold', lineHeight: 1.1 } }),
        el('Subheadline', { content: '<p>The step-by-step system used by 10,000+ marketers to grow their list faster</p>', properties: { align: 'center', color: '#c4b5fd', fontSize: 20, fontWeight: '400' } }),
        el('BulletList', { properties: { items: ['Proven strategies that work in any niche or industry', 'Short, actionable steps — see results in 48 hours', 'Real examples and ready-to-use templates included'], icon: 'check', iconColor: '#a78bfa', textColor: '#e2e8f0' } }),
        el('OptInForm', { properties: { headline: 'Claim Your Free Guide Now', subheadline: 'Enter your email and get instant access.', buttonLabel: 'Yes! Send Me The Blueprint →', buttonBg: '#7c3aed', bgColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.15)' } }),
      ]),
      el('Section', { properties: { bgColor: '#ffffff', paddingTop: 32, paddingBottom: 32, paddingLeft: 40, paddingRight: 40 } }, [
        el('SocialProof', { properties: { headline: 'Trusted by marketers at', logos: ['HubSpot', 'foundr', 'Forbes', 'Entrepreneur', 'Inc.'], bgColor: '#ffffff' } }),
      ]),
    ],
  },
  {
    id: 'webinar-registration',
    name: 'Webinar Registration',
    description: 'Drive sign-ups for your live or recorded webinar',
    icon: '🎙️',
    build: () => [
      el('Section', { properties: { bgColor: '#0f172a', paddingTop: 60, paddingBottom: 60, paddingLeft: 40, paddingRight: 40 } }, [
        el('Headline', { content: '<p>FREE Live Webinar: How to Build a 6-Figure Email List</p>', properties: { align: 'center', color: '#f1f5f9', fontSize: 44 } }),
        el('Subheadline', { content: '<p>Join us for an intensive 90-minute workshop — reserve your FREE spot now</p>', properties: { align: 'center', color: '#94a3b8', fontSize: 20, fontWeight: '400' } }),
        el('CountdownTimer', { properties: { targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], bgColor: 'transparent', blockBg: '#1e293b', textColor: '#ffffff', accentColor: '#3b82f6' } }),
        el('OptInForm', { properties: { headline: 'Reserve Your FREE Seat Now', showName: true, buttonLabel: 'Yes! Save My Seat →', buttonBg: '#3b82f6', bgColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' } }),
      ]),
      el('Section', { properties: { bgColor: '#1e293b', paddingTop: 48, paddingBottom: 48, paddingLeft: 40, paddingRight: 40 } }, [
        el('Testimonial', { properties: { quote: '"I attended last month\'s webinar and booked 3 new clients the same week. This is the real deal."', name: 'Mark Thompson', role: 'Agency Owner', rating: 5, bgColor: '#0f172a', borderColor: '#334155', textColor: '#e2e8f0' } }),
      ]),
    ],
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'Bold hero section for launching a product or offer',
    icon: '🚀',
    build: () => [
      el('Section', { properties: { bgColor: '#020617', paddingTop: 80, paddingBottom: 80, paddingLeft: 40, paddingRight: 40 } }, [
        el('Headline', { content: '<p>Introducing: The <em>Ultimate</em> Marketing Toolkit</p>', properties: { align: 'center', color: '#f8fafc', fontSize: 52 } }),
        el('Paragraph', { content: '<p>Everything you need to attract, engage, and convert your audience — in one powerful toolkit.</p>', properties: { align: 'center', color: '#94a3b8', fontSize: 18 } }),
        el('Button', { properties: { label: '🚀 Get Instant Access — $97', href: '#pricing', align: 'center', bgColor: '#f59e0b', textColor: '#020617', borderRadius: 8, paddingX: 40, paddingY: 18 } }),
      ]),
      el('Section', { properties: { bgColor: '#0f172a', paddingTop: 60, paddingBottom: 60, paddingLeft: 40, paddingRight: 40 } }, [
        el('Video', { properties: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', borderRadius: 12 } }),
      ]),
      el('Section', { properties: { bgColor: '#ffffff', paddingTop: 60, paddingBottom: 60, paddingLeft: 40, paddingRight: 40 } }, [
        el('BulletList', { properties: { items: ['50+ premium templates, instantly editable', '1-click email integrations with major ESPs', 'Step-by-step video training included', '90-day money-back guarantee — zero risk'], icon: 'check', iconColor: '#10b981' } }),
        el('Button', { properties: { label: 'Yes! I Want The Toolkit →', align: 'center', bgColor: '#10b981', paddingX: 40, paddingY: 16 } }),
      ]),
      el('Section', { properties: { bgColor: '#f8fafc', paddingTop: 40, paddingBottom: 40 } }, [
        el('SocialProof', { properties: { headline: 'Used by teams at', bgColor: '#f8fafc' } }),
      ]),
    ],
  },
  {
    id: 'squeeze-page',
    name: 'Squeeze Page',
    description: 'Ultra-clean, high-conversion single opt-in',
    icon: '⚡',
    build: () => [
      el('Section', { properties: { bgColor: '#ffffff', paddingTop: 100, paddingBottom: 100, paddingLeft: 40, paddingRight: 40 } }, [
        el('Headline', { content: '<p>Stop Struggling. Start Converting.</p>', properties: { align: 'center', color: '#111827', fontSize: 52 } }),
        el('Subheadline', { content: '<p>Get our proven lead generation framework — free.</p>', properties: { align: 'center', color: '#6b7280', fontSize: 22, fontWeight: '400' } }),
        el('Divider', { properties: { widthPercent: 60, color: '#e5e7eb', marginTop: 24, marginBottom: 24 } }),
        el('OptInForm', { properties: { headline: '', subheadline: '', emailPlaceholder: 'Enter your email address', buttonLabel: 'Get Free Access Now →', buttonBg: '#111827', disclaimer: '🔒 No spam. Unsubscribe anytime.' } }),
      ]),
    ],
  },
  {
    id: 'thank-you',
    name: 'Thank You Page',
    description: 'Confirmation page after opt-in with next steps',
    icon: '🎉',
    build: () => [
      el('Section', { properties: { bgColor: '#f0fdf4', paddingTop: 80, paddingBottom: 80, paddingLeft: 40, paddingRight: 40 } }, [
        el('Headline', { content: "<p>🎉 You're In! Check Your Email Now</p>", properties: { align: 'center', color: '#14532d', fontSize: 44 } }),
        el('Paragraph', { content: "<p>We've sent your guide to your inbox. While you wait, here's what to do next:</p>", properties: { align: 'center', color: '#166534', fontSize: 18 } }),
        el('BulletList', { properties: { items: ['Check your email and confirm your subscription', 'Add us to your contacts so we never land in spam', 'Follow us on social for daily marketing tips'], icon: 'arrow', iconColor: '#16a34a' } }),
        el('Divider', { properties: { marginTop: 40, marginBottom: 40, color: '#bbf7d0' } }),
        el('Headline', { content: '<p>Wait — One-Time Offer Below</p>', properties: { align: 'center', color: '#111827', fontSize: 32 } }),
        el('Paragraph', { content: '<p>For the next 15 minutes only, upgrade to our full Marketing Mastery Course at 70% off.</p>', properties: { align: 'center', color: '#374151' } }),
        el('Button', { properties: { label: 'Yes! Upgrade Me Now — 70% OFF →', align: 'center', bgColor: '#16a34a', paddingX: 36, paddingY: 16 } }),
      ]),
      el('Section', { properties: { bgColor: '#ffffff', paddingTop: 32, paddingBottom: 32 } }, [
        el('SocialProof', { properties: { headline: 'Join thousands of marketers already succeeding', bgColor: '#ffffff' } }),
      ]),
    ],
  },
];

// Palette element definitions for the sidebar
export interface PaletteItem {
  type: ElementType;
  label: string;
  description: string;
  category: 'layout' | 'content' | 'conversion' | 'media';
}

export const PALETTE_ITEMS: PaletteItem[] = [
  // Layout
  { type: 'Section', label: 'Section', description: 'Full-width container', category: 'layout' },
  { type: 'Grid', label: 'Grid', description: '2–4 column grid', category: 'layout' },
  { type: 'Column', label: 'Column', description: 'Flex column block', category: 'layout' },
  // Content
  { type: 'Headline', label: 'Headline', description: 'H1/H2/H3 heading', category: 'content' },
  { type: 'Subheadline', label: 'Subheadline', description: 'Supporting header', category: 'content' },
  { type: 'Paragraph', label: 'Paragraph', description: 'Body copy text', category: 'content' },
  { type: 'BulletList', label: 'Bullet List', description: 'Icon + text list', category: 'content' },
  // Conversion
  { type: 'Button', label: 'Button', description: 'CTA button with action', category: 'conversion' },
  { type: 'OptInForm', label: 'Opt-In Form', description: 'Email capture form', category: 'conversion' },
  { type: 'CountdownTimer', label: 'Countdown', description: 'Urgency timer', category: 'conversion' },
  // Media
  { type: 'Image', label: 'Image', description: 'Photo / graphic', category: 'media' },
  { type: 'Video', label: 'Video', description: 'YouTube / Vimeo embed', category: 'media' },
  { type: 'Divider', label: 'Divider', description: 'Horizontal separator', category: 'media' },
  { type: 'Testimonial', label: 'Testimonial', description: 'Social proof card', category: 'media' },
  { type: 'SocialProof', label: 'Logo Strip', description: 'Trust logo row', category: 'media' },
];
