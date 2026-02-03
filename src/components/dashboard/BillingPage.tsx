"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/search/DashboardShell";
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
  const { user, subscription, isTrialActive, getTrialDaysRemaining } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "invoices" | "payment">("overview");

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
    <DashboardShell 
      title="Billing" 
      subtitle="Manage your subscription and payment methods"
      actions={
        <Link href="/dashboard/subscription" className={styles.btn + " " + styles.btnPrimary}>
          <i className="fa-solid fa-crown"></i>
          Upgrade Plan
        </Link>
      }
    >
      <div className={styles.pageContent}>
        {isTrialActive() && (
          <div className={styles.trialBanner}>
            <div className={styles.trialBannerContent}>
              <i className={"fa-solid fa-clock " + styles.trialBannerIcon}></i>
              <div className={styles.trialBannerText}>
                <h4>Trial Period Active</h4>
                <p>You have {getTrialDaysRemaining()} days left in your free trial</p>
              </div>
            </div>
            <Link href="/dashboard/subscription" className={styles.btn + " " + styles.btnSecondary}>
              Subscribe Now
            </Link>
          </div>
        )}

        <div className={styles.tabNav}>
          {tabs.map((tab) => (
            <button 
              key={tab.id} 
              className={styles.tabBtn + (activeTab === tab.id ? " " + styles.active : "")}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
            >
              <i className={"fa-solid " + tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className={styles.billingOverviewGrid}>
            <div className={styles.billingStatCard}>
              <div className={styles.billingStatHeader}>
                <h3>Current Plan</h3>
              </div>
              <div className={styles.billingStatValue}>
                <span className={styles.value}>{planDetails.price}</span>
                <span className={styles.period}>{planDetails.period}</span>
              </div>
              <span className={styles.badge + " " + styles.badgePrimary}>{planDetails.name}</span>
              {planDetails.nextBilling && (
                <div className={styles.billingStatRow}>
                  <span className={styles.label}>{isTrialActive() ? "Trial ends" : "Next billing"}</span>
                  <span className={styles.amount}>{formatDate(planDetails.nextBilling)}</span>
                </div>
              )}
            </div>

            <div className={styles.billingStatCard}>
              <div className={styles.billingStatHeader}>
                <h3>Billing Summary</h3>
              </div>
              <div className={styles.billingStatRow}>
                <span className={styles.label}>Total This Month</span>
                <span className={styles.amount}>{formatCurrency(subscription?.plan === "free" ? 0 : 99)}</span>
              </div>
              <div className={styles.billingStatRow}>
                <span className={styles.label}>Year to Date</span>
                <span className={styles.amount}>{formatCurrency(subscription?.plan === "free" ? 0 : 297)}</span>
              </div>
              <div className={styles.billingStatRow}>
                <span className={styles.label}>Outstanding</span>
                <span className={styles.amount + " " + styles.warning}>{formatCurrency(0)}</span>
              </div>
            </div>

            <div className={styles.billingStatCard}>
              <div className={styles.billingStatHeader}>
                <h3>Quick Actions</h3>
              </div>
              <div className={styles.billingActionsCard}>
                <Link href="/dashboard/subscription" className={styles.btn + " " + styles.btnPrimary}>
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  Change Plan
                </Link>
                <button onClick={() => setActiveTab("payment")} className={styles.btn + " " + styles.btnSecondary}>
                  <i className="fa-solid fa-credit-card"></i>
                  Update Payment
                </button>
                <button onClick={() => setActiveTab("invoices")} className={styles.btn + " " + styles.btnSecondary}>
                  <i className="fa-solid fa-download"></i>
                  Download Invoices
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "invoices" && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Invoice History</h3>
            </div>
            <div className={styles.cardBody} style={{ padding: 0 }}>
              <table className={styles.dataTable}>
                <thead>
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
                    <tr key={invoice.id}>
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
                          <button className={styles.btn + " " + styles.btnGhost}>
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
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Payment Methods</h3>
                <button className={styles.btn + " " + styles.btnPrimary}>
                  <i className="fa-solid fa-plus"></i>
                  Add New
                </button>
              </div>
              <div className={styles.cardBody}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id} 
                      className={styles.paymentMethodCard + (method.isDefault ? " " + styles.isDefault : "")}
                    >
                      <div className={styles.paymentMethodInfo}>
                        <div className={styles.paymentMethodIcon}>
                          <i className={"fa-solid " + getPaymentIcon(method.type)}></i>
                        </div>
                        <div className={styles.paymentMethodDetails}>
                          <div className={styles.name}>
                            {method.type === "card" 
                              ? method.brand + " ending in " + method.last4 
                              : "PayPal - " + method.email}
                          </div>
                          <div className={styles.meta}>
                            {method.type === "card" && "Expires " + method.expiryMonth + "/" + method.expiryYear}
                            {method.isDefault && <span className={styles.defaultBadge}> • Default</span>}
                          </div>
                        </div>
                      </div>
                      <div className={styles.paymentMethodActions}>
                        {!method.isDefault && (
                          <button className={styles.btn + " " + styles.btnSecondary}>Set Default</button>
                        )}
                        <button className={styles.btn + " " + styles.btnDanger}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Billing Address</h3>
                <button className={styles.btn + " " + styles.btnSecondary}>
                  <i className="fa-solid fa-pen"></i>
                  Edit
                </button>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.billingAddressContent}>
                  <p className={styles.name}>{user?.name || "Your Name"}</p>
                  <p className={styles.address}>123 Main Street</p>
                  <p className={styles.address}>Suite 100</p>
                  <p className={styles.address}>San Francisco, CA 94102</p>
                  <p className={styles.address}>United States</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

export default BillingPage;
