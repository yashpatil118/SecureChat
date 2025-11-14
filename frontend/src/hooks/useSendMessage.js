import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message) => {
    if (!selectedConversation || !selectedConversation._id) {
      toast.error("No conversation selected");
      return;
    }

    setLoading(true);
    try {
      // fetch CSRF token (server returns { csrfToken })
      const tokenResp = await fetch("/api/csrf-token", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      let csrfToken = "";
      if (tokenResp.ok) {
        try {
          const jt = await tokenResp.json();
          csrfToken = jt.csrfToken || "";
        } catch {}
      }

      const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ message }),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(text || "Failed to send message");
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || data.message || "Failed to send message");
      }

      setMessages((prev) => [...prev, data]);
    } catch (error) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
