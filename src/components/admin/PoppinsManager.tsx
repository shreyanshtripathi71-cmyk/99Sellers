"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Poppin {
  id: string;
  name: string;
  type: "banner" | "modal" | "toast" | "slide-in";
  title: string;
  message: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor: string;
  textColor: string;
  position: "top" | "bottom" | "center" | "bottom-right" | "bottom-left";
  trigger: "page-load" | "scroll" | "exit-intent" | "time-delay" | "click";
  triggerValue?: number; // seconds for time-delay, pixels for scroll
  pages: string[]; // which pages to show on
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  priority: number;
  showOnMobile: boolean;
  showOnDesktop: boolean;
  dismissable: boolean;
  showOnce: boolean;
  createdAt: string;
}

const DEFAULT_POPPINS: Poppin[] = [
  {
    id: "1",
    name: "Welcome Banner",
    type: "banner",
    title: "🎉 Welcome to 99Sellers!",
    message: "Get 20% off your first month with code WELCOME20",
    buttonText: "Claim Offer",
    buttonLink: "/dashboard/subscription",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    position: "top",
    trigger: "page-load",
    pages: ["/", "/search"],
    isActive: true,
    priority: 1,
    showOnMobile: true,
    showOnDesktop: true,
    dismissable: true,
    showOnce: false,
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    name: "Exit Intent Modal",
    type: "modal",
    title: "Wait! Don't Miss Out",
    message: "Subscribe to our newsletter and get exclusive deals on distressed properties.",
    buttonText: "Subscribe Now",
    buttonLink: "#subscribe",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    position: "center",
    trigger: "exit-intent",
    pages: ["/search", "/dashboard/subscription"],
    isActive: false,
    priority: 2,
    showOnMobile: false,
    showOnDesktop: true,
    dismissable: true,
    showOnce: true,
    createdAt: "2026-01-20",
  },
];

const TRIGGER_OPTIONS = [
  { value: "page-load", label: "Page Load", icon: "fa-file" },
  { value: "scroll", label: "Scroll Depth", icon: "fa-arrows-down-to-line" },
  { value: "exit-intent", label: "Exit Intent", icon: "fa-arrow-right-from-bracket" },
  { value: "time-delay", label: "Time Delay", icon: "fa-clock" },
  { value: "click", label: "On Click", icon: "fa-mouse-pointer" },
];

const TYPE_OPTIONS = [
  { value: "banner", label: "Banner", icon: "fa-rectangle-wide", description: "Full-width banner" },
  { value: "modal", label: "Modal", icon: "fa-window-maximize", description: "Center popup" },
  { value: "toast", label: "Toast", icon: "fa-message", description: "Corner notification" },
  { value: "slide-in", label: "Slide-in", icon: "fa-arrow-right-to-arc", description: "Sliding panel" },
];

