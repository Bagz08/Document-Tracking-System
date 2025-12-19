import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RegisterDocs from "./pages/RegisterDocs.jsx";
import Analytics from "./pages/Analytics.jsx";
import Insights from "./pages/Insights.jsx";
import OfficeDocs from "./pages/OfficeDocs.jsx";
import IncomingDocs from "./pages/IncomingDocs.jsx";
import ReceivedDocs from "./pages/ReceivedDocs.jsx";
import OutgoingDocs from "./pages/OutgoingDocs.jsx";

/**
 * A wrapper component that checks if a user is logged in
 * by reading localStorage. If not, it redirects to the /login page.
 */
const ProtectedWrapper = ({ children }) => {
  // Check for the user object in localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  // If user exists, render the child component; otherwise, redirect to Login
  return user ? children : <Navigate to="/login" replace />;
};

/**
 * A wrapper to combine the layout and auth protection.
 */
const ProtectedLayout = ({ children }) => {
  return (
    <ProtectedWrapper>
      <MainLayout>{children}</MainLayout>
    </ProtectedWrapper>
  );
};

function App() {
  return (
    <Routes>
      {/* 1. Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* 2. Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/registered"
        element={
          <ProtectedLayout>
            <RegisterDocs />
          </ProtectedLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedLayout>
            <Analytics />
          </ProtectedLayout>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedLayout>
            <Insights />
          </ProtectedLayout>
        }
      />
      <Route
        path="/office"
        element={
          <ProtectedLayout>
            <OfficeDocs />
          </ProtectedLayout>
        }
      />
      <Route
        path="/incoming"
        element={
          <ProtectedLayout>
            <IncomingDocs />
          </ProtectedLayout>
        }
      />
      <Route
        path="/received"
        element={
          <ProtectedLayout>
            <ReceivedDocs />
          </ProtectedLayout>
        }
      />
      <Route
        path="/outgoing"
        element={
          <ProtectedLayout>
            <OutgoingDocs />
          </ProtectedLayout>
        }
      />

      {/* 3. Redirect root path to dashboard (which will redirect to login if needed) */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;