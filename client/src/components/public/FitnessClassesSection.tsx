import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, Flame } from 'lucide-react';

interface FitnessClassesSectionProps {
  onOpenBookClass: (className: string) => void;
}

export const FitnessClassesSection: React.FC<FitnessClassesSectionProps> = ({ onOpenBookClass }) => {
  return (
    <section id="classes" className="py-16 sm:py-20 bg-[#10101C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <span className="text-[#E91E63] text-sm font-semibold uppercase tracking-widest block mb-2 font-heading">
              Targeted Fitness Disciplines
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase">
              Specialized <span className="text-gradient">Training Classes</span>
            </h2>
          </div>
          <Link
            to="/classes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#151522] border border-[#E91E63]/30 text-white text-xs font-bold uppercase tracking-wider hover:border-[#E91E63] hover:bg-[#E91E63] transition-all shrink-0"
          >
            <span>View Full Schedule Grid</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Highlighted Split Cards (Matching reference: Men Class and Women Class) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Men Class Card */}
          <div className="relative rounded-3xl overflow-hidden bg-[#151522] border border-[#E91E63]/30 hover:border-[#E91E63] transition-all duration-300 p-8 flex flex-col justify-between group shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-6 z-10">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-[#E91E63]/40 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=400"
                  alt="Men Class Strength Training"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <span className="px-3 py-1 rounded bg-[#E91E63]/20 text-[#E91E63] text-xs font-bold uppercase tracking-wider">
                  Power & Density
                </span>
                <h3 className="font-heading text-3xl font-bold text-white mt-2 mb-2">
                  Men Class
                </h3>
                <p className="text-sm text-[#B8B5C2] leading-relaxed">
                  We have a philosophy when it comes to fitness: we believe in teaching people the importance of progressive strength overload and physical longevity.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800/80 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-4 h-4 text-[#E91E63]" />
                <span>Mon/Wed/Fri 07:00 AM & 06:00 PM</span>
              </div>
              <button
                onClick={() => onOpenBookClass('Men Class')}
                className="px-5 py-2 rounded-full bg-[#151522] border border-[#E91E63]/50 text-white text-xs font-semibold hover:bg-[#E91E63] transition-all duration-300"
              >
                View More
              </button>
            </div>
          </div>

          {/* Women Class Card */}
          <div className="relative rounded-3xl overflow-hidden bg-[#151522] border border-[#E91E63]/30 hover:border-[#E91E63] transition-all duration-300 p-8 flex flex-col justify-between group shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-6 z-10">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-[#E91E63]/40 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400"
                  alt="Women Class Strength & Tone"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <span className="px-3 py-1 rounded bg-[#E91E63]/20 text-[#E91E63] text-xs font-bold uppercase tracking-wider">
                  Sculpt & Conditioning
                </span>
                <h3 className="font-heading text-3xl font-bold text-white mt-2 mb-2">
                  Women Class
                </h3>
                <p className="text-sm text-[#B8B5C2] leading-relaxed">
                  The Women's Program is a female-coached athletic strength and conditioning protocol that focuses on posterior chain strength and metabolic conditioning.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800/80 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-4 h-4 text-[#E91E63]" />
                <span>Tue/Thu/Sat 08:00 AM & 05:00 PM</span>
              </div>
              <button
                onClick={() => onOpenBookClass('Women Class')}
                className="px-5 py-2 rounded-full bg-[#151522] border border-[#E91E63]/50 text-white text-xs font-semibold hover:bg-[#E91E63] transition-all duration-300"
              >
                View More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
