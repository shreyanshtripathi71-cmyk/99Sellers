"use client";

import Header from "@/components/home/home-modern/components/Header";
import Footer from "@/components/home/home-modern/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      <Header />

      {/* Hero Section */}
      <section style={{
        background: "#0f172a",
        padding: "140px 24px 80px",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#2563eb",
            marginBottom: 20,
            textTransform: "uppercase"
          }}>
            About Us
          </h1>
          <p style={{ fontSize: 22, color: "#ffffff", lineHeight: 1.7 }}>
            Empowering Real Estate Professionals to Find Motivated Sellers
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>

        {/* The Challenge */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>
            The Challenge Every Agent Faces
          </h2>
          <p style={{ fontSize: 18, color: "#334155", lineHeight: 1.8, marginBottom: 16 }}>
            Finding motivated sellers is the hardest part of real estate investing. You already have the skills to close deals—but without quality leads, even the best agents struggle to grow their business.
          </p>
          <p style={{ fontSize: 18, color: "#334155", lineHeight: 1.8 }}>
            Distressed properties represent some of the most profitable opportunities in real estate. Yet accessing these sellers has traditionally required countless hours of manual research, outdated methods, and wasted resources.
          </p>
        </div>

        {/* What We Consider Distressed */}
        <div style={{
          background: "#f8fafc",
          padding: 40,
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          marginBottom: 48
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>
            What Makes a Property "Distressed"?
          </h2>
          <p style={{ fontSize: 17, color: "#334155", lineHeight: 1.8, marginBottom: 24 }}>
            Distressed properties come from owners who need to sell quickly due to challenging circumstances:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              "Pre-Foreclosure & Mortgage Issues",
              "Inherited Properties (Probate)",
              "Divorce Situations",
              "Vacant & Abandoned Homes",
              "Tax Delinquencies",
              "Absentee Owners",
              "Code Violations"
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <i className="fa-solid fa-circle-check" style={{ color: "#2563eb" }}></i>
                <span style={{ fontSize: 15, color: "#334155" }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 17, color: "#0f172a", lineHeight: 1.8, marginTop: 24, fontWeight: 500 }}>
            Every year, thousands of these properties enter the market across the U.S.—representing a massive opportunity for agents who can reach them first.
          </p>
        </div>

        {/* Our Solution */}
        <div style={{
          background: "#2563eb",
          padding: 48,
          borderRadius: 16,
          marginBottom: 48,
          color: "#fff",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
            That's Why We Built 99Sellers
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
            We created a platform that delivers verified seller leads directly to you—no more driving neighborhoods, cold-calling from outdated lists, or paying for expensive data that doesn't convert.
          </p>
        </div>

        {/* Old vs New */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
          marginBottom: 48
        }}>
          <div style={{
            background: "#f8fafc",
            padding: 32,
            borderRadius: 16,
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#64748b", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <i className="fa-solid fa-xmark" style={{ color: "#ef4444" }}></i>
              The Old Way
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "Driving for dollars",
                "Buying outdated lists",
                "Cold calling with low conversion",
                "Manual skip tracing",
                "Scattered data sources"
              ].map((item, i) => (
                <li key={i} style={{ fontSize: 15, color: "#64748b", marginBottom: 12, paddingLeft: 20, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div style={{
            background: "#0f172a",
            padding: 32,
            borderRadius: 16
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#2563eb", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <i className="fa-solid fa-check" style={{ color: "#2563eb" }}></i>
              The 99Sellers Way
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "Fresh leads delivered daily",
                "Skip-traced contact info included",
                "Verified motivated sellers",
                "All data in one dashboard",
                "Export directly to your CRM"
              ].map((item, i) => (
                <li key={i} style={{ fontSize: 15, color: "#e2e8f0", marginBottom: 12, paddingLeft: 20, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: "#2563eb" }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Results */}
        <div style={{
          background: "#0f172a",
          padding: 48,
          borderRadius: 16,
          marginBottom: 48,
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
            The Result?
          </h2>
          <p style={{ fontSize: 42, fontWeight: 700, color: "#2563eb", marginBottom: 8 }}>
            95% Less Time Wasted
          </p>
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.8, maxWidth: 500, margin: "0 auto" }}>
            More deals closed. More profit earned. Less frustration experienced.
          </p>
        </div>

        {/* CTA */}
        <div style={{
          background: "#f8fafc",
          padding: 40,
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          textAlign: "center"
        }}>
          <p style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
            Ready to Transform Your Lead Generation?
          </p>
          <p style={{ fontSize: 16, color: "#64748b", marginBottom: 24 }}>
            Join thousands of agents who have already discovered the smarter way to find motivated sellers.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/search"
              style={{
                display: "inline-block",
                padding: "16px 32px",
                background: "#2563eb",
                color: "#fff",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 600
              }}
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                padding: "16px 32px",
                background: "#fff",
                color: "#0f172a",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 600,
                border: "1px solid #e2e8f0"
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}