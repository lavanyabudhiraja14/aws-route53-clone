"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  clearSession,
  getStoredUsername,
  getToken,
  persistSession,
} from "@/lib/auth-storage";

type AuthContextValue = {
  ready: boolean;
  authenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_PATHS = ["/login"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    const stored = getStoredUsername();
    setUsername(token ? stored : null);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const token = getToken();
    const isPublic = PUBLIC_PATHS.includes(pathname);
    if (!token && !isPublic) {
      router.replace("/login");
    }
    if (token && pathname === "/login") {
      router.replace("/hosted-zones");
    }
  }, [ready, pathname, router]);

  const login = useCallback(async (user: string, password: string) => {
    const res = await api.login(user, password);
    persistSession(res.access_token, res.username);
    setUsername(res.username);
    router.replace("/hosted-zones");
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // still clear local session
    }
    clearSession();
    setUsername(null);
    router.replace("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      ready,
      authenticated: Boolean(username && getToken()),
      username,
      login,
      logout,
    }),
    [ready, username, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
