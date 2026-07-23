import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function initials(name) {
  return (name || "?").slice(0, 2).toUpperCase();
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500",
    "bg-pink-500", "bg-teal-500", "bg-indigo-500", "bg-rose-500",
  ];
  return colors[Math.abs(hash) % colors.length];
}

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/messages/")
      .then((res) => setMessages(res.data.results || res.data))
      .catch(() => setError("Could not load messages."))
      .finally(() => setLoading(false));
  }, []);

  const byListing = messages.reduce((acc, m) => {
    const key = m.listing;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  if (loading) {
    return <p className="max-w-2xl mx-auto px-4 py-8 text-navy-400 text-sm">Loading messages...</p>;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-md border border-red-200">
          {error}
          <button onClick={() => window.location.reload()} className="ml-2 underline font-medium">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-xl font-bold text-navy-700 mb-6">Messages</h1>

      {Object.keys(byListing).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-navy-400 text-sm mb-1">No conversations yet.</p>
          <p className="text-navy-400 text-xs">Message a seller from a listing page to start one.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {Object.entries(byListing).map(([listingId, msgs]) => {
            const last = msgs[msgs.length - 1];
            const otherParty = last.sender === user?.email ? last.recipient : last.sender;
            const unread = msgs.filter((m) => !m.is_read && m.sender !== user?.email).length;

            return (
              <Link
                key={listingId}
                to={`/listings/${listingId}`}
                className="flex items-center gap-3 bg-white rounded-lg border border-navy-100 p-4 hover:shadow-md transition"
              >
                <div className={`w-10 h-10 rounded-full ${avatarColor(otherParty)} flex items-center justify-center text-white text-sm font-medium shrink-0`}>
                  {initials(otherParty)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-navy-700 truncate">Listing #{listingId}</p>
                    <span className="text-xs text-navy-400 shrink-0">{timeAgo(last.created_at)}</span>
                  </div>
                  <p className="text-sm text-navy-500 truncate mt-0.5">
                    <span className="font-medium">{last.sender === user?.email ? "You" : last.sender.split("@")[0]}:</span>{" "}
                    {last.body}
                  </p>
                </div>
                {unread > 0 && (
                  <span className="bg-mustard-500 text-navy-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
