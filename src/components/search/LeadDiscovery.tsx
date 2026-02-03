"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import FilterPanel, { type Filters } from "./components/FilterPanel";
import LeadTableView, { type Lead } from "./components/LeadTableView";
import LeadGridView from "./components/LeadGridView";
import SaveSearchModal from "@/modals/SaveSearchModal";
import styles from "./styles/dashboard.module.scss";

// Mock data
const MOCK_LEADS: Lead[] = [
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
    sqft: 2400,
    year: 2015,
    auctionDate: "2026-02-14",
    publishedOn: "2 days ago",
    saved: false,
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
    sqft: 1800,
    year: 1998,
    auctionDate: "Pending",
    publishedOn: "5 hours ago",
    saved: true,
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
    sqft: 3200,
    year: 2005,
    auctionDate: "2026-03-01",
    publishedOn: "1 week ago",
    saved: false,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    type: "Probate",
    address: "2210 Pine Rd",
    city: "San Antonio",
    state: "TX",
    zip: "78205",
    beds: 5,
    baths: 4,
    appraised: 890000,
    debt: 320000,
    sqft: 4200,
    year: 2018,
    auctionDate: "2026-02-20",
    publishedOn: "3 days ago",
    saved: false,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400",
    type: "Foreclosure",
    address: "1556 Cedar Blvd",
    city: "Fort Worth",
    state: "TX",
    zip: "76102",
    beds: 3,
    baths: 2.5,
    appraised: 375000,
    debt: 95000,
    sqft: 2100,
    year: 2012,
    auctionDate: "2026-03-15",
    publishedOn: "1 day ago",
    saved: false,
  },
];

const initialFilters: Filters = {
  state: "All",
  county: "All",
  motive: "All",
  minEquity: "0",
  maxDebt: "",
  minBeds: "Any",
  minBaths: "Any",
  minSqft: "",
  minYear: "",
  auctionDateStart: "",
};

const LeadDiscovery = () => {
  // Auth context for premium access
  const { canAccessPremium, isTrialActive } = useAuth();
  const router = useRouter();
  
  // Determine user plan based on auth
  const userPlan = canAccessPremium() || isTrialActive() ? "Pro" : "Free";
  
  // State
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search query
      const matchesSearch =
        lead.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.zip.includes(searchQuery);

      // Filters
      const matchesState = filters.state === "All" || lead.state === filters.state;
      const matchesMotive = filters.motive === "All" || lead.type === filters.motive;
      const matchesBeds = filters.minBeds === "Any" || lead.beds >= parseInt(filters.minBeds);
      const matchesBaths = filters.minBaths === "Any" || lead.baths >= parseFloat(filters.minBaths);
      const matchesSqft = !filters.minSqft || lead.sqft >= parseInt(filters.minSqft);
      const matchesYear = !filters.minYear || lead.year >= parseInt(filters.minYear);
      const matchesDebt = !filters.maxDebt || lead.debt <= parseInt(filters.maxDebt);

      const profit = lead.appraised - lead.debt;
      const equityPercent = (profit / lead.appraised) * 100;
      const matchesEquity = equityPercent >= parseInt(filters.minEquity);

      return (
        matchesSearch &&
        matchesState &&
        matchesMotive &&
        matchesBeds &&
        matchesBaths &&
        matchesSqft &&
        matchesYear &&
        matchesDebt &&
        matchesEquity
      );
    });
  }, [leads, searchQuery, filters]);

  // Handlers
  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSearchQuery("");
  };

  const handleToggleSave = (id: number) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, saved: !l.saved } : l)));
  };

  // Mask sensitive data for free users
  const getAddress = (lead: Lead) => {
    if (userPlan === "Pro") return lead.address;
    // Show partial address with masked street number
    const parts = lead.address.split(" ");
    if (parts.length > 1) {
      const streetNum = parts[0];
      const maskedNum = streetNum.substring(0, 1) + "***";
      return maskedNum + " " + parts.slice(1).join(" ");
    }
    return "*** " + lead.address.substring(3);
  };

  // Masked city for free users (show partial)
  const getMaskedCity = (city: string) => {
    if (userPlan === "Pro") return city;
    return city.substring(0, 3) + "***";
  };

  // Masked zip for free users
  const getMaskedZip = (zip: string) => {
    if (userPlan === "Pro") return zip;
    return zip.substring(0, 3) + "**";
  };

  return (
    <>
      {/* Save Search Modal */}
      {showSaveModal && (
        <SaveSearchModal
          onClose={() => setShowSaveModal(false)}
          onSave={(name) => {
            alert(`Saved search: ${name}`);
            setShowSaveModal(false);
          }}
          filters={filters}
        />
      )}

      <div className={styles.dashboard_root}>
        {/* Sidebar */}
        <Sidebar userPlan={userPlan} onUpgrade={() => router.push("/dashboard/subscription")} />

        {/* Main Content */}
        <main className={styles.main_content}>
          <Header title="Lead Discovery" subtitle="Live" userPlan={userPlan} />

          <div className={styles.content_area}>
            {/* Search Bar */}
            <div className={styles.search_container}>
              <div className={styles.search_bar}>
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search by City, Zip, or Address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className={styles.search_actions}>
                <button
                  className={styles.btn_secondary}
                  onClick={() => setShowSaveModal(true)}
                >
                  <i className="fa-regular fa-bookmark"></i>
                  Save Search
                </button>

                <button
                  className={`${styles.btn_secondary} ${showFilters ? styles.active : ""}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="fa-solid fa-sliders"></i>
                  Filters
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              onApply={() => setShowFilters(false)}
              isOpen={showFilters}
            />

            {/* Results Header */}
            <div className={styles.results_header}>
              <div className={styles.results_count}>
                Found <strong>{filteredLeads.length}</strong> properties
                {searchQuery && ` matching "${searchQuery}"`}
              </div>

              <div className={styles.view_toggle}>
                <button
                  className={`${styles.view_btn} ${viewMode === "list" ? styles.active : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
                <button
                  className={`${styles.view_btn} ${viewMode === "grid" ? styles.active : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <i className="fa-solid fa-grid-2"></i>
                </button>
              </div>
            </div>

            {/* Lead List/Grid */}
            {viewMode === "list" ? (
              <LeadTableView
                leads={filteredLeads}
                onToggleSave={handleToggleSave}
                getAddress={getAddress}
                userPlan={userPlan}
              />
            ) : (
              <LeadGridView
                leads={filteredLeads}
                onToggleSave={handleToggleSave}
                getAddress={getAddress}
                userPlan={userPlan}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default LeadDiscovery;
