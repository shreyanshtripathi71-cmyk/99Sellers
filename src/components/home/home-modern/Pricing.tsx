"use client"
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Pricing = ({ styles }: { styles: any }) => {
   return (
      <section id="pricing" className={styles.section_pad} style={{ background: 'white' }}>
         <div className={styles.container}>
            <div className={styles.text_center} style={{ marginBottom: '60px' }}>
               <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px', color: '#0F172A' }}>
                  Simple Pricing.
               </h2>
               <p style={{ fontSize: '18px', color: '#475569' }}>
                  Start your 7-day free trial. Cancel anytime.
               </p>
            </div>

            <div className={styles.bento_grid}>
               
               {/* 1. Starter */}
               <div className={styles.box_card} style={{ borderColor: '#E2E8F0' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}>Guest</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                     <span style={{ fontSize: '48px', fontWeight: '900', color: '#0F172A' }}>$0</span>
                     <span style={{ color: '#64748B' }}>/mo</span>
                  </div>
                  <Link href="/search" style={{ display: 'block', width: '100%', padding: '14px', textAlign: 'center', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#0F172A', fontWeight: '600', marginBottom: '32px' }}>
                     Browse Leads
                  </Link>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#475569' }}>
                     <li><i className="fa-solid fa-check me-2 text-dark"></i> Nationwide Search</li>
                     <li><i className="fa-solid fa-check me-2 text-dark"></i> Basic Filters</li>
                     <li style={{ opacity: 0.5, textDecoration: 'line-through' }}>Owner Phone Numbers</li>
                  </ul>
               </div>

               {/* 2. Pro (Highlighted) */}
               <motion.div 
                  className={styles.box_card} 
                  style={{ border: '2px solid #2563EB', background: '#F8FAFC' }}
                  whileHover={{ y: -8 }}
               >
                  <div style={{ position: 'absolute', top: 0, right: 0, background: '#2563EB', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '0 0 0 8px' }}>POPULAR</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563EB', marginBottom: '8px' }}>Pro Investor</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                     <span style={{ fontSize: '48px', fontWeight: '900', color: '#0F172A' }}>$99</span>
                     <span style={{ color: '#64748B' }}>/mo</span>
                  </div>
                  <Link href="/signup" style={{ display: 'block', width: '100%', padding: '14px', textAlign: 'center', borderRadius: '8px', background: '#2563EB', color: 'white', fontWeight: '600', marginBottom: '32px' }}>
                     Start 7-Day Free Trial
                  </Link>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#0F172A', fontWeight: '500' }}>
                     <li><i className="fa-solid fa-check me-2" style={{ color: '#2563EB' }}></i> <strong>Unlimited</strong> Searches</li>
                     <li><i className="fa-solid fa-check me-2" style={{ color: '#2563EB' }}></i> <strong>Owner Phone & Email</strong></li>
                     <li><i className="fa-solid fa-check me-2" style={{ color: '#2563EB' }}></i> Equity Calculator</li>
                     <li><i className="fa-solid fa-check me-2" style={{ color: '#2563EB' }}></i> Daily "Fresh" Updates</li>
                  </ul>
               </motion.div>

               {/* 3. Team */}
               <div className={styles.box_card} style={{ borderColor: '#E2E8F0' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}>Team</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                     <span style={{ fontSize: '48px', fontWeight: '900', color: '#0F172A' }}>$299</span>
                     <span style={{ color: '#64748B' }}>/mo</span>
                  </div>
                  <Link href="/contact" style={{ display: 'block', width: '100%', padding: '14px', textAlign: 'center', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#0F172A', fontWeight: '600', marginBottom: '32px' }}>
                     Contact Sales
                  </Link>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#475569' }}>
                     <li><i className="fa-solid fa-check me-2 text-dark"></i> 5 User Seats</li>
                     <li><i className="fa-solid fa-check me-2 text-dark"></i> API Access</li>
                     <li><i className="fa-solid fa-check me-2 text-dark"></i> Priority Support</li>
                  </ul>
               </div>

            </div>
         </div>
      </section>
   );
};

export default Pricing;