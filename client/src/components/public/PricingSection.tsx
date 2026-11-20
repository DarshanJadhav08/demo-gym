import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { MembershipPlan } from '../../types';

interface PricingSectionProps {
  plans: MembershipPlan[];
  onOpenJoinModal: (planId?: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ plans, onOpenJoinModal }) => {
  // Fallback plans if database plans not yet loaded
  const fallbackPlans: MembershipPlan[] = [
    {
      id: 'bronze-plan',
      name: 'Bronze',
      slug: 'bronze',
      price: 49,
      duration_months: 1,
      duration_days: 30,
      description: 'Essential gym access for beginners',
      benefits: JSON.stringify(['3 Days a Week', 'Dedicated Trainer Allocated', 'Standard Locker Room', 'Free Water & Towel Service']),
      features: JSON.stringify(['3 Days a Week', 'Dedicated Trainer Allocated']),
      discount_percentage: 0,
      joining_fee: 15,
      is_active: 1,
      is_featured: 0,
    },
    {
      id: 'silver-plan',
      name: 'Silver',
      slug: 'silver',
      price: 49,
      duration_months: 3,
      duration_days: 90,
      description: 'The sweet spot for dedicated lifters',
      benefits: JSON.stringify(['4 Days a Week', 'Dedicated Trainer Allocated', 'Personal Locker Included', 'Nutrition and Diet Guidance', 'Sauna and Steam Access']),
      features: JSON.stringify(['4 Days a Week', 'Dedicated Trainer Allocated', 'Personal Locker Included']),
      discount_percentage: 10,
      joining_fee: 0,
      is_active: 1,
      is_featured: 1,
    },
    {
      id: 'gold-plan',
      name: 'Gold',
      slug: 'gold',
      price: 49,
      duration_months: 6,
      duration_days: 180,
      description: 'Complete uncompromised elite membership',
      benefits: JSON.stringify(['7 Days a Week 24/7 Access', 'Dedicated Senior Coach', 'Personal Locker & Laundry', 'Full Nutrition & Diet Plan', 'Unlimited Guest Passes']),
      features: JSON.stringify(['7 Days a Week', 'Dedicated Senior Coach', 'Personal Locker & Laundry']),
      discount_percentage: 15,
      joining_fee: 0,
      is_active: 1,
      is_featured: 0,
    },
  ];

  const displayPlans = plans && plans.length > 0 ? plans : fallbackPlans;

  const parseBenefits = (raw: any): string[] => {
    if (Array.isArray(raw)) return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return ['Full Gym Access', 'Dedicated Trainer Support', 'Modern Equipment Access'];
    }
  };

  return (
    <section id="pricing" className="py-16 sm:py-20 bg-[#080811] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Matching reference: Member Price Plan) */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[#E91E63] text-sm font-semibold uppercase tracking-widest block mb-2 font-heading">
            Transparent Pricing
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight">
            Member Price Plan
          </h2>
          <p className="text-xs sm:text-sm text-[#B8B5C2] mt-2 mb-4">
            We provide the highest return on investment in your physical mastery with zero compromise.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#151522] border border-[#E91E63]/30 text-white text-xs font-bold uppercase tracking-wider hover:border-[#E91E63] transition-all"
          >
            <span>Compare Full Plan Matrix</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E91E63]" />
          </Link>
        </div>

        {/* Pricing Cards Grid (Matching reference layout with highlighted center card) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {displayPlans.slice(0, 3).map((plan, idx) => {
            const isFeatured = plan.is_featured === 1 || idx === 1;
            const benefitsList = parseBenefits(plan.benefits);

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-xl ${
                  isFeatured
                    ? 'bg-[#151522] border-2 border-[#E91E63] glow-accent md:-translate-y-3 z-10'
                    : 'bg-[#12121e] border border-[#E91E63]/25 hover:border-[#E91E63]/60'
                }`}
              >
                {/* Popular Badge */}
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Tag */}
                  <div className="mb-6">
                    <span className="text-xs uppercase font-bold tracking-widest text-[#E91E63]">
                      {plan.duration_months} Month{plan.duration_months > 1 ? 's' : ''} Membership
                    </span>
                    <h3 className="font-heading text-3xl font-bold text-white mt-1">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-gray-800">
                    <span className="font-heading text-5xl sm:text-6xl font-extrabold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-[#B8B5C2] font-medium">/ term</span>
                  </div>

                  {/* Checklist of benefits */}
                  <div className="space-y-4 mb-8">
                    {benefitsList.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#E91E63]/20 flex items-center justify-center text-[#E91E63] shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-sm text-[#B8B5C2]">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Join CTA */}
                <button
                  onClick={() => onOpenJoinModal(plan.id)}
                  className={`w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-lg ${
                    isFeatured
                      ? 'bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white hover:shadow-[#E91E63]/50 hover:scale-105 active:scale-95'
                      : 'bg-[#151522] border border-[#E91E63]/40 text-white hover:bg-[#E91E63] hover:border-[#E91E63]'
                  }`}
                >
                  Join Class
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
