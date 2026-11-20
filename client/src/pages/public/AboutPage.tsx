import React, { useState } from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Footer } from '../../components/public/Footer';
import { FloatingWhatsApp } from '../../components/public/FloatingWhatsApp';
import { FreePassModal } from '../../components/public/FreePassModal';
import { MembershipApplicationModal } from '../../components/public/modals/MembershipApplicationModal';
import { CheckCircle2, Award, Users, Dumbbell, ShieldCheck, Flame, ArrowRight, Sparkles, Target, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  return (
    <div className="bg-[#080811] text-white min-h-screen">
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Page Hero Header */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-14 overflow-hidden bg-gradient-to-b from-[#10101C] via-[#080811] to-[#080811]">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=2000"
            alt="Apex Elite Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080811] via-[#080811]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E91E63]/15 border border-[#E91E63]/40 text-[#E91E63] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Performance Gym Platform (Live Client Demo)</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase mb-6">
            ABOUT <span className="text-gradient">DEMOFIT</span> FITNESS CLUB
          </h1>
          <p className="text-base sm:text-xl text-[#B8B5C2] max-w-3xl mx-auto leading-relaxed">
            A comprehensive, client-ready gym website and operational management system engineered for high-performance fitness centers.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#E91E63] font-semibold">About Us</span>
          </div>
        </div>
      </section>

      {/* Origin Story & Philosophy */}
      <section className="py-20 bg-[#10101C] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest block mb-2 font-heading">
                Our Genesis & Ethos
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase mb-6 leading-tight">
                BUILT BY LIFTERS, <br />
                <span className="text-gradient">ENGINEERED FOR EXCELLENCE</span>
              </h2>
              <p className="text-[#B8B5C2] text-sm sm:text-base leading-relaxed mb-6">
                Apex Elite was born in response to overcrowded commercial fitness centers with broken machinery and indifferent personal training. We set out to design a 30,000 square foot architectural sanctuary where scientific biomechanics meets raw grit.
              </p>
              <p className="text-[#B8B5C2] text-sm sm:text-base leading-relaxed mb-8">
                From calibrated Eleiko competition barbells and Arsenal Strength plate-loaded equipment to medical-grade contrast cryotherapy and biometric DXA scans, every inch of Apex Elite is curated to deliver tangible, rapid body transformations.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E91E63]/15 border border-[#E91E63]/30 flex items-center justify-center text-[#E91E63] shrink-0 mt-0.5">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Outcome Driven</h4>
                    <p className="text-xs text-[#B8B5C2] mt-0.5">Every rep, set, and calorie is tracked and evaluated.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E91E63]/15 border border-[#E91E63]/30 flex items-center justify-center text-[#E91E63] shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Elite Coaching</h4>
                    <p className="text-xs text-[#B8B5C2] mt-0.5">100% accredited master coaches with CSCS & USAW.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#E91E63]/30 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1000"
                  alt="Apex Elite Coaching"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080811] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#10101C]/90 backdrop-blur-md border border-[#E91E63]/30">
                  <span className="text-[10px] text-[#E91E63] font-bold uppercase tracking-wider block">Exclusive Facility</span>
                  <p className="text-white font-heading text-lg font-bold">Olympic Calibrated Platforms & 24/7 Biometric Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Performance Pillars */}
      <section className="py-20 bg-[#080811] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest block mb-2 font-heading">
              The 4 Core Pillars
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase">
              THE SCIENCE BEHIND THE PHYSIQUE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-[#151522] border border-[#E91E63]/25 hover:border-[#E91E63] transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E91E63] to-[#571638] flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold uppercase text-white mb-3">1. Biomechanical Load</h3>
              <p className="text-xs text-[#B8B5C2] leading-relaxed">
                Optimized resistance profiles that align with human muscle leverage, preventing joint degradation while maximizing hypertrophy.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#151522] border border-[#E91E63]/25 hover:border-[#E91E63] transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E91E63] to-[#571638] flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold uppercase text-white mb-3">2. Periodized Programming</h3>
              <p className="text-xs text-[#B8B5C2] leading-relaxed">
                Structured progressive overload phases designed to shatter strength plateaus and foster continuous neuromuscular adaptation.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#151522] border border-[#E91E63]/25 hover:border-[#E91E63] transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E91E63] to-[#571638] flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold uppercase text-white mb-3">3. Precision Nutrition</h3>
              <p className="text-xs text-[#B8B5C2] leading-relaxed">
                Individualized macronutrient targets calibrated against active basal expenditure and body composition scans.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#151522] border border-[#E91E63]/25 hover:border-[#E91E63] transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E91E63] to-[#571638] flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold uppercase text-white mb-3">4. Regenerative Contrast</h3>
              <p className="text-xs text-[#B8B5C2] leading-relaxed">
                Infrared Finnish saunas and 4°C cold plunge tubs to rapidly flush lactic acid, restore parasympathetic tone, and supercharge recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Zones Grid */}
      <section className="py-20 bg-[#10101C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest block mb-2 font-heading">
              World-Class Infrastructure
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase">
              EXPLORE OUR ARCHITECTURAL ZONES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group rounded-3xl overflow-hidden bg-[#151522] border border-gray-800 hover:border-[#E91E63] transition-all">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800"
                  alt="Heavy Iron Zone"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151522] via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold uppercase text-white mb-2">Heavy Iron Arena</h3>
                <p className="text-xs text-[#B8B5C2] leading-relaxed">
                  Calibrated Eleiko competition discs, custom monolifts, and dumbbells up to 80kg for serious strength athletes.
                </p>
              </div>
            </div>

            <div className="group rounded-3xl overflow-hidden bg-[#151522] border border-gray-800 hover:border-[#E91E63] transition-all">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800"
                  alt="Combat & Boxing Zone"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151522] via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold uppercase text-white mb-2">Combat Ring & Turf</h3>
                <p className="text-xs text-[#B8B5C2] leading-relaxed">
                  Championship boxing ring, leather heavy bags, and a 40-meter indoor sprint turf for sled pushes and athletic agility.
                </p>
              </div>
            </div>

            <div className="group rounded-3xl overflow-hidden bg-[#151522] border border-gray-800 hover:border-[#E91E63] transition-all">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800"
                  alt="Recovery Spa"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151522] via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold uppercase text-white mb-2">Contrast Recovery Spa</h3>
                <p className="text-xs text-[#B8B5C2] leading-relaxed">
                  Cedarwood infrared sauna, eucalyptus steam chambers, and chilled contrast plunge tubs for accelerated muscular recovery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#10101C] via-[#240b1c] to-[#10101C] border-y border-[#E91E63]/30">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl sm:text-6xl font-bold uppercase text-white mb-6">
            READY TO JOIN THE ELITE?
          </h2>
          <p className="text-base text-[#B8B5C2] max-w-xl mx-auto mb-8">
            Take the first step. Experience the facility with a complimentary 1-day pass or apply directly for exclusive membership.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white font-bold text-sm tracking-wide shadow-xl hover:scale-105 transition-all"
            >
              Apply For Membership
            </button>
            <button
              onClick={() => setIsPassModalOpen(true)}
              className="px-8 py-4 rounded-full bg-[#151522] border border-[#E91E63]/40 text-white font-semibold text-sm hover:border-[#E91E63] transition-all"
            >
              Claim Free 1-Day Pass
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />

      <MembershipApplicationModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
      <FreePassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />
    </div>
  );
};
