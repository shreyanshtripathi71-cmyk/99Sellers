"use client";
import React from "react";
import Link from "next/link";
import styles from "../styles/dashboard.module.scss";

export interface Lead {
  id: number;
  image: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  appraised: number;
  debt: number;
  sqft: number;
  year: number;
  auctionDate: string;
  publishedOn: string;
  saved: boolean;
}

interface LeadTableProps {
  leads: Lead[];
  onToggleSave: (id: number) => void;
  getAddress: (lead: Lead) => string;
  userPlan: "Free" | "Pro";
  onMaskedDataClick?: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const LeadTableView: React.FC<LeadTableProps> = ({
  leads,
  onToggleSave,
  getAddress,
  userPlan,
  onMaskedDataClick,
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
    <div className={styles.table_container}>
      <table className={styles.table}>
        <thead className={styles.table_header}>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Details</th>
            <th>Value</th>
            <th>Equity</th>
            <th>Auction</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const equity = lead.appraised - lead.debt;
            const equityPercent = Math.round((equity / lead.appraised) * 100);

            return (
              <tr key={lead.id} className={styles.table_row} onClick={() => window.location.href = `/property/${lead.id}`} style={{ cursor: "pointer" }}>
                {/* Property */}
                <td>
                  <div className={styles.table_address}>
                    <img
                      src={lead.image}
                      alt=""
                      className={styles.address_image}
                    />
                    <div className={styles.address_text}>
                      <span 
                        className={styles.address_line}
                        onClick={(e) => {
                          if (userPlan === "Free" && onMaskedDataClick) {
                            e.stopPropagation();
                            e.preventDefault();
                            onMaskedDataClick();
                          }
                        }}
                        style={userPlan === "Free" ? { 
                          cursor: "pointer", 
                          color: "#2563EB",
                          textDecoration: "underline",
                          textDecorationStyle: "dotted"
                        } : undefined}
                        title={userPlan === "Free" ? "Click to unlock full address" : undefined}
                      >
                        {getAddress(lead)}
                        {userPlan === "Free" && (
                          <i className="fa-solid fa-lock" style={{ marginLeft: 6, fontSize: 10, opacity: 0.7 }}></i>
                        )}
                      </span>
                      <span className={styles.address_city}>
                        {lead.city}, {lead.state} {lead.zip}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td>
                  <span
                    className={`${styles.badge} ${
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
                </td>

                {/* Details */}
                <td>
                  <span style={{ color: "#4B5563", fontSize: 13 }}>
                    {lead.beds} bd • {lead.baths} ba • {lead.sqft.toLocaleString()} sqft
                  </span>
                </td>

                {/* Value */}
                <td>
                  <span style={{ fontWeight: 600 }}>
                    {formatCurrency(lead.appraised)}
                  </span>
                </td>

                {/* Equity */}
                <td>
                  <div className={styles.table_equity}>
                    <span className={styles.equity_value}>
                      {formatCurrency(equity)}
                    </span>
                    <span className={styles.equity_percent}>
                      {equityPercent}% equity
                    </span>
                  </div>
                </td>

                {/* Auction */}
                <td>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>
                    {lead.auctionDate === "Pending" ? (
                      <span className={`${styles.badge} ${styles.badge_neutral}`}>
                        Pending
                      </span>
                    ) : (
                      lead.auctionDate
                    )}
                  </span>
                </td>

                {/* Actions */}
                <td onClick={(e) => e.stopPropagation()}>
                  <div className={styles.table_actions}>
                    <button
                      className={`${styles.save_btn} ${lead.saved ? styles.saved : ""}`}
                      onClick={() => onToggleSave(lead.id)}
                      title={lead.saved ? "Remove from saved" : "Save lead"}
                    >
                      <i className={lead.saved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                    </button>
                    <Link href={`/property/${lead.id}`} className={styles.btn_icon} title="View details">
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTableView;
