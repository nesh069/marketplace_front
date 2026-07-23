import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function PostListing() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "", image: null });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [posting, setPosting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories/").then((res) => setCategories(res.data.results || res.data));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setFieldErrors((e) => ({ ...e, [field]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPosting(true);
    setError("");
    setFieldErrors({});
    if (!form.title.trim()) { setError("Please enter a title."); setPosting(false); return; }
    if (form.title.trim().length < 3) { setError("Title must be at least 3 characters."); setPosting(false); return; }
    if (!form.category) { setFieldErrors((e) => ({ ...e, category: "Please select a category." })); setPosting(false); return; }
    if (!form.price || Number(form.price) < 1) { setFieldErrors((e) => ({ ...e, price: "Price must be at least KSh 1." })); setPosting(false); return; }
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("category", form.category);
      if (form.image) data.append("image", form.image);

      const { data: result } = await api.post("/listings/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/listings/${result.id}`);
    } catch (err) {
      const resp = err.response?.data;
      if (resp && typeof resp === "object") {
        const firstFieldError = Object.entries(resp).find(([, v]) => Array.isArray(v));
        if (firstFieldError) {
          const [field, msgs] = firstFieldError;
          setFieldErrors((e) => ({ ...e, [field]: msgs[0] }));
        } else {
          setError(Object.values(resp).flat().join(", "));
        }
      } else {
        setError("Couldn't post that listing. Try again.");
      }
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="font-display text-xl font-bold text-navy-700 dark:text-navy-100 mb-6">Sell an item</h1>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="text-sm font-medium text-navy-700 dark:text-navy-200">Title</label>
          <input required value={form.title} onChange={(e) => update("title", e.target.value)}
            className={`mt-1 w-full rounded-md border dark:bg-navy-800 dark:text-navy-200 ${fieldErrors.title ? "border-red-400" : "border-navy-100 dark:border-navy-600"} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500`}
            placeholder="e.g. Calculus textbook, 3rd edition" />
          {fieldErrors.title && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.title}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-navy-700 dark:text-navy-200">Category</label>
          <select required value={form.category} onChange={(e) => update("category", e.target.value)}
            className={`mt-1 w-full rounded-md border dark:bg-navy-800 dark:text-navy-200 ${fieldErrors.category ? "border-red-400" : "border-navy-100 dark:border-navy-600"} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500`}>
            <option value="">Choose a category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {fieldErrors.category && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.category}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-navy-700 dark:text-navy-200">Price (KSh)</label>
          <input required type="number" min="0" step="1" value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className={`mt-1 w-full rounded-md border dark:bg-navy-800 dark:text-navy-200 ${fieldErrors.price ? "border-red-400" : "border-navy-100 dark:border-navy-600"} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500`} />
          {fieldErrors.price && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.price}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-navy-700 dark:text-navy-200">Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)}
            className="mt-1 w-full rounded-md border border-navy-100 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500"
            placeholder="Condition, why you're selling, anything a buyer should know" />
        </div>
        <div>
          <label className="text-sm font-medium text-navy-700 dark:text-navy-200">Photo (optional)</label>
          <input type="file" accept="image/*"
            onChange={(e) => update("image", e.target.files[0] || null)}
            className="mt-1 w-full text-sm text-navy-600 dark:text-navy-200 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-navy-100 dark:file:bg-navy-700 file:text-navy-700 dark:file:text-navy-200 hover:file:bg-navy-200 dark:hover:file:bg-navy-600" />
        </div>
        {error && <p className="text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-2 rounded-md border border-red-200 dark:border-red-800">{error}</p>}
        <button type="submit" disabled={posting}
          className="w-full bg-navy-600 dark:bg-navy-700 text-white rounded-md py-2 text-sm font-medium hover:bg-navy-700 dark:hover:bg-navy-600 transition disabled:opacity-50">
          {posting ? "Posting..." : "Post listing"}
        </button>
      </form>
    </div>
  );
}
