import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getSavedTransactions, saveTransaction } from "../api/payments";

const STATUS_DISPLAY = {
  success: {
    icon: "✓",
    title: "Payment Successful!",
    message: "Order confirmed. The seller will be notified.",
    color: "bg-green-50 text-green-700 border-green-200",
    iconBg: "bg-green-100 text-green-600",
  },
  failed: {
    icon: "✕",
    title: "Payment Failed",
    message: "Payment did not go through. Please try again.",
    color: "bg-red-50 text-red-700 border-red-200",
    iconBg: "bg-red-100 text-red-600",
  },
  pending: {
    icon: "⋯",
    title: "Payment Pending",
    message: "Your payment is being processed. Check back later.",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    iconBg: "bg-yellow-100 text-yellow-600",
  },
  unknown: {
    icon: "?",
    title: "Payment Status Unknown",
    message: "We couldn't determine the payment status. Check your payments page.",
    color: "bg-gray-50 text-gray-700 border-gray-200",
    iconBg: "bg-gray-100 text-gray-600",
  },
};

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const [display, setDisplay] = useState(null);

  useEffect(() => {
    const status = searchParams.get("status") || "";
    const orderId = searchParams.get("order") || "";

    if (!status) {
      setDisplay(STATUS_DISPLAY.unknown);
      return;
    }

    if (status === "success") {
      const txs = getSavedTransactions();
      const match = txs.find((t) => t.order_tracking_id === orderId);
      if (match) {
        saveTransaction({ ...match, status: "success" });
      }
    }

    setDisplay(STATUS_DISPLAY[status] || STATUS_DISPLAY.unknown);
  }, [searchParams]);

  if (!display) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className={`rounded-lg border p-8 text-center ${display.color}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold ${display.iconBg}`}>
          {display.icon}
        </div>
        <h1 className="font-display text-xl font-bold mt-4">{display.title}</h1>
        <p className="text-sm mt-2">{display.message}</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/"
            className="bg-navy-600 text-white rounded-md px-4 py-2 text-sm hover:bg-navy-700 transition">
            Back to Listings
          </Link>
          <Link to="/payments"
            className="border border-navy-300 dark:border-navy-600 text-navy-700 dark:text-navy-200 rounded-md px-4 py-2 text-sm hover:bg-navy-50 dark:hover:bg-navy-700 transition">
            My Payments
          </Link>
        </div>
      </div>
    </div>
  );
}
