import { B as derived, U as writable } from "./internal.js";
import "./exports.js";
//#region src/lib/stores/businessData.ts
var today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
var yesterday = (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString().split("T")[0];
var twoDaysAgo = (/* @__PURE__ */ new Date(Date.now() - 1728e5)).toISOString().split("T")[0];
var seedTransactions = [
	{
		id: "tx-1",
		service: "Printing",
		customer: "Adebayo T.",
		amount: 5500,
		date: today,
		description: "100 pages color printing",
		time: "09:15 AM",
		recordedBy: "Aisha Morgan",
		recordedById: "demo-user-1"
	},
	{
		id: "tx-2",
		service: "Typing",
		customer: "Grace C.",
		amount: 8200,
		date: today,
		description: "Document typing and formatting",
		time: "10:42 AM",
		recordedBy: "Kemi Adeleke",
		recordedById: "staff-2"
	},
	{
		id: "tx-3",
		service: "Graphics Design",
		customer: "Emeka O.",
		amount: 15e3,
		date: today,
		description: "Logo design for startup",
		time: "11:20 AM",
		recordedBy: "Aisha Morgan",
		recordedById: "demo-user-1"
	},
	{
		id: "tx-4",
		service: "B&W Printing",
		customer: "Fatima A.",
		amount: 3200,
		date: today,
		description: "64 pages thesis printing",
		time: "01:05 PM",
		recordedBy: "Kemi Adeleke",
		recordedById: "staff-2"
	},
	{
		id: "tx-5",
		service: "Computer Session",
		customer: "Tunde B.",
		amount: 2500,
		date: today,
		description: "5-hour internet session",
		time: "02:30 PM",
		recordedBy: "Aisha Morgan",
		recordedById: "demo-user-1"
	},
	{
		id: "tx-6",
		service: "Colour Printing",
		customer: "Chioma N.",
		amount: 4800,
		date: yesterday,
		description: "32 colour pages",
		time: "03:15 PM",
		recordedBy: "Kemi Adeleke",
		recordedById: "staff-2"
	},
	{
		id: "tx-7",
		service: "Training Session",
		customer: "Youth Corp Batch",
		amount: 12e3,
		date: yesterday,
		description: "MS Office basics — 4 attendees",
		time: "10:00 AM",
		recordedBy: "Aisha Morgan",
		recordedById: "demo-user-1"
	},
	{
		id: "tx-8",
		service: "Lamination A4",
		customer: "Ibrahim S.",
		amount: 1600,
		date: yesterday,
		description: "8 sheets laminated",
		time: "04:45 PM",
		recordedBy: "Kemi Adeleke",
		recordedById: "staff-2"
	},
	{
		id: "tx-9",
		service: "Typing / Data Entry",
		customer: "Blessing E.",
		amount: 6500,
		date: twoDaysAgo,
		description: "13-page document typing",
		time: "11:30 AM",
		recordedBy: "Aisha Morgan",
		recordedById: "demo-user-1"
	},
	{
		id: "tx-10",
		service: "Graphics Design",
		customer: "Startup Hub",
		amount: 22e3,
		date: twoDaysAgo,
		description: "Event flyer + banner design",
		time: "09:00 AM",
		recordedBy: "Aisha Morgan",
		recordedById: "demo-user-1"
	}
];
var seedAgents = [{
	id: "agent-1",
	name: "Front Desk Computer",
	machine: "FRONT-DESK-PC",
	status: "online",
	version: "1.0.0",
	printersConnected: 3,
	lastSeen: "Just now"
}];
var seedPrinters = [
	{
		id: "printer-1",
		name: "HP LaserJet Pro",
		model: "HP LaserJet Pro M404dn",
		location: "Front Desk",
		status: "online",
		ip: "192.168.1.45",
		protocol: "IPP",
		agentId: "agent-1",
		jobsToday: 37,
		pagesToday: 142,
		pagesMonth: 2840,
		bwPages: 137,
		colorPages: 5,
		failedJobs: 1,
		queueCount: 2,
		supportsColor: false,
		supportsDuplex: true,
		paperSizes: ["A4", "Letter"],
		connectionType: "Network",
		tonerLevel: 72
	},
	{
		id: "printer-2",
		name: "Canon iR-ADV",
		model: "Canon imageRUNNER ADVANCE",
		location: "Admin Office",
		status: "warning",
		statusDetail: "Toner low",
		ip: "192.168.1.21",
		protocol: "IPP",
		agentId: "agent-1",
		jobsToday: 12,
		pagesToday: 58,
		pagesMonth: 1120,
		bwPages: 40,
		colorPages: 18,
		failedJobs: 0,
		queueCount: 0,
		supportsColor: true,
		supportsDuplex: true,
		paperSizes: ["A4", "A3"],
		connectionType: "Network",
		tonerLevel: 18
	},
	{
		id: "printer-3",
		name: "Epson L3250",
		model: "Epson EcoTank L3250",
		location: "Production",
		status: "offline",
		statusDetail: "Offline",
		ip: "192.168.1.30",
		protocol: "IPP",
		agentId: "agent-1",
		jobsToday: 8,
		pagesToday: 0,
		pagesMonth: 640,
		bwPages: 0,
		colorPages: 0,
		failedJobs: 2,
		queueCount: 0,
		supportsColor: true,
		supportsDuplex: false,
		paperSizes: ["A4"],
		connectionType: "Network"
	}
];
var seedPrintJobs = [
	{
		id: "JOB-10293",
		time: "10:31 AM",
		user: "John",
		document: "Invoice #1023",
		printerId: "printer-1",
		printerName: "HP LaserJet Pro",
		copies: 2,
		pages: 4,
		status: "completed",
		color: false,
		duplex: true,
		customer: "John Doe",
		amount: 500
	},
	{
		id: "JOB-10294",
		time: "10:34 AM",
		user: "Mary",
		document: "Application.pdf",
		printerId: "printer-2",
		printerName: "Canon iR-ADV",
		copies: 1,
		pages: 3,
		status: "completed",
		color: true,
		duplex: false,
		customer: "Mary Okonkwo",
		amount: 750
	},
	{
		id: "JOB-10295",
		time: "10:38 AM",
		user: "John",
		document: "Letter.docx",
		printerId: "printer-1",
		printerName: "HP LaserJet Pro",
		copies: 1,
		pages: 2,
		status: "failed",
		color: false,
		duplex: false
	},
	{
		id: "JOB-10296",
		time: "10:45 AM",
		user: "Aisha",
		document: "Training Manual.pdf",
		printerId: "printer-2",
		printerName: "Canon iR-ADV",
		copies: 5,
		pages: 20,
		status: "printing",
		color: true,
		duplex: true,
		customer: "Training Center",
		amount: 4500
	},
	{
		id: "JOB-10297",
		time: "10:48 AM",
		user: "Grace",
		document: "CV Template.docx",
		printerId: "printer-1",
		printerName: "HP LaserJet Pro",
		copies: 1,
		pages: 2,
		status: "queued",
		color: false,
		duplex: false,
		customer: "Grace C."
	}
];
var seedInventory = [
	{
		id: "inv-1",
		name: "A4 Paper (80gsm)",
		category: "Paper",
		sku: "PAP-A4-80",
		quantity: 24,
		minQuantity: 10,
		unit: "reams",
		location: "Store Room",
		lastCounted: today,
		costPerUnit: 4500
	},
	{
		id: "inv-2",
		name: "A3 Paper",
		category: "Paper",
		sku: "PAP-A3",
		quantity: 6,
		minQuantity: 4,
		unit: "reams",
		location: "Store Room",
		lastCounted: today,
		costPerUnit: 6800
	},
	{
		id: "inv-3",
		name: "Black Ink (HP 58A)",
		category: "Ink & Toner",
		sku: "INK-HP58A",
		quantity: 3,
		minQuantity: 2,
		unit: "cartridges",
		location: "Front Desk",
		lastCounted: today,
		costPerUnit: 12500
	},
	{
		id: "inv-4",
		name: "Color Ink Set (Canon)",
		category: "Ink & Toner",
		sku: "INK-CAN-SET",
		quantity: 1,
		minQuantity: 2,
		unit: "sets",
		location: "Admin Office",
		lastCounted: today,
		costPerUnit: 18500
	},
	{
		id: "inv-5",
		name: "Binding Covers",
		category: "Supplies",
		sku: "SUP-BIND",
		quantity: 45,
		minQuantity: 20,
		unit: "pieces",
		location: "Front Desk",
		lastCounted: today,
		costPerUnit: 150
	},
	{
		id: "inv-6",
		name: "Lamination Film A4",
		category: "Supplies",
		sku: "SUP-LAM-A4",
		quantity: 8,
		minQuantity: 5,
		unit: "packs",
		location: "Store Room",
		lastCounted: today,
		costPerUnit: 3200
	}
];
var seedAdjustments = [{
	id: "adj-1",
	itemId: "inv-1",
	itemName: "A4 Paper (80gsm)",
	type: "count",
	quantity: 24,
	reason: "Weekly stock count",
	date: today,
	time: "08:30 AM",
	by: "Aisha Morgan"
}];
var seedComputers = [
	{
		id: "pc-1",
		name: "PC-01",
		label: "Front Desk 1",
		status: "in-use",
		currentUser: "John",
		sessionStart: "09:00 AM",
		hourlyRate: 500,
		printsToday: 12,
		agentId: "ws-agent-1",
		agentConnected: true,
		allowsFileTransfer: true
	},
	{
		id: "pc-2",
		name: "PC-02",
		label: "Front Desk 2",
		status: "in-use",
		currentUser: "Mary",
		sessionStart: "10:15 AM",
		hourlyRate: 500,
		printsToday: 8,
		agentId: "ws-agent-2",
		agentConnected: true,
		allowsFileTransfer: false
	},
	{
		id: "pc-3",
		name: "PC-03",
		label: "Training Room",
		status: "online",
		hourlyRate: 400,
		printsToday: 3,
		agentId: "ws-agent-3",
		agentConnected: true,
		allowsFileTransfer: true
	},
	{
		id: "pc-4",
		name: "PC-04",
		label: "Graphics Station",
		status: "in-use",
		currentUser: "Emeka",
		sessionStart: "08:45 AM",
		hourlyRate: 600,
		printsToday: 5,
		agentId: "ws-agent-4",
		agentConnected: true,
		allowsFileTransfer: true
	},
	{
		id: "pc-5",
		name: "PC-05",
		label: "Back Office",
		status: "offline",
		hourlyRate: 400,
		printsToday: 0,
		agentConnected: false,
		allowsFileTransfer: false
	}
];
var seedServices = [
	{
		id: "svc-1",
		name: "B&W Printing",
		category: "Printing",
		price: 50,
		unit: "per page",
		active: true,
		description: "Black and white A4 printing"
	},
	{
		id: "svc-2",
		name: "Colour Printing",
		category: "Printing",
		price: 150,
		unit: "per page",
		active: true,
		description: "Full colour A4 printing"
	},
	{
		id: "svc-3",
		name: "A3 Printing",
		category: "Printing",
		price: 200,
		unit: "per page",
		active: true
	},
	{
		id: "svc-4",
		name: "Typing / Data Entry",
		category: "Typing",
		price: 500,
		unit: "per page",
		active: true
	},
	{
		id: "svc-5",
		name: "Graphics Design",
		category: "Graphics",
		price: 5e3,
		unit: "per project",
		active: true
	},
	{
		id: "svc-6",
		name: "Computer Session",
		category: "Computers",
		price: 500,
		unit: "per hour",
		active: true
	},
	{
		id: "svc-7",
		name: "Training Session",
		category: "Training",
		price: 3e3,
		unit: "per session",
		active: true
	},
	{
		id: "svc-8",
		name: "Lamination A4",
		category: "Printing",
		price: 200,
		unit: "per sheet",
		active: true
	}
];
var seedDiscovered = [
	{
		id: "disc-1",
		name: "HP LaserJet Pro",
		ip: "192.168.1.45",
		protocol: "IPP",
		supportsColor: false,
		supportsDuplex: true,
		paperSizes: ["A4", "Letter"],
		status: "online"
	},
	{
		id: "disc-2",
		name: "Canon imageRUNNER",
		ip: "192.168.1.21",
		protocol: "IPP",
		supportsColor: true,
		supportsDuplex: true,
		paperSizes: ["A4", "A3"],
		status: "online"
	},
	{
		id: "disc-3",
		name: "Epson L3250",
		ip: "192.168.1.30",
		protocol: "IPP",
		supportsColor: true,
		supportsDuplex: false,
		paperSizes: ["A4"],
		status: "offline"
	},
	{
		id: "disc-4",
		name: "HP DeskJet",
		ip: "192.168.1.50",
		protocol: "IPP",
		supportsColor: true,
		supportsDuplex: false,
		paperSizes: ["A4"],
		status: "warning"
	}
];
function createBusinessStore() {
	const transactions = writable(seedTransactions);
	const printAgents = writable(seedAgents);
	const printers = writable(seedPrinters);
	const printJobs = writable(seedPrintJobs);
	const inventory = writable(seedInventory);
	const stockAdjustments = writable(seedAdjustments);
	const computers = writable(seedComputers);
	const services = writable(seedServices);
	const discoveredPrinters = writable(seedDiscovered);
	const pairingCode = writable(null);
	const agentSearching = writable(false);
	const todayTransactions = derived(transactions, ($tx) => $tx.filter((t) => t.date === today));
	const todayRevenue = derived(todayTransactions, ($tx) => $tx.reduce((sum, t) => sum + t.amount, 0));
	const lowStockItems = derived(inventory, ($items) => $items.filter((i) => i.quantity <= i.minQuantity));
	function addTransaction(input) {
		const time = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-NG", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		});
		const tx = {
			...input,
			id: `tx-${Date.now()}`,
			time
		};
		transactions.update((list) => [tx, ...list]);
		return tx;
	}
	function deleteTransaction(id) {
		transactions.update((list) => list.filter((t) => t.id !== id));
	}
	function adjustStock(itemId, type, quantity, reason, by) {
		const time = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-NG", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		});
		inventory.update((items) => {
			const itemName = items.find((i) => i.id === itemId)?.name ?? "Unknown";
			stockAdjustments.update((list) => {
				return [{
					id: `adj-${Date.now()}`,
					itemId,
					itemName,
					type,
					quantity,
					reason,
					date: today,
					time,
					by
				}, ...list];
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
					lastCounted: today
				};
			});
		});
	}
	function generatePairingCode() {
		const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
		let code = "BF-";
		for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * 32)];
		code += "-";
		for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * 32)];
		pairingCode.set(code);
		return code;
	}
	function simulateAgentSearch() {
		agentSearching.set(true);
		setTimeout(() => agentSearching.set(false), 2e3);
	}
	function connectDiscoveredPrinter(discoveredId) {
		const disc = seedDiscovered.find((d) => d.id === discoveredId);
		if (!disc) return;
		printers.update((list) => {
			if (list.some((p) => p.ip === disc.ip)) return list;
			const newPrinter = {
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
				connectionType: "Network"
			};
			return [...list, newPrinter];
		});
		discoveredPrinters.update((list) => list.filter((d) => d.id !== discoveredId));
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
		deleteTransaction,
		adjustStock,
		generatePairingCode,
		simulateAgentSearch,
		connectDiscoveredPrinter
	};
}
var _business = createBusinessStore();
var transactions = _business.transactions;
var printAgents = _business.printAgents;
var printers = _business.printers;
var printJobs = _business.printJobs;
var inventory = _business.inventory;
var stockAdjustments = _business.stockAdjustments;
var computers = _business.computers;
var services = _business.services;
var discoveredPrinters = _business.discoveredPrinters;
var pairingCode = _business.pairingCode;
var agentSearching = _business.agentSearching;
var todayTransactions = _business.todayTransactions;
var todayRevenue = _business.todayRevenue;
var lowStockItems = _business.lowStockItems;
var { addTransaction, deleteTransaction, adjustStock, generatePairingCode, simulateAgentSearch, connectDiscoveredPrinter } = _business;
//#endregion
export { lowStockItems as a, printJobs as c, stockAdjustments as d, todayRevenue as f, inventory as i, printers as l, transactions as m, computers as n, pairingCode as o, todayTransactions as p, discoveredPrinters as r, printAgents as s, agentSearching as t, services as u };
