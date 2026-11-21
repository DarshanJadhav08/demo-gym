import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Dumbbell, UserCheck } from 'lucide-react';

interface ProgramsSectionProps {
  programs: any[];
  onOpenJoinModal: (planId?: string) => void;
  onSelectProgram: (program: any) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({
  programs,
  onOpenJoinModal,
  onSelectProgram,
}) => {
  // Default programs if backend is loading or empty
  const defaultPrograms = [
    {
      title: 'Qualified Coaches',
      category: 'GYM',
      description: 'Do you want to become a professional powerlifter just right now? We provide the best coaches on the market to guarantee 100% positive effect for our customers.',
      image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600',
      duration: '12 Weeks',
      difficulty: 'All Levels',
    },
    {
      title: 'Fitness Equipment',
      category: 'YOGA',
      description: 'Train with calibrated Eleiko bars, custom dumbbell racks up to 70kg, and high-precision cable systems engineered for maximum biomechanical efficiency.',
      image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600',
      duration: 'Ongoing',
      difficulty: 'All Levels',
    },
    {
      title: 'Individual Approach',
      category: 'BOXING',
      description: 'Every body is built differently. We engineer customized training protocols around your specific limb proportions, recovery rate, and athletic goals.',
      image_url: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=600',
      duration: '16 Weeks',
      difficulty: 'Intermediate',
    },
  ];

  const displayPrograms = programs && programs.length > 0 ? programs : defaultPrograms;

  return (
    <section id="programs" className="py-16 sm:py-20 bg-[#080811] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Matching reference: Make You Grow With Our Program) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <span className="text-[#E91E63] text-sm font-semibold uppercase tracking-widest block mb-2 font-heading">
              Our Core Methodology
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight">
              Make You Grow <br />
              <span className="text-gradient">With Our Program</span>
            </h2>
          </div>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#151522] border border-[#E91E63]/30 text-white text-xs font-bold uppercase tracking-wider hover:border-[#E91E63] hover:bg-[#E91E63] transition-all shrink-0"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Featured Program Cards (Matching reference layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {displayPrograms.slice(0, 3).map((prog, idx) => {
            const fallbackItem = defaultPrograms[idx % defaultPrograms.length];
            const programImage = prog.image_url || prog.image || fallbackItem.image_url;
            const programCategory = prog.category || 'PROGRAM';
            const programDesc = prog.description || fallbackItem.description;

            return (
              <div
                key={prog.id || idx}
                className="bg-[#151522] rounded-2xl overflow-hidden border border-[#E91E63]/30 hover:border-[#E91E63] transition-all duration-300 hover:-translate-y-1.5 group shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-900">
                    <img
                      src={programImage}
                      alt={prog.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackItem.image_url;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151522] via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded bg-[#E91E63] text-white text-[11px] font-bold uppercase tracking-wider">
                        {programCategory}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2.5 group-hover:text-[#E91E63] transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#B8B5C2] leading-relaxed line-clamp-3 mb-5">
                      {programDesc}
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-gray-800/60 flex items-center justify-between">
                  <button
                    onClick={() => onSelectProgram(prog)}
                    className="text-xs sm:text-sm font-semibold text-[#E91E63] hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenJoinModal()}
                    className="px-3.5 py-1.5 rounded-lg bg-[#E91E63]/20 border border-[#E91E63]/40 text-xs text-white hover:bg-[#E91E63] transition-colors font-semibold"
                  >
                    Join Program
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
