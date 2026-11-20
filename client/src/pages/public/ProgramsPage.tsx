import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Footer } from '../../components/public/Footer';
import { FloatingWhatsApp } from '../../components/public/FloatingWhatsApp';
import { MembershipApplicationModal } from '../../components/public/modals/MembershipApplicationModal';
import { BmiCalculatorModal } from '../../components/public/BmiCalculatorModal';
import { Dumbbell, Clock, Flame, ChevronRight, CheckCircle2, Sparkles, Filter, Calculator } from 'lucide-react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

export const ProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isBmiModalOpen, setIsBmiModalOpen] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await api.getHomeData();
        setPrograms(data.programs || []);
      } catch (err) {
        console.error('Failed to load programs:', err);
      }
    };
    fetchPrograms();
  }, []);

  const fallbackPrograms = [
    {
      id: 'prg-1',
      title: 'Olympic Strength & Barbell Mastery',
      category: 'Strength',
      difficulty: 'Intermediate to Advanced',
      duration: '12 Weeks',
      trainer: 'Marcus Vance (CSCS)',
      image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
      description: 'Periodized linear overload program focusing on the Snatch, Clean & Jerk, Back Squat, and Deadlift with bar-path video analysis.',
      features: ['Video biomechanic bar-path analysis', 'Eleiko calibrated competition plates', 'Strict CNS recovery monitoring', 'Velocity based training (VBT)'],
    },
    {
      id: 'prg-2',
      title: 'Precision Hypertrophy & Muscle Density',
      category: 'Hypertrophy',
      difficulty: 'All Levels',
      duration: '16 Weeks',
      trainer: 'David "Guns" Chen',
      image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
      description: 'High mechanical tension protocols engineered for maximum muscular cross-sectional area, targeted fiber recruitment, and aesthetics.',
      features: ['Progressive overload volume logs', 'InBody 770 baseline scans', 'Targeted muscle isolation angles', 'Intra-workout hydration plans'],
    },
    {
      id: 'prg-3',
      title: 'Metabolic Shred & Conditioning',
      category: 'Fat Loss',
      difficulty: 'Beginner to Intermediate',
      duration: '8 Weeks',
      trainer: 'Elena Rostova',
      image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
      description: 'High-density peripheral heart action circuits combining sled sprints, kettlebell complexes, and lactate threshold conditioning.',
      features: ['Heart rate zone tracking', 'Accelerated fat oxidation', 'Low impact on joints', 'Custom macro caloric deficit'],
    },
    {
      id: 'prg-4',
      title: 'Athletic Calisthenics & Body Mastery',
      category: 'Functional',
      difficulty: 'All Levels',
      duration: '10 Weeks',
      trainer: 'Zack Taylor',
      image_url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=800',
      description: 'Gymnastic ring drills, weighted pull-ups, muscle-up progressions, and core compression stability for true relative strength.',
      features: ['Straight arm scapular strength', 'Front lever & planche progressions', 'Tendon & ligament conditioning', 'True pound-for-pound power'],
    },
    {
      id: 'prg-5',
      title: 'Apex Combat Boxing & Sparring Academy',
      category: 'Combat',
      difficulty: 'All Levels',
      duration: '12 Weeks',
      trainer: 'Coach Viktor K.',
      image_url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800',
      description: 'Authentic boxing footwork, mitt-work combinations, heavy bag power generation, and anaerobic conditioning inside our championship ring.',
      features: ['12-round stamina conditioning', 'Slip and counter technique', 'Hand wrapping and defense mastery', 'Controlled sparring options'],
    },
    {
      id: 'prg-6',
      title: 'Power Yoga & Fascia Restoration',
      category: 'Mobility',
      difficulty: 'All Levels',
      duration: 'Ongoing',
      trainer: 'Sophia Williams',
      image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
      description: 'Dynamic athletic flow designed to decompress the spine, open tight hips and shoulders, and facilitate deep muscular recovery.',
      features: ['FRC joint capsule mobility', 'Parasympathetic down-regulation', 'Core and thoracic decompression', 'Injury prevention protocol'],
    },
  ];

  const displayList = programs.length > 0 ? programs : fallbackPrograms;

  const categories = ['All', 'Strength', 'Hypertrophy', 'Fat Loss', 'Functional', 'Combat', 'Mobility'];

  const filtered = selectedCategory === 'All'
    ? displayList
    : displayList.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase() || p.title?.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="bg-[#080811] text-white min-h-screen">
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Hero Banner */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-14 bg-gradient-to-b from-[#10101C] via-[#080811] to-[#080811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E91E63]/15 border border-[#E91E63]/40 text-[#E91E63] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Performance Curriculum</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase mb-6">
            TRAINING <span className="text-gradient">PROGRAMS</span>
          </h1>
          <p className="text-base sm:text-xl text-[#B8B5C2] max-w-3xl mx-auto leading-relaxed mb-8">
            Every curriculum at DemoFit is rooted in peer-reviewed exercise physiology and coached by certified sports scientists.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsBmiModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#151522] border border-[#E91E63]/40 text-xs font-semibold text-white hover:border-[#E91E63] transition-colors"
            >
              <Calculator className="w-4 h-4 text-[#E91E63]" />
              <span>Unsure Which Program Fits? Try BMI & Macro Tool</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 bg-[#10101C] border-y border-gray-800 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto gap-4 no-scrollbar">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#E91E63] shrink-0" />
            <span className="text-xs uppercase font-bold tracking-wider text-gray-400 shrink-0">Filter:</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#E91E63] text-white shadow-lg'
                    : 'bg-[#151522] border border-gray-800 text-gray-400 hover:text-white hover:border-[#E91E63]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Program Cards Grid */}
      <section className="py-20 bg-[#080811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item, idx) => (
              <div
                key={item.id || idx}
                className="group rounded-3xl overflow-hidden bg-[#151522] border border-[#E91E63]/20 hover:border-[#E91E63] transition-all duration-300 shadow-xl flex flex-col"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151522] via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#080811]/90 backdrop-blur-md border border-[#E91E63]/40 text-[#E91E63] text-[10px] font-bold uppercase tracking-wider">
                    {item.duration || '12 Weeks'}
                  </span>
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#10101C]/90 backdrop-blur-md text-xs font-semibold text-white">
                    {item.difficulty || 'All Levels'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-2xl font-bold uppercase text-white mb-2 group-hover:text-[#E91E63] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#B8B5C2] leading-relaxed mb-6">
                      {item.description}
                    </p>

                    {item.features && (
                      <div className="space-y-2 mb-6 pt-4 border-t border-gray-800">
                        {item.features.map((feat: string, fIdx: number) => (
                          <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#E91E63] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">Lead Coach</span>
                      <span className="text-xs font-bold text-white">{item.trainer || 'Master Coach'}</span>
                    </div>

                    <button
                      onClick={() => setIsJoinModalOpen(true)}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <span>Enroll</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />

      <MembershipApplicationModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
      <BmiCalculatorModal
        isOpen={isBmiModalOpen}
        onClose={() => setIsBmiModalOpen(false)}
        onSelectPlan={() => setIsJoinModalOpen(true)}
      />
    </div>
  );
};
