import React, { useState, useEffect } from 'react';
import { CalendarCheck, Plus, LogOut, CheckCircle2, Clock, X, Users, Dumbbell } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const AttendanceManagement: React.FC = () => {
  const [todayData, setTodayData] = useState<any>({ records: [], stats: {} });
  const [customers, setCustomers] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const { success, error } = useNotification();

  const [checkInForm, setCheckInForm] = useState({
    entity_type: 'customer' as 'customer' | 'trainer',
    customer_id: '',
    trainer_id: '',
    notes: 'Standard workout check-in',
  });

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const data = await api.getTodayAttendance();
      setTodayData(data);
    } catch (err: any) {
      error('Failed to load attendance', err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      const [cRes, tRes] = await Promise.all([api.getCustomers(), api.getTrainers()]);
      setCustomers(cRes.customers || []);
      setTrainers(tRes || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAttendance();
    loadMembers();
  }, []);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkInForm.entity_type === 'customer' && !checkInForm.customer_id) {
      error('Selection required', 'Please select a customer to check in.');
      return;
    }
    if (checkInForm.entity_type === 'trainer' && !checkInForm.trainer_id) {
      error('Selection required', 'Please select a trainer to check in.');
      return;
    }

    try {
      await api.checkIn(checkInForm);
      success('Check-In Recorded', 'Attendance entry logged successfully.');
      setCheckInModalOpen(false);
      loadAttendance();
    } catch (err: any) {
      error('Check-In Error', err.message);
    }
  };

  const handleCheckOut = async (id: string) => {
    try {
      await api.checkOut(id);
      success('Check-Out Recorded', 'Session completed.');
      loadAttendance();
    } catch (err: any) {
      error('Check-Out Error', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151522] p-6 rounded-3xl border border-[#E91E63]/30 shadow-xl">
        <div>
          <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest font-heading">
            Daily Access Control
          </span>
          <h1 className="font-heading text-3xl font-bold text-white uppercase mt-0.5">
            Attendance Register
          </h1>
          <p className="text-xs text-[#B8B5C2] mt-1">Live floor headcount and biometric check-in log.</p>
        </div>
        <button
          onClick={() => setCheckInModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Check-In</span>
        </button>
      </div>

      {/* Headcount Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#151522] border border-[#E91E63]/20">
          <span className="text-xs text-gray-400">Total Check-Ins Today</span>
          <h3 className="font-heading text-3xl font-bold text-white mt-1">{todayData.stats?.totalToday || 0}</h3>
        </div>
        <div className="p-5 rounded-2xl bg-[#151522] border border-[#E91E63]/20">
          <span className="text-xs text-gray-400">Customers Trained</span>
          <h3 className="font-heading text-3xl font-bold text-emerald-400 mt-1">{todayData.stats?.customersPresent || 0}</h3>
        </div>
        <div className="p-5 rounded-2xl bg-[#151522] border border-[#E91E63]/20">
          <span className="text-xs text-gray-400">Trainers On Duty</span>
          <h3 className="font-heading text-3xl font-bold text-purple-400 mt-1">{todayData.stats?.trainersPresent || 0}</h3>
        </div>
        <div className="p-5 rounded-2xl bg-[#151522] border border-[#E91E63]/20">
          <span className="text-xs text-gray-400">Currently On Floor</span>
          <h3 className="font-heading text-3xl font-bold text-[#E91E63] mt-1">{todayData.stats?.currentlyInside || 0}</h3>
        </div>
      </div>

      {/* Live Attendance Table */}
      <div className="rounded-3xl bg-[#151522] border border-[#E91E63]/25 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#10101C] text-gray-400 uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Name</th>
                <th className="p-4">ID Code</th>
                <th className="p-4">Check-In</th>
                <th className="p-4">Check-Out</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Floor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {(todayData.records || []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No attendance records for today yet.
                  </td>
                </tr>
              ) : (
                (todayData.records || []).map((r: any) => (
                  <tr key={r.id} className="hover:bg-[#10101C]/50 transition-colors">
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${r.entity_type === 'customer' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        {r.entity_type}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">{r.person_name}</td>
                    <td className="p-4 font-mono font-bold text-[#E91E63]">{r.person_code}</td>
                    <td className="p-4 text-emerald-400 font-mono">{r.check_in_time}</td>
                    <td className="p-4 text-gray-400 font-mono">{r.check_out_time || 'Currently Training'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {!r.check_out_time && (
                        <button
                          onClick={() => handleCheckOut(r.id)}
                          className="px-3 py-1 rounded-lg bg-[#10101C] border border-gray-800 text-amber-400 hover:bg-amber-500 hover:text-black font-semibold text-[11px] transition-colors"
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Check-In Modal */}
      {checkInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#151522] rounded-3xl p-6 border border-[#E91E63]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <h3 className="font-heading text-xl font-bold text-white uppercase">Manual Check-In</h3>
              <button onClick={() => setCheckInModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Entity Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckInForm({ ...checkInForm, entity_type: 'customer' })}
                    className={`py-2 rounded-xl font-bold uppercase border transition-all ${
                      checkInForm.entity_type === 'customer'
                        ? 'bg-[#E91E63] text-white border-[#E91E63]'
                        : 'bg-[#10101C] border-gray-800 text-gray-400'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckInForm({ ...checkInForm, entity_type: 'trainer' })}
                    className={`py-2 rounded-xl font-bold uppercase border transition-all ${
                      checkInForm.entity_type === 'trainer'
                        ? 'bg-[#E91E63] text-white border-[#E91E63]'
                        : 'bg-[#10101C] border-gray-800 text-gray-400'
                    }`}
                  >
                    Trainer
                  </button>
                </div>
              </div>

              {checkInForm.entity_type === 'customer' ? (
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Select Customer *</label>
                  <select
                    required
                    value={checkInForm.customer_id}
                    onChange={(e) => setCheckInForm({ ...checkInForm, customer_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  >
                    <option value="">-- Choose Member --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.full_name} ({c.customer_code})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Select Trainer *</label>
                  <select
                    required
                    value={checkInForm.trainer_id}
                    onChange={(e) => setCheckInForm({ ...checkInForm, trainer_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  >
                    <option value="">-- Choose Trainer --</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.full_name} ({t.trainer_code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold uppercase tracking-wider"
                >
                  Record Check-In
                </button>
                <button
                  type="button"
                  onClick={() => setCheckInModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-[#10101C] text-gray-400 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
