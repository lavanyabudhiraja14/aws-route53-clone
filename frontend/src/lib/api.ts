import { clearSession, getToken } from "@/lib/auth-storage";
import type {
  DnsRecord,
  DnsRecordPayload,
  HostedZone,
  HostedZonePayload,
  TokenResponse,
  UserOut,
} from "@/lib/types";

export const API_BASE = "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { detail?: unknown };
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail)) return "Validation error";
    return res.statusText || "Request failed";
  } catch {
    return res.statusText || "Request failed";
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (res.status === 401 && typeof window !== "undefined") {
    if (!path.startsWith("/auth/login")) {
      clearSession();
      window.location.assign("/login");
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, await parseError(res));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const api = {
  login(username: string, password: string) {
    return request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  logout() {
    return request<{ detail: string }>("/auth/logout", { method: "POST" });
  },

  me() {
    return request<UserOut>("/auth/me");
  },

  listHostedZones(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return request<HostedZone[]>(`/hosted-zones${query}`);
  },

  getHostedZone(id: number) {
    return request<HostedZone>(`/hosted-zones/${id}`);
  },

  createHostedZone(payload: HostedZonePayload) {
    return request<HostedZone>("/hosted-zones", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateHostedZone(id: number, payload: Partial<HostedZonePayload>) {
    return request<HostedZone>(`/hosted-zones/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteHostedZone(id: number) {
    return request<{ detail: string }>(`/hosted-zones/${id}`, {
      method: "DELETE",
    });
  },

  listRecords(zoneId: number, search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return request<DnsRecord[]>(`/hosted-zones/${zoneId}/records${query}`);
  },

  createRecord(zoneId: number, payload: DnsRecordPayload) {
    return request<DnsRecord>(`/hosted-zones/${zoneId}/records`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateRecord(zoneId: number, recordId: number, payload: Partial<DnsRecordPayload>) {
    return request<DnsRecord>(`/hosted-zones/${zoneId}/records/${recordId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteRecord(zoneId: number, recordId: number) {
    return request<{ detail: string }>(`/hosted-zones/${zoneId}/records/${recordId}`, {
      method: "DELETE",
    });
  },
};
