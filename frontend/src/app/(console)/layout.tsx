import type { ReactNode } from "react";
import { ToastProvider } from "@/components/toast";
import { ConsoleShell } from "@/components/ConsoleShell";

export default function ConsoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ToastProvider>
      <ConsoleShell>
        {children}
      </ConsoleShell>
    </ToastProvider>
  );
}