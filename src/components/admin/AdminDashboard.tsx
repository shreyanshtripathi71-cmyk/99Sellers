"use client";

import React, { useEffect, useState } from "react";
import { adminAPI } from "@/services/api";
import Link from "next/link";

interface DashboardStats {
  users: { total: number; admin: number; regular: number; newToday?: number };
  properties: { total: number };
  auctions: { total: number; upcoming: number };
  subscriptions: { active: number; revenue: number; trial?: number };
}

interface RecentActivity {
  id: string;
  type: "user" | "subscription" | "property" | "login";
  message: string;
  time: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity] = useState<RecentActivity[]>([
    { id: "1", type: "user", message: "New user registered: john@example.com", time: "2 mins ago" },
    { id: "2", type: "subscription", message: "Subscription upgraded to Pro", time: "15 mins ago" },
    { id: "3", type: "login", message: "Admin login from new device", time: "1 hour ago" },
    { id: "4", type: "property", message: "50 new properties imported", time: "3 hours ago" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersResult, propertiesResult] = await Promise.all([
          adminAPI.users.getStats(),
          adminAPI.properties.getStats(),
        ]);

        setStats({
          users: usersResult.success ? { ...usersResult.data, newToday: 12 } : { total: 0, admin: 0, regular: 0, newToday: 0 },
          properties: propertiesResult.success ? propertiesResult.data : { total: 0 },
          auctions: { total: 0, upcoming: 0 },
          subscriptions: { active: 0, revenue: 0, trial: 0 },
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      label: "Total Users", 
      value: stats?.users?.total || 0, 
      subtext: `+${stats?.users?.newToday || 0} today`,
      icon: "fa-users", 
      color: "#3b82f6",
      bgGradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    },
    { 
      label: "Active Subscriptions", 
      value: stats?.subscriptions?.active || 0, 
      subtext: `${stats?.subscriptions?.trial || 0} on trial`,
      icon: "fa-credit-card", 
      color: "#8b5cf6",
      bgGradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    },
    { 
      label: "Properties", 
      value: stats?.properties?.total || 0, 
      subtext: "Total in database",
      icon: "fa-building", 
      color: "#10b981",
      bgGradient: "linear-gradient(135deg, #10b981, #059669)",
    },
    { 
      label: "Upcoming Auctions", 
      value: stats?.auctions?.upcoming || 0, 
      subtext: "Next 7 days",
      icon: "fa-gavel", 
      color: "#f59e0b",
      bgGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user": return "fa-user-plus";
      case "subscription": return "fa-arrow-up";
      case "property": return "fa-building";
      case "login": return "fa-right-to-bracket";
      default: return "fa-bell";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "user": return "#3b82f6";
      case "subscription": return "#10b981";
      case "property": return "#f59e0b";
      case "login": return "#8b5cf6";
      default: return "#64748b";
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ 
          fontSize: 28, 
          fontWeight: 700, 
          color: "#0f172a", 
          margin: 0,
          marginBottom: 8,
        }}>
          Dashboard
        </h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: 15 }}>
          Welcome back! Here&apos;s what&apos;s happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 20,
        marginBottom: 32,
      }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: card.bgGradient,
              borderRadius: 16,
              padding: 24,
              color: "#fff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background Pattern */}
            <div style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }} />
            <div style={{
              position: "absolute",
              bottom: -30,
              right: 30,
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                marginBottom: 16,
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <i className={`fa-solid ${card.icon}`} style={{ fontSize: 18 }}></i>
                </div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
                {loading ? "..." : card.value.toLocaleString()}
              </div>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{card.subtext}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 24,
      }}>
        {/* Recent Activity */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            marginBottom: 20,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", margin: 0 }}>
              Recent Activity
            </h3>
            <Link href="/admin/analytics" style={{ 
              fontSize: 13, 
              color: "#3b82f6", 
              textDecoration: "none",
              fontWeight: 500,
            }}>
              View All
            </Link>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentActivity.map((activity) => (
              <div 
                key={activity.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 12,
                  background: "#f8fafc",
                  borderRadius: 10,
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: `${getActivityColor(activity.type)}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <i 
                    className={`fa-solid ${getActivityIcon(activity.type)}`} 
                    style={{ fontSize: 14, color: getActivityColor(activity.type) }}
                  ></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "#0f172a", fontWeight: 500 }}>
                    {activity.message}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: "#0f172a" }}>
            Quick Actions
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/admin/users" style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 14,
              background: "#f8fafc",
              borderRadius: 10,
              textDecoration: "none",
              color: "#374151",
              fontSize: 14,
              fontWeight: 500,
              transition: "all 0.2s",
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#3b82f615",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <i className="fa-solid fa-user-plus" style={{ color: "#3b82f6", fontSize: 14 }}></i>
              </div>
              Manage Users
            </Link>
            <Link href="/admin/data-import" style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 14,
              background: "#f8fafc",
              borderRadius: 10,
              textDecoration: "none",
              color: "#374151",
              fontSize: 14,
              fontWeight: 500,
              transition: "all 0.2s",
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#10b98115",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <i className="fa-solid fa-file-import" style={{ color: "#10b981", fontSize: 14 }}></i>
              </div>
              Import Data
            </Link>
            <Link href="/admin/poppins" style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 14,
              background: "#f8fafc",
              borderRadius: 10,
              textDecoration: "none",
              color: "#374151",
              fontSize: 14,
              fontWeight: 500,
              transition: "all 0.2s",
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#8b5cf615",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <i className="fa-solid fa-bullhorn" style={{ color: "#8b5cf6", fontSize: 14 }}></i>
              </div>
              Marketing Pop-ins
            </Link>
            <Link href="/admin/settings" style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 14,
              background: "#f8fafc",
              borderRadius: 10,
              textDecoration: "none",
              color: "#374151",
              fontSize: 14,
              fontWeight: 500,
              transition: "all 0.2s",
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#f59e0b15",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <i className="fa-solid fa-gear" style={{ color: "#f59e0b", fontSize: 14 }}></i>
              </div>
              System Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
