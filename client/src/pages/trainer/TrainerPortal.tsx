import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Users, CalendarCheck, ClipboardList, LogOut, CheckCircle2, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

export const TrainerPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await api.getTrainerPortalMe();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load trainer profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080811] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E91E63] border-t-transparent animate-spin" />
      </div>
    );
  }

  const assignedClients = profile?.clients || [];

  return (
    <div className="min-h-screen bg-[#080811] text-white">
      {/* Top Header */}
      <header className="h-16 bg-[#10101C] border-b border-[#E91E63]/25 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E91E63] to-[#571638] flex items-center justify-center text-white">
            <Dumbbell className="w-4 h-4" />
          </div>
          <span className="font-heading text-xl font-bold tracking-wider text-white">
            DEMO<span className="text-[#E91E63]">FIT</span> COACH PORTAL
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="p-2 rounded-xl bg-[#151522] border border-[#E91E63]/30 text-gray-300 hover:text-white hover:border-[#E91E63] transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#E91E63]" />}
          </button>
          <Link to="/" className="text-xs text-gray-400 hover:text-white">Public Site</Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151522] border border-gray-800 text-xs text-red-400 hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
        {/* Welcome Trainer Header */}
        <div className="bg-[#151522] rounded-3xl p-6 sm:p-8 border border-[#E91E63]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <img
              src={profile?.profile_image || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=200'}
              alt={profile?.full_name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E91E63]"
            />
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400">
                Staff Coach
              </span>
              <h1 className="font-heading text-3xl font-bold text-white uppercase mt-1">
                Coach {profile?.full_name}
              </h1>
              <p className="text-xs text-[#E91E63] font-mono mt-0.5">{profile?.trainer_code} • {profile?.specialization}</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#10101C] border border-gray-800 text-right">
            <span className="text-[10px] text-gray-400 uppercase block">Active Athletes Under Coaching</span>
            <h3 className="font-heading text-3xl font-bold text-white">{assignedClients.length}</h3>
          </div>
        </div>

        {/* Assigned Athletes List */}
        <div className="rounded-3xl bg-[#151522] border border-[#E91E63]/25 p-6 shadow-xl">
          <h3 className="font-heading text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#E91E63]" />
            <span>My Assigned Athletes ({assignedClients.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedClients.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No athletes assigned to your coaching roster currently.</p>
            ) : (
              assignedClients.map((client: any) => (
                <div key={client.id} className="p-4 rounded-2xl bg-[#10101C] border border-gray-800 flex items-center gap-4">
                  <img
                    src={client.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={client.full_name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E91E63]"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{client.full_name}</h4>
                    <p className="text-[11px] text-[#E91E63] font-mono">{client.customer_code}</p>
                    <p className="text-[11px] text-gray-400">{client.mobile_number}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
