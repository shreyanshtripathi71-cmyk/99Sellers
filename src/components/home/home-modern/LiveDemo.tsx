"use client"
import React from "react";
import { motion } from "framer-motion";

// Mock Data for the Ticker
const leads = [
   { addr: "1024 Elm St", city: "Austin, TX", profit: "+$124k", type: "Foreclosure", color: "#EF4444" },
   { addr: "550 Maple Ave", city: "Dallas, TX", profit: "+$89k", type: "Tax Lien", color: "#F59E0B" },
   { addr: "880 Oak Ln", city: "Houston, TX", profit: "+$145k", type: "Divorce", color: "#3B82F6" },
   { addr: "202 Pine St", city: "Miami, FL", profit: "+$210k", type: "Probate", color: "#6366F1" },
   { addr: "15 Sunset Blvd", city: "Tampa, FL", profit: "+$350k", type: "Foreclosure", color: "#EF4444" },
];

const duplicatedLeads = [...leads, ...leads, ...leads]; // Create loop

const LiveDemo = ({ styles }: { styles: any }) => {
   return (
      <section id="live-data" className={styles.section_pad} style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
         <div className={styles.container}>
            <div className={styles.grid_2}>
               
               {/* Left: Text Context */}
               <div>
                  <div className={styles.mb_24}>
                     <div className={styles.badge_pill} style={{ background: '#DCFCE7', color: '#166534' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#166534', marginRight: 8, display: 'inline-block' }}></span>
                        Live Feed
                     </div>
                     <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px', color: '#0F172A' }}>
                        Real-Time Data.
                     </h2>
                     <p style={{ fontSize: '18px', color: '#475569', marginBottom: '32px' }}>
                        See properties hit the market the <strong>second</strong> they are recorded at the county courthouse. Don't wait for the MLS.
                     </p>
                  </div>
                  
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     {[
                        "Nationwide Coverage (50 States)",
                        "Daily Updates at 6:00 AM EST",
                        "Instant Excel / CSV Export"
                     ].map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600', color: '#0F172A' }}>
                           <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                              <i className="fa-solid fa-check"></i>
                           </div>
                           {item}
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Right: The Ticker Visual */}
               <div className={styles.browser_window} style={{ height: '400px', position: 'relative' }}>
                  <div className={styles.browser_header}>
                     <div></div><div></div>
                     <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase' }}>Incoming Stream</span>
                  </div>
                  
                  <div style={{ padding: '0', height: '360px', overflow: 'hidden', position: 'relative' }}>
                     {/* Gradient Masks */}
                     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(to bottom, white, transparent)', zIndex: 2 }}></div>
                     <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(to top, white, transparent)', zIndex: 2 }}></div>

                     <motion.div
                        animate={{ y: [0, -400] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                     >
                        {duplicatedLeads.map((lead, i) => (
                           <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #F1F5F9' }}>
                              <div>
                                 <div style={{ fontWeight: '600', color: '#0F172A', fontSize: '14px' }}>{lead.addr}</div>
                                 <div style={{ fontSize: '12px', color: '#64748B' }}>{lead.city}</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                 <span style={{ fontSize: '11px', fontWeight: '700', color: lead.color, background: `${lead.color}15`, padding: '4px 8px', borderRadius: '4px' }}>
                                    {lead.type}
                                 </span>
                                 <div style={{ fontWeight: '700', color: '#10B981', fontSize: '14px', marginTop: '4px' }}>{lead.profit}</div>
                              </div>
                           </div>
                        ))}
                     </motion.div>
                  </div>
               </div>

            </div>
         </div>
      </section>
   );
};

export default LiveDemo;