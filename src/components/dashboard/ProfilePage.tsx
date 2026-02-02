"use client";

import React, { useState } from "react";
import DashboardShell from "@/components/search/DashboardShell";
import styles from "@/components/search/styles/dashboard.module.scss";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || user?.name?.split(" ")[0] || "",
    lastName: user?.lastName || user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
    });
    setIsEditing(false);
  };

  const getUserInitials = () => {
    if (formData.firstName && formData.lastName) {
      return formData.firstName[0].toUpperCase() + formData.lastName[0].toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <DashboardShell title="Profile" subtitle="Manage your account information">
      <div className={styles.pageContent}>
        {/* Profile Header */}
        <div style={{
          background: "linear-gradient(135deg, #2563EB, #7C3AED)",
          borderRadius: 16,
          padding: 32,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
          }}>
            {getUserInitials()}
          </div>
          <div>
            <h2 style={{ margin: 0, color: "#fff", fontSize: 24, fontWeight: 600 }}>
              {formData.firstName} {formData.lastName}
            </h2>
            <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionHeader}>
            <h3 className={styles.settingsSectionTitle}>
              <i className="fa-solid fa-user me-2" style={{ color: "#2563EB" }}></i>
              Personal Information
            </h3>
            <button
              className={`${styles.btn} ${isEditing ? styles.btnPrimary : styles.btnSecondary}`}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              <i className={`fa-solid ${isEditing ? "fa-check" : "fa-pen"} me-2`}></i>
              {isEditing ? "Save Changes" : "Edit"}
            </button>
          </div>
          <div className={styles.settingsSectionBody}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#6B7280", marginBottom: 6 }}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    fontSize: 14,
                    background: isEditing ? "#fff" : "#F9FAFB",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#6B7280", marginBottom: 6 }}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    fontSize: 14,
                    background: isEditing ? "#fff" : "#F9FAFB",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#6B7280", marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    fontSize: 14,
                    background: "#F9FAFB",
                    color: "#9CA3AF",
                  }}
                />
                <span style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4, display: "block" }}>
                  Email cannot be changed
                </span>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#6B7280", marginBottom: 6 }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    fontSize: 14,
                    background: isEditing ? "#fff" : "#F9FAFB",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionHeader}>
            <h3 className={styles.settingsSectionTitle}>
              <i className="fa-solid fa-shield-halved me-2" style={{ color: "#10B981" }}></i>
              Security
            </h3>
          </div>
          <div className={styles.settingsSectionBody}>
            <div className={styles.settingsItem}>
              <div className={styles.settingsItemInfo}>
                <span className={styles.settingsItemLabel}>Password</span>
                <span className={styles.settingsItemDesc}>
                  Last changed 30 days ago
                </span>
              </div>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                <i className="fa-solid fa-key me-2"></i>
                Change Password
              </button>
            </div>
            <div className={styles.settingsItem}>
              <div className={styles.settingsItemInfo}>
                <span className={styles.settingsItemLabel}>Two-Factor Authentication</span>
                <span className={styles.settingsItemDesc}>
                  Add an extra layer of security to your account
                </span>
              </div>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                <i className="fa-solid fa-lock me-2"></i>
                Enable 2FA
              </button>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionHeader}>
            <h3 className={styles.settingsSectionTitle}>
              <i className="fa-solid fa-circle-info me-2" style={{ color: "#8B5CF6" }}></i>
              Account Information
            </h3>
          </div>
          <div className={styles.settingsSectionBody}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>
                  Account Created
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1F2937" }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>
                  Account Type
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1F2937" }}>
                  {user?.userType || "User"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default ProfilePage;
