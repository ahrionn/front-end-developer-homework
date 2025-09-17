import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import { fetchLeads, updateLead } from './services/api';
import { LeadsTable } from './components/LeadsTable';
import { LeadDetailPanel } from './components/LeadDetailPanel';
import { OpportunitiesTable } from './components/OpportunitiesTable';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  // Persist leads in localStorage so conversions survive page refreshes
  const [leads, setLeads] = useLocalStorage('leads', []);
  const [opportunities, setOpportunities] = useLocalStorage('opportunities', []);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  // Filtering & Sorting State (persisted in localStorage)
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const [statusFilter, setStatusFilter] = useLocalStorage('statusFilter', 'All');
  const [sortLeads, setSortLeads] = useLocalStorage('sortLeads', true); // true = sort by score desc

  // Load initial data
  useEffect(() => {
    fetchLeads()
      .then(data => {
        try {
          // Only populate the persisted leads if none exist yet in localStorage
          // or the stored value is an empty array. This prevents a
          // previously-created empty store from hiding the bundled data.
          const stored = window.localStorage.getItem('leads');
          const isEmptyArray = stored && (() => {
            try { return JSON.parse(stored)?.length === 0; } catch { return false; }
          })();
          if (!stored || isEmptyArray) {
            setLeads(data);
          }
        } catch (e) {
          // Fallback: set leads if anything goes wrong reading localStorage
          setLeads(data);
        }
        setError(null);
      })
      .catch(err => setError(err))
      .finally(() => setIsLoading(false));
  }, [setLeads]);

  // Memorized computation for displaying leads
  const filteredAndSortedLeads = useMemo(() => {
    let result = leads.filter(lead => lead.status !== 'Converted');

    if (statusFilter !== 'All') {
      result = result.filter(lead => lead.status === statusFilter);
    }
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(lead =>
        lead.name.toLowerCase().includes(lowercasedTerm) ||
        lead.company.toLowerCase().includes(lowercasedTerm)
      );
    }
    if (sortLeads) {
      result.sort((a, b) => b.score - a.score);
    }
    return result;
  }, [leads, searchTerm, statusFilter, sortLeads]);

  const handleSaveLead = useCallback(async (updatedLead) => {
    try {
      const savedLead = await updateLead(updatedLead);
      setLeads(currentLeads =>
        currentLeads.map(lead => lead.id === savedLead.id ? savedLead : lead)
      );
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }, []);

  const handleConvertLead = useCallback((leadToConvert) => {
    // Create a new opportunity
    const newOpportunity = {
      id: `opp-${Date.now()}`,
      name: `${leadToConvert.name} - ${leadToConvert.company}`,
      stage: 'Prospecting',
      amount: null,
      accountName: leadToConvert.company,
    };
    setOpportunities(prev => [...prev, newOpportunity]);

    // Update the lead's status to 'Converted'
    setLeads(currentLeads =>
      currentLeads.map(lead =>
        lead.id === leadToConvert.id ? { ...lead, status: 'Converted' } : lead
      )
    );

    // Close the panel
    setSelectedLeadId(null);
  }, [setOpportunities]);

  const selectedLead = useMemo(() => leads.find(lead => lead.id === selectedLeadId), [leads, selectedLeadId]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-slate-900 text-white">Loading...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-screen bg-slate-900 text-red-400">{error}</div>;
  }

  const leadStatuses = ['All', ...new Set(leads.map(l => l.status).filter(s => s !== 'Converted'))];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 md:p-8">
      <main className="max-w-7xl mx-auto space-y-8">
        {/* LEADS CONSOLE */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-white">Lead Triage Console</h1>
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {leadStatuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
            <button
              onClick={() => setSortLeads(!sortLeads)}
              className={`px-4 py-2 rounded transition-colors w-full ${sortLeads ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-slate-600 hover:bg-slate-500'}`}
            >
              Sort by Score
            </button>
          </div>
          <LeadsTable leads={filteredAndSortedLeads} onSelectLead={setSelectedLeadId} />
        </div>

        {/* OPPORTUNITIES */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Opportunities</h2>
            <OpportunitiesTable opportunities={opportunities} />
        </div>
      </main>

      {/* LEAD DETAIL PANEL (Slide-over) */}
      <LeadDetailPanel
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLeadId(null)}
        onSave={handleSaveLead}
        onConvert={handleConvertLead}
      />
    </div>
  );
}

export default App;