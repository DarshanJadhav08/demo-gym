import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotification();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      error('Invalid Email', 'Please provide a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.subscribeNewsletter(email);
      success('Subscribed!', res.message);
      setEmail('');
    } catch (err: any) {
      error('Subscription Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-[#080811] border-t border-gray-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title (Matching reference screenshot: Subscribe us) */}
        <span className="text-[#E91E63] text-xs font-semibold uppercase tracking-widest block mb-2 font-heading">
          Exclusive Perks
        </span>
        <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight mb-3">
          Subscribe Us
        </h2>
        <p className="text-xs sm:text-sm text-[#B8B5C2] max-w-md mx-auto mb-8">
          Subscribe to our newsletter to get VIP workout routines, discount offers, and nutritional science updates directly to your inbox.
        </p>

        {/* Input Bar (Matching reference: Enter your email with pink send button) */}
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex items-center bg-[#151522] rounded-full p-1.5 border border-[#E91E63]/40 focus-within:border-[#E91E63] shadow-xl">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 bg-transparent px-5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            aria-label="Subscribe"
            className="w-11 h-11 rounded-full bg-gradient-to-r from-[#A51C55] to-[#E91E63] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 shadow-lg"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </section>
  );
};
