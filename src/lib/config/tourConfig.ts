import type { TourStep } from "./tour";

export type TourConfigMap = {
  [path: string]: TourStep[];
};

export const tourConfigurations: TourConfigMap = {
  "/dashboard": [
    {
      element: ".dashboard-signal",
      popover: {
        title: "Operating Picture",
        description:
          "See exactly how your business is doing today at a quick glance.",
        side: "bottom",
      },
    },
    {
      element: ".dashboard-grid > div:first-child",
      popover: {
        title: "Recent Transactions",
        description:
          "Track sales as they happen. Click 'View all' to see more details.",
        side: "right",
      },
    },
    {
      element: ".dashboard-grid > div:last-child",
      popover: {
        title: "Notifications & Alerts",
        description:
          "Stay updated on stock levels and important workspace notifications.",
        side: "left",
      },
    },
  ],
  "/transactions": [
    {
      element: ".surface-panel.sticky",
      popover: {
        title: "Daily Register Summary",
        description:
          "This shows your daily register summary, tracking today's overall revenue and your personal shift contributions.",
        side: "bottom",
      },
    },
    {
      element: "form",
      popover: {
        title: "Record New Sale",
        description:
          "Quickly record new sales by selecting a service, customer, and entering the amount.",
        side: "right",
      },
    },
    {
      element: ".grid > .surface-panel:nth-child(2), .lg\\:col-span-2",
      popover: {
        title: "Today's Register",
        description:
          "View and manage all transactions recorded today. Authorized staff can also delete erroneous entries here.",
        side: "left",
      },
    },
  ],
  "/extensions/marketing/builder": [
    {
      element: ".dashboard-page-header",
      popover: {
        title: "Builder Toolbar",
        description:
          "Manage page settings, preview your work, and publish your final design from this toolbar.",
        side: "bottom",
      },
    },
    {
      element: "aside:first-of-type",
      popover: {
        title: "Campaign Presets",
        description:
          "Quickly start your design by loading a pre-built campaign preset or access page settings.",
        side: "right",
      },
    },
    {
      element: "aside:last-of-type",
      popover: {
        title: "Elements Library",
        description:
          "Drag and drop these layout blocks, content elements, and widgets directly onto your canvas.",
        side: "right",
      },
    },
    {
      element: "section.canvas-bg",
      popover: {
        title: "Design Canvas",
        description:
          "This is your main workspace. Build your page visually, pan, zoom, and arrange elements freely.",
        side: "top",
      },
    },
    {
      element: "div.w-\\[320px\\]",
      popover: {
        title: "Inspector & Layers",
        description:
          "Select any element on the canvas to edit its properties here, or use the Layers tab to manage your page structure.",
        side: "left",
      },
    },
  ],
  // Add placeholder for inventory
  "/extensions/inventory": [
    {
      element: ".inventory-header", // Placeholder selector
      popover: {
        title: "Inventory",
        description: "Keep track of your stock and manage items.",
        side: "bottom",
      },
    },
  ],
};

/**
 * Helper to check if a path has an associated tour.
 */
export function getTourForPath(path: string): TourStep[] | null {
  // Exact match or handle trailing slashes if necessary
  const normalizedPath =
    path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;

  return tourConfigurations[normalizedPath] || null;
}
