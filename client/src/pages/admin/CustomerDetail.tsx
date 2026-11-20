import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Shield,
  CreditCard,
  CalendarCheck,
  ClipboardList,
  Apple,
  TrendingUp,
  FileText,
  Clock,
  Printer,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  const fetchCustomer = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getCustomerById(id);
      setCustomer(data);
    } catch (err: any) {
      error('Failed to load customer profile', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  if (loading || !customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-[#E91E63] border-t-transparent animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'personal', name: 'Personal Information' },
    { id: 'memberships', name: 'Membership History' },
    { id: 'payments', name: 'Payment History' },
    { id: 'attendance', name: 'Attendance History' },
    { id: 'workouts', name: 'Workout Plans' },
    { id: 'diets', name: 'Diet Plans' },
    { id: 'trainer', name: 'Trainer Details' },
    { id: 'progress', name: 'Progress Tracking' },
    { id: 'documents', name: 'Documents & Notes' },
    { id: 'timeline', name: 'Activity Timeline' },
  ];

  const handlePrintReceipt = (payment: any) => {
    setSelectedReceipt(payment);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#E91E63] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers Directory</span>
        </Link>
      </div>

      {/* Customer Hero Banner */}
      <div className="bg-[#151522] rounded-3xl p-6 sm:p-8 border border-[#E91E63]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <img
            src={customer.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
            alt={customer.full_name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#E91E63]"
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-3xl font-bold text-white uppercase">{customer.full_name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${customer.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-300'}`}>
                {customer.status}
              </span>
            </div>
            <p className="font-mono text-xs text-[#E91E63] font-bold mt-1">ID: {customer.customer_code}</p>
            <p className="text-xs text-[#B8B5C2] mt-0.5">
              {customer.email} • {customer.mobile_number}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3 rounded-xl bg-[#10101C] border border-gray-800 text-right">
            <span className="text-[10px] text-gray-400 block uppercase">Plan</span>
            <span className="text-xs font-bold text-white">{customer.plan_name || 'None'}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#10101C] border border-gray-800 text-right">
            <span className="text-[10px] text-gray-400 block uppercase">Assigned Coach</span>
            <span className="text-xs font-bold text-white">{customer.trainer_name || 'Unassigned'}</span>
          </div>
        </div>
      </div>

      {/* 11 Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-800/80">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white shadow-lg'
                : 'bg-[#151522] border border-gray-800 text-[#B8B5C2] hover:text-white'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-[#151522] rounded-3xl p-6 sm:p-8 border border-[#E91E63]/25 shadow-xl">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="font-heading text-xl font-bold text-white uppercase">Athlete Performance Snapshot</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#10101C] border border-gray-800">
                <span className="text-xs text-gray-400">Total Check-Ins</span>
                <h4 className="font-heading text-2xl font-bold text-white mt-1">{customer.attendance?.length || 0} Sessions</h4>
              </div>
              <div className="p-4 rounded-2xl bg-[#10101C] border border-gray-800">
                <span className="text-xs text-gray-400">Total Payments Made</span>
                <h4 className="font-heading text-2xl font-bold text-emerald-400 mt-1">
                  ${(customer.payments || []).reduce((s: number, p: any) => s + (p.paid_amount || 0), 0)}
                </h4>
              </div>
              <div className="p-4 rounded-2xl bg-[#10101C] border border-gray-800">
                <span className="text-xs text-gray-400">Current Body Weight</span>
                <h4 className="font-heading text-2xl font-bold text-white mt-1">{customer.weight || 'N/A'} kg</h4>
              </div>
            </div>

            {/* Quick overview of latest workout */}
            <div className="pt-4 border-t border-gray-800">
              <h4 className="text-sm font-bold text-white mb-3">Active Workout Routine</h4>
              {customer.workouts && customer.workouts.length > 0 ? (
                <div className="p-4 rounded-2xl bg-[#10101C] border border-[#E91E63]/30 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-white text-sm">{customer.workouts[0].plan_name}</h5>
                    <p className="text-xs text-[#B8B5C2]">Category: {customer.workouts[0].category} • Level: {customer.workouts[0].difficulty}</p>
                  </div>
                  <button onClick={() => setActiveTab('workouts')} className="text-xs text-[#E91E63] font-semibold hover:underline">
                    View Workout Details →
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No workout plan assigned yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PERSONAL INFORMATION */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h3 className="font-heading text-xl font-bold text-white uppercase">Personal & Medical Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#10101C] border border-gray-800">
                  <span className="text-gray-400 block mb-0.5">Full Name</span>
                  <span className="text-white font-bold text-sm">{customer.full_name}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#10101C] border border-gray-800">
                  <span className="text-gray-400 block mb-0.5">Email Address</span>
                  <span className="text-white font-bold">{customer.email}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#10101C] border border-gray-800">
                  <span className="text-gray-400 block mb-0.5">Mobile Phone</span>
                  <span className="text-white font-bold">{customer.mobile_number}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#10101C] border border-gray-800">
                  <span className="text-gray-400 block mb-0.5">Residential Address</span>
                  <span className="text-white font-bold">{customer.address || 'Not Provided'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#10101C] border border-gray-800">
                  <span className="text-gray-400 block mb-0.5">Gender & Date of Birth</span>
                  <span className="text-white font-bold">{customer.gender} • {customer.date_of_birth}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#10101C] border border-gray-800">
                  <span className="text-gray-400 block mb-0.5">Emergency Contact</span>
                  <span className="text-white font-bold text-rose-400">{customer.emergency_contact || 'None'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#10101C] border border-gray-800">
                  <span className="text-gray-400 block mb-0.5">Blood Group & Physical Stats</span>
                  <span className="text-white font-bold">Blood: {customer.blood_group || 'N/A'} • Height: {customer.height} cm • Weight: {customer.weight} kg</span>
                </div>
                <div className="p-3 rounded-xl bg-[#10101C] border border-gray-800">
                  <span className="text-gray-400 block mb-0.5">Medical Notes</span>
                  <span className="text-white font-medium">{customer.medical_notes || 'No noted restrictions.'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MEMBERSHIP HISTORY */}
        {activeTab === 'memberships' && (
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-white uppercase">Membership Terms</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#10101C] text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-xl">Plan Name</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">End Date</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Paid Amount</th>
                    <th className="p-3">Pending</th>
                    <th className="p-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {(customer.memberships || []).map((m: any) => (
                    <tr key={m.id}>
                      <td className="p-3 font-bold text-white">{m.plan_name}</td>
                      <td className="p-3 text-gray-300">{m.start_date}</td>
                      <td className="p-3 text-gray-300">{m.end_date}</td>
                      <td className="p-3 font-bold text-white">${m.total_amount}</td>
                      <td className="p-3 font-bold text-emerald-400">${m.paid_amount}</td>
                      <td className="p-3 font-bold text-amber-400">${m.pending_amount}</td>
                      <td className="p-3">
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

        {/* TAB 4: PAYMENT HISTORY & PRINT RECEIPT */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-white uppercase">Invoices & Receipts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#10101C] text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-xl">Receipt #</th>
                    <th className="p-3">Payment Date</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-xl text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {(customer.payments || []).map((pay: any) => (
                    <tr key={pay.id}>
                      <td className="p-3 font-mono font-bold text-[#E91E63]">{pay.receipt_number}</td>
                      <td className="p-3 text-gray-300">{pay.payment_date}</td>
                      <td className="p-3 text-white font-medium">{pay.payment_method}</td>
                      <td className="p-3 font-bold text-emerald-400">${pay.paid_amount}</td>
                      <td className="p-3 uppercase text-[10px] font-bold text-gray-300">{pay.status}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handlePrintReceipt(pay)}
                          className="px-3 py-1 rounded bg-[#10101C] border border-gray-800 text-[#E91E63] hover:bg-[#E91E63] hover:text-white transition-colors inline-flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ATTENDANCE HISTORY */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-white uppercase">Gym Check-In Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#10101C] text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-xl">Date</th>
                    <th className="p-3">Check-In Time</th>
                    <th className="p-3">Check-Out Time</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-xl">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {(customer.attendance || []).map((att: any) => (
                    <tr key={att.id}>
                      <td className="p-3 font-medium text-white">{att.attendance_date}</td>
                      <td className="p-3 text-[#E91E63] font-mono">{att.check_in_time}</td>
                      <td className="p-3 text-gray-400 font-mono">{att.check_out_time || 'Active Session'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                          {att.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400">{att.notes || 'Normal session'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: WORKOUT PLANS */}
        {activeTab === 'workouts' && (
          <div className="space-y-6">
            <h3 className="font-heading text-xl font-bold text-white uppercase">Assigned Training Routines</h3>
            {(customer.workouts || []).map((w: any) => (
              <div key={w.id} className="p-5 rounded-2xl bg-[#10101C] border border-[#E91E63]/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-heading text-xl font-bold text-white">{w.plan_name}</h4>
                  <span className="px-3 py-1 rounded bg-[#E91E63]/20 text-[#E91E63] text-xs font-bold uppercase">
                    {w.difficulty} Level
                  </span>
                </div>
                <p className="text-xs text-[#B8B5C2] mb-4">{w.description}</p>
                <div className="text-xs text-gray-400">
                  <span>Assigned Coach: {w.trainer_name || 'Head Trainer'} • Duration: {w.duration_weeks} Weeks</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 7: DIET PLANS */}
        {activeTab === 'diets' && (
          <div className="space-y-6">
            <h3 className="font-heading text-xl font-bold text-white uppercase">Assigned Nutrition Protocol</h3>
            {(customer.diets || []).map((d: any) => (
              <div key={d.id} className="p-5 rounded-2xl bg-[#10101C] border border-[#E91E63]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-xl font-bold text-white">{d.plan_name}</h4>
                  <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                    {d.target_calories} kCal Target
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#151522]">
                    <span className="text-gray-400 block text-[10px]">Protein</span>
                    <span className="font-bold text-white">{d.protein_grams}g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#151522]">
                    <span className="text-gray-400 block text-[10px]">Carbs</span>
                    <span className="font-bold text-white">{d.carbs_grams}g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#151522]">
                    <span className="text-gray-400 block text-[10px]">Fats</span>
                    <span className="font-bold text-white">{d.fats_grams}g</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#151522]">
                    <span className="text-gray-400 block text-[10px]">Water</span>
                    <span className="font-bold text-white">{d.water_liters}L</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <p><span className="text-[#E91E63] font-bold">Breakfast:</span> {d.breakfast}</p>
                  <p><span className="text-[#E91E63] font-bold">Lunch:</span> {d.lunch}</p>
                  <p><span className="text-[#E91E63] font-bold">Dinner:</span> {d.dinner}</p>
                  {d.snacks && <p><span className="text-[#E91E63] font-bold">Snacks:</span> {d.snacks}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 8: TRAINER DETAILS */}
        {activeTab === 'trainer' && (
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-white uppercase">Assigned Personal Trainer</h3>
            {customer.trainer_name ? (
              <div className="p-6 rounded-2xl bg-[#10101C] border border-[#E91E63]/30 flex items-center justify-between">
                <div>
                  <h4 className="font-heading text-2xl font-bold text-white">{customer.trainer_name}</h4>
                  <p className="text-xs text-[#E91E63] mt-1">Lead Strength Specialist</p>
                  <p className="text-xs text-gray-400 mt-2">Mobile: {customer.trainer_mobile || 'Available in gym register'}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">No trainer currently assigned to this customer.</p>
            )}
          </div>
        )}

        {/* TAB 9: PROGRESS TRACKING */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-white uppercase">Body Metrics Progression</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#10101C] text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-xl">Date</th>
                    <th className="p-3">Weight (kg)</th>
                    <th className="p-3">BMI</th>
                    <th className="p-3">Chest (cm)</th>
                    <th className="p-3">Waist (cm)</th>
                    <th className="p-3">Arms (cm)</th>
                    <th className="p-3 rounded-r-xl">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {(customer.progress || []).map((prg: any) => (
                    <tr key={prg.id}>
                      <td className="p-3 font-medium text-white">{prg.recorded_date}</td>
                      <td className="p-3 font-bold text-[#E91E63]">{prg.weight_kg} kg</td>
                      <td className="p-3 text-gray-300">{prg.bmi || 'N/A'}</td>
                      <td className="p-3 text-gray-300">{prg.chest_cm || '-'}</td>
                      <td className="p-3 text-gray-300">{prg.waist_cm || '-'}</td>
                      <td className="p-3 text-gray-300">{prg.arms_cm || '-'}</td>
                      <td className="p-3 text-gray-400">{prg.notes || 'Routine check'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 10: DOCUMENTS & NOTES */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-white uppercase">Clinical Notes & Liability Waivers</h3>
            <div className="p-4 rounded-2xl bg-[#10101C] border border-gray-800 text-xs text-[#B8B5C2] space-y-2">
              <p><span className="text-white font-bold">Medical Clearance:</span> {customer.medical_notes || 'Full medical waiver signed on joining date.'}</p>
              <p><span className="text-white font-bold">Registration Agreement:</span> Signed biometric terms and membership conduct regulations accepted.</p>
            </div>
          </div>
        )}

        {/* TAB 11: ACTIVITY TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-white uppercase">Athlete Lifecycle Timeline</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#10101C] border-l-4 border-[#E91E63]">
                <p className="font-bold text-white">Joined Apex Elite Fitness</p>
                <p className="text-gray-400 text-[11px]">{customer.joining_date} • Registered by Front Desk</p>
              </div>
              <div className="p-3 rounded-xl bg-[#10101C] border-l-4 border-emerald-500">
                <p className="font-bold text-white">Membership Activated</p>
                <p className="text-gray-400 text-[11px]">Enrolled into {customer.plan_name || 'Membership'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRINTABLE RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white text-gray-900 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-black tracking-wider uppercase text-gray-900">
                  APEX <span className="text-[#E91E63]">ELITE</span>
                </h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Official Payment Invoice</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-[#E91E63] text-sm">{selectedReceipt.receipt_number}</p>
                <p className="text-xs text-gray-500">{selectedReceipt.payment_date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-6">
              <div>
                <p className="text-gray-500 font-semibold uppercase text-[10px]">Billed To</p>
                <p className="font-bold text-sm text-gray-900">{customer.full_name}</p>
                <p className="text-gray-600">{customer.customer_code}</p>
                <p className="text-gray-600">{customer.mobile_number}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 font-semibold uppercase text-[10px]">Payment Method</p>
                <p className="font-bold text-sm text-gray-900">{selectedReceipt.payment_method}</p>
                <p className="text-gray-600">{selectedReceipt.transaction_ref || 'Counter Transaction'}</p>
              </div>
            </div>

            <div className="border-t border-b py-4 mb-6">
              <div className="flex justify-between text-xs font-semibold py-1">
                <span>Gym Membership Subscription</span>
                <span>${selectedReceipt.paid_amount}</span>
              </div>
              {selectedReceipt.discount_amount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 py-1">
                  <span>Promotional Discount</span>
                  <span>-${selectedReceipt.discount_amount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-gray-900 border-t mt-2 pt-2">
                <span>Total Amount Paid</span>
                <span className="text-[#E91E63]">${selectedReceipt.paid_amount}</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 text-center mb-6">
              Thank you for training with Apex Elite Fitness. This receipt is computer generated and valid without signature.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs"
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
