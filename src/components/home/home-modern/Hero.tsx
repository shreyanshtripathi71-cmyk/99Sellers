"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const items = [
   { label: "Foreclosure Auctions", color: "#EF4444" }, // Red
   { label: "Probate Filings", color: "#6366F1" },      // Indigo
   { label: "Divorce Decrees", color: "#3B82F6" },      // Blue
   { label: "Tax Defaults", color: "#10B981" }          // Green
];

const Hero = ({ styles }: { styles: any }) => {
   const [index, setIndex] = useState(0);

   // Ticker Logic
   useEffect(() => {
      const timer = setInterval(() => {
         setIndex((prev) => (prev + 1) % items.length);
      }, 3000); 
      return () => clearInterval(timer);
   }, []);

   return (
      <section className={styles.section_pad} style={{paddingTop: '180px'}}>
         <div className={styles.container}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
               
               {/* Badge: Live Data Only (No AI) */}
               <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.badge_pill}
               >
                  <span style={{width: 8, height: 8, background: '#10B981', borderRadius: '50%', marginRight: 8}}></span>
                  Live: Daily Courthouse Updates
               </motion.div>

               {/* The Headline Slider */}
               <h1 className={styles.hero_title}>
                  Direct Access to <br />
                  <span style={{ display: 'inline-block', minWidth: '300px', position: 'relative' }}>
                     <AnimatePresence mode="wait">
                        <motion.span
                           key={index}
                           initial={{ y: 40, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           exit={{ y: -40, opacity: 0 }}
                           transition={{ duration: 0.5, ease: "easeOut" }}
                           style={{ color: items[index].color, display: 'inline-block' }}
                        >
                           {items[index].label}
                        </motion.span>
                     </AnimatePresence>
                  </span>
               </h1>

               <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.4 }}
                  style={{ fontSize: '20px', color: '#64748B', marginBottom: '40px' }}
               >
                  Stop waiting for the MLS. We aggregate <strong>150M+ raw county records</strong> so you can find motivated sellers instantly.
               </motion.p>

               <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.6 }}
                  style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}
               >
                  <Link href="/search" className={styles.btn_titan}>
                     Browse Auction List
                  </Link>
                  <button style={{ padding: '18px 36px', fontWeight: '600', color: '#475569', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white' }}>
                     View Sample Data
                  </button>
               </motion.div>
            </div>

            {/* Abstract Dashboard Visual (Raw Data Table) */}
            <motion.div 
               initial={{ opacity: 0, y: 60 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8, duration: 0.8 }}
               style={{ marginTop: '80px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', overflow: 'hidden' }}
            >
                {/* A fake browser window header */}
               <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '12px 20px', display: 'flex', gap: '8px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#CBD5E1' }}></div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#CBD5E1' }}></div>
               </div>
               {/* Data Table Representation */}
               <div style={{ padding: '0', background: 'white' }}>
                  {/* Table Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '16px 24px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '12px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' }}>
                     <div>Property Address</div>
                     <div>Distress Type</div>
                     <div>Auction Date</div>
                     <div style={{textAlign: 'right'}}>Debt Amount</div>
                  </div>
                  {/* Rows */}
                  {[
                     { addr: "1024 Elm St, Austin TX", type: "Foreclosure", date: "Feb 14, 2026", debt: "$124,500" },
                     { addr: "550 Maple Ave, Dallas TX", type: "Probate", date: "Pending", debt: "$0" },
                     { addr: "880 Oak Ln, Houston TX", type: "Divorce", date: "Mar 01, 2026", debt: "$210,000" },
                  ].map((row, i) => (
                     <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '20px 24px', borderBottom: '1px solid #F1F5F9', alignItems: 'center' }}>
                         <div style={{ fontWeight: '600', color: '#0F172A' }}>{row.addr}</div>
                         <div><span style={{ fontSize: '12px', padding: '4px 8px', background: '#F1F5F9', borderRadius: '4px', fontWeight: '600', color: '#475569' }}>{row.type}</span></div>
                         <div style={{ fontSize: '14px', color: '#64748B' }}>{row.date}</div>
                         <div style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: '600', color: '#EF4444' }}>{row.debt}</div>
                     </div>
                  ))}
               </div>
            </motion.div>
         </div>
      </section>
   );
};
export default Hero;