import React, { useState, useEffect } from 'react';
import { Inbox, Search, CheckCircle2, UserPlus, Phone, Mail, Clock, X, AlertCircle } from 'lucide-react';
import { Enquiry } from '../../types';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const EnquiryManagement: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const { success, error } = useNotification();

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await api.getEnquiries({ search, status: statusFilter });
      setEnquiries(res);
    } catch (err: any) {
      error('Failed to load enquiries', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [search, statusFilter]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.updateEnquiryStatus(id, { status });
      success('Status Updated', `Enquiry marked as ${status}.`);
      loadEnquiries();
    } catch (err: any) {
      error('Status Update Failed', err.message);
    }
  };

  const handleConvert = async (enquiry: Enquiry) => {
    try {
      await api.convertEnquiryToCustomer(enquiry.id, {
        address: 'Lead converted from website inquiry',
      });
      success('Converted to Customer!', `${enquiry.full_name} is now registered in the gym customer directory.`);
      setConvertModalOpen(false);
      loadEnquiries();
    } catch (err: any) {
      error('Conversion Failed', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151522] p-6 rounded-3xl border border-[#E91E63]/30 shadow-xl">
        <div>
          <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest font-heading">
            Lead Capture Pipeline
          </span>
          <h1 className="font-heading text-3xl font-bold text-white uppercase mt-0.5">
            Enquiry & Lead Management ({enquiries.length})
          </h1>
          <p className="text-xs text-[#B8B5C2] mt-1">Review contact forms, trial session bookings, and convert leads into active members.</p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-[#151522] border border-gray-800 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E91E63]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-xs text-white"
        >
          <option value="all">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Interested">Interested</option>
          <option value="Follow-Up">Follow-Up</option>
          <option value="Converted">Converted</option>
          <option value="Not Interested">Not Interested</option>
        </select>
      </div>

      {/* Enquiries Table */}
      <div className="rounded-3xl bg-[#151522] border border-[#E91E63]/25 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#10101C] text-gray-400 uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Prospect</th>
                <th className="p-4">Interest & Source</th>
                <th className="p-4">Message</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#10101C]/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#E91E63]">{enq.enquiry_code}</td>
                    <td className="p-4">
                      <p className="font-bold text-white">{enq.full_name}</p>
                      <p className="text-[10px] text-gray-400">{enq.phone} • {enq.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-white block">{enq.program_interest || 'General'}</span>
                      <span className="text-[10px] text-[#E91E63] font-bold uppercase">{enq.source}</span>
                    </td>
                    <td className="p-4 text-gray-300 max-w-xs truncate">{enq.message || 'No message'}</td>
                    <td className="p-4 text-gray-400">{enq.created_at?.split(' ')[0]}</td>
                    <td className="p-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-[#10101C] border border-gray-800 ${
                          enq.status === 'Converted'
                            ? 'text-emerald-400 border-emerald-500/40'
                            : enq.status === 'New'
                            ? 'text-[#E91E63] border-[#E91E63]/40'
                            : 'text-amber-400 border-amber-500/40'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Interested">Interested</option>
                        <option value="Follow-Up">Follow-Up</option>
                        <option value="Converted">Converted</option>
                        <option value="Not Interested">Not Interested</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      {enq.status !== 'Converted' ? (
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            setConvertModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white font-bold text-[11px] transition-colors inline-flex items-center gap-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Convert to Customer</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Converted</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Convert to Customer Modal */}
      {convertModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#151522] rounded-3xl p-6 border border-[#E91E63]/40 shadow-2xl text-center">
            <UserPlus className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-heading text-2xl font-bold text-white uppercase">Convert Lead to Member</h3>
            <p className="text-xs text-[#B8B5C2] mt-2 mb-6">
              This will automatically register <strong className="text-white">{selectedEnquiry.full_name}</strong> as an active customer in the database using their contact details ({selectedEnquiry.phone}, {selectedEnquiry.email}) without duplicate entry.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleConvert(selectedEnquiry)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs uppercase tracking-wider"
              >
                Yes, Register Customer
              </button>
              <button
                onClick={() => setConvertModalOpen(false)}
                className="px-5 py-3 rounded-xl bg-[#10101C] text-gray-400 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
