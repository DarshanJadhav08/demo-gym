import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Dumbbell, UserCheck, CheckCircle2, X } from 'lucide-react';
import { WorkoutPlan } from '../../types';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const WorkoutManagement: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPlanForAssign, setSelectedPlanForAssign] = useState<string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const { success, error } = useNotification();

  const [newPlan, setNewPlan] = useState({
    plan_name: '',
    category: 'Muscle Building',
    difficulty: 'Intermediate',
    duration_weeks: 8,
    description: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [wList, cRes] = await Promise.all([api.getWorkouts(), api.getCustomers()]);
      setWorkouts(wList);
      setCustomers(cRes.customers || []);
    } catch (err: any) {
      error('Failed to load workouts', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.plan_name) {
      error('Missing name', 'Please enter a plan name.');
      return;
    }
    try {
      await api.createWorkout({
        plan: newPlan,
        exercises: [
          { day_of_week: 'Monday', exercise_name: 'Barbell Bench Press', sets: 4, reps: '8-10', weight_target: '80kg' },
          { day_of_week: 'Wednesday', exercise_name: 'Barbell Back Squat', sets: 4, reps: '6-8', weight_target: '120kg' },
          { day_of_week: 'Friday', exercise_name: 'Barbell Deadlift', sets: 4, reps: '5', weight_target: '150kg' },
        ]
      });
      success('Workout Created', `${newPlan.plan_name} has been added.`);
      setCreateModalOpen(false);
      loadData();
    } catch (err: any) {
      error('Failed to create workout', err.message);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedPlanForAssign) {
      error('Selection required', 'Choose both customer and workout plan.');
      return;
    }
    try {
      const today = new Date().toISOString().split('T')[0];
      const end = new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0];
      await api.assignWorkout({
        customer_id: selectedCustomerId,
        workout_plan_id: selectedPlanForAssign,
        start_date: today,
        end_date: end,
      });
      success('Plan Assigned!', 'Customer routine updated.');
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
            Exercise Programming
          </span>
          <h1 className="font-heading text-3xl font-bold text-white uppercase mt-0.5">
            Workout Management ({workouts.length})
          </h1>
          <p className="text-xs text-[#B8B5C2] mt-1">Design progressive overload routines and assign to gym members.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((w) => (
          <div
            key={w.id}
            className="p-6 rounded-3xl bg-[#151522] border border-[#E91E63]/25 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded bg-[#E91E63]/20 text-[#E91E63] text-[10px] font-bold uppercase">
                  {w.category}
                </span>
                <span className="text-xs text-gray-400">{w.duration_weeks} Weeks</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">{w.plan_name}</h3>
              <p className="text-xs text-[#B8B5C2] mb-4">{w.description || 'Targeted strength regimen.'}</p>

              <div className="space-y-1.5 mb-4 text-xs">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Sample Exercises</span>
                {(w.exercises || []).slice(0, 3).map((ex, idx) => (
                  <div key={idx} className="flex justify-between text-gray-300">
                    <span>{ex.exercise_name} ({ex.day_of_week})</span>
                    <span className="text-[#E91E63]">{ex.sets}x{ex.reps}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-400">Level: <strong className="text-white">{w.difficulty}</strong></span>
              <button
                onClick={() => {
                  setSelectedPlanForAssign(w.id);
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
              <h3 className="font-heading text-xl font-bold text-white uppercase">Assign Workout Routine</h3>
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
                  Confirm Assignment
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
              <h3 className="font-heading text-xl font-bold text-white uppercase">New Workout Protocol</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={newPlan.plan_name}
                  onChange={(e) => setNewPlan({ ...newPlan, plan_name: e.target.value })}
                  placeholder="e.g. 5x5 Power Progression"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Category</label>
                  <select
                    value={newPlan.category}
                    onChange={(e) => setNewPlan({ ...newPlan, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  >
                    <option value="Strength">Strength</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Building">Muscle Building</option>
                    <option value="Cardio">Cardio</option>
                    <option value="CrossFit">CrossFit</option>
                    <option value="Functional">Functional</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 uppercase mb-1">Difficulty</label>
                  <select
                    value={newPlan.difficulty}
                    onChange={(e) => setNewPlan({ ...newPlan, difficulty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold uppercase tracking-wider"
                >
                  Create Plan
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
