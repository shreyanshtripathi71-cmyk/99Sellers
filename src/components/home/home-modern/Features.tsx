"use client"
import React from "react";
import { motion } from "framer-motion";

const Features = ({ styles }: { styles: any }) => {
   return (
      <section className={styles.section_pad} style={{ background: '#FFFFFF' }}>
         <div className={styles.container}>
            
            {/* Section Header */}
            <div className={styles.mb_48} style={{ maxWidth: '700px' }}>
               <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>
                  The Deal Terminal.
               </h2>
               <p style={{ fontSize: '20px', color: '#475569' }}>
                  We replaced the manual grunt work with a 
                  <span style={{ color: '#0F172A', fontWeight: '700' }}> high-speed auction database</span>.
               </p>
            </div>

            {/* THE COMMAND CENTER GRID */}
            <div className={styles.bento_grid}>
               
               {/* 1. FILTERING (Removed AI) */}
               <motion.div 
                  className={styles.box_card} 
                  style={{ gridColumn: 'span 2' }}
                  whileHover={{ y: -4 }}
               >
                  <div className={styles.mb_24}>
                     <div className={styles.badge_pill} style={{ background: '#EFF6FF', color: '#2563EB' }}>
                        Step 1: Discovery
                     </div>
                     <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>Granular Filtering</h3>
                     <p style={{ maxWidth: '500px' }}>Drill down by <strong>State &gt; County &gt; City</strong>. Filter specifically for Auction Dates, Unpaid Tax Amounts, or Divorce Filing Dates.</p>
                  </div>

                  {/* Visual: Manual Filters */}
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                     <div style={{ background: 'white', border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{color: '#94A3B8'}}>State:</span> Texas <i className="fa-solid fa-chevron-down" style={{fontSize: 10}}></i>
                     </div>
                     <div style={{ background: 'white', border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{color: '#94A3B8'}}>Type:</span> Foreclosure <i className="fa-solid fa-chevron-down" style={{fontSize: 10}}></i>
                     </div>
                     <div style={{ background: 'white', border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{color: '#94A3B8'}}>Equity:</span> &gt; 30% <i className="fa-solid fa-chevron-down" style={{fontSize: 10}}></i>
                     </div>
                  </div>
               </motion.div>

               {/* 2. MATH CALCULATOR (Pure Logic) */}
               <motion.div 
                  className={styles.box_card}
                  whileHover={{ y: -4 }}
               >
                  <div className={styles.badge_pill} style={{ background: '#F0FDF4', color: '#10B981' }}>
                     Step 2: Analysis
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>Equity Calculator</h3>
                  <p style={{marginBottom: '20px', fontSize: '14px'}}>We subtract total debt from estimated value.</p>
                  
                  <div style={{ marginTop: 'auto' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span className={styles.stat_label}>Market Value</span>
                        <span className={styles.font_mono}>$450,000</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px dashed #E2E8F0', paddingBottom: '16px' }}>
                        <span className={styles.stat_label}>Total Debt</span>
                        <span className={styles.font_mono} style={{ color: '#EF4444' }}>-$120,000</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={styles.stat_label} style={{ color: '#10B981' }}>GROSS EQUITY</span>
                        <span className={styles.stat_value} style={{ color: '#10B981' }}>$330k</span>
                     </div>
                  </div>
               </motion.div>

               {/* 3. SKIP TRACING (Contact Info) */}
               <motion.div 
                  className={styles.box_card}
                  whileHover={{ y: -4 }}
               >
                  <div className={styles.badge_pill} style={{ background: '#FEF2F2', color: '#EF4444' }}>
                     Step 3: Contact
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>Owner Lookup</h3>
                  <p style={{marginBottom: '20px', fontSize: '14px'}}>Get verified phone numbers.</p>
                  
                  <div style={{ background: '#1E293B', borderRadius: '8px', padding: '20px', marginTop: '24px', color: 'white' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <i className="fa-solid fa-user" style={{ fontSize: '12px' }}></i>
                        </div>
                        <div>
                           <div style={{ fontSize: '14px', fontWeight: 'bold' }}>John Doe</div>
                           <div style={{ fontSize: '12px', opacity: 0.7 }}>Homeowner</div>
                        </div>
                     </div>
                     
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '4px' }}>
                        <i className="fa-solid fa-phone" style={{ color: '#4ADE80', fontSize: '12px' }}></i>
                        <span className={styles.font_mono} style={{ fontSize: '14px' }}>(512) 555-0199</span>
                     </div>
                  </div>
               </motion.div>

               {/* 4. LEAD STACKING */}
               <motion.div 
                  className={styles.box_card} 
                  style={{ gridColumn: 'span 2' }}
                  whileHover={{ y: -4 }}
               >
                  <div className={styles.mb_24}>
                     <div className={styles.badge_pill} style={{ background: '#FFF7ED', color: '#F97316' }}>
                        Step 4: Targeting
                     </div>
                     <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>Lead Stacking</h3>
                     <p>Layer multiple distress signals to find highly motivated sellers. (e.g. <strong>Divorce + Tax Delinquent</strong>).</p>
                  </div>

                  {/* Visual: Tag Cloud */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                     {[
                        { label: 'Absentee Owner', icon: 'fa-plane' },
                        { label: 'Tax Delinquent', icon: 'fa-file-invoice-dollar' },
                        { label: 'Vacant', icon: 'fa-ghost' },
                        { label: 'Probate', icon: 'fa-scroll' }
                     ].map((tag, i) => (
                        <div key={i} style={{ 
                           display: 'flex', alignItems: 'center', gap: '8px', 
                           padding: '10px 16px', 
                           border: '1px solid #E2E8F0', 
                           borderRadius: '6px',
                           background: '#F8FAFC',
                           fontWeight: '600',
                           color: '#475569'
                        }}>
                           <i className={`fa-solid ${tag.icon}`} style={{ color: '#94A3B8' }}></i>
                           {tag.label}
                        </div>
                     ))}
                  </div>
               </motion.div>

            </div>
         </div>
      </section>
   );
};
export default Features;