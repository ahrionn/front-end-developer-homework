import React, { useState, useEffect } from 'react';

export const LeadDetailPanel = ({ lead, isOpen, onClose, onSave, onConvert }) => {
  const [formData, setFormData] = useState({ email: '', status: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lead) {
      setFormData({ email: lead.email, status: lead.status });
      setError(null); // Clear error when a new lead is selected
    }
  }, [lead]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSave({ ...lead, ...formData });
      onClose(); // Close on successful save
    } catch (err) {
      setError(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original lead data
    if (lead) {
      setFormData({ email: lead.email, status: lead.status });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={handleCancel}
      ></div>

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-800 shadow-2xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-6">
            <h2 className="text-xl font-bold text-white">{lead.name}</h2>
            <button onClick={handleCancel} className="text-slate-400 hover:text-white">&times;</button>
          </div>

          <div className="flex-grow space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400">Company</label>
              <p className="text-white">{lead.company}</p>
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-400">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label htmlFor="status" className="text-sm font-medium text-slate-400">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Unqualified</option>
              </select>
            </div>
             <div>
              <label className="text-sm font-medium text-slate-400">Source</label>
              <p className="text-white">{lead.source}</p>
            </div>
             <div>
              <label className="text-sm font-medium text-slate-400">Score</label>
              <p className="text-cyan-400 font-bold text-lg">{lead.score}</p>
            </div>

            {error && <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded">{error}</p>}
          </div>

          <div className="flex-shrink-0 pt-4 border-t border-slate-700 space-y-2">
            <button
                onClick={() => onConvert(lead)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
                Convert to Opportunity
            </button>
            <div className="flex space-x-2">
                <button
                    onClick={handleCancel}
                    className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};