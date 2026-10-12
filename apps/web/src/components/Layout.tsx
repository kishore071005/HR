import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  FileText,
  KeyRound,
  Laptop,
  LayoutDashboard,
  LogOut,
  Rocket,
  Settings,
  User,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../features/auth/auth-context';
import { NotificationBell } from '../features/notifications/NotificationBell';
import { GlobalEmployeeSearch } from './GlobalEmployeeSearch';
import { AvatarInitials, Logo } from './Logo';

/**
 * AGENTS.md §9 — application shell: left sidebar, top bar, role-filtered
 * navigation. Hiding is advisory only; the backend re-checks every capability.
 *
 * Visual system: the official Harvik logo artwork + harviktech.com brand
 * (gradient #1D4ED8→#2563EB→#0284C7, Inter, 12px radii) with soft
 * staggered entrances and a per-route content fade.
 */

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Advisory permission; absent means every signed-in role sees it. */
  permission?: string;
  /** Advisory role allow-list; absent means all roles. Backend stays authoritative. */
  roles?: string[];
  end?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Workspace',
    items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'People',
    items: [
      { to: '/employees', label: 'Employees', icon: Users, permission: 'viewEmployeeDirectory' },
      { to: '/recruitment/jobs', label: 'Jobs', icon: Briefcase, permission: 'viewRecruitment' },
      { to: '/recruitment/candidates', label: 'Candidates', icon: UserRound, permission: 'viewRecruitment' },
      { to: '/onboarding', label: 'Onboarding', icon: Rocket },
    ],
  },
  {
    label: 'Time',
    items: [
      { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
      { to: '/leave', label: 'Leave', icon: CalendarDays },
    ],
  },
  {
    label: 'Resources',
    items: [
      { to: '/documents', label: 'Documents', icon: FileText },
      { to: '/assets', label: 'Assets', icon: Laptop },
      { to: '/licenses', label: 'Licenses', icon: KeyRound },
    ],
  },
  {
    label: 'Lifecycle',
    items: [{ to: '/exit', label: 'Exit / Offboarding', icon: LogOut }],
  },
  {
    label: 'Insights',
    items: [
      { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['HR Admin', 'HR Manager', 'Manager'] },
      { to: '/notifications', label: 'Notifications', icon: Bell },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/settings', label: 'Settings', icon: Settings, permission: 'manageSettings' },
      { to: '/me', label: 'My Profile', icon: User },
    ],
  },
];

const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-brand-50 text-brand-700 shadow-sm'
      : 'text-slate-800 hover:bg-brand-50/80 hover:text-brand-600'
  }`;

const iconClass = ({ isActive }: { isActive: boolean }): string =>
  `h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
    isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500'
  }`;

export function Layout() {
  const { account, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) =>
        (!item.permission || account?.permissions.includes(item.permission)) &&
        (!item.roles || (account?.role && item.roles.includes(account.role))),
    ),
  })).filter((group) => group.items.length > 0);

  const onSignOut = async (): Promise<void> => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* ——— Sidebar ——— */}
      <aside
        className="flex w-64 shrink-0 flex-col border-r border-blue-100 bg-white"
        aria-label="Primary"
      >
        <div className="border-b border-blue-100 px-5 py-4">
          <Logo height={34} />
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto p-4">
          {visibleGroups.map((group, groupIndex) => (
            <div
              key={group.label}
              className="animate-fade-up"
              style={{ animationDelay: `${120 + groupIndex * 70}ms` }}
            >
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                    {({ isActive }) => (
                      <>
                        <item.icon className={iconClass({ isActive })} aria-hidden />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="animate-fade-in border-t border-blue-100 p-4" style={{ animationDelay: '600ms' }}>
          <div className="rounded-xl bg-brand-50/70 px-3 py-2.5">
            <p className="truncate text-xs font-semibold text-slate-900">{account?.email}</p>
            <p className="mt-0.5 text-[11px] font-medium text-brand-700">{account?.role}</p>
          </div>
        </div>
      </aside>

      {/* ——— Main column ——— */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="animate-fade-in sticky top-0 z-20 flex items-center gap-4 border-b border-blue-100 bg-white/95 px-6 py-3 shadow-xs backdrop-blur-xl">
          <p className="truncate text-sm text-slate-500">
            Signed in as{' '}
            <span className="font-semibold text-slate-900">{account?.email}</span>
          </p>
          <div className="flex-1" />
          <GlobalEmployeeSearch />
          <div className="flex items-center gap-2">
            <NotificationBell />
            <AvatarInitials email={account?.email ?? 'harvik@harviktech.com'} className="h-8 w-8" />
            <button
              type="button"
              onClick={() => void onSignOut()}
              aria-label="Sign out"
              title="Sign out"
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-all duration-200 hover:scale-105 hover:border-brand-200 hover:text-brand-600 active:scale-95"
            >
              <LogOut className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
          {/* Keyed by route so each navigation replays the entrance. */}
          <div key={location.pathname} className="animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
