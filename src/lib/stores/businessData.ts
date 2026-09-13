import { browser } from "$app/environment";
import { get, writable, derived } from "svelte/store";
import { authStore } from "$lib/stores/auth";
import type {
  Computer,
  DiscoveredPrinter,
  InventoryItem,
  PrintAgent,
  PrintJob,
  Printer,
  ServiceCatalogItem,
  ServiceTransaction,
  StockAdjustment,
} from "$lib/types/business";

const today = new Date().toISOString().split("T")[0];

const seedTransactions: ServiceTransaction[] = [];
const seedAgents: PrintAgent[] = [];
const seedPrinters: Printer[] = [];
const seedPrintJobs: PrintJob[] = [];
const seedInventory: InventoryItem[] = [];
const seedAdjustments: StockAdjustment[] = [];
const seedComputers: Computer[] = [];
const seedServices: ServiceCatalogItem[] = [];
const seedDiscovered: DiscoveredPrinter[] = [];

function createBusinessStore() {
  const transactions = writable<ServiceTransaction[]>(seedTransactions);
  const printAgents = writable<PrintAgent[]>(seedAgents);
  const printers = writable<Printer[]>(seedPrinters);
  const printJobs = writable<PrintJob[]>(seedPrintJobs);
  const inventory = writable<InventoryItem[]>(seedInventory);
  const stockAdjustments = writable<StockAdjustment[]>(seedAdjustments);
  const computers = writable<Computer[]>(seedComputers);
  const services = writable<ServiceCatalogItem[]>(seedServices);
  const discoveredPrinters = writable<DiscoveredPrinter[]>(seedDiscovered);
  const pairingCode = writable<string | null>(null);
  const agentSearching = writable(false);
  let operationalLoad: Promise<void> | null = null;

  const apiBase =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";
  async function api(path: string, init?: RequestInit) {
    const token = get(authStore).accessToken;
    const response = await fetch(`${apiBase}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
    if (!response.ok)
      throw new Error(
        (await response.json().catch(() => null))?.message ??
          "Operational request failed.",
      );
    return response.json();
  }

  async function syncOperationalData() {
    if (!browser || !get(authStore).isAuthenticated || operationalLoad)
      return operationalLoad;
    operationalLoad = Promise.all([
      api("/services"),
      api("/inventory"),
      api("/inventory/adjustments"),
      api("/transactions"),
    ])
      .then(([serviceRows, inventoryRows, adjustmentRows, transactionRows]) => {
        services.set(
          serviceRows.map((item: any) => ({
            ...item,
            price: Number(item.price),
          })),
        );
        inventory.set(
          inventoryRows.map((item: any) => ({
            ...item,
            quantity: Number(item.quantity),
            minQuantity: Number(item.minQuantity),
            costPerUnit:
              item.costPerUnit == null ? undefined : Number(item.costPerUnit),
            lastCounted: item.lastCounted?.slice(0, 10),
          })),
        );
        stockAdjustments.set(
          adjustmentRows.map((row: any) => ({
            id: row.id,
            itemId: row.itemId,
            itemName: row.item.name,
            type: row.type.toLowerCase(),
            quantity: row.quantity,
            reason: row.reason,
            date: row.createdAt.slice(0, 10),
            time: new Date(row.createdAt).toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            by: row.byUserId ?? "Staff",
          })),
        );
        transactions.set(
          transactionRows.map((row: any) => {
            const date = row.createdAt.slice(0, 10);
            return {
              id: row.id,
              service: row.service?.name ?? "General service",
              customer: row.customer,
              amount: Number(row.amount),
              date,
              description: row.description,
              time: new Date(row.createdAt).toLocaleTimeString("en-NG", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              recordedBy: row.recordedBy?.name ?? "Staff",
              recordedById: row.recordedById,
            };
          }),
        );
      })
      .finally(() => {
        operationalLoad = null;
      });
    return operationalLoad;
  }

  const todayTransactions = derived(transactions, ($tx) =>
    $tx.filter((t) => t.date === today),
  );

  const todayRevenue = derived(todayTransactions, ($tx) =>
    $tx.reduce((sum, t) => sum + t.amount, 0),
  );

  const lowStockItems = derived(inventory, ($items) =>
    $items.filter((i) => i.quantity <= i.minQuantity),
  );

  function addTransaction(input: Omit<ServiceTransaction, "id" | "time">) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const tx: ServiceTransaction = {
      ...input,
      id: `tx-${Date.now()}`,
      time,
    };
    void api("/transactions", {
      method: "POST",
      body: JSON.stringify({
        serviceId: get(services).find(
          (service) => service.name === input.service,
        )?.id,
        customer: input.customer,
        amount: input.amount,
        description: input.description,
      }),
    }).then(() => syncOperationalData());
    return tx;
  }

  function addService(input: Omit<ServiceCatalogItem, "id">) {
    const service: ServiceCatalogItem = {
      ...input,
      id: `service-${Date.now()}`,
    };
    void api("/services", { method: "POST", body: JSON.stringify(input) }).then(
      () => syncOperationalData(),
    );
    return service;
  }

  function updateService(
    id: string,
    changes: Partial<Omit<ServiceCatalogItem, "id">>,
  ) {
    void api(`/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    }).then(() => syncOperationalData());
  }

  function toggleService(id: string) {
    const service = get(services).find((item) => item.id === id);
    if (service)
      void api(`/services/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !service.active }),
      }).then(() => syncOperationalData());
  }

  function deleteService(id: string) {
    void api(`/services/${id}`, { method: "DELETE" }).then(() =>
      syncOperationalData(),
    );
  }

  function addInventoryItem(input: Omit<InventoryItem, "id">) {
    const item: InventoryItem = { ...input, id: `inventory-${Date.now()}` };
    void api("/inventory", {
      method: "POST",
      body: JSON.stringify(input),
    }).then(() => syncOperationalData());
    return item;
  }

  function updateInventoryItem(
    id: string,
    changes: Partial<Omit<InventoryItem, "id">>,
  ) {
    void api(`/inventory/${id}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    }).then(() => syncOperationalData());
  }

  function deleteInventoryItem(id: string) {
    void api(`/inventory/${id}`, { method: "DELETE" }).then(() =>
      syncOperationalData(),
    );
  }

  function deleteTransaction(id: string) {
    void api(`/transactions/${id}`, { method: "DELETE" }).then(() =>
      syncOperationalData(),
    );
  }

  function adjustStock(
    itemId: string,
    type: StockAdjustment["type"],
    quantity: number,
    reason: string,
    by: string,
  ) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    void api(`/inventory/${itemId}/adjust`, {
      method: "POST",
      body: JSON.stringify({ type, quantity, reason }),
    }).then(() => syncOperationalData());
    inventory.update((items) => {
      const found = items.find((i) => i.id === itemId);
      const itemName = found?.name ?? "Unknown";

      stockAdjustments.update((list) => {
        const adjustment: StockAdjustment = {
          id: `adj-${Date.now()}`,
          itemId,
          itemName,
          type,
          quantity,
          reason,
          date: today,
          time,
          by,
        };
        return [adjustment, ...list];
      });

      return items.map((item) => {
        if (item.id !== itemId) return item;
        let newQty = item.quantity;
        if (type === "add") newQty += quantity;
        else if (type === "remove") newQty = Math.max(0, newQty - quantity);
        else newQty = quantity;
        return {
          ...item,
          quantity: newQty,
          lastCounted: today,
        };
      });
    });
  }

  function generatePairingCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "BF-";
    for (let i = 0; i < 4; i++)
      code += chars[Math.floor(Math.random() * chars.length)];
    code += "-";
    for (let i = 0; i < 4; i++)
      code += chars[Math.floor(Math.random() * chars.length)];
    pairingCode.set(code);
    return code;
  }

  function simulateAgentSearch() {
    agentSearching.set(true);
    setTimeout(() => agentSearching.set(false), 2000);
  }

  function connectDiscoveredPrinter(discoveredId: string) {
    const disc = seedDiscovered.find((d) => d.id === discoveredId);
    if (!disc) return;
    printers.update((list) => {
      if (list.some((p) => p.ip === disc.ip)) return list;
      const newPrinter: Printer = {
        id: `printer-${Date.now()}`,
        name: disc.name,
        model: disc.name,
        location: "Unassigned",
        status: disc.status,
        ip: disc.ip,
        protocol: disc.protocol,
        agentId: "agent-1",
        jobsToday: 0,
        pagesToday: 0,
        pagesMonth: 0,
        bwPages: 0,
        colorPages: 0,
        failedJobs: 0,
        queueCount: 0,
        supportsColor: disc.supportsColor,
        supportsDuplex: disc.supportsDuplex,
        paperSizes: disc.paperSizes,
        connectionType: "Network",
      };
      return [...list, newPrinter];
    });
    discoveredPrinters.update((list) =>
      list.filter((d) => d.id !== discoveredId),
    );
  }

  return {
    transactions,
    printAgents,
    printers,
    printJobs,
    inventory,
    stockAdjustments,
    computers,
    services,
    discoveredPrinters,
    pairingCode,
    agentSearching,
    todayTransactions,
    todayRevenue,
    lowStockItems,
    addTransaction,
    addService,
    updateService,
    toggleService,
    deleteService,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    deleteTransaction,
    adjustStock,
    generatePairingCode,
    simulateAgentSearch,
    connectDiscoveredPrinter,
    syncOperationalData,
  };
}

const _business = createBusinessStore();

export const businessData = _business;
export const transactions = _business.transactions;
export const printAgents = _business.printAgents;
export const printers = _business.printers;
export const printJobs = _business.printJobs;
export const inventory = _business.inventory;
export const stockAdjustments = _business.stockAdjustments;
export const computers = _business.computers;
export const services = _business.services;
export const discoveredPrinters = _business.discoveredPrinters;
export const pairingCode = _business.pairingCode;
export const agentSearching = _business.agentSearching;
export const todayTransactions = _business.todayTransactions;
export const todayRevenue = _business.todayRevenue;
export const lowStockItems = _business.lowStockItems;
export const {
  addTransaction,
  addService,
  updateService,
  toggleService,
  deleteService,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  deleteTransaction,
  adjustStock,
  generatePairingCode,
  simulateAgentSearch,
  connectDiscoveredPrinter,
} = _business;
