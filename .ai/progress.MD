# Progress log

## 2026-08-17

- Identified the root cause of the startup issue: a hardcoded full-page loader in the global HTML shell was rendering before hydration and hiding after a delay.
- Removed the loader and its related CSS to eliminate the visible loading state and white flash.
- Verified the app shell no longer includes startup blocking markup.
- Added `svelte-motion` entry animations to landing, feature, and solutions pages.
- Ran project validation with `npm run check` to confirm the Svelte project still compiles cleanly.

## Verification

- `npm run check` completed successfully with no Svelte errors reported.
- App shell cleanup confirmed in the final HTML markup.

## 2026-08-23

- Auth controls use shadcn `Input`, `Label`, `NativeSelect`, and `Button` primitives.
- Register creates owner access only, then routes to `/onboarding` for business profile setup.
- Onboarding collects business name, type, address, city, country, team size, and primary services.
- Shared inputs and native selects now use semantic `bg-background` and `border-input` styling for visible light-mode controls.
- Login and register include text-only Google and Apple buttons with shadcn outline styling.
- Auth panels use a semantic edge-glow treatment instead of box shadows.

## Current status

- Auth route/component diagnostics: passing.
- Onboarding route/component diagnostics: passing.
- Social login actions: visual placeholders only; provider integration is not connected.
- Full `pnpm check`: previously reported exit code 1 in the terminal despite no component diagnostics; needs a clean shell rerun if exact warning output is required.

## 2026-08-23 follow-up

- Root cause of invisible dark-mode fields: shared shadcn primitives overrode semantic `bg-background` with low-contrast `dark:bg-input/30`.
- Removed that override from shared `Input` and `NativeSelect`; dark fields now use the theme background with the theme border token.
- Updated the shared outline `Button` variant to use semantic `dark:bg-card` and `dark:hover:bg-muted`.
- Social login/signup buttons are text-only and rendered in two columns on auth pages.
- Current validation: editor diagnostics pass for shared primitives and auth/onboarding pages.
- Shared form and default button sizing increased to a consistent 40px control height; compact variants remain available.
- Added `onboarding-bizzy.png` as a large top-right onboarding decoration with semantic accent glow and responsive clipping.
- Moved the noise overlay to the onboarding page background; the form card now uses a translucent accent-border blue treatment instead of card noise.
- Onboarding page diagnostics pass; the only remaining stylesheet diagnostic is the existing `z-[1]` Tailwind suggestion.
- Added `register-bizzy.png` to the served static assets and positioned it left of the registration card so its raised hand presents toward the form.
- Register mascot has responsive tablet/mobile sizing and reduced opacity to keep form controls unobstructed.
- Register page diagnostics pass; the remaining stylesheet diagnostic is still the unrelated `z-[1]` Tailwind suggestion.
- Raised the register mascot above the card edge so its presenting hand remains visible; elevated and inset the left copy layer to prevent overlap with the logo and onboarding message.
- Fixed `NativeSelect` width globally by changing its wrapper from `w-fit` to `w-full`.
- Added the existing semantic `NoiseOverlay` to the onboarding card with layered content above it.
- Onboarding card now uses a themed primary border and contained texture instead of a plain surface.

## Status

- Loader fix: complete
- Motion polish: complete for the marketing pages
- Progress tracking docs: complete

## Dashboard repair

- Restored the shared dashboard shell to full-width responsive content instead of the previous forced 70% width when the sidebar was hidden.
- Widened the dashboard sidebar column and added shared semantic app canvas, header, and sidebar styling hooks.
- Replaced shared surface hardcoded shadow colors with theme-derived inset contrast.
- Normalized current dashboard shell width utilities for the Tailwind version in use.
- Dashboard shell source is updated; editor diagnostics are still reporting stale line-mapped utility suggestions and no new functional errors.
- Replaced the floating rounded sidebar with a flush full-height navigation rail.
- Restored the explicit 70% desktop content width when the sidebar toggle is closed, with full-width responsive fallback.
- Preserved sidebar permissions, active routes, extension items, and toggle behavior.
- Refined the shared dashboard page header with semantic primary hierarchy and a restrained themed canvas treatment.
- Added subtle shared stat-card hover emphasis while preserving existing dashboard data and interactions.
- Reworked the shared sidebar into a quieter professional rail with semantic primary active states, improved section rhythm, and responsive item sizing.
- Removed the remaining desktop grid gap and outer padding that made the rail appear floating; the sidebar is now flush while dashboard content keeps its own padding.
- Closed desktop sidebar state now uses 70% content width; shared dashboard utility warning was normalized.
- Unified revenue/stat cards with the dashboard surface system by removing embedded noise, heavy shadows, and reducing variant glow intensity.
- Replaced the bordered sidebar/header treatment with a borderless blended workspace style: tonal rail background, soft semantic edge glow, slim active marker, and header fade.
- Moved the dashboard header into the content column beside the sidebar.
- Sidebar now begins at the app viewport top, has no sticky offset or top margin, and spans the full desktop viewport height.
- Desktop app frame uses a flush 248px rail with dashboard content starting at the rail boundary.
