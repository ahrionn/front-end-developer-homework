export const OpportunitiesTable = ({ opportunities }) => {
  if (opportunities.length === 0) {
    return <p className="text-center text-slate-400 py-8">No opportunities yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-slate-600 text-slate-400">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3 hidden md:table-cell">Account</th>
            <th className="p-3">Stage</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map(opp => (
            <tr key={opp.id} className="border-b border-slate-700">
              <td className="p-3 font-medium text-white">{opp.name}</td>
              <td className="p-3 hidden md:table-cell">{opp.accountName}</td>
              <td className="p-3">
                 <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300">
                    {opp.stage}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};