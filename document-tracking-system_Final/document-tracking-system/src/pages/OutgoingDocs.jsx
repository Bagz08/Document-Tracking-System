import { useState } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Send,
} from "lucide-react";
import DocumentDetailModal from "../components/DocumentDetailModal";

// MASTER MOCK DATA for Outgoing Docs
const masterMockData = [
  {
    id: "DTS-2025-003",
    title: "Financial Report – Student Services",
    type: "Financial",
    status: "Forwarded",
    dateRegistered: "Oct 5, 2025",
    registeredBy: "Re-mei Ang",
    history: [
      {
        status: "Registered",
        office: "Accounting",
        user: "Re-mei Ang",
        date: "Oct 5, 2025, 01:45 PM",
        remarks: "Financial report submitted.",
      },
      {
        status: "Forwarded",
        office: "VP for Finance",
        user: "Accounting Head",
        date: "Oct 5, 2025, 02:00 PM",
        remarks: "Forwarded for review.",
      },
    ],
  },
];

export default function OutgoingDocs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Helper function for status styling
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Approved": return "bg-green-100 text-green-700";
      case "Forwarded": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    // REMOVED h-full
    <div className="flex flex-col">
      {/* Top action bar */}
      <div className="flex justify-between items-center mb-5">
        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search Document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#540000]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            <ArrowUpDown size={16} />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* Table - REMOVED flex-1 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* REMOVED h-full */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            {/* Table Header */}
            <thead className="bg-[#540000] text-white">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">Doc No.</th>
                <th className="p-3 text-left text-sm font-semibold">Title</th>
                <th className="p-3 text-left text-sm font-semibold">Type</th>
                <th className="p-3 text-left text-sm font-semibold">Status</th>
                <th className="p-3 text-left text-sm font-semibold">Date Registered</th>
                <th className="p-3 text-left text-sm font-semibold">Registered By</th>
                <th className="p-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-sm text-gray-700">
              {masterMockData
                .filter((doc) =>
                  doc.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="p-3">{doc.id}</td>
                    <td className="p-3 font-medium">{doc.title}</td>
                    <td className="p-3">{doc.type}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          doc.status
                        )}`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-3">{doc.dateRegistered}</td>
                    <td className="p-3">{doc.registeredBy}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => alert("Forward Document clicked")} // Placeholder action
                        className="flex-shrink-0 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-700 transition inline-flex items-center gap-1 mr-2"
                      >
                        <Send size={14} />
                        Forward
                      </button>
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="text-gray-500 hover:text-[#540000] p-1 rounded-full hover:bg-gray-100 transition inline-block"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render the modal */}
      <DocumentDetailModal
        doc={selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />
    </div>
  );
}