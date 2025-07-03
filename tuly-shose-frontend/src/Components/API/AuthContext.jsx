import { createContext, useState, useEffect } from "react";
import { fetchData, postData } from "../API/ApiService";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const syncGuestCart = async (userId) => {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
    for (let item of guestCart) {
      try {
        await postData("cartItem/customers", { ...item, user_id: userId }, true);
      } catch (err) {
        console.error("Lỗi khi đồng bộ giỏ hàng:", err);
      }
    }
    window.dispatchEvent(new Event("cartUpdated"));
    localStorage.removeItem("guest_cart");
  };

  const fetchUser = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const expiresAt = localStorage.getItem("expires_at");

    if (token && expiresAt && Date.now() > parseInt(expiresAt)) {
      localStorage.removeItem("token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("rememberedEmail");
      setUser(null);
      window.dispatchEvent(
        new StorageEvent("storage", { key: "token", newValue: null })
      );
      return;
    }

    if (!token) return;

    try {
      const data = await fetchData("account/user", true);
      setUser(data);
      await syncGuestCart(data._id);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin user:", err);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("expires_at");
      sessionStorage.removeItem("token");
      window.dispatchEvent(
        new StorageEvent("storage", { key: "token", newValue: null })
      );
    }
  };

  useEffect(() => {
    fetchUser();

    const handleStorageChange = () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const expiresAt = localStorage.getItem("expires_at");

      if (!token || (expiresAt && Date.now() > parseInt(expiresAt))) {
        localStorage.removeItem("token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("rememberedEmail");
        setUser(null);
        window.dispatchEvent(
          new StorageEvent("storage", { key: "token", newValue: null })
        );
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
