import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Check, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { MembershipPlan } from '../../types';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const MembershipManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'applications' | 'active'>('plans');
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [activeMemberships, setActiveMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();

  // Create Plan Modal
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: 49,
    duration_months: 1,
    description: '',
    benefits: ['Full Gym Access', 'Dedicated Trainer Allocated'],
    features: ['All Equipment Access'],
    is_active: 1,
  });

  const loadAll = async () => {
    try {
      setLoading(true);
      const [pList, aList, mList] = await Promise.all([
        api.getPlans(),
        api.getApplications(),
        api.getCustomerMemberships(),
      ]);
      setPlans(pList);
      setApplications(aList);
      setActiveMemberships(mList);
    } catch (err: any) {
      error('Failed to load memberships data', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleReviewApp = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.reviewApplication(id, status);
      success('Application Updated', `Application has been marked as ${status}.`);
      loadAll();
    } catch (err: any) {
      error('Review Failed', err.message);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.price) {
      error('Missing fields', 'Plan name and price are required.');
      return;
    }
    try {
      await api.createPlan({
        ...newPlan,
        benefits: JSON.stringify(newPlan.benefits),
        features: JSON.stringify(newPlan.features),
      });
      success('Plan Created', `${newPlan.name} is now available.`);
      setPlanModalOpen(false);
      loadAll();
    } catch (err: any) {
      error('Failed to create plan', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151522] p-6 rounded-3xl border border-[#E91E63]/30 shadow-xl">
        <div>
          <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest font-heading">
            Subscription Engine
          </span>
          <h1 className="font-heading text-3xl font-bold text-white uppercase mt-0.5">
            Membership Management
          </h1>
          <p className="text-xs text-[#B8B5C2] mt-1">Configure pricing tiers, approve inbound applications, and audit active passes.</p>
        </div>
        <button
          onClick={() => setPlanModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Tier</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'plans'
              ? 'bg-[#E91E63] text-white shadow-lg'
              : 'bg-[#151522] border border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          Membership Tiers ({plans.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'applications'
              ? 'bg-[#E91E63] text-white shadow-lg'
              : 'bg-[#151522] border border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          Inbound Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'active'
              ? 'bg-[#E91E63] text-white shadow-lg'
              : 'bg-[#151522] border border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          Enrolled Subscriptions ({activeMemberships.length})
        </button>
      </div>

      {/* TAB 1: PLANS */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/30 flex flex-col justify-between shadow-xl"
            >
              <div>
                <span className="text-xs font-bold text-[#E91E63] uppercase tracking-wider">
                  {p.duration_months} Month{p.duration_months > 1 ? 's' : ''} Term
                </span>
                <h3 className="font-heading text-2xl font-bold text-white mt-1">{p.name}</h3>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="font-heading text-4xl font-extrabold text-white">${p.price}</span>
                  <span className="text-xs text-gray-400">/ subscription</span>
                </div>
                <p className="text-xs text-[#B8B5C2] mb-4">{p.description || 'Standard high performance access'}</p>
              </div>

              <div className="pt-4 border-t border-gray-800 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold">● Active Tier</span>
                <span className="text-gray-400">{p.duration_days} Days Validity</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="rounded-3xl bg-[#151522] border border-[#E91E63]/25 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10101C] text-gray-400 uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="p-4">App Code</th>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Plan Selected</th>
                  <th className="p-4">Submitted At</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">
                      No pending membership applications.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id}>
                      <td className="p-4 font-mono font-bold text-[#E91E63]">{app.application_code}</td>
                      <td className="p-4 font-bold text-white">{app.full_name}</td>
                      <td className="p-4 text-gray-300">
                        <p>{app.mobile_number}</p>
                        <p className="text-[10px] text-gray-500">{app.email}</p>
                      </td>
                      <td className="p-4 font-bold text-white">{app.plan_name} (${app.plan_price})</td>
                      <td className="p-4 text-gray-400">{app.submitted_at}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : app.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {app.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReviewApp(app.id, 'approved')}
                              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewApp(app.id, 'rejected')}
                              className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[11px]"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-500">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ENROLLED MEMBERSHIPS */}
      {activeTab === 'active' && (
        <div className="rounded-3xl bg-[#151522] border border-[#E91E63]/25 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10101C] text-gray-400 uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="p-4">Athlete</th>
                  <th className="p-4">Membership Plan</th>
                  <th className="p-4">Term Validity</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Paid / Balance</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {activeMemberships.map((m) => (
                  <tr key={m.id}>
                    <td className="p-4">
                      <p className="font-bold text-white">{m.customer_name}</p>
                      <p className="text-[10px] text-[#E91E63] font-mono">{m.customer_code}</p>
                    </td>
                    <td className="p-4 font-bold text-white">{m.plan_name}</td>
                    <td className="p-4 text-gray-300">
                      {m.start_date} → <span className="font-bold text-white">{m.end_date}</span>
                    </td>
                    <td className="p-4 font-bold text-white">${m.total_amount}</td>
                    <td className="p-4">
                      <span className="text-emerald-400 font-bold">${m.paid_amount}</span> /{' '}
                      <span className="text-amber-400 font-bold">${m.pending_amount}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {planModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#151522] rounded-3xl p-6 border border-[#E91E63]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <h3 className="font-heading text-xl font-bold text-white uppercase">New Membership Tier</h3>
              <button onClick={() => setPlanModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Tier Name *</label>
                <input
                  type="text"
                  required
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  placeholder="e.g. Platinum Power"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Duration (Months) *</label>
                  <input
                    type="number"
                    required
                    value={newPlan.duration_months}
                    onChange={(e) => setNewPlan({ ...newPlan, duration_months: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold uppercase tracking-wider"
                >
                  Save Tier
                </button>
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
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
