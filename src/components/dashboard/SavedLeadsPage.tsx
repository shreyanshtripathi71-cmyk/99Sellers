"use client";
import React, { useState } from "react";
import DashboardShell from "@/components/search/DashboardShell";
import styles from "@/components/search/styles/dashboard.module.scss";

interface SavedLead {
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
  savedOn: string;
}

const MOCK_SAVED_LEADS: SavedLead[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
    type: "Foreclosure",
    address: "1024 Elm St",
    city: "Austin",
    state: "TX",
    zip: "78701",
    beds: 3,
    baths: 2,
    appraised: 450000,
    debt: 120000,
    savedOn: "2026-01-28",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400",
    type: "Divorce",
    address: "550 Maple Ave",
    city: "Dallas",
    state: "TX",
    zip: "75201",
    beds: 4,
    baths: 3,
    appraised: 320000,
    debt: 280000,
    savedOn: "2026-01-30",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600596542815-2a4d9f6fac90?w=400",
    type: "Tax Default",
    address: "880 Oak Ln",
    city: "Houston",
    state: "TX",
    zip: "77002",
    beds: 2,
    baths: 1,
    appraised: 610000,
    debt: 50000,
    savedOn: "2026-02-01",
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const SavedLeadsPage = () => {
  const [leads, setLeads] = useState<SavedLead[]>(MOCK_SAVED_LEADS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = leads.filter(
    (lead) =>
      lead.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = (id: number) => {
    setLeads(leads.filter((l) => l.id !== id));
  };

  return (
    <DashboardShell title="Saved Leads">
      {/* Search Bar */}
      <div className={styles.search_container}>
        <div className={styles.search_bar}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search saved leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.search_actions}>
          <button className={styles.btn_secondary}>
            <i className="fa-solid fa-download"></i>
            Export All
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className={styles.results_header}>
        <div className={styles.results_count}>
          <strong>{filteredLeads.length}</strong> saved leads
        </div>
      </div>

      {/* Table */}
      {filteredLeads.length > 0 ? (
        <div className={styles.table_container}>
          <table className={styles.table}>
            <thead className={styles.table_header}>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Details</th>
                <th>Value</th>
                <th>Equity</th>
                <th>Saved On</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const equity = lead.appraised - lead.debt;
                const equityPercent = Math.round((equity / lead.appraised) * 100);

                return (
                  <tr key={lead.id} className={styles.table_row}>
                    <td>
                      <div className={styles.table_address}>
                        <img src={lead.image} alt="" className={styles.address_image} />
                        <div className={styles.address_text}>
                          <span className={styles.address_line}>{lead.address}</span>
                          <span className={styles.address_city}>
                            {lead.city}, {lead.state} {lead.zip}
                          </span>
                        </div>
                      </div>
                    </td>
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
                    <td>
                      <span style={{ color: "#4B5563", fontSize: 13 }}>
                        {lead.beds} bd • {lead.baths} ba
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(lead.appraised)}</span>
                    </td>
                    <td>
                      <div className={styles.table_equity}>
                        <span className={styles.equity_value}>{formatCurrency(equity)}</span>
                        <span className={styles.equity_percent}>{equityPercent}% equity</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, color: "#6B7280" }}>{lead.savedOn}</span>
                    </td>
                    <td>
                      <div className={styles.table_actions}>
                        <button className={styles.btn_icon} title="View details">
                          <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </button>
                        <button
                          className={styles.btn_icon}
                          title="Remove"
                          onClick={() => handleRemove(lead.id)}
                          style={{ color: "#EF4444" }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.empty_state}>
          <div className={styles.empty_icon}>
            <i className="fa-regular fa-bookmark"></i>
          </div>
          <h3>No saved leads yet</h3>
          <p>
            When you save leads from the search page, they will appear here for quick access.
          </p>
          <a href="/search" className={styles.btn_primary}>
            Start Searching
          </a>
        </div>
      )}
    </DashboardShell>
  );
};

export default SavedLeadsPage;
