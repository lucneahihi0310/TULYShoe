import { createContext, useState, useEffect } from "react";
import { notification } from "antd";
import { fetchData, postData } from "../API/ApiService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncGuestCart = async (userId) => {
    if (isSyncing) {
      console.log("Bỏ qua đồng bộ: Đang trong quá trình đồng bộ");
      return;
    }

    const guestCart = localStorage.getItem("guest_cart");
    if (!guestCart) {
      console.log("Bỏ qua đồng bộ: Không có guest_cart trong localStorage");
      return;
    }

    setIsSyncing(true);
    try {
      const parsedGuestCart = JSON.parse(guestCart || "[]");
      if (parsedGuestCart.length === 0) {
        console.log("Giỏ hàng khách rỗng, bỏ qua đồng bộ");
        return;
      }

      console.log(
        "Bắt đầu đồng bộ giỏ hàng với userId:",
        userId,
        "guestCart:",
        parsedGuestCart
      );

      // Xóa guest_cart trước khi gửi yêu cầu để ngăn gọi lại
      localStorage.removeItem("guest_cart");

      const response = await postData(
        "/cartItem/customers/sync",
        { user_id: userId, guest_cart: parsedGuestCart },
        true
      );

      const failedItems = response.results.filter(
        (result) => result.status === "failed"
      );
      if (failedItems.length > 0) {
        const errorMessages = failedItems
          .map((item) => item.message)
          .join("; ");
        notification.warning({
          message: "Một số sản phẩm không được đồng bộ",
          description: errorMessages,
          placement: "bottomLeft",
          duration: 5,
        });
      } else {
        notification.success({
          message: "Đồng bộ giỏ hàng thành công",
          description:
            "Tất cả sản phẩm trong giỏ hàng của bạn đã được cập nhật.",
          placement: "bottomLeft",
        });
      }

      window.dispatchEvent(new Event("cartUpdated"));
      console.log("Đồng bộ hoàn tất");
    } catch (error) {
      console.error("Lỗi khi đồng bộ giỏ hàng:", error);
      notification.error({
        message: "Lỗi đồng bộ giỏ hàng",
        description: error.message || "Vui lòng thử lại.",
        placement: "bottomLeft",
      });
      // Khôi phục guest_cart nếu đồng bộ thất bại
      localStorage.setItem("guest_cart", guestCart);
    } finally {
      setIsSyncing(false);
    }
  };

  const fetchUser = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const expiresAt = localStorage.getItem("expires_at");

    console.log(
      "fetchUser được gọi với token:",
      token ? "Có token" : "Không có token"
    );

    if (token && expiresAt && Date.now() > parseInt(expiresAt)) {
      console.log("Token hết hạn, xóa token và thông tin liên quan");
      localStorage.removeItem("token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("rememberedEmail");
      setUser(null);
      setIsAuthLoading(false);
      window.dispatchEvent(
        new StorageEvent("storage", { key: "token", newValue: null })
      );
      return;
    }

    if (!token) {
      console.log("Không có token, đặt user về null");
      setUser(null);
      setIsAuthLoading(false);
      return;
    }

    try {
      console.log("Gọi API /account/user để lấy thông tin người dùng");
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
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect trong AuthContext được kích hoạt");
    fetchUser();

    const handleStorageChange = (e) => {
      if (e.key === "token") {
        console.log(
          "Sự kiện storage được kích hoạt với token mới:",
          e.newValue
        );
        fetchUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
