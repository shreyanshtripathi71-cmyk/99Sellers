"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/signin?redirect=/admin");
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#0f172a",
      }}>
        <div style={{ color: "#fff" }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const navGroups = [
    {
      label: "Overview",
      items: [
        { href: "/admin", icon: "fa-gauge-high", label: "Dashboard" },
        { href: "/admin/analytics", icon: "fa-chart-line", label: "Analytics" },
      ],
    },
    {
      label: "Management",
      items: [
        { href: "/admin/users", icon: "fa-users", label: "Users" },
        { href: "/admin/subscriptions", icon: "fa-credit-card", label: "Subscriptions" },
        { href: "/admin/poppins", icon: "fa-bullhorn", label: "Marketing Pop-ins" },
        { href: "/admin/content", icon: "fa-palette", label: "Site Content" },
      ],
    },
    {
      label: "Data",
      items: [
        { href: "/admin/properties", icon: "fa-building", label: "Properties" },
        { href: "/admin/data-import", icon: "fa-file-import", label: "Data Import" },
      ],
    },
    {
      label: "System",
      items: [
        { href: "/admin/crawler", icon: "fa-spider", label: "Crawler" },
        { href: "/admin/settings", icon: "fa-gear", label: "Settings" },
      ],
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: "#0f172a",
        padding: "24px 0",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Logo */}
        <div style={{ padding: "0 24px", marginBottom: 32 }}>
          <Link href="/admin" style={{ textDecoration: "none" }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>
              <span style={{ color: "#3b82f6" }}>99</span>Sellers Admin
            </h2>
          </Link>
        </div>

        {/* Nav Groups */}
        <nav style={{ flex: 1, overflowY: "auto" }}>
          {navGroups.map((group, groupIdx) => (
            <div key={group.label} style={{ marginBottom: 8 }}>
              <div style={{
                padding: "12px 24px 8px",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#475569",
              }}>
                {group.label}
              </div>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 24px",
                    color: "#94a3b8",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                >
                  <i className={`fa-solid ${item.icon}`} style={{ width: 18, fontSize: 14 }}></i>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 600,
            }}>
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{user?.name || "Admin"}</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "8px 16px",
              background: "#1e293b",
              border: "none",
              borderRadius: 6,
              color: "#94a3b8",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-right-from-bracket me-2"></i>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <header style={{
          background: "#fff",
          padding: "16px 32px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: 0 }}>Admin Panel</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/" style={{ color: "#64748b", fontSize: 14 }}>
              <i className="fa-solid fa-arrow-left me-2"></i>
              Back to Site
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: 32 }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
