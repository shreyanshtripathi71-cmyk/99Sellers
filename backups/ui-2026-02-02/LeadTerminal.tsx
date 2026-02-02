"use client"
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "./DashboardLayout";
import SearchFilters, { type Filters } from "./SearchFilters";
import LeadTable, { type Lead } from "./LeadTable";
import LeadGrid from "./LeadGrid";
import SaveSearchModal from "@/modals/SaveSearchModal";
import styles from "./dashboard.module.scss";

// Mock data
const MOCK_LEADS: Lead[] = [
   { id: 1, image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400", type: "Foreclosure", address: "1024 Elm St", city: "Austin", state: "TX", zip: "78701", beds: 3, baths: 2, appraised: 450000, debt: 120000, sqft: 2400, year: 2015, auctionDate: "2026-02-14", publishedOn: "2 days ago", saved: false },
   { id: 2, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400", type: "Divorce", address: "550 Maple Ave", city: "Dallas", state: "TX", zip: "75201", beds: 4, baths: 3, appraised: 320000, debt: 280000, sqft: 1800, year: 1998, auctionDate: "Pending", publishedOn: "5 hours ago", saved: true },
   { id: 3, image: "https://images.unsplash.com/photo-1600596542815-2a4d9f6fac90?w=400", type: "Tax Default", address: "880 Oak Ln", city: "Houston", state: "TX", zip: "77002", beds: 2, baths: 1, appraised: 610000, debt: 50000, sqft: 3200, year: 2005, auctionDate: "2026-03-01", publishedOn: "1 week ago", saved: false },
   { id: 4, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400", type: "Probate", address: "2210 Pine Rd", city: "San Antonio", state: "TX", zip: "78205", beds: 5, baths: 4, appraised: 890000, debt: 320000, sqft: 4200, year: 2018, auctionDate: "2026-02-20", publishedOn: "3 days ago", saved: false },
   { id: 5, image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400", type: "Foreclosure", address: "1556 Cedar Blvd", city: "Fort Worth", state: "TX", zip: "76102", beds: 3, baths: 2.5, appraised: 375000, debt: 95000, sqft: 2100, year: 2012, auctionDate: "2026-03-15", publishedOn: "1 day ago", saved: false },
];

const LeadTerminal = () => {
   // State
   const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
   const [userPlan, setUserPlan] = useState<'Free' | 'Pro'>('Free');
   const [showSaveModal, setShowSaveModal] = useState(false);
   const [showFilters, setShowFilters] = useState(false);
   const [showUserMenu, setShowUserMenu] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

   // Filters
   const [filters, setFilters] = useState<Filters>({
      state: "All",
      county: "All",
      motive: "All",
      minEquity: "0",
      maxDebt: "",
      minBeds: "Any",
      minBaths: "Any",
      minSqft: "",
      minYear: "",
      auctionDateStart: ""
   });

   // Filter logic
   const filteredLeads = useMemo(() => {
      return leads.filter(lead => {
         const matchesSearch = 
            lead.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.zip.includes(searchQuery);
         
         const matchesState = filters.state === "All" || lead.state === filters.state;
         const matchesMotive = filters.motive === "All" || lead.type === filters.motive;
         const matchesBeds = filters.minBeds === "Any" || lead.beds >= parseInt(filters.minBeds);
         const matchesBaths = filters.minBaths === "Any" || lead.baths >= parseInt(filters.minBaths);
         const matchesSqft = !filters.minSqft || lead.sqft >= parseInt(filters.minSqft);
         const matchesYear = !filters.minYear || lead.year >= parseInt(filters.minYear);
         const matchesDebt = !filters.maxDebt || lead.debt <= parseInt(filters.maxDebt);
         
         const profit = lead.appraised - lead.debt;
         const equityPercent = (profit / lead.appraised) * 100;
         const matchesEquity = equityPercent >= parseInt(filters.minEquity);
         
         const matchesDate = !filters.auctionDateStart || lead.auctionDate >= filters.auctionDateStart;

         return matchesSearch && matchesState && matchesMotive && matchesBeds && 
                matchesBaths && matchesSqft && matchesYear && matchesDebt && 
                matchesEquity && matchesDate;
      });
   }, [leads, searchQuery, filters]);

   // Handlers
   const handleFilterChange = (field: string, value: string) => {
      setFilters(prev => ({ ...prev, [field]: value }));
   };

   const toggleSave = (id: number) => {
      setLeads(leads.map(l => l.id === id ? { ...l, saved: !l.saved } : l));
   };

   const getAddress = (lead: Lead) => {
      if (userPlan === 'Pro') return lead.address;
      return lead.address.substring(0, 2) + "** " + lead.address.split(' ').slice(1).join(' ');
   };

   const resetFilters = () => {
      setFilters({
         state: "All",
         county: "All",
         motive: "All",
         minEquity: "0",
         maxDebt: "",
         minBeds: "Any",
         minBaths: "Any",
         minSqft: "",
         minYear: "",
         auctionDateStart: ""
      });
      setSearchQuery("");
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

         <DashboardLayout userPlan={userPlan} onUpgrade={() => setUserPlan('Pro')}>
            {/* Header */}
            <motion.header 
               className={styles.top_header}
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.3 }}
            >
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ 
                     fontSize: '24px', 
                     fontWeight: '800',
                     background: 'linear-gradient(135deg, #0F172A 0%, #2563EB 100%)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     margin: 0
                  }}>
                     Lead Discovery
                  </h3>
                  <motion.span 
                     className={`${styles.badge} ${styles.badge_green}`}
                     style={{ boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' }}
                     animate={{ 
                        boxShadow: [
                           '0 2px 8px rgba(16, 185, 129, 0.3)',
                           '0 2px 12px rgba(16, 185, 129, 0.5)',
                           '0 2px 8px rgba(16, 185, 129, 0.3)'
                        ]
                     }}
                     transition={{ duration: 2, repeat: Infinity }}
                  >
                     <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#10B981',
                        display: 'inline-block',
                        marginRight: '6px',
                        animation: 'pulse 2s infinite'
                     }}></span>
                     Live Feed
                  </motion.span>
               </div>

               <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <motion.button
                     className={styles.btn_details}
                     onClick={() => setShowSaveModal(true)}
                     style={{
                        border: '1px solid #2563EB',
                        color: '#2563EB',
                        fontSize: '13px',
                        fontWeight: '600'
                     }}
                     whileHover={{ scale: 1.05, backgroundColor: '#EFF6FF' }}
                     whileTap={{ scale: 0.95 }}
                  >
                     <i className="fa-regular fa-bookmark me-2"></i>
                     Save Search
                  </motion.button>

                  {/* User Menu */}
                  <div style={{ position: 'relative' }}>
                     <motion.button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{
                           width: 40,
                           height: 40,
                           borderRadius: '50%',
                           background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           fontSize: '14px',
                           fontWeight: 'bold',
                           color: 'white',
                           border: '2px solid white',
                           cursor: 'pointer',
                           boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                        }}
                        whileHover={{ scale: 1.1, boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                     >
                        JD
                     </motion.button>

                     {showUserMenu && (
                        <>
                           <div
                              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }}
                              onClick={() => setShowUserMenu(false)}
                           ></div>

                           <motion.div
                              style={{
                                 position: 'absolute',
                                 top: '50px',
                                 right: 0,
                                 width: '220px',
                                 background: 'white',
                                 border: '1px solid #E2E8F0',
                                 borderRadius: '12px',
                                 boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                                 zIndex: 100,
                                 padding: '8px',
                                 overflow: 'hidden'
                              }}
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.2 }}
                           >
                              <div style={{
                                 padding: '12px',
                                 borderBottom: '1px solid #F1F5F9',
                                 marginBottom: '6px'
                              }}>
                                 <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>
                                    John Doe
                                 </div>
                                 <div style={{ fontSize: '12px', color: '#64748B' }}>
                                    john@example.com
                                 </div>
                                 {userPlan === 'Pro' && (
                                    <div style={{
                                       display: 'inline-block',
                                       marginTop: '6px',
                                       padding: '2px 8px',
                                       background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                                       borderRadius: '12px',
                                       fontSize: '10px',
                                       fontWeight: '700',
                                       color: '#1E40AF',
                                       border: '1px solid #BFDBFE'
                                    }}>
                                       <i className="fa-solid fa-crown" style={{ color: '#F59E0B', marginRight: '4px' }}></i>
                                       PRO
                                    </div>
                                 )}
                              </div>
                              <motion.a
                                 href="/dashboard/profile"
                                 style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    color: '#475569',
                                    textDecoration: 'none',
                                    cursor: 'pointer'
                                 }}
                                 whileHover={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}
                              >
                                 <i className="fa-regular fa-user"></i>
                                 Profile Settings
                              </motion.a>
                              <motion.a
                                 href="/dashboard/membership"
                                 style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    color: '#475569',
                                    textDecoration: 'none',
                                    cursor: 'pointer'
                                 }}
                                 whileHover={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}
                              >
                                 <i className="fa-regular fa-credit-card"></i>
                                 Billing & Plans
                              </motion.a>
                              <div style={{ height: '1px', background: '#F1F5F9', margin: '6px 0' }}></div>
                              <motion.button
                                 style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    color: '#EF4444',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                 }}
                                 whileHover={{ backgroundColor: '#FEF2F2' }}
                              >
                                 <i className="fa-solid fa-right-from-bracket"></i>
                                 Sign Out
                              </motion.button>
                           </motion.div>
                        </>
                     )}
                  </div>
               </div>
            </motion.header>

            <div className={styles.scroll_area}>
               {/* Search Bar */}
               <motion.div
                  className={styles.simple_search_bar}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
               >
                  <i className="fa-solid fa-magnifying-glass" style={{ color: '#94A3B8', marginLeft: '16px' }}></i>
                  <input
                     type="text"
                     className={styles.search_input_large}
                     placeholder="Search by City, Zip, or Address..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <motion.button
                     className={styles.btn_primary}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                  >
                     Search
                  </motion.button>

                  <div style={{ width: '1px', height: '24px', background: '#E2E8F0', margin: '0 8px' }}></div>

                  {/* View Toggle */}
                  <div className={styles.view_toggle}>
                     <motion.button
                        className={`${styles.btn_view_mode} ${viewMode === 'list' ? styles.active : ''}`}
                        onClick={() => setViewMode('list')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                     >
                        <i className="fa-solid fa-bars"></i>
                     </motion.button>
                     <motion.button
                        className={`${styles.btn_view_mode} ${viewMode === 'grid' ? styles.active : ''}`}
                        onClick={() => setViewMode('grid')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                     >
                        <i className="fa-solid fa-border-all"></i>
                     </motion.button>
                  </div>

                  {/* Filter Toggle */}
                  <motion.button
                     className={`${styles.btn_filter_toggle} ${showFilters ? styles.active : ''}`}
                     onClick={() => setShowFilters(!showFilters)}
                     title="Advanced Filters"
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                  >
                     <i className="fa-solid fa-sliders"></i>
                     <span style={{ marginLeft: '6px', fontSize: '12px', fontWeight: '600' }}>
                        Filters
                     </span>
                  </motion.button>
               </motion.div>

               {/* Filters Component */}
               <SearchFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={resetFilters}
                  onClose={() => setShowFilters(false)}
                  isOpen={showFilters}
               />

               {/* Results Count */}
               <motion.div
                  style={{
                     padding: '12px 0',
                     fontSize: '14px',
                     color: '#64748B',
                     fontWeight: '500'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
               >
                  Found <strong style={{ color: '#0F172A' }}>{filteredLeads.length}</strong> properties
                  {searchQuery && ` matching "${searchQuery}"`}
               </motion.div>

               {/* Table or Grid View */}
               {viewMode === 'list' ? (
                  <LeadTable
                     leads={filteredLeads}
                     onToggleSave={toggleSave}
                     getAddress={getAddress}
                     userPlan={userPlan}
                  />
               ) : (
                  <LeadGrid
                     leads={filteredLeads}
                     onToggleSave={toggleSave}
                     getAddress={getAddress}
                     userPlan={userPlan}
                  />
               )}
            </div>
         </DashboardLayout>

         {/* Pulse Animation */}
         <style jsx>{`
            @keyframes pulse {
               0%, 100% {
                  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
               }
               50% {
                  box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
               }
            }
         `}</style>
      </>
   );
};

export default LeadTerminal;
