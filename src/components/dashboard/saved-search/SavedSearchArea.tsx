"use client"
import React from "react";
// Import the new styles
import styles from "@/components/search/dashboard.module.scss"; 
import Link from "next/link";

const SavedSearch = () => {
   // Mock Data for Saved Searches
   const searches = [
      { id: 1, name: "Austin Fix & Flips", criteria: "Austin, TX • Foreclosure • Equity > 30%", date: "Saved 2 days ago" },
      { id: 2, name: "Florida Tax Liens", criteria: "Miami, FL • Tax Default • < $50k Debt", date: "Saved 1 week ago" },
      { id: 3, name: "Dallas Multifamily", criteria: "Dallas, TX • 4+ Beds • Auction: Next Month", date: "Saved yesterday" },
   ];

   return (
      <div className={styles.dashboard_layout}>
         {/* SIDEBAR */}
         <aside className={styles.sidebar}>
            <Link href="/" className={styles.logo_area}>
                <div style={{width: 18, height: 18, background: '#2563EB', borderRadius: 4}}></div>
                99Sellers.
            </Link>
            <nav className={styles.nav_menu}>
               {/* Correct Link to New Dashboard */}
               <Link href="/search" className={styles.nav_item}>
                  <i className="fa-solid fa-list"></i> Search List
               </Link>
               <Link href="/saved" className={styles.nav_item}>
                  <i className="fa-solid fa-heart"></i> Saved Addresses
               </Link>
               <div className={`${styles.nav_item} ${styles.active}`}>
                  <i className="fa-solid fa-bookmark"></i> Saved Searches
               </div>
               <Link href="/dashboard/profile" className={styles.nav_item}>
                  <i className="fa-solid fa-user"></i> Account
               </Link>
            </nav>
         </aside>

         <main className={styles.main_content}>
            <header className={styles.top_header}>
               <h3>Saved Search Criteria</h3>
               <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white' }}>JD</div>
            </header>

            <div className={styles.scroll_area}>
               {/* Using Grid Layout for Cards */}
               <div className={styles.grid_container}>
                  {searches.map((item) => (
                     <div key={item.id} className={styles.grid_card} style={{ padding: '24px', height: 'auto' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                           <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>{item.name}</h4>
                           <button className={styles.btn_icon} title="Delete Search">
                              <i className="fa-solid fa-trash" style={{ color: '#EF4444', fontSize: '14px' }}></i>
                           </button>
                        </div>
                        
                        <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                           <p style={{ fontSize: '13px', color: '#475569', margin: 0, fontWeight: '500' }}>
                              {item.criteria}
                           </p>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                           <span style={{ fontSize: '12px', color: '#94A3B8' }}>{item.date}</span>
                           
                           {/* Correct Link to run the search */}
                           <Link href={`/search?filter=${item.id}`} className={styles.btn_primary_small} style={{ textDecoration: 'none' }}>
                              Run Search <i className="fa-solid fa-arrow-right ms-2"></i>
                           </Link>
                        </div>

                     </div>
                  ))}
               </div>
            </div>
         </main>
      </div>
   );
};

export default SavedSearch;