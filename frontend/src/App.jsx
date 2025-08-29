// frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Events from "./pages/Events.jsx";
import Navbar from "./components/Navbar";
import EventDetails from "./pages/EventDetails.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";

export default function App() {
  const { user } = useSelector((state) => state.auth || {});

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

        {/* User routes */}
        <Route path="/events" element={<Events userView={true} />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* Admin routes */}
        <Route path="/admin" element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/admin/events" element={user?.role === "admin" ? <Events userView={false} /> : <Navigate to="/" />} />
        <Route path="/admin/analytics" element={user?.role === "admin" ? <AdminDashboard analytics={true} /> : <Navigate to="/" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
