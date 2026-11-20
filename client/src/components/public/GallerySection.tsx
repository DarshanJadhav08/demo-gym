import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ZoomIn, X, ArrowRight } from 'lucide-react';

interface GallerySectionProps {
  gallery: any[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const defaultGallery = [
    {
      title: 'Free Weights & Dumbbells Arena',
      category: 'Equipment',
      image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Olympic Lifting Platforms',
      category: 'Training',
      image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Atmospheric Moody Gym Floor',
      category: 'Interior',
      image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Heavy Bag Boxing Arena',
      category: 'Interior',
      image_url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Conditioning & Cardio Mezzanine',
      category: 'Equipment',
      image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Mobility & Recovery Studio',
      category: 'Interior',
      image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
    },
  ];

  const list = gallery && gallery.length > 0 ? gallery : defaultGallery;
  const categories = ['All', 'Interior', 'Equipment', 'Training'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePhoto, setActivePhoto] = useState<any | null>(null);

  const filtered = selectedCategory === 'All' ? list : list.filter((i) => i.category === selectedCategory);

  return (
    <section id="gallery" className="py-16 sm:py-20 bg-[#080811] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-[#E91E63] text-sm font-semibold uppercase tracking-widest block mb-2 font-heading">
              Visual Tour
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase">
              Gym <span className="text-gradient">Gallery</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6 md:mt-0">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-[#E91E63] text-white shadow-lg shadow-[#E91E63]/30'
                      : 'bg-[#151522] border border-gray-800 text-[#B8B5C2] hover:text-white hover:border-[#E91E63]/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <Link
              to="/gallery"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#151522] border border-[#E91E63]/30 text-white text-xs font-semibold hover:border-[#E91E63] hover:text-[#E91E63] transition-colors shrink-0"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActivePhoto(item)}
              className="relative h-72 rounded-2xl overflow-hidden bg-[#151522] border border-[#E91E63]/25 group cursor-pointer shadow-xl"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080811] via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-[#E91E63] flex items-center justify-center text-white shadow-xl">
                  <ZoomIn className="w-6 h-6" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase font-bold text-[#E91E63] tracking-widest">{item.category}</span>
                <h4 className="text-white font-semibold text-sm line-clamp-1">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#151522] rounded-2xl overflow-hidden border border-[#E91E63]/40">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#E91E63] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={activePhoto.image_url} alt={activePhoto.title} className="w-full max-h-[75vh] object-contain bg-black" />
            <div className="p-4 bg-[#10101C]">
              <span className="text-xs uppercase font-bold text-[#E91E63] tracking-widest">{activePhoto.category}</span>
              <h3 className="text-white font-heading text-xl font-bold">{activePhoto.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
