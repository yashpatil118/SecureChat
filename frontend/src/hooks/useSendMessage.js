
import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message) => {
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
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages([...messages, data]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
