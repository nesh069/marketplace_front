import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSavedTransactions, getPaymentStatus } from "../api/payments";

const STATUS_STYLE = {
  success: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

export default function MyPayments() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const saved = getSavedTransactions();
      const results = await Promise.allSettled(
        saved.map((tx) =>
          getPaymentStatus(tx.id).then((r) => ({
            ...tx,
            status: r.data.status,
            updated: true,
          }))
        )
      );
      setTransactions(
        results.map((r) =>
          r.status === "fulfilled" ? r.value : { ...saved[0], status: "unknown" }
        )
      );
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) {
    return <p className="max-w-2xl mx-auto px-4 py-8 text-navy-400 text-sm">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-xl font-bold text-navy-700 mb-6">My Payments</h1>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-navy-400 text-sm mb-4">No payments yet.</p>
          <Link to="/" className="bg-mustard-500 text-navy-900 font-medium rounded-md px-4 py-2 text-sm hover:bg-mustard-400 transition">
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white border border-navy-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-700">{tx.listing_title || `Listing #${tx.id}`}</p>
                <p className="text-xs text-navy-400 mt-0.5">
                  KSh {Number(tx.amount || 0).toLocaleString()} &middot; Order: {tx.order_tracking_id?.slice(0, 8)}...
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_STYLE[tx.status] || "bg-gray-100 text-gray-600"}`}>
                {tx.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
