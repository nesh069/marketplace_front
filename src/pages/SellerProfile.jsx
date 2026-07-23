import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import ListingCard from "../components/ListingCard";
import { CardSkeleton } from "../components/Skeleton";

function initials(name) {
  return (name || "?").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500",
  "bg-pink-500", "bg-teal-500", "bg-indigo-500", "bg-rose-500",
];

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function SellerProfile() {
  const { id: sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data: listingData } = await api.get("/listings/", { params: { seller: sellerId } });
      const results = listingData.results || listingData;
      setListings(results);
      if (results.length > 0) {
        setSeller({ email: results[0].seller, date_joined: results[0].seller_joined });
      }
      setLoading(false);
    }
    fetch();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-navy-100 dark:bg-navy-700" />
          <div className="space-y-2">
            <div className="h-4 bg-navy-100 dark:bg-navy-700 rounded w-40" />
            <div className="h-3 bg-navy-100 dark:bg-navy-700 rounded w-24" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!seller) {
    return <p className="max-w-5xl mx-auto px-4 py-8 text-navy-400 text-sm">Seller not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-16 h-16 rounded-full ${avatarColor(seller.email)} flex items-center justify-center text-white text-xl font-bold`}>
          {initials(seller.email)}
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-navy-700 dark:text-navy-100">{seller.email}</h1>
          <p className="text-sm text-navy-400 dark:text-navy-200">Member since {new Date(seller.date_joined).toLocaleDateString()}</p>
          <p className="text-sm text-navy-400 dark:text-navy-200">{listings.length} item{listings.length !== 1 ? "s" : ""} listed</p>
        </div>
      </div>

      <h2 className="font-display text-sm font-bold text-navy-500 dark:text-navy-200 mb-3">Listings by this seller</h2>

      {listings.length === 0 ? (
        <p className="text-navy-400 text-sm">No listings yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}

      <div className="mt-8">
        <Link to="/" className="text-sm text-navy-500 hover:text-navy-700 underline underline-offset-2">&larr; Back to Browse</Link>
      </div>
    </div>
  );
}
