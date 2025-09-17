import React from 'react';

export const LeadsTable = React.memo(({ leads, onSelectLead }) => {
  if (leads.length === 0) {
    return <p className="text-center text-slate-400 py-8">No leads found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-slate-600 text-slate-400">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3 hidden md:table-cell">Company</th>
            <th className="p-3 hidden md:table-cell">Source</th>
            <th className="p-3">Score</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr
              key={lead.id}
              onClick={() => onSelectLead(lead.id)}
              className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors"
            >
              <td className="p-3 font-medium text-white">{lead.name}</td>
              <td className="p-3 hidden md:table-cell">{lead.company}</td>
              <td className="p-3 hidden md:table-cell">{lead.source}</td>
              <td className="p-3 text-cyan-400 font-mono">{lead.score}</td>
              <td className="p-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    lead.status === 'New' ? 'bg-blue-500/20 text-blue-300' :
                    lead.status === 'Contacted' ? 'bg-yellow-500/20 text-yellow-300' :
                    lead.status === 'Qualified' ? 'bg-green-500/20 text-green-300' :
                    'bg-red-500/20 text-red-300'
                }`}>
                    {lead.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});