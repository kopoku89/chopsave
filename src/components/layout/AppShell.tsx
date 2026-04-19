import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  role,
  showNav = true,
  className,
}: {
  children: ReactNode;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  showNav?: boolean;
  className?: string;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className={cn("flex-1 overflow-y-auto", className)}>
        {children}
      </main>
      {showNav ? <BottomNav role={role} /> : null}
    </div>
  );
}
