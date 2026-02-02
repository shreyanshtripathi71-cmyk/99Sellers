"use client"
import React, { useState } from "react";
import DashboardLayout from "@/components/search/DashboardLayout";
import styles from "@/components/search/dashboard.module.scss";

const MembershipPage = () => {
   const [userPlan] = useState<'Free' | 'Pro'>('Free');

   return (
      <DashboardLayout userPlan={userPlan} onUpgrade={() => console.log('Upgrade clicked')}>
         <div className={styles.page_container}>
            <div className={styles.page_header}>
               <div>
                  <h1 className={styles.page_title}>
                     <i className="fa-solid fa-crown" style={{ color: '#F59E0B', marginRight: '12px' }}></i>
                     Membership & Billing
                  </h1>
                  <p className={styles.page_subtitle}>
                     Manage your subscription
                  </p>
               </div>
            </div>

            <div style={{ maxWidth: '800px' }}>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: 'white', border: '2px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
                     <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Free Plan</div>
                     <div style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>$0<span style={{ fontSize: '14px', fontWeight: '500', color: '#64748B' }}>/month</span></div>
                     <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', fontSize: '13px', color: '#475569' }}>
                        <li style={{ marginBottom: '8px' }}>✓ 10 searches per day</li>
                        <li style={{ marginBottom: '8px' }}>✓ Basic filters</li>
                        <li style={{ marginBottom: '8px' }}>✓ Limited data access</li>
                     </ul>
                     {userPlan === 'Free' && <div style={{ padding: '8px', background: '#EFF6FF', color: '#2563EB', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>Current Plan</div>}
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)', border: '2px solid #2563EB', borderRadius: '10px', padding: '20px', color: 'white' }}>
                     <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>Pro Plan</div>
                     <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>$99<span style={{ fontSize: '14px', fontWeight: '500', opacity: 0.8 }}>/month</span></div>
                     <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', fontSize: '13px' }}>
                        <li style={{ marginBottom: '8px' }}>✓ Unlimited searches</li>
                        <li style={{ marginBottom: '8px' }}>✓ Advanced filters</li>
                        <li style={{ marginBottom: '8px' }}>✓ Full data access</li>
                        <li style={{ marginBottom: '8px' }}>✓ Priority support</li>
                     </ul>
                     <button style={{ width: '100%', padding: '10px', background: 'white', color: '#2563EB', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Upgrade to Pro</button>
                  </div>
               </div>
            </div>
         </div>
      </DashboardLayout>
   );
};

export default MembershipPage;
