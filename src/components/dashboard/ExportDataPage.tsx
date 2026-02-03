"use client";

import React, { useState } from "react";
import DashboardShell from "@/components/search/DashboardShell";
import styles from "@/components/search/styles/dashboard.module.scss";

const EXPORT_FORMATS = [
  {
    id: "csv",
    name: "CSV",
    description: "Comma-separated values, opens in Excel",
    icon: "fa-solid fa-file-csv",
    color: "#10B981",
  },
  {
    id: "excel",
    name: "Excel",
    description: "Native Excel format with formatting",
    icon: "fa-solid fa-file-excel",
    color: "#059669",
  },
  {
    id: "json",
    name: "JSON",
    description: "For developers and API integrations",
    icon: "fa-solid fa-code",
    color: "#8B5CF6",
  },
];

const EXPORT_HISTORY = [
  {
    id: 1,
    name: "Texas Foreclosures Export",
    format: "CSV",
    records: 234,
    date: "2025-03-27",
    size: "1.2 MB",
    status: "completed",
  },
  {
    id: 2,
    name: "California High Equity",
    format: "Excel",
    records: 156,
    date: "2025-03-26",
    size: "892 KB",
    status: "completed",
  },
  {
    id: 3,
    name: "Saved Leads Backup",
    format: "JSON",
    records: 89,
    date: "2025-03-25",
    size: "456 KB",
    status: "completed",
  },
  {
    id: 4,
    name: "Monthly Report - March",
    format: "Excel",
    records: 1248,
    date: "2025-03-20",
    size: "3.4 MB",
    status: "completed",
  },
];

const ExportDataPage = () => {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [exportType, setExportType] = useState<"saved" | "search">("saved");

  const handleExport = () => {
    if (!selectedFormat) return;
    // In real app, trigger export
    console.log("Exporting as:", selectedFormat);
  };

  return (
    <DashboardShell
      title="Export Data"
      subtitle="Download your leads and search results"
    >
      <div className={styles.pageContent}>
        {/* Export Options */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Create New Export</h3>
          </div>
          <div className={styles.cardBody}>
            {/* Export Type Selection */}
            <div style={{ marginBottom: 24 }}>
              <label className={styles.formLabel} style={{ marginBottom: 12, display: "block" }}>
                What would you like to export?
              </label>
              <div className={styles.btnGroup}>
                <button
                  className={`${styles.btn} ${exportType === "saved" ? styles.btnPrimary : styles.btnSecondary}`}
                  onClick={() => setExportType("saved")}
                >
                  <i className="fa-solid fa-bookmark me-2"></i>
                  Saved Leads
                  <span className={styles.badge} style={{ marginLeft: 8 }}>89</span>
                </button>
                <button
                  className={`${styles.btn} ${exportType === "search" ? styles.btnPrimary : styles.btnSecondary}`}
                  onClick={() => setExportType("search")}
                >
                  <i className="fa-solid fa-magnifying-glass me-2"></i>
                  Last Search Results
                  <span className={styles.badge} style={{ marginLeft: 8 }}>234</span>
                </button>
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className={styles.formLabel} style={{ marginBottom: 12, display: "block" }}>
                Select export format
              </label>
              <div className={styles.exportGrid}>
                {EXPORT_FORMATS.map((format) => (
                  <div
                    key={format.id}
                    className={`${styles.exportCard} ${selectedFormat === format.id ? styles.selected : ""}`}
                    onClick={() => setSelectedFormat(format.id)}
                  >
                    <div
                      className={styles.exportIcon}
                      style={{ background: `${format.color}15`, color: format.color }}
                    >
                      <i className={format.icon}></i>
                    </div>
                    <h4 className={styles.exportName}>{format.name}</h4>
                    <p className={styles.exportDesc}>{format.description}</p>
                    {selectedFormat === format.id && (
                      <div style={{ marginTop: 12 }}>
                        <i className="fa-solid fa-circle-check" style={{ color: "#2563EB", fontSize: 20 }}></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <button
                className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}
                onClick={handleExport}
                disabled={!selectedFormat}
                style={{ opacity: selectedFormat ? 1 : 0.5 }}
              >
                <i className="fa-solid fa-download me-2"></i>
                Export {exportType === "saved" ? "89" : "234"} Leads
              </button>
            </div>
          </div>
        </div>

        {/* Export History */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Export History</h3>
            <span className={styles.badge}>{EXPORT_HISTORY.length} exports</span>
          </div>
          <div className={styles.cardBody} style={{ padding: 0 }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Export Name</th>
                  <th>Format</th>
                  <th>Records</th>
                  <th>Size</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {EXPORT_HISTORY.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span style={{ fontWeight: 500, color: "#111827" }}>{item.name}</span>
                    </td>
                    <td>
                      <span
                        className={styles.badge}
                        style={{
                          background:
                            item.format === "CSV"
                              ? "rgba(16, 185, 129, 0.1)"
                              : item.format === "Excel"
                              ? "rgba(5, 150, 105, 0.1)"
                              : "rgba(139, 92, 246, 0.1)",
                          color:
                            item.format === "CSV"
                              ? "#10B981"
                              : item.format === "Excel"
                              ? "#059669"
                              : "#8B5CF6",
                        }}
                      >
                        {item.format}
                      </span>
                    </td>
                    <td>{item.records.toLocaleString()}</td>
                    <td className={styles.textMuted}>{item.size}</td>
                    <td className={styles.textMuted}>
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
                        <i className="fa-solid fa-download me-1"></i>
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default ExportDataPage;
