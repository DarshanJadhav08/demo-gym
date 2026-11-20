import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onOpenJoinModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenJoinModal }) => {
  return (
    <section id="home" className="relative min-h-[calc(100vh-80px)] flex items-center pt-20 pb-8 sm:pt-24 sm:pb-12 lg:pt-24 lg:pb-10 overflow-hidden">
      {/* Background Graphic & Atmosphere Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=2200"
          alt="Gym Atmosphere"
          className="w-full h-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080811] via-[#080811]/92 to-[#080811]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080811] via-transparent to-[#080811]/80" />
        {/* Glow ambient spots */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E91E63]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#571638]/25 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151522]/90 border border-[#E91E63]/40 text-[#E91E63] text-xs font-semibold uppercase tracking-wider mb-3 shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premier Gym & Fitness Management Platform (Live Demo)</span>
            </div>

            {/* Main Headline (Matching reference) */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-3 sm:mb-4">
              THE BODY ACHIEVES <br />
              <span className="text-gradient">WHAT THE MIND</span> <br />
              BELIEVES.
            </h1>

            {/* Supporting Description */}
            <p className="text-xs sm:text-sm md:text-base text-[#B8B5C2] max-w-xl mb-5 sm:mb-6 leading-relaxed font-normal">
              Transform your physical potential with Olympic-standard equipment, periodized science-based hypertrophy programs, and master coaches dedicated to forging your ultimate physique.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-6 sm:mb-7">
              <button
                onClick={onOpenJoinModal}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white font-bold text-sm tracking-wide shadow-xl hover:shadow-[#E91E63]/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/programs"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#151522] border border-[#E91E63]/40 text-white font-semibold text-sm hover:bg-[#1f1f33] hover:border-[#E91E63] transition-all duration-300 flex items-center justify-center"
              >
                Explore All Programs
              </Link>
            </div>

            {/* Key feature pills */}
            <div className="pt-4 sm:pt-5 border-t border-gray-800/80 flex flex-wrap gap-4 sm:gap-7">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#151522] border border-[#E91E63]/30 flex items-center justify-center text-[#E91E63]">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xs sm:text-sm">24/7 VIP Access</h4>
                  <p className="text-[11px] text-[#B8B5C2]">Biometric smart entry</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#151522] border border-[#E91E63]/30 flex items-center justify-center text-[#E91E63]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xs sm:text-sm">Master Coaches</h4>
                  <p className="text-[11px] text-[#B8B5C2]">CSCS & ISSA Certified</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#151522] border border-[#E91E63]/30 flex items-center justify-center text-[#E91E63]">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xs sm:text-sm">Eleiko & Arsenal</h4>
                  <p className="text-[11px] text-[#B8B5C2]">Calibrated gear</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Athlete Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              {/* Outer decorative glowing ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#E91E63]/40 to-[#571638]/40 blur-lg opacity-70 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative rounded-3xl overflow-hidden border border-[#E91E63]/40 bg-[#151522] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=900"
                  alt="Elite Male Bodybuilder Training"
                  className="w-full h-[320px] sm:h-[380px] lg:h-[420px] object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080811] via-transparent to-transparent opacity-80" />

                {/* Floating Athlete Badge overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-[#10101C]/85 backdrop-blur-md border border-[#E91E63]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#E91E63] tracking-wider">Demo Athlete Profile</span>
                    <h3 className="text-white font-heading text-sm font-bold">Alex Rivera — Demo Head Coach</h3>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-[#E91E63] text-white text-[11px] font-bold">
                    DEMO PRO
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
