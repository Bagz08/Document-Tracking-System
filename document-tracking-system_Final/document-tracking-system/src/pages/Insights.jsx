import { useEffect, useState } from "react";
import { Brain, RefreshCw, Lightbulb, AlertTriangle } from "lucide-react";

const API_BASE = "http://172.20.10.2:5000";

const impactStyles = {
  high: "border-red-200 bg-red-50 text-red-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
};

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalDocs, setTotalDocs] = useState(0);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/analytics/insights`);
      if (!res.ok) throw new Error("Failed to fetch insights");
      const data = await res.json();
      setInsights(data.insights || []);
      setTotalDocs(data.totalDocuments || 0);
      setError(null);
    } catch (err) {
      console.error("Insights fetch error:", err);
      setError("Unable to load insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <RefreshCw className="animate-spin text-[#540000]" size={32} />
        <p className="text-gray-500">Generating insights from recent activity…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
        {error}
        <button
          onClick={fetchInsights}
          className="ml-4 text-sm font-semibold underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">AI Insights</h1>
          <p className="text-gray-500">
            Synthesized implications based on {totalDocs} categorized document
            {totalDocs === 1 ? "" : "s"}.
          </p>
        </div>
        <button
          onClick={fetchInsights}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#540000] text-white font-medium hover:bg-[#6b0c0c] transition"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {insights.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
          <Lightbulb className="mx-auto mb-3 text-yellow-500" size={32} />
          No insights to show yet. Register or categorize more documents to
          surface trends.
        </div>
      ) : (
        <div className="space-y-8">
          {insights.map((group) => (
            <div key={group.id}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {group.title}
                </h2>
                <span className="text-sm text-gray-400">
                  {(group.items?.length || 0)} insight
                  {(group.items?.length || 0) === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {(group.items || []).map((insight, index) => (
                  <div
                    key={`${group.id}-${index}`}
                    className={`rounded-xl border p-5 bg-white shadow-sm flex flex-col gap-3 ${
                      impactStyles[insight.impact] || impactStyles.neutral
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {insight.impact === "high" ? (
                        <AlertTriangle className="text-red-500" size={20} />
                      ) : (
                        <Brain className="text-[#540000]" size={20} />
                      )}
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        {insight.category || "General"}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {insight.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
