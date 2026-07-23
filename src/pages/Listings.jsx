import { useEffect, useState } from "react";
import api from "../api/client";
import ListingCard from "../components/ListingCard";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories/").then((res) => setCategories(res.data.results || res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    api.get("/listings/", { params })
      .then((res) => setListings(res.data.results || res.data))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search listings..."
          className="flex-1 rounded-md border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-navy-400 text-sm">Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-navy-400 text-sm">Nothing here yet. Be the first to post something.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}