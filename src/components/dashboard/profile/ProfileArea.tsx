"use client"
import React from "react";
// ENSURE THIS PATH IS CORRECT FOR YOUR PROJECT
import styles from "@/components/search/dashboard.module.scss"; 
import Link from "next/link";

const ProfileArea = () => {
   return (
      <div className={styles.dashboard_layout}>
         {/* SIDEBAR */}
         <aside className={styles.sidebar}>
            <Link href="/" className={styles.logo_area}>
               <div style={{width: 18, height: 18, background: '#2563EB', borderRadius: 4}}></div>
               99Sellers.
            </Link>
            <nav className={styles.nav_menu}>
               {/* Link points to the NEW Dashboard */}
               <Link href="/search" className={styles.nav_item}>
                  <i className="fa-solid fa-list"></i> Search List
               </Link>
               <Link href="/saved" className={styles.nav_item}>
                  <i className="fa-solid fa-heart"></i> Saved Addresses
               </Link>
               <Link href="/dashboard/saved-search" className={styles.nav_item}>
                  <i className="fa-solid fa-bookmark"></i> Saved Searches
               </Link>
               <div className={`${styles.nav_item} ${styles.active}`}>
                  <i className="fa-solid fa-user"></i> Account & Billing
               </div>
            </nav>
         </aside>

         <main className={styles.main_content}>
            <header className={styles.top_header}>
               <h3>Account Settings</h3>
               <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white' }}>JD</div>
            </header>

            <div className={styles.scroll_area}>
               <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  
                  {/* --- SECTION 1: MEMBERSHIP DETAILS --- */}
                  <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div>
                           <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: '0 0 4px 0' }}>Subscription Plan</h4>
                           <p style={{ fontSize: '13px', color: '#64748B' }}>Manage your billing and plan details.</p>
                        </div>
                        <span className={styles.badge + " " + styles.badge_blue}>Pro Plan</span>
                     </div>
                     
                     <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div>
                           <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Current Status</div>
                           <div style={{ fontSize: '14px', fontWeight: '600', color: '#10B981' }}>Active</div>
                        </div>
                        <div style={{ width: '1px', height: '30px', background: '#CBD5E1' }}></div>
                        <div>
                           <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Next Billing</div>
                           <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>$99/mo on Feb 14, 2026</div>
                        </div>
                     </div>

                     <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                        <button className={styles.btn_details}>Manage Card</button>
                        <button className={styles.btn_details} style={{color: '#EF4444', borderColor: '#FECACA'}}>Cancel Plan</button>
                     </div>
                  </div>

                  {/* --- SECTION 2: PERSONAL INFO --- */}
                  <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
                     <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '24px' }}>Personal Information</h4>
                     
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className={styles.input_group}>
                           <label>First Name</label>
                           <input type="text" defaultValue="John" />
                        </div>
                        <div className={styles.input_group}>
                           <label>Last Name</label>
                           <input type="text" defaultValue="Doe" />
                        </div>
                        <div className={styles.input_group} style={{ gridColumn: '1 / -1' }}>
                           <label>Email Address</label>
                           <input type="email" defaultValue="john.doe@example.com" disabled style={{ background: '#F1F5F9', color: '#94A3B8' }} />
                        </div>
                     </div>

                     <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button className={styles.btn_primary_small}>Save Changes</button>
                     </div>
                  </div>

               </div>
            </div>
         </main>
      </div>
   );
};

export default ProfileArea;