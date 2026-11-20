import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Shield, User, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@gymdemo.com');
  const [password, setPassword] = useState('Demo@123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success } = useNotification();
  const navigate = useNavigate();

  // Instant 1-Click Login for Demo without needing password
  const directLoginAs = (role: 'admin' | 'trainer' | 'customer') => {
    let mockUser: any;
    let targetPath = '/admin';

    if (role === 'admin') {
      mockUser = {
        id: 'usr_demo_admin_1',
        username: 'admin',
        email: email || 'admin@gymdemo.com',
        role: 'admin',
        first_name: 'Demo',
        last_name: 'Admin',
        status: 'active',
      };
      targetPath = '/admin';
    } else if (role === 'trainer') {
      mockUser = {
        id: 'usr_demo_trainer_1',
        username: 'trainer',
        email: email || 'trainer@gymdemo.com',
        role: 'trainer',
        first_name: 'Alex',
        last_name: 'Vance',
        status: 'active',
      };
      targetPath = '/trainer';
    } else {
      mockUser = {
        id: 'usr_demo_customer_1',
        username: 'customer',
        email: email || 'member@gymdemo.com',
        role: 'customer',
        first_name: 'Marcus',
        last_name: 'Reeves',
        status: 'active',
      };
      targetPath = '/portal';
    }

    login('demo_token_' + role, mockUser);
    success('Demo Access Granted', `Logged in as ${mockUser.role.toUpperCase()}: ${mockUser.first_name} ${mockUser.last_name}`);
    navigate(targetPath);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      // Try backend if accessible
      const res = await api.login({ email: email || 'admin@gymdemo.com', password: password || 'demo' });
      if (res && res.user && res.token) {
        login(res.token, res.user);
        success('Welcome back!', `Logged in as ${res.user.role.toUpperCase()}`);
        if (res.user.role === 'trainer') navigate('/trainer');
        else if (res.user.role === 'customer') navigate('/portal');
        else navigate('/admin');
        return;
      }
    } catch (err) {
      // Static demo mode fallback
    } finally {
      setLoading(false);
    }

    // Role detection based on email, default to Admin
    const lowerEmail = (email || '').toLowerCase();
    if (lowerEmail.includes('trainer')) {
      directLoginAs('trainer');
    } else if (lowerEmail.includes('customer') || lowerEmail.includes('member')) {
      directLoginAs('customer');
    } else {
      directLoginAs('admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#080811] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow & accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E91E63]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#571638]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E91E63] to-[#571638] flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="font-heading text-3xl font-bold tracking-wider text-white block">
                DEMO<span className="text-[#E91E63]">FIT</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#B8B5C2] font-semibold block -mt-1">
                Gym & Fitness Club (Demo Platform)
              </span>
            </div>
          </Link>
          <h2 className="text-xl font-bold text-white mt-6">Instant Demo Sign In</h2>
          <p className="text-xs text-[#B8B5C2] mt-1">Select a role below for 1-click access without password</p>
        </div>

        {/* Demo Fast 1-Click Login Cards */}
        <div className="mb-6 p-4 rounded-2xl bg-[#10101C] border border-[#E91E63]/30 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-[#E91E63] uppercase tracking-wider mb-3 font-heading">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Instant Demo Login</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-normal lowercase tracking-normal">● no password needed</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => directLoginAs('admin')}
              className="px-2 py-3 rounded-xl bg-[#151522] border border-[#E91E63]/40 hover:border-[#E91E63] hover:bg-[#E91E63]/10 text-xs font-semibold text-white flex flex-col items-center gap-1.5 transition-all group active:scale-95"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E91E63]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4 text-[#E91E63]" />
              </div>
              <span className="font-bold">Admin</span>
              <span className="text-[9px] text-[#B8B5C2]">Full Control</span>
            </button>
            <button
              type="button"
              onClick={() => directLoginAs('trainer')}
              className="px-2 py-3 rounded-xl bg-[#151522] border border-blue-500/40 hover:border-blue-400 hover:bg-blue-500/10 text-xs font-semibold text-white flex flex-col items-center gap-1.5 transition-all group active:scale-95"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Dumbbell className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-bold">Trainer</span>
              <span className="text-[9px] text-[#B8B5C2]">Classes & Diets</span>
            </button>
            <button
              type="button"
              onClick={() => directLoginAs('customer')}
              className="px-2 py-3 rounded-xl bg-[#151522] border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-500/10 text-xs font-semibold text-white flex flex-col items-center gap-1.5 transition-all group active:scale-95"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold">Customer</span>
              <span className="text-[9px] text-[#B8B5C2]">Member Pass</span>
            </button>
          </div>
        </div>

        {/* Login Form (Any Credentials Accepted) */}
        <div className="bg-[#151522] rounded-3xl p-8 border border-[#E91E63]/30 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gymdemo.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[10px] text-emerald-400 font-mono">(Optional for Demo)</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Demo@123 (or any password)"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white font-bold text-sm uppercase tracking-wider shadow-xl hover:shadow-[#E91E63]/40 hover:scale-[1.01] active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {loading ? (
                <span>Entering Demo Portal...</span>
              ) : (
                <>
                  <span>Sign In (Instant Access)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-xs text-[#B8B5C2]">
            Want to test public website first?{' '}
            <Link to="/" className="text-[#E91E63] font-semibold hover:underline">
              Go to Homepage
            </Link>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            ← Return to DemoFit Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
