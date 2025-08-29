// frontend/src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("eventx_user");
    localStorage.removeItem("eventx_token");
  };

  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        {user?.role === "user" && <Link to="/events">Events</Link>}
        {user?.role === "user" && <Link to="/dashboard">My Tickets</Link>}
        {user?.role === "admin" && <Link to="/admin">Dashboard</Link>}
        {user?.role === "admin" && <Link to="/admin/events">Events</Link>}
      </div>
      <div className="flex gap-4">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}
