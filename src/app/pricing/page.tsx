"use client";

import Header from "@/components/home/home-modern/components/Header";
import Footer from "@/components/home/home-modern/components/Footer";
import PricingSection from "@/components/home/home-modern/components/PricingSection";
import Link from "next/link";
import styles from "@/components/home/home-modern/styles/homepage.module.scss";

export default function PricingPage() {
    return (
        <div className={styles.homepage} style={{ minHeight: "100vh" }}>
            <Header />

            {/* Hero Section */}
            <section style={{
                background: "#0f172a",
                padding: "140px 24px 60px",
                textAlign: "center"
            }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h1 style={{ fontSize: 42, fontWeight: 700, color: "#ffffff", marginBottom: 16 }}>
                        Simple, Transparent <span style={{ color: "#2563eb" }}>Pricing</span>
                    </h1>
                    <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, marginBottom: 24 }}>
                        Choose the plan that fits your business. Upgrade or downgrade anytime.
                    </p>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 15 }}>
                            <i className="fa-solid fa-check" style={{ color: "#2563eb" }}></i>
                            No hidden fees
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 15 }}>
                            <i className="fa-solid fa-check" style={{ color: "#2563eb" }}></i>
                            Cancel anytime
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 15 }}>
                            <i className="fa-solid fa-check" style={{ color: "#2563eb" }}></i>
                            30-day money back
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section - Same as Homepage */}
            <PricingSection />

            {/* Why Invest */}
            <section style={{ background: "#f8fafc", padding: "60px 24px" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>
                        Why Invest in 99Sellers?
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
                        {[
                            { icon: "fa-clock", title: "Save 20+ Hours/Week", desc: "Stop manually searching for leads" },
                            { icon: "fa-chart-line", title: "Close More Deals", desc: "Access verified motivated sellers" },
                            { icon: "fa-wallet", title: "10X ROI", desc: "One deal pays for years of service" }
                        ].map((item, i) => (
                            <div key={i} style={{ background: "#fff", padding: 28, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                                <div style={{ width: 48, height: 48, background: "#eff6ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                    <i className={`fa-solid ${item.icon}`} style={{ fontSize: 20, color: "#2563eb" }}></i>
                                </div>
                                <h4 style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>{item.title}</h4>
                                <p style={{ fontSize: 14, color: "#64748b" }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Guarantee */}
            <section style={{ background: "#fff", padding: "60px 24px" }}>
                <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
                    <div style={{ width: 64, height: 64, background: "#0f172a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                        <i className="fa-solid fa-shield-check" style={{ fontSize: 28, color: "#2563eb" }}></i>
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
                        30-Day Money-Back Guarantee
                    </h2>
                    <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.8 }}>
                        Try 99Sellers risk-free. If you&apos;re not completely satisfied within the first 30 days, we&apos;ll give you a full refund—no questions asked.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "#0f172a", padding: "60px 24px", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                        Ready to Start Closing More Deals?
                    </h2>
                    <p style={{ fontSize: 16, color: "#94a3b8", marginBottom: 28 }}>
                        Join thousands of real estate professionals who trust 99Sellers.
                    </p>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                        <Link
                            href="/search"
                            className={styles.btn_primary}
                            style={{ padding: "16px 32px", fontSize: 16, fontWeight: 600, display: "inline-block" }}
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            href="/contact"
                            style={{
                                padding: "16px 32px",
                                fontSize: 16,
                                fontWeight: 600,
                                display: "inline-block",
                                background: "transparent",
                                color: "#fff",
                                border: "1px solid #475569",
                                borderRadius: 10,
                                textDecoration: "none"
                            }}
                        >
                            Talk to Sales
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
