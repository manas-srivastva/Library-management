import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User as UserIcon,
} from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/hooks/useAuth";
import { useAuthContext } from "@/context/AuthContext";
import { cn } from "@/utils/cn";

const notifications = [
  {
    id: "n1",
    title: "Overdue book",
    body: "A borrowed book is overdue.",
    time: "2h ago",
  },
  {
    id: "n2",
    title: "Reservation ready",
    body: "A reserved book is ready for pickup.",
    time: "5h ago",
  },
  {
    id: "n3",
    title: "Fine updated",
    body: "A fine payment has been recorded.",
    time: "1d ago",
  },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { setMobileOpen } = useSidebar();
  const { logout } = useAuth();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-3",
        "border-b border-border-soft bg-bg px-4 lg:px-7"
      )}
    >
      {/* Mobile menu */}
      <button
        onClick={() => setMobileOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative hidden max-w-xl flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />

        <input
          placeholder="Search books, members..."
          className="input-base h-9 bg-bg-card pl-10"
        />
      </div>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </button>

        {/* Notifications */}
        <Dropdown
          align="right"
          trigger={
            <span
              className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" />

              {notifications.length > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500" />
              )}
            </span>
          }
        >
          {(close) => (
            <div className="w-[min(20rem,calc(100vw-2rem))]">
              <div className="flex items-center justify-between border-b border-border-soft px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-fg">
                    Notifications
                  </p>

                  <p className="mt-0.5 text-xs text-fg-subtle">
                    Recent library updates
                  </p>
                </div>

                <button
                  onClick={close}
                  className="text-xs font-medium text-brand-500 hover:text-brand-600"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-border-soft">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 transition-colors hover:bg-bg-elevated"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-fg">
                        {notification.title}
                      </p>

                      <span className="shrink-0 text-[11px] text-fg-subtle">
                        {notification.time}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-fg-muted">
                      {notification.body}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  close();
                  navigate("/app/notifications");
                }}
                className="w-full border-t border-border-soft px-4 py-3 text-sm font-medium text-brand-500 transition-colors hover:bg-bg-elevated"
              >
                View all notifications
              </button>
            </div>
          )}
        </Dropdown>

        {/* Profile menu */}
        <Dropdown
          align="right"
          trigger={
            <span className="group flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-bg-elevated">
              <Avatar
                name={user?.name || "User"}
                src={user?.profileImage}
                size="sm"
              />

              <span className="hidden text-left sm:block">
                <span className="block text-xs font-semibold leading-tight text-fg">
                  {user?.name || "User"}
                </span>

                <span className="block text-[11px] capitalize leading-tight text-fg-subtle">
                  {user?.role?.toLowerCase() || "Member"}
                </span>
              </span>

              <ChevronDown className="hidden h-4 w-4 text-fg-subtle sm:block" />
            </span>
          }
        >
          {() => (
            <div className="w-[min(14rem,calc(100vw-2rem))]">
              <div className="border-b border-border-soft px-4 py-3">
                <p className="text-sm font-semibold text-fg">
                  {user?.name || "User"}
                </p>

                <p className="mt-1 truncate text-xs text-fg-muted">
                  {user?.email || ""}
                </p>
              </div>

              <DropdownItem
                icon={<UserIcon className="h-4 w-4" />}
                onClick={() => navigate("/app/profile")}
              >
                Profile
              </DropdownItem>

              <DropdownItem
                icon={<Settings className="h-4 w-4" />}
                onClick={() => navigate("/app/settings")}
              >
                Settings
              </DropdownItem>

              <DropdownItem
                icon={<HelpCircle className="h-4 w-4" />}
              >
                Help & Support
              </DropdownItem>

              <div className="my-1 h-px bg-border-soft" />

              <DropdownItem
                icon={<LogOut className="h-4 w-4" />}
                danger
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
              >
                Sign out
              </DropdownItem>
            </div>
          )}
        </Dropdown>
      </div>
    </header>
  );
}