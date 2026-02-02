"use client";
import React, { useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/search/DashboardShell";
import styles from "@/components/search/styles/dashboard.module.scss";

interface SavedSearch {
  id: number;
  name: string;
  filters: {
    state: string;
    motive: string;
    minEquity: string;
    minBeds: string;
  };
  resultsCount: number;
  lastRun: string;
  createdAt: string;
  alertEnabled: boolean;
}

const MOCK_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: 1,
    name: "Texas Foreclosures 40%+ Equity",
    filters: { state: "TX", motive: "Foreclosure", minEquity: "40%", minBeds: "3+" },
    resultsCount: 127,
    lastRun: "2 hours ago",
    createdAt: "2026-01-15",
    alertEnabled: true,
  },
  {
    id: 2,
    name: "California Probate Properties",
    filters: { state: "CA", motive: "Probate", minEquity: "20%", minBeds: "Any" },
    resultsCount: 84,
    lastRun: "1 day ago",
    createdAt: "2026-01-20",
    alertEnabled: false,
  },
  {
    id: 3,
    name: "Florida Tax Defaults",
    filters: { state: "FL", motive: "Tax Default", minEquity: "50%", minBeds: "2+" },
    resultsCount: 56,
    lastRun: "3 days ago",
    createdAt: "2026-01-25",
    alertEnabled: true,
  },
];

const SavedSearchesPage = () => {
  const [searches, setSearches] = useState<SavedSearch[]>(MOCK_SAVED_SEARCHES);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this saved search?")) {
      setSearches(searches.filter((s) => s.id !== id));
    }
  };

  const toggleAlert = (id: number) => {
    setSearches(
      searches.map((s) =>
        s.id === id ? { ...s, alertEnabled: !s.alertEnabled } : s
      )
    );
  };

  return (
    <DashboardShell title="Saved Searches">
      {/* Header */}
      <div className={styles.results_header} style={{ marginBottom: 24 }}>
        <div className={styles.results_count}>
          <strong>{searches.length}</strong> saved searches
        </div>
        <Link href="/search" className={styles.btn_primary}>
          <i className="fa-solid fa-plus"></i>
          New Search
        </Link>
      </div>

      {/* Search Cards Grid */}
      {searches.length > 0 ? (
        <div className={styles.grid_container} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}>
          {searches.map((search) => (
            <div key={search.id} className={styles.grid_card} style={{ padding: 0 }}>
              <div style={{ padding: 20 }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>
                      {search.name}
                    </h3>
                    <p style={{ fontSize: 13, color: "#9CA3AF", margin: "4px 0 0" }}>
                      Created {search.createdAt}
                    </p>
                  </div>
                  <span className={`${styles.badge} ${styles.badge_primary}`}>
                    {search.resultsCount} results
                  </span>
                </div>

                {/* Filters */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  <span className={`${styles.badge} ${styles.badge_neutral}`}>
                    {search.filters.state}
                  </span>
                  <span className={`${styles.badge} ${styles.badge_neutral}`}>
                    {search.filters.motive}
                  </span>
                  <span className={`${styles.badge} ${styles.badge_neutral}`}>
                    {search.filters.minEquity} equity
                  </span>
                  <span className={`${styles.badge} ${styles.badge_neutral}`}>
                    {search.filters.minBeds} beds
                  </span>
                </div>

                {/* Alert Toggle */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderTop: "1px solid #E5E7EB",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#6B7280" }}>
                    <i className="fa-solid fa-bell" style={{ marginRight: 6 }}></i>
                    Email alerts
                  </span>
                  <button
                    onClick={() => toggleAlert(search.id)}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      background: search.alertEnabled ? "#2563EB" : "#E5E7EB",
                      border: "none",
                      cursor: "pointer",
                      position: "relative",
                      transition: "background 0.2s",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        left: search.alertEnabled ? 22 : 2,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "white",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        transition: "left 0.2s",
                      }}
                    />
                  </button>
                </div>

                {/* Last Run */}
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: "8px 0 0" }}>
                  Last run: {search.lastRun}
                </p>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  borderTop: "1px solid #E5E7EB",
                  background: "#F9FAFB",
                }}
              >
                <Link
                  href={`/search?saved=${search.id}`}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#2563EB",
                    textDecoration: "none",
                    borderRight: "1px solid #E5E7EB",
                  }}
                >
                  <i className="fa-solid fa-play"></i>
                  Run
                </Link>
                <button
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#6B7280",
                    background: "transparent",
                    border: "none",
                    borderRight: "1px solid #E5E7EB",
                    cursor: "pointer",
                  }}
                >
                  <i className="fa-solid fa-pen"></i>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(search.id)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#EF4444",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty_state}>
          <div className={styles.empty_icon}>
            <i className="fa-regular fa-folder"></i>
          </div>
          <h3>No saved searches yet</h3>
          <p>
            Save your search criteria to quickly run them again later and receive alerts for new matches.
          </p>
          <Link href="/search" className={styles.btn_primary}>
            Create Your First Search
          </Link>
        </div>
      )}
    </DashboardShell>
  );
};

export default SavedSearchesPage;
