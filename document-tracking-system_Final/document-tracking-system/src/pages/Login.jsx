import { useState } from "react";
import { useNavigate } from "react-router-dom";
import myIITLogo from "../assets/myiit.png";
import IITCover from "../assets/iitcover.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please enter your username and password.");
      return;
    }

    setLoading(true);
    try {
      console.log("LOGIN: sending request...", { username });

      // Ensure your backend is running on this port
      const res = await fetch("http://172.20.10.2:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("LOGIN: raw response", res.status, res.statusText);

      let data;
      try {
        data = await res.json();
        console.log("LOGIN: parsed JSON", data);
      } catch (jsonErr) {
        const txt = await res.text();
        console.error("LOGIN: could not parse JSON body, text:", txt);
        alert("Server returned non-JSON response.");
        setLoading(false);
        return;
      }

      if (res.ok) {
        // FIX: Save the entire response data to localStorage so 'user' is defined
        // when checked by other pages.
        localStorage.setItem("user", JSON.stringify(data));
        
        // Navigate to the dashboard
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-12 md:px-24 relative">
        {/* Logos */}
        <div className="absolute top-8 left-8 flex gap-4">
          <img src={myIITLogo} alt="My.IIT Logo" className="h-12" />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#540000]">Sign in</h2>
          <p className="text-gray-500 mt-2">
            Welcome to the Document Tracking System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm text-gray-600">Enter your username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#540000]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Enter your password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#540000]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#540000] text-white py-2 rounded-md font-medium hover:bg-[#6a0000] transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8">
          Copyright © 2010 onwards,{" "}
          <a
            href="https://msuiit.edu.ph"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#540000] hover:underline"
          >
            MSU-Iligan Institute of Technology
          </a>
          . Iligan City, Philippines.
        </p>
      </div>

      {/* Right side - Image */}
      <div className="flex-1 bg-black flex items-center justify-center">
        <img
          src={IITCover}
          alt="IIT Building"
          className="w-full h-full object-cover opacity-60"
        />
      </div>
    </div>
  );
}