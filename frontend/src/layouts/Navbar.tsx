import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { useTheme } from '@/context/ThemeContext';
import { useSidebar } from '@/context/SidebarContext';
import { cn } from '@/utils/cn';

const notifications = [
  { id: 'n1', title: 'Overdue book', body: 'Sapiens is 6 days overdue', time: '2h ago', tone: 'bg-danger-500/10 text-danger-400' },
  { id: 'n2', title: 'Reservation ready', body: 'Atomic Habits is ready to pick up', time: '5h ago', tone: 'bg-info-500/10 text-info-400' },
  { id: 'n3', title: 'Fine paid', body: 'Aisha Patel paid a $5 fine', time: '1d ago', tone: 'bg-success-500/10 text-success-400' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { setMobileOpen } = useSidebar();
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border px-4 lg:px-6',
        'bg-bg/75 shadow-[0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-2xl',
      )}
    >
      <button
        onClick={() => setMobileOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative hidden flex-1 max-w-md sm:block group">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle transition-colors group-focus-within:text-brand-400" />
        <input
          placeholder="Search books, members, borrows…"
          className="input-base border-border-soft bg-bg-card/70 pl-9 pr-16 shadow-inset"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border bg-bg-elevated px-1.5 py-0.5 text-[10px] font-medium text-fg-subtle">
          ⌘K
        </kbd>
      </div>

      <div className="flex flex-1 items-center justify-end gap-1.5 sm:flex-none">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        {/* Notifications */}
        <Dropdown
          align="right"
          trigger={
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-fg-muted transition-colors hover:border-border hover:bg-bg-elevated hover:text-fg" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400 ring-2 ring-bg" />
              </span>
            </span>
          }
        >
          {(close) => (
            <div className="w-80">
              <div className="flex items-center justify-between px-3 py-2.5">
                <p className="text-sm font-semibold text-fg">Notifications</p>
                <button onClick={close} className="text-xs text-brand-400 hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="h-px bg-border-soft" />
              <div className="space-y-0.5 p-1.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 rounded-lg px-2.5 py-2.5 hover:bg-bg-elevated cursor-pointer transition-colors"
                  >
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', n.tone)}>
                      <Bell className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-fg">{n.title}</p>
                        <span className="text-[11px] text-fg-subtle shrink-0">{n.time}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-fg-muted">{n.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Dropdown>

        {/* Profile menu */}
        <Dropdown
          align="right"
          trigger={
            <span className="flex items-center gap-2 rounded-xl border border-border bg-bg-elevated/40 py-1.5 pl-1.5 pr-2.5 transition-all duration-200 hover:border-border-strong hover:bg-bg-elevated/60">
              <Avatar name="Aisha Patel" src="https://picsum.photos/seed/aisha/80/80" size="sm" />
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-semibold text-fg leading-tight">Aisha Patel</span>
                <span className="block text-[11px] text-fg-subtle leading-tight">Librarian</span>
              </span>
              <ChevronDown className="h-4 w-4 text-fg-subtle" />
            </span>
          }
        >
          {() => (
            <div className="w-56">
              <div className="px-3 py-2.5">
                <p className="text-sm font-semibold text-fg">Aisha Patel</p>
                <p className="text-xs text-fg-muted">aisha.patel@libraai.io</p>
              </div>
              <div className="h-px bg-border-soft" />
              <DropdownItem icon={<UserIcon className="h-4 w-4" />} onClick={() => navigate('/app/profile')}>
                Profile
              </DropdownItem>
              <DropdownItem icon={<Settings className="h-4 w-4" />} onClick={() => navigate('/app/settings')}>
                Settings
              </DropdownItem>
              <DropdownItem icon={<HelpCircle className="h-4 w-4" />}>Help & Support</DropdownItem>
              <div className="h-px bg-border-soft" />
              <DropdownItem
                icon={<LogOut className="h-4 w-4" />}
                danger
                onClick={() => navigate('/login')}
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
