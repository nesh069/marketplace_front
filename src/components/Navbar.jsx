import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-navy-700 dark:bg-navy-900 text-white px-4 py-3 flex items-center justify-between transition-colors">
      <Link to="/" className="font-display font-bold text-lg tracking-tight">
        Campus Marketplace
      </Link>
      <div className="flex items-center gap-3 text-sm">
        <Link to="/" className="hover:text-mustard-400 transition">Browse</Link>
        <Link to="/post" className="hover:text-mustard-400 transition">Sell</Link>
        <Link to="/messages" className="hover:text-mustard-400 transition">Messages</Link>
        <Link to="/payments" className="hover:text-mustard-400 transition">Payments</Link>
        <Link to="/favourites" className="hover:text-mustard-400 transition hidden sm:inline">Wishlist</Link>
        <button onClick={toggle}
          className="text-navy-100 hover:text-mustard-400 transition text-base leading-none" title="Toggle dark mode">
          {dark ? "☀️" : "🌙"}
        </button>
        {user && (
          <button onClick={handleLogout} className="text-navy-100 hover:text-mustard-400 transition">
            Log out
          </button>
        )}
      </div>
    </nav>
  );
}
