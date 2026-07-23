import { useEffect, useRef, useState } from "react";
import api from "../api/client";
import ListingCard from "../components/ListingCard";
import { CardSkeleton } from "../components/Skeleton";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pollRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);
  const [recentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("recentlyViewed") || "[]").slice(0, 4); }
    catch { return []; }
  });

  function fetchListings() {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    api.get("/listings/", { params })
      .then((res) => setListings(res.data.results || res.data))
      .catch(() => setError("Could not load listings."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchListings();
  }, [search, category, minPrice, maxPrice]);

  useEffect(() => {
    api.get("/categories/").then((res) => setCategories(res.data.results || res.data));
    pollRef.current = setInterval(fetchListings, 15000);
    return () => clearInterval(pollRef.current);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search listings..."
          className="flex-1 rounded-md border border-navy-100 dark:border-navy-600 dark:bg-navy-700 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-navy-100 dark:border-navy-600 dark:bg-navy-700 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-navy-500 dark:text-navy-400 hover:text-navy-700 self-center underline underline-offset-2">
          {showFilters ? "Hide" : "Price"} filter
        </button>
      </div>

      {showFilters && (
        <div className="flex gap-2 mb-4">
          <input type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min KSh"
            className="w-32 rounded-md border border-navy-100 dark:border-navy-600 dark:bg-navy-700 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500" />
          <span className="self-center text-navy-400 text-sm">&ndash;</span>
          <input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max KSh"
            className="w-32 rounded-md border border-navy-100 dark:border-navy-600 dark:bg-navy-700 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-md border border-red-200 dark:border-red-800 mb-4">
          {error}
          <button onClick={fetchListings} className="ml-2 underline font-medium">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : listings.length === 0 && !error ? (
        <p className="text-navy-400 dark:text-navy-500 text-sm">Nothing here yet. Be the first to post something.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>

          {recentlyViewed.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-sm font-bold text-navy-500 dark:text-navy-400 mb-3">Recently viewed</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recentlyViewed.map((l) => <ListingCard key={`rv-${l.id}`} listing={l} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
