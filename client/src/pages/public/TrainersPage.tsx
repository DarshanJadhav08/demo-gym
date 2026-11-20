import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Footer } from '../../components/public/Footer';
import { FloatingWhatsApp } from '../../components/public/FloatingWhatsApp';
import { BookSessionModal } from '../../components/public/modals/BookSessionModal';
import { Award, Dumbbell, Star, CheckCircle2, Sparkles, ChevronRight, Phone, Mail } from 'lucide-react';
import { api } from '../../services/api';
import { Trainer } from '../../types';

export const TrainersPage: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedTrainerName, setSelectedTrainerName] = useState('Marcus Vance');

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const data = await api.getTrainers();
        setTrainers(data || []);
      } catch (err) {
        console.error('Failed to load trainers:', err);
      }
    };
    fetchTrainers();
  }, []);

  const fallbackTrainers = [
    {
      id: 'trn-1',
      trainer_code: 'TRN-001',
      full_name: 'Marcus "The Beast" Vance',
      profile_image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=800',
      specialization: 'Powerlifting & Muscular Hypertrophy',
      qualifications: 'CSCS (Certified Strength and Conditioning Specialist), ISSA Master Trainer, Former National Powerlifting Champion',
      experience: '12 Years',
      description: 'Specializes in heavy barbell training, structural biomechanics, and rapid strength progression. Coached over 300 competitive powerlifters and athletes.',
      assigned_programs: JSON.stringify(['Olympic Strength', 'Heavy Hypertrophy', 'Deadlift Specialization']),
    },
    {
      id: 'trn-2',
      trainer_code: 'TRN-002',
      full_name: 'Elena Rostova',
      profile_image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800',
      specialization: 'Olympic Weightlifting & Athletic Sculpt',
      qualifications: 'USAW Level 2 Certified Coach, CrossFit L3 Coach, Sports Science B.Sc.',
      experience: '8 Years',
      description: 'Passionate about empowering athletes through explosive Olympic barbell movements, posterior chain sculpting, and high-density metabolic training.',
      assigned_programs: JSON.stringify(["Women's Sculpt", 'Cross Training', 'MetCon Blast']),
    },
    {
      id: 'trn-3',
      trainer_code: 'TRN-003',
      full_name: 'David "Guns" Chen',
      profile_image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
      specialization: 'Body Recomposition & Calisthenics',
      qualifications: 'NASM-CPT, Precision Nutrition L1 Certified, WSWCF Calisthenics Master',
      experience: '7 Years',
      description: 'Focuses on sustainable dietary transformations, gymnastic bodyweight mechanics, and sculpting shredded, functional physiques with zero fluff.',
      assigned_programs: JSON.stringify(['Body Recomposition', 'Calisthenics Mastery', 'Fat Loss']),
    },
    {
      id: 'trn-4',
      trainer_code: 'TRN-004',
      full_name: 'Sophia Williams',
      profile_image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
      specialization: 'Functional Range Conditioning & Power Yoga',
      qualifications: 'ERYT-500 Certified Yoga Master, FRC Mobility Specialist, Fascial Stretch Therapist',
      experience: '6 Years',
      description: 'Dedicated to joint capsule mobility, deep postural realignment, down-regulating the central nervous system, and restoring tissue elasticity.',
      assigned_programs: JSON.stringify(['Power Yoga Flow', 'Joint Mobility FRC', 'Postural Restoration']),
    },
  ];

  const displayList = trainers.length > 0 ? trainers : fallbackTrainers;

  const handleBook = (trainerName: string) => {
    setSelectedTrainerName(trainerName);
    setIsBookModalOpen(true);
  };

  return (
    <div className="bg-[#080811] text-white min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-14 bg-gradient-to-b from-[#10101C] via-[#080811] to-[#080811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E91E63]/15 border border-[#E91E63]/40 text-[#E91E63] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Coaches & Sports Scientists</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase mb-6">
            MEET OUR <span className="text-gradient">MASTER COACHES</span>
          </h1>
          <p className="text-base sm:text-xl text-[#B8B5C2] max-w-3xl mx-auto leading-relaxed">
            We don't employ gym attendants. Every coach at DemoFit is a career professional with accredited credentials, competitive experience, and an obsession with technique.
          </p>
        </div>
      </section>

      {/* Coaches Grid */}
      <section className="py-20 bg-[#10101C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {displayList.map((coach: any) => {
              const programsList = typeof coach.assigned_programs === 'string'
                ? JSON.parse(coach.assigned_programs || '[]')
                : (coach.assigned_programs || []);

              return (
                <div
                  key={coach.id}
                  className="group rounded-3xl overflow-hidden bg-[#151522] border border-[#E91E63]/25 hover:border-[#E91E63] transition-all duration-300 shadow-2xl flex flex-col lg:flex-row"
                >
                  {/* Coach Photo */}
                  <div className="lg:w-2/5 relative h-72 lg:h-auto overflow-hidden">
                    <img
                      src={coach.profile_image || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=800'}
                      alt={coach.full_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#151522] via-transparent to-transparent opacity-80" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#080811]/90 backdrop-blur-md text-[10px] font-mono font-bold text-[#E91E63] border border-[#E91E63]/40">
                      {coach.trainer_code}
                    </span>
                  </div>

                  {/* Coach Bio & Deliverables */}
                  <div className="lg:w-3/5 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#E91E63]/15 text-[#E91E63]">
                          {coach.experience} Experience
                        </span>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <h3 className="font-heading text-2xl font-bold uppercase text-white mb-2 group-hover:text-[#E91E63] transition-colors">
                        {coach.full_name}
                      </h3>
                      <p className="text-xs font-semibold text-[#E91E63] uppercase tracking-wider mb-3">
                        {coach.specialization}
                      </p>

                      <p className="text-xs text-[#B8B5C2] leading-relaxed mb-4">
                        {coach.description}
                      </p>

                      <div className="p-3 rounded-xl bg-[#10101C] border border-gray-800 text-[11px] text-gray-300 mb-4">
                        <strong className="text-white block mb-0.5">Accreditation:</strong>
                        {coach.qualifications}
                      </div>

                      {programsList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {programsList.map((prog: string, pIdx: number) => (
                            <span key={pIdx} className="px-2 py-0.5 rounded text-[10px] bg-[#151522] border border-gray-800 text-gray-400">
                              {prog}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleBook(coach.full_name)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2"
                    >
                      <Dumbbell className="w-4 h-4" />
                      <span>Book Consultation With {coach.full_name.split(' ')[0]}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />

      <BookSessionModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        classTitle={`Private 1-on-1 Consultation (${selectedTrainerName})`}
      />
    </div>
  );
};
