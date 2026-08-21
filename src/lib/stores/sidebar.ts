import { writable } from "svelte/store";

const STORAGE_KEY = "bizflow-sidebar-open";

function readInitial(): boolean {
  if (typeof window === "undefined") return true;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved !== "false";
}

function createSidebarStore() {
  const { subscribe, set, update } = writable<boolean>(readInitial());

  subscribe((open) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, String(open));
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
