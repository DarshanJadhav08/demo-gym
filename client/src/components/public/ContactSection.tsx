import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const ContactSection: React.FC = () => {
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    program_interest: 'General Membership',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.phone) {
      error('Missing fields', 'Please enter your name, email, and phone number.');
      return;
    }

    try {
      setLoading(true);
      await api.submitEnquiry({
        ...formData,
        source: 'Contact Form',
      });
      success('Message Received!', 'Our gym advisor will get in touch with you shortly.');
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        program_interest: 'General Membership',
        message: '',
      });
    } catch (err: any) {
      error('Submission Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-[#10101C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Info Row (Matching reference screenshot: CALL US, MAIL US, LOCATION, HOURS) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-14">
          {/* CALL US */}
          <div className="p-6 rounded-2xl bg-[#151522] border border-[#E91E63]/25 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[#E91E63]/15 border border-[#E91E63]/40 flex items-center justify-center text-[#E91E63] mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h4 className="font-heading text-lg font-bold text-white uppercase tracking-wider mb-2">CALL US</h4>
            <p className="text-xs text-[#B8B5C2] leading-relaxed">+91 99999 00000</p>
            <p className="text-xs text-[#B8B5C2] leading-relaxed">+91 98888 11111</p>
          </div>

          {/* MAIL US */}
          <div className="p-6 rounded-2xl bg-[#151522] border border-[#E91E63]/25 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[#E91E63]/15 border border-[#E91E63]/40 flex items-center justify-center text-[#E91E63] mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="font-heading text-lg font-bold text-white uppercase tracking-wider mb-2">MAIL US</h4>
            <p className="text-xs text-[#B8B5C2] leading-relaxed">demo@gymdemo.com</p>
            <p className="text-xs text-[#B8B5C2] leading-relaxed">info@gymdemo.com</p>
          </div>

          {/* LOCATION */}
          <div className="p-6 rounded-2xl bg-[#151522] border border-[#E91E63]/25 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[#E91E63]/15 border border-[#E91E63]/40 flex items-center justify-center text-[#E91E63] mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="font-heading text-lg font-bold text-white uppercase tracking-wider mb-2">LOCATION</h4>
            <p className="text-xs text-[#B8B5C2] leading-relaxed">Plot No. 101, Demo Gym Hub</p>
            <p className="text-xs text-[#B8B5C2] leading-relaxed">Commercial Sector, Metro City</p>
          </div>

          {/* HOURS */}
          <div className="p-6 rounded-2xl bg-[#151522] border border-[#E91E63]/25 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[#E91E63]/15 border border-[#E91E63]/40 flex items-center justify-center text-[#E91E63] mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-heading text-lg font-bold text-white uppercase tracking-wider mb-2">HOURS</h4>
            <p className="text-xs text-[#B8B5C2] leading-relaxed">Mon - Sat: 06:00 - 22:00</p>
            <p className="text-xs text-[#B8B5C2] leading-relaxed">Sun: 07:00 - 20:00 (Demo)</p>
          </div>
        </div>

        {/* Contact Form & Google Map Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Form */}
          <div className="lg:col-span-7 bg-[#151522] rounded-3xl p-8 sm:p-10 border border-[#E91E63]/30 shadow-xl">
            <span className="text-[#E91E63] text-xs font-semibold uppercase tracking-widest block mb-2 font-heading">
              Have Questions?
            </span>
            <h3 className="font-heading text-3xl font-bold text-white mb-6 uppercase">
              Get in Touch With Our Head Coaches
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Program Interest
                  </label>
                  <select
                    value={formData.program_interest}
                    onChange={(e) => setFormData({ ...formData, program_interest: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white focus:outline-none focus:border-[#E91E63] text-sm"
                  >
                    <option value="General Membership">General Membership</option>
                    <option value="Personal Training">1-on-1 Personal Training</option>
                    <option value="Men Class">Men Class (Strength)</option>
                    <option value="Women Class">Women Class (Sculpt)</option>
                    <option value="Boxing">Boxing Conditioning</option>
                    <option value="Yoga">Yoga & Mobility</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Your Message or Fitness Goal
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you want to achieve..."
                  className="w-full px-4 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#E91E63] text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 hover:scale-[1.02] active:scale-98 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Apex Elite</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Map Preview */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-[#E91E63]/30 shadow-xl bg-[#151522] relative min-h-[350px]">
            <iframe
              title="Gym Location Map"
              className="w-full h-full min-h-[350px] border-0 grayscale contrast-125 opacity-85"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8020610996384!2d72.825833!3d19.028333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAxJzQyLjAiTiA3MsKwNDknMzMuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              loading="lazy"
            />
            <div className="absolute top-4 left-4 p-3 rounded-xl bg-[#10101C]/90 backdrop-blur-md border border-[#E91E63]/40 text-xs">
              <span className="font-bold text-white block">Apex Elite Arena</span>
              <span className="text-[#B8B5C2]">Band-Kurla Complex, Mumbai</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
