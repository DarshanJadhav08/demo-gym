import React, { useState, useEffect } from 'react';
import { Apple, Plus, Utensils, X, UserCheck } from 'lucide-react';
import { DietPlan } from '../../types';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const DietManagement: React.FC = () => {
  const [diets, setDiets] = useState<DietPlan[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedDietId, setSelectedDietId] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const { success, error } = useNotification();

  const [newDiet, setNewDiet] = useState({
    plan_name: '',
    goal: 'Muscle Gain' as const,
    target_calories: 2500,
    protein_grams: 180,
    carbs_grams: 250,
    fats_grams: 70,
    water_liters: 3.5,
    breakfast: '4 eggs scrambled, 100g oats with berries',
    lunch: '200g chicken breast, 250g rice, steamed greens',
    dinner: '200g salmon or steak, sweet potato, salad',
    snacks: 'Protein shake with almonds',
    dietary_notes: 'Drink 500ml water immediately on waking.',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [dList, cRes] = await Promise.all([api.getDiets(), api.getCustomers()]);
      setDiets(dList);
      setCustomers(cRes.customers || []);
    } catch (err: any) {
      error('Failed to load diets', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiet.plan_name) {
      error('Missing name', 'Please enter a plan name.');
      return;
    }
    try {
      await api.createDiet(newDiet);
      success('Diet Plan Created', `${newDiet.plan_name} added.`);
      setCreateModalOpen(false);
      loadData();
    } catch (err: any) {
      error('Failed to create diet', err.message);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedDietId) {
      error('Selection required', 'Choose both athlete and diet plan.');
      return;
    }
    try {
      const today = new Date().toISOString().split('T')[0];
      const end = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0];
      await api.assignDiet({
        customer_id: selectedCustomerId,
        diet_plan_id: selectedDietId,
        start_date: today,
        end_date: end,
      });
      success('Diet Plan Assigned!', 'Nutrition targets linked to member profile.');
      setAssignModalOpen(false);
    } catch (err: any) {
      error('Assignment Error', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151522] p-6 rounded-3xl border border-[#E91E63]/30 shadow-xl">
        <div>
          <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest font-heading">
            Nutritional Architecture
          </span>
          <h1 className="font-heading text-3xl font-bold text-white uppercase mt-0.5">
            Diet Management ({diets.length})
          </h1>
          <p className="text-xs text-[#B8B5C2] mt-1">Design tailored macro splits and assign caloric programs.</p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Diet Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {diets.map((d) => (
          <div
            key={d.id}
            className="p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/25 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                  {d.goal}
                </span>
                <span className="font-bold text-white text-xs">{d.target_calories} kCal</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-3">{d.plan_name}</h3>

              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                <div className="p-2 rounded-xl bg-[#10101C]">
                  <span className="text-gray-400 block text-[9px]">Protein</span>
                  <span className="font-bold text-white">{d.protein_grams}g</span>
                </div>
                <div className="p-2 rounded-xl bg-[#10101C]">
                  <span className="text-gray-400 block text-[9px]">Carbs</span>
                  <span className="font-bold text-white">{d.carbs_grams}g</span>
                </div>
                <div className="p-2 rounded-xl bg-[#10101C]">
                  <span className="text-gray-400 block text-[9px]">Fats</span>
                  <span className="font-bold text-white">{d.fats_grams}g</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#B8B5C2] mb-4">
                <p className="line-clamp-1"><strong className="text-white">B:</strong> {d.breakfast}</p>
                <p className="line-clamp-1"><strong className="text-white">L:</strong> {d.lunch}</p>
                <p className="line-clamp-1"><strong className="text-white">D:</strong> {d.dinner}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-400">Water: {d.water_liters}L/day</span>
              <button
                onClick={() => {
                  setSelectedDietId(d.id);
                  setAssignModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#10101C] border border-[#E91E63]/40 text-[#E91E63] hover:bg-[#E91E63] hover:text-white text-xs font-semibold transition-colors"
              >
                Assign to Athlete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#151522] rounded-3xl p-6 border border-[#E91E63]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <h3 className="font-heading text-xl font-bold text-white uppercase">Assign Nutrition Plan</h3>
              <button onClick={() => setAssignModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssign} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Select Customer</label>
                <select
                  required
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                >
                  <option value="">-- Choose Athlete --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.customer_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold uppercase tracking-wider"
                >
                  Confirm Diet Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-[#10101C] text-gray-400 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#151522] rounded-3xl p-6 border border-[#E91E63]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <h3 className="font-heading text-xl font-bold text-white uppercase">New Nutrition Plan</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={newDiet.plan_name}
                  onChange={(e) => setNewDiet({ ...newDiet, plan_name: e.target.value })}
                  placeholder="e.g. Clean Lean Bulk 3000 Cal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Goal</label>
                  <select
                    value={newDiet.goal}
                    onChange={(e) => setNewDiet({ ...newDiet, goal: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Keto">Keto</option>
                    <option value="Athletic">Athletic</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Target Calories</label>
                  <input
                    type="number"
                    value={newDiet.target_calories}
                    onChange={(e) => setNewDiet({ ...newDiet, target_calories: parseInt(e.target.value, 10) || 2000 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={newDiet.protein_grams}
                    onChange={(e) => setNewDiet({ ...newDiet, protein_grams: parseInt(e.target.value, 10) || 150 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={newDiet.carbs_grams}
                    onChange={(e) => setNewDiet({ ...newDiet, carbs_grams: parseInt(e.target.value, 10) || 200 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Fats (g)</label>
                  <input
                    type="number"
                    value={newDiet.fats_grams}
                    onChange={(e) => setNewDiet({ ...newDiet, fats_grams: parseInt(e.target.value, 10) || 60 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Breakfast</label>
                <input
                  type="text"
                  value={newDiet.breakfast}
                  onChange={(e) => setNewDiet({ ...newDiet, breakfast: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Lunch</label>
                <input
                  type="text"
                  value={newDiet.lunch}
                  onChange={(e) => setNewDiet({ ...newDiet, lunch: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Dinner</label>
                <input
                  type="text"
                  value={newDiet.dinner}
                  onChange={(e) => setNewDiet({ ...newDiet, dinner: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold uppercase tracking-wider"
                >
                  Save Diet Plan
                </button>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-[#10101C] text-gray-400 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
