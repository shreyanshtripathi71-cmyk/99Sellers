"use client";

import Header from "@/components/home/home-modern/components/Header";
import Footer from "@/components/home/home-modern/components/Footer";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    inquiryType: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    contactPreference: "email"
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      <Header />

      {/* Hero Section */}
      <section style={{
        background: "#0f172a",
        padding: "140px 24px 60px",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h1 style={{ fontSize: 42, fontWeight: 700, color: "#2563eb", marginBottom: 16, textTransform: "uppercase" }}>
            Get In Touch
          </h1>
          <p style={{ fontSize: 18, color: "#ffffff", lineHeight: 1.8 }}>
            Have questions about our platform? Need help choosing the right plan? Our team is here to help you succeed.
          </p>
        </div>
      </section>

      {/* Support Info */}
      <section style={{ background: "#f8fafc", padding: "48px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
            <div style={{ background: "#fff", padding: 32, borderRadius: 16, border: "1px solid #e2e8f0", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, background: "#2563eb", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <i className="fa-solid fa-phone" style={{ fontSize: 22, color: "#fff" }}></i>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>Phone Support</h3>
              <p style={{ color: "#2563eb", fontSize: 17, fontWeight: 500, marginBottom: 4 }}>+1 (800) 555-1234</p>
              <p style={{ color: "#64748b", fontSize: 14 }}>Mon-Fri: 9am - 6pm EST</p>
            </div>

            <div style={{ background: "#fff", padding: 32, borderRadius: 16, border: "1px solid #e2e8f0", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, background: "#2563eb", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <i className="fa-solid fa-envelope" style={{ fontSize: 22, color: "#fff" }}></i>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>Email Support</h3>
              <p style={{ color: "#2563eb", fontSize: 17, fontWeight: 500, marginBottom: 4 }}>support@99sellers.com</p>
              <p style={{ color: "#64748b", fontSize: 14 }}>Response within 24 hours</p>
            </div>

            <div style={{ background: "#fff", padding: 32, borderRadius: 16, border: "1px solid #e2e8f0", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, background: "#2563eb", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <i className="fa-solid fa-comments" style={{ fontSize: 22, color: "#fff" }}></i>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>Live Chat</h3>
              <p style={{ color: "#2563eb", fontSize: 17, fontWeight: 500, marginBottom: 4 }}>Chat with us</p>
              <p style={{ color: "#64748b", fontSize: 14 }}>Available during business hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
            Send Us a Message
          </h2>
          <p style={{ color: "#64748b", fontSize: 16 }}>
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: 48, background: "#f8fafc", borderRadius: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ width: 64, height: 64, background: "#2563eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <i className="fa-solid fa-check" style={{ fontSize: 28, color: "#fff" }}></i>
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>Message Sent!</h3>
            <p style={{ color: "#64748b", marginBottom: 24 }}>Thank you for reaching out. We&apos;ll respond within 24 hours.</p>
            <button
              onClick={() => setSubmitted(false)}
              style={{ padding: "12px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 15, fontWeight: 500 }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 40, borderRadius: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "grid", gap: 24 }}>
              {/* Inquiry Type */}
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 8 }}>
                  What can we help you with?
                </label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  required
                  style={{ width: "100%", padding: "14px 16px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 15, outline: "none", background: "#fff" }}
                >
                  <option value="">Select an option</option>
                  <option value="sales">Sales & Pricing Questions</option>
                  <option value="support">Technical Support</option>
                  <option value="demo">Request a Demo</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Name & Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 8 }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Smith"
                    style={{ width: "100%", padding: "14px 16px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 15, outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 8 }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="john@example.com"
                    style={{ width: "100%", padding: "14px 16px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 15, outline: "none" }}
                  />
                </div>
              </div>

              {/* Phone & Company */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 8 }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    style={{ width: "100%", padding: "14px 16px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 15, outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 8 }}>
                    Company / Brokerage
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your company name"
                    style={{ width: "100%", padding: "14px 16px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 15, outline: "none" }}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 8 }}>
                  Your Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  style={{ width: "100%", padding: "14px 16px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 15, resize: "vertical", outline: "none", fontFamily: "inherit" }}
                />
              </div>

              {/* Contact Preference */}
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 12 }}>
                  Preferred contact method
                </label>
                <div style={{ display: "flex", gap: 24 }}>
                  {[
                    { value: "email", label: "Email" },
                    { value: "phone", label: "Phone" },
                    { value: "either", label: "Either" }
                  ].map((option) => (
                    <label key={option.value} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="contactPreference"
                        value={option.value}
                        checked={formData.contactPreference === option.value}
                        onChange={(e) => setFormData({ ...formData, contactPreference: e.target.value })}
                        style={{ width: 18, height: 18, accentColor: "#2563eb" }}
                      />
                      <span style={{ fontSize: 15, color: "#334155" }}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  marginTop: 8
                }}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        )}
      </section>

      <Footer />
    </div>
  );
}