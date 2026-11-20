import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Shield, User, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      error('Missing credentials', 'Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.login({ email, password });
      login(res.token, res.user);
      success('Welcome back!', `Logged in as ${res.user.role.toUpperCase()}: ${res.user.first_name || res.user.username}`);

      if (res.user.role === 'superadmin' || res.user.role === 'admin') {
        navigate('/admin');
      } else if (res.user.role === 'trainer') {
        navigate('/trainer');
      } else {
        navigate('/portal');
      }
    } catch (err: any) {
      error('Login Failed', err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (role: 'admin' | 'trainer' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@gymdemo.com');
      setPassword('Admin@12345');
    } else if (role === 'trainer') {
      setEmail('trainer@gymdemo.com');
      setPassword('Trainer@12345');
    } else {
      setEmail('member@gymdemo.com');
      setPassword('Customer@12345');
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
          <h2 className="text-xl font-bold text-white mt-6">Sign In to Your Portal</h2>
          <p className="text-xs text-[#B8B5C2] mt-1">Access Admin Dashboard, Trainer Tools, or Customer Pass</p>
        </div>

        {/* Demo Fast-Login Pills */}
        <div className="mb-6 p-4 rounded-2xl bg-[#10101C] border border-[#E91E63]/30">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#E91E63] uppercase tracking-wider mb-2.5 font-heading">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Logins</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoAccount('admin')}
              className="px-2 py-2 rounded-xl bg-[#151522] border border-[#E91E63]/30 hover:border-[#E91E63] text-xs font-semibold text-white flex flex-col items-center gap-1 transition-all"
            >
              <Shield className="w-4 h-4 text-[#E91E63]" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('trainer')}
              className="px-2 py-2 rounded-xl bg-[#151522] border border-blue-500/30 hover:border-blue-400 text-xs font-semibold text-white flex flex-col items-center gap-1 transition-all"
            >
              <Dumbbell className="w-4 h-4 text-blue-400" />
              <span>Trainer</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('customer')}
              className="px-2 py-2 rounded-xl bg-[#151522] border border-emerald-500/30 hover:border-emerald-400 text-xs font-semibold text-white flex flex-col items-center gap-1 transition-all"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span>Customer</span>
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#151522] rounded-3xl p-8 border border-[#E91E63]/30 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@apexelite.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white font-bold text-sm uppercase tracking-wider shadow-xl hover:shadow-[#E91E63]/40 hover:scale-[1.01] active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-xs text-[#B8B5C2]">
            Don't have a gym member login yet?{' '}
            <Link to="/register" className="text-[#E91E63] font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            ← Return to Apex Elite Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
