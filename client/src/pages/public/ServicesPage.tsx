import React, { useState } from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Footer } from '../../components/public/Footer';
import { FloatingWhatsApp } from '../../components/public/FloatingWhatsApp';
import { ServiceDetailModal } from '../../components/public/modals/ServiceDetailModal';
import { MembershipApplicationModal } from '../../components/public/modals/MembershipApplicationModal';
import { Dumbbell, Activity, Apple, Flame, Award, HeartHandshake, CheckCircle2, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ServicesPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const services = [
    {
      id: 'srv-1',
      title: '1-on-1 Bespoke Personal Training',
      category: 'Coaching',
      icon: Dumbbell,
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800',
      shortDesc: 'Dedicated master strength coaches paired with you for every repetition, form check, and progressive overload cycle.',
      fullDesc: 'Our 1-on-1 coaching program delivers customized periodization engineered around your unique skeletal structure, injury history, and athletic objectives. Includes continuous velocity-based training, video bar-path auditing, and weekly nutritional macro calibrations.',
      deliverables: [
        'Dedicated CSCS/ISSA Certified Master Coach',
        'Custom 12-week progressive overload block',
        'Direct WhatsApp access for daily check-ins',
        'Continuous form correction and injury prevention',
      ],
    },
    {
      id: 'srv-2',
      title: 'Bodybuilding & Hypertrophy Specialization',
      category: 'Hypertrophy',
      icon: Award,
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
      shortDesc: 'Pure muscular development utilizing plate-loaded Arsenal Strength & Prime selectorized equipment with variable resistance cams.',
      fullDesc: 'Engineered for athletes seeking dramatic muscular cross-sectional growth, symmetry, and aesthetic balance. We focus on mechanical tension, metabolic stress, and muscle damage within optimal recovery parameters.',
      deliverables: [
        'Advanced Push/Pull/Legs periodization',
        'Arsenal Strength selectorized machine access',
        'Weekly circumference & skinfold metrics',
        'Intra-workout intra-set recovery protocols',
      ],
    },
    {
      id: 'srv-3',
      title: 'Precision InBody 770 & Biometric Scans',
      category: 'Assessment',
      icon: Activity,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      shortDesc: 'Clinical-grade multi-frequency bioelectrical impedance analysis tracking visceral fat, skeletal muscle mass, and intracellular water.',
      fullDesc: 'Eliminate guesswork from your fitness journey. The InBody 770 provides a medical-grade segmental lean analysis, identifying muscular imbalances between limbs and measuring segmental body fat down to the gram.',
      deliverables: [
        'Full 4-page clinical body composition report',
        'Segmental lean analysis (arms, legs, trunk)',
        'Extracellular water (ECW/TBW) edema tracking',
        'Quarterly re-assessment and strategy calibration',
      ],
    },
    {
      id: 'srv-4',
      title: 'Championship Combat Boxing Arena',
      category: 'Combat',
      icon: Flame,
      image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800',
      shortDesc: 'Full size championship ring, genuine leather heavy bags, speed bags, and striking instruction from national boxing champions.',
      fullDesc: 'Whether you want explosive cardiovascular stamina or legitimate defensive combat proficiency, our boxing arena develops lightning footwork, rotational core torque, and fearless confidence.',
      deliverables: [
        '1-on-1 mitt and focus pad drills',
        'Heavy bag combinations and power output',
        'Footwork, slips, rolls, and counter mechanics',
        'High-density 12-round anaerobic intervals',
      ],
    },
    {
      id: 'srv-5',
      title: 'Contrast Cryotherapy & Infrared Sauna',
      category: 'Recovery',
      icon: HeartHandshake,
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
      shortDesc: 'Finnish cedarwood infrared saunas and 4°C chilled cold plunge tubs for rapid metabolic waste clearance and CNS reboot.',
      fullDesc: 'Elite performance demands elite recovery. Contrast therapy creates a powerful vascular pump, rapidly flushing lactic acid, down-regulating systemic inflammation, and stimulating norepinephrine release for mental clarity.',
      deliverables: [
        'Medical-grade 4°C chilled cold plunge',
        'Full spectrum infrared cedarwood sauna',
        'Eucalyptus infused steam rooms',
        'Guided contrast protocol with breathwork timer',
      ],
    },
    {
      id: 'srv-6',
      title: 'Sports Dietetics & Macronutrient Blueprint',
      category: 'Nutrition',
      icon: Apple,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
      shortDesc: 'Bespoke nutrition charts, caloric targets, nutrient timing schedules, and micronutrient supplementation protocols.',
      fullDesc: 'Training without precision nutrition is running with the brakes on. Our certified sports nutritionists construct flexible meal schedules that sustain grueling workouts while shedding stubborn body fat.',
      deliverables: [
        'Accurate Basal Metabolic Rate (BMR) mapping',
        'Caloric surplus or deficit phase schedules',
        'Pre, intra, and post-workout nutrient timing',
        'Supplement stack recommendations based on bloodwork',
      ],
    },
  ];

  const handleOpenDetail = (srv: any) => {
    setSelectedService(srv);
    setIsServiceModalOpen(true);
  };

  return (
    <div className="bg-[#080811] text-white min-h-screen">
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Hero Banner */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-14 bg-gradient-to-b from-[#10101C] via-[#080811] to-[#080811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E91E63]/15 border border-[#E91E63]/40 text-[#E91E63] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Integrated High-Performance Architecture</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase mb-6">
            WORLD-CLASS <span className="text-gradient">SERVICES</span>
          </h1>
          <p className="text-base sm:text-xl text-[#B8B5C2] max-w-3xl mx-auto leading-relaxed">
            Every service at DemoFit is calibrated to give members a premier training experience. From heavy barbell mechanics to cellular recovery.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#10101C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => {
              const IconComp = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="group rounded-3xl overflow-hidden bg-[#151522] border border-[#E91E63]/25 hover:border-[#E91E63] transition-all duration-300 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Header */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={srv.image}
                        alt={srv.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151522] via-[#151522]/30 to-transparent" />
                      <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-[#080811]/90 backdrop-blur-md border border-[#E91E63]/40 flex items-center justify-center text-[#E91E63] shadow-lg">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#10101C]/90 text-[10px] font-bold uppercase tracking-wider text-gray-300">
                        {srv.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-heading text-2xl font-bold uppercase text-white mb-3 group-hover:text-[#E91E63] transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-[#B8B5C2] leading-relaxed mb-6">
                        {srv.shortDesc}
                      </p>

                      <div className="space-y-2 pt-4 border-t border-gray-800">
                        {srv.deliverables.map((d, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2 text-xs text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#E91E63] shrink-0" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => handleOpenDetail(srv)}
                      className="w-full py-3 rounded-xl bg-[#10101C] border border-[#E91E63]/30 hover:bg-[#E91E63] hover:border-[#E91E63] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>Explore Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VIP Concierge Booking CTA */}
      <section className="py-20 bg-gradient-to-r from-[#151522] via-[#240b1c] to-[#151522] border-t border-[#E91E63]/30 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold uppercase text-white mb-4">
            EXPERIENCE BESPOKE FITNESS
          </h2>
          <p className="text-sm sm:text-base text-[#B8B5C2] max-w-xl mx-auto mb-8">
            Speak directly with our head of athletic performance to map out your private coaching schedule and complimentary initial assessment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white font-bold text-sm uppercase tracking-wider shadow-xl hover:scale-105 transition-all"
            >
              Book Consultation Now
            </button>
            <Link
              to="/pricing"
              className="px-8 py-4 rounded-full bg-[#10101C] border border-[#E91E63]/40 text-white font-semibold text-sm hover:border-[#E91E63] transition-all"
            >
              View Membership Tiers
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />

      <ServiceDetailModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        service={selectedService}
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
      />
      <MembershipApplicationModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
};
