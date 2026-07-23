import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { MessageSkeleton } from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";

function initials(name) {
  return (name || "?")
    .split("@")[0]
    .split(/[._\s]/)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const COLORS = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500",
  "bg-pink-500", "bg-teal-500", "bg-indigo-500", "bg-rose-500",
];

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);

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

  const threadList = Object.entries(byListing)
    .map(([listingId, msgs]) => {
      const last = msgs[msgs.length - 1];
      const otherParty = last.sender === user?.email ? last.recipient : last.sender;
      const otherName = otherParty.split("@")[0];
      const unread = msgs.filter((m) => !m.is_read && m.sender !== user?.email).length;
      const preview = last.body.length > 60 ? last.body.slice(0, 60) + "…" : last.body;
      return { listingId, msgs, last, otherParty, otherName, unread, preview };
    })
    .sort((a, b) => new Date(b.last.created_at) - new Date(a.last.created_at));

  const selectedThread = threadList.find((t) => String(t.listingId) === String(selectedListing));

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-xl font-bold text-navy-700 dark:text-navy-100 mb-6">Messages</h1>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <MessageSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-md border border-red-200 dark:border-red-800">
          {error}
          <button onClick={() => window.location.reload()} className="ml-2 underline font-medium">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-xl font-bold text-navy-700 dark:text-navy-100 mb-6">Messages</h1>

      {threadList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-navy-400 dark:text-navy-500 text-sm mb-1">No conversations yet.</p>
          <p className="text-navy-400 dark:text-navy-500 text-xs">Message a seller from a listing page to start one.</p>
        </div>
      ) : selectedThread ? (
        <div>
          <button onClick={() => setSelectedListing(null)}
            className="text-sm text-navy-500 dark:text-navy-400 hover:text-navy-700 mb-4 underline underline-offset-2">&larr; All conversations</button>

          <div className="bg-white dark:bg-navy-800 rounded-lg border border-navy-100 dark:border-navy-600">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-navy-100 dark:border-navy-600">
              <div className={`w-8 h-8 rounded-full ${avatarColor(selectedThread.otherParty)} flex items-center justify-center text-white text-xs font-bold`}>
                {initials(selectedThread.otherParty)}
              </div>
              <div>
                <p className="text-sm font-medium text-navy-700 dark:text-navy-200">{selectedThread.otherName}</p>
                <Link to={`/listings/${selectedThread.listingId}`} className="text-xs text-navy-400 dark:text-navy-500 hover:underline">Listing #{selectedThread.listingId}</Link>
              </div>
            </div>

            <div className="px-4 py-3 space-y-3 max-h-96 overflow-y-auto">
              {selectedThread.msgs.map((m) => {
                const isMe = m.sender === user?.email;
                return (
                  <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      isMe
                        ? "bg-mustard-500 text-navy-900"
                        : "bg-navy-50 dark:bg-navy-700 text-navy-700 dark:text-navy-200"
                    }`}>
                      <p>{m.body}</p>
                      <p className={`text-[10px] mt-0.5 ${isMe ? "text-navy-700" : "text-navy-400 dark:text-navy-500"}`}>
                        {timeAgo(m.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {threadList.map((t) => (
            <button key={t.listingId} onClick={() => setSelectedListing(t.listingId)}
              className="w-full flex items-center gap-3 bg-white dark:bg-navy-800 rounded-lg border border-navy-100 dark:border-navy-600 p-4 hover:shadow-md transition text-left">
              <div className={`w-10 h-10 rounded-full ${avatarColor(t.otherParty)} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                {initials(t.otherParty)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-navy-700 dark:text-navy-200 truncate">{t.otherName}</p>
                  <span className="text-xs text-navy-400 dark:text-navy-500 shrink-0">{timeAgo(t.last.created_at)}</span>
                </div>
                <p className="text-sm text-navy-500 dark:text-navy-400 truncate mt-0.5">{t.preview}</p>
              </div>
              {t.unread > 0 && (
                <span className="bg-mustard-500 text-navy-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                  {t.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
