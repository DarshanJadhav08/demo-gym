import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, CreditCard, CalendarCheck, ClipboardList, Apple, LogOut, Printer, Sparkles, Clock, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

export const CustomerPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await api.getCustomerPortalMe();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load customer profile:', err);
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

  const activeMembership = profile?.memberships?.[0] || null;

  return (
    <div className="min-h-screen bg-[#080811] text-white">
      {/* Top Header */}
      <header className="h-16 bg-[#10101C] border-b border-[#E91E63]/25 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E91E63] to-[#571638] flex items-center justify-center text-white">
            <Dumbbell className="w-4 h-4" />
          </div>
          <span className="font-heading text-xl font-bold tracking-wider text-white">
            DEMO<span className="text-[#E91E63]">FIT</span> MEMBER PASS
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
        {/* Welcome Member Pass */}
        <div className="relative rounded-3xl p-8 bg-gradient-to-r from-[#151522] via-[#1a0a16] to-[#151522] border border-[#E91E63]/40 shadow-2xl overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <img
                src={profile?.profile_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                alt={profile?.full_name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E91E63]"
              />
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#E91E63]/20 text-[#E91E63] border border-[#E91E63]/40">
                  {profile?.status} Member
                </span>
                <h1 className="font-heading text-3xl font-bold text-white uppercase mt-1">
                  Welcome, {profile?.full_name}
                </h1>
                <p className="text-xs text-gray-400 font-mono mt-0.5">MEMBER ID: {profile?.customer_code}</p>
              </div>
            </div>

            {activeMembership ? (
              <div className="p-4 rounded-2xl bg-[#10101C]/80 border border-[#E91E63]/30 text-right">
                <span className="text-[10px] text-[#E91E63] font-bold uppercase tracking-wider block">Active Subscription</span>
                <h4 className="font-heading text-xl font-bold text-white">{activeMembership.plan_name}</h4>
                <p className="text-xs text-gray-400 mt-1">Valid Until: <strong className="text-white">{activeMembership.end_date}</strong></p>
              </div>
            ) : (
              <div className="text-right">
                <span className="text-xs text-amber-400">No active membership plan</span>
              </div>
            )}
          </div>
        </div>

        {/* 3 Main Functional Columns: Workout, Diet, Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workout Routine */}
          <div className="p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/25 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-bold text-white uppercase flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-[#E91E63]" />
                  <span>My Workout Plan</span>
                </h3>
                <span className="text-[10px] text-gray-400 uppercase">Assigned Routine</span>
              </div>

              {profile?.workouts && profile.workouts.length > 0 ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#10101C]">
                    <h4 className="font-bold text-sm text-white">{profile.workouts[0].plan_name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{profile.workouts[0].description}</p>
                  </div>
                  <div className="text-xs text-[#B8B5C2] space-y-1">
                    <p><strong className="text-white">Coach:</strong> {profile.workouts[0].trainer_name || 'Assigned Master Coach'}</p>
                    <p><strong className="text-white">Duration:</strong> {profile.workouts[0].duration_weeks} Weeks</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">Your trainer will assign your customized workout routine shortly.</p>
              )}
            </div>
          </div>

          {/* Diet & Nutrition */}
          <div className="p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/25 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-bold text-white uppercase flex items-center gap-2">
                  <Apple className="w-5 h-5 text-emerald-400" />
                  <span>Nutrition Protocol</span>
                </h3>
                <span className="text-[10px] text-emerald-400 uppercase font-bold">Daily Macros</span>
              </div>

              {profile?.diets && profile.diets.length > 0 ? (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#10101C]">
                    <span className="font-bold text-white">{profile.diets[0].plan_name}</span>
                    <span className="font-extrabold text-[#E91E63]">{profile.diets[0].target_calories} kCal</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-[#10101C]">
                      <span className="text-[10px] text-gray-400 block">Protein</span>
                      <span className="font-bold text-white">{profile.diets[0].protein_grams}g</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#10101C]">
                      <span className="text-[10px] text-gray-400 block">Carbs</span>
                      <span className="font-bold text-white">{profile.diets[0].carbs_grams}g</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#10101C]">
                      <span className="text-[10px] text-gray-400 block">Fats</span>
                      <span className="font-bold text-white">{profile.diets[0].fats_grams}g</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No diet plan assigned currently.</p>
              )}
            </div>
          </div>

          {/* Invoices & Receipts */}
          <div className="p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/25 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-bold text-white uppercase flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#E91E63]" />
                  <span>My Invoices</span>
                </h3>
                <span className="text-[10px] text-gray-400 uppercase">Receipts</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(profile?.payments || []).map((pay: any) => (
                  <div key={pay.id} className="p-2.5 rounded-xl bg-[#10101C] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#E91E63]">{pay.receipt_number}</span>
                      <span className="text-gray-400 block text-[10px]">{pay.payment_date} • {pay.payment_method}</span>
                    </div>
                    <button
                      onClick={() => setSelectedReceipt(pay)}
                      className="p-1.5 rounded-lg bg-[#151522] border border-gray-800 text-gray-300 hover:text-white"
                      title="View & Print Receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white text-gray-900 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-black uppercase text-gray-900">
                  APEX <span className="text-[#E91E63]">ELITE</span>
                </h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Customer Payment Receipt</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-[#E91E63] text-sm">{selectedReceipt.receipt_number}</p>
                <p className="text-xs text-gray-500">{selectedReceipt.payment_date}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs mb-6">
              <p><strong>Member Name:</strong> {profile?.full_name}</p>
              <p><strong>Payment Method:</strong> {selectedReceipt.payment_method}</p>
              <p><strong>Total Amount Paid:</strong> ${selectedReceipt.paid_amount}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Copy</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-5 py-3 rounded-xl bg-gray-200 text-gray-800 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
