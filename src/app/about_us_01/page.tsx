"use client";

import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { value: "50K+", label: "Properties Tracked" },
    { value: "10K+", label: "Active Investors" },
    { value: "98%", label: "Data Accuracy" },
    { value: "50", label: "States Covered" }
  ];

  const team = [
    { name: "Real-Time Data", icon: "fa-bolt", description: "Our proprietary crawlers update property data daily from county records and court filings." },
    { name: "Verified Leads", icon: "fa-shield-halved", description: "Every lead is verified against multiple data sources for accuracy and completeness." },
    { name: "Full Coverage", icon: "fa-map", description: "Access off-market leads from all 50 states including foreclosures, tax liens, and probate." }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", textDecoration: "none" }}>
            99<span style={{ color: "#2563eb" }}>Sellers</span>
          </Link>
          <Link href="/signin" style={{ padding: "10px 20px", background: "#0f172a", color: "#fff", borderRadius: 6, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontSize: 42, fontWeight: 700, color: "#fff", marginBottom: 20 }}>
            The Off-Market Deal Terminal
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7 }}>
            99Sellers helps real estate investors find motivated sellers before anyone else. 
            Access foreclosures, tax defaults, divorce filings, and probate cases in real-time.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: "#fff", padding: 32, borderRadius: 16, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#2563eb", marginBottom: 8 }}>{stat.value}</div>
              <div style={{ color: "#64748b", fontSize: 14 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>
            Why Choose 99Sellers?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
            {team.map((item, i) => (
              <div key={i} style={{ padding: 24 }}>
                <div style={{ width: 56, height: 56, background: "#eff6ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <i className={`fa-solid ${item.icon}`} style={{ fontSize: 24, color: "#2563eb" }}></i>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", marginBottom: 12 }}>{item.name}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
          Ready to Find Your Next Deal?
        </h2>
        <p style={{ color: "#64748b", marginBottom: 32, fontSize: 16 }}>
          Start your free 15-day trial today. No credit card required.
        </p>
        <Link href="/signin" style={{ display: "inline-block", padding: "16px 32px", background: "#2563eb", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 16, fontWeight: 600 }}>
          Get Started Free
        </Link>
      </section>
    </div>
  );
}