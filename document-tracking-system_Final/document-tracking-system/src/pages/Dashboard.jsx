import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const recentDocs = [
    {
      id: "DTS-2025-001",
      title: "Purchase Request – Office Supplies",
      description:
        "Request for procurement of standard office supplies.",
      registeredBy: "Ryan S. Baguio",
      date: "Oct 3, 2025",
      status: "Approved",
    },
    {
      id: "DTS-2025-002",
      title: "Request for use of CCS Database Lab",
      description:
        "For CCS Foundation Day",
      registeredBy: "Shane Daryl Maghinay",
      date: "Oct 4, 2025",
      status: "Pending",
    },
    {
      id: "DTS-2025-003",
      title: "Financial Report – Student Services",
      description:
        "Consolidated financial report for student programs and assistance.",
      registeredBy: "Re-mei Ang",
      date: "Oct 5, 2025",
      status: "Forwarded",
    },
  ];

  const docTypeData = [
    { name: "Academics", value: 20 },
    { name: "Research and Extension", value: 15 },
    { name: "Student Services", value: 25 },
    { name: "Planning and Development", value: 10 },
    { name: "Administration and Finance", value: 18 },
    { name: "Institute", value: 12 },
  ];

  const COLORS = [
    "#540000",
    "#8B2E2E",
    "#C45A3D",
    "#FFA559",
    "#F8CBA6",
    "#D97E48",
  ];

  // 📊 Document Status per Month (Mock data)
  const monthlyStatusData = [
    { month: "May", total: 100, incoming: 40, outgoing: 30, archived: 10 },
    { month: "June", total: 120, incoming: 45, outgoing: 25, archived: 15 },
    { month: "July", total: 110, incoming: 35, outgoing: 40, archived: 12 },
    { month: "Aug", total: 130, incoming: 50, outgoing: 35, archived: 20 },
    { month: "Sept", total: 125, incoming: 48, outgoing: 30, archived: 18 },
    { month: "Oct", total: 120, incoming: 45, outgoing: 30, archived: 15 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600";
      case "Pending":
        return "text-gray-500";
      case "Forwarded":
        return "text-yellow-600";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-600 text-sm">Total Documents</h2>
          <p className="text-3xl font-bold text-[#540000]">120</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-600 text-sm">Incoming</h2>
          <p className="text-3xl font-bold text-[#540000]">45</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-600 text-sm">Outgoing</h2>
          <p className="text-3xl font-bold text-[#540000]">30</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-600 text-sm">Archived</h2>
          <p className="text-3xl font-bold text-[#540000]">15</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Type Distribution */}
        <div className="bg-white p-6 rounded-xl shadow h-80">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Document Type Distribution
          </h2>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={docTypeData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) / 2;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight="bold"
                    >
                      {value}
                    </text>
                  );
                }}
              >
                {docTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 Document Status per Month */}
        <div className="bg-white p-6 rounded-xl shadow h-80">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Document Status per Month
          </h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={monthlyStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#540000" name="Total Documents" />
              <Bar dataKey="incoming" fill="#8B2E2E" name="Incoming" />
              <Bar dataKey="outgoing" fill="#C45A3D" name="Outgoing" />
              <Bar dataKey="archived" fill="#FFA559" name="Archived" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Documents Section */}
      <div className="bg-[#fff8f7] p-6 rounded-xl shadow mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Document
          </h2>
          <button className="text-[#540000] text-sm font-medium hover:underline">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#540000] text-white text-left text-sm">
                <th className="p-3 rounded-l-lg">Doc No.</th>
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className="p-3">Registered by:</th>
                <th className="p-3 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {recentDocs.map((doc, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="p-3">{doc.id}</td>
                  <td className="p-3 font-medium">{doc.title}</td>
                  <td className="p-3">{doc.description}</td>
                  <td className="p-3">
                    {doc.registeredBy}
                    <br />
                    <span className="text-xs text-gray-500">{doc.date}</span>
                  </td>
                  <td
                    className={`p-3 font-medium ${getStatusColor(doc.status)}`}
                  >
                    {doc.status === "Approved" && "🟢"}
                    {doc.status === "Pending" && "⚪"}
                    {doc.status === "Forwarded" && "🟠"} {doc.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
