import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Bell,
  BookCopy,
  BookOpen,
  CalendarClock,
  ChevronLeft,
  LayoutDashboard,
  Library,
  Receipt,
  Settings,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/context/SidebarContext";
import { useAuthContext } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { cn } from "@/utils/cn";
import { Logo } from "@/components/brand/Logo";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
}

const nav: NavItem[] = [
  {
    to: "/app/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "LIBRARIAN", "MEMBER"],
  },
  {
    to: "/app/books",
    label: "Books",
    icon: BookOpen,
    roles: ["ADMIN", "LIBRARIAN", "MEMBER"],
  },
  {
    to: "/app/copies",
    label: "Book Copies",
    icon: BookCopy,
    roles: ["ADMIN", "LIBRARIAN"],
  },
  {
    to: "/app/borrows",
    label: "Borrows",
    icon: CalendarClock,
    roles: ["ADMIN", "LIBRARIAN"],
  },
  {
    to: "/app/reservations",
    label: "Reservations",
    icon: Library,
    roles: ["ADMIN", "LIBRARIAN", "MEMBER"],
  },
  {
    to: "/app/fines",
    label: "Fines",
    icon: Receipt,
    roles: ["ADMIN", "LIBRARIAN", "MEMBER"],
  },
  {
    to: "/app/notifications",
    label: "Notifications",
    icon: Bell,
    roles: ["ADMIN", "LIBRARIAN", "MEMBER"],
  },
  {
    to: "/app/analytics",
    label: "Analytics",
    icon: BarChart3,
    roles: ["ADMIN", "LIBRARIAN"],
  },
  {
    to: "/app/my-borrows",
    label: "My Borrows",
    icon: CalendarClock,
    roles: ["MEMBER"],
  },
];

const secondary = [
  {
    to: "/app/profile",
    label: "Profile",
    icon: Users,
  },
  {
    to: "/app/settings",
    label: "Settings",
    icon: Settings,
  },
];

function NavItems({ collapsed }: { collapsed: boolean }) {
  const { user } = useAuthContext();

  const visibleNav = nav.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    <>
      <nav className="space-y-1">
        {visibleNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-500/10 text-brand-400"
                  : "text-fg-muted hover:bg-bg-elevated hover:text-fg",
                collapsed && "justify-center px-0"
              )
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    isActive
                      ? "text-brand-400"
                      : "text-fg-subtle group-hover:text-fg"
                  )}
                />

                {!collapsed && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-7">
        {!collapsed && (
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-fg-faint">
            Account
          </p>
        )}

        <div className="space-y-1">
          {secondary.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-bg-elevated text-fg"
                    : "text-fg-muted hover:bg-bg-elevated hover:text-fg",
                  collapsed && "justify-center px-0"
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0 text-fg-subtle group-hover:text-fg" />

              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}

function LogoBlock({ collapsed }: { collapsed: boolean }) {
  return (
    <Logo
      size={34}
      showText={!collapsed}
      subtitle={collapsed ? undefined : "Library Management"}
    />
  );
}

export function Sidebar() {
  const {
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
  } = useSidebar();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-border bg-bg-card lg:flex transition-[width] duration-200",
          collapsed ? "w-[72px]" : "w-[250px]"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border-soft px-4">
          <LogoBlock collapsed={collapsed} />

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-fg-subtle hover:bg-bg-elevated hover:text-fg"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
          <NavItems collapsed={collapsed} />
        </div>

        {!collapsed && (
          <div className="border-t border-border-soft px-4 py-4">
            <p className="text-xs text-fg-subtle">
              LibraAI Library System
            </p>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />

            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-border bg-bg-card lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-border-soft px-4">
                <LogoBlock collapsed={false} />

                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-fg-subtle hover:bg-bg-elevated hover:text-fg"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
                <NavItems collapsed={false} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}