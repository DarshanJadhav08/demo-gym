import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, Printer, DollarSign, CheckCircle2, X } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState('all');
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const { success, error } = useNotification();

  const [collectForm, setCollectForm] = useState({
    customer_id: '',
    paid_amount: 129,
    total_amount: 129,
    payment_method: 'UPI' as const,
    transaction_ref: '',
    notes: 'Counter payment collection',
    discount_amount: 0,
  });

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await api.getPayments({ paymentMethod: methodFilter });
      setPayments(res);
    } catch (err: any) {
      error('Failed to load payments', err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await api.getCustomers();
      setCustomers(res.customers || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    loadPayments();
  }, [methodFilter]);

  const handleCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectForm.customer_id || !collectForm.paid_amount) {
      error('Missing details', 'Please select customer and payment amount.');
      return;
    }

    try {
      const newPay = await api.collectPayment(collectForm);
      success('Payment Recorded', `Receipt #${newPay.receipt_number} generated.`);
      setCollectModalOpen(false);
      setSelectedReceipt(newPay);
      loadPayments();
    } catch (err: any) {
      error('Payment Collection Error', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151522] p-6 rounded-3xl border border-[#E91E63]/30 shadow-xl">
        <div>
          <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest font-heading">
            Billing & Invoicing
          </span>
          <h1 className="font-heading text-3xl font-bold text-white uppercase mt-0.5">
            Payment Management ({payments.length})
          </h1>
          <p className="text-xs text-[#B8B5C2] mt-1">Audit customer collections, generate official invoices, and balance ledgers.</p>
        </div>
        <button
          onClick={() => setCollectModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Collect Payment</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#151522] border border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-semibold uppercase">Payment Method:</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#10101C] border border-gray-800 text-xs text-white"
          >
            <option value="all">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Online Payment">Online Payment</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-3xl bg-[#151522] border border-[#E91E63]/25 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#10101C] text-gray-400 uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-4">Receipt #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Method</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Paid Amount</th>
                <th className="p-4">Balance Due</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Receipt Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#10101C]/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#E91E63]">{p.receipt_number}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{p.customer_name}</p>
                    <p className="text-[10px] text-gray-400">{p.customer_code}</p>
                  </td>
                  <td className="p-4 text-gray-300">{p.payment_method}</td>
                  <td className="p-4 font-bold text-white">${p.total_amount}</td>
                  <td className="p-4 font-bold text-emerald-400">${p.paid_amount}</td>
                  <td className="p-4 font-bold text-amber-400">${p.pending_amount}</td>
                  <td className="p-4 text-gray-400">{p.payment_date}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedReceipt(p)}
                      className="px-3 py-1.5 rounded-lg bg-[#10101C] border border-gray-800 text-[#E91E63] hover:bg-[#E91E63] hover:text-white transition-colors inline-flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Payment Modal */}
      {collectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#151522] rounded-3xl p-6 border border-[#E91E63]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <h3 className="font-heading text-xl font-bold text-white uppercase">Collect Fee / Payment</h3>
              <button onClick={() => setCollectModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCollect} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Select Customer *</label>
                <select
                  required
                  value={collectForm.customer_id}
                  onChange={(e) => setCollectForm({ ...collectForm, customer_id: e.target.value })}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Amount Paid ($) *</label>
                  <input
                    type="number"
                    required
                    value={collectForm.paid_amount}
                    onChange={(e) => setCollectForm({ ...collectForm, paid_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Payment Method *</label>
                  <select
                    value={collectForm.payment_method}
                    onChange={(e) => setCollectForm({ ...collectForm, payment_method: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online Payment">Online Payment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Reference / Transaction ID</label>
                <input
                  type="text"
                  value={collectForm.transaction_ref}
                  onChange={(e) => setCollectForm({ ...collectForm, transaction_ref: e.target.value })}
                  placeholder="e.g. UPI/REF/99281726"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold uppercase tracking-wider"
                >
                  Confirm & Issue Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setCollectModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-[#10101C] text-gray-400 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
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
                <p className="font-bold text-sm text-gray-900">{selectedReceipt.customer_name}</p>
                <p className="text-gray-600">{selectedReceipt.customer_code}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 font-semibold uppercase text-[10px]">Payment Method</p>
                <p className="font-bold text-sm text-gray-900">{selectedReceipt.payment_method}</p>
                <p className="text-gray-600">{selectedReceipt.transaction_ref || 'Counter Transaction'}</p>
              </div>
            </div>

            <div className="border-t border-b py-4 mb-6">
              <div className="flex justify-between text-xs font-semibold py-1">
                <span>Fee / Subscription Payment</span>
                <span>${selectedReceipt.paid_amount}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 border-t mt-2 pt-2">
                <span>Total Amount Paid</span>
                <span className="text-[#E91E63]">${selectedReceipt.paid_amount}</span>
              </div>
            </div>

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
