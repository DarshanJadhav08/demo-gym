import React, { useState } from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Footer } from '../../components/public/Footer';
import { FloatingWhatsApp } from '../../components/public/FloatingWhatsApp';
import { FreePassModal } from '../../components/public/FreePassModal';
import { X, ZoomIn, Sparkles, Filter, Camera } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  const galleryItems = [
    {
      id: 'gal-1',
      title: 'Heavy Dumbbell & Calibrated Iron Arena',
      category: 'Free Weights',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200',
      description: 'Solid steel dumbbells ranging up to 80kg with urethane grip and anti-slip knurling.',
    },
    {
      id: 'gal-2',
      title: 'Olympic Lifting Platforms & Competition Discs',
      category: 'Free Weights',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
      description: 'Eleiko certified IWF spec oak wood platforms with high-density shock absorbing rubber surrounds.',
    },
    {
      id: 'gal-3',
      title: 'Atmospheric Main Floor & Architect Lighting',
      category: 'Interior',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200',
      description: 'Dark architectural fitness cathedral with acoustic dampening and high-CRI linear focus lighting.',
    },
    {
      id: 'gal-4',
      title: 'Championship Heavy Bag & Combat Boxing Arena',
      category: 'Combat',
      image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=1200',
      description: 'Custom 20-foot ring, heavy leather teardrop bags, and shock-resistant canvas matting.',
    },
    {
      id: 'gal-5',
      title: 'Cardio & Conditioning Sprint Mezzanine',
      category: 'Cardio',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=1200',
      description: 'Curved Woodway non-motorized treadmills, Concept2 SkiErgs, and air bikes.',
    },
    {
      id: 'gal-6',
      title: 'Contrast Cryo & Infrared Sauna Recovery Suite',
      category: 'Recovery',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200',
      description: 'Temperature-controlled 4°C cold plunge tubs paired with Finnish cedarwood saunas.',
    },
    {
      id: 'gal-7',
      title: 'Athlete Barbell Squat Session in Action',
      category: 'Athletes',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=1200',
      description: 'Powerlifter executing a high-load back squat inside our reinforced custom power cage.',
    },
    {
      id: 'gal-8',
      title: 'High-Performance Functional Agility Turf',
      category: 'Cardio',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1200',
      description: '40-meter indoor high-density sled turf for heavy pushes, pulls, and sprint accelerations.',
    },
    {
      id: 'gal-9',
      title: 'Private Assessment & Biometrics Studio',
      category: 'Interior',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
      description: 'Clinical room housing the InBody 770 multi-frequency analyzer and 3D postural camera.',
    },
  ];

  const categories = ['All', 'Free Weights', 'Interior', 'Combat', 'Cardio', 'Recovery', 'Athletes'];

  const filtered = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-[#080811] text-white min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-14 bg-gradient-to-b from-[#10101C] via-[#080811] to-[#080811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E91E63]/15 border border-[#E91E63]/40 text-[#E91E63] text-xs font-bold uppercase tracking-wider mb-6">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Showcase</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase mb-6">
            FACILITY <span className="text-gradient">GALLERY</span>
          </h1>
          <p className="text-base sm:text-xl text-[#B8B5C2] max-w-3xl mx-auto leading-relaxed">
            Take a visual tour of our 30,000 square foot facility, Olympic platforms, luxury recovery lounges, and training floor.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 bg-[#10101C] border-y border-gray-800 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#E91E63] text-white shadow-lg'
                  : 'bg-[#151522] border border-gray-800 text-gray-400 hover:text-white hover:border-[#E91E63]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-[#080811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveImage(item.image)}
                className="group relative rounded-3xl overflow-hidden bg-[#151522] border border-[#E91E63]/20 hover:border-[#E91E63] shadow-xl cursor-pointer h-72"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080811] via-[#080811]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="w-10 h-10 rounded-xl bg-[#E91E63] text-white flex items-center justify-center mb-2 shadow-lg">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#E91E63] font-bold uppercase tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <h4 className="font-heading text-lg font-bold text-white uppercase">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#B8B5C2] line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full rounded-2xl overflow-hidden border border-[#E91E63]/40 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-[#E91E63] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={activeImage} alt="Enlarged Gym View" className="w-full max-h-[85vh] object-contain bg-black" />
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-[#10101C] border-t border-gray-800 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-white mb-3">
            SEE IT WITH YOUR OWN EYES
          </h2>
          <p className="text-xs sm:text-sm text-[#B8B5C2] max-w-lg mx-auto mb-6">
            Pictures only tell half the story. Walk into our facility with a complimentary 1-day guest pass.
          </p>
          <button
            onClick={() => setIsPassModalOpen(true)}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white font-bold text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition-all"
          >
            Get Free 1-Day Pass
          </button>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />

      <FreePassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />
    </div>
  );
};
