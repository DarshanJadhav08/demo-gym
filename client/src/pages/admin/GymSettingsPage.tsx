import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const GymSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    gym_name: 'APEX ELITE FITNESS',
    phone: '+91 98765 43210',
    email: 'contact@apexelite.com',
    address: '700 Olympus Boulevard, Mumbai',
    opening_hours: 'Mon - Sun: 05:00 AM - 11:00 PM',
    stats_members: 2250,
    stats_trainers: 520,
    stats_equipment: 520,
    stats_programs: 45,
    social_instagram: 'https://instagram.com/apexelitefitness',
    social_facebook: 'https://facebook.com/apexelitefitness',
    social_youtube: 'https://youtube.com/apexelitefitness',
  });
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotification();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.updateSettings(settings);
      success('Settings Saved', 'Global gym information and homepage counters updated.');
    } catch (err: any) {
      error('Save Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#151522] p-6 rounded-3xl border border-[#E91E63]/30 shadow-xl">
        <span className="text-[#E91E63] text-xs font-bold uppercase tracking-widest font-heading">
          Global Configurations
        </span>
        <h1 className="font-heading text-3xl font-bold text-white uppercase mt-0.5">
          Gym Brand Settings
        </h1>
        <p className="text-xs text-[#B8B5C2] mt-1">Configure brand details, public contact info, and website counter values.</p>
      </div>

      <form onSubmit={handleSave} className="bg-[#151522] p-8 rounded-3xl border border-[#E91E63]/25 shadow-xl space-y-6 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold text-gray-300 uppercase mb-1">Gym Name</label>
            <input
              type="text"
              value={settings.gym_name}
              onChange={(e) => setSettings({ ...settings, gym_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-300 uppercase mb-1">Official Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold text-gray-300 uppercase mb-1">Contact Phone</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-300 uppercase mb-1">Opening Hours</label>
            <input
              type="text"
              value={settings.opening_hours}
              onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-300 uppercase mb-1">Physical Address</label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#10101C] border border-gray-800 text-white"
          />
        </div>

        <div className="pt-4 border-t border-gray-800">
          <h3 className="font-heading text-lg font-bold text-white uppercase mb-4">Homepage Stat Badges (Count-Up)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">People Trained Counter</label>
              <input
                type="number"
                value={settings.stats_members}
                onChange={(e) => setSettings({ ...settings, stats_members: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Expert Trainers Counter</label>
              <input
                type="number"
                value={settings.stats_trainers}
                onChange={(e) => setSettings({ ...settings, stats_trainers: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Fitness Equipments Counter</label>
              <input
                type="number"
                value={settings.stats_equipment}
                onChange={(e) => setSettings({ ...settings, stats_equipment: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Programs Counter</label>
              <input
                type="number"
                value={settings.stats_programs}
                onChange={(e) => setSettings({ ...settings, stats_programs: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#10101C] border border-gray-800 text-white font-bold"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-[#E91E63]/40"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
};
