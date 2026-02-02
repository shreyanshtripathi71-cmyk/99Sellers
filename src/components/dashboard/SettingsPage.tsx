"use client";

import React, { useState } from "react";
import DashboardShell from "@/components/search/DashboardShell";
import styles from "@/components/search/styles/dashboard.module.scss";

interface SettingItem {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const SettingsPage = () => {
  const [notifications, setNotifications] = useState<SettingItem[]>([
    {
      id: "email_new_leads",
      label: "New Lead Alerts",
      description: "Get notified when new leads match your saved searches",
      enabled: true,
    },
    {
      id: "email_weekly",
      label: "Weekly Summary",
      description: "Receive a weekly recap of your search activity",
      enabled: true,
    },
    {
      id: "email_marketing",
      label: "Product Updates",
      description: "Stay informed about new features and improvements",
      enabled: false,
    },
    {
      id: "push_leads",
      label: "Browser Notifications",
      description: "Show desktop notifications for important updates",
      enabled: true,
    },
  ]);

  const [preferences, setPreferences] = useState<SettingItem[]>([
    {
      id: "dark_mode",
      label: "Dark Mode",
      description: "Use dark theme throughout the dashboard",
      enabled: false,
    },
    {
      id: "compact_view",
      label: "Compact View",
      description: "Show more items on screen with reduced spacing",
      enabled: false,
    },
    {
      id: "auto_refresh",
      label: "Auto-refresh Results",
      description: "Automatically refresh search results every 5 minutes",
      enabled: true,
    },
  ]);

  const toggleSetting = (
    settings: SettingItem[],
    setSettings: React.Dispatch<React.SetStateAction<SettingItem[]>>,
    id: string
  ) => {
    setSettings(
      settings.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <DashboardShell title="Settings" subtitle="Customize your dashboard experience">
      <div className={styles.pageContent}>
        {/* Notifications */}
        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionHeader}>
            <h3 className={styles.settingsSectionTitle}>
              <i className="fa-solid fa-bell me-2" style={{ color: "#2563EB" }}></i>
              Notifications
            </h3>
            <p className={styles.settingsSectionDesc}>
              Choose how and when you want to be notified
            </p>
          </div>
          <div className={styles.settingsSectionBody}>
            {notifications.map((setting) => (
              <div key={setting.id} className={styles.settingsItem}>
                <div className={styles.settingsItemInfo}>
                  <span className={styles.settingsItemLabel}>{setting.label}</span>
                  <span className={styles.settingsItemDesc}>{setting.description}</span>
                </div>
                <div
                  className={`${styles.toggle} ${setting.enabled ? styles.active : ""}`}
                  onClick={() => toggleSetting(notifications, setNotifications, setting.id)}
                >
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Display Preferences */}
        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionHeader}>
            <h3 className={styles.settingsSectionTitle}>
              <i className="fa-solid fa-palette me-2" style={{ color: "#8B5CF6" }}></i>
              Display Preferences
            </h3>
            <p className={styles.settingsSectionDesc}>
              Personalize how the dashboard looks and behaves
            </p>
          </div>
          <div className={styles.settingsSectionBody}>
            {preferences.map((setting) => (
              <div key={setting.id} className={styles.settingsItem}>
                <div className={styles.settingsItemInfo}>
                  <span className={styles.settingsItemLabel}>{setting.label}</span>
                  <span className={styles.settingsItemDesc}>{setting.description}</span>
                </div>
                <div
                  className={`${styles.toggle} ${setting.enabled ? styles.active : ""}`}
                  onClick={() => toggleSetting(preferences, setPreferences, setting.id)}
                >
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionHeader}>
            <h3 className={styles.settingsSectionTitle}>
              <i className="fa-solid fa-database me-2" style={{ color: "#10B981" }}></i>
              Data Management
            </h3>
            <p className={styles.settingsSectionDesc}>
              Manage your data and account
            </p>
          </div>
          <div className={styles.settingsSectionBody}>
            <div className={styles.settingsItem}>
              <div className={styles.settingsItemInfo}>
                <span className={styles.settingsItemLabel}>Export All Data</span>
                <span className={styles.settingsItemDesc}>
                  Download all your saved leads, searches, and account data
                </span>
              </div>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                <i className="fa-solid fa-download me-2"></i>
                Export
              </button>
            </div>
            <div className={styles.settingsItem}>
              <div className={styles.settingsItemInfo}>
                <span className={styles.settingsItemLabel}>Clear Search History</span>
                <span className={styles.settingsItemDesc}>
                  Remove all your past search queries and filters
                </span>
              </div>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                <i className="fa-solid fa-trash me-2"></i>
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className={styles.settingsSection} style={{ borderColor: "#FCA5A5" }}>
          <div className={styles.settingsSectionHeader}>
            <h3 className={styles.settingsSectionTitle} style={{ color: "#DC2626" }}>
              <i className="fa-solid fa-triangle-exclamation me-2"></i>
              Danger Zone
            </h3>
            <p className={styles.settingsSectionDesc}>
              Irreversible and destructive actions
            </p>
          </div>
          <div className={styles.settingsSectionBody}>
            <div className={styles.settingsItem}>
              <div className={styles.settingsItemInfo}>
                <span className={styles.settingsItemLabel}>Delete Account</span>
                <span className={styles.settingsItemDesc}>
                  Permanently delete your account and all associated data
                </span>
              </div>
              <button
                className={`${styles.btn}`}
                style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FCA5A5" }}
              >
                <i className="fa-solid fa-trash me-2"></i>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default SettingsPage;
