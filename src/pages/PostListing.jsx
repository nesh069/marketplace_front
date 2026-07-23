import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function PostListing() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories/").then((res) => setCategories(res.data.results || res.data));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/listings/", form);
      navigate(`/listings/${data.id}`);
    } catch {
      setError("Couldn't post that listing - check the details and try again.");
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="font-display text-xl font-bold text-navy-700 mb-6">Sell an item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-navy-700">Title</label>
          <input required value={form.title} onChange={(e) => update("title", e.target.value)}
            className="mt-1 w-full rounded-md border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500"
            placeholder="e.g. Calculus textbook, 3rd edition" />
        </div>
        <div>
          <label className="text-sm font-medium text-navy-700">Category</label>
          <select required value={form.category} onChange={(e) => update("category", e.target.value)}
            className="mt-1 w-full rounded-md border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500">
            <option value="">Choose a category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-navy-700">Price (KSh)</label>
          <input required type="number" min="0" step="1" value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className="mt-1 w-full rounded-md border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500" />
        </div>
        <div>
          <label className="text-sm font-medium text-navy-700">Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)}
            className="mt-1 w-full rounded-md border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500"
            placeholder="Condition, why you're selling, anything a buyer should know" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full bg-navy-600 text-white rounded-md py-2 text-sm font-medium hover:bg-navy-700 transition">
          Post listing
        </button>
      </form>
    </div>
  );
}