import React, { useState } from 'react';
import { X, Calendar, Clock, Check } from 'lucide-react';
import { api } from '../../../services/api';
import { useNotification } from '../../../context/NotificationContext';

interface BookSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  classNameTitle: string;
}

export const BookSessionModal: React.FC<BookSessionModalProps> = ({ isOpen, onClose, classNameTitle }) => {
  const { success, error } = useNotification();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      error('Missing Information', 'Please provide your name, email, and phone number.');
      return;
    }

    try {
      setLoading(true);
      await api.submitEnquiry({
        full_name: fullName,
        email,
        phone,
        program_interest: classNameTitle || 'Class Session',
        source: 'Book Session',
        message: `Requested trial booking for ${classNameTitle} on ${preferredDate || 'next available slot'}.`,
      });
      success('Trial Session Booked!', `We have reserved your spot for ${classNameTitle}. Our coordinator will confirm timing.`);
      onClose();
    } catch (err: any) {
      error('Booking Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-[#151522] rounded-3xl overflow-hidden border border-[#E91E63]/40 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 bg-gradient-to-r from-[#571638] to-[#10101C] border-b border-[#E91E63]/30 flex items-center justify-between">
          <div>
            <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest font-heading">Trial Reservation</span>
            <h3 className="font-heading text-2xl font-bold text-white uppercase mt-0.5">{classNameTitle}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Your Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Arjun Kapoor"
              className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Phone Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 00000"
              className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="arjun@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Preferred Date</label>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white focus:outline-none focus:border-[#E91E63] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 transition-all mt-2"
          >
            {loading ? 'Reserving...' : 'Confirm Trial Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};
