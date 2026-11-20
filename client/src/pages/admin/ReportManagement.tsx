import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, TrendingDown, DollarSign, Calendar, Printer } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const ReportManagement: React.FC = () => {
  const [report, setReport] = useState<any | null>(null);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const { error } = useNotification();

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await api.getFinancialReport(startDate, endDate);
      setReport(data);
    } catch (err: any) {
      error('Report Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [startDate, endDate]);

  const handleExportCSV = () => {
    if (!report) return;
    const paymentRows = (report.payments || []).map(
      (p: any) => `"Revenue","${p.receipt_number}","${p.customer_name}","${p.paid_amount}","${p.payment_date}"`
    );
    const expenseRows = (report.expenses || []).map(
      (e: any) => `"Expense","${e.category}","${e.description}","-${e.amount}","${e.expense_date}"`
    );

    const csv = 'Type,ID/Category,Description,Amount,Date\n' + [...paymentRows, ...expenseRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex_elite_financial_report_${startDate}_to_${endDate}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151522] p-6 rounded-3xl border border-[#E91E63]/30 shadow-xl">
        <div>
          <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest font-heading">
            Executive Ledger & Auditing
          </span>
          <h1 className="font-heading text-3xl font-bold text-white uppercase mt-0.5">
            Financial & Operational Reports
          </h1>
          <p className="text-xs text-[#B8B5C2] mt-1">Calculated directly from real database payment collections and operating expenses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-xs font-semibold text-gray-300 hover:text-white"
          >
            <Printer className="w-4 h-4 text-[#E91E63]" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40"
          >
            <Download className="w-4 h-4" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* Date Filters */}
      <div className="p-4 rounded-2xl bg-[#151522] border border-gray-800 flex flex-wrap gap-4 items-center">
        <span className="text-xs text-gray-400 font-semibold uppercase">Date Range Filter:</span>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#10101C] border border-gray-800 text-xs text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#10101C] border border-gray-800 text-xs text-white"
          />
        </div>
      </div>

      {/* KPI Cards */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#151522] border border-emerald-500/30 shadow-xl">
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-1">Total Revenue Collected</span>
            <h3 className="font-heading text-4xl font-extrabold text-white">${report.totalRevenue.toLocaleString()}</h3>
            <p className="text-[11px] text-gray-400 mt-2">{(report.payments || []).length} billing transactions processed</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#151522] border border-rose-500/30 shadow-xl">
            <span className="text-xs text-rose-400 font-bold uppercase tracking-wider block mb-1">Total Operating Expenses</span>
            <h3 className="font-heading text-4xl font-extrabold text-white">${report.totalExpenses.toLocaleString()}</h3>
            <p className="text-[11px] text-gray-400 mt-2">{(report.expenses || []).length} facility expenses recorded</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/40 shadow-xl">
            <span className="text-xs text-[#E91E63] font-bold uppercase tracking-wider block mb-1">Net Operating Profit</span>
            <h3 className={`font-heading text-4xl font-extrabold ${report.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${report.netProfit.toLocaleString()}
            </h3>
            <p className="text-[11px] text-gray-400 mt-2">Net margin after all expenses</p>
          </div>
        </div>
      )}

      {/* Breakdown Tables Split */}
      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Transactions */}
          <div className="p-6 rounded-3xl bg-[#151522] border border-emerald-500/20 shadow-xl">
            <h3 className="font-heading text-xl font-bold text-white uppercase mb-4 text-emerald-400">
              Revenue Inflows ({(report.payments || []).length})
            </h3>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#10101C] text-gray-400 uppercase">
                  <tr>
                    <th className="p-3">Receipt</th>
                    <th className="p-3">Athlete</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {(report.payments || []).map((p: any) => (
                    <tr key={p.id}>
                      <td className="p-3 font-mono font-bold text-[#E91E63]">{p.receipt_number}</td>
                      <td className="p-3 text-white font-medium">{p.customer_name}</td>
                      <td className="p-3 font-bold text-emerald-400">${p.paid_amount}</td>
                      <td className="p-3 text-gray-400">{p.payment_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expense Outflows */}
          <div className="p-6 rounded-3xl bg-[#151522] border border-rose-500/20 shadow-xl">
            <h3 className="font-heading text-xl font-bold text-white uppercase mb-4 text-rose-400">
              Operating Outflows ({(report.expenses || []).length})
            </h3>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#10101C] text-gray-400 uppercase">
                  <tr>
                    <th className="p-3">Category</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {(report.expenses || []).map((e: any) => (
                    <tr key={e.id}>
                      <td className="p-3 font-bold text-white">{e.category}</td>
                      <td className="p-3 text-gray-300">{e.description}</td>
                      <td className="p-3 font-bold text-rose-400">-${e.amount}</td>
                      <td className="p-3 text-gray-400">{e.expense_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
