"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/search/components/Sidebar";
import Header from "@/components/search/components/Header";
import styles from "@/components/search/styles/dashboard.module.scss";
import { useAuth } from "@/context/AuthContext";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
  downloadUrl?: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "bank";
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  email?: string;
}

const BillingPage: React.FC = () => {
  const { user, subscription, isTrialActive, getTrialDaysRemaining, canAccessPremium } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "invoices" | "payment">("overview");

  // Determine user plan based on auth
  const userPlan = canAccessPremium() || isTrialActive() ? "Pro" : "Free";

  const invoices: Invoice[] = [
    { id: "INV-2024-001", date: "2024-01-15", amount: 99.00, status: "paid", description: "Premium Plan - Monthly", downloadUrl: "#" },
    { id: "INV-2024-002", date: "2024-02-15", amount: 99.00, status: "paid", description: "Premium Plan - Monthly", downloadUrl: "#" },
    { id: "INV-2024-003", date: "2024-03-15", amount: 99.00, status: "pending", description: "Premium Plan - Monthly" }
  ];

  const paymentMethods: PaymentMethod[] = [
    { id: "pm-1", type: "card", last4: "4242", brand: "Visa", expiryMonth: 12, expiryYear: 2025, isDefault: true },
    { id: "pm-2", type: "paypal", email: "user@example.com", isDefault: false }
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  const getCurrentPlanDetails = () => {
    if (!subscription) return { name: "Free Plan", price: "$0", period: "forever", nextBilling: null };
    if (isTrialActive()) {
      const daysLeft = getTrialDaysRemaining();
      return { name: "Trial", price: "$0", period: daysLeft + " days remaining", nextBilling: subscription.trialEndDate };
    }
    const planNames: Record<string, string> = { free: "Free", basic: "Basic", premium: "Premium", enterprise: "Enterprise" };
    const planPrices: Record<string, string> = { free: "$0", basic: "$49", premium: "$99", enterprise: "$249" };
    return {
      name: planNames[subscription.plan] || "Free",
      price: planPrices[subscription.plan] || "$0",
      period: subscription.billingCycle === "yearly" ? "per year" : "per month",
      nextBilling: subscription.endDate
    };
  };

  const planDetails = getCurrentPlanDetails();

  const tabs = [
    { id: "overview", label: "Overview", icon: "fa-chart-pie" },
    { id: "invoices", label: "Invoices", icon: "fa-file-invoice" },
    { id: "payment", label: "Payment Methods", icon: "fa-credit-card" }
  ];

  const getStatusBadgeClass = (status: string) => {
    if (status === "paid") return styles.badge + " " + styles.badgeSuccess;
    if (status === "pending") return styles.badge + " " + styles.badgeWarning;
    return styles.badge + " " + styles.badgeDanger;
  };

  const getPaymentIcon = (type: string) => {
    if (type === "card") return "fa-credit-card";
    if (type === "paypal") return "fa-brands fa-paypal";
    return "fa-building-columns";
  };

  return (
    <div className={styles.dashboard_root}>
      {/* Sidebar */}
      <Sidebar userPlan={userPlan} onUpgrade={() => router.push("/dashboard/subscription")} />

      {/* Main Content */}
      <main className={styles.main_content}>
        <Header 
          title="Billing" 
          subtitle="Manage your subscription" 
          userPlan={userPlan}
          actions={
            <Link href="/dashboard/subscription" className={styles.btn_primary}>
              <i className="fa-solid fa-crown"></i>
              Upgrade Plan
            </Link>
          }
        />

        <div className={styles.content_area}>
          {isTrialActive() && (
            <div className={styles.trialBanner} style={{ marginBottom: 24, padding: 16, background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <i className="fa-solid fa-clock" style={{ fontSize: 20, color: "#4F46E5" }}></i>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1F2937" }}>Trial Period Active</h4>
                  <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>You have {getTrialDaysRemaining()} days left in your free trial</p>
                </div>
              </div>
              <Link href="/dashboard/subscription" className={styles.btn_secondary}>
                Subscribe Now
              </Link>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {tabs.map((tab) => (
              <button 
                key={tab.id} 
                className={activeTab === tab.id ? styles.btn_primary : styles.btn_secondary}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <i className={"fa-solid " + tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              <div className={styles.card} style={{ padding: 24, background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Current Plan</h3>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: "#1F2937" }}>{planDetails.price}</span>
                  <span style={{ fontSize: 14, color: "#6B7280", marginLeft: 4 }}>{planDetails.period}</span>
                </div>
                <span className={styles.badge} style={{ background: "#EEF2FF", color: "#4F46E5", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{planDetails.name}</span>
                {planDetails.nextBilling && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "#6B7280" }}>{isTrialActive() ? "Trial ends" : "Next billing"}</span>
                    <span style={{ fontWeight: 600, color: "#1F2937" }}>{formatDate(planDetails.nextBilling)}</span>
                  </div>
                )}
              </div>

              <div className={styles.card} style={{ padding: 24, background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Billing Summary</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "#6B7280" }}>Total This Month</span>
                    <span style={{ fontWeight: 600, color: "#1F2937" }}>{formatCurrency(subscription?.plan === "free" ? 0 : 99)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "#6B7280" }}>Year to Date</span>
                    <span style={{ fontWeight: 600, color: "#1F2937" }}>{formatCurrency(subscription?.plan === "free" ? 0 : 297)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "#6B7280" }}>Outstanding</span>
                    <span style={{ fontWeight: 600, color: "#EF4444" }}>{formatCurrency(0)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.card} style={{ padding: 24, background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Quick Actions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Link href="/dashboard/subscription" className={styles.btn_primary} style={{ textAlign: "center" }}>
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    Change Plan
                  </Link>
                  <button onClick={() => setActiveTab("payment")} className={styles.btn_secondary}>
                    <i className="fa-solid fa-credit-card"></i>
                    Update Payment
                  </button>
                  <button onClick={() => setActiveTab("invoices")} className={styles.btn_secondary}>
                    <i className="fa-solid fa-download"></i>
                    Download Invoices
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "invoices" && (
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #E5E7EB" }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1F2937" }}>Invoice History</h3>
              </div>
              <div className={styles.table_container}>
                <table className={styles.table}>
                  <thead className={styles.table_header}>
                    <tr>
                      <th>Invoice</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className={styles.table_row}>
                        <td>
                          <div>
                            <div style={{ fontWeight: 500 }}>{invoice.id}</div>
                            <div style={{ fontSize: 13, opacity: 0.7 }}>{invoice.description}</div>
                          </div>
                        </td>
                        <td>{formatDate(invoice.date)}</td>
                        <td style={{ fontWeight: 600 }}>{formatCurrency(invoice.amount)}</td>
                        <td>
                          <span className={getStatusBadgeClass(invoice.status)}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          {invoice.downloadUrl && (
                            <button className={styles.btn_secondary} style={{ padding: "6px 12px", fontSize: 13 }}>
                              <i className="fa-solid fa-download"></i>
                              Download
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1F2937" }}>Payment Methods</h3>
                  <button className={styles.btn_primary}>
                    <i className="fa-solid fa-plus"></i>
                    Add New
                  </button>
                </div>
                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id} 
                      style={{ 
                        padding: 16, 
                        border: method.isDefault ? "2px solid #2563EB" : "1px solid #E5E7EB", 
                        borderRadius: 12,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: method.isDefault ? "#F8FAFF" : "#fff"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 8, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <i className={"fa-solid " + getPaymentIcon(method.type)} style={{ fontSize: 20, color: "#6B7280" }}></i>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1F2937" }}>
                            {method.type === "card" 
                              ? method.brand + " ending in " + method.last4 
                              : "PayPal - " + method.email}
                          </div>
                          <div style={{ fontSize: 13, color: "#6B7280" }}>
                            {method.type === "card" && "Expires " + method.expiryMonth + "/" + method.expiryYear}
                            {method.isDefault && <span style={{ color: "#2563EB", fontWeight: 500 }}> • Default</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {!method.isDefault && (
                          <button className={styles.btn_secondary} style={{ padding: "6px 12px", fontSize: 13 }}>Set Default</button>
                        )}
                        <button style={{ padding: "6px 12px", fontSize: 13, background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: 8, cursor: "pointer" }}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1F2937" }}>Billing Address</h3>
                  <button className={styles.btn_secondary}>
                    <i className="fa-solid fa-pen"></i>
                    Edit
                  </button>
                </div>
                <div style={{ padding: 24 }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#1F2937" }}>{user?.name || "Your Name"}</p>
                  <p style={{ margin: "0 0 4px", color: "#6B7280" }}>123 Main Street</p>
                  <p style={{ margin: "0 0 4px", color: "#6B7280" }}>Suite 100</p>
                  <p style={{ margin: "0 0 4px", color: "#6B7280" }}>San Francisco, CA 94102</p>
                  <p style={{ margin: 0, color: "#6B7280" }}>United States</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BillingPage;
