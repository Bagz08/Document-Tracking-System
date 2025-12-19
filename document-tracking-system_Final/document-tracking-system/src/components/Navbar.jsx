import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// Helper: Map route paths to readable Titles
const getTitleFromPath = (path) => {
  switch (path) {
    case "/dashboard": return "Dashboard";
    case "/registered": return "Register Docs";
    case "/office": return "Office Docs";
    case "/incoming": return "Incoming Docs";
    case "/received": return "Received Docs";
    case "/outgoing": return "Outgoing";
    case "/analytics": return "Analytics & Reports";
    default: return "Document Tracking System";
  }
};

export default function Navbar() {
  const location = useLocation();
  const [title, setTitle] = useState(getTitleFromPath(location.pathname));

  // Update title when route changes
  useEffect(() => {
    setTitle(getTitleFromPath(location.pathname));
  }, [location.pathname]);

  return (
    <header className="bg-white text-black flex justify-between items-center px-6 py-4 border-b border-gray-200">
      {/* Dynamic Title */}
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      
      {/* User Profile Section */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">STAFF</p>
          <p className="text-xs text-gray-500">@username</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-gray-500"></div>
      </div>
    </header>
  );
}