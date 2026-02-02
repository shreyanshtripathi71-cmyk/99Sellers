"use client";

import Link from "next/link";
import { useState } from "react";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is 99Sellers?",
      answer: "99Sellers is a real estate lead generation platform that provides access to off-market properties including foreclosures, tax defaults, divorce filings, and probate cases."
    },
    {
      question: "How does the free trial work?",
      answer: "Sign up for a free 15-day trial to access all features. No credit card required. You can upgrade to a paid plan anytime."
    },
    {
      question: "What data sources do you use?",
      answer: "We aggregate data from county records, court filings, and public databases across all 50 states. Our data is updated daily."
    },
    {
      question: "Can I export leads?",
      answer: "Yes, premium users can export leads to CSV or Excel format. Export limits depend on your subscription plan."
    },
    {
      question: "How accurate is the data?",
      answer: "Our data accuracy rate is 98%. We verify information across multiple sources and update records regularly."
    },
    {
      question: "Is there a mobile app?",
      answer: "Our platform is fully responsive and works great on mobile browsers. A dedicated mobile app is coming soon."
    }
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

      {/* FAQ Content */}
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: "#0f172a", marginBottom: 16, textAlign: "center" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: "#64748b", textAlign: "center", marginBottom: 48, fontSize: 18 }}>
          Everything you need to know about 99Sellers
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              style={{ 
                background: "#fff", 
                borderRadius: 12, 
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  background: "none",
                  border: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{faq.question}</span>
                <i className={`fa-solid fa-chevron-${openIndex === index ? "up" : "down"}`} style={{ color: "#64748b" }}></i>
              </button>
              {openIndex === index && (
                <div style={{ padding: "0 24px 20px", color: "#64748b", lineHeight: 1.6 }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ color: "#64748b", marginBottom: 16 }}>Still have questions?</p>
          <Link href="/contact" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
            Contact our support team →
          </Link>
        </div>
      </main>
    </div>
  );
}