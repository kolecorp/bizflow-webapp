import { writable } from "svelte/store";

const DESKTOP_STORAGE_KEY = "bizflow-sidebar-open-desktop";

function isMobileViewport() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1023px)").matches
  );
}

function readInitial(): boolean {
  if (typeof window === "undefined") return false;
  if (isMobileViewport()) return false;
  return window.localStorage.getItem(DESKTOP_STORAGE_KEY) !== "false";
}

function createSidebarStore() {
  const { subscribe, set, update } = writable<boolean>(readInitial());

  if (typeof window !== "undefined") {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    mediaQuery.addEventListener("change", (event) => {
      if (event.matches) {
        set(false);
      } else {
        set(window.localStorage.getItem(DESKTOP_STORAGE_KEY) !== "false");
      }
    });
  }

  subscribe((open) => {
    if (typeof window !== "undefined" && !isMobileViewport()) {
      window.localStorage.setItem(DESKTOP_STORAGE_KEY, String(open));
    }
  });

  return {
    subscribe,
    open: () => set(true),
    close: () => set(false),
    toggle: () => update((v) => !v),
  };
}

export const sidebar = createSidebarStore();
