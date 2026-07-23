import { Link } from "react-router-dom";

const CATEGORY_EMOJI = {
  Phones: "📱", Laptops: "💻", Books: "📚",
  Clothing: "👕", Furniture: "🛋️", Other: "📦",
};

const CATEGORY_COLORS = {
  Phones: "from-green-200 to-emerald-300",
  Laptops: "from-blue-200 to-indigo-300",
  Books: "from-yellow-200 to-orange-300",
  Clothing: "from-pink-200 to-rose-300",
  Furniture: "from-purple-200 to-violet-300",
  Other: "from-gray-200 to-slate-300",
};

export default function ListingCard({ listing }) {
  const categoryName = listing.category_name || "";
  const emoji = CATEGORY_EMOJI[categoryName] || "📦";
  const gradient = CATEGORY_COLORS[categoryName] || "from-gray-200 to-slate-300";

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="block bg-white rounded-lg border border-navy-100 overflow-hidden hover:shadow-md transition"
    >
      <div className={`aspect-square bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        {listing.image ? (
          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl">{emoji}</span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm text-navy-700 truncate">{listing.title}</h3>
        <p className="text-xs text-navy-400 mt-0.5">{categoryName}</p>
        <p className="font-display font-bold text-mustard-600 mt-1">
          KSh {Number(listing.price).toLocaleString()}
        </p>
        {listing.status === "sold" && (
          <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">
            Sold
          </span>
        )}
      </div>
    </Link>
  );
}
