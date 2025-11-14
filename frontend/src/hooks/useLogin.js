import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (username, password) => {
    const success = handleInputErrors({ username, password });
    if (!success) return;

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

      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(text || "Login failed");
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || data.message || "Invalid username or password");
      }

      localStorage.setItem("message-user", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;

function handleInputErrors({ username, password }) {
  if (!username || !password) {
    toast.error("Please fill all fields");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}
