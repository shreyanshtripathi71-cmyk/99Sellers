"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/services/api";

interface Subscription {
  id: number;
  userId: number;
  planType: "free" | "basic" | "premium" | "enterprise";
  status: "active" | "inactive" | "cancelled" | "trial";
  billingCycle?: "monthly" | "yearly";
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  user?: {
    FirstName: string;
    LastName: string;
    Email: string;
  };
}

interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  cancelledSubscriptions: number;
  revenueByPlan: Record<string, number>;
}

const AdminSubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsResponse, statsResponse] = await Promise.all([
        adminAPI.subscriptions.getAll(),
        adminAPI.subscriptions.getStats(),
      ]);

      if (subsResponse.success && subsResponse.data) {
        setSubscriptions(subsResponse.data);
      }
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError("Failed to fetch subscriptions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    if (!confirm("Are you sure you want to cancel this subscription?")) return;
    try {
      const response = await adminAPI.subscriptions.cancel(subscriptionId);
      if (response.success) {
        await fetchData();
      } else {
        setError(response.error || "Failed to cancel subscription");
      }
    } catch (err) {
      setError("Failed to cancel subscription");
      console.error(err);
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const userName = ((sub.user?.FirstName || "") + " " + (sub.user?.LastName || "") + " " + (sub.user?.Email || "")).toLowerCase();
    const matchesSearch = userName.includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === "all" || sub.planType === filterPlan;
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise": return { bg: "#ede9fe", color: "#6d28d9" };
      case "premium": return { bg: "#dcfce7", color: "#166534" };
      case "basic": return { bg: "#dbeafe", color: "#1d4ed8" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return { bg: "#dcfce7", color: "#166534" };
      case "trial": return { bg: "#dbeafe", color: "#1d4ed8" };
      case "cancelled": return { bg: "#fef2f2", color: "#dc2626" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: 0, marginBottom: 8 }}>
              Subscriptions Management
            </h1>
            <p style={{ color: "#64748b", margin: 0, fontSize: 15 }}>
              Manage user subscriptions and billing
            </p>
          </div>
          <button
            onClick={fetchData}
            style={{
              padding: "10px 20px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <i className="fa-solid fa-arrows-rotate"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 24 }}>
        <div style={{
          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          borderRadius: 12,
          padding: 20,
          color: "#fff",
        }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Total</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{stats?.totalSubscriptions || 0}</div>
        </div>
        <div style={{
          background: "linear-gradient(135deg, #10b981, #059669)",
          borderRadius: 12,
          padding: 20,
          color: "#fff",
        }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Active</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{stats?.activeSubscriptions || 0}</div>
        </div>
        <div style={{
          background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          borderRadius: 12,
          padding: 20,
          color: "#fff",
        }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Trial</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{stats?.trialSubscriptions || 0}</div>
        </div>
        <div style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          borderRadius: 12,
          padding: 20,
          color: "#fff",
        }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Cancelled</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{stats?.cancelledSubscriptions || 0}</div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{
          padding: 16,
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: 8,
          color: "#991B1B",
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </div>
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#991B1B" }}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 180px", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <i className="fa-solid fa-search" style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              fontSize: 14,
            }}></i>
            <input
              type="text"
              placeholder="Search by user name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 14,
              outline: "none",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 14,
              outline: "none",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="cancelled">Cancelled</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 48,
          color: "#64748b",
        }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
          Loading subscriptions...
        </div>
      ) : (
        /* Subscriptions Table */
        <div style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>ID</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>User</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Plan</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Billing</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Period</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
                      No subscriptions found
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((sub, idx) => {
                    const planStyle = getPlanColor(sub.planType);
                    const statusStyle = getStatusColor(sub.status);
                    return (
                      <tr key={sub.id} style={{ borderTop: "1px solid #f1f5f9", background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#64748b" }}>{sub.id}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontSize: 14, color: "#0f172a", fontWeight: 500 }}>
                            {sub.user?.FirstName} {sub.user?.LastName}
                          </div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>{sub.user?.Email}</div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{
                            padding: "4px 10px",
                            background: planStyle.bg,
                            color: planStyle.color,
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 500,
                            textTransform: "capitalize",
                          }}>
                            {sub.planType}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{
                            padding: "4px 10px",
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 500,
                            textTransform: "capitalize",
                          }}>
                            {sub.status}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#64748b", textTransform: "capitalize" }}>
                          {sub.billingCycle || "N/A"}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b" }}>
                          {formatDate(sub.startDate)} - {formatDate(sub.endDate)}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            {sub.status === "active" && (
                              <button
                                onClick={() => handleCancelSubscription(sub.id)}
                                style={{
                                  padding: "6px 12px",
                                  background: "#fef2f2",
                                  color: "#ef4444",
                                  border: "none",
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 500,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <i className="fa-solid fa-ban" style={{ fontSize: 10 }}></i>
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", background: "#f8fafc" }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionsPage;
