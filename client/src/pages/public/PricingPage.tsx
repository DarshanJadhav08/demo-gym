import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Footer } from '../../components/public/Footer';
import { FloatingWhatsApp } from '../../components/public/FloatingWhatsApp';
import { MembershipApplicationModal } from '../../components/public/modals/MembershipApplicationModal';
import { FreePassModal } from '../../components/public/FreePassModal';
import { Check, X as XIcon, Sparkles, ArrowRight, ShieldCheck, Flame, HelpCircle } from 'lucide-react';
import { api } from '../../services/api';
import { MembershipPlan } from '../../types';

export const PricingPage: React.FC = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(undefined);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await api.getMembershipPlans();
        setPlans(data || []);
      } catch (err) {
        console.error('Failed to load plans:', err);
      }
    };
    fetchPlans();
  }, []);

  const fallbackPlans: MembershipPlan[] = [
    {
      id: 'bronze-plan',
      name: 'Bronze Standard',
      slug: 'bronze',
      price: 49,
      duration_months: 1,
      duration_days: 30,
      description: 'Essential gym access for beginners',
      benefits: JSON.stringify(['3 Days a Week Access', 'Dedicated Trainer Allocated', 'Standard Locker Room', 'Free Towel Service']),
      features: JSON.stringify(['Standard Equipment', 'Locker Room']),
      discount_percentage: 0,
      joining_fee: 15,
      is_active: 1,
      is_featured: 0,
    },
    {
      id: 'silver-plan',
      name: 'Silver Strength',
      slug: 'silver',
      price: 89,
      duration_months: 3,
      duration_days: 90,
      description: 'The sweet spot for dedicated lifters',
      benefits: JSON.stringify(['5 Days a Week Access', 'Dedicated Trainer Allocated', 'Personal Locker Included', 'Nutrition Guidance', 'Sauna and Steam Access']),
      features: JSON.stringify(['Full Equipment', 'Dedicated Trainer', 'Sauna Access']),
      discount_percentage: 10,
      joining_fee: 0,
      is_active: 1,
      is_featured: 1,
    },
    {
      id: 'gold-plan',
      name: 'Gold Power Elite',
      slug: 'gold',
      price: 139,
      duration_months: 6,
      duration_days: 180,
      description: 'Comprehensive transformation package',
      benefits: JSON.stringify(['7 Days a Week 24/7 Access', 'Senior Coach Consultations', 'Personal Locker & Laundry', 'Full Nutrition & Diet Plan', '2 Guest Passes / Month', 'Bi-monthly InBody Scans']),
      features: JSON.stringify(['24/7 Access', 'InBody Scans', 'Diet Plan', 'Sauna & Steam']),
      discount_percentage: 15,
      joining_fee: 0,
      is_active: 1,
      is_featured: 0,
    },
    {
      id: 'apex-black-vip',
      name: 'Apex Black VIP',
      slug: 'apex-black-vip',
      price: 249,
      duration_months: 12,
      duration_days: 365,
      description: 'The pinnacle luxury athletic membership',
      benefits: JSON.stringify(['Unrestricted 24/7 All-Zone Access', 'Dedicated Master Coach Assigned', 'Full Custom Meal Plan & Adjustments', 'Private VIP Locker & Laundry', 'Unlimited Guest Passes', 'Complimentary Gym Apparel Kit', 'Priority Class Booking', 'Unlimited Cryo & Sauna']),
      features: JSON.stringify(['Master Coach', 'Unlimited Cryo/Sauna', 'VIP Lounge', 'Apparel Kit']),
      discount_percentage: 25,
      joining_fee: 0,
      is_active: 1,
      is_featured: 1,
    },
  ];

  const displayPlans = plans.length > 0 ? plans : fallbackPlans;

  const handleOpenJoin = (planId?: string) => {
    setSelectedPlanId(planId);
    setIsJoinModalOpen(true);
  };

  const comparisonFeatures = [
    { title: 'Olympic Barbell & Eleiko Free Weights', bronze: true, silver: true, gold: true, vip: true },
    { title: '24/7 Biometric Smart Key Access', bronze: false, silver: false, gold: true, vip: true },
    { title: 'Dedicated Trainer Assigned', bronze: 'General', silver: 'Staff Coach', gold: 'Senior Coach', vip: 'Master Coach' },
    { title: 'Contrast Cryo & Infrared Sauna', bronze: false, silver: '1x / week', gold: 'Unlimited', vip: 'Unlimited + Private' },
    { title: 'InBody 770 Clinical Body Scans', bronze: 'Paid Add-on', silver: 'Monthly', gold: 'Bi-Weekly', vip: 'Unlimited On-Demand' },
    { title: 'Custom Diet & Macro Chart', bronze: false, silver: 'Standard', gold: 'Tailored', vip: 'Bespoke Weekly' },
    { title: 'Private VIP Locker & Towel Service', bronze: 'Standard', silver: 'Standard', gold: 'Dedicated', vip: 'Private VIP Suite' },
    { title: 'Monthly Guest Passes', bronze: '0', silver: '1 pass', gold: '2 passes', vip: 'Unlimited' },
    { title: 'DemoFit Apparel & Welcome Merchandise Kit', bronze: false, silver: false, gold: false, vip: true },
  ];

  return (
    <div className="bg-[#080811] text-white min-h-screen">
      <Navbar onOpenJoinModal={() => handleOpenJoin()} />

      {/* Hero Header */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-14 bg-gradient-to-b from-[#10101C] via-[#080811] to-[#080811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E91E63]/15 border border-[#E91E63]/40 text-[#E91E63] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Investment in Excellence</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase mb-6">
            MEMBERSHIP <span className="text-gradient">PRICING PLANS</span>
          </h1>
          <p className="text-base sm:text-xl text-[#B8B5C2] max-w-3xl mx-auto leading-relaxed mb-10">
            No hidden maintenance fees. No locking contracts. Select the tier that matches your physical ambition.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#151522] border border-[#E91E63]/30">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#E91E63] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Standard Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-[#E91E63] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Annual Privilege</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-extrabold text-black">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-[#10101C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {displayPlans.map((plan) => {
              const isFeatured = plan.is_featured === 1;
              const benefits: string[] = typeof plan.benefits === 'string'
                ? JSON.parse(plan.benefits || '[]')
                : (plan.benefits || []);
              const price = billingCycle === 'annual'
                ? Math.round(plan.price * 0.8)
                : plan.price;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                    isFeatured
                      ? 'bg-gradient-to-b from-[#1c1224] via-[#151522] to-[#151522] border-2 border-[#E91E63] shadow-2xl scale-105 z-10'
                      : 'bg-[#151522] border border-[#E91E63]/25 hover:border-[#E91E63] shadow-xl'
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E91E63] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-lg">
                      Most Popular Tier
                    </div>
                  )}

                  <div>
                    <h3 className="font-heading text-2xl font-bold uppercase text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[#B8B5C2] min-h-[36px] mb-6">
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-gray-800">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white font-heading">
                        ${price}
                      </span>
                      <span className="text-xs text-gray-400 uppercase font-semibold">
                        / {billingCycle === 'annual' ? 'month billed annually' : 'month'}
                      </span>
                    </div>

                    <div className="space-y-3 mb-8">
                      {benefits.map((b: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                          <Check className="w-4 h-4 text-[#E91E63] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleOpenJoin(plan.id)}
                      className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg ${
                        isFeatured
                          ? 'bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white hover:scale-105 active:scale-95 shadow-[#E91E63]/40'
                          : 'bg-[#10101C] border border-[#E91E63]/40 text-white hover:bg-[#E91E63] hover:border-[#E91E63]'
                      }`}
                    >
                      Apply For {plan.name}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Side-by-Side Comparison Matrix */}
      <section className="py-20 bg-[#080811] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest block mb-2 font-heading">
              Complete Transparency
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase">
              TIER COMPARISON MATRIX
            </h2>
            <p className="text-xs sm:text-sm text-[#B8B5C2] mt-2">
              Compare features, equipment permissions, and luxury privileges across our tiers.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#E91E63]/30 bg-[#151522] shadow-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#10101C] border-b border-gray-800 text-gray-400 uppercase font-heading text-sm">
                  <th className="p-5 font-bold text-white">Privileges & Features</th>
                  <th className="p-5 font-bold text-center">Bronze</th>
                  <th className="p-5 font-bold text-center">Silver</th>
                  <th className="p-5 font-bold text-center text-[#E91E63]">Gold Power</th>
                  <th className="p-5 font-bold text-center text-amber-400">Apex VIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#10101C]/60 transition-colors">
                    <td className="p-5 font-semibold text-white">{row.title}</td>

                    {/* Bronze */}
                    <td className="p-5 text-center">
                      {typeof row.bronze === 'boolean' ? (
                        row.bronze ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <XIcon className="w-4 h-4 text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-gray-300 font-medium">{row.bronze}</span>
                      )}
                    </td>

                    {/* Silver */}
                    <td className="p-5 text-center">
                      {typeof row.silver === 'boolean' ? (
                        row.silver ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <XIcon className="w-4 h-4 text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-gray-300 font-medium">{row.silver}</span>
                      )}
                    </td>

                    {/* Gold */}
                    <td className="p-5 text-center bg-[#E91E63]/5">
                      {typeof row.gold === 'boolean' ? (
                        row.gold ? <Check className="w-4 h-4 text-[#E91E63] mx-auto" /> : <XIcon className="w-4 h-4 text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-white font-bold">{row.gold}</span>
                      )}
                    </td>

                    {/* VIP */}
                    <td className="p-5 text-center bg-amber-500/5">
                      {typeof row.vip === 'boolean' ? (
                        row.vip ? <Check className="w-4 h-4 text-amber-400 mx-auto" /> : <XIcon className="w-4 h-4 text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-amber-400 font-bold">{row.vip}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Free Day Pass Callout */}
      <section className="py-16 bg-[#10101C] border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Risk First Experience</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-white mb-3">
            NOT READY TO COMMIT? TRY US FREE FOR 1 DAY.
          </h2>
          <p className="text-xs sm:text-sm text-[#B8B5C2] max-w-xl mx-auto mb-6">
            Get instant guest access to the training arena, Eleiko calibrated plates, and contrast recovery saunas with zero sales pressure.
          </p>
          <button
            onClick={() => setIsPassModalOpen(true)}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs uppercase tracking-wider shadow-xl transition-all"
          >
            Claim Instant Free Day Pass
          </button>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />

      <MembershipApplicationModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        selectedPlanId={selectedPlanId}
      />
      <FreePassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />
    </div>
  );
};
