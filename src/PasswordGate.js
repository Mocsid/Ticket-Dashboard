import React, { useState, useEffect } from "react";

const PASSWORD = process.env.REACT_APP_DASHBOARD_PASSWORD;

export default function PasswordGate({ children }) {
  const [input, setInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true); // new loading state

  useEffect(() => {
    const stored = localStorage.getItem("ticket-access");
    if (stored === PASSWORD) {
      setAuthenticated(true);
    }
    setChecking(false); // done checking after load
  }, []);

  const handleLogin = () => {
    if (input === PASSWORD) {
      localStorage.setItem("ticket-access", PASSWORD);
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (checking) return null; // prevent flicker

  if (authenticated) return children;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full space-y-4 transition-all">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">🔒 Protected</h1>
        <input
          type="password"
          placeholder="Enter password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Unlock
        </button>
        <p className="text-sm text-gray-400 text-center">Access limited to authorized users.</p>
      </div>
    </div>
  );
}
