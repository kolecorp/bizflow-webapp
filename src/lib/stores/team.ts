import { get, writable } from "svelte/store";
import type { AuthUser } from "$lib/stores/auth";
import { authStore } from "$lib/stores/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

export type TeamRole = "STAFF" | "ADMIN" | "OWNER";
export type TeamStatus = "Active" | "Invited";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: TeamStatus;
  joinedAt: string;
}

export interface PermissionCatalogItem {
  code: string;
  area: string;
  action: string;
}

const members = writable<TeamMember[]>([]);
const roles = writable<string[]>(["STAFF", "ADMIN", "OWNER"]);
const workspaceName = writable("your business");

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = get(authStore).accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function initializeTeam(owner: AuthUser | null, name?: string) {
  if (typeof window === "undefined" || !owner) return;
  if (name) workspaceName.set(name);

  await loadTeam();
}

export async function loadTeam() {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch(`${API_BASE_URL}/team`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      const responseData = await res.json();
      const data = responseData?.data ?? responseData;
      const memberRows = Array.isArray(data?.members) ? data.members : [];
      const invitationRows = Array.isArray(data?.pendingInvitations)
        ? data.pendingInvitations
        : [];

      const mappedMembers: TeamMember[] = [
        ...memberRows.map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          role: m.role,
          status: "Active",
          joinedAt: m.createdAt,
        })),
        ...invitationRows.map((inv: any) => ({
          id: inv.id, // we use invitation ID as temporary ID
          name: "Pending...",
          email: inv.email,
          role: inv.role,
          status: "Invited",
          joinedAt: inv.createdAt,
        })),
      ];

      members.set(mappedMembers);
    }
  } catch (error) {
    console.error("Failed to load team", error);
  }
}

export async function inviteMember(input: {
  name: string;
  email: string;
  role: TeamRole | string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/team/invitations`, {
      method: "POST",
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({
        email: input.email,
        role: input.role.toUpperCase(),
      }),
    });

    if (res.ok) {
      await loadTeam(); // Reload to get the new pending invitation
      return true;
    } else {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to send invitation");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function removeMember(id: string, isInvitation: boolean = false) {
  try {
    const response = isInvitation
      ? await fetch(`${API_BASE_URL}/team/invitations/${id}`, {
          method: "DELETE",
          headers: { ...getAuthHeader() },
        })
      : await fetch(`${API_BASE_URL}/team/members/${id}`, {
          method: "DELETE",
          headers: { ...getAuthHeader() },
        });
    if (!response.ok)
      throw new Error(
        `Failed to remove ${isInvitation ? "invitation" : "member"}`,
      );
    await loadTeam();
  } catch (error) {
    console.error("Failed to remove member", error);
    throw error;
  }
}

export async function updateMemberRole(id: string, role: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/team/members/${id}/role`, {
      method: "PATCH",
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ role: role.toUpperCase() }),
    });
    if (!response.ok) throw new Error("Failed to update member role");
    await loadTeam();
  } catch (error) {
    console.error("Failed to update member role", error);
    throw error;
  }
}

export async function getMemberPermissions(id: string) {
  const res = await fetch(`${API_BASE_URL}/rbac/members/${id}/permissions`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to load member permissions");
  }
  return (await res.json()) as {
    permissions: string[];
    grantedPermissions: string[];
    catalog: PermissionCatalogItem[];
  };
}

export async function replaceMemberPermissions(
  id: string,
  permissions: string[],
) {
  const res = await fetch(`${API_BASE_URL}/rbac/members/${id}/permissions`, {
    method: "PATCH",
    headers: { ...getAuthHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ permissions }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to save member permissions");
  }
  return await res.json();
}

export function createRole(name: string): boolean {
  // Roles are fixed enum on backend (OWNER, ADMIN, STAFF)
  // so creating arbitrary roles locally won't sync. Returning false.
  return false;
}

export async function getInviteDetails(token: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/team/invitations/details/${token}`,
    );
    if (!res.ok) {
      throw new Error("Invalid or expired invitation");
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function acceptInvite(
  token: string,
  name: string,
  password: string,
) {
  try {
    const res = await fetch(`${API_BASE_URL}/team/invitations/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, name, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to accept invitation");
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function getTeamMember(id: string) {
  let result: TeamMember | undefined;
  members.subscribe((value) => {
    result = value.find((member) => member.id === id);
  })();
  return result;
}

export function ensureDemoInvite(id: string) {
  // No-op for real backend logic
  return undefined;
}

export { members as teamMembers, roles as teamRoles, workspaceName };
