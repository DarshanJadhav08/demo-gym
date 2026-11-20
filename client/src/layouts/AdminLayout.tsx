import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CreditCard,
  CalendarCheck,
  ClipboardList,
  Apple,
  Inbox,
  TrendingDown,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bell,
  Search,
  Shield,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Trainers', path: '/admin/trainers', icon: Dumbbell },
    { name: 'Memberships', path: '/admin/memberships', icon: CreditCard },
    { name: 'Payments & Billing', path: '/admin/payments', icon: CreditCard },
    { name: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
    { name: 'Workout Plans', path: '/admin/workouts', icon: ClipboardList },
    { name: 'Diet Plans', path: '/admin/diets', icon: Apple },
    { name: 'Enquiries / Leads', path: '/admin/enquiries', icon: Inbox },
    { name: 'Expenses', path: '/admin/expenses', icon: TrendingDown },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { name: 'Gym Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#080811] text-white flex">
      {/* Mobile Sidebar Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 bg-[#10101C] border-r border-[#E91E63]/20 flex flex-col transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-gray-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#571638] flex items-center justify-center text-white shrink-0">
              <Dumbbell className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div>
                <span className="font-heading text-xl font-bold tracking-wider text-white block">
                  DEMO<span className="text-[#E91E63]">FIT</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold block -mt-1">
                  Gym Management (Demo)
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#151522]"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white shadow-lg shadow-[#E91E63]/25'
                    : 'text-[#B8B5C2] hover:bg-[#151522] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#E91E63]'}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer profile & logout */}
        <div className="p-4 border-t border-gray-800/80">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-8 h-8 rounded-full bg-[#E91E63]/20 border border-[#E91E63] flex items-center justify-center text-xs font-bold text-white">
                {user?.first_name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.first_name || user?.username}</p>
                <p className="text-[10px] text-[#E91E63] uppercase tracking-wider font-semibold">{user?.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-[#151522] transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-[#10101C]/90 backdrop-blur-md border-b border-[#E91E63]/20 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#151522] text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline-block text-xs uppercase font-bold tracking-widest text-[#E91E63] font-heading">
              Demo Gym Management System
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-xl bg-[#151522] border border-[#E91E63]/30 text-gray-300 hover:text-white hover:border-[#E91E63] transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#E91E63]" />
                  <span className="hidden md:inline">Dark</span>
                </>
              )}
            </button>

            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151522] border border-gray-800 text-xs text-gray-300 hover:text-white hover:border-[#E91E63] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#E91E63]" />
              <span className="hidden md:inline">View Public Website</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-gray-800 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Online</span>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#080811]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
