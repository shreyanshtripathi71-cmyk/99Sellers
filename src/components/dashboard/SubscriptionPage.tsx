"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "@/components/search/DashboardShell";
import styles from "@/components/search/styles/dashboard.module.scss";
import { useAuth } from "@/context/AuthContext";
import { subscriptionAPI } from "@/services/api";

interface Plan {
  id: string | number;
  name: string;
  price: number;
  billingCycle: string;
  features: Record<string, any> | string[];
  description: string;
  type?: string;
  popular?: boolean;
  trialDays?: number;
}

interface CurrentSubscription {
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
  billingCycle: string;
  price: number;
  autoRenew: boolean;
  trial?: {
    daysRemaining: number;
  };
}

const SubscriptionPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [selectedBilling, setSelectedBilling] = useState<"monthly" | "yearly">("monthly");
  const [processingPlanId, setProcessingPlanId] = useState<string | number | null>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const [plansResponse, statusResponse] = await Promise.all([
        subscriptionAPI.getPlans(),
        subscriptionAPI.getStatus(),
      ]);

      if (plansResponse.success && plansResponse.data) {
        const plansData = Array.isArray(plansResponse.data) ? plansResponse.data : [];
        // Transform features object to array of strings
        const transformedPlans = plansData.map((plan: any) => ({
          ...plan,
          type: plan.id,
          popular: plan.id === "premium",
          trialDays: 14,
          features: transformFeaturesToArray(plan.features, plan.description),
        }));
        setPlans(transformedPlans);
      } else {
        setPlans([]);
      }

      if (statusResponse.success && statusResponse.data) {
        setCurrentSubscription(statusResponse.data);
      }
    } catch (error) {
      console.error("Failed to load subscription data:", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const transformFeaturesToArray = (features: Record<string, any>, description: string): string[] => {
    const featureList: string[] = [];
    
    if (features.searchLimit) {
      featureList.push(
        features.searchLimit === -1
          ? "Unlimited property searches"
          : `Up to ${features.searchLimit.toLocaleString()} property searches`
      );
    }
    
    if (features.exportLimit !== undefined && features.exportLimit !== 0) {
      featureList.push(
        features.exportLimit === -1
          ? "Unlimited data exports"
          : `Export up to ${features.exportLimit.toLocaleString()} properties`
      );
    }
    
    if (features.fullDataAccess) {
      featureList.push("Full access to property details");
    }
    
    if (features.apiCallsPerDay) {
      featureList.push(
        features.apiCallsPerDay === -1
          ? "Unlimited API calls"
          : `${features.apiCallsPerDay.toLocaleString()} API calls per day`
      );
    }
    
    if (features.advancedSearch) {
      featureList.push("Advanced search & filtering");
    }
    
    if (features.exportEnabled) {
      featureList.push("CSV/Excel export capabilities");
    }
    
    if (features.apiAccess) {
      featureList.push("Full API access");
    }
    
    if (featureList.length === 0) {
      featureList.push("Basic property search");
      featureList.push("Limited data access");
    }
    
    return featureList;
  };

  const handleSubscribe = async (planId: string | number) => {
    try {
      setProcessingPlanId(planId);
      const numericPlanId = typeof planId === 'string' ? 0 : planId;
      const result = await subscriptionAPI.create(numericPlanId, selectedBilling);
      
      if (result.success) {
        alert("Subscription created successfully!");
        await loadSubscriptionData();
      } else {
        alert(result.error || "Failed to create subscription");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("An error occurred while processing your subscription");
    } finally {
      setProcessingPlanId(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;

    try {
      const result = await subscriptionAPI.cancel();
      if (result.success) {
        alert("Subscription cancelled successfully");
        await loadSubscriptionData();
      } else {
        alert(result.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("An error occurred while cancelling your subscription");
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType?.toLowerCase()) {
      case "basic":
        return "fa-layer-group";
      case "professional":
        return "fa-rocket";
      case "enterprise":
        return "fa-crown";
      default:
        return "fa-box";
    }
  };

  if (loading) {
    return (
      <DashboardShell title="Subscription" subtitle="Manage your subscription plan">
        <div style={{ textAlign: "center", padding: 48 }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6" }}></i>
          <p style={{ marginTop: 16, color: "#6B7280" }}>Loading subscription details...</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Subscription" subtitle="Choose the perfect plan for your needs">
      <div className={styles.pageContent}>
        {/* Current Subscription Status */}
        {currentSubscription && (
          <div
            style={{
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              borderRadius: 16,
              padding: 32,
              marginBottom: 24,
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <i className="fa-solid fa-circle-check" style={{ fontSize: 24 }}></i>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
                    {currentSubscription.planType} Plan
                  </h2>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="fa-solid fa-badge-check"></i>
                    <span style={{ fontSize: 14, opacity: 0.9 }}>
                      Status: {currentSubscription.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="fa-solid fa-calendar"></i>
                    <span style={{ fontSize: 14, opacity: 0.9 }}>
                      {currentSubscription.billingCycle} billing
                    </span>
                  </div>
                </div>
                <p style={{ margin: "8px 0 0", fontSize: 14, opacity: 0.85 }}>
                  Valid until: {new Date(currentSubscription.endDate).toLocaleDateString()}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
                  ${currentSubscription.price}
                </div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>
                  per {currentSubscription.billingCycle === "monthly" ? "month" : "year"}
                </div>
              </div>
            </div>

            {currentSubscription.trial && (
              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <i className="fa-solid fa-clock" style={{ fontSize: 20 }}></i>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Trial Period Active</div>
                  <div style={{ fontSize: 13, opacity: 0.9 }}>
                    {currentSubscription.trial.daysRemaining} days remaining in your free trial
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Billing Toggle */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              background: "#F3F4F6",
              borderRadius: 12,
              padding: 4,
            }}
          >
            <button
              onClick={() => setSelectedBilling("monthly")}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                border: "none",
                background: selectedBilling === "monthly" ? "#fff" : "transparent",
                color: selectedBilling === "monthly" ? "#1F2937" : "#6B7280",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: selectedBilling === "monthly" ? "0 2px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedBilling("yearly")}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                border: "none",
                background: selectedBilling === "yearly" ? "#fff" : "transparent",
                color: selectedBilling === "yearly" ? "#1F2937" : "#6B7280",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: selectedBilling === "yearly" ? "0 2px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              Yearly
              <span
                style={{
                  marginLeft: 6,
                  padding: "2px 6px",
                  background: "#10B981",
                  color: "#fff",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginBottom: 32,
          }}
        >
          {Array.isArray(plans) && plans.length > 0 ? (
            plans
              .filter((plan) => plan.billingCycle === selectedBilling)
              .map((plan) => {
                const isCurrentPlan =
                  currentSubscription?.planType?.toLowerCase() === plan.type?.toLowerCase();
                const isPopular = plan.popular;

                return (
                  <div
                    key={plan.id}
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      border: isPopular ? "2px solid #3B82F6" : "1px solid #E5E7EB",
                      padding: 24,
                      position: "relative",
                      transition: "all 0.3s",
                    }}
                  >
                    {isPopular && (
                      <div
                        style={{
                          position: "absolute",
                          top: -12,
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                          color: "#fff",
                          padding: "6px 16px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
                        }}
                      >
                        MOST POPULAR
                      </div>
                    )}

                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background: isPopular
                            ? "linear-gradient(135deg, #3B82F6, #2563EB)"
                            : "#F3F4F6",
                          color: isPopular ? "#fff" : "#3B82F6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 16px",
                          fontSize: 24,
                        }}
                      >
                        <i className={`fa-solid ${getPlanIcon(plan.type || "basic")}`}></i>
                      </div>
                      <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1F2937" }}>
                        {plan.name}
                      </h3>
                      <p style={{ margin: "8px 0 0", fontSize: 14, color: "#6B7280" }}>
                        {plan.description}
                      </p>
                    </div>

                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                      <div style={{ fontSize: 48, fontWeight: 700, color: "#1F2937" }}>
                        ${plan.price}
                      </div>
                      <div style={{ fontSize: 14, color: "#6B7280" }}>
                        per {plan.billingCycle === "monthly" ? "month" : "year"}
                      </div>
                      {(plan.trialDays || 0) > 0 && (
                        <div
                          style={{
                            marginTop: 8,
                            padding: "6px 12px",
                            background: "#FEF3C7",
                            color: "#92400E",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            display: "inline-block",
                          }}
                        >
                          {plan.trialDays} days free trial
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isCurrentPlan || processingPlanId === plan.id}
                      style={{
                        width: "100%",
                        padding: "14px 24px",
                        borderRadius: 10,
                        border: "none",
                        background: isCurrentPlan
                          ? "#E5E7EB"
                          : isPopular
                          ? "linear-gradient(135deg, #3B82F6, #2563EB)"
                          : "#1F2937",
                        color: isCurrentPlan ? "#6B7280" : "#fff",
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: isCurrentPlan ? "not-allowed" : "pointer",
                        transition: "all 0.3s",
                        marginBottom: 24,
                      }}
                    >
                      {processingPlanId === plan.id ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                        </>
                      ) : isCurrentPlan ? (
                        <>
                          <i className="fa-solid fa-check"></i> Current Plan
                        </>
                      ) : (
                        <>Get Started</>
                      )}
                    </button>

                    <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 20 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1F2937",
                          marginBottom: 12,
                        }}
                      >
                        What's included:
                      </div>
                      {Array.isArray(plan.features) && plan.features.map((feature: string, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "start",
                            gap: 10,
                            marginBottom: 10,
                            fontSize: 14,
                            color: "#4B5563",
                          }}
                        >
                          <i
                            className="fa-solid fa-circle-check"
                            style={{ color: "#10B981", marginTop: 2 }}
                          ></i>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
          ) : (
            <div style={{ textAlign: "center", padding: 48, gridColumn: "1 / -1" }}>
              <i
                className="fa-solid fa-box-open"
                style={{ fontSize: 48, color: "#D1D5DB", marginBottom: 16 }}
              ></i>
              <p style={{ color: "#6B7280", fontSize: 16 }}>
                No subscription plans available at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Manage Subscription Section */}
        {currentSubscription && currentSubscription.status !== "cancelled" && (
          <div className={styles.settingsSection}>
            <div className={styles.settingsSectionHeader}>
              <h3 className={styles.settingsSectionTitle}>
                <i className="fa-solid fa-gear me-2" style={{ color: "#3B82F6" }}></i>
                Manage Subscription
              </h3>
            </div>
            <div className={styles.settingsSectionBody}>
              <div className={styles.settingsItem}>
                <div className={styles.settingsItemInfo}>
                  <span className={styles.settingsItemLabel}>Auto-Renewal</span>
                  <span className={styles.settingsItemDesc}>
                    {currentSubscription.autoRenew
                      ? "Your subscription will automatically renew"
                      : "Auto-renewal is disabled"}
                  </span>
                </div>
                <label
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: 48,
                    height: 24,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={currentSubscription.autoRenew}
                    onChange={() => {}}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: currentSubscription.autoRenew ? "#3B82F6" : "#D1D5DB",
                      borderRadius: 24,
                      transition: "0.3s",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        content: "",
                        height: 20,
                        width: 20,
                        left: currentSubscription.autoRenew ? 26 : 2,
                        bottom: 2,
                        background: "white",
                        borderRadius: "50%",
                        transition: "0.3s",
                      }}
                    ></span>
                  </span>
                </label>
              </div>

              <div className={styles.settingsItem}>
                <div className={styles.settingsItemInfo}>
                  <span className={styles.settingsItemLabel}>Cancel Subscription</span>
                  <span className={styles.settingsItemDesc}>
                    You'll lose access to all premium features
                  </span>
                </div>
                <button
                  onClick={handleCancelSubscription}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "1px solid #EF4444",
                    background: "#fff",
                    color: "#EF4444",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <i className="fa-solid fa-xmark me-2"></i>
                  Cancel Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionHeader}>
            <h3 className={styles.settingsSectionTitle}>
              <i className="fa-solid fa-circle-question me-2" style={{ color: "#F59E0B" }}></i>
              Frequently Asked Questions
            </h3>
          </div>
          <div className={styles.settingsSectionBody}>
            {[
              {
                q: "Can I change my plan anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and PayPal for your convenience.",
              },
              {
                q: "Is there a free trial available?",
                a: "Yes! All new users get a 14-day free trial on any plan with no credit card required.",
              },
              {
                q: "Can I cancel my subscription?",
                a: "Absolutely. You can cancel anytime from this page. You'll retain access until the end of your billing period.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                style={{
                  padding: 16,
                  background: idx % 2 === 0 ? "#F9FAFB" : "#fff",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: "#1F2937",
                    marginBottom: 6,
                    fontSize: 14,
                  }}
                >
                  {faq.q}
                </div>
                <div style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default SubscriptionPage;
