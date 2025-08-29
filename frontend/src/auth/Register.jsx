import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice.js";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await client.post("/api/auth/register", { name, email, password });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      localStorage.setItem("eventx_user", JSON.stringify(data.user));
      localStorage.setItem("eventx_token", data.token);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-1">Create an account</h2>
        <p className="text-sm text-[#8592A3] mb-4">Join EventX to book and manage tickets</p>
        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="block text-sm mb-1 text-[#566A7F]">Full Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              className="w-full border border-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#566A7F]">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#566A7F]">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="btn-primary w-full">Register</Button>
        </form>
        <p className="mt-4 text-sm text-[#8592A3]">Already have an account? <Link to="/login" className="text-primary">Login</Link></p>
      </Card>
    </div>
  );
}
