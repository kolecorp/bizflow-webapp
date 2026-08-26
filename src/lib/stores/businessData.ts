import { writable, derived } from "svelte/store";
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
    transactions.update((list) => [tx, ...list]);
    return tx;
  }

  function addService(input: Omit<ServiceCatalogItem, "id">) {
    const service: ServiceCatalogItem = {
      ...input,
      id: `service-${Date.now()}`,
    };
    services.update((list) => [...list, service]);
    return service;
  }

  function updateService(
    id: string,
    changes: Partial<Omit<ServiceCatalogItem, "id">>,
  ) {
    services.update((list) =>
      list.map((service) =>
        service.id === id ? { ...service, ...changes } : service,
      ),
    );
  }

  function toggleService(id: string) {
    services.update((list) =>
      list.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service,
      ),
    );
  }

  function deleteService(id: string) {
    services.update((list) => list.filter((service) => service.id !== id));
  }

  function addInventoryItem(input: Omit<InventoryItem, "id">) {
    const item: InventoryItem = { ...input, id: `inventory-${Date.now()}` };
    inventory.update((list) => [...list, item]);
    return item;
  }

  function updateInventoryItem(
    id: string,
    changes: Partial<Omit<InventoryItem, "id">>,
  ) {
    inventory.update((list) =>
      list.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }

  function deleteInventoryItem(id: string) {
    inventory.update((list) => list.filter((item) => item.id !== id));
    stockAdjustments.update((list) => list.filter((adjustment) => adjustment.itemId !== id));
  }

  function deleteTransaction(id: string) {
    transactions.update((list) => list.filter((t) => t.id !== id));
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
