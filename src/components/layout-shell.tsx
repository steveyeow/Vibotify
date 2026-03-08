"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <div className="flex gap-2 px-2 pb-2" style={{ height: "calc(100vh - 56px)" }}>
      <Sidebar />
      <main
        className={`flex-1 overflow-y-auto rounded-lg bg-[#121212] px-6 pt-6 ${
          isLanding ? "" : "pb-20"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
