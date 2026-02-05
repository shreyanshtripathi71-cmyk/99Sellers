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
  // Owner information
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
}

interface LeadTableProps {
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

// Mask owner data for free users
const maskOwnerName = (name: string | undefined, isPro: boolean): string => {
  if (!name) return "---";
  if (isPro) return name;
  const parts = name.split(" ");
  return parts.map(part => part[0] + "****").join(" ");
};

const maskPhone = (phone: string | undefined, isPro: boolean): string => {
  if (!phone) return "---";
  if (isPro) return phone;
  return "(***) ***-" + phone.slice(-4);
};

const maskEmail = (email: string | undefined, isPro: boolean): string => {
  if (!email) return "---";
  if (isPro) return email;
  const atIndex = email.indexOf("@");
  if (atIndex <= 0) return "****@****.com";
  return email[0] + "****" + email.substring(atIndex);
};

const LeadTableView: React.FC<LeadTableProps> = ({
  leads,
  onToggleSave,
  getAddress,
  userPlan,
}) => {
  const isPro = userPlan === "Pro";

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
            <th>Owner Info</th>
            <th>Details</th>
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
                      <span className={styles.address_line}>
                        {getAddress(lead)}
                        {!isPro && (
                          <i
                            className="fa-solid fa-lock"
                            style={{
                              marginLeft: 6,
                              fontSize: 10,
                              color: "#9CA3AF",
                              verticalAlign: "middle"
                            }}
                            title="Upgrade to Pro to see full address"
                          ></i>
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
                  <span className={`${styles.badge} ${styles.badge_primary}`}>
                    {lead.type}
                  </span>
                </td>

                {/* Owner Info */}
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontWeight: 500, color: "#111827", fontSize: 13 }}>
                      {maskOwnerName(lead.ownerName || "John Smith", isPro)}
                      {!isPro && (
                        <i
                          className="fa-solid fa-lock"
                          style={{
                            marginLeft: 6,
                            fontSize: 9,
                            color: "#9CA3AF"
                          }}
                        ></i>
                      )}
                    </span>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>
                      {maskPhone(lead.ownerPhone || "(555) 123-4567", isPro)}
                    </span>
                  </div>
                </td>

                {/* Details */}
                <td>
                  <span style={{ color: "#4B5563", fontSize: 13 }}>
                    {lead.beds} bd • {lead.baths} ba • {lead.sqft.toLocaleString()} sqft
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

      {/* Upgrade prompt for free users */}
      {!isPro && (
        <div style={{
          background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
          borderRadius: 8,
          padding: "12px 16px",
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #BFDBFE"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <i className="fa-solid fa-lock" style={{ color: "#2563EB" }}></i>
            <span style={{ fontSize: 13, color: "#1E40AF", fontWeight: 500 }}>
              Some data is hidden. Upgrade to Pro to see full addresses, owner contacts, and more.
            </span>
          </div>
          <Link
            href="/dashboard/subscription"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            Upgrade Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default LeadTableView;
