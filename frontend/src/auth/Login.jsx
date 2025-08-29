import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice.js";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await client.post("/api/auth/login", { email, password });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      localStorage.setItem("eventx_user", JSON.stringify(data.user));
      localStorage.setItem("eventx_token", data.token);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-1">Welcome back 👋</h2>
        <p className="text-sm text-[#8592A3] mb-4">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="space-y-3">
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
          <Button type="submit" className="btn-primary w-full">Login</Button>
        </form>
        <p className="mt-4 text-sm text-[#8592A3]">Don't have an account? <Link to="/register" className="text-primary">Register</Link></p>
      </Card>
    </div>
  );
}
