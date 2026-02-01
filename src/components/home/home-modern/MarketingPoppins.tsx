"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MarketingPoppins = ({ styles }: { styles: any }) => {
   const [isVisible, setIsVisible] = useState(false);

   useEffect(() => {
      // Show "Poppin" after 4 seconds
      const timer = setTimeout(() => setIsVisible(true), 4000);
      return () => clearTimeout(timer);
   }, []);

   return (
      <AnimatePresence>
         {isVisible && (
            <motion.div 
               className={styles.poppin_modal}
               initial={{ y: 50, opacity: 0, scale: 0.95 }}
               animate={{ y: 0, opacity: 1, scale: 1 }}
               exit={{ y: 50, opacity: 0, scale: 0.95 }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 'bold', color: '#2563EB', textTransform: 'uppercase' }}>
                     🔥 Opportunity
                  </div>
                  <button onClick={() => setIsVisible(false)} style={{ color: '#94A3B8', cursor: 'pointer' }}>✕</button>
               </div>
               
               <h4 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#0F172A' }}>
                  Unlock Owner Phones?
               </h4>
               <p style={{ fontSize: 14, color: '#475569', marginBottom: 20 }}>
                  Stop guessing. Get direct mobile numbers for this lead list now.
               </p>

               <button style={{ width: '100%', padding: '12px', background: '#2563EB', color: 'white', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>
                  Start Free Trial
               </button>
            </motion.div>
         )}
      </AnimatePresence>
   );
};

export default MarketingPoppins;