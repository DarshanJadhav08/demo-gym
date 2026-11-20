import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Dumbbell,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CalendarCheck,
  Inbox,
  AlertCircle,
  CreditCard,
  ArrowRight,
  Receipt
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { api } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summary = await api.getDashboardSummary();
        setData(summary);
      } catch (err) {
        console.error('Failed to load dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-[#E91E63] border-t-transparent animate-spin" />
      </div>
    );
  }

  const kpis = data.kpis || {};
  const COLORS = ['#E91E63', '#A51C55', '#571638', '#9C27B0', '#FF4081'];

  const kpiCards = [
    { label: 'Total Customers', value: kpis.totalCustomers || 0, icon: Users, color: 'text-blue-400' },
    { label: 'Active Members', value: kpis.activeMembers || 0, icon: Users, color: 'text-emerald-400' },
    { label: 'Inactive / Suspended', value: kpis.inactiveMembers || 0, icon: AlertCircle, color: 'text-amber-400' },
    { label: 'Total Trainers', value: kpis.totalTrainers || 0, icon: Dumbbell, color: 'text-purple-400' },
    { label: 'Monthly Revenue', value: `$${Number(kpis.monthlyRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-[#E91E63]' },
    { label: 'Monthly Expenses', value: `$${Number(kpis.monthlyExpenses || 0).toLocaleString()}`, icon: TrendingDown, color: 'text-rose-400' },
    { label: 'Net Profit', value: `$${Number(kpis.netProfit || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Pending Payments', value: `$${Number(kpis.pendingPayments || 0).toLocaleString()}`, icon: CreditCard, color: 'text-amber-400' },
    { label: "Today's Attendance", value: kpis.todayAttendance || 0, icon: CalendarCheck, color: 'text-cyan-400' },
    { label: 'New Enquiries', value: kpis.newEnquiries || 0, icon: Inbox, color: 'text-[#E91E63]' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151522] p-6 rounded-3xl border border-[#E91E63]/30 shadow-xl">
        <div>
          <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest font-heading">
            Executive Control Center
          </span>
          <h1 className="font-heading text-3xl font-bold text-white uppercase mt-0.5">
            Gym Management Overview
          </h1>
          <p className="text-xs text-[#B8B5C2] mt-1">Real-time statistics synchronized directly with the database.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/customers"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 transition-all"
          >
            + Add New Customer
          </Link>
          <Link
            to="/admin/payments"
            className="px-4 py-2.5 rounded-xl bg-[#10101C] border border-[#E91E63]/40 text-white text-xs font-semibold hover:bg-[#1a1a2e] transition-all"
          >
            Collect Payment
          </Link>
        </div>
      </div>

      {/* 10 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#151522] border border-[#E91E63]/20 hover:border-[#E91E63]/50 transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#B8B5C2] font-medium leading-tight">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white tracking-tight">{kpi.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue vs Expenses Area Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/25 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading text-xl font-bold text-white uppercase">Revenue & Expense Performance</h3>
              <p className="text-xs text-gray-400">Monthly financial cashflow trend ($ USD)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#E91E63]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E91E63]" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-500" /> Expenses
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyRevenue || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E91E63" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E91E63" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#571638" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#571638" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10101C', borderColor: 'rgba(233,30,99,0.4)', borderRadius: 12, color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E91E63" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#888" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Membership Distribution Donut */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/25 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-xl font-bold text-white uppercase">Membership Tier Breakdown</h3>
            <p className="text-xs text-gray-400">Active athlete subscriptions</p>
          </div>

          <div className="h-56 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.membershipDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {(data.membershipDistribution || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#10101C', borderColor: 'rgba(233,30,99,0.4)', borderRadius: 12, color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5">
            {(data.membershipDistribution || []).map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-[#B8B5C2]">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.count} members</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Transactions & New Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/25 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-xl font-bold text-white uppercase">Recent Billing Transactions</h3>
            <Link to="/admin/payments" className="text-xs text-[#E91E63] font-semibold hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10101C] text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Receipt</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 rounded-r-xl">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {(data.recentTransactions || []).map((txn: any) => (
                  <tr key={txn.id} className="hover:bg-[#10101C]/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#E91E63]">{txn.receipt_number}</td>
                    <td className="p-3 text-white font-medium">{txn.customer_name}</td>
                    <td className="p-3 text-gray-300">{txn.payment_method}</td>
                    <td className="p-3 font-bold text-emerald-400">${txn.paid_amount}</td>
                    <td className="p-3 text-gray-400">{txn.payment_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Leads / Enquiries */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/25 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-bold text-white uppercase">Latest Leads & Enquiries</h3>
              <Link to="/admin/enquiries" className="text-xs text-[#E91E63] font-semibold hover:underline flex items-center gap-1">
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {(data.recentCustomers || []).slice(0, 4).map((c: any) => (
                <div key={c.id} className="p-3 rounded-xl bg-[#10101C] border border-gray-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={c.profile_photo} alt={c.full_name} className="w-9 h-9 rounded-full object-cover border border-[#E91E63]/40" />
                    <div>
                      <h4 className="font-bold text-xs text-white">{c.full_name}</h4>
                      <p className="text-[10px] text-gray-400">{c.customer_code} • {c.plan_name || 'No Plan'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-300'}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <Link
              to="/admin/enquiries"
              className="w-full py-2.5 rounded-xl bg-[#10101C] border border-[#E91E63]/40 text-xs font-semibold text-white flex items-center justify-center gap-2 hover:bg-[#E91E63] transition-colors"
            >
              <Inbox className="w-4 h-4" />
              <span>Review Website Inbound Inquiries</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
