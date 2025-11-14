import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
    const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
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

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(text || "Signup failed");
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || data.message || "Signup failed");
      }

      localStorage.setItem("message-user", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error("Please fill all fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}
