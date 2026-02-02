"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/services/api";

interface PlanFeatures {
  searchLimit: number;
  exportLimit: number;
  apiCallsPerDay: number;
  fullDataAccess: boolean;
  advancedSearch: boolean;
  exportEnabled: boolean;
  apiAccess: boolean;
}

interface Plan {
  id: number;
  name: string;
  type: string;
  price: number;
  billingCycle: string;
  features: PlanFeatures;
  description: string;
  stripePriceId: string;
  stripeProductId: string;
  popular: boolean;
  trialDays: number;
  isActive: boolean;
}

interface Subscription {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  planName: string;
  planType: string;
  status: string;
  price: number;
  billingCycle: string;
  startDate: string;
  endDate: string;
  stripeSubscriptionId: string;
}

interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  trialingSubscriptions: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  conversionRate: number;
}

const AdminSubscriptionsPage = () => {
  const [activeTab, setActiveTab] = useState<"plans" | "subscriptions">("plans");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);

  const defaultPlanForm = {
    name: "",
    type: "basic" as "basic" | "premium" | "enterprise",
    price: 0,
    billingCycle: "monthly",
    description: "",
    stripePriceId: "",
    stripeProductId: "",
    popular: false,
    trialDays: 0,
    searchLimit: 50,
    exportLimit: 100,
    apiCallsPerDay: 100,
    fullDataAccess: false,
    advancedSearch: false,
    exportEnabled: true,
    apiAccess: false,
  };

  const [planForm, setPlanForm] = useState(defaultPlanForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plansRes, subsRes, statsRes] = await Promise.all([
        adminAPI.subscriptions.getPlans(),
        adminAPI.subscriptions.getAll(),
        adminAPI.subscriptions.getStats(),
      ]);

      if (plansRes.success && plansRes.data) {
        const plansData = (plansRes.data as any).plans || plansRes.data;
        setPlans(Array.isArray(plansData) ? plansData : []);
      }

      if (subsRes.success && subsRes.data) {
        const subsData = (subsRes.data as any).subscriptions || subsRes.data;
        setSubscriptions(Array.isArray(subsData) ? subsData : []);
      }

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data as SubscriptionStats);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm(defaultPlanForm);
    setShowPlanModal(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      type: plan.type as "basic" | "premium" | "enterprise",
      price: plan.price,
      billingCycle: plan.billingCycle,
      description: plan.description || "",
      stripePriceId: plan.stripePriceId || "",
      stripeProductId: plan.stripeProductId || "",
      popular: plan.popular || false,
      trialDays: plan.trialDays || 0,
      searchLimit: plan.features?.searchLimit || 50,
      exportLimit: plan.features?.exportLimit || 100,
      apiCallsPerDay: plan.features?.apiCallsPerDay || 100,
      fullDataAccess: plan.features?.fullDataAccess || false,
      advancedSearch: plan.features?.advancedSearch || false,
      exportEnabled: plan.features?.exportEnabled || true,
      apiAccess: plan.features?.apiAccess || false,
    });
    setShowPlanModal(true);
  };

  const handleSavePlan = async () => {
    if (!planForm.name || !planForm.stripePriceId) {
      alert("Please fill in Plan Name and Stripe Price ID");
      return;
    }

    setSaving(true);
    try {
      const planData = {
        ...(editingPlan ? { id: editingPlan.id } : {}),
        name: planForm.name,
        type: planForm.type,
        price: planForm.price,
        billingCycle: planForm.billingCycle,
        description: planForm.description,
        stripePriceId: planForm.stripePriceId,
        stripeProductId: planForm.stripeProductId,
        popular: planForm.popular,
        trialDays: planForm.trialDays,
        features: {
          searchLimit: planForm.searchLimit,
          exportLimit: planForm.exportLimit,
          apiCallsPerDay: planForm.apiCallsPerDay,
          fullDataAccess: planForm.fullDataAccess,
          advancedSearch: planForm.advancedSearch,
          exportEnabled: planForm.exportEnabled,
          apiAccess: planForm.apiAccess,
        },
      };

      const response = await adminAPI.subscriptions.createOrUpdatePlan(planData);
      if (response.success) {
        setShowPlanModal(false);
        fetchData();
      } else {
        alert(response.error || "Failed to save plan");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("An error occurred while saving the plan");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm("Are you sure you want to delete this plan? This cannot be undone.")) return;

    try {
      const response = await adminAPI.subscriptions.deletePlan(planId);
      if (response.success) {
        fetchData();
      } else {
        alert(response.error || "Failed to delete plan");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the plan");
    }
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    if (!confirm("Are you sure you want to cancel this subscription?")) return;

    try {
      const response = await adminAPI.subscriptions.cancel(subscriptionId);
      if (response.success) {
        fetchData();
      } else {
        alert(response.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("An error occurred");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return { bg: "#dcfce7", color: "#166534" };
      case "trialing": return { bg: "#dbeafe", color: "#1e40af" };
      case "cancelled": return { bg: "#fee2e2", color: "#991b1b" };
      case "expired": return { bg: "#f3f4f6", color: "#4b5563" };
      default: return { bg: "#f3f4f6", color: "#4b5563" };
    }
  };

  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case "basic": return "#64748b";
      case "premium": return "#3b82f6";
      case "enterprise": return "#8b5cf6";
      default: return "#64748b";
    }
  };

  return (
    <div style={{ padding: 32, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: 0 }}>
          Subscription Management
        </h1>
        <p style={{ color: "#64748b", marginTop: 4 }}>
          Manage subscription plans and connect them to Stripe for billing
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>Active Subscriptions</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#10b981" }}>{stats.activeSubscriptions}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>Trialing</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#3b82f6" }}>{stats.trialingSubscriptions}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>Monthly Revenue</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>${stats.monthlyRevenue?.toFixed(2) || "0.00"}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>Conversion Rate</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#f59e0b" }}>{stats.conversionRate?.toFixed(1) || 0}%</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ marginBottom: 24, borderBottom: "2px solid #e2e8f0" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { key: "plans", label: "Subscription Plans", icon: "fa-credit-card" },
            { key: "subscriptions", label: "Active Subscriptions", icon: "fa-users" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: "12px 24px",
                border: "none",
                background: "transparent",
                borderBottom: activeTab === tab.key ? "3px solid #3b82f6" : "3px solid transparent",
                color: activeTab === tab.key ? "#3b82f6" : "#64748b",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Tab */}
      {activeTab === "plans" && (
        <div>
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: 0 }}>Pricing Plans</h2>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                Create plans and link them to Stripe Price IDs for automatic billing
              </p>
            </div>
            <button
              onClick={handleCreatePlan}
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <i className="fa-solid fa-plus"></i>
              Add Plan
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 48 }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32, color: "#3b82f6" }}></i>
            </div>
          ) : plans.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: 48, textAlign: "center" }}>
              <i className="fa-solid fa-credit-card" style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }}></i>
              <p style={{ color: "#64748b", fontSize: 16, marginBottom: 8 }}>No subscription plans yet</p>
              <p style={{ color: "#94a3b8", fontSize: 14 }}>Create your first plan to start accepting payments</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: 24,
                    border: plan.popular ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                    position: "relative",
                  }}
                >
                  {plan.popular && (
                    <div style={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#3b82f6",
                      color: "#fff",
                      padding: "4px 16px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      POPULAR
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{
                      padding: "4px 10px",
                      background: `${getPlanTypeColor(plan.type)}15`,
                      color: getPlanTypeColor(plan.type),
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}>
                      {plan.type}
                    </span>
                    {plan.trialDays > 0 && (
                      <span style={{
                        padding: "4px 10px",
                        background: "#fef3c7",
                        color: "#92400e",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                      }}>
                        {plan.trialDays} day trial
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: "8px 0" }}>{plan.name}</h3>

                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 36, fontWeight: 700, color: "#0f172a" }}>${plan.price}</span>
                    <span style={{ fontSize: 14, color: "#64748b" }}>/{plan.billingCycle}</span>
                  </div>

                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16, minHeight: 40 }}>
                    {plan.description || "No description"}
                  </p>

                  {/* Stripe Info */}
                  <div style={{
                    background: "#f8fafc",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                    border: "1px solid #e2e8f0",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <i className="fa-brands fa-stripe" style={{ fontSize: 14 }}></i>
                      Stripe Configuration
                    </div>
                    <div style={{ fontSize: 12, color: plan.stripePriceId ? "#10b981" : "#ef4444", display: "flex", alignItems: "center", gap: 6 }}>
                      <i className={`fa-solid ${plan.stripePriceId ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
                      {plan.stripePriceId ? `Price: ${plan.stripePriceId.substring(0, 20)}...` : "No Stripe Price ID configured"}
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>FEATURES</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ fontSize: 13, color: "#475569", display: "flex", alignItems: "center", gap: 8 }}>
                        <i className="fa-solid fa-search" style={{ width: 14, color: "#3b82f6" }}></i>
                        {plan.features?.searchLimit === -1 ? "Unlimited" : plan.features?.searchLimit || 0} searches
                      </div>
                      <div style={{ fontSize: 13, color: "#475569", display: "flex", alignItems: "center", gap: 8 }}>
                        <i className="fa-solid fa-download" style={{ width: 14, color: "#3b82f6" }}></i>
                        {plan.features?.exportLimit === -1 ? "Unlimited" : plan.features?.exportLimit || 0} exports
                      </div>
                      <div style={{ fontSize: 13, color: "#475569", display: "flex", alignItems: "center", gap: 8 }}>
                        <i className="fa-solid fa-code" style={{ width: 14, color: "#3b82f6" }}></i>
                        {plan.features?.apiCallsPerDay === -1 ? "Unlimited" : plan.features?.apiCallsPerDay || 0} API calls/day
                      </div>
                      {plan.features?.advancedSearch && (
                        <div style={{ fontSize: 13, color: "#475569", display: "flex", alignItems: "center", gap: 8 }}>
                          <i className="fa-solid fa-check" style={{ width: 14, color: "#10b981" }}></i>
                          Advanced Search
                        </div>
                      )}
                      {plan.features?.fullDataAccess && (
                        <div style={{ fontSize: 13, color: "#475569", display: "flex", alignItems: "center", gap: 8 }}>
                          <i className="fa-solid fa-check" style={{ width: 14, color: "#10b981" }}></i>
                          Full Data Access
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleEditPlan(plan)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: "#f1f5f9",
                        color: "#3b82f6",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      <i className="fa-solid fa-pen"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      style={{
                        padding: "10px 16px",
                        background: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === "subscriptions" && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: 0, marginBottom: 24 }}>
            Active Subscriptions
          </h2>

          {loading ? (
            <div style={{ textAlign: "center", padding: 48 }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32, color: "#3b82f6" }}></i>
            </div>
          ) : subscriptions.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: 48, textAlign: "center" }}>
              <i className="fa-solid fa-users" style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }}></i>
              <p style={{ color: "#64748b", fontSize: 16 }}>No subscriptions yet</p>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Customer</th>
                    <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Plan</th>
                    <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Status</th>
                    <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Amount</th>
                    <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Next Billing</th>
                    <th style={{ textAlign: "right", padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 500, color: "#0f172a", fontSize: 14 }}>{sub.userName}</div>
                        <div style={{ color: "#64748b", fontSize: 13 }}>{sub.userEmail}</div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 500, color: "#0f172a", fontSize: 14 }}>{sub.planName}</div>
                        <div style={{ color: "#64748b", fontSize: 12 }}>{sub.billingCycle}</div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          background: getStatusColor(sub.status).bg,
                          color: getStatusColor(sub.status).color,
                        }}>
                          {sub.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px", fontWeight: 600, color: "#0f172a", fontSize: 14 }}>
                        ${sub.price}/{sub.billingCycle === "monthly" ? "mo" : "yr"}
                      </td>
                      <td style={{ padding: "16px 20px", color: "#64748b", fontSize: 13 }}>
                        {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : "-"}
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        {sub.status === "active" && (
                          <button
                            onClick={() => handleCancelSubscription(sub.id)}
                            style={{
                              padding: "6px 12px",
                              background: "#fee2e2",
                              color: "#dc2626",
                              border: "none",
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Plan Modal */}
      {showPlanModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowPlanModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              maxWidth: 640,
              width: "95%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "24px 28px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  {editingPlan ? "Edit Plan" : "Create New Plan"}
                </h2>
                <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                  Configure pricing and connect to Stripe
                </p>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                style={{ width: 36, height: 36, borderRadius: 8, border: "none", background: "#f1f5f9", color: "#64748b", cursor: "pointer", fontSize: 16 }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "24px 28px" }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>Basic Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Plan Name *</label>
                    <input
                      type="text"
                      value={planForm.name}
                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                      placeholder="e.g., Pro Plan"
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Plan Type</label>
                    <select
                      value={planForm.type}
                      onChange={(e) => setPlanForm({ ...planForm, type: e.target.value as any })}
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }}
                    >
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Billing Cycle</label>
                    <select
                      value={planForm.billingCycle}
                      onChange={(e) => setPlanForm({ ...planForm, billingCycle: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Description</label>
                    <textarea
                      value={planForm.description}
                      onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                      placeholder="Describe what's included..."
                      rows={2}
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, resize: "vertical" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 24, padding: 20, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>Pricing & Stripe</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Price (USD) *</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>$</span>
                      <input
                        type="number"
                        value={planForm.price}
                        onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                        placeholder="29.99"
                        step="0.01"
                        style={{ width: "100%", padding: "10px 14px 10px 28px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Trial Days</label>
                    <input
                      type="number"
                      value={planForm.trialDays}
                      onChange={(e) => setPlanForm({ ...planForm, trialDays: Number(e.target.value) })}
                      placeholder="0"
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Stripe Price ID *</label>
                    <input
                      type="text"
                      value={planForm.stripePriceId}
                      onChange={(e) => setPlanForm({ ...planForm, stripePriceId: e.target.value })}
                      placeholder="price_1234567890abcdef"
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, fontFamily: "monospace" }}
                    />
                    <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>Get this from Stripe Dashboard → Products → Price ID</p>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Stripe Product ID</label>
                    <input
                      type="text"
                      value={planForm.stripeProductId}
                      onChange={(e) => setPlanForm({ ...planForm, stripeProductId: e.target.value })}
                      placeholder="prod_1234567890abcdef"
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, fontFamily: "monospace" }}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={planForm.popular}
                        onChange={(e) => setPlanForm({ ...planForm, popular: e.target.checked })}
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Mark as Popular</span>
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>Usage Limits</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Search Limit</label>
                    <input
                      type="number"
                      value={planForm.searchLimit}
                      onChange={(e) => setPlanForm({ ...planForm, searchLimit: Number(e.target.value) })}
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }}
                    />
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>-1 = unlimited</p>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Export Limit</label>
                    <input
                      type="number"
                      value={planForm.exportLimit}
                      onChange={(e) => setPlanForm({ ...planForm, exportLimit: Number(e.target.value) })}
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }}
                    />
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>-1 = unlimited</p>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" }}>API Calls/Day</label>
                    <input
                      type="number"
                      value={planForm.apiCallsPerDay}
                      onChange={(e) => setPlanForm({ ...planForm, apiCallsPerDay: Number(e.target.value) })}
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }}
                    />
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>-1 = unlimited</p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>Feature Toggles</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { key: "fullDataAccess", label: "Full Data Access" },
                    { key: "advancedSearch", label: "Advanced Search" },
                    { key: "exportEnabled", label: "Export Enabled" },
                    { key: "apiAccess", label: "API Access" },
                  ].map((feature) => (
                    <label
                      key={feature.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 12,
                        background: (planForm as any)[feature.key] ? "#f0fdf4" : "#f8fafc",
                        borderRadius: 8,
                        border: `1px solid ${(planForm as any)[feature.key] ? "#86efac" : "#e2e8f0"}`,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={(planForm as any)[feature.key]}
                        onChange={(e) => setPlanForm({ ...planForm, [feature.key]: e.target.checked })}
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 28px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                onClick={() => setShowPlanModal(false)}
                style={{ padding: "10px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                disabled={saving}
                style={{
                  padding: "10px 24px",
                  background: saving ? "#94a3b8" : "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {saving && <span>...</span>}
                {editingPlan ? "Update Plan" : "Create Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionsPage;
