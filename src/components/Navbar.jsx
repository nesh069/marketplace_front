import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-navy-700 text-white px-4 py-3 flex items-center justify-between">
      <Link to="/" className="font-display font-bold text-lg tracking-tight">
        Campus Marketplace
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link to="/" className="hover:text-mustard-400 transition">Browse</Link>
        <Link to="/post" className="hover:text-mustard-400 transition">Sell an item</Link>
        <Link to="/messages" className="hover:text-mustard-400 transition">Messages</Link>
        {user && (
          <button onClick={handleLogout} className="text-navy-100 hover:text-mustard-400 transition">
            Log out
          </button>
        )}
      </div>
    </nav>
  );
}