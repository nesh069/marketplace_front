import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import ChatModal from "../components/ChatModal";
import { DetailSkeleton } from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";
import { initiatePayment, saveTransaction } from "../api/payments";

function addRecentlyViewed(listing) {
  try {
    const rv = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = rv.filter((l) => l.id !== listing.id);
    filtered.unshift({ id: listing.id, title: listing.title, price: listing.price, image: listing.image, category_name: listing.category_name });
    localStorage.setItem("recentlyViewed", JSON.stringify(filtered.slice(0, 10)));
  } catch { /* ignore */ }
}

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [faved, setFaved] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportMsg, setReportMsg] = useState("");
  const [soldMsg, setSoldMsg] = useState("");

  useEffect(() => {
    api.get(`/listings/${id}/`).then((res) => {
      setListing(res.data);
      setFaved(res.data.is_favourited);
      addRecentlyViewed(res.data);
    });
  }, [id]);

  async function handlePay(e) {
    e.preventDefault();
    setPaymentResult(null);
    const phoneClean = phone.trim();
    if (!/^(07\d{8}|01\d{8}|254[17]\d{8}|\+254[17]\d{8})$/.test(phoneClean)) {
      setPaymentResult({ type: "error", message: "Enter a valid Kenyan phone: 07XXXXXXXX, 01XXXXXXXX, or 2547XXXXXXXX." });
      return;
    }
    setPaying(true);
    try {
      const { data } = await initiatePayment(id, phone.trim());
      saveTransaction({
        id: data.transaction_id,
        order_tracking_id: data.order_tracking_id,
        listing_title: listing.title,
        amount: listing.price,
        status: "pending",
      });
      setPaymentResult({ type: "opened" });
      window.open(data.redirect_url, "_blank");
    } catch (err) {
      setPaymentResult({ type: "error", message: err.response?.data?.error || "Payment failed" });
    } finally {
      setPaying(false);
    }
  }

  async function toggleFav() {
    try {
      if (faved) {
        await api.delete(`/favorites/${listing.favourite_id}/`);
      } else {
        const { data } = await api.post("/favorites/", { listing: listing.id });
        listing.favourite_id = data.id;
      }
      setFaved(!faved);
    } catch { /* ignore */ }
  }

  async function handleReport(e) {
    e.preventDefault();
    try {
      await api.post(`/listings/${id}/report/`, { reason: reportReason, description: reportDesc });
      setReportMsg("Report submitted. Thank you.");
      setReportReason("");
      setReportDesc("");
    } catch {
      setReportMsg("Failed to submit report.");
    }
  }

  async function handleMarkSold() {
    if (!confirm("Mark this item as sold?")) return;
    try {
      await api.patch(`/listings/${id}/mark_sold/`);
      setListing((l) => ({ ...l, status: "sold" }));
      setSoldMsg("Marked as sold.");
    } catch {
      setSoldMsg("Failed to mark as sold.");
    }
  }

  if (!listing) return <DetailSkeleton />;

  const isOwnListing = user?.email === listing.seller;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-navy-800 rounded-lg border border-navy-100 dark:border-navy-600 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-navy-700 dark:text-navy-100">{listing.title}</h1>
            <Link to={`/seller/${listing.seller_id}`} className="text-sm text-navy-400 dark:text-navy-200 hover:text-navy-600 dark:hover:text-navy-300 mt-1 inline-block underline underline-offset-2">
              Sold by {listing.seller}
            </Link>
          </div>
          <div className="flex items-start gap-2">
            <button onClick={toggleFav} className="text-xl hover:scale-110 transition" title={faved ? "Remove from wishlist" : "Add to wishlist"}>
              {faved ? "❤️" : "🤍"}
            </button>
            <p className="font-display text-2xl font-bold text-mustard-700 dark:text-mustard-400">
              KSh {Number(listing.price).toLocaleString()}
            </p>
          </div>
        </div>

        {listing.image ? (
          <img src={listing.image} alt={listing.title} className="w-full h-64 object-cover rounded-md mt-4" />
        ) : (
          <div className="w-full h-48 bg-navy-50 dark:bg-navy-700 rounded-md mt-4 flex items-center justify-center text-navy-400 dark:text-navy-200 text-sm">No photo</div>
        )}

        <p className="text-sm text-navy-600 dark:text-navy-300 mt-4">{listing.description}</p>

        {listing.status === "sold" ? (
          <p className="mt-4 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-2 rounded-md border border-red-200 dark:border-red-800">This item has been sold.</p>
        ) : isOwnListing ? (
          <div className="mt-4 flex gap-2">
            <button onClick={handleMarkSold}
              className="bg-navy-600 text-white rounded-md px-4 py-2 text-sm hover:bg-navy-700 transition">Mark as Sold</button>
            {soldMsg && <p className="text-sm text-green-600 self-center">{soldMsg}</p>}
          </div>
        ) : (
          <div className="mt-6 border-t border-navy-100 dark:border-navy-600 pt-4">
            <h2 className="text-sm font-medium text-navy-700 dark:text-navy-200 mb-2">Buy this item</h2>
            <form onSubmit={handlePay} className="flex gap-2">
              <input required value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXX or 2547XXXXXXXX"
                className="flex-1 rounded-md border border-navy-100 dark:border-navy-600 dark:bg-navy-700 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500" />
              <button type="submit" disabled={paying}
                className="bg-mustard-500 text-navy-900 font-medium rounded-md px-4 py-2 text-sm hover:bg-mustard-400 transition disabled:opacity-50">
                {paying ? "Processing..." : "Buy Now"}
              </button>
            </form>
            {paymentResult?.type === "opened" && (
              <p className="mt-3 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-2 rounded-md">
                Payment window opened.
                <br />
                <Link to="/payments" className="underline font-medium">Check payment status</Link>
              </p>
            )}
            {paymentResult?.type === "error" && (
              <p className="mt-3 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-2 rounded-md">{paymentResult.message}</p>
            )}
          </div>
        )}

        {!isOwnListing && (
          <div className="mt-4">
            <button onClick={() => setChatOpen(true)}
              className="w-full border border-navy-300 dark:border-navy-500 text-navy-700 dark:text-navy-200 rounded-md py-2 text-sm font-medium hover:bg-navy-50 dark:hover:bg-navy-700 transition">
              💬 Chat with seller
            </button>
          </div>
        )}

        {!isOwnListing && (
          <details className="mt-4">
            <summary className="text-xs text-navy-400 dark:text-navy-200 cursor-pointer hover:text-navy-600">Report listing</summary>
            <form onSubmit={handleReport} className="mt-2 space-y-2">
              <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} required
                className="w-full rounded-md border border-navy-100 dark:border-navy-600 dark:bg-navy-700 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500">
                <option value="">Select a reason</option>
                <option value="spam">Spam</option>
                <option value="misleading">Misleading</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="rule_violation">Violates campus rules</option>
                <option value="other">Other</option>
              </select>
              <textarea value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} rows={2} placeholder="Optional details..."
                className="w-full rounded-md border border-navy-100 dark:border-navy-600 dark:bg-navy-700 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500" />
              <button type="submit" className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline">Submit report</button>
              {reportMsg && <p className="text-xs text-green-600 dark:text-green-400">{reportMsg}</p>}
            </form>
          </details>
        )}
      </div>

      {chatOpen && <ChatModal listingId={id} sellerId={listing.seller_id} onClose={() => setChatOpen(false)} />}
    </div>
  );
}
