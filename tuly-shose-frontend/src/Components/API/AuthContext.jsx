import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const syncGuestCart = async (userId) => {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
    for (let item of guestCart) {
      try {
        await fetch("http://localhost:9999/cartItem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...item, user_id: userId }),
        });
      } catch (err) {
        console.error("Lỗi khi đồng bộ giỏ hàng:", err);
      }
    }
    window.dispatchEvent(new Event("cartUpdated"));
    localStorage.removeItem("guest_cart");
  };

  const fetchUser = async () => {
    let token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const expiresAt = localStorage.getItem("expires_at");

    // Kiểm tra token trong localStorage và thời hạn
    if (token && localStorage.getItem("token") && expiresAt) {
      const currentTime = Date.now();
      if (currentTime > parseInt(expiresAt)) {
        localStorage.removeItem("token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("rememberedEmail");
        setUser(null);
        window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: null }));
        return;
      }
    }

    if (!token) return;

    try {
      const res = await fetch("http://localhost:9999/account/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        await syncGuestCart(data._id); // ✅ Đồng bộ khi user xác thực thành công
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("expires_at");
        sessionStorage.removeItem("token");
        window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: null }));
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông tin user:", err);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("expires_at");
      sessionStorage.removeItem("token");
      window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: null }));
    }
  };

  useEffect(() => {
    fetchUser();

    const handleStorageChange = () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const expiresAt = localStorage.getItem("expires_at");
      if (!token) {
        setUser(null);
      } else if (localStorage.getItem("token") && expiresAt && Date.now() > parseInt(expiresAt)) {
        localStorage.removeItem("token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("rememberedEmail");
        setUser(null);
        window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: null }));
      } else {
        fetchUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
