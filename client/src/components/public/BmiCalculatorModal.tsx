import React, { useState } from 'react';
import { X, Calculator, Activity, ArrowRight, Sparkles } from 'lucide-react';

interface BmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: () => void;
}

export const BmiCalculatorModal: React.FC<BmiCalculatorModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(75);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState<number>(1.55); // moderate
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    color: string;
    tdee: number;
    targetProtein: number;
    recommendedProgram: string;
  } | null>(null);

  if (!isOpen) return null;

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const hM = height / 100;
    const bmiVal = Number((weight / (hM * hM)).toFixed(1));

    let cat = 'Normal Weight';
    let col = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    let rec = 'Strength & Muscle Hypertrophy Split';

    if (bmiVal < 18.5) {
      cat = 'Underweight';
      col = 'text-blue-400 border-blue-500/40 bg-blue-500/10';
      rec = 'Hypertrophy Mass Builder (High Caloric Surplus)';
    } else if (bmiVal >= 25 && bmiVal < 29.9) {
      cat = 'Overweight';
      col = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      rec = 'Metabolic Body Recomposition & Fat Loss';
    } else if (bmiVal >= 30) {
      cat = 'Obese';
      col = 'text-rose-400 border-rose-500/40 bg-rose-500/10';
      rec = 'Low-Impact Resistance & Cardio Circuit';
    }

    // Basal Metabolic Rate (Mifflin-St Jeor)
    const bmr = gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * 28 + 5
      : 10 * weight + 6.25 * height - 5 * 28 - 161;
    const tdeeVal = Math.round(bmr * activity);
    const proteinVal = Math.round(weight * 2.0); // 2g per kg

    setResult({
      bmi: bmiVal,
      category: cat,
      color: col,
      tdee: tdeeVal,
      targetProtein: proteinVal,
      recommendedProgram: rec,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-xl w-full bg-[#151522] rounded-3xl border border-[#E91E63]/40 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#571638] flex items-center justify-center text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
                Interactive BMI & Macro Calculator
              </h3>
              <p className="text-xs text-[#B8B5C2]">Biometric assessment for customized training</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#10101C]">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={calculate} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    gender === 'male'
                      ? 'bg-[#E91E63] border-[#E91E63] text-white'
                      : 'bg-[#10101C] border-gray-800 text-gray-400'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    gender === 'female'
                      ? 'bg-[#E91E63] border-[#E91E63] text-white'
                      : 'bg-[#10101C] border-gray-800 text-gray-400'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Daily Activity</label>
              <select
                value={activity}
                onChange={(e) => setActivity(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
              >
                <option value={1.2}>Sedentary (Desk Job)</option>
                <option value={1.375}>Lightly Active (1-3 days/wk)</option>
                <option value={1.55}>Moderately Active (3-5 days/wk)</option>
                <option value={1.725}>Very Active (6-7 days/wk)</option>
                <option value={1.9}>Elite Athlete / Heavy Physical Job</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Height (cm)</label>
              <input
                type="number"
                min="120"
                max="230"
                required
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#E91E63]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Weight (kg)</label>
              <input
                type="number"
                min="35"
                max="220"
                required
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#E91E63]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#A51C55] via-[#E91E63] to-[#A51C55] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 transition-all flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>Calculate Precision Metrics</span>
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-6 p-5 rounded-2xl bg-[#10101C] border border-[#E91E63]/30 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <span className="text-xs text-gray-400">Your Body Mass Index</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold text-white font-heading">{result.bmi}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${result.color}`}>
                    {result.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400">Daily Calorie Target (TDEE)</span>
                <p className="text-xl font-bold text-[#E91E63] font-heading">{result.tdee} kcal/day</p>
                <p className="text-[11px] text-gray-400">Daily Protein: ~{result.targetProtein}g</p>
              </div>
            </div>

            <div className="mt-3">
              <span className="text-[11px] text-gray-400 uppercase font-semibold block">Recommended Apex Protocol:</span>
              <p className="text-sm font-bold text-white mt-0.5">{result.recommendedProgram}</p>
            </div>

            {onSelectPlan && (
              <button
                onClick={() => {
                  onClose();
                  onSelectPlan();
                }}
                className="mt-4 w-full py-2.5 rounded-xl bg-[#151522] border border-[#E91E63]/40 hover:border-[#E91E63] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>View Recommended Memberships</span>
                <ArrowRight className="w-4 h-4 text-[#E91E63]" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
