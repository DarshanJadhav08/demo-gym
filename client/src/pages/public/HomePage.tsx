import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/public/Navbar';
import { HeroSection } from '../../components/public/HeroSection';
import { AboutSection } from '../../components/public/AboutSection';
import { ProgramsSection } from '../../components/public/ProgramsSection';
import { FitnessClassesSection } from '../../components/public/FitnessClassesSection';
import { VideoShowcaseSection } from '../../components/public/VideoShowcaseSection';
import { ServicesSection } from '../../components/public/ServicesSection';
import { PricingSection } from '../../components/public/PricingSection';
import { TestimonialsSection } from '../../components/public/TestimonialsSection';
import { GallerySection } from '../../components/public/GallerySection';
import { ContactSection } from '../../components/public/ContactSection';
import { NewsletterSection } from '../../components/public/NewsletterSection';
import { Footer } from '../../components/public/Footer';
import { MembershipApplicationModal } from '../../components/public/modals/MembershipApplicationModal';
import { BookSessionModal } from '../../components/public/modals/BookSessionModal';
import { ServiceDetailModal } from '../../components/public/modals/ServiceDetailModal';
import { BmiCalculatorModal } from '../../components/public/BmiCalculatorModal';
import { FreePassModal } from '../../components/public/FreePassModal';
import { FloatingWhatsApp } from '../../components/public/FloatingWhatsApp';
import { Calculator, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export const HomePage: React.FC = () => {
  const [homeData, setHomeData] = useState<any>({
    programs: [],
    classes: [],
    services: [],
    testimonials: [],
    gallery: [],
    trainers: [],
    membershipPlans: [],
  });

  // Modal states
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(undefined);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookingClassTitle, setBookingClassTitle] = useState('General Session');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isBmiModalOpen, setIsBmiModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getHomeData();
        setHomeData(data);
      } catch (err) {
        console.error('Failed to load home data from API:', err);
      }
    };
    loadData();
  }, []);

  const handleOpenJoinModal = (planId?: string) => {
    setSelectedPlanId(planId);
    setIsJoinModalOpen(true);
  };

  const handleOpenBookClass = (classTitle: string) => {
    setBookingClassTitle(classTitle);
    setIsBookModalOpen(true);
  };

  const handleSelectService = (service: any) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleSelectProgram = (program: any) => {
    setSelectedService({
      title: program.title,
      description: program.description,
      fullDesc: `${program.description} Duration: ${program.duration || '12 Weeks'}. Difficulty level: ${program.difficulty || 'All Levels'}.`,
    });
    setIsServiceModalOpen(true);
  };

  return (
    <div className="bg-[#080811] text-white min-h-screen">
      {/* Sticky Navigation */}
      <Navbar onOpenJoinModal={handleOpenJoinModal} />

      {/* Hero Section */}
      <HeroSection onOpenJoinModal={() => handleOpenJoinModal()} />

      {/* Programs Section */}
      <ProgramsSection
        programs={homeData.programs}
        onOpenJoinModal={handleOpenJoinModal}
        onSelectProgram={handleSelectProgram}
      />

      {/* Fitness Classes (Men Class & Women Class) */}
      <FitnessClassesSection onOpenBookClass={handleOpenBookClass} />

      {/* About Gym Section with Integrated Video Showcase */}
      <AboutSection
        onOpenJoinModal={() => handleOpenJoinModal()}
      />

      {/* Interactive Quick Tools Banner */}
      <section className="py-10 bg-gradient-to-r from-[#10101C] via-[#1a0c18] to-[#10101C] border-y border-[#E91E63]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div
              onClick={() => setIsBmiModalOpen(true)}
              className="p-5 sm:p-6 rounded-2xl bg-[#151522] border border-[#E91E63]/30 hover:border-[#E91E63] cursor-pointer transition-all flex items-center justify-between group shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#E91E63]/20 border border-[#E91E63]/40 flex items-center justify-center text-[#E91E63] group-hover:scale-110 transition-transform shrink-0">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading text-lg sm:text-xl font-bold uppercase text-white group-hover:text-[#E91E63] transition-colors">
                    Interactive BMI & Macro Tool
                  </h4>
                  <p className="text-xs text-[#B8B5C2]">Calculate your calorie target & get tailored program recommendations.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#E91E63] group-hover:translate-x-1 transition-transform shrink-0" />
            </div>

            <div
              onClick={() => setIsPassModalOpen(true)}
              className="p-5 sm:p-6 rounded-2xl bg-[#151522] border border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition-all flex items-center justify-between group shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading text-lg sm:text-xl font-bold uppercase text-white group-hover:text-emerald-400 transition-colors">
                    Claim Free 1-Day VIP Pass
                  </h4>
                  <p className="text-xs text-[#B8B5C2]">Instant digital QR pass for our Olympic platforms & recovery saunas.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid (Yoga, Bodybuilding, Fitness, Boxing) */}
      <ServicesSection
        onOpenJoinModal={() => handleOpenJoinModal()}
        onSelectService={handleSelectService}
      />

      {/* Membership Pricing Section */}
      <PricingSection
        plans={homeData.membershipPlans}
        onOpenJoinModal={handleOpenJoinModal}
      />

      {/* Testimonials */}
      <TestimonialsSection testimonials={homeData.testimonials} />

      {/* Gallery */}
      <GallerySection gallery={homeData.gallery} />

      {/* Contact Section */}
      <ContactSection />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Footer & Floating WhatsApp */}
      <Footer />
      <FloatingWhatsApp />

      {/* Modals */}
      <MembershipApplicationModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        plans={homeData.membershipPlans}
        preSelectedPlanId={selectedPlanId}
      />

      <BookSessionModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        classNameTitle={bookingClassTitle}
      />

      <ServiceDetailModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        service={selectedService}
        onOpenJoinModal={() => handleOpenJoinModal()}
      />

      <BmiCalculatorModal
        isOpen={isBmiModalOpen}
        onClose={() => setIsBmiModalOpen(false)}
        onSelectPlan={() => handleOpenJoinModal()}
      />

      <FreePassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />
    </div>
  );
};
