import {
  FileText,
  Send,
  Check,
  Package,
  CalendarDays,
  User,
  Tags,
  X,
} from "lucide-react";

// Helper for status styling
const getStatusClass = (status) => {
  switch (status) {
    case "Pending": return "bg-yellow-100 text-yellow-700";
    case "Approved": return "bg-green-100 text-green-700";
    case "Forwarded": return "bg-blue-100 text-blue-700";
    case "Ended": return "bg-gray-100 text-gray-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

// Helper for timeline icon
const getTimelineIcon = (status) => {
  switch (status) {
    case "Registered": return <FileText size={16} />;
    case "Forwarded": return <Send size={16} />;
    case "Received": return <Package size={16} />;
    case "Approved": return <Check size={16} />;
    case "Ended": return <Check size={16} />;
    default: return <FileText size={16} />;
  }
};

export default function DocumentDetailModal({ doc, onClose }) {
  // If no document is selected, render nothing
  if (!doc) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[90vh] bg-gray-50 rounded-lg shadow-xl z-50 flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b bg-white rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            Document Tracker
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 hover:bg-red-100 p-1.5 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body with Scrolling */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{doc.title}</h1>
                <p className="text-lg text-gray-500 font-medium mt-1">{doc.id}</p>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusClass(
                  doc.status
                )}`}
              >
                {doc.status}
              </span>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>
                  Registered by:{" "}
                  <span className="font-medium text-gray-800">
                    {doc.registeredBy}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={16} />
                <span>
                  Date Registered:{" "}
                  <span className="font-medium text-gray-800">
                    {doc.dateRegistered}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tags size={16} />
                <span>
                  Type:{" "}
                  <span className="font-medium text-gray-800">{doc.type}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Timeline/Tracker */}
          <div className="bg-white p-6 rounded-lg shadow flex-1 mt-6">
            <h2 className="text-xl font-semibold mb-6">Document History</h2>
            <div className="relative">
              {doc.history.map((item, index) => (
                <div key={index} className="relative pl-12 pb-8">
                  {/* Vertical line */}
                  {index !== doc.history.length - 1 && (
                    <div className="absolute left-[18px] top-5 w-0.5 h-full bg-gray-300"></div>
                  )}

                  {/* Icon */}
                  <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-[#540000] text-white flex items-center justify-center">
                    {getTimelineIcon(item.status)}
                  </div>

                  {/* Content */}
                  <div className="ml-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.status}
                      </h3>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {item.office} ({item.user})
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{item.remarks}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}