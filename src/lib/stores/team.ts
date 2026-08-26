import { writable } from "svelte/store";
import type { AuthUser } from "$lib/stores/auth";

export type TeamRole = string;
export type TeamStatus = "Active" | "Invited";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole | "Business Owner";
  status: TeamStatus;
  joinedAt: string;
}

const TEAM_KEY = "cafe-management-team";
const ROLES_KEY = "cafe-management-team-roles";
const WORKSPACE_KEY = "cafe-management-workspace";
const members = writable<TeamMember[]>([]);
const roles = writable<string[]>([
  "Staff",
  "Receptionist",
  "Operations Manager",
]);
const workspaceName = writable("your business");

function persist(nextMembers: TeamMember[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TEAM_KEY, JSON.stringify(nextMembers));
  }
}

export function initializeTeam(owner: AuthUser | null, name?: string) {
  if (typeof window === "undefined" || !owner) return;

  const savedWorkspaceName = name || window.localStorage.getItem(WORKSPACE_KEY);
  if (savedWorkspaceName) {
    workspaceName.set(savedWorkspaceName);
    window.localStorage.setItem(WORKSPACE_KEY, savedWorkspaceName);
  }
  const savedRoles = window.localStorage.getItem(ROLES_KEY);
  if (savedRoles) {
    try {
      const parsedRoles = JSON.parse(savedRoles) as string[];
      if (Array.isArray(parsedRoles) && parsedRoles.length > 0)
        roles.set(parsedRoles);
    } catch {
      // Recreate the default role list when saved state is malformed.
    }
  }

  const saved = window.localStorage.getItem(TEAM_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as TeamMember[];
      if (Array.isArray(parsed)) {
        members.set(parsed);
        return;
      }
    } catch {
      // Recreate the local demo team when saved state is malformed.
    }
  }

  const ownerMember: TeamMember = {
    id: owner.id,
    name: owner.name,
    email: owner.email,
    role: "Business Owner",
    status: "Active",
    joinedAt: new Date().toISOString(),
  };
  members.set([ownerMember]);
  persist([ownerMember]);
}

export function loadTeam() {
  if (typeof window === "undefined") return;
  const saved = window.localStorage.getItem(TEAM_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as TeamMember[];
      if (Array.isArray(parsed)) members.set(parsed);
    } catch {
      members.set([]);
    }
  }
  const savedName = window.localStorage.getItem(WORKSPACE_KEY);
  if (savedName) workspaceName.set(savedName);
}

export function inviteMember(input: {
  name: string;
  email: string;
  role: TeamRole;
}) {
  const member: TeamMember = {
    id: `team-${Date.now()}`,
    ...input,
    status: "Invited",
    joinedAt: new Date().toISOString(),
  };

  members.update((current) => {
    const nextMembers = [...current, member];
    persist(nextMembers);
    return nextMembers;
  });
  return member;
}

export function removeMember(id: string) {
  members.update((current) => {
    const nextMembers = current.filter((member) => member.id !== id);
    persist(nextMembers);
    return nextMembers;
  });
}

export function updateMemberRole(id: string, role: TeamRole) {
  members.update((current) => {
    const nextMembers = current.map((member) =>
      member.id === id ? { ...member, role } : member,
    );
    persist(nextMembers);
    return nextMembers;
  });
}

export function createRole(name: string): boolean {
  const normalizedName = name.trim();
  if (!normalizedName) return false;
  let created = false;
  roles.update((current) => {
    if (
      current.some(
        (role) => role.toLowerCase() === normalizedName.toLowerCase(),
      )
    )
      return current;
    const nextRoles = [...current, normalizedName];
    if (typeof window !== "undefined")
      window.localStorage.setItem(ROLES_KEY, JSON.stringify(nextRoles));
    created = true;
    return nextRoles;
  });
  return created;
}

export function acceptInvite(id: string) {
  members.update((current) => {
    const nextMembers = current.map((member) =>
      member.id === id ? { ...member, status: "Active" as const } : member,
    );
    persist(nextMembers);
    return nextMembers;
  });
}

export function getTeamMember(id: string) {
  let result: TeamMember | undefined;
  members.subscribe((value) => {
    result = value.find((member) => member.id === id);
  })();
  return result;
}

export function ensureDemoInvite(id: string) {
  if (id !== "demo-invite") return undefined;
  const existing = getTeamMember(id);
  if (existing) {
    const previewMember = { ...existing, status: "Invited" as const };
    members.update((current) => {
      const nextMembers = current.map((member) =>
        member.id === id ? previewMember : member,
      );
      persist(nextMembers);
      return nextMembers;
    });
    workspaceName.set("Aisha Business Center");
    return previewMember;
  }

  const demoMember: TeamMember = {
    id,
    name: "Tosin Adeyemi",
    email: "tosin@example.com",
    role: "Staff",
    status: "Invited",
    joinedAt: new Date().toISOString(),
  };
  workspaceName.set("Aisha Business Center");
  members.update((current) => {
    const nextMembers = [...current, demoMember];
    persist(nextMembers);
    return nextMembers;
  });
  if (typeof window !== "undefined") {
    window.localStorage.setItem(WORKSPACE_KEY, "Aisha Business Center");
  }
  return demoMember;
}

export { members as teamMembers, roles as teamRoles, workspaceName };
