import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { SidebarProvider } from "@/context/SidebarContext";

export function DashboardLayout() {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-bg-soft">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>

          <footer className="border-t border-border-soft px-4 py-4 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-1 text-xs text-fg-subtle sm:flex-row">
              <p>© 2026 LibraAI</p>
              <p>Library Management System</p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}