import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileTopbar from "./MobileTopbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}