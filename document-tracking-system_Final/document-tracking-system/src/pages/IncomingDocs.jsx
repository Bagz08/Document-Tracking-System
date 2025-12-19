import { useState } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Check,
} from "lucide-react";
import DocumentDetailModal from "../components/DocumentDetailModal";

// MASTER MOCK DATA for Incoming Docs
const masterMockData = [
  {
    id: "DTS-2025-004",
    title: "Faculty Leave Application - J. Dcosta",
    type: "HR-Form",
    fromOffice: "HR Department",
    dateForwarded: "Oct 6, 2025",
    forwardedBy: "HR Staff",
    status: "Forwarded",
    history: [
      {
        status: "Registered",
        office: "HR Department",
        user: "Jen C. Dcosta",
        date: "Oct 6, 2025, 10:00 AM",
        remarks: "Leave application submitted.",
      },
      {
        status: "Forwarded",
        office: "Dean's Office",
        user: "HR Staff",
        date: "Oct 6, 2025, 10:15 AM",
        remarks: "Forwarded to Dean for approval.",
      },
    ],
  },
  {
    id: "DTS-2025-005",
    title: "Campus Event Security Clearance",
    type: "Security",
    fromOffice: "Registrar's Office",
    dateForwarded: "Oct 6, 2025",
    forwardedBy: "Ryan S. Baguio",
    status: "Forwarded",
    history: [
      {
        status: "Registered",
        office: "Registrar's Office",
        user: "Ryan S. Baguio",
        date: "Oct 6, 2025, 02:30 PM",
        remarks: "Request for event security.",
      },
      {
        status: "Forwarded",
        office: "Security Office",
        user: "Ryan S. Baguio",
        date: "Oct 6, 2025, 02:35 PM",
        remarks: "Forwarded to Security Office for review.",
      },
    ],
  },
];

export default function IncomingDocs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);

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
                <th className="p-3 text-left text-sm font-semibold">From Office</th>
                <th className="p-3 text-left text-sm font-semibold">Date Forwarded</th>
                <th className="p-3 text-left text-sm font-semibold">Forwarded By</th>
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
                    <td className="p-3">{doc.fromOffice}</td>
                    <td className="p-3">{doc.dateForwarded}</td>
                    <td className="p-3">{doc.forwardedBy}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => alert("Receive Document clicked")} // Placeholder action
                        className="flex-shrink-0 bg-green-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-green-700 transition inline-flex items-center gap-1 mr-2"
                      >
                        <Check size={14} />
                        Receive
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