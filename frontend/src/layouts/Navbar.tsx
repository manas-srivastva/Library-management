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
        'sticky top-0 z-30 flex h-[4.5rem] items-center gap-3 border-b border-border-soft px-3 sm:px-4 lg:px-7',
        'bg-bg/80 shadow-[0_1px_0_rgba(255,255,255,0.025)] backdrop-blur-2xl',
      )}
    >
      <button
        onClick={() => setMobileOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-fg-muted transition-all hover:border-border hover:bg-bg-elevated hover:text-fg lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="group relative hidden max-w-xl flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle transition-colors group-focus-within:text-brand-400" />
        <input
          placeholder="Search books, members, borrows…"
          className="input-base h-10 border-border-soft bg-bg-card/70 pl-10 pr-16 shadow-inset transition-all group-focus-within:border-brand-500/40 group-focus-within:bg-bg-card"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border-soft bg-bg-elevated/70 px-1.5 py-0.5 text-[10px] font-medium text-fg-subtle shadow-sm">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:flex-none">
        <div className="mr-1 hidden h-7 w-px bg-border-soft sm:block" />
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-fg-muted transition-all hover:border-border hover:bg-bg-elevated hover:text-fg"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        {/* Notifications */}
        <Dropdown
          align="right"
          trigger={
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-fg-muted transition-all hover:border-border hover:bg-bg-elevated hover:text-fg" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400 ring-2 ring-bg" />
              </span>
            </span>
          }
        >
          {(close) => (
            <div className="w-[min(20rem,calc(100vw-2rem))]">
              <div className="flex items-center justify-between border-b border-border-soft px-3.5 py-3">
                <div>
                  <p className="text-sm font-semibold text-fg">Notifications</p>
                  <p className="mt-0.5 text-[11px] text-fg-subtle">Your latest library updates</p>
                </div>
                <button onClick={close} className="rounded-md px-1.5 py-1 text-xs text-brand-400 transition-colors hover:bg-brand-500/10">
                  Mark all read
                </button>
              </div>
              <div className="space-y-1 p-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl px-2.5 py-3 transition-colors hover:bg-bg-elevated"
                  >
                    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', n.tone)}>
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
            <span className="group flex items-center gap-2 rounded-xl border border-border-soft bg-bg-card/55 py-1.5 pl-1.5 pr-2 transition-all duration-200 hover:border-border-strong hover:bg-bg-elevated/70">
              <Avatar name="Aisha Patel" src="https://picsum.photos/seed/aisha/80/80" size="sm" />
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-semibold text-fg leading-tight">Aisha Patel</span>
                <span className="block text-[11px] text-fg-subtle leading-tight">Librarian</span>
              </span>
              <ChevronDown className="h-4 w-4 text-fg-subtle transition-transform group-hover:translate-y-0.5" />
            </span>
          }
        >
          {() => (
            <div className="w-[min(14rem,calc(100vw-2rem))]">
              <div className="border-b border-border-soft bg-bg-elevated/35 px-3.5 py-3">
                <p className="text-sm font-semibold text-fg">Aisha Patel</p>
                <p className="mt-0.5 text-xs text-fg-muted">aisha.patel@libraai.io</p>
              </div>
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
