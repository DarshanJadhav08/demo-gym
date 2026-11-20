import React, { useState } from 'react';
import { X, Sparkles, QrCode, CheckCircle2, Dumbbell, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

interface FreePassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreePassModal: React.FC<FreePassModalProps> = ({ isOpen, onClose }) => {
  const { success, error } = useNotification();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [passGenerated, setPassGenerated] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      error('Missing Information', 'Please complete all fields.');
      return;
    }

    try {
      setLoading(true);
      await api.submitEnquiry({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        program_interest: '1-Day VIP Trial Pass',
        source: 'Free Pass Modal',
        message: `Requested 1-Day Trial Pass for date: ${formData.date}`,
      });

      setPassGenerated({
        code: `APEX-PASS-${Math.floor(100000 + Math.random() * 900000)}`,
        holder: formData.fullName,
        date: formData.date,
        expires: '24 Hours after check-in',
      });
      success('VIP Day Pass Approved!', 'Your pass is ready. Show this pass at the front desk.');
    } catch (err: any) {
      error('Error', err.message || 'Could not generate pass');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-[#151522] rounded-3xl border border-[#E91E63]/40 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 text-white">
        <button onClick={onClose} className="absolute top-5 right-5 p-1 rounded-lg text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        {!passGenerated ? (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E91E63]/15 border border-[#E91E63]/30 text-[#E91E63] text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Complimentary Guest Privilege</span>
              </div>
              <h3 className="font-heading text-2xl font-bold uppercase text-white">
                Claim Free 1-Day VIP Pass
              </h3>
              <p className="text-xs text-[#B8B5C2] mt-1">
                Experience all Olympic lifting platforms, cardio mezzanine, and luxury recovery saunas with zero obligation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Issuing Pass...' : 'Generate Instant VIP Pass'}</span>
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-2 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-heading text-2xl font-bold uppercase text-white mb-1">
              Your VIP Day Pass is Active
            </h3>
            <p className="text-xs text-[#B8B5C2] mb-6">
              Show this digital credential to the front desk concierge on arrival.
            </p>

            {/* Simulated Digital Pass Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#10101C] via-[#1f101d] to-[#10101C] border-2 border-[#E91E63] shadow-2xl relative overflow-hidden mb-6 text-left">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-[#E91E63]" />
                  <span className="font-heading font-bold text-white text-sm tracking-wider">APEX ELITE VIP GUEST</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                  VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 items-center">
                <div className="col-span-2 space-y-1">
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Guest Name</span>
                  <p className="font-bold text-white text-sm">{passGenerated.holder}</p>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold mt-2">Pass ID</span>
                  <p className="font-mono text-xs text-[#E91E63] font-bold">{passGenerated.code}</p>
                </div>
                <div className="col-span-1 flex flex-col items-center justify-center p-2 rounded-xl bg-white text-black">
                  <QrCode className="w-14 h-14" />
                  <span className="text-[8px] font-mono mt-1">SCAN CONCIERGE</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#10101C] border border-gray-800 hover:border-[#E91E63] text-white text-xs font-semibold transition-colors"
            >
              Done & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
