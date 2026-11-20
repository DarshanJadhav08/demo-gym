import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, User, Lock, Mail, Phone, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !mobileNumber || !password) {
      error('Missing details', 'All fields are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.register({
        full_name: fullName,
        email,
        mobile_number: mobileNumber,
        password,
      });
      login(res.token, res.user);
      success('Account Created!', 'Welcome to Apex Elite Fitness.');
      navigate('/portal');
    } catch (err: any) {
      error('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080811] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E91E63] to-[#571638] flex items-center justify-center text-white shadow-xl">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="font-heading text-3xl font-bold tracking-wider text-white block">
                APEX<span className="text-[#E91E63]">ELITE</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#B8B5C2] font-semibold block -mt-1">
                Member Registration
              </span>
            </div>
          </Link>
          <h2 className="text-xl font-bold text-white mt-6">Create Your Athlete Account</h2>
          <p className="text-xs text-[#B8B5C2] mt-1">Track memberships, workout plans, and gym attendance</p>
        </div>

        <div className="bg-[#151522] rounded-3xl p-8 border border-[#E91E63]/30 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Password *
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
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white font-bold text-sm uppercase tracking-wider shadow-xl hover:shadow-[#E91E63]/40 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <span>Creating Account...</span> : <span>Create Account</span>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-xs text-[#B8B5C2]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E91E63] font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
