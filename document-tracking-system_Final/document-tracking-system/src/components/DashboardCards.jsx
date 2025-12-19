const DashboardCards = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold text-gray-500">Overdue Documents</h3>
        <p className="text-3xl font-bold text-red-600 mt-2">127</p>
        <p className="text-sm text-gray-400">1.5% of total</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold text-gray-500">Document Status</h3>
        <div className="h-32 flex items-center justify-center text-gray-400">[Pie Chart]</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold text-gray-500">Monthly Stats</h3>
        <div className="h-32 flex items-center justify-center text-gray-400">[Bar Chart]</div>
      </div>
    </div>
  );
};

export default DashboardCards;
