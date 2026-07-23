import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

const CATEGORY_EMOJI = {
  Phones: "📱", Laptops: "💻", Books: "📚",
  Clothing: "👕", Furniture: "🛋️", Other: "📦",
};

const CATEGORY_COLORS = {
  Phones: "from-green-200 to-emerald-300 dark:from-green-800 dark:to-emerald-900",
  Laptops: "from-blue-200 to-indigo-300 dark:from-blue-800 dark:to-indigo-900",
  Books: "from-yellow-200 to-orange-300 dark:from-yellow-800 dark:to-orange-900",
  Clothing: "from-pink-200 to-rose-300 dark:from-pink-800 dark:to-rose-900",
  Furniture: "from-purple-200 to-violet-300 dark:from-purple-800 dark:to-violet-900",
  Other: "from-gray-200 to-slate-300 dark:from-gray-700 dark:to-slate-800",
};

export default function ListingCard({ listing }) {
  const categoryName = listing.category_name || "";
  const emoji = CATEGORY_EMOJI[categoryName] || "📦";
  const gradient = CATEGORY_COLORS[categoryName] || "from-gray-200 to-slate-300";
  const [faved, setFaved] = useState(listing.is_favourited);

  async function toggleFav(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (faved) {
        await api.delete(`/favorites/${listing.favourite_id}/`);
      } else {
        const { data } = await api.post("/favorites/", { listing: listing.id });
        listing.favourite_id = data.id;
      }
      setFaved(!faved);
    } catch {
      /* ignore */
    }
  }

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="relative block bg-white dark:bg-navy-800 rounded-lg border border-navy-100 dark:border-navy-600 overflow-hidden hover:shadow-md transition"
    >
      <div className={`aspect-square bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        {listing.image ? (
          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl">{emoji}</span>
        )}
      </div>
      <button onClick={toggleFav}
        className="absolute top-2 right-2 w-8 h-8 bg-white/80 dark:bg-navy-900/80 rounded-full flex items-center justify-center text-sm hover:scale-110 transition">
        {faved ? "❤️" : "🤍"}
      </button>
      <div className="p-3">
        <h3 className="font-medium text-sm text-navy-700 dark:text-navy-200 truncate">{listing.title}</h3>
        <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5">{categoryName}</p>
        <p className="font-display font-bold text-mustard-600 dark:text-mustard-400 mt-1">
          KSh {Number(listing.price).toLocaleString()}
        </p>
        {listing.status === "sold" && (
          <span className="inline-block mt-1 text-xs bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-medium">
            Sold
          </span>
        )}
      </div>
    </Link>
  );
}
