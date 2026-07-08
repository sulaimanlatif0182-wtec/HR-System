'use client';

import { 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  BarChart3, 
  LogOut,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  role: 'admin' | 'manager' | 'employee';
  userName: string;
}

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();

  const adminNav = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/employees', label: 'Employees', icon: Users },
    { href: '/departments', label: 'Departments', icon: Users },
    { href: '/attendance', label: 'Attendance', icon: Clock },
    { href: '/admin/leaves', label: 'Leave Requests', icon: Calendar },
    { href: '/calendar', label: 'Leave Calendar', icon: Calendar },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/audit', label: 'Audit Log', icon: FileText },
  ];

  const managerNav = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/manager/dashboard', label: 'My Team', icon: Users },           // ← Updated
    { href: '/attendance', label: 'Team Attendance', icon: Clock },
    { href: '/admin/leaves', label: 'Leave Requests', icon: Calendar },
    { href: '/calendar', label: 'Leave Calendar', icon: Calendar },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  const employeeNav = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/profile', label: 'My Profile', icon: Users },
    { href: '/my-attendance', label: 'My Attendance', icon: Clock },
    { href: '/my-leaves', label: 'My Leaves', icon: Calendar },
    { href: '/calendar', label: 'Leave Calendar', icon: Calendar },
  ];

  const navItems = role === 'admin' 
    ? adminNav 
    : role === 'manager' 
      ? managerNav 
      : employeeNav;

  const isActive = (href: string) => pathname === href;

  return (
    <div className="w-64 bg-white border-r border-zinc-200 flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">HR</span>
          </div>
          <div>
            <div className="font-semibold text-xl tracking-tight">HR System</div>
            <div className="text-[10px] text-zinc-500 -mt-0.5">Basic Edition</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium ${
                  isActive(item.href) 
                    ? 'active text-white' 
                    : 'text-zinc-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Info */}
      <div className="border-t border-zinc-200 p-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 bg-zinc-200 rounded-full flex items-center justify-center text-sm font-medium">
            {userName ? userName.split(' ').map(n => n[0]).join('') : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{userName || 'User'}</div>
            <div className="text-xs text-zinc-500 capitalize">{role}</div>
          </div>
          <button 
            onClick={() => window.location.href = '/login'}
            className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}