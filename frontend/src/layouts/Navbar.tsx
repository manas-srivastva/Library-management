import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
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

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { setMobileOpen } = useSidebar();
  const { logout } = useAuth();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const userName = user?.name || user?.username || "User";
  const userRole = user?.role || "MEMBER";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border-soft bg-bg px-4 lg:px-6">
      
      {/* Mobile menu */}
      <button
        onClick={() => setMobileOpen(true)}
        className="mr-3 flex h-9 w-9 items-center justify-center rounded-md text-fg-muted hover:bg-bg-elevated hover:text-fg lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative hidden w-full max-w-md sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />

        <input
          type="text"
          placeholder="Search books, members..."
          className="input-base h-9 w-full border-border-soft bg-bg-soft pl-9 pr-3 text-sm focus:border-brand-500"
        />
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        
        {/* Theme */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-md text-fg-muted hover:bg-bg-elevated hover:text-fg"
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
            <span className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-fg-muted hover:bg-bg-elevated hover:text-fg">
              <Bell className="h-[18px] w-[18px]" />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-500" />
            </span>
          }
        >
          {() => (
            <div className="w-72">
              <div className="border-b border-border-soft px-4 py-3">
                <p className="text-sm font-semibold text-fg">
                  Notifications
                </p>

                <p className="mt-0.5 text-xs text-fg-subtle">
                  Recent library updates
                </p>
              </div>

              <div className="px-4 py-8 text-center">
                <Bell className="mx-auto mb-2 h-5 w-5 text-fg-faint" />

                <p className="text-sm text-fg-muted">
                  No new notifications
                </p>
              </div>
            </div>
          )}
        </Dropdown>

        {/* Divider */}
        <div className="mx-1 hidden h-6 w-px bg-border-soft sm:block" />

        {/* Profile */}
        <Dropdown
          align="right"
          trigger={
            <span className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 hover:bg-bg-elevated">
              
              <Avatar
                name={userName}
                size="sm"
              />

              <span className="hidden text-left md:block">
                <span className="block max-w-[130px] truncate text-sm font-medium text-fg">
                  {userName}
                </span>

                <span className="block text-xs text-fg-subtle">
                  {userRole.charAt(0) +
                    userRole.slice(1).toLowerCase()}
                </span>
              </span>

              <ChevronDown className="hidden h-4 w-4 text-fg-subtle md:block" />
            </span>
          }
        >
          {() => (
            <div className="w-56">
              
              <div className="border-b border-border-soft px-4 py-3">
                <p className="truncate text-sm font-medium text-fg">
                  {userName}
                </p>

                <p className="mt-1 truncate text-xs text-fg-muted">
                  {user?.email || "Library account"}
                </p>
              </div>

              <div className="py-1">
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
              </div>

              <div className="h-px bg-border-soft" />

              <div className="py-1">
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
            </div>
          )}
        </Dropdown>
      </div>
    </header>
  );
}