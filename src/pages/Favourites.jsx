import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ListingCard from "../components/ListingCard";
import { CardSkeleton } from "../components/Skeleton";

export default function Favourites() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/listings/favourites/")
      .then((res) => setListings(res.data.results || res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-xl font-bold text-navy-700 dark:text-navy-100 mb-6">My Wishlist</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-xl font-bold text-navy-700 dark:text-navy-100 mb-6">My Wishlist</h1>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-navy-400 dark:text-navy-200 text-sm mb-4">No favourites yet.</p>
          <Link to="/" className="bg-mustard-500 text-navy-900 font-medium rounded-md px-4 py-2 text-sm hover:bg-mustard-400 transition">
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
