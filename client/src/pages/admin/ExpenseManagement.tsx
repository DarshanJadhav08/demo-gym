import React, { useState, useEffect } from 'react';
import { TrendingDown, Plus, Trash2, Calendar, DollarSign, X } from 'lucide-react';
import { Expense } from '../../types';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const ExpenseManagement: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const { success, error } = useNotification();

  const [newExpense, setNewExpense] = useState({
    amount: 1500,
    category: 'Equipment',
    description: '',
    payment_method: 'Bank Transfer',
    expense_date: new Date().toISOString().split('T')[0],
  });

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.getExpenses({ category: categoryFilter });
      setExpenses(res);
    } catch (err: any) {
      error('Failed to load expenses', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [categoryFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.description) {
      error('Missing details', 'Please enter amount and description.');
      return;
    }
    try {
      await api.createExpense(newExpense);
      success('Expense Recorded', `$${newExpense.amount} logged under ${newExpense.category}.`);
      setModalOpen(false);
      loadExpenses();
    } catch (err: any) {
      error('Failed to log expense', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    try {
      await api.deleteExpense(id);
      success('Expense Deleted', 'Record removed.');
      loadExpenses();
    } catch (err: any) {
      error('Delete Error', err.message);
    }
  };

  const totalExpense = expenses.reduce((s, e) => s + (e.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151522] p-6 rounded-3xl border border-[#E91E63]/30 shadow-xl">
        <div>
          <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest font-heading">
            Operational Outflows
          </span>
          <h1 className="font-heading text-3xl font-bold text-white uppercase mt-0.5">
            Expense Management (${totalExpense.toLocaleString()})
          </h1>
          <p className="text-xs text-[#B8B5C2] mt-1">Track maintenance, equipment, rent, and trainer salary payouts.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-2xl bg-[#151522] border border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-semibold uppercase">Category Filter:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#10101C] border border-gray-800 text-xs text-white"
          >
            <option value="all">All Categories</option>
            <option value="Rent">Rent</option>
            <option value="Electricity">Electricity</option>
            <option value="Equipment">Equipment</option>
            <option value="Trainer Salary">Trainer Salary</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Marketing">Marketing</option>
            <option value="Other Expenses">Other Expenses</option>
          </select>
        </div>
      </div>

      {/* Expense Table */}
      <div className="rounded-3xl bg-[#151522] border border-[#E91E63]/25 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#10101C] text-gray-400 uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-[#10101C]/50 transition-colors">
                  <td className="p-4 text-gray-400">{e.expense_date}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded bg-[#E91E63]/15 text-[#E91E63] font-bold">
                      {e.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-white">{e.description}</td>
                  <td className="p-4 font-bold text-rose-400">${e.amount.toLocaleString()}</td>
                  <td className="p-4 text-gray-300">{e.payment_method}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="p-1.5 rounded-lg bg-[#10101C] border border-gray-800 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#151522] rounded-3xl p-6 border border-[#E91E63]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <h3 className="font-heading text-xl font-bold text-white uppercase">Record Operating Expense</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Category *</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                >
                  <option value="Rent">Rent</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Trainer Salary">Trainer Salary</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other Expenses">Other Expenses</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    required
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={newExpense.expense_date}
                    onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="e.g. Rogue bumper plates replacement"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold uppercase tracking-wider"
                >
                  Log Expense
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
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
