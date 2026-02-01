"use client"
import React, { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./dashboard.module.scss";
import SaveSearchModal from "./SaveSearchModal";

// 1. Data Interface
interface Lead {
   id: number;
   image?: string;
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

const LeadTerminal = () => {
   // --- STATE ---
   const [viewMode, setViewMode] = useState<'list' | 'grid'>('list'); 
   const [userPlan, setUserPlan] = useState<'Free' | 'Pro'>('Free'); 
   const [showSaveModal, setShowSaveModal] = useState(false);
   const [showFilters, setShowFilters] = useState(false);
   const [showUserMenu, setShowUserMenu] = useState(false); // NEW: Dropdown State
   const [searchQuery, setSearchQuery] = useState("");

   // --- FILTER STATE ---
   const [filters, setFilters] = useState({
      state: "All", county: "All", motive: "All", minEquity: "0", maxDebt: "", 
      minBeds: "Any", minBaths: "Any", minSqft: "", minYear: "", auctionDateStart: ""
   });

   // --- MOCK DATA ---
   const [leads, setLeads] = useState<Lead[]>([
      { id: 1, image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400", type: "Foreclosure", address: "1024 Elm St", city: "Austin", state: "TX", zip: "78701", beds: 3, baths: 2, appraised: 450000, debt: 120000, sqft: 2400, year: 2015, auctionDate: "2026-02-14", publishedOn: "2 days ago", saved: false },
      { id: 2, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400", type: "Divorce", address: "550 Maple Ave", city: "Dallas", state: "TX", zip: "75201", beds: 4, baths: 3, appraised: 320000, debt: 280000, sqft: 1800, year: 1998, auctionDate: "Pending", publishedOn: "5 hours ago", saved: true },
      { id: 3, image: "https://images.unsplash.com/photo-1600596542815-2a4d9f6fac90?w=400", type: "Tax Default", address: "880 Oak Ln", city: "Houston", state: "TX", zip: "77002", beds: 2, baths: 1, appraised: 610000, debt: 50000, sqft: 3200, year: 2005, auctionDate: "2026-03-01", publishedOn: "1 week ago", saved: false },
   ]);

   // --- FILTER LOGIC ---
   const filteredLeads = useMemo(() => {
      return leads.filter(lead => {
         const matchesSearch = lead.address.toLowerCase().includes(searchQuery.toLowerCase()) || lead.city.toLowerCase().includes(searchQuery.toLowerCase()) || lead.zip.includes(searchQuery);
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

         return matchesSearch && matchesState && matchesMotive && matchesBeds && matchesBaths && matchesSqft && matchesYear && matchesDebt && matchesEquity && matchesDate;
      });
   }, [leads, searchQuery, filters]);

   const handleFilterChange = (field: string, value: string) => { setFilters(prev => ({ ...prev, [field]: value })); };
   const toggleSave = (id: number) => { setLeads(leads.map(l => l.id === id ? { ...l, saved: !l.saved } : l)); };
   const getAddress = (lead: Lead) => {
      if (userPlan === 'Pro') return lead.address;
      return lead.address.substring(0, 2) + "** " + lead.address.split(' ').slice(1).join(' ');
   };
   const resetFilters = () => {
       setFilters({ state: "All", county: "All", motive: "All", minEquity: "0", maxDebt: "", minBeds: "Any", minBaths: "Any", minSqft: "", minYear: "", auctionDateStart: "" });
       setSearchQuery("");
   };

   return (
      <div className={styles.dashboard_layout}>
         
         {showSaveModal && (
            <SaveSearchModal onClose={() => setShowSaveModal(false)} onSave={(name) => { alert(`Saved ${name}`); setShowSaveModal(false); }} filters={filters} />
         )}

         {/* SIDEBAR - NOW WITH WORKING LINKS */}
         <aside className={styles.sidebar}>
            <Link href="/" className={styles.logo_area}>
               <div style={{width: 18, height: 18, background: '#2563EB', borderRadius: 4}}></div>
               99Sellers.
            </Link>
            <nav className={styles.nav_menu}>
               <div className={`${styles.nav_item} ${styles.active}`}>
                  <i className="fa-solid fa-list"></i> Search List
               </div>
               
               {/* LINK TO SAVED PAGE */}
               <Link href="/dashboard/favorites" className={styles.nav_item}>
                  <i className="fa-solid fa-heart"></i> Saved Addresses
               </Link>
               
               {/* LINK TO SAVED SEARCHES */}
               <Link href="/dashboard/saved-search" className={styles.nav_item}>
                  <i className="fa-solid fa-bookmark"></i> Saved Searches
               </Link>
               
               {/* LINK TO PROFILE */}
               <Link href="/dashboard/profile" className={styles.nav_item}>
                  <i className="fa-solid fa-user"></i> Account
               </Link>
            </nav>

            {userPlan === 'Free' && (
               <div style={{ marginTop: 'auto', padding: '16px', background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
                   <div style={{ fontSize: '11px', color: '#B91C1C', fontWeight: 'bold' }}>Hidden Data</div>
                   <button onClick={() => setUserPlan('Pro')} style={{ width: '100%', background: '#DC2626', color: 'white', border: 'none', borderRadius: '4px', padding: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>Try Pro</button>
               </div>
            )}
         </aside>

         <main className={styles.main_content}>
            <header className={styles.top_header}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3>Lead Discovery</h3>
                  <span className={styles.badge + " " + styles.badge_green}>Live Feed</span>
               </div>
               
               <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <button 
                     className={styles.btn_details} 
                     onClick={() => setShowSaveModal(true)}
                     style={{ border: '1px solid #2563EB', color: '#2563EB', fontSize: '12px' }}
                  >
                     <i className="fa-regular fa-bookmark me-1"></i> Save Criteria
                  </button>

                  {/* USER DROPDOWN MENU */}
                  <div style={{ position: 'relative' }}>
                     <button 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', border: 'none', cursor: 'pointer' }}
                     >
                        JD
                     </button>

                     {/* The Dropdown Menu */}
                     {showUserMenu && (
                        <>
                           {/* Invisible overlay to close menu when clicking outside */}
                           <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, zIndex: 90}} onClick={() => setShowUserMenu(false)}></div>
                           
                           <div style={{
                              position: 'absolute', top: '40px', right: 0, width: '200px',
                              background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 100, padding: '6px'
                           }}>
                              <div style={{padding: '8px 12px', borderBottom: '1px solid #F1F5F9', marginBottom: '4px'}}>
                                 <div style={{fontSize: '13px', fontWeight: '600', color: '#0F172A'}}>John Doe</div>
                                 <div style={{fontSize: '11px', color: '#64748B'}}>john@example.com</div>
                              </div>
                              <Link href="/dashboard/profile" className={styles.nav_item} style={{justifyContent: 'flex-start', border: 'none'}}>
                                 Profile Settings
                              </Link>
                              <Link href="/dashboard/membership" className={styles.nav_item} style={{justifyContent: 'flex-start', border: 'none'}}>
                                 Billing
                              </Link>
                              <div style={{height: '1px', background: '#F1F5F9', margin: '4px 0'}}></div>
                              <button className={styles.nav_item} style={{justifyContent: 'flex-start', width: '100%', color: '#EF4444', border: 'none', background: 'transparent'}}>
                                 Sign Out
                              </button>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </header>

            <div className={styles.scroll_area}>
               
               {/* SEARCH BAR */}
               <div className={styles.simple_search_bar}>
                  <i className="fa-solid fa-magnifying-glass text-muted ms-2"></i>
                  <input 
                     type="text" 
                     className={styles.search_input_large} 
                     placeholder="Search by City, Zip, or Address..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className={styles.btn_primary}>Search</button>

                  <div style={{width: '1px', height: '24px', background: '#E2E8F0', margin: '0 8px'}}></div>

                  <div className={styles.view_toggle}>
                     <button className={`${styles.btn_view_mode} ${viewMode === 'list' ? styles.active : ''}`} onClick={() => setViewMode('list')}><i className="fa-solid fa-bars"></i></button>
                     <button className={`${styles.btn_view_mode} ${viewMode === 'grid' ? styles.active : ''}`} onClick={() => setViewMode('grid')}><i className="fa-solid fa-border-all"></i></button>
                  </div>

                  <button className={`${styles.btn_filter_toggle} ${showFilters ? styles.active : ''}`} onClick={() => setShowFilters(!showFilters)} title="Advanced Filters">
                     <i className="fa-solid fa-sliders"></i>
                  </button>
               </div>

               {/* FILTERS */}
               {showFilters && (
                  <div className={styles.filter_container}>
                     <div className={styles.filter_header}>
                        <span>Advanced Parameters</span>
                        <button className={styles.btn_clear} onClick={resetFilters}>Reset</button>
                     </div>
                     <div className={styles.filter_body}>
                        {/* Row 1: Location */}
                        <div className={styles.filter_row}>
                           <div className={styles.row_title}>Location & Motive</div>
                           <div className={styles.filter_grid_advanced}>
                              <div className={styles.input_group}>
                                 <label>State</label>
                                 <select value={filters.state} onChange={(e) => handleFilterChange('state', e.target.value)}><option value="All">All States</option><option value="TX">Texas</option><option value="FL">Florida</option></select>
                              </div>
                              <div className={styles.input_group}>
                                 <label>Motive Type</label>
                                 <select value={filters.motive} onChange={(e) => handleFilterChange('motive', e.target.value)}><option value="All">All Motives</option><option value="Foreclosure">Foreclosure</option><option value="Divorce">Divorce</option><option value="Tax Default">Tax Default</option></select>
                              </div>
                              <div className={styles.input_group}>
                                 <label>Min Equity %</label>
                                 <select value={filters.minEquity} onChange={(e) => handleFilterChange('minEquity', e.target.value)}><option value="0">Any</option><option value="30">30%+</option><option value="50">50%+</option></select>
                              </div>
                           </div>
                        </div>
                        {/* Row 2: Property */}
                        <div className={styles.filter_row}>
                            <div className={styles.row_title}>Property Details</div>
                            <div className={styles.filter_grid_advanced}>
                                <div className={styles.input_group}><label>Min Beds</label><select value={filters.minBeds} onChange={(e) => handleFilterChange('minBeds', e.target.value)}><option value="Any">Any</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></div>
                                <div className={styles.input_group}><label>Min Baths</label><select value={filters.minBaths} onChange={(e) => handleFilterChange('minBaths', e.target.value)}><option value="Any">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select></div>
                                <div className={styles.input_group}><label>Min SqFt</label><input type="number" placeholder="e.g. 1500" value={filters.minSqft} onChange={(e) => handleFilterChange('minSqft', e.target.value)} /></div>
                                <div className={styles.input_group}><label>Year Built (Min)</label><input type="number" placeholder="e.g. 2000" value={filters.minYear} onChange={(e) => handleFilterChange('minYear', e.target.value)} /></div>
                            </div>
                        </div>
                        {/* Row 3: Financials */}
                        <div className={styles.filter_row}>
                            <div className={styles.row_title}>Financial Constraints</div>
                            <div className={styles.filter_grid_advanced}>
                                <div className={styles.input_group}><label>Max Debt ($)</label><input type="number" placeholder="e.g. 200000" value={filters.maxDebt} onChange={(e) => handleFilterChange('maxDebt', e.target.value)} /></div>
                                <div className={styles.input_group}><label>Auction Date (After)</label><input type="date" value={filters.auctionDateStart} onChange={(e) => handleFilterChange('auctionDateStart', e.target.value)} /></div>
                            </div>
                        </div>
                     </div>
                     <div className={styles.filter_footer}>
                        <button className={styles.btn_primary_small} onClick={() => setShowFilters(false)}>Apply Filters</button>
                     </div>
                  </div>
               )}

               {/* LIST VIEW */}
               {viewMode === 'list' && (
                  <div className={styles.table_container}>
                     <table className={styles.data_table}>
                        <thead>
                           <tr>
                              <th>Address</th>
                              <th style={{textAlign: 'right'}}>Appraised Amount</th>
                              <th style={{textAlign: 'right'}}>Equity %</th>
                              <th>Motive Type</th>
                              <th style={{textAlign: 'right'}}>SqFt</th>
                              <th>Auction Date</th>
                              <th>Published On</th>
                              <th>Year Built</th>
                              <th style={{textAlign: 'right'}}>Actions</th>
                           </tr>
                        </thead>
                        <tbody>
                           {filteredLeads.map((lead) => {
                              const profit = lead.appraised - lead.debt;
                              const equityPercent = Math.round((profit / lead.appraised) * 100);
                              return (
                                 <tr key={lead.id}>
                                    <td>
                                       <div style={{fontWeight: '600', color: '#0F172A'}}>{getAddress(lead)}</div>
                                       <div style={{fontSize: '11px', color: '#64748B'}}>{lead.city}, {lead.state} {lead.zip}</div>
                                    </td>
                                    <td className={styles.mono_text} style={{textAlign: 'right'}}>${lead.appraised.toLocaleString()}</td>
                                    <td style={{textAlign: 'right'}}><div className={styles.mono_text} style={{color: '#10B981', fontWeight: 'bold'}}>{equityPercent}%</div></td>
                                    <td><span className={`${styles.badge} ${lead.type === 'Foreclosure' ? styles.badge_red : styles.badge_blue}`}>{lead.type}</span></td>
                                    <td className={styles.mono_text} style={{textAlign: 'right'}}>{lead.sqft.toLocaleString()}</td>
                                    <td className={styles.mono_text}>{lead.auctionDate}</td>
                                    <td style={{fontSize: '12px', color: '#64748B'}}>{lead.publishedOn}</td>
                                    <td className={styles.mono_text}>{lead.year}</td>
                                    <td style={{textAlign: 'right'}}>
                                       <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                                          <button className={`${styles.btn_icon} ${lead.saved ? styles.saved : ''}`} onClick={() => toggleSave(lead.id)}><i className={lead.saved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i></button>
                                          <Link href={`/search/${lead.id}`} className={styles.btn_details}>See Details</Link>
                                       </div>
                                    </td>
                                 </tr>
                              )
                           })}
                           {filteredLeads.length === 0 && (
                               <tr><td colSpan={9} style={{textAlign: 'center', padding: '32px', color: '#64748B'}}>No properties match your filters.</td></tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               )}

               {/* GRID VIEW */}
               {viewMode === 'grid' && (
                  <div className={styles.grid_container}>
                     {filteredLeads.map((lead) => {
                        const equityPercent = Math.round(((lead.appraised - lead.debt) / lead.appraised) * 100);
                        return (
                           <div key={lead.id} className={styles.grid_card}>
                              <div className={styles.card_img}>
                                 {lead.image && <img src={lead.image} alt="House" />}
                                 <div style={{position: 'absolute', top: 10, left: 10}}>
                                    <span className={`${styles.badge} ${lead.type === 'Foreclosure' ? styles.badge_red : styles.badge_blue}`} style={{background: 'white', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>{lead.type}</span>
                                 </div>
                              </div>
                              <div className={styles.card_body}>
                                 <div className={styles.card_price}>${lead.appraised.toLocaleString()}</div>
                                 <div className={styles.card_address}>
                                    {getAddress(lead)}
                                    {userPlan === 'Free' && <i className="fa-solid fa-lock" style={{marginLeft: '6px', fontSize: '12px', color: '#EF4444'}}></i>}
                                    <br/><span style={{fontSize: '11px', color: '#94A3B8'}}>{lead.city}, {lead.state} {lead.zip}</span>
                                 </div>
                                 <div className={styles.card_metrics}>
                                    <div><span>Equity</span><span style={{color: '#10B981'}}>{equityPercent}%</span></div>
                                    <div><span>SqFt</span><span>{lead.sqft}</span></div>
                                    <div><span>Date</span><span>{lead.auctionDate}</span></div>
                                    <div><span>Year</span><span>{lead.year}</span></div>
                                 </div>
                                 <div className={styles.card_footer}>
                                    <button className={`${styles.btn_icon} ${lead.saved ? styles.saved : ''}`} onClick={() => toggleSave(lead.id)} style={{border: '1px solid #E2E8F0'}}>
                                       <i className={lead.saved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                                    </button>
                                    <Link href={`/search/${lead.id}`} className={styles.btn_details} style={{flex: 1, background: '#F8FAFC'}}>
                                       See Details
                                    </Link>
                                 </div>
                              </div>
                           </div>
                        )
                     })}
                  </div>
               )}

            </div>
         </main>
      </div>
   );
};

export default LeadTerminal;