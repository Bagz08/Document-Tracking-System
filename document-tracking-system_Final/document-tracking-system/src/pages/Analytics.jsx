import { useState, useEffect } from "react";
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
  LineChart,
  Line,
} from "recharts";
import { RefreshCw, TrendingUp, Brain, FileText } from "lucide-react";

const API_BASE = "http://172.20.10.2:5000";

const COLORS = [
  "#540000",
  "#8B2E2E",
  "#C45A3D",
  "#FFA559",
  "#F8CBA6",
  "#D97E48",
];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categorizedDocs, setCategorizedDocs] = useState([]);
  const [editModal, setEditModal] = useState({
    open: false,
    mode: "manual",
    doc: null,
    value: "",
  });

  useEffect(() => {
    fetchAnalytics();
    fetchCategorizedDocuments();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/analytics`);
      const data = await res.json();
      setAnalytics(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setLoading(false);
    }
  };

  const fetchCategorizedDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/analytics/documents?limit=20`);
      const data = await res.json();
      setCategorizedDocs(data.documents || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  const handleRecategorize = async () => {
    if (!confirm("Re-categorize all documents? This may take a moment.")) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/analytics/recategorize`, {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message || "Documents re-categorized successfully!");
      fetchAnalytics();
      fetchCategorizedDocuments();
    } catch (err) {
      console.error("Failed to re-categorize:", err);
      alert("Failed to re-categorize documents");
    }
  };

  const handleManualCategoryChange = async (doc) => {
    setEditModal({
      open: true,
      mode: "manual",
      doc,
      value: doc.doc_type || "",
    });
  };

  const handleOverrideAICategory = async (doc) => {
    setEditModal({
      open: true,
      mode: "ai",
      doc,
      value: doc.ai_category || "",
    });
  };

  const handleModalSave = async () => {
    if (!editModal.doc) return;
    const trimmed = editModal.value.trim();
    if (!trimmed) {
      alert("Value cannot be empty.");
      return;
    }
    const endpoint =
      editModal.mode === "manual"
        ? `${API_BASE}/api/docs/${editModal.doc.dts_number}/manual`
        : `${API_BASE}/api/docs/${editModal.doc.dts_number}/override`;
    const payload =
      editModal.mode === "manual"
        ? { doc_type: trimmed }
        : { ai_category: trimmed };
    try {
      await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditModal({ open: false, mode: "manual", doc: null, value: "" });
      fetchCategorizedDocuments();
      fetchAnalytics();
    } catch (err) {
      console.error("Failed to update category:", err);
      alert("Failed to update category");
    }
  };

  const closeModal = () =>
    setEditModal({ open: false, mode: "manual", doc: null, value: "" });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-red-500">Failed to load analytics data</div>
    );
  }

  const {
    categoryTotals = {},
    highConfidenceCount = 0,
    lowConfidenceCount = 0,
    recentDocs = 0,
    overrideCount = 0,
    topMismatchedCategories = [],
  } = analytics;


  const summaryCards = [
    { title: "High Confidence (≥75%)", value: highConfidenceCount, accent: "bg-green-100 text-green-700" },
    { title: "Needs Review (<50%)", value: lowConfidenceCount, accent: "bg-yellow-100 text-yellow-700" },
    { title: "Docs Last 7 Days", value: recentDocs, accent: "bg-blue-100 text-blue-700" },
    { title: "Manual Overrides", value: overrideCount, accent: "bg-orange-100 text-orange-700" },
  ];

  // Pie chart: use categoryTotals directly
  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  // Status chart stays the same
  const statusData = Object.entries(analytics.statusDistribution || {}).map(
    ([name, value]) => ({ name, value })
  );

  // Monthly trends already exist
  const monthlyTrends = analytics.monthlyTrends || [];

  const categoryCards = Object.entries(categoryTotals).map(([name, value]) => ({
    title: name,
    value,
    accent: "bg-sky-100 text-sky-700",
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 border-l-4 border-orange-500 pl-2">
          Analytics & Reports
        </h1>
        <button
          onClick={handleRecategorize}
          className="flex items-center gap-2 bg-sky-200 hover:bg-sky-300 text-[#540000] font-semibold px-4 py-2 rounded-md shadow transition"
        >
          <RefreshCw size={18} />
          Re-categorize All
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...summaryCards, ...categoryCards].map((card, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow flex flex-col">
            <span className="text-sm text-gray-500">{card.title}</span>
            <span className={`text-3xl font-bold mt-2 ${card.accent}`}>{card.value}</span>
          </div>
        ))}
      </div>

      {topMismatchedCategories.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Top Mismatched Categories</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="p-3">Category</th>
                <th className="p-3">Mismatched / Total</th>
                <th className="p-3">Mismatch Rate</th>
              </tr>
            </thead>
            <tbody>
              {topMismatchedCategories.map((item, idx) => (
                <tr key={idx} className="border-b last:border-none">
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">
                    {item.mismatched} of {item.total}
                  </td>
                  <td className="p-3">{item.mismatchRate.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow h-96">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            AI Category Distribution
          </h2>
          <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              paddingAngle={2}
              labelLine={false}
              label={({ percent, name }) =>
                `${name}: ${Math.round(percent * 100)}%`
              }
            >
              {categoryData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => [`${val} docs`, "Count"]} />
            <Legend />
          </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow h-96">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Document Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#540000" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends */}
      {monthlyTrends.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Monthly Document Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#540000"
                strokeWidth={2}
                name="Total Documents"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Accuracy */}
      {analytics.categoryAccuracy && analytics.categoryAccuracy.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            AI Category Accuracy
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#540000] text-white text-left text-sm">
                  <th className="p-3 rounded-l-lg">Category</th>
                  <th className="p-3">Total Documents</th>
                  <th className="p-3">Matching Manual</th>
                  <th className="p-3 rounded-r-lg">Accuracy %</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {analytics.categoryAccuracy.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">{item.category}</td>
                    <td className="p-3">{item.total}</td>
                    <td className="p-3">{item.matching}</td>
                    <td className="p-3">
                      <span
                        className={`font-semibold ${
                          item.accuracy >= 80
                            ? "text-green-600"
                            : item.accuracy >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.accuracy.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categorized Documents */}
      <div className="bg-[#fff8f7] p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            AI-Categorized Documents
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#540000] text-white text-left text-sm">
                <th className="p-3 rounded-l-lg">DTS No.</th>
                <th className="p-3">Title</th>
                <th className="p-3">AI Category</th>
                <th className="p-3">Manual Category</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {categorizedDocs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No documents found
                  </td>
                </tr>
              ) : (
                categorizedDocs.map((doc, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="p-3">{doc.dts_number}</td>
                    <td className="p-3 font-medium">{doc.title}</td>
                    <td className="p-3">
                      <span className="bg-sky-100 text-[#540000] px-2 py-1 rounded text-xs font-semibold">
                        {doc.ai_category || "N/A"}
                      </span>
                    </td>
                    <td className="p-3">
                      {doc.doc_type || "N/A"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          doc.status === "ended"
                            ? "bg-green-100 text-green-700"
                            : doc.status === "received"
                            ? "bg-yellow-100 text-yellow-700"
                            : doc.status === "forwarded"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {doc.status || "received"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleManualCategoryChange(doc)}
                          className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                        >
                          Set Manual
                        </button>
                        <button
                          onClick={() => handleOverrideAICategory(doc)}
                          className="px-3 py-1 text-xs rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition"
                        >
                          Override AI
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

      {editModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {editModal.mode === "manual"
                ? "Set Manual Category"
                : "Override AI Category"}
            </h3>
            <p className="text-sm text-gray-500">
              {editModal.doc?.title || ""}
            </p>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#540000]"
              value={editModal.value}
              onChange={(e) =>
                setEditModal((prev) => ({ ...prev, value: e.target.value }))
              }
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSave}
                className="px-4 py-2 rounded-md bg-[#540000] text-white text-sm hover:bg-[#6b0c0c] transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