const PoppinsManager = () => {
  const [poppins, setPoppins] = useState<Poppin[]>(DEFAULT_POPPINS);
  const [editingPoppin, setEditingPoppin] = useState<Poppin | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewPoppin, setPreviewPoppin] = useState<Poppin | null>(null);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("99sellers_poppins");
    if (saved) {
      setPoppins(JSON.parse(saved));
    }
  }, []);

  const savePoppins = (newPoppins: Poppin[]) => {
    setPoppins(newPoppins);
    localStorage.setItem("99sellers_poppins", JSON.stringify(newPoppins));
  };

  const toggleActive = (id: string) => {
    const updated = poppins.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    savePoppins(updated);
    toast.success("Poppin status updated!");
  };

  const deletePoppin = (id: string) => {
    if (confirm("Are you sure you want to delete this poppin?")) {
      const updated = poppins.filter(p => p.id !== id);
      savePoppins(updated);
      toast.success("Poppin deleted!");
    }
  };

  const savePoppin = (poppin: Poppin) => {
    let updated: Poppin[];
    if (poppins.find(p => p.id === poppin.id)) {
      updated = poppins.map(p => p.id === poppin.id ? poppin : p);
    } else {
      updated = [...poppins, poppin];
    }
    savePoppins(updated);
    setEditingPoppin(null);
    setIsCreating(false);
    toast.success("Poppin saved successfully!");
  };

  const createNewPoppin = (): Poppin => ({
    id: Date.now().toString(),
    name: "",
    type: "banner",
    title: "",
    message: "",
    buttonText: "",
    buttonLink: "",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    position: "top",
    trigger: "page-load",
    pages: ["/"],
    isActive: false,
    priority: poppins.length + 1,
    showOnMobile: true,
    showOnDesktop: true,
    dismissable: true,
    showOnce: false,
    createdAt: new Date().toISOString().split("T")[0],
  });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
            Poppins Manager
          </h2>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Create and manage dynamic popups, banners, and notifications
          </p>
        </div>
        <button
          onClick={() => { setEditingPoppin(createNewPoppin()); setIsCreating(true); }}
          style={{
            padding: "12px 24px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <i className="fa-solid fa-plus"></i>
          Create Poppin
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Poppins", value: poppins.length, icon: "fa-layer-group", color: "#3b82f6" },
          { label: "Active", value: poppins.filter(p => p.isActive).length, icon: "fa-check-circle", color: "#22c55e" },
          { label: "Inactive", value: poppins.filter(p => !p.isActive).length, icon: "fa-pause-circle", color: "#94a3b8" },
          { label: "Banners", value: poppins.filter(p => p.type === "banner").length, icon: "fa-rectangle-wide", color: "#f59e0b" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{stat.label}</div>
              </div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: `${stat.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <i className={`fa-solid ${stat.icon}`} style={{ color: stat.color, fontSize: 18 }}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Poppins List */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", margin: 0 }}>All Poppins</h3>
        </div>
        
        {poppins.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <i className="fa-solid fa-message" style={{ fontSize: 48, color: "#cbd5e1", marginBottom: 16 }}></i>
            <div style={{ color: "#64748b" }}>No poppins created yet</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Name</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Type</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Trigger</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Pages</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Status</th>
                <th style={{ padding: "12px 24px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {poppins.map((poppin) => (
                <tr key={poppin.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>{poppin.name || "Untitled"}</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>{poppin.title}</div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      background: "#f1f5f9",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#475569",
                    }}>
                      <i className={`fa-solid ${TYPE_OPTIONS.find(t => t.value === poppin.type)?.icon}`}></i>
                      {poppin.type}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ fontSize: 13, color: "#64748b", textTransform: "capitalize" }}>
                      {poppin.trigger.replace("-", " ")}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {poppin.pages.slice(0, 2).map((page, i) => (
                        <span key={i} style={{
                          padding: "2px 6px",
                          background: "#e0e7ff",
                          borderRadius: 4,
                          fontSize: 11,
                          color: "#4338ca",
                        }}>
                          {page}
                        </span>
                      ))}
                      {poppin.pages.length > 2 && (
                        <span style={{ fontSize: 11, color: "#64748b" }}>+{poppin.pages.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <button
                      onClick={() => toggleActive(poppin.id)}
                      style={{
                        padding: "4px 12px",
                        background: poppin.isActive ? "#dcfce7" : "#f1f5f9",
                        color: poppin.isActive ? "#166534" : "#64748b",
                        border: "none",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      {poppin.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    <button
                      onClick={() => setPreviewPoppin(poppin)}
                      style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 8 }}
                      title="Preview"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button
                      onClick={() => setEditingPoppin(poppin)}
                      style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", padding: 8 }}
                      title="Edit"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      onClick={() => deletePoppin(poppin.id)}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 8 }}
                      title="Delete"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit/Create Modal */}
      {editingPoppin && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 24,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 16,
            width: "100%",
            maxWidth: 700,
            maxHeight: "90vh",
            overflow: "auto",
          }}>
            <div style={{ 
              padding: "20px 24px", 
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: 0,
              background: "#fff",
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
                {isCreating ? "Create New Poppin" : "Edit Poppin"}
              </h3>
              <button
                onClick={() => { setEditingPoppin(null); setIsCreating(false); }}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div style={{ padding: 24 }}>
              {/* Basic Info */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 8 }}>
                  Poppin Name
                </label>
                <input
                  type="text"
                  value={editingPoppin.name}
                  onChange={(e) => setEditingPoppin({ ...editingPoppin, name: e.target.value })}
                  placeholder="e.g., Summer Sale Banner"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
              </div>

              {/* Type Selection */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 8 }}>
                  Type
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {TYPE_OPTIONS.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setEditingPoppin({ ...editingPoppin, type: type.value as any })}
                      style={{
                        padding: 12,
                        border: editingPoppin.type === type.value ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                        borderRadius: 8,
                        background: editingPoppin.type === type.value ? "#eff6ff" : "#fff",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <i className={`fa-solid ${type.icon}`} style={{ 
                        fontSize: 20, 
                        color: editingPoppin.type === type.value ? "#3b82f6" : "#64748b",
                        display: "block",
                        marginBottom: 6,
                      }}></i>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 8 }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingPoppin.title}
                    onChange={(e) => setEditingPoppin({ ...editingPoppin, title: e.target.value })}
                    placeholder="Popup title"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #d1d5db",
                      borderRadius: 8,
                      fontSize: 14,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 8 }}>
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={editingPoppin.buttonText}
                    onChange={(e) => setEditingPoppin({ ...editingPoppin, buttonText: e.target.value })}
                    placeholder="e.g., Learn More"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #d1d5db",
                      borderRadius: 8,
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 8 }}>
                  Message
                </label>
                <textarea
                  value={editingPoppin.message}
                  onChange={(e) => setEditingPoppin({ ...editingPoppin, message: e.target.value })}
                  placeholder="Popup message content..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    fontSize: 14,
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Colors */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 8 }}>
                    Background Color
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="color"
                      value={editingPoppin.backgroundColor}
                      onChange={(e) => setEditingPoppin({ ...editingPoppin, backgroundColor: e.target.value })}
                      style={{ width: 44, height: 38, border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={editingPoppin.backgroundColor}
                      onChange={(e) => setEditingPoppin({ ...editingPoppin, backgroundColor: e.target.value })}
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        border: "1px solid #d1d5db",
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 8 }}>
                    Text Color
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="color"
                      value={editingPoppin.textColor}
                      onChange={(e) => setEditingPoppin({ ...editingPoppin, textColor: e.target.value })}
                      style={{ width: 44, height: 38, border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={editingPoppin.textColor}
                      onChange={(e) => setEditingPoppin({ ...editingPoppin, textColor: e.target.value })}
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        border: "1px solid #d1d5db",
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Trigger */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 8 }}>
                  Trigger
                </label>
                <select
                  value={editingPoppin.trigger}
                  onChange={(e) => setEditingPoppin({ ...editingPoppin, trigger: e.target.value as any })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    fontSize: 14,
                    background: "#fff",
                  }}
                >
                  {TRIGGER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
                {[
                  { key: "isActive", label: "Active" },
                  { key: "dismissable", label: "Dismissable" },
                  { key: "showOnce", label: "Show Once" },
                  { key: "showOnMobile", label: "Show on Mobile" },
                  { key: "showOnDesktop", label: "Show on Desktop" },
                ].map((opt) => (
                  <label key={opt.key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={(editingPoppin as any)[opt.key]}
                      onChange={(e) => setEditingPoppin({ ...editingPoppin, [opt.key]: e.target.checked })}
                      style={{ width: 18, height: 18, accentColor: "#3b82f6" }}
                    />
                    <span style={{ fontSize: 14, color: "#374151" }}>{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* Save Button */}
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                  onClick={() => { setEditingPoppin(null); setIsCreating(false); }}
                  style={{
                    padding: "10px 20px",
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => savePoppin(editingPoppin)}
                  style={{
                    padding: "10px 24px",
                    background: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <i className="fa-solid fa-check me-2"></i>
                  Save Poppin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewPoppin && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: previewPoppin.position === "top" ? "flex-start" : previewPoppin.position === "bottom" ? "flex-end" : "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: previewPoppin.type === "banner" ? 0 : 24,
        }}>
          <div
            style={{
              background: previewPoppin.backgroundColor,
              color: previewPoppin.textColor,
              padding: previewPoppin.type === "banner" ? "16px 32px" : "32px",
              borderRadius: previewPoppin.type === "banner" ? 0 : 16,
              width: previewPoppin.type === "banner" ? "100%" : "auto",
              maxWidth: previewPoppin.type === "modal" ? 500 : "100%",
              textAlign: "center",
              position: "relative",
            }}
          >
            {previewPoppin.dismissable && (
              <button
                onClick={() => setPreviewPoppin(null)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: previewPoppin.textColor,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                ×
              </button>
            )}
            <h4 style={{ margin: "0 0 8px 0", fontSize: previewPoppin.type === "banner" ? 16 : 20 }}>
              {previewPoppin.title}
            </h4>
            <p style={{ margin: "0 0 16px 0", opacity: 0.9, fontSize: 14 }}>
              {previewPoppin.message}
            </p>
            {previewPoppin.buttonText && (
              <button
                style={{
                  padding: "10px 24px",
                  background: previewPoppin.textColor,
                  color: previewPoppin.backgroundColor,
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {previewPoppin.buttonText}
              </button>
            )}
          </div>
          <button
            onClick={() => setPreviewPoppin(null)}
            style={{
              position: "fixed",
              bottom: 32,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "12px 24px",
              background: "#fff",
              color: "#0f172a",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            Close Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default PoppinsManager;
