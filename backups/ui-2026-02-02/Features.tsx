"use client"
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Features = ({ styles }: { styles: any }) => {
   const ref = useRef(null);
   const isInView = useInView(ref, { once: true, margin: "-100px" });

   // Fixed: Removed ease from variants, will use in direct transitions
   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
         }
      }
   };

   const itemVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: {
         opacity: 1,
         y: 0,
         transition: {
            duration: 0.6
         }
      }
   };

   return (
      <section className={styles.section_pad} style={{ background: '#FFFFFF' }} ref={ref}>
         <div className={styles.container}>
            
            {/* Section Header */}
            <motion.div 
               className={styles.mb_48} 
               style={{ maxWidth: '700px' }}
               initial={{ opacity: 0, y: 20 }}
               animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
            >
               <h2 style={{ 
                  fontSize: 'clamp(36px, 5vw, 48px)', 
                  fontWeight: '800', 
                  marginBottom: '16px',
                  letterSpacing: '-0.02em'
               }}>
                  The Deal Terminal.
               </h2>
               <p style={{ fontSize: 'clamp(18px, 2vw, 20px)', color: '#475569', lineHeight: '1.6' }}>
                  We replaced the manual grunt work with a 
                  <span style={{ color: '#0F172A', fontWeight: '700' }}> high-speed auction database</span>.
               </p>
            </motion.div>

            {/* THE COMMAND CENTER GRID */}
            <motion.div 
               className={styles.bento_grid}
               variants={containerVariants}
               initial="hidden"
               animate={isInView ? "visible" : "hidden"}
            >
               
               {/* 1. FILTERING */}
               <motion.div 
                  className={styles.box_card} 
                  style={{ gridColumn: 'span 2', position: 'relative', overflow: 'hidden' }}
                  variants={itemVariants}
                  whileHover={{ 
                     y: -4, 
                     transition: { duration: 0.3, ease: "easeOut" }
                  }}
               >
                  {/* Gradient overlay on hover */}
                  <motion.div
                     style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #2563EB, #3B82F6)',
                        transformOrigin: 'left',
                        scaleX: 0
                     }}
                     whileHover={{ scaleX: 1 }}
                     transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  
                  <div className={styles.mb_24}>
                     <div 
                        className={styles.badge_pill} 
                        style={{ 
                           background: 'rgba(37, 99, 235, 0.1)', 
                           color: '#2563EB',
                           border: '1px solid rgba(37, 99, 235, 0.2)',
                           backdropFilter: 'blur(8px)'
                        }}
                     >
                        Step 1: Discovery
                     </div>
                     <h3 style={{ 
                        fontSize: 'clamp(24px, 3vw, 28px)', 
                        fontWeight: 'bold', 
                        marginBottom: '12px',
                        marginTop: '16px'
                     }}>
                        Granular Filtering
                     </h3>
                     <p style={{ maxWidth: '500px', color: '#64748B', lineHeight: '1.6' }}>
                        Drill down by <strong style={{ color: '#0F172A' }}>State → County → City</strong>. 
                        Filter specifically for Auction Dates, Unpaid Tax Amounts, or Divorce Filing Dates.
                     </p>
                  </div>

                  {/* Visual: Manual Filters */}
                  <div style={{ 
                     background: '#F8FAFC', 
                     border: '1px solid #E2E8F0', 
                     borderRadius: '12px', 
                     padding: '24px', 
                     display: 'flex', 
                     gap: '12px', 
                     flexWrap: 'wrap' 
                  }}>
                     {[
                        { label: 'State', value: 'Texas' },
                        { label: 'Type', value: 'Foreclosure' },
                        { label: 'Equity', value: '> 30%' }
                     ].map((filter, i) => (
                        <motion.div 
                           key={i}
                           style={{ 
                              background: 'white', 
                              border: '1px solid #CBD5E1', 
                              padding: '10px 18px', 
                              borderRadius: '8px', 
                              fontSize: '14px', 
                              fontWeight: '600', 
                              color: '#0F172A', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              cursor: 'pointer'
                           }}
                           whileHover={{ 
                              scale: 1.05, 
                              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                              borderColor: '#2563EB',
                              transition: { duration: 0.2 }
                           }}
                           whileTap={{ scale: 0.98 }}
                        >
                           <span style={{ color: '#94A3B8' }}>{filter.label}:</span> 
                           {filter.value} 
                           <i className="fa-solid fa-chevron-down" style={{ fontSize: 10, color: '#94A3B8' }}></i>
                        </motion.div>
                     ))}
                  </div>
               </motion.div>

               {/* 2. EQUITY CALCULATOR */}
               <motion.div 
                  className={styles.box_card}
                  variants={itemVariants}
                  style={{ position: 'relative', overflow: 'hidden' }}
                  whileHover={{ 
                     y: -4,
                     transition: { duration: 0.3, ease: "easeOut" }
                  }}
               >
                  {/* Gradient overlay */}
                  <motion.div
                     style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #10B981, #34D399)',
                        transformOrigin: 'left',
                        scaleX: 0
                     }}
                     whileHover={{ scaleX: 1 }}
                     transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  
                  <div className={styles.badge_pill} style={{ 
                     background: 'rgba(16, 185, 129, 0.1)', 
                     color: '#10B981',
                     border: '1px solid rgba(16, 185, 129, 0.2)',
                     backdropFilter: 'blur(8px)'
                  }}>
                     Step 2: Analysis
                  </div>
                  <h3 style={{ 
                     fontSize: 'clamp(20px, 2.5vw, 24px)', 
                     fontWeight: 'bold', 
                     marginBottom: '12px',
                     marginTop: '16px'
                  }}>
                     Equity Calculator
                  </h3>
                  <p style={{ marginBottom: '24px', fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>
                     We subtract total debt from estimated value.
                  </p>
                  
                  <div style={{ 
                     marginTop: 'auto',
                     background: 'rgba(16, 185, 129, 0.03)',
                     padding: '20px',
                     borderRadius: '12px',
                     border: '1px solid rgba(16, 185, 129, 0.1)'
                  }}>
                     <motion.div 
                        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                     >
                        <span className={styles.stat_label} style={{ color: '#64748B', fontSize: '14px' }}>Market Value</span>
                        <span className={styles.font_mono} style={{ fontWeight: '600', fontSize: '16px' }}>$450,000</span>
                     </motion.div>
                     <motion.div 
                        style={{ 
                           display: 'flex', 
                           justifyContent: 'space-between', 
                           marginBottom: '16px', 
                           borderBottom: '1px dashed #CBD5E1', 
                           paddingBottom: '16px' 
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                     >
                        <span className={styles.stat_label} style={{ color: '#64748B', fontSize: '14px' }}>Total Debt</span>
                        <span className={styles.font_mono} style={{ color: '#EF4444', fontWeight: '600', fontSize: '16px' }}>-$120,000</span>
                     </motion.div>
                     <motion.div 
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                     >
                        <span style={{ 
                           color: '#10B981', 
                           fontWeight: '700', 
                           fontSize: '12px',
                           letterSpacing: '0.05em'
                        }}>
                           GROSS EQUITY
                        </span>
                        <span style={{ 
                           color: '#10B981', 
                           fontSize: 'clamp(28px, 4vw, 36px)', 
                           fontWeight: '900',
                           fontFamily: 'monospace'
                        }}>
                           $330k
                        </span>
                     </motion.div>
                  </div>
               </motion.div>

               {/* 3. OWNER LOOKUP */}
               <motion.div 
                  className={styles.box_card}
                  variants={itemVariants}
                  style={{ position: 'relative', overflow: 'hidden' }}
                  whileHover={{ 
                     y: -4,
                     transition: { duration: 0.3, ease: "easeOut" }
                  }}
               >
                  {/* Gradient overlay */}
                  <motion.div
                     style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #EF4444, #F87171)',
                        transformOrigin: 'left',
                        scaleX: 0
                     }}
                     whileHover={{ scaleX: 1 }}
                     transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  
                  <div className={styles.badge_pill} style={{ 
                     background: 'rgba(239, 68, 68, 0.1)', 
                     color: '#EF4444',
                     border: '1px solid rgba(239, 68, 68, 0.2)',
                     backdropFilter: 'blur(8px)'
                  }}>
                     Step 3: Contact
                  </div>
                  <h3 style={{ 
                     fontSize: 'clamp(20px, 2.5vw, 24px)', 
                     fontWeight: 'bold', 
                     marginBottom: '12px',
                     marginTop: '16px'
                  }}>
                     Owner Lookup
                  </h3>
                  <p style={{ marginBottom: '24px', fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>
                     Get verified phone numbers.
                  </p>
                  
                  <motion.div 
                     style={{ 
                        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', 
                        borderRadius: '12px', 
                        padding: '24px', 
                        marginTop: '24px', 
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                     }}
                     whileHover={{ 
                        scale: 1.02,
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                        transition: { duration: 0.3 }
                     }}
                  >
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ 
                           width: 40, 
                           height: 40, 
                           borderRadius: '50%', 
                           background: 'rgba(255, 255, 255, 0.1)', 
                           display: 'flex', 
                           alignItems: 'center', 
                           justifyContent: 'center',
                           border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                           <i className="fa-solid fa-user" style={{ fontSize: '14px', color: '#94A3B8' }}></i>
                        </div>
                        <div>
                           <div style={{ fontSize: '16px', fontWeight: 'bold' }}>John Doe</div>
                           <div style={{ fontSize: '13px', opacity: 0.7, color: '#94A3B8' }}>Homeowner</div>
                        </div>
                     </div>
                     
                     <motion.div 
                        style={{ 
                           display: 'flex', 
                           alignItems: 'center', 
                           gap: '12px', 
                           background: 'rgba(16, 185, 129, 0.1)', 
                           padding: '12px 16px', 
                           borderRadius: '8px',
                           border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}
                        whileHover={{ 
                           background: 'rgba(16, 185, 129, 0.15)',
                           transition: { duration: 0.2 }
                        }}
                     >
                        <i className="fa-solid fa-phone" style={{ color: '#10B981', fontSize: '14px' }}></i>
                        <span className={styles.font_mono} style={{ fontSize: '15px', fontWeight: '600' }}>
                           (512) 555-0199
                        </span>
                     </motion.div>
                  </motion.div>
               </motion.div>

               {/* 4. LEAD STACKING */}
               <motion.div 
                  className={styles.box_card} 
                  style={{ gridColumn: 'span 2', position: 'relative', overflow: 'hidden' }}
                  variants={itemVariants}
                  whileHover={{ 
                     y: -4,
                     transition: { duration: 0.3, ease: "easeOut" }
                  }}
               >
                  {/* Gradient overlay */}
                  <motion.div
                     style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #F97316, #FB923C)',
                        transformOrigin: 'left',
                        scaleX: 0
                     }}
                     whileHover={{ scaleX: 1 }}
                     transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  
                  <div className={styles.mb_24}>
                     <div className={styles.badge_pill} style={{ 
                        background: 'rgba(249, 115, 22, 0.1)', 
                        color: '#F97316',
                        border: '1px solid rgba(249, 115, 22, 0.2)',
                        backdropFilter: 'blur(8px)'
                     }}>
                        Step 4: Targeting
                     </div>
                     <h3 style={{ 
                        fontSize: 'clamp(24px, 3vw, 28px)', 
                        fontWeight: 'bold', 
                        marginBottom: '12px',
                        marginTop: '16px'
                     }}>
                        Lead Stacking
                     </h3>
                     <p style={{ color: '#64748B', lineHeight: '1.6' }}>
                        Layer multiple distress signals to find highly motivated sellers. 
                        (e.g. <strong style={{ color: '#0F172A' }}>Divorce + Tax Delinquent</strong>).
                     </p>
                  </div>

                  {/* Visual: Tag Cloud */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                     {[
                        { label: 'Absentee Owner', icon: 'fa-plane', color: '#3B82F6' },
                        { label: 'Tax Delinquent', icon: 'fa-file-invoice-dollar', color: '#EF4444' },
                        { label: 'Vacant', icon: 'fa-ghost', color: '#8B5CF6' },
                        { label: 'Probate', icon: 'fa-scroll', color: '#F59E0B' }
                     ].map((tag, i) => (
                        <motion.div 
                           key={i} 
                           style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '10px', 
                              padding: '12px 20px', 
                              border: `1px solid ${tag.color}20`, 
                              borderRadius: '8px',
                              background: `${tag.color}08`,
                              fontWeight: '600',
                              color: '#475569',
                              cursor: 'pointer',
                              position: 'relative',
                              overflow: 'hidden'
                           }}
                           whileHover={{ 
                              scale: 1.05,
                              borderColor: tag.color,
                              backgroundColor: `${tag.color}15`,
                              boxShadow: `0 4px 12px ${tag.color}20`,
                              transition: { duration: 0.2 }
                           }}
                           whileTap={{ scale: 0.98 }}
                           initial={{ opacity: 0, y: 20 }}
                           animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                           transition={{ delay: 0.7 + (i * 0.1), duration: 0.4 }}
                        >
                           <i className={`fa-solid ${tag.icon}`} style={{ color: tag.color, fontSize: '14px' }}></i>
                           <span style={{ fontSize: '15px' }}>{tag.label}</span>
                        </motion.div>
                     ))}
                  </div>
               </motion.div>

            </motion.div>
         </div>
      </section>
   );
};

export default Features;
