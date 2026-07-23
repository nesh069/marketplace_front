import { useEffect, useRef, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ChatModal({ listingId, sellerEmail, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get("/messages/")
      .then((res) => {
        const all = res.data.results || res.data;
        setMessages(all.filter((m) => String(m.listing) === String(listingId)));
      })
      .finally(() => setLoading(false));
  }, [listingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const { data } = await api.post("/messages/", {
      listing: listingId,
      recipient: sellerEmail,
      body: text,
    });
    setMessages((m) => [...m, data]);
    setText("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-navy-800 rounded-t-xl sm:rounded-xl shadow-xl w-full sm:w-96 sm:mb-0 max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-navy-100 dark:border-navy-600">
          <h3 className="text-sm font-medium text-navy-700 dark:text-navy-200">Chat with seller</h3>
          <button onClick={onClose} className="text-navy-400 hover:text-navy-600 dark:hover:text-navy-200 text-lg leading-none">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px]">
          {loading ? (
            <p className="text-xs text-navy-400 text-center">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-xs text-navy-400 text-center">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((m) => {
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
                      {m.sender === user?.email ? "You" : m.sender.split("@")[0]}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="flex gap-2 p-3 border-t border-navy-100 dark:border-navy-600">
          <input value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-md border border-navy-100 dark:border-navy-600 dark:bg-navy-700 dark:text-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-500" />
          <button type="submit"
            className="bg-mustard-500 text-navy-900 font-medium rounded-md px-4 py-2 text-sm hover:bg-mustard-400 transition shrink-0">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
