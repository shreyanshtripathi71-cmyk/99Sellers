"use client";

import React, { useState, useEffect } from "react";
import { adminAPI } from "@/services/api";

interface UserStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  userTypes: Record<string, number>;
}

interface PropertyStats {
  totalProperties: number;
  totalValue: number;
  avgPrice: number;
  propertiesByType: { PType: string; count: number; avgPrice: number }[];
}

interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  trialingSubscriptions: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  conversionRate: number;
  planDistribution: Record<string, number>;
}

const AdminAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [propertyStats, setPropertyStats] = useState<PropertyStats | null>(null);
  const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userRes, propertyRes, subRes] = await Promise.all([
        adminAPI.users.getStats(),
        adminAPI.properties.getStats(),
        adminAPI.subscriptions.getStats(),
      ]);

      if (userRes.success) setUserStats(userRes.data);
      if (propertyRes.success) setPropertyStats(propertyRes.data);
      if (subRes.success) setSubscriptionStats(subRes.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number | undefined | null) => {
    if (value === undefined || value === null) return "0";
    return new Intl.NumberFormat("en-US").format(value);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 40, color: "#3b82f6", marginBottom: 16 }}></i>
          <p style={{ color: "#64748b" }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: 0, marginBottom: 8 }}>
          Analytics Dashboard
        </h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: 15 }}>
          Real-time insights from your platform data
        </p>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: 16, borderRadius: 8, marginBottom: 24 }}>
          {error}
          <button onClick={fetchAllStats} style={{ marginLeft: 12, textDecoration: "underline", cursor: "pointer", background: "none", border: "none", color: "#991b1b" }}>
            Retry
          </button>
        </div>
      )}

      {/* Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
        <StatCard
          icon="fa-users"
          iconColor="#3b82f6"
          label="Total Users"
          value={formatNumber(userStats?.totalUsers)}
          subtext={`${userStats?.adminUsers || 0} admins`}
        />
        <StatCard
          icon="fa-building"
          iconColor="#10b981"
          label="Total Properties"
          value={formatNumber(propertyStats?.totalProperties)}
          subtext={`Avg: ${formatCurrency(propertyStats?.avgPrice)}`}
        />
        <StatCard
          icon="fa-credit-card"
          iconColor="#8b5cf6"
          label="Active Subscriptions"
          value={formatNumber(subscriptionStats?.activeSubscriptions)}
          subtext={`${subscriptionStats?.trialingSubscriptions || 0} trialing`}
        />
        <StatCard
          icon="fa-dollar-sign"
          iconColor="#f59e0b"
          label="Monthly Revenue"
          value={formatCurrency(subscriptionStats?.monthlyRevenue)}
          subtext={`${subscriptionStats?.conversionRate?.toFixed(1) || 0}% conversion`}
        />
      </div>

      {/* Data Sections */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* User Breakdown */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fa-solid fa-users" style={{ color: "#3b82f6" }}></i>
            User Breakdown
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <MetricRow label="Regular Users" value={userStats?.regularUsers || 0} total={userStats?.totalUsers || 1} color="#3b82f6" />
            <MetricRow label="Admin Users" value={userStats?.adminUsers || 0} total={userStats?.totalUsers || 1} color="#8b5cf6" />
          </div>
        </div>

        {/* Subscription Status */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fa-solid fa-chart-pie" style={{ color: "#10b981" }}></i>
            Subscription Status
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <MetricRow label="Active" value={subscriptionStats?.activeSubscriptions || 0} total={subscriptionStats?.totalSubscriptions || 1} color="#10b981" />
            <MetricRow label="Trialing" value={subscriptionStats?.trialingSubscriptions || 0} total={subscriptionStats?.totalSubscriptions || 1} color="#3b82f6" />
            <MetricRow label="Cancelled" value={subscriptionStats?.cancelledSubscriptions || 0} total={subscriptionStats?.totalSubscriptions || 1} color="#ef4444" />
          </div>
        </div>

        {/* Property Distribution */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fa-solid fa-building" style={{ color: "#f59e0b" }}></i>
            Properties by Type
          </h3>
          {propertyStats?.propertiesByType && propertyStats.propertiesByType.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {propertyStats.propertiesByType.slice(0, 5).map((type, idx) => (
                <div key={type.PType || idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                      color: "#64748b"
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: 14, color: "#374151" }}>{type.PType || "Unknown"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{formatNumber(type.count)}</span>
                    <span style={{ fontSize: 12, color: "#64748b" }}>properties</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#64748b", fontSize: 14 }}>No property data available</p>
          )}
        </div>

        {/* Plan Distribution */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fa-solid fa-layer-group" style={{ color: "#8b5cf6" }}></i>
            Plan Distribution
          </h3>
          {subscriptionStats?.planDistribution && Object.keys(subscriptionStats.planDistribution).length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(subscriptionStats.planDistribution).map(([plan, count]) => (
                <div key={plan} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{plan}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{count}</span>
                    <span style={{ fontSize: 12, color: "#64748b" }}>users</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#64748b", fontSize: 14 }}>No plan distribution data available</p>
          )}
        </div>
      </div>

      {/* Revenue Summary */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 16, padding: 32, marginTop: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 24 }}>Revenue Summary</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          <div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Monthly Revenue</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>{formatCurrency(subscriptionStats?.monthlyRevenue)}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Yearly Revenue (Projected)</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#10b981" }}>{formatCurrency(subscriptionStats?.yearlyRevenue)}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Total Property Value</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#f59e0b" }}>{formatCurrency(propertyStats?.totalValue)}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Conversion Rate</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#3b82f6" }}>{subscriptionStats?.conversionRate?.toFixed(1) || 0}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, iconColor, label, value, subtext }: { icon: string; iconColor: string; label: string; value: string; subtext?: string }) => (
  <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>{value}</div>
        {subtext && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{subtext}</div>}
      </div>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: `${iconColor}15`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <i className={`fa-solid ${icon}`} style={{ fontSize: 18, color: iconColor }}></i>
      </div>
    </div>
  </div>
);

// Metric Row Component
const MetricRow = ({ label, value, total, color }: { label: string; value: number; total: number; color: string }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{value}</span>
      </div>
      <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${percentage}%`, background: color, borderRadius: 4 }}></div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
