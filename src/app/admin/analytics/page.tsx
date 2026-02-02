"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface UserActivity {
  userId: string;
  email: string;
  action: string;
  page: string;
  timestamp: string;
}

interface AnalyticsData {
  totalPageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: string;
  topPages: { page: string; views: number }[];
  userActivity: UserActivity[];
}

const AdminAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("7d");
  const [analyticsData] = useState<AnalyticsData>({
    totalPageViews: 12543,
    uniqueVisitors: 3421,
    avgSessionDuration: "4m 32s",
    bounceRate: "34.2%",
    topPages: [
      { page: "/search", views: 4521 },
      { page: "/dashboard/billing", views: 2134 },
      { page: "/dashboard/saved", views: 1876 },
      { page: "/signin", views: 1654 },
      { page: "/signup", views: 1432 },
    ],
    userActivity: [
      { userId: "1", email: "john@example.com", action: "Search", page: "/search", timestamp: "2 mins ago" },
      { userId: "2", email: "jane@example.com", action: "Export", page: "/search", timestamp: "5 mins ago" },
      { userId: "3", email: "mike@example.com", action: "Save Lead", page: "/search", timestamp: "8 mins ago" },
      { userId: "4", email: "sarah@example.com", action: "View Billing", page: "/dashboard/billing", timestamp: "12 mins ago" },
      { userId: "5", email: "tom@example.com", action: "Login", page: "/signin", timestamp: "15 mins ago" },
    ],
  });

  const statCards = [
    { label: "Page Views", value: analyticsData.totalPageViews.toLocaleString(), icon: "fa-eye", color: "#3b82f6" },
    { label: "Unique Visitors", value: analyticsData.uniqueVisitors.toLocaleString(), icon: "fa-users", color: "#10b981" },
    { label: "Avg Session", value: analyticsData.avgSessionDuration, icon: "fa-clock", color: "#f59e0b" },
    { label: "Bounce Rate", value: analyticsData.bounceRate, icon: "fa-arrow-right-from-bracket", color: "#ef4444" },
  ];

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: 32 
        }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: 0, marginBottom: 8 }}>
              Analytics
            </h1>
            <p style={{ color: "#64748b", margin: 0, fontSize: 15 }}>
              Track user activity and platform performance
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["24h", "7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: 8,
                  background: dateRange === range ? "#3b82f6" : "#f1f5f9",
                  color: dateRange === range ? "#fff" : "#64748b",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}>
          {statCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{card.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>{card.value}</div>
                </div>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${card.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <i className={`fa-solid ${card.icon}`} style={{ fontSize: 18, color: card.color }}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Top Pages */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 20 }}>
              Top Pages
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {analyticsData.topPages.map((page, idx) => (
                <div key={page.page} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#64748b",
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#0f172a" }}>{page.page}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#3b82f6" }}>
                    {page.views.toLocaleString()} views
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent User Activity */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 20 }}>
              Recent User Activity
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {analyticsData.userActivity.map((activity) => (
                <div 
                  key={activity.userId + activity.timestamp}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    background: "#f8fafc",
                    borderRadius: 10,
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#3b82f615",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#3b82f6",
                  }}>
                    {activity.email[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>
                      {activity.email}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {activity.action} on {activity.page}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>
                    {activity.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;
