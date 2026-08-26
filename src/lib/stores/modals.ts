import { writable } from "svelte/store";

type SendFileTarget = {
  computerId: string;
  computerName: string;
};

type ModalState = {
  dailySales: boolean;
  newTransaction: boolean;
  sendFile: boolean;
  sendFileTarget: SendFileTarget | null;
  settings: boolean;
  settingsSection: string;
};

function createModalStore() {
  const { subscribe, set, update } = writable<ModalState>({
    dailySales: false,
    newTransaction: false,
    sendFile: false,
    sendFileTarget: null,
    settings: false,
    settingsSection: "profile",
  });

  return {
    subscribe,
    openDailySales: () =>
      update((state) => ({
        ...state,
        dailySales: true,
        newTransaction: false,
      })),
    closeDailySales: () => update((state) => ({ ...state, dailySales: false })),
    openNewTransaction: () =>
      update((state) => ({
        ...state,
        newTransaction: true,
        dailySales: false,
      })),
    closeNewTransaction: () =>
      update((state) => ({ ...state, newTransaction: false })),
    openSendFile: (target: SendFileTarget) =>
      update((state) => ({
        ...state,
        sendFile: true,
        sendFileTarget: target,
      })),
    closeSendFile: () =>
      update((state) => ({
        ...state,
        sendFile: false,
        sendFileTarget: null,
      })),
    openSettings: (section = "profile") =>
      update((state) => ({
        ...state,
        settings: true,
        settingsSection: section,
      })),
    closeSettings: () => update((state) => ({ ...state, settings: false })),
    closeAll: () =>
      set({
        dailySales: false,
        newTransaction: false,
        sendFile: false,
        sendFileTarget: null,
        settings: false,
        settingsSection: "profile",
      }),
  };
}

export const modals = createModalStore();
