import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Award, Users, Dumbbell, Play, X, Shield } from 'lucide-react';

interface AboutSectionProps {
  onOpenVideoModal?: () => void;
  onOpenJoinModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenVideoModal, onOpenJoinModal }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handlePlayClick = () => {
    if (onOpenVideoModal) {
      onOpenVideoModal();
    }
    setIsVideoModalOpen(true);
  };

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-20 bg-[#10101C] relative overflow-hidden">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#E91E63_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading, Checklist, Counters (Matching reference: A Place For Your Fitness Goal) */}
          <div className="lg:col-span-6">
            <span className="text-[#E91E63] text-sm font-semibold uppercase tracking-widest block mb-2 font-heading">
              A Place For Your Fitness Goal
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              ELEVATE YOUR STANDARD. <br />
              <span className="text-gradient">CRUSH EVERY PLATEAU.</span>
            </h2>
            <p className="text-[#B8B5C2] text-sm sm:text-base leading-relaxed mb-6">
              Physical fitness is a state of health and well-being, specifically the ability to perform aspects of sports, occupations, and daily activities with supreme vitality. At Apex Elite, we blend high-grade equipment with world-class coaching.
            </p>

            {/* Checklist */}
            <div className="space-y-2.5 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E91E63] shrink-0" />
                <span className="text-white font-medium text-sm sm:text-base">Best Fitness & Resistance Exercises</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E91E63] shrink-0" />
                <span className="text-white font-medium text-sm sm:text-base">Achieve Specific Body Recomposition Goals</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E91E63] shrink-0" />
                <span className="text-white font-medium text-sm sm:text-base">Dedicated Personal Trainers & Biomechanic Audits</span>
              </div>
            </div>

            {/* Counter Badges (Matching reference: 2250+ Peoples Trained, 520+ Expert Trainers, 520+ Fitness Equipments) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-7">
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#151522] border border-[#E91E63]/25 text-center hover:border-[#E91E63] transition-colors">
                <Users className="w-5 h-5 text-[#E91E63] mx-auto mb-1.5" />
                <h4 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-white">2250+</h4>
                <p className="text-[11px] sm:text-xs text-[#B8B5C2] mt-0.5">People Trained</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#151522] border border-[#E91E63]/25 text-center hover:border-[#E91E63] transition-colors">
                <Award className="w-5 h-5 text-[#E91E63] mx-auto mb-1.5" />
                <h4 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-white">520+</h4>
                <p className="text-[11px] sm:text-xs text-[#B8B5C2] mt-0.5">Expert Trainers</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#151522] border border-[#E91E63]/25 text-center hover:border-[#E91E63] transition-colors">
                <Dumbbell className="w-5 h-5 text-[#E91E63] mx-auto mb-1.5" />
                <h4 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-white">520+</h4>
                <p className="text-[11px] sm:text-xs text-[#B8B5C2] mt-0.5">Equipment</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                to="/about"
                className="px-6 py-2.5 rounded-full bg-[#E91E63] text-white text-sm font-semibold hover:bg-[#d81557] transition-colors shadow-lg"
              >
                Learn More About Apex
              </Link>
              <button
                onClick={onOpenJoinModal}
                className="px-6 py-2.5 rounded-full bg-[#151522] border border-[#E91E63]/40 text-white text-sm font-semibold hover:border-[#E91E63] transition-colors"
              >
                Join Now
              </button>
            </div>
          </div>

          {/* Right Column: High Quality Gym Video / Photo Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden bg-[#151522] border border-[#E91E63]/30 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=900"
                alt="Gym Showcase Training"
                className="w-full h-[380px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080811] via-transparent to-transparent opacity-80" />

              {/* Glowing Interactive Play Button (Matching reference) */}
              <button
                onClick={handlePlayClick}
                aria-label="Play Gym Video Tour"
                className="absolute inset-0 m-auto w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#A51C55] to-[#E91E63] flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group-hover:glow-accent"
              >
                <Play className="w-8 h-8 fill-white ml-1 text-white" />
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-semibold text-[#E91E63] uppercase tracking-wider">Cinematic Tour</span>
                <h3 className="text-white text-xl font-bold font-heading">Explore The Apex Elite Arena</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#151522] rounded-2xl overflow-hidden border border-[#E91E63]/40 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 bg-[#10101C] border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#E91E63]" />
                <span className="text-white font-semibold text-sm">Apex Elite | Official High-Performance Tour</span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative pt-[56.25%] bg-black">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube-nocookie.com/embed/eaRQF-7hhmo?autoplay=1&rel=0&modestbranding=1"
                title="Apex Elite Fitness Showcase"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
