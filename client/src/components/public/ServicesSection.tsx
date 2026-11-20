import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Flame, HeartPulse, Activity, Utensils, Zap, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  onOpenJoinModal: () => void;
  onSelectService: (service: any) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenJoinModal, onSelectService }) => {
  // Services matching reference screenshots: YOGA, BODYBUILDING, FITNESS, BOXING
  const services = [
    {
      title: 'Yoga & Mobility',
      slug: 'yoga',
      icon: HeartPulse,
      description: 'We tend to provide the best service market guarantee 100% positive effect for our customers.',
      fullDesc: 'Deep fascia release, joint restoration, active mobility, and breathwork specifically developed to counteract heavy barbell loading and prevent sports injuries.',
    },
    {
      title: 'Bodybuilding',
      slug: 'bodybuilding',
      icon: Dumbbell,
      description: 'We tend to provide the best service market guarantee 100% positive effect for our customers.',
      fullDesc: 'Hypertrophy protocols combining mechanical tension, high motor unit recruitment, and calculated progressive overload for competitive or aesthetic physiques.',
    },
    {
      title: 'Fitness Assessment',
      slug: 'fitness',
      icon: Activity,
      description: 'We tend to provide the best service market guarantee 100% positive effect for our customers.',
      fullDesc: 'Multi-frequency bioimpedance body composition scans, posture analysis, VO2 max endurance tests, and customized metabolic baseline assessments.',
    },
    {
      title: 'Boxing & Combat',
      slug: 'boxing',
      icon: Flame,
      description: 'We tend to provide the best service market guarantee 100% positive effect for our customers.',
      fullDesc: 'High-intensity heavy bag rounds, punch biomechanics, rapid footwork drills, and core conditioning designed to forge explosive athletic stamina.',
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-20 bg-[#10101C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading & Background Athlete Visual */}
          <div className="lg:col-span-5">
            <span className="text-[#E91E63] text-sm font-semibold uppercase tracking-widest block mb-2 font-heading">
              Our Capabilities
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 uppercase">
              Services <br />
              <span className="text-gradient">For You</span>
            </h2>
            <p className="text-[#B8B5C2] text-sm sm:text-base leading-relaxed mb-6">
              Clients of our gym receive not only necessary equipment for their workouts but also friendly support in achieving their dream physique in record time.
            </p>
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <button
                onClick={onOpenJoinModal}
                className="px-7 py-3 rounded-full bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold text-sm tracking-wide shadow-xl hover:shadow-[#E91E63]/40 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Join Us
              </button>
              <Link
                to="/services"
                className="px-6 py-3 rounded-full bg-[#151522] border border-[#E91E63]/30 text-white font-semibold text-sm hover:border-[#E91E63] transition-all"
              >
                Explore All Services
              </Link>
            </div>

            {/* Visual Athlete Image */}
            <div className="rounded-2xl overflow-hidden border border-[#E91E63]/25 shadow-xl hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=700"
                alt="Personal Training Service"
                className="w-full h-48 object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: 4 Service Cards Grid (Matching reference 2x2 grid with red icons) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {services.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.slug}
                  className="p-6 sm:p-7 rounded-2xl bg-[#151522] border border-[#E91E63]/30 hover:border-[#E91E63] transition-all duration-300 group shadow-lg flex flex-col justify-between"
                >
                  <div>
                    {/* Glowing Outline Icon (Matching reference screenshot) */}
                    <div className="w-12 h-12 rounded-xl bg-[#10101C] border border-[#E91E63]/40 flex items-center justify-center text-[#E91E63] mb-5 group-hover:bg-[#E91E63] group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-white mb-2 uppercase tracking-wide group-hover:text-[#E91E63] transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#B8B5C2] leading-relaxed mb-5">
                      {srv.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectService(srv)}
                    className="text-xs font-bold text-[#E91E63] group-hover:text-white flex items-center gap-1 transition-colors uppercase tracking-wider"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
