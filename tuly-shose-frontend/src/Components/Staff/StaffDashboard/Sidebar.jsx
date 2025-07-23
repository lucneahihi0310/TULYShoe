"use client"

import { useEffect, useState, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Nav, Badge, Spinner } from "react-bootstrap"
import { FaComments, FaBox, FaShoppingCart, FaBell, FaCalendarAlt, FaUser, FaTachometerAlt } from "react-icons/fa"
import { AuthContext } from "../../API/AuthContext"
import { fetchNotifications } from "../../API/notificationApi"

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(AuthContext)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Load notifications để lấy số lượng chưa đọc
  const loadUnreadCount = async () => {
    try {
      if (!user) return
      setLoading(true)
      const data = await fetchNotifications()
      const unread = data.filter((noti) => !noti.is_read).length
      setUnreadCount(unread)
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUnreadCount()
    // Refresh unread count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [user])

  const menu = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: FaTachometerAlt,
      path: "/dashboard/dashboard",
    },
    {
      key: "feedbacks",
      label: "Customer Feedbacks",
      icon: FaComments,
      path: "/dashboard/feedbacks",
    },
    {
      key: "products",
      label: "Products",
      icon: FaBox,
      path: "/dashboard/products",
    },
    {
      key: "orders",
      label: "Orders",
      icon: FaShoppingCart,
      path: "/dashboard/orders",
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: FaBell,
      path: "/dashboard/notifications",
      badge: unreadCount,
    },
    {
      key: "schedule",
      label: "Schedule",
      icon: FaCalendarAlt,
      path: "/dashboard/schedule",
    },
    {
      key: "profile",
      label: "Profile",
      icon: FaUser,
      path: "/dashboard/profile",
    },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="d-flex flex-column h-100 py-3">
      {/* Logo/Brand */}
      <div className="px-3 mb-4">
        <h4 className="text-white mb-0">
          <FaTachometerAlt className="me-2" />
          Staff Panel
        </h4>
      </div>

      {/* Navigation Menu */}
      <Nav className="flex-column px-2">
        {menu.map((item) => {
          const IconComponent = item.icon
          const active = isActive(item.path)

          return (
            <Nav.Item key={item.key} className="mb-1">
              <Nav.Link
                className={`d-flex align-items-center px-3 py-2 rounded text-decoration-none position-relative ${
                  active ? "bg-primary text-white" : "text-light hover-bg-secondary"
                }`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: active ? "#0d6efd" : "transparent",
                }}
                onClick={() => navigate(item.path)}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.1)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.target.style.backgroundColor = "transparent"
                  }
                }}
              >
                <IconComponent className="me-3" size={18} />
                <span className="flex-grow-1">{item.label}</span>

                {/* Badge for notifications */}
                {item.key === "notifications" && (
                  <>
                    {loading ? (
                      <Spinner
                        animation="border"
                        size="sm"
                        className="ms-2"
                        style={{ width: "16px", height: "16px" }}
                      />
                    ) : (
                      unreadCount > 0 && (
                        <Badge
                          bg="danger"
                          pill
                          className="ms-2"
                          style={{
                            fontSize: "0.75rem",
                            minWidth: "20px",
                          }}
                        >
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                      )
                    )}
                  </>
                )}
              </Nav.Link>
            </Nav.Item>
          )
        })}
      </Nav>

      {/* User Info (Optional) */}
      {user && (
        <div className="mt-auto px-3 py-3 border-top border-secondary">
          <div className="d-flex align-items-center text-light">
            <div
              className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
              style={{ width: "32px", height: "32px" }}
            >
              <FaUser size={14} />
            </div>
            <div className="flex-grow-1">
              <div className="small fw-semibold">{user.name || "Staff User"}</div>
              <div className="small text-muted">{user.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
