import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
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

      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(text || "Logout failed");
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || data.message || "Logout failed");
      }

      localStorage.removeItem("message-user");
      setAuthUser(null);
    } catch (error) {
      toast.error(error.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;
