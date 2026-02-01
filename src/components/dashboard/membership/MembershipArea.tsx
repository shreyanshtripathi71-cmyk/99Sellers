"use client"
import React from "react";
import styles from "@/components/search/dashboard.module.scss"; // Reuse Styles
import Link from "next/link";

const MembershipArea = () => {
   return (
      <div className={styles.dashboard_layout}>
         <aside className={styles.sidebar}>
            <Link href="/" className={styles.logo_area}>
                <div style={{width: 18, height: 18, background: '#2563EB', borderRadius: 4}}></div>
                99Sellers.
            </Link>
            <nav className={styles.nav_menu}>
               <Link href="/search" className={styles.nav_item}><i className="fa-solid fa-list"></i> Search List</Link>
               <div className={`${styles.nav_item} ${styles.active}`}><i className="fa-solid fa-credit-card"></i> Membership</div>
            </nav>
         </aside>

         <main className={styles.main_content}>
            <header className={styles.top_header}>
               <h3>Subscription & Billing</h3>
            </header>

            <div className={styles.scroll_area}>
               <div style={{ maxWidth: '800px' }}>
                  
                  {/* CURRENT PLAN CARD */}
                  <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '32px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <span className={styles.badge + " " + styles.badge_blue} style={{ marginBottom: '12px' }}>Current Plan</span>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '0 0 8px 0' }}>Pro Investor</h2>
                        <p style={{ color: '#64748B', fontSize: '14px' }}>$99.00 / month • Next billing on Feb 14, 2026</p>
                     </div>
                     <div style={{ display: 'flex', gap: '12px' }}>
                        <button className={styles.btn_details}>Cancel Subscription</button>
                        <button className={styles.btn_primary_small}>Update Card</button>
                     </div>
                  </div>

               </div>
            </div>
         </main>
      </div>
   );
};

export default MembershipArea;