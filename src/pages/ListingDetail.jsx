import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { initiatePayment, saveTransaction } from "../api/payments";

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const pollRef = useRef(null);

  useEffect(() => {
    api.get(`/listings/${id}/`).then((res) => setListing(res.data));
    api.get(`/messages/`).then((res) => {
      const all = res.data.results || res.data;
      setMessages(all.filter((m) => String(m.listing) === String(id)));
    });
    return () => clearInterval(pollRef.current);
  }, [id]);

  async function handlePay(e) {
    e.preventDefault();
    setPaying(true);
    setPaymentResult(null);
    try {
      const { data } = await initiatePayment(id, phone);
      saveTransaction({
        id: data.transaction_id,
        order_tracking_id: data.order_tracking_id,
        listing_title: listing.title,
        amount: listing.price,
        status: "pending",
      });
      setPaymentResult({ type: "opened", order_tracking_id: data.order_tracking_id });
      window.open(data.redirect_url, "_blank");
    } catch (err) {
      setPaymentResult({ type: "error", message: err.response?.data?.error || "Payment failed" });
    } finally {
      setPaying(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!messageText.trim()) return;
    const { data } = await api.post("/messages/", {
      listing: id,
      recipient: listing.seller_id || listing.seller,
      body: messageText,
    });
    setMessages((m) => [...m, data]);
    setMessageText("");
  }

  if (!listing) return <p className="max-w-2xl mx-auto px-4 py-8 text-navy-400 text-sm">Loading...</p>;

  const isOwnListing = user?.email === listing.seller;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg border border-navy-100 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-navy-700">{listing.title}</h1>
            <p className="text-sm text-navy-400 mt-1">Sold by {listing.seller}</p>
          </div>
          <p className="font-display text-2xl font-bold text-mustard-600">
            KSh {Number(listing.price).toLocaleString()}
          </p>
        </div>
        <p className="text-sm text-navy-600 mt-4">{listing.description}</p>

        {listing.status === "sold" && (
          <p className="mt-4 text-sm bg-navy-50 text-navy-600 px-3 py-2 rounded-md">
            This item has been sold.
          </p>
        )}

        {!isOwnListing && listing.status === "available" && (
          <div className="mt-6 border-t border-navy-100 pt-4">
            <h2 className="text-sm font-medium text-navy-700 mb-2">Buy this item</h2>
            <form onSubmit={handlePay} className="flex gap-2">
              <input required value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="2547XXXXXXXX"
                className="flex-1 rounded-md border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500" />
              <button type="submit" disabled={paying}
                className="bg-mustard-500 text-navy-900 font-medium rounded-md px-4 py-2 text-sm hover:bg-mustard-400 transition disabled:opacity-50">
                {paying ? "Processing..." : "Buy Now"}
              </button>
            </form>

            {paymentResult?.type === "opened" && (
              <p className="mt-3 text-sm bg-green-50 text-green-700 px-3 py-2 rounded-md">
                Payment window opened. Complete payment in the new tab.
                <br />
                <Link to="/payments" className="underline font-medium">Check payment status</Link>
              </p>
            )}
            {paymentResult?.type === "error" && (
              <p className="mt-3 text-sm bg-red-50 text-red-700 px-3 py-2 rounded-md">
                {paymentResult.message}
              </p>
            )}
          </div>
        )}
      </div>

      {!isOwnListing && (
        <div className="mt-6 bg-white rounded-lg border border-navy-100 p-6">
          <h2 className="text-sm font-medium text-navy-700 mb-3">Message the seller</h2>
          <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
            {messages.map((m) => (
              <p key={m.id} className="text-sm text-navy-600">
                <span className="font-medium">{m.sender}:</span> {m.body}
              </p>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input value={messageText} onChange={(e) => setMessageText(e.target.value)}
              placeholder="Ask about the item..."
              className="flex-1 rounded-md border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500" />
            <button type="submit" className="bg-navy-600 text-white rounded-md px-4 py-2 text-sm hover:bg-navy-700 transition">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
