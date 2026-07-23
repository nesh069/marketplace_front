import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/messages/")
      .then((res) => setMessages(res.data.results || res.data))
      .finally(() => setLoading(false));
  }, []);

  const byListing = messages.reduce((acc, m) => {
    acc[m.listing] = acc[m.listing] || [];
    acc[m.listing].push(m);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-xl font-bold text-navy-700 mb-6">Messages</h1>
      {loading ? (
        <p className="text-navy-400 text-sm">Loading...</p>
      ) : Object.keys(byListing).length === 0 ? (
        <p className="text-navy-400 text-sm">No conversations yet - message a seller from a listing page to start one.</p>
      ) : (
        <div className="space-y-3">
          {Object.entries(byListing).map(([listingId, msgs]) => {
            const last = msgs[msgs.length - 1];
            return (
              <Link key={listingId} to={`/listings/${listingId}`}
                className="block bg-white rounded-lg border border-navy-100 p-4 hover:shadow-md transition">
                <p className="text-sm font-medium text-navy-700">Listing #{listingId}</p>
                <p className="text-sm text-navy-400 truncate">{last.sender}: {last.body}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}