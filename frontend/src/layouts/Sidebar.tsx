import { NavLink } from 'react-router-dom';
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
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useSidebar } from '@/context/SidebarContext';
import { useAuthContext } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

import { cn } from '@/utils/cn';
import { Logo } from '@/components/brand/Logo';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
}

const nav: NavItem[] = [
  {
    to: '/app/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'],
  },
  {
    to: '/app/books',
    label: 'Books',
    icon: BookOpen,
    roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'],
  },
  {
    to: '/app/copies',
    label: 'Book Copies',
    icon: BookCopy,
    roles: ['ADMIN', 'LIBRARIAN'],
  },
  {
    to: '/app/borrows',
    label: 'Borrows',
    icon: CalendarClock,
    roles: ['ADMIN', 'LIBRARIAN'],
  },
  {
    to: '/app/reservations',
    label: 'Reservations',
    icon: Library,
    roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'],
  },
  {
    to: '/app/fines',
    label: 'Fines',
    icon: Receipt,
    roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'],
  },
  {
    to: '/app/notifications',
    label: 'Notifications',
    icon: Bell,
    roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'],
  },
  {
    to: '/app/analytics',
    label: 'Analytics',
    icon: BarChart3,
    roles: ['ADMIN', 'LIBRARIAN'],
  },
  {
    to: '/app/my-borrows',
    label: 'My Borrows',
    icon: CalendarClock,
    roles: ['MEMBER'],
  },
];

const secondary = [
  {
    to: '/app/profile',
    label: 'Profile',
    icon: Users,
  },
  {
    to: '/app/settings',
    label: 'Settings',
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
      <nav className="space-y-0.5">
        {visibleNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50',
                isActive
                  ? 'bg-brand-500/10 text-brand-300'
                  : 'text-fg-muted hover:bg-bg-elevated/60 hover:text-fg',
                collapsed && 'justify-center px-0',
              )
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand-400 transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-0',
                    collapsed &&
                    'left-1/2 -translate-x-1/2 top-0 h-full w-0.5',
                  )}
                />

                <item.icon
                  className={cn(
                    'h-[18px] w-[18px] shrink-0 transition-colors',
                    isActive
                      ? 'text-brand-400'
                      : 'text-fg-subtle group-hover:text-fg',
                  )}
                />

                {!collapsed && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 space-y-0.5">
        <p
          className={cn(
            'px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-faint',
            collapsed && 'sr-only',
          )}
        >
          Account
        </p>

        {secondary.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50',
                isActive
                  ? 'bg-bg-elevated text-fg'
                  : 'text-fg-muted hover:bg-bg-elevated/60 hover:text-fg',
                collapsed && 'justify-center px-0',
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0 text-fg-subtle group-hover:text-fg" />

            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </>
  );
}

function LogoBlock({ collapsed }: { collapsed: boolean }) {
  return (
    <Logo
      size={36}
      showText={!collapsed}
      subtitle={collapsed ? undefined : 'Smart Library'}
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
      {/* Desktop */}
      <aside
        className={cn(
          'hidden lg:flex flex-col shrink-0 border-r border-border bg-bg-soft/40 backdrop-blur-2xl transition-all duration-300 ease-out',
          collapsed ? 'w-[76px]' : 'w-[260px]',
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border-soft">
          <LogoBlock collapsed={collapsed} />

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-fg-subtle transition-colors duration-200 hover:bg-bg-elevated hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform duration-300',
                collapsed && 'rotate-180',
              )}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
          <NavItems collapsed={collapsed} />
        </div>

        {/* AI badge */}
        {!collapsed && (
          <div className="px-3 pb-4">
            <div className="relative overflow-hidden rounded-xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 to-accent-500/5 p-3.5">
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-brand-500/10 blur-xl" />

              <div className="relative">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                  <p className="text-xs font-semibold text-fg">
                    AI Assistant
                  </p>
                </div>

                <p className="mt-1 text-[11px] leading-relaxed text-fg-muted">
                  Get smart recommendations for your library.
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 280,
              }}
              className="fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-border bg-bg-soft lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-4 border-b border-border-soft">
                <LogoBlock collapsed={false} />

                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-bg-elevated hover:text-fg"
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