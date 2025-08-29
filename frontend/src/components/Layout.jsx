import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../store/authSlice.js';

export default function Layout({ children }) {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth || {});

  const onLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem('eventx_token');
    localStorage.removeItem('eventx_user');
    nav('/login');
  };

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr] bg-background">
      <aside className="bg-white border-r border-border p-4">
        <h2 className="text-xl font-bold mb-4">EventX Studio</h2>
        <nav className="flex flex-col gap-2 text-[#566A7F]">
          <Link className="hover:underline" to="/">Home</Link>
          {user?.role === 'admin' && (
            <>
              <Link className="hover:underline" to="/admin">Dashboard</Link>
              <Link className="hover:underline" to="/admin/events">Events</Link>
              <Link className="hover:underline" to="/admin/analytics">Analytics</Link>
            </>
          )}
          {user?.role === 'user' && (
            <>
              <Link className="hover:underline" to="/events">Explore Events</Link>
              <Link className="hover:underline" to="/dashboard">My Tickets</Link>
            </>
          )}
        </nav>
        <div className="mt-6 text-sm text-gray-600">
          {user ? (
            <>
              <p className="text-[#2F3349]"><span className="font-semibold">{user.name}</span> • {user.role}</p>
              <button onClick={onLogout} className="mt-2 underline">Logout</button>
            </>
          ) : (
            <Link to="/login" className="underline">Login</Link>
          )}
        </div>
      </aside>
      <main className="p-6">
        <div className="card p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
