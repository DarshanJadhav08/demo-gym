import React, { useState } from 'react';
import { Play, X, Volume2, Shield } from 'lucide-react';

export const VideoShowcaseSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-20 bg-[#080811] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#E91E63]/30 shadow-2xl h-[420px] flex items-center justify-center">
          {/* Background Poster */}
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1800"
            alt="Gym Workout Arena"
            className="absolute inset-0 w-full h-full object-cover object-center brightness-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080811] via-[#080811]/40 to-transparent" />

          {/* Central Callout & Play Button */}
          <div className="relative z-10 text-center max-w-2xl px-4 flex flex-col items-center">
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Watch Gym Experience Video"
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#571638] via-[#A51C55] to-[#E91E63] flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 glow-accent mb-6"
            >
              <Play className="w-10 h-10 fill-white ml-1" />
            </button>
            <span className="text-[#E91E63] font-bold text-sm tracking-widest uppercase mb-2">
              Experience Apex Elite
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
              WHERE CHAMPIONS ARE FORGED
            </h2>
            <p className="text-[#B8B5C2] text-sm sm:text-base max-w-lg mx-auto">
              Take a virtual walkthrough of our 30,000 sq.ft championship training facility, Olympic lifting arena, and luxury recovery spa.
            </p>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#151522] rounded-2xl overflow-hidden border border-[#E91E63]/40 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 bg-[#10101C] border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#E91E63]" />
                <span className="text-white font-semibold text-sm">Apex Elite | Official High-Performance Tour</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
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
