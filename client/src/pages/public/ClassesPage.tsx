import React, { useState } from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Footer } from '../../components/public/Footer';
import { FloatingWhatsApp } from '../../components/public/FloatingWhatsApp';
import { BookSessionModal } from '../../components/public/modals/BookSessionModal';
import { Calendar, Clock, Users, Dumbbell, Sparkles, Flame, CheckCircle2, ChevronRight } from 'lucide-react';

export const ClassesPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookingClassTitle, setBookingClassTitle] = useState('Men Class');

  const openBooking = (className: string) => {
    setBookingClassTitle(className);
    setIsBookModalOpen(true);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const scheduleGrid: Record<string, Array<{ time: string; title: string; trainer: string; category: string; spots: number; intensity: string }>> = {
    Monday: [
      { time: '06:30 AM - 07:30 AM', title: "Men's Powerlifting & Heavy Squat", trainer: 'Marcus Vance', category: 'Strength', spots: 6, intensity: 'High' },
      { time: '08:00 AM - 09:00 AM', title: "Women's Glute & Athletic Sculpt", trainer: 'Elena Rostova', category: 'Sculpt', spots: 4, intensity: 'Medium' },
      { time: '12:00 PM - 01:00 PM', title: 'Midday High-Density HIIT', trainer: 'David Chen', category: 'Conditioning', spots: 8, intensity: 'High' },
      { time: '05:30 PM - 06:30 PM', title: 'Championship Boxing & Sparring', trainer: 'Coach Viktor', category: 'Combat', spots: 5, intensity: 'Very High' },
      { time: '07:00 PM - 08:00 PM', title: "Men's Upper Body Hypertrophy", trainer: 'Marcus Vance', category: 'Hypertrophy', spots: 3, intensity: 'High' },
      { time: '08:15 PM - 09:00 PM', title: 'Recovery Yoga & Breathwork', trainer: 'Sophia Williams', category: 'Mobility', spots: 10, intensity: 'Low' },
    ],
    Tuesday: [
      { time: '07:00 AM - 08:00 AM', title: 'Functional Cross-Training Circuit', trainer: 'Elena Rostova', category: 'Conditioning', spots: 7, intensity: 'High' },
      { time: '08:30 AM - 09:30 AM', title: "Women's Core & High-Intensity Conditioning", trainer: 'Elena Rostova', category: 'Sculpt', spots: 5, intensity: 'High' },
      { time: '05:00 PM - 06:00 PM', title: 'Calisthenics & Ring Drills', trainer: 'Zack Taylor', category: 'Strength', spots: 8, intensity: 'Medium' },
      { time: '06:30 PM - 07:30 PM', title: 'Deadlift Technique & Barbell Clinic', trainer: 'Marcus Vance', category: 'Strength', spots: 4, intensity: 'Very High' },
      { time: '07:45 PM - 08:45 PM', title: 'Hot Flow Yoga & Fascia Release', trainer: 'Sophia Williams', category: 'Mobility', spots: 12, intensity: 'Low' },
    ],
    Wednesday: [
      { time: '06:30 AM - 07:30 AM', title: "Men's Bench Press & Chest Specialization", trainer: 'Marcus Vance', category: 'Strength', spots: 5, intensity: 'High' },
      { time: '08:00 AM - 09:00 AM', title: "Women's Lower Body Power & Deadlifts", trainer: 'Elena Rostova', category: 'Sculpt', spots: 3, intensity: 'High' },
      { time: '05:30 PM - 06:30 PM', title: 'Heavy Bag Combat Conditioning', trainer: 'Coach Viktor', category: 'Combat', spots: 6, intensity: 'Very High' },
      { time: '07:00 PM - 08:00 PM', title: 'Team MetCon Challenge', trainer: 'Elena Rostova', category: 'Conditioning', spots: 9, intensity: 'High' },
    ],
    Thursday: [
      { time: '07:00 AM - 08:00 AM', title: 'Olympic Lifting Snatch Clinic', trainer: 'Elena Rostova', category: 'Strength', spots: 4, intensity: 'Very High' },
      { time: '08:30 AM - 09:30 AM', title: "Women's Full Body Athletic Sculpt", trainer: 'Elena Rostova', category: 'Sculpt', spots: 5, intensity: 'Medium' },
      { time: '05:30 PM - 06:30 PM', title: "Men's Arm & Shoulder Mass Builder", trainer: 'David Chen', category: 'Hypertrophy', spots: 6, intensity: 'High' },
      { time: '07:00 PM - 08:00 PM', title: 'Contrast Sauna & Cold Plunge Session', trainer: 'Staff Specialist', category: 'Recovery', spots: 8, intensity: 'Restorative' },
    ],
    Friday: [
      { time: '06:30 AM - 07:30 AM', title: "Men's Heavy Back & Pulling Mechanics", trainer: 'Marcus Vance', category: 'Strength', spots: 5, intensity: 'High' },
      { time: '08:00 AM - 09:00 AM', title: "Women's Glute Density & Hamstrings", trainer: 'Elena Rostova', category: 'Sculpt', spots: 2, intensity: 'High' },
      { time: '05:30 PM - 06:30 PM', title: 'Friday Night Fight Boxing Arena', trainer: 'Coach Viktor', category: 'Combat', spots: 6, intensity: 'Very High' },
      { time: '07:00 PM - 08:00 PM', title: 'Functional Strongman & Sled Drills', trainer: 'Marcus Vance', category: 'Strength', spots: 7, intensity: 'High' },
    ],
    Saturday: [
      { time: '08:00 AM - 09:30 AM', title: 'The Apex Saturday 90-Min Mega Circuit', trainer: 'Marcus & Elena', category: 'Conditioning', spots: 12, intensity: 'Maximum' },
      { time: '10:00 AM - 11:00 AM', title: 'Women-Only Athletic Lifting Camp', trainer: 'Elena Rostova', category: 'Sculpt', spots: 6, intensity: 'High' },
      { time: '11:30 AM - 12:30 PM', title: 'Restorative Yin Yoga & Sound Healing', trainer: 'Sophia Williams', category: 'Mobility', spots: 15, intensity: 'Low' },
    ],
    Sunday: [
      { time: '08:30 AM - 09:30 AM', title: 'Active Recovery & Mobility Fundamentals', trainer: 'Sophia Williams', category: 'Mobility', spots: 12, intensity: 'Low' },
      { time: '10:00 AM - 11:30 AM', title: 'Open Gym Coaching & PR Squat Attempts', trainer: 'Marcus Vance', category: 'Strength', spots: 8, intensity: 'High' },
    ],
  };

  const currentDayClasses = scheduleGrid[selectedDay] || [];

  return (
    <div className="bg-[#080811] text-white min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-14 bg-gradient-to-b from-[#10101C] via-[#080811] to-[#080811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E91E63]/15 border border-[#E91E63]/40 text-[#E91E63] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Energy Small Group Coaching</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase mb-6">
            FITNESS <span className="text-gradient">CLASSES</span> & SCHEDULE
          </h1>
          <p className="text-base sm:text-xl text-[#B8B5C2] max-w-3xl mx-auto leading-relaxed">
            Led by elite trainers who enforce flawless lifting mechanics, motivate your spirit, and ensure every training minute yields results.
          </p>
        </div>
      </section>

      {/* Featured Men's & Women's Class Cards (From Design Inspiration) */}
      <section className="py-16 bg-[#10101C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Men Class Card */}
            <div className="group rounded-3xl overflow-hidden bg-[#151522] border border-[#E91E63]/30 shadow-2xl relative flex flex-col justify-between p-8 hover:border-[#E91E63] transition-all duration-300">
              <div className="relative z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E91E63]/20 text-[#E91E63] border border-[#E91E63]/40 inline-block mb-4">
                  Signature Program
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-white mb-4">
                  MEN CLASS — POWER & DENSITY
                </h3>
                <p className="text-sm text-[#B8B5C2] leading-relaxed mb-6">
                  We have a philosophy when it comes to fitness. We believe in teaching people the importance of longevity, joint integrity, explosive power, and raw progressive overload.
                </p>
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#E91E63]" />
                    <span>Barbell Squat, Bench & Deadlift Periodization</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#E91E63]" />
                    <span>Metabolic Kettlebell Finisher Drills</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#E91E63]" />
                    <span>Lead Coach: Marcus Vance (CSCS)</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-gray-800">
                <div>
                  <span className="text-xs text-gray-400 block">Class Schedule</span>
                  <span className="text-sm font-bold text-white">Mon / Wed / Fri: 07:00 AM & 06:00 PM</span>
                </div>
                <button
                  onClick={() => openBooking("Men's Strength & Power Class")}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  Book Session
                </button>
              </div>

              {/* Background Athlete Visual */}
              <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800"
                  alt="Men Fitness"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Women Class Card */}
            <div className="group rounded-3xl overflow-hidden bg-[#151522] border border-[#E91E63]/30 shadow-2xl relative flex flex-col justify-between p-8 hover:border-[#E91E63] transition-all duration-300">
              <div className="relative z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E91E63]/20 text-[#E91E63] border border-[#E91E63]/40 inline-block mb-4">
                  Signature Program
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-white mb-4">
                  WOMEN CLASS — SCULPT & ATHLETICS
                </h3>
                <p className="text-sm text-[#B8B5C2] leading-relaxed mb-6">
                  The Women's Program is a female coached, female-focused strength and conditioning experience that prioritizes glute development, waist sculpting, core stability, and athletic vitality.
                </p>
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#E91E63]" />
                    <span>Hip Thrust, Romanian Deadlift & Hamstring Specialization</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#E91E63]" />
                    <span>Low Impact Core Compression & Posture Realignment</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#E91E63]" />
                    <span>Lead Coach: Elena Rostova (USAW Level 2)</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-gray-800">
                <div>
                  <span className="text-xs text-gray-400 block">Class Schedule</span>
                  <span className="text-sm font-bold text-white">Tue / Thu / Sat: 08:00 AM & 05:00 PM</span>
                </div>
                <button
                  onClick={() => openBooking("Women's Sculpt & Strength Class")}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  Book Session
                </button>
              </div>

              {/* Background Visual */}
              <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800"
                  alt="Women Fitness"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Weekly Timetable Grid */}
      <section className="py-20 bg-[#080811] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest block mb-2 font-heading">
              Live Timetable & Booking
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase">
              WEEKLY CLASS SCHEDULE
            </h2>
            <p className="text-xs sm:text-sm text-[#B8B5C2] mt-3">
              Select a day below to view time slots, available spots, and reserve your place.
            </p>
          </div>

          {/* Day Selector Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                  selectedDay === day
                    ? 'bg-[#E91E63] text-white shadow-xl scale-105'
                    : 'bg-[#151522] border border-gray-800 text-gray-400 hover:text-white hover:border-[#E91E63]/30'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Schedule List */}
          <div className="space-y-4">
            {currentDayClasses.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#151522] border border-[#E91E63]/20 hover:border-[#E91E63] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg group"
              >
                <div className="flex items-start md:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#10101C] border border-[#E91E63]/30 flex items-center justify-center text-[#E91E63] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-[#E91E63] font-bold">{item.time}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-800 text-gray-300">
                        {item.category}
                      </span>
                    </div>
                    <h4 className="font-heading text-lg font-bold text-white group-hover:text-[#E91E63] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      Coach: <strong className="text-gray-200">{item.trainer}</strong> • Intensity: <strong className="text-[#E91E63]">{item.intensity}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-gray-800">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Remaining Spots</span>
                    <span className="text-xs font-bold text-emerald-400">{item.spots} open capacity</span>
                  </div>
                  <button
                    onClick={() => openBooking(`${item.title} (${selectedDay} ${item.time})`)}
                    className="px-5 py-2.5 rounded-full bg-[#10101C] border border-[#E91E63]/40 hover:bg-[#E91E63] text-white text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Reserve Spot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />

      <BookSessionModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        classTitle={bookingClassTitle}
      />
    </div>
  );
};
