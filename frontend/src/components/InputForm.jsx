import React, { useState } from 'react';
import { Settings2, Loader2 } from 'lucide-react';

const InputForm = ({ items, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    itemId: '',
    condition: 'good',
    hasRepairShop: false,
    hasRecyclingFacility: true
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.itemId) return;
    onSubmit(formData);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <Settings2 className="text-brand-green w-5 h-5" />
        <h2 className="text-xl font-bold text-gray-800">Analyze Item</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item to Dispose</label>
          <select 
            name="itemId" 
            value={formData.itemId} 
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-2.5 text-gray-700 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
            required
          >
            <option value="">Select an item...</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Condition</label>
          <select 
            name="condition" 
            value={formData.condition} 
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-2.5 text-gray-700 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
          >
            <option value="new">New (Unused)</option>
            <option value="good">Good (Minor wear)</option>
            <option value="fair">Fair (Noticeable wear)</option>
            <option value="damaged">Damaged (Needs repair)</option>
            <option value="broken">Broken (Non-functional)</option>
            <option value="end_of_life">End of Life (Unrepairable)</option>
          </select>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">Local Infrastructure</p>
          
          <div className="space-y-3">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input 
                type="checkbox" 
                name="hasRepairShop" 
                checked={formData.hasRepairShop} 
                onChange={handleChange}
                className="w-4 h-4 text-brand-green focus:ring-brand-green rounded border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">Repair shop nearby</span>
            </label>

            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input 
                type="checkbox" 
                name="hasRecyclingFacility" 
                checked={formData.hasRecyclingFacility} 
                onChange={handleChange}
                className="w-4 h-4 text-brand-green focus:ring-brand-green rounded border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">Recycling facility nearby</span>
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !formData.itemId}
          className="w-full btn-primary mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isLoading ? 'Analyzing...' : 'Generate Strategy'}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
