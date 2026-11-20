import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MembershipPlan } from '../../../types';
import { api } from '../../../services/api';
import { useNotification } from '../../../context/NotificationContext';

interface MembershipApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: MembershipPlan[];
  preSelectedPlanId?: string;
}

export const MembershipApplicationModal: React.FC<MembershipApplicationModalProps> = ({
  isOpen,
  onClose,
  plans,
  preSelectedPlanId,
}) => {
  const { success, error } = useNotification();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (preSelectedPlanId) {
      setSelectedPlanId(preSelectedPlanId);
    } else if (plans && plans.length > 0) {
      setSelectedPlanId(plans[0].id);
    }
  }, [preSelectedPlanId, plans]);

  if (!isOpen) return null;

  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !mobileNumber || !selectedPlanId) {
      error('Incomplete form', 'Please fill in your name, email, mobile number, and select a membership plan.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.submitMembershipApplication({
        full_name: fullName,
        email,
        mobile_number: mobileNumber,
        plan_id: selectedPlanId,
        notes: notes || 'Submitted from website application modal',
      });

      // Confetti burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E91E63', '#A51C55', '#FFFFFF', '#571638'],
      });

      success('Application Received!', res.message || 'Your membership application is with our gym management team.');
      onClose();
    } catch (err: any) {
      error('Submission Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-lg w-full bg-[#151522] rounded-3xl overflow-hidden border border-[#E91E63]/40 shadow-2xl my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-[#571638] to-[#10101C] border-b border-[#E91E63]/30">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 text-[#E91E63] text-xs font-bold uppercase tracking-widest mb-1 font-heading">
            <Sparkles className="w-4 h-4" />
            <span>Apex Elite Membership</span>
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white uppercase">
            Start Your Transformation
          </h3>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {/* Plan Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Select Membership Tier *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {plans.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPlanId === p.id
                      ? 'bg-[#E91E63]/20 border-[#E91E63] text-white shadow-lg'
                      : 'bg-[#10101C] border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{p.name}</span>
                    <span className="text-xs font-bold text-[#E91E63]">${p.price}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    {p.duration_months} Month{p.duration_months > 1 ? 's' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Vikram Singhania"
              className="w-full px-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
            />
          </div>

          {/* Email & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Fitness Goals or Special Requests
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Interested in morning strength classes..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm resize-none"
            />
          </div>

          {/* Summary Box */}
          {currentPlan && (
            <div className="p-4 rounded-xl bg-[#10101C] border border-[#E91E63]/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-400 block">Selected Tier</span>
                <span className="text-white font-bold">{currentPlan.name} ({currentPlan.duration_months} Mos)</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block">Total Due</span>
                <span className="text-white font-extrabold text-base text-[#E91E63]">${currentPlan.price}</span>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white font-bold text-sm uppercase tracking-wider shadow-xl hover:shadow-[#E91E63]/50 hover:scale-[1.01] active:scale-98 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? <span>Submitting...</span> : <span>Confirm & Submit Application</span>}
          </button>
        </form>
      </div>
    </div>
  );
};
