import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: any[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const defaultTestimonials = [
    {
      customer_name: 'Mike Woloshyn',
      customer_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      membership_type: 'Apex Black VIP Member',
      review: 'All to 1 out of believe that it fixes gym & athlete now landing page with getting app. The strength coaches here are in a different league entirely.',
    },
    {
      customer_name: 'Rachel Sterling',
      customer_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      membership_type: 'Gold Power Member',
      review: 'The women’s athletic program pushed me past plateaus I struggled with for years. The equipment quality and culture are truly exceptional.',
    },
    {
      customer_name: 'David Miller',
      customer_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      membership_type: 'Silver Strength Member',
      review: 'Calibrated plates, heavy dumbbells, spotless recovery saunas, and 24/7 access. Apex Elite is the definitive training ground for serious lifters.',
    },
  ];

  const list = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => setCurrentIndex((c) => (c === 0 ? list.length - 1 : c - 1));
  const next = () => setCurrentIndex((c) => (c === list.length - 1 ? 0 : c + 1));

  return (
    <section id="testimonials" className="py-16 sm:py-20 bg-[#10101C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Matching reference: What Our Customers Are Saying) */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[#E91E63] text-sm font-semibold uppercase tracking-widest block mb-2 font-heading">
            Proven Results
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight">
            What Our Customers Are Saying
          </h2>
        </div>

        {/* Testimonials Grid / Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {list.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#151522] border border-[#E91E63]/25 hover:border-[#E91E63]/60 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Review text */}
                <p className="text-sm text-[#B8B5C2] leading-relaxed italic mb-6">
                  "{item.review}"
                </p>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-6 text-amber-400">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                <img
                  src={item.customer_image}
                  alt={item.customer_name}
                  className="w-12 h-12 rounded-full object-cover border border-[#E91E63]"
                />
                <div>
                  <h4 className="font-semibold text-white text-sm">{item.customer_name}</h4>
                  <p className="text-xs text-[#E91E63]">{item.membership_type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
