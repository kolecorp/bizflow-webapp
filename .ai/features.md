# Features and UX improvements

## Completed
- Removed the blocking full-page app loader from the global HTML shell to eliminate the white flash after startup.
- Kept the app shell clean and simple so the page loads directly without a jarring startup overlay.
- Added motion to the main public landing page using the installed `svelte-motion` library.
- Added consistent motion treatment to the feature and solutions pages for a more polished marketing experience.
- Implemented premium extension payment flow using an interactive modal.
- Re-architected AI Tracking into a business-facing Activity Log for audit trails.
- Completed UI mockups for Wallet funding and customer balances dialogs.
- Polished VTU page action buttons.

## In progress / future polish
- Consider adding reduced-motion support for accessibility-conscious users.
- Review remaining public pages for motion consistency and pacing.
- Tune animation duration and entry offsets if the visual feel needs softer pacing after QA.

## Notes
- The animation approach uses gentle opacity and translate movement rather than blocking loaders.
- This preserves responsiveness and avoids the blank white flash seen during initial render.
