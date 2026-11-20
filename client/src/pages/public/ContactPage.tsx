import React, { useState } from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Footer } from '../../components/public/Footer';
import { FloatingWhatsApp } from '../../components/public/FloatingWhatsApp';
import { Phone, Mail, MapPin, Clock, Send, Sparkles, CheckCircle2, MessageSquare, ChevronDown } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const ContactPage: React.FC = () => {
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    program_interest: 'General Membership',
    message: '',
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.phone) {
      error('Missing Information', 'Please fill in your name, email, and mobile number.');
      return;
    }

    try {
      setLoading(true);
      await api.submitEnquiry({
        ...formData,
        source: 'Contact Page Form',
      });
      success('Message Received!', 'Our concierge team will contact you within 2 business hours.');
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        program_interest: 'General Membership',
        message: '',
      });
    } catch (err: any) {
      error('Submission Error', err.message || 'Could not send message.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'Do you offer a free trial pass before signing up?',
      a: 'Yes! We offer a complimentary 1-day VIP pass for prospective members so you can experience our Olympic platforms, machines, and contrast saunas with zero obligation.',
    },
    {
      q: 'Is private parking available at the facility?',
      a: 'Yes, DemoFit provides dedicated multi-level valet and covered member parking with 24/7 security surveillance and EV charging bays.',
    },
    {
      q: 'What are the operating hours for general members vs VIP members?',
      a: 'Standard operating hours are Mon–Sat from 05:00 AM to 11:00 PM, and Sundays from 07:00 AM to 08:00 PM. Apex Black VIP members receive 24/7 unhindered biometric smart key access.',
    },
    {
      q: 'Are personal training sessions included in the membership?',
      a: 'All memberships include an initial comprehensive biomechanical assessment and InBody 770 scan. Dedicated personal training blocks can be bundled into your package or booked individually.',
    },
    {
      q: 'Can I freeze or pause my membership if I travel?',
      a: 'Yes. Annual and Gold members can pause their memberships for up to 60 days per year with zero penalties simply by notifying the member concierge desk.',
    },
  ];

  return (
    <div className="bg-[#080811] text-white min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-14 bg-gradient-to-b from-[#10101C] via-[#080811] to-[#080811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E91E63]/15 border border-[#E91E63]/40 text-[#E91E63] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Member Concierge & Admissions</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase mb-6">
            GET IN <span className="text-gradient">TOUCH</span>
          </h1>
          <p className="text-base sm:text-xl text-[#B8B5C2] max-w-3xl mx-auto leading-relaxed">
            Have questions about memberships, private coaching, corporate partnerships, or scheduling a facility walkthrough? Our concierge team is at your disposal.
          </p>
        </div>
      </section>

      {/* 4 Info Badges */}
      <section className="py-12 bg-[#10101C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/25 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#E91E63]/15 border border-[#E91E63]/40 flex items-center justify-center text-[#E91E63] mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-lg font-bold uppercase text-white mb-1">Direct Call</h4>
              <p className="text-xs text-[#B8B5C2]">+91 98765 43210</p>
              <p className="text-xs text-[#B8B5C2]">+91 98765 01234</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/25 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#E91E63]/15 border border-[#E91E63]/40 flex items-center justify-center text-[#E91E63] mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-lg font-bold uppercase text-white mb-1">Email Inquiries</h4>
              <p className="text-xs text-[#B8B5C2]">contact@apexelite.com</p>
              <p className="text-xs text-[#B8B5C2]">membership@apexelite.com</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/25 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#E91E63]/15 border border-[#E91E63]/40 flex items-center justify-center text-[#E91E63] mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-lg font-bold uppercase text-white mb-1">Facility Address</h4>
              <p className="text-xs text-[#B8B5C2]">700 Olympus Boulevard</p>
              <p className="text-xs text-[#B8B5C2]">BKC, Mumbai 400051</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/25 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#E91E63]/15 border border-[#E91E63]/40 flex items-center justify-center text-[#E91E63] mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-lg font-bold uppercase text-white mb-1">Hours of Power</h4>
              <p className="text-xs text-[#B8B5C2]">Mon–Sat: 05:00 AM – 11:00 PM</p>
              <p className="text-xs text-[#B8B5C2]">24/7 Access for VIP Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form & Map Section */}
      <section className="py-20 bg-[#080811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Form */}
            <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#151522] border border-[#E91E63]/30 shadow-2xl">
              <h3 className="font-heading text-3xl font-bold uppercase text-white mb-2">
                SEND US AN INQUIRY
              </h3>
              <p className="text-xs text-[#B8B5C2] mb-8">
                Fill out the details below and an admissions advisor will respond swiftly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="e.g. Vikram Singhania"
                      className="w-full px-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#E91E63]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="vikram@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#E91E63]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#E91E63]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                      Primary Interest
                    </label>
                    <select
                      value={formData.program_interest}
                      onChange={(e) => setFormData({ ...formData, program_interest: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#E91E63]"
                    >
                      <option value="General Membership">General Membership</option>
                      <option value="Apex Black VIP">Apex Black VIP</option>
                      <option value="1-on-1 Personal Training">1-on-1 Personal Training</option>
                      <option value="Men's Strength Class">Men's Strength Class</option>
                      <option value="Women's Sculpt Class">Women's Sculpt Class</option>
                      <option value="Boxing & Combat">Boxing & Combat</option>
                      <option value="Contrast Cryo & Sauna">Contrast Cryo & Sauna</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                    Your Goals or Questions
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your fitness targets, schedule availability, or questions..."
                    className="w-full px-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#E91E63]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 hover:scale-[1.01] active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Inquiry to Concierge</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Facility Highlights */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="rounded-3xl overflow-hidden border border-[#E91E63]/30 shadow-2xl relative flex-1 min-h-[300px]">
                <iframe
                  title="Apex Elite Facility Map"
                  className="w-full h-full min-h-[300px] border-0 grayscale contrast-125 opacity-85"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8020610996384!2d72.825833!3d19.028333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAxJzQyLjAiTiA3MsKwNDknMzMuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 p-3 rounded-2xl bg-[#10101C]/90 backdrop-blur-md border border-[#E91E63]/40 text-xs">
                  <span className="font-bold text-white block">DemoFit Club Arena</span>
                  <span className="text-[#B8B5C2]">Commercial Zone, Metro City</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#151522] border border-gray-800 space-y-3 text-xs">
                <h4 className="font-heading text-lg font-bold uppercase text-white">Facility Amenities</h4>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#E91E63]" />
                  <span>Complimentary Member Valet Parking</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#E91E63]" />
                  <span>Keyless Biometric RFID Smart Lockers</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#E91E63]" />
                  <span>Executive Business Lounge & Protein Bar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-[#10101C] border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest block mb-2 font-heading">
              Frequently Asked Questions
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-white">
              COMMON INQUIRIES
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#151522] border border-gray-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-[#E91E63] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-[#E91E63]' : 'text-gray-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-[#B8B5C2] leading-relaxed border-t border-gray-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};
