import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSavedTransactions, getPaymentStatus } from "../api/payments";

const STATUS_STYLE = {
  success: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",
  pending: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400",
  failed: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400",
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
    return <p className="max-w-2xl mx-auto px-4 py-8 text-navy-400 dark:text-navy-200 text-sm">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-xl font-bold text-navy-700 dark:text-navy-100 mb-6">My Payments</h1>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-navy-400 dark:text-navy-200 text-sm mb-4">No payments yet.</p>
          <Link to="/" className="bg-mustard-500 text-navy-900 font-medium rounded-md px-4 py-2 text-sm hover:bg-mustard-400 transition">
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-600 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-700 dark:text-navy-200">{tx.listing_title || `Listing #${tx.id}`}</p>
                <p className="text-xs text-navy-400 dark:text-navy-200 mt-0.5">
                  KSh {Number(tx.amount || 0).toLocaleString()} &middot; Order: {tx.order_tracking_id?.slice(0, 8)}...
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_STYLE[tx.status] || "bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-navy-200"}`}>
                {tx.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
