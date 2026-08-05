import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { SidebarProvider } from '@/context/SidebarContext';

export function DashboardLayout() {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="relative flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
          <footer className="border-t border-border-soft px-4 py-5 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-2 text-xs text-fg-subtle sm:flex-row">
              <p>© 2026 LibraAI. All rights reserved.</p>
              <p>AI-powered Smart Library Management</p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
