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
};

function createModalStore() {
  const { subscribe, set, update } = writable<ModalState>({
    dailySales: false,
    newTransaction: false,
    sendFile: false,
    sendFileTarget: null,
  });

  return {
    subscribe,
    openDailySales: () =>
      update((state) => ({ ...state, dailySales: true, newTransaction: false })),
    closeDailySales: () => update((state) => ({ ...state, dailySales: false })),
    openNewTransaction: () =>
      update((state) => ({ ...state, newTransaction: true, dailySales: false })),
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
    closeAll: () =>
      set({
        dailySales: false,
        newTransaction: false,
        sendFile: false,
        sendFileTarget: null,
      }),
  };
}

export const modals = createModalStore();
