"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

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

      {/* Contact Content */}
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: "#0f172a", marginBottom: 16, textAlign: "center" }}>
          Contact Us
        </h1>
        <p style={{ color: "#64748b", textAlign: "center", marginBottom: 48, fontSize: 18 }}>
          Have questions? We'd love to hear from you.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48 }}>
          {/* Contact Info */}
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: "#0f172a" }}>Get in Touch</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, background: "#eff6ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa-solid fa-envelope" style={{ color: "#2563eb" }}></i>
                </div>
                <div>
                  <p style={{ fontWeight: 500, color: "#0f172a", margin: 0 }}>Email</p>
                  <p style={{ color: "#64748b", margin: "4px 0 0" }}>support@99sellers.com</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, background: "#eff6ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa-solid fa-phone" style={{ color: "#2563eb" }}></i>
                </div>
                <div>
                  <p style={{ fontWeight: 500, color: "#0f172a", margin: 0 }}>Phone</p>
                  <p style={{ color: "#64748b", margin: "4px 0 0" }}>+1 (555) 123-4567</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, background: "#eff6ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa-solid fa-clock" style={{ color: "#2563eb" }}></i>
                </div>
                <div>
                  <p style={{ fontWeight: 500, color: "#0f172a", margin: 0 }}>Hours</p>
                  <p style={{ color: "#64748b", margin: "4px 0 0" }}>Mon-Fri 9am-6pm EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: "#fff", padding: 32, borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 8 }}>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14 }}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 8 }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14 }}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 8 }}>Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14 }}
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 8 }}>Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, resize: "vertical" }}
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px 24px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}