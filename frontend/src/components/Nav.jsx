import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Nav() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">EventX Studio</Link>

      <div className="flex items-center gap-4">
        <Link to="/events" className="hover:text-blue-400">Events</Link>

        {user?.role === "admin" && (
          <Link to="/admin" className="hover:text-blue-400">Admin</Link>
        )}

        {user ? (
          <>
            <Link to="/my-tickets" className="hover:text-blue-400">My Tickets</Link>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:text-blue-400">Login</Link>
        )}
      </div>
    </nav>
  );
}
