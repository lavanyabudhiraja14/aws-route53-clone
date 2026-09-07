"use client";

import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { KeyboardShortcuts } from "@/components/keyboardShortcuts";

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eaeded] text-sm text-[#545b64]">
        Loading console…
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eaeded] text-sm text-[#545b64]">
        Redirecting to sign-in…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-auto px-6 py-5">{children}</main>
        <KeyboardShortcuts />
      </div>
    </div>
  );
}
