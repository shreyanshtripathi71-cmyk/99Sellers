"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import DashboardShell from "@/components/search/DashboardShell";
import styles from "@/components/search/styles/dashboard.module.scss";
import { subscriptionAPI } from "@/services/api";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const DEFAULT_PRICING_PLANS: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "For individual investors getting started",
    monthlyPrice: 49,
    yearlyPrice: 39,
    features: [
      "500 leads/month",
      "Basic property data",
      "Owner information",
      "Email support",
      "Basic search filters",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "For serious investors scaling their business",
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: [
      "2,500 leads/month",
      "Full property data",
      "Owner contact info",
      "Phone & email support",
      "Advanced filters",
      "Skip tracing (100/mo)",
      "Export to CSV/Excel",
      "Saved searches & alerts",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For teams and high-volume operations",
    monthlyPrice: 249,
    yearlyPrice: 199,
    features: [
      "Unlimited leads",
      "Full property data",
      "Priority support",
      "Unlimited users",
      "All features included",
      "Skip tracing (500/mo)",
      "API access",
      "Dedicated manager",
    ],
  },
];

const SubscriptionPage: React.FC = () => {
  const { subscription, isTrialActive, getTrialDaysRemaining, refreshSubscription } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PRICING_PLANS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await subscriptionAPI.getPlans();
        if (response.success && response.data) {
          const mappedPlans: PricingPlan[] = response.data.map((plan: any) => ({
            id: plan.id,
            name: plan.name,
            description: plan.description || "",
            monthlyPrice: plan.price || 0,
            yearlyPrice: Math.round((plan.price || 0) * 0.8),
            features: Object.entries(plan.features || {}).map(([key, value]) => {
              if (key === "searchLimit") return value === -1 ? "Unlimited searches/month" : value + " searches/month";
              if (key === "exportLimit") return value === -1 ? "Unlimited exports/month" : value + " exports/month";
              if (key === "fullDataAccess" && value) return "Full data access";
              if (key === "advancedSearch" && value) return "Advanced search filters";
              if (key === "exportEnabled" && value) return "Export to CSV/Excel";
              if (key === "apiAccess" && value) return "API access";
              return null;
            }).filter(Boolean) as string[],
            highlighted: plan.id === "premium",
            badge: plan.id === "premium" ? "Most Popular" : undefined,
          })).filter((p: PricingPlan) => p.id !== "free");
          
          if (mappedPlans.length > 0) {
            setPlans(mappedPlans);
          }
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Could not load subscription plans from server. Showing default plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);
    
    try {
      const result = await subscriptionAPI.create(
        plans.findIndex(p => p.id === planId) + 1,
        billingCycle
      );
      
      if (result.success) {
        toast.success("Subscription created successfully!");
        await refreshSubscription();
      } else {
        toast.error(result.error || "Failed to create subscription");
      }
    } catch (err) {
      toast.error("Failed to process subscription. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getPrice = (plan: PricingPlan) => {
    return billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: PricingPlan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice * 12;
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
  };

  const getCurrentPlanName = () => {
    if (!subscription) return "Free";
    return subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);
  };

  const trialActive = isTrialActive();
  const trialDays = getTrialDaysRemaining();
  const currentPlanName = getCurrentPlanName();

  return (
    <DashboardShell 
      title="Subscription" 
      subtitle="Choose the plan that works for you"
      actions={
        <div className={styles.btnGroup}>
          <button
            className={styles.btn + " " + (billingCycle === "monthly" ? styles.btnPrimary : styles.btnSecondary)}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={styles.btn + " " + (billingCycle === "yearly" ? styles.btnPrimary : styles.btnSecondary)}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly
            <span style={{
              marginLeft: 8,
              background: "#dcfce7",
              color: "#166534",
              padding: "2px 8px",
              borderRadius: 12,
              fontSize: 11,
              fontWeight: 600,
            }}>Save 20%</span>
          </button>
        </div>
      }
    >
      <div className={styles.pageContent}>
        {/* Current Plan Status */}
        {(subscription || trialActive) && (
          <div className={styles.settingsSection}>
            <div 
              className={styles.settingsSectionHeader} 
              style={{
                background: trialActive 
                  ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" 
                  : "linear-gradient(135deg, #10b981, #059669)",
                borderRadius: "12px 12px 0 0",
                padding: "20px 24px",
                borderBottom: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <i 
                  className={"fa-solid " + (trialActive ? "fa-clock" : "fa-crown")}
                  style={{ fontSize: 24, color: "#fff" }}
                ></i>
                <div>
                  <h3 className={styles.settingsSectionTitle} style={{ color: "#fff", margin: 0 }}>
                    {trialActive ? "Free Trial Active" : currentPlanName + " Plan"}
                  </h3>
                  <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
                    {trialActive 
                      ? trialDays + " days remaining in your trial" 
                      : "You have full access to all features"}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.settingsSectionBody}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>
                    Status
                  </span>
                  <span style={{ 
                    fontSize: 14, 
                    fontWeight: 600, 
                    color: subscription?.status === "active" || trialActive ? "#10B981" : "#EF4444" 
                  }}>
                    {trialActive ? "Trial Active" : (subscription?.status === "active" ? "Active" : "Inactive")}
                  </span>
                </div>
                <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>
                    Billing Cycle
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1F2937" }}>
                    {subscription?.billingCycle === "yearly" ? "Annual" : "Monthly"}
                  </span>
                </div>
                {subscription?.endDate && (
                  <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 8 }}>
                    <span style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>
                      Next Billing Date
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1F2937" }}>
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
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
            gap: 8,
            marginBottom: 24,
          }}>
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            padding: 48,
            color: "#6B7280",
          }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
            Loading plans...
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
            marginTop: 24,
          }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={styles.settingsSection}
                style={{
                  background: plan.highlighted 
                    ? "linear-gradient(135deg, #1e3a5f, #0f172a)" 
                    : "#fff",
                  position: "relative",
                  border: plan.highlighted ? "2px solid #3b82f6" : undefined,
                  overflow: "visible",
                  marginBottom: 0,
                }}
              >
                {plan.badge && (
                  <div style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    color: "#fff",
                    padding: "6px 16px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}>{plan.badge}</div>
                )}

                <div style={{ padding: "32px 24px" }}>
                  <h3 style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: plan.highlighted ? "#fff" : "#0f172a",
                    marginBottom: 8,
                  }}>{plan.name}</h3>
                  
                  <p style={{
                    fontSize: 14,
                    color: plan.highlighted ? "rgba(255,255,255,0.7)" : "#64748b",
                    margin: "0 0 24px 0",
                  }}>{plan.description}</p>

                  <div style={{ marginBottom: 24 }}>
                    <span style={{
                      fontSize: 42,
                      fontWeight: 800,
                      color: plan.highlighted ? "#fff" : "#0f172a",
                    }}>${getPrice(plan)}</span>
                    <span style={{
                      fontSize: 16,
                      color: plan.highlighted ? "rgba(255,255,255,0.6)" : "#94a3b8",
                    }}>/month</span>
                    {billingCycle === "yearly" && (
                      <div style={{
                        fontSize: 13,
                        color: "#22c55e",
                        marginTop: 4,
                      }}>Save {getSavings(plan)}% with yearly billing</div>
                    )}
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0" }}>
                    {plan.features.map((feature: string, idx: number) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 0",
                          borderBottom: idx < plan.features.length - 1 
                            ? "1px solid " + (plan.highlighted ? "rgba(255,255,255,0.1)" : "#f1f5f9")
                            : "none",
                        }}
                      >
                        <i 
                          className="fa-solid fa-check" 
                          style={{ 
                            color: plan.highlighted ? "#22c55e" : "#3b82f6",
                            fontSize: 14,
                          }}
                        ></i>
                        <span style={{
                          fontSize: 14,
                          color: plan.highlighted ? "rgba(255,255,255,0.9)" : "#374151",
                        }}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isProcessing && selectedPlan === plan.id}
                    className={styles.btn + " " + (plan.highlighted ? styles.btnPrimary : styles.btnSecondary)}
                    style={{
                      width: "100%",
                      padding: "14px 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      cursor: isProcessing && selectedPlan === plan.id ? "not-allowed" : "pointer",
                    }}
                  >
                    {isProcessing && selectedPlan === plan.id ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Processing...
                      </>
                    ) : subscription?.plan === plan.id ? (
                      <>
                        <i className="fa-solid fa-check"></i>
                        Current Plan
                      </>
                    ) : (
                      "Get Started"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FAQ Section */}
        <div className={styles.settingsSection} style={{ marginTop: 24 }}>
          <div className={styles.settingsSectionHeader}>
            <h3 className={styles.settingsSectionTitle}>
              <i className="fa-solid fa-circle-question me-2" style={{ color: "#8B5CF6" }}></i>
              Frequently Asked Questions
            </h3>
          </div>
          <div className={styles.settingsSectionBody}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}>
              <div className={styles.settingsItem} style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                <span className={styles.settingsItemLabel}>Can I cancel anytime?</span>
                <span className={styles.settingsItemDesc}>
                  Yes, you can cancel your subscription at any time with no penalties.
                </span>
              </div>
              <div className={styles.settingsItem} style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                <span className={styles.settingsItemLabel}>What payment methods do you accept?</span>
                <span className={styles.settingsItemDesc}>
                  We accept all major credit cards and PayPal.
                </span>
              </div>
              <div className={styles.settingsItem} style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                <span className={styles.settingsItemLabel}>Is there a free trial?</span>
                <span className={styles.settingsItemDesc}>
                  Yes! All new users get a 15-day free trial with full access to premium features.
                </span>
              </div>
              <div className={styles.settingsItem} style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                <span className={styles.settingsItemLabel}>Can I change plans?</span>
                <span className={styles.settingsItemDesc}>
                  Absolutely. You can upgrade or downgrade your plan at any time.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default SubscriptionPage;
