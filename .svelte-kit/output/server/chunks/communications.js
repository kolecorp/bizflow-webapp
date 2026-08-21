import { B as derived, U as writable, V as get } from "./internal.js";
import "./exports.js";
import { t as authStore } from "./auth.js";
import { r as notifications } from "./notifications.js";
//#region src/lib/stores/communications.ts
var today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
function formatTime(date = /* @__PURE__ */ new Date()) {
	return date.toLocaleTimeString("en-NG", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	});
}
var seedAgents = [
	{
		id: "ws-agent-1",
		computerId: "pc-1",
		machine: "FRONT-DESK-1",
		status: "online",
		version: "1.0.0",
		lastSeen: "Just now",
		allowsFileTransfer: true,
		allowsStaffChat: true
	},
	{
		id: "ws-agent-2",
		computerId: "pc-2",
		machine: "FRONT-DESK-2",
		status: "online",
		version: "1.0.0",
		lastSeen: "2 min ago",
		allowsFileTransfer: false,
		allowsStaffChat: true
	},
	{
		id: "ws-agent-3",
		computerId: "pc-3",
		machine: "TRAINING-ROOM",
		status: "online",
		version: "1.0.0",
		lastSeen: "Just now",
		allowsFileTransfer: true,
		allowsStaffChat: false
	},
	{
		id: "ws-agent-4",
		computerId: "pc-4",
		machine: "GRAPHICS-STATION",
		status: "online",
		version: "1.0.0",
		lastSeen: "5 min ago",
		allowsFileTransfer: true,
		allowsStaffChat: true
	}
];
var seedChannels = [{
	id: "ch-team",
	name: "Front desk team",
	type: "team",
	members: [
		"Aisha Morgan",
		"Grace C.",
		"John",
		"Mary"
	],
	lastMessageAt: today
}, {
	id: "ch-ops",
	name: "Operations",
	type: "team",
	members: ["Aisha Morgan", "Emeka O."],
	lastMessageAt: today
}];
var seedMessages = [
	{
		id: "msg-1",
		channelId: "ch-team",
		senderId: "grace",
		senderName: "Grace C.",
		body: "Please check toner on Canon before the training session.",
		sentAt: "09:05 AM",
		rpcId: "rpc-chat-001"
	},
	{
		id: "msg-2",
		channelId: "ch-team",
		senderId: "aisha",
		senderName: "Aisha Morgan",
		body: "On it — also PC-02 customer asked for their CV on USB.",
		sentAt: "09:08 AM"
	},
	{
		id: "msg-3",
		channelId: "ch-ops",
		senderId: "emeka",
		senderName: "Emeka O.",
		body: "Graphics station running slow — may need restart after current job.",
		sentAt: "08:50 AM",
		rpcId: "rpc-chat-002"
	}
];
var seedTickets = [
	{
		id: "TKT-1042",
		subject: "Cannot open saved document",
		customer: "Adebayo T.",
		description: "Customer saved a Word file to Desktop but double-click does nothing. Needs help before 11 AM.",
		priority: "high",
		status: "open",
		createdAt: `${today}T08:30:00`,
		updatedAt: `${today}T08:30:00`,
		computerId: "pc-1",
		computerName: "PC-01"
	},
	{
		id: "TKT-1041",
		subject: "Print queue stuck",
		customer: "Mary Okonkwo",
		description: "Print dialog shows 3 jobs but nothing prints from browser.",
		priority: "medium",
		status: "in_progress",
		assignedTo: "Grace C.",
		createdAt: `${today}T07:45:00`,
		updatedAt: `${today}T09:10:00`,
		computerId: "pc-2",
		computerName: "PC-02"
	},
	{
		id: "TKT-1038",
		subject: "Training session setup",
		customer: "Training Center",
		description: "Need PowerPoint and projector test before 2 PM session.",
		priority: "low",
		status: "resolved",
		assignedTo: "John",
		createdAt: `${today}T06:00:00`,
		updatedAt: `${today}T10:00:00`,
		resolvedAt: `${today}T10:00:00`,
		computerId: "pc-3",
		computerName: "PC-03"
	}
];
var seedComments = [{
	id: "tc-1",
	ticketId: "TKT-1041",
	author: "Grace C.",
	body: "Cleared stuck jobs from print spooler. Retesting now.",
	createdAt: "09:12 AM",
	internal: true
}, {
	id: "tc-2",
	ticketId: "TKT-1038",
	author: "John",
	body: "Projector and PowerPoint verified. Customer notified.",
	createdAt: "10:00 AM",
	internal: false
}];
var seedTransfers = [{
	id: "ft-1",
	computerId: "pc-3",
	computerName: "PC-03",
	fileName: "Training_Manual.pdf",
	fileSize: 2457600,
	direction: "to_computer",
	status: "delivered",
	sentBy: "Aisha Morgan",
	sentAt: "08:55 AM",
	completedAt: "08:56 AM"
}];
function createCommunicationsStore() {
	const workstationAgents = writable(seedAgents);
	const chatChannels = writable(seedChannels);
	const chatMessages = writable(seedMessages);
	const supportTickets = writable(seedTickets);
	const ticketComments = writable(seedComments);
	const fileTransfers = writable(seedTransfers);
	const openTickets = derived(supportTickets, ($tickets) => $tickets.filter((t) => t.status !== "resolved" && t.status !== "closed"));
	const activeTransfers = derived(fileTransfers, ($jobs) => $jobs.filter((j) => j.status === "pending" || j.status === "uploading"));
	function getAgentForComputer(computerId) {
		return get(workstationAgents).find((a) => a.computerId === computerId);
	}
	function canSendFileToComputer(computerId) {
		const agent = getAgentForComputer(computerId);
		return !!agent && agent.status === "online" && agent.allowsFileTransfer;
	}
	function sendFileToComputer(input) {
		const agent = getAgentForComputer(input.computerId);
		const user = get(authStore).user;
		if (!agent || agent.status !== "online") {
			notifications.push({
				title: "File transfer failed",
				message: `${input.computerName} workstation agent is offline.`,
				kind: "error",
				category: "file_transfer"
			});
			return null;
		}
		if (!agent.allowsFileTransfer) {
			notifications.push({
				title: "File transfer blocked",
				message: `${input.computerName} has not allowed incoming files from staff.`,
				kind: "warning",
				category: "file_transfer",
				href: "/computers"
			});
			return null;
		}
		const job = {
			id: `ft-${Date.now()}`,
			computerId: input.computerId,
			computerName: input.computerName,
			fileName: input.fileName,
			fileSize: input.fileSize,
			direction: "to_computer",
			status: "uploading",
			sentBy: user?.name ?? "Staff",
			sentAt: formatTime()
		};
		fileTransfers.update((list) => [job, ...list]);
		notifications.push({
			title: "Sending file",
			message: `Uploading ${input.fileName} to ${input.computerName} via RPC…`,
			kind: "info",
			category: "file_transfer"
		});
		setTimeout(() => {
			fileTransfers.update((list) => list.map((j) => j.id === job.id ? {
				...j,
				status: "delivered",
				completedAt: formatTime()
			} : j));
			notifications.push({
				title: "File delivered",
				message: `${input.fileName} is now on ${input.computerName} Desktop.`,
				kind: "success",
				category: "file_transfer",
				href: "/computers"
			});
		}, 1800);
		return job;
	}
	function sendChatMessage(channelId, body) {
		const user = get(authStore).user;
		const trimmed = body.trim();
		if (!trimmed) return null;
		const message = {
			id: `msg-${Date.now()}`,
			channelId,
			senderId: user?.id ?? "staff",
			senderName: user?.name ?? "Staff",
			body: trimmed,
			sentAt: formatTime(),
			rpcId: `rpc-chat-${Date.now()}`
		};
		chatMessages.update((list) => [...list, message]);
		chatChannels.update((list) => list.map((ch) => ch.id === channelId ? {
			...ch,
			lastMessageAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
		} : ch));
		return message;
	}
	function createTicket(input) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const ticket = {
			id: `TKT-${1043 + get(supportTickets).length}`,
			subject: input.subject,
			customer: input.customer,
			description: input.description,
			priority: input.priority,
			status: "open",
			createdAt: now,
			updatedAt: now,
			computerId: input.computerId,
			computerName: input.computerName
		};
		supportTickets.update((list) => [ticket, ...list]);
		notifications.push({
			title: "Ticket created",
			message: `${ticket.id} — ${ticket.subject}`,
			kind: "success",
			category: "ticket",
			href: "/support"
		});
		return ticket;
	}
	function updateTicketStatus(ticketId, status, assignedTo) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		supportTickets.update((list) => list.map((t) => {
			if (t.id !== ticketId) return t;
			const resolved = status === "resolved" || status === "closed";
			return {
				...t,
				status,
				assignedTo: assignedTo ?? t.assignedTo,
				updatedAt: now,
				resolvedAt: resolved ? now : t.resolvedAt
			};
		}));
		if (status === "resolved") notifications.push({
			title: "Ticket resolved",
			message: `${ticketId} marked as resolved.`,
			kind: "success",
			category: "ticket",
			href: "/support"
		});
	}
	function addTicketComment(ticketId, body, internal = true) {
		const user = get(authStore).user;
		const comment = {
			id: `tc-${Date.now()}`,
			ticketId,
			author: user?.name ?? "Staff",
			body: body.trim(),
			createdAt: formatTime(),
			internal
		};
		if (!comment.body) return null;
		ticketComments.update((list) => [...list, comment]);
		supportTickets.update((list) => list.map((t) => t.id === ticketId ? {
			...t,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		} : t));
		return comment;
	}
	return {
		workstationAgents,
		chatChannels,
		chatMessages,
		supportTickets,
		ticketComments,
		fileTransfers,
		openTickets,
		activeTransfers,
		getAgentForComputer,
		canSendFileToComputer,
		sendFileToComputer,
		sendChatMessage,
		createTicket,
		updateTicketStatus,
		addTicketComment
	};
}
var { workstationAgents, chatChannels, chatMessages, supportTickets, ticketComments, fileTransfers, openTickets, activeTransfers, canSendFileToComputer, sendFileToComputer, sendChatMessage, createTicket, updateTicketStatus, addTicketComment } = createCommunicationsStore();
//#endregion
export { fileTransfers as a, supportTickets as c, chatMessages as i, ticketComments as l, canSendFileToComputer as n, openTickets as o, chatChannels as r, sendChatMessage as s, activeTransfers as t, workstationAgents as u };
