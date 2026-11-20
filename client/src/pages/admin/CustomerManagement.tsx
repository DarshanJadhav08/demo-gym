import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Customer, Trainer, MembershipPlan } from '../../types';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trainerFilter, setTrainerFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { success, error } = useNotification();

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    profile_photo: '',
    gender: 'Male',
    date_of_birth: '1995-01-01',
    mobile_number: '',
    email: '',
    address: '',
    emergency_contact: '',
    joining_date: new Date().toISOString().split('T')[0],
    height: 175,
    weight: 75,
    blood_group: 'O+',
    medical_notes: '',
    assigned_trainer_id: '',
    membership_plan_id: '',
    status: 'active',
  });

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.getCustomers({
        search,
        status: statusFilter,
        trainerId: trainerFilter,
        planId: planFilter,
      });
      setCustomers(res.customers || []);
      setTotal(res.total || 0);
    } catch (err: any) {
      error('Failed to load customers', err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAuxiliaryData = async () => {
    try {
      const [tList, pList] = await Promise.all([api.getTrainers(), api.getPlans()]);
      setTrainers(tList);
      setPlans(pList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAuxiliaryData();
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [search, statusFilter, trainerFilter, planFilter]);

  const handleOpenAdd = () => {
    setEditCustomer(null);
    setFormData({
      full_name: '',
      profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      gender: 'Male',
      date_of_birth: '1995-01-01',
      mobile_number: '',
      email: '',
      address: '',
      emergency_contact: '',
      joining_date: new Date().toISOString().split('T')[0],
      height: 175,
      weight: 75,
      blood_group: 'O+',
      medical_notes: '',
      assigned_trainer_id: trainers[0]?.id || '',
      membership_plan_id: plans[0]?.id || '',
      status: 'active',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cust: Customer) => {
    setEditCustomer(cust);
    setFormData({
      full_name: cust.full_name,
      profile_photo: cust.profile_photo || '',
      gender: cust.gender,
      date_of_birth: cust.date_of_birth,
      mobile_number: cust.mobile_number,
      email: cust.email,
      address: cust.address,
      emergency_contact: cust.emergency_contact,
      joining_date: cust.joining_date,
      height: cust.height || 175,
      weight: cust.weight || 75,
      blood_group: cust.blood_group || 'O+',
      medical_notes: cust.medical_notes || '',
      assigned_trainer_id: cust.assigned_trainer_id || '',
      membership_plan_id: cust.membership_plan_id || '',
      status: cust.status,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.mobile_number || !formData.email) {
      error('Missing fields', 'Please enter customer name, mobile, and email.');
      return;
    }

    try {
      if (editCustomer) {
        await api.updateCustomer(editCustomer.id, formData);
        success('Customer Updated', `${formData.full_name} has been updated.`);
      } else {
        await api.createCustomer(formData);
        success('Customer Added', `Customer record created successfully.`);
      }
      setModalOpen(false);
      loadCustomers();
    } catch (err: any) {
      error('Operation Failed', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCustomer(id);
      success('Customer Removed', 'Customer record deleted from database.');
      setDeleteConfirmId(null);
      loadCustomers();
    } catch (err: any) {
      error('Delete Failed', err.message);
    }
  };

  const exportCSV = () => {
    const headers = ['Code,Name,Email,Mobile,Status,Joining Date,Trainer,Plan'];
    const rows = customers.map(
      (c) =>
        `"${c.customer_code}","${c.full_name}","${c.email}","${c.mobile_number}","${c.status}","${c.joining_date}","${c.trainer_name || ''}","${c.plan_name || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_gym_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151522] p-6 rounded-3xl border border-[#E91E63]/30 shadow-xl">
        <div>
          <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest font-heading">
            Athletes Directory
          </span>
          <h1 className="font-heading text-3xl font-bold text-white uppercase mt-0.5">
            Customer Management ({total})
          </h1>
          <p className="text-xs text-[#B8B5C2] mt-1">Manage memberships, progress, profiles, and active records.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-xs font-semibold text-gray-300 hover:text-white hover:border-[#E91E63] transition-colors"
          >
            <Download className="w-4 h-4 text-[#E91E63]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-[#151522] border border-gray-800/80 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, mobile, code, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E91E63]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-xs text-white focus:outline-none focus:border-[#E91E63]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Trainer Filter */}
          <select
            value={trainerFilter}
            onChange={(e) => setTrainerFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-xs text-white focus:outline-none focus:border-[#E91E63]"
          >
            <option value="all">All Trainers</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.full_name}
              </option>
            ))}
          </select>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-xs text-white focus:outline-none focus:border-[#E91E63]"
          >
            <option value="all">All Plans</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="rounded-3xl bg-[#151522] border border-[#E91E63]/25 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#10101C] text-gray-400 uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Assigned Trainer</th>
                <th className="p-4">Membership Plan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No gym customers match the selected criteria.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#10101C]/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#E91E63]">
                      <Link to={`/admin/customers/${c.id}`} className="hover:underline">
                        {c.customer_code}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                          alt={c.full_name}
                          className="w-9 h-9 rounded-full object-cover border border-[#E91E63]/40"
                        />
                        <div>
                          <Link to={`/admin/customers/${c.id}`} className="font-bold text-white hover:text-[#E91E63] transition-colors block">
                            {c.full_name}
                          </Link>
                          <span className="text-[10px] text-gray-400">{c.gender} • Joined {c.joining_date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">{c.mobile_number}</p>
                      <p className="text-[10px] text-gray-400">{c.email}</p>
                    </td>
                    <td className="p-4">
                      {c.trainer_name ? (
                        <span className="text-white font-medium">{c.trainer_name}</span>
                      ) : (
                        <span className="text-gray-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      {c.plan_name ? (
                        <span className="px-2.5 py-1 rounded-lg bg-[#E91E63]/15 text-[#E91E63] font-bold">
                          {c.plan_name}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">No Active Plan</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          c.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : c.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/customers/${c.id}`}
                          title="View 11-Tab Profile"
                          className="p-1.5 rounded-lg bg-[#10101C] border border-gray-800 text-gray-300 hover:text-white hover:border-[#E91E63] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          title="Edit Customer"
                          className="p-1.5 rounded-lg bg-[#10101C] border border-gray-800 text-gray-300 hover:text-white hover:border-[#E91E63] transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(c.id)}
                          title="Delete Customer"
                          className="p-1.5 rounded-lg bg-[#10101C] border border-gray-800 text-gray-400 hover:text-red-400 hover:border-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-2xl w-full bg-[#151522] rounded-3xl overflow-hidden border border-[#E91E63]/40 shadow-2xl my-8 animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-[#10101C] border-b border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest font-heading">
                  {editCustomer ? 'Update Record' : 'New Enrollment'}
                </span>
                <h3 className="font-heading text-2xl font-bold text-white uppercase mt-0.5">
                  {editCustomer ? `Edit: ${editCustomer.full_name}` : 'Register New Customer'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Home Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Residential address..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                    placeholder="Contact name and phone number..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Blood Group
                  </label>
                  <input
                    type="text"
                    value={formData.blood_group}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Assigned Trainer
                  </label>
                  <select
                    value={formData.assigned_trainer_id}
                    onChange={(e) => setFormData({ ...formData, assigned_trainer_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
                  >
                    <option value="">None / Unassigned</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Membership Plan
                  </label>
                  <select
                    value={formData.membership_plan_id}
                    onChange={(e) => setFormData({ ...formData, membership_plan_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
                  >
                    <option value="">No Plan</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Medical Notes / Limitations
                </label>
                <textarea
                  rows={2}
                  value={formData.medical_notes}
                  onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
                  placeholder="e.g. Cleared for heavy lifting, previous ACL repair..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#E91E63] resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[#E91E63]/40 transition-all"
                >
                  {editCustomer ? 'Save Customer Changes' : 'Confirm Customer Registration'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-gray-400 text-xs font-semibold hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151522] rounded-3xl p-6 border border-red-500/40 shadow-2xl max-w-sm w-full text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="font-heading text-xl font-bold text-white uppercase">Confirm Deletion</h3>
            <p className="text-xs text-[#B8B5C2] mt-2 mb-6">
              Are you sure you want to delete this customer record? All linked memberships, attendance, and workout records will be deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-gray-400 text-xs font-semibold hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
