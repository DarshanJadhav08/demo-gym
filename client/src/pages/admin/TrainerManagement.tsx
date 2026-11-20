import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Search, Edit, Trash2, Eye, X, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { Trainer } from '../../types';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const TrainerManagement: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTrainer, setEditTrainer] = useState<Trainer | null>(null);
  const [detailTrainer, setDetailTrainer] = useState<any | null>(null);
  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    full_name: '',
    profile_image: '',
    mobile_number: '',
    email: '',
    gender: 'Male',
    specialization: '',
    qualifications: '',
    experience: '5 Years',
    salary: 60000,
    employment_type: 'Full-time' as const,
    availability: 'Mon-Sat: 06:00 AM - 02:00 PM',
    description: '',
    status: 'active' as const,
  });

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const res = await api.getTrainers({ search });
      setTrainers(res);
    } catch (err: any) {
      error('Failed to load trainers', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, [search]);

  const handleOpenAdd = () => {
    setEditTrainer(null);
    setFormData({
      full_name: '',
      profile_image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=400',
      mobile_number: '',
      email: '',
      gender: 'Male',
      specialization: 'Hypertrophy & Strength',
      qualifications: 'CSCS, ISSA Master Coach',
      experience: '5 Years',
      salary: 60000,
      employment_type: 'Full-time',
      availability: 'Mon-Sat: 06:00 AM - 02:00 PM',
      description: 'Expert strength conditioning coach.',
      status: 'active',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t: Trainer) => {
    setEditTrainer(t);
    setFormData({
      full_name: t.full_name,
      profile_image: t.profile_image || '',
      mobile_number: t.mobile_number,
      email: t.email,
      gender: t.gender || 'Male',
      specialization: t.specialization,
      qualifications: t.qualifications || '',
      experience: t.experience,
      salary: t.salary || 0,
      employment_type: t.employment_type || 'Full-time',
      availability: t.availability || 'Mon-Sat: 06:00 AM - 02:00 PM',
      description: t.description || '',
      status: t.status,
    });
    setModalOpen(true);
  };

  const handleViewDetail = async (id: string) => {
    try {
      const data = await api.getTrainerById(id);
      setDetailTrainer(data);
    } catch (err: any) {
      error('Failed to load trainer details', err.message);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.mobile_number || !formData.email || !formData.specialization) {
      error('Missing fields', 'Please enter name, mobile, email, and specialization.');
      return;
    }

    try {
      if (editTrainer) {
        await api.updateTrainer(editTrainer.id, formData);
        success('Trainer Updated', `${formData.full_name} updated successfully.`);
      } else {
        await api.createTrainer(formData);
        success('Trainer Created', `New coach registered.`);
      }
      setModalOpen(false);
      loadTrainers();
    } catch (err: any) {
      error('Operation Failed', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this trainer?')) return;
    try {
      await api.deleteTrainer(id);
      success('Trainer Removed', 'Coach removed from system.');
      loadTrainers();
    } catch (err: any) {
      error('Delete Failed', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151522] p-6 rounded-3xl border border-[#E91E63]/30 shadow-xl">
        <div>
          <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest font-heading">
            Coaching Faculty
          </span>
          <h1 className="font-heading text-3xl font-bold text-white uppercase mt-0.5">
            Trainer Management ({trainers.length})
          </h1>
          <p className="text-xs text-[#B8B5C2] mt-1">Manage accredited coaches, schedules, and customer allocations.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Trainer</span>
        </button>
      </div>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((t) => (
          <div
            key={t.id}
            className="rounded-3xl bg-[#151522] border border-[#E91E63]/25 p-6 shadow-xl flex flex-col justify-between hover:border-[#E91E63]/60 transition-all"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={t.profile_image || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=200'}
                  alt={t.full_name}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#E91E63]/50 shrink-0"
                />
                <div className="overflow-hidden">
                  <span className="font-mono text-[11px] font-bold text-[#E91E63]">{t.trainer_code}</span>
                  <h3 className="font-heading text-xl font-bold text-white truncate">{t.full_name}</h3>
                  <p className="text-xs text-gray-300 font-semibold">{t.specialization}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#B8B5C2] mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#E91E63] shrink-0" />
                  <span>{t.experience} Experience • {t.employment_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{t.mobile_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{t.email}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 line-clamp-2 italic mb-4">
                "{t.description || 'Dedicated to scientific progressive resistance training.'}"
              </p>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-300'}`}>
                {t.status}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewDetail(t.id)}
                  title="View Assigned Athletes & Classes"
                  className="p-1.5 rounded-lg bg-[#10101C] border border-gray-800 text-gray-300 hover:text-white hover:border-[#E91E63]"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenEdit(t)}
                  title="Edit Trainer"
                  className="p-1.5 rounded-lg bg-[#10101C] border border-gray-800 text-gray-300 hover:text-white hover:border-[#E91E63]"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  title="Remove Trainer"
                  className="p-1.5 rounded-lg bg-[#10101C] border border-gray-800 text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trainer Detail Modal */}
      {detailTrainer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-[#151522] rounded-3xl p-6 sm:p-8 border border-[#E91E63]/40 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <img src={detailTrainer.profile_image} alt={detailTrainer.full_name} className="w-12 h-12 rounded-xl object-cover border border-[#E91E63]" />
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">{detailTrainer.full_name}</h3>
                  <p className="text-xs text-[#E91E63] font-mono">{detailTrainer.trainer_code}</p>
                </div>
              </div>
              <button onClick={() => setDetailTrainer(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#10101C] border border-gray-800">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Qualifications</span>
                <p className="text-white font-medium mt-0.5">{detailTrainer.qualifications || 'Certified Professional'}</p>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold mb-2">
                  Assigned Athletes ({(detailTrainer.clients || []).length})
                </span>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {(detailTrainer.clients || []).length === 0 ? (
                    <p className="text-gray-500 italic">No customers currently assigned to this coach.</p>
                  ) : (
                    detailTrainer.clients.map((c: any) => (
                      <div key={c.id} className="p-2.5 rounded-xl bg-[#10101C] flex items-center justify-between">
                        <span className="text-white font-bold">{c.full_name}</span>
                        <span className="text-[10px] text-[#E91E63] font-mono">{c.customer_code}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800 text-right">
              <button onClick={() => setDetailTrainer(null)} className="px-5 py-2 rounded-xl bg-[#10101C] text-white text-xs font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-xl w-full bg-[#151522] rounded-3xl overflow-hidden border border-[#E91E63]/40 shadow-2xl my-8">
            <div className="p-6 bg-[#10101C] border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-heading text-2xl font-bold text-white uppercase">
                {editTrainer ? 'Edit Trainer Profile' : 'Register New Coach'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Specialization *</label>
                  <input
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Salary</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Qualifications</label>
                <input
                  type="text"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  placeholder="e.g. CSCS, ISSA Master Coach, Sports Science B.Sc."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold text-xs uppercase tracking-wider"
                >
                  {editTrainer ? 'Save Trainer' : 'Add Coach'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-gray-400 text-xs font-semibold"
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
