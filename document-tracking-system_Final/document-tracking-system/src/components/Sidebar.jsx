// src/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Presentation,
  ArrowDownToLine,
  CheckCheck,
  MailCheck,
  TrendingUp,
  Settings,
  LogOut,
  BrainCircuit,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: clear user data from localStorage/sessionStorage
    // localStorage.removeItem("user");

    // Redirect to login page
    navigate("/");
  };

  const location = useLocation();

  const navItem = (path, icon, label) => {
    const active = location.pathname === path;
    return (
      <Link
        to={path}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium cursor-pointer transition ${
          active ? "bg-white text-[#540000]" : "text-white hover:bg-white/10"
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <div className="w-64 bg-[#540000] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center py-6 border-b border-gray-700">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-gray-300 mx-auto mb-2"></div>
          <h2 className="font-semibold text-lg">OC</h2>
        </div>
      </div>

      {/* Menu - UPDATED ORDER */}
      <nav className="flex-1 p-4 space-y-1">
        {navItem("/dashboard", <Home size={18} />, "Dashboard")}
        {navItem("/registered", <FileText size={18} />, "Register Docs")}
        {navItem("/office", <Presentation size={18} />, "Office Docs")}
        {navItem("/incoming", <ArrowDownToLine size={18} />, "Incoming Docs")}
        {navItem("/received", <CheckCheck size={18} />, "Received Docs")}
        {navItem("/outgoing", <MailCheck size={18} />, "Outgoing")}
        {navItem("/analytics", <TrendingUp size={18} />, "Analytics & Reports")}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <Link
          to="/insights"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${
            location.pathname === "/insights"
              ? "bg-white text-[#540000]"
              : "hover:bg-white/10"
          }`}
        >
          <BrainCircuit size={18} /> Insights
        </Link>
        <a className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg">
          <Settings size={18} /> Settings
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-300 hover:bg-red-500 hover:text-white rounded-lg transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}