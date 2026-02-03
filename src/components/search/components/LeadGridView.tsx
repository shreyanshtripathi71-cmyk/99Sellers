"use client";
import React from "react";
import Link from "next/link";
import styles from "../styles/dashboard.module.scss";
import type { Lead } from "./LeadTableView";

interface LeadGridProps {
  leads: Lead[];
  onToggleSave: (id: number) => void;
  getAddress: (lead: Lead) => string;
  userPlan: "Free" | "Pro";
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const LeadGridView: React.FC<LeadGridProps> = ({
  leads,
  onToggleSave,
  getAddress,
  userPlan,
}) => {
  if (leads.length === 0) {
    return (
      <div className={styles.empty_state}>
        <div className={styles.empty_icon}>
          <i className="fa-solid fa-house-circle-xmark"></i>
        </div>
        <h3>No properties found</h3>
        <p>Try adjusting your filters or search query to find more leads.</p>
        <button className={styles.btn_primary}>Clear Filters</button>
      </div>
    );
  }

  return (
    <div className={styles.grid_container}>
      {leads.map((lead) => {
        const equity = lead.appraised - lead.debt;
        const equityPercent = Math.round((equity / lead.appraised) * 100);

        return (
          <Link href={`/property/${lead.id}`} key={lead.id} className={styles.grid_card}>
            {/* Image */}
            <div className={styles.card_image}>
              <img src={lead.image} alt={getAddress(lead)} />
              
              <span
                className={`${styles.card_badge} ${styles.badge} ${
                  lead.type === "Foreclosure"
                    ? styles.badge_danger
                    : lead.type === "Probate"
                    ? styles.badge_primary
                    : lead.type === "Tax Default"
                    ? styles.badge_warning
                    : styles.badge_neutral
                }`}
              >
                {lead.type}
              </span>

              <button
                className={`${styles.card_save} ${lead.saved ? styles.saved : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleSave(lead.id);
                }}
              >
                <i className={lead.saved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
              </button>
            </div>

            {/* Content */}
            <div className={styles.card_content}>
              <h3 className={styles.card_title}>{getAddress(lead)}</h3>
              <p className={styles.card_location}>
                {lead.city}, {lead.state} {lead.zip}
              </p>

              <div className={styles.card_stats}>
                <div className={styles.stat}>
                  <span className={styles.stat_label}>Value</span>
                  <span className={styles.stat_value}>
                    {formatCurrency(lead.appraised)}
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.stat_label}>Equity</span>
                  <span className={styles.stat_value} style={{ color: "#10B981" }}>
                    {formatCurrency(equity)}
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.stat_label}>Details</span>
                  <span className={styles.stat_value}>
                    {lead.beds}bd/{lead.baths}ba
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default LeadGridView;
