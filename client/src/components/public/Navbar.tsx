import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Menu, X, User as UserIcon, Shield, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onOpenJoinModal?: (planId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenJoinModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin, isTrainer } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Classes', path: '/classes' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleJoinClick = () => {
    if (onOpenJoinModal) {
      onOpenJoinModal();
    } else {
      navigate('/pricing');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080811]/95 dark:bg-[#080811]/95 backdrop-blur-md border-b border-[#E91E63]/25 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#571638] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-heading text-2xl font-bold tracking-wider text-white">
              DEMO<span className="text-[#E91E63]">FIT</span>
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-[#B8B5C2] -mt-1 font-semibold">
              Gym & Fitness Club (Demo Platform)
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `text-sm font-semibold transition-all duration-200 relative py-1 ${
                  isActive
                    ? 'text-[#E91E63]'
                    : 'text-[#B8B5C2] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E91E63] rounded-full shadow-[0_0_8px_#E91E63]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Actions, Theme Switch & Auth */}
        <div className="hidden lg:flex items-center gap-3.5">
          {/* Dark / Light Mode Switcher Button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="p-2.5 rounded-xl bg-[#151522] border border-[#E91E63]/30 hover:border-[#E91E63] text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-1.5 shadow-md active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#E91E63]" />
            )}
            <span className="text-xs font-semibold capitalize hidden 2xl:inline">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={isAdmin ? '/admin' : isTrainer ? '/trainer' : '/portal'}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151522] border border-[#E91E63]/30 text-white text-sm hover:border-[#E91E63] transition-colors"
              >
                {isAdmin ? <Shield className="w-4 h-4 text-[#E91E63]" /> : <UserIcon className="w-4 h-4 text-[#E91E63]" />}
                <span>{isAdmin ? 'Admin Dashboard' : isTrainer ? 'Trainer Portal' : 'Member Portal'}</span>
              </Link>
              <button
                onClick={logout}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-white hover:text-[#E91E63] transition-colors px-3 py-1.5"
              >
                Login
              </Link>
              <button
                onClick={handleJoinClick}
                className="relative group px-6 py-2.5 rounded-full bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white text-sm font-bold tracking-wide shadow-lg hover:shadow-[#E91E63]/40 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Join Now
              </button>
            </div>
          )}
        </div>

        {/* Mobile Actions: Theme Toggle + Menu */}
        <div className="xl:hidden flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[#151522] border border-[#E91E63]/30 text-gray-300"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#E91E63]" />}
          </button>
          <button
            onClick={handleJoinClick}
            className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#E91E63] text-white shadow-md"
          >
            Join
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#151522] border border-gray-800 text-white hover:text-[#E91E63]"
            aria-label="Open Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#10101C] border-b border-[#E91E63]/25 px-6 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#E91E63]/15 text-[#E91E63] font-bold border border-[#E91E63]/30'
                      : 'text-[#B8B5C2] hover:text-white hover:bg-[#151522]'
                  }`
                }
              >
                <span>{link.name}</span>
                <span className="text-xs text-gray-500">→</span>
              </NavLink>
            ))}

            <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    to={isAdmin ? '/admin' : isTrainer ? '/trainer' : '/portal'}
                    className="w-full text-center py-3 rounded-xl bg-[#151522] border border-[#E91E63]/40 text-white font-semibold text-sm"
                  >
                    Go to {isAdmin ? 'Admin Dashboard' : isTrainer ? 'Trainer Portal' : 'Member Portal'}
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-center py-2 text-sm text-red-400 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/login"
                    className="w-full text-center py-3 rounded-xl bg-[#151522] border border-gray-800 text-white font-semibold text-sm hover:border-[#E91E63]"
                  >
                    Login
                  </Link>
                  <button
                    onClick={handleJoinClick}
                    className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold text-sm shadow-md"
                  >
                    Join Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
