"use client"
import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

const Pricing = ({ styles }: { styles: any }) => {
   const ref = useRef(null);
   const isInView = useInView(ref, { once: true, margin: "-100px" });

   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3
         }
      }
   };

   const cardVariants = {
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
      <section id="pricing" className={styles.section_pad} style={{ background: 'white' }} ref={ref}>
         <div className={styles.container}>
            <motion.div 
               className={styles.text_center} 
               style={{ marginBottom: '60px' }}
               initial={{ opacity: 0, y: 20 }}
               animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
               transition={{ duration: 0.6 }}
            >
               <h2 style={{ 
                  fontSize: 'clamp(36px, 5vw, 42px)', 
                  fontWeight: '800', 
                  marginBottom: '16px', 
                  color: '#0F172A',
                  letterSpacing: '-0.02em'
               }}>
                  Simple Pricing.
               </h2>
               <p style={{ 
                  fontSize: 'clamp(16px, 2vw, 18px)', 
                  color: '#475569',
                  lineHeight: '1.6'
               }}>
                  Start your 7-day free trial. Cancel anytime.
               </p>
            </motion.div>

            <motion.div 
               className={styles.bento_grid}
               variants={containerVariants}
               initial="hidden"
               animate={isInView ? "visible" : "hidden"}
            >
               
               {/* 1. Guest */}
               <motion.div 
                  className={styles.box_card} 
                  variants={cardVariants}
                  style={{ 
                     borderColor: '#E2E8F0',
                     position: 'relative',
                     overflow: 'hidden'
                  }}
                  whileHover={{ 
                     y: -6,
                     boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                     borderColor: '#CBD5E1',
                     transition: { duration: 0.3 }
                  }}
               >
                  <h3 style={{ 
                     fontSize: '18px', 
                     fontWeight: 'bold', 
                     color: '#0F172A', 
                     marginBottom: '8px',
                     letterSpacing: '-0.01em'
                  }}>
                     Guest
                  </h3>
                  <div style={{ 
                     display: 'flex', 
                     alignItems: 'baseline', 
                     gap: '6px', 
                     marginBottom: '24px' 
                  }}>
                     <span style={{ 
                        fontSize: 'clamp(40px, 5vw, 48px)', 
                        fontWeight: '900', 
                        color: '#0F172A',
                        letterSpacing: '-0.02em'
                     }}>
                        $0
                     </span>
                     <span style={{ color: '#64748B', fontSize: '16px', fontWeight: '500' }}>/mo</span>
                  </div>
                  <motion.div
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                  >
                     <Link 
                        href="/search" 
                        style={{ 
                           display: 'block', 
                           width: '100%', 
                           padding: '14px', 
                           textAlign: 'center', 
                           borderRadius: '10px', 
                           border: '1px solid #E2E8F0', 
                           color: '#0F172A', 
                           fontWeight: '600', 
                           marginBottom: '32px',
                           transition: 'all 0.3s'
                        }}
                        className="pricing-btn-guest"
                     >
                        Browse Leads
                     </Link>
                  </motion.div>
                  <ul style={{ 
                     display: 'flex', 
                     flexDirection: 'column', 
                     gap: '16px', 
                     color: '#475569' 
                  }}>
                     <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                     >
                        <i className="fa-solid fa-check" style={{ color: '#10B981' }}></i> 
                        <span>Nationwide Search</span>
                     </motion.li>
                     <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                     >
                        <i className="fa-solid fa-check" style={{ color: '#10B981' }}></i> 
                        <span>Basic Filters</span>
                     </motion.li>
                     <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        style={{ 
                           opacity: 0.5, 
                           textDecoration: 'line-through',
                           display: 'flex', 
                           alignItems: 'center', 
                           gap: '8px'
                        }}
                     >
                        <i className="fa-solid fa-xmark" style={{ color: '#EF4444' }}></i>
                        <span>Owner Phone Numbers</span>
                     </motion.li>
                  </ul>
               </motion.div>

               {/* 2. Pro Investor (Highlighted) */}
               <motion.div 
                  className={styles.box_card} 
                  variants={cardVariants}
                  style={{ 
                     border: '2px solid #2563EB', 
                     background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
                     position: 'relative',
                     overflow: 'visible'
                  }}
                  whileHover={{ 
                     y: -8,
                     boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)',
                     scale: 1.02,
                     transition: { duration: 0.3 }
                  }}
               >
                  {/* Popular Badge */}
                  <motion.div 
                     style={{ 
                        position: 'absolute', 
                        top: -12, 
                        right: 24, 
                        background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)', 
                        color: 'white', 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        padding: '8px 16px', 
                        borderRadius: '20px',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                        letterSpacing: '0.05em'
                     }}
                     initial={{ opacity: 0, y: -10 }}
                     animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                     transition={{ delay: 0.6, duration: 0.5 }}
                  >
                     ⭐ POPULAR
                  </motion.div>
                  
                  <h3 style={{ 
                     fontSize: '18px', 
                     fontWeight: 'bold', 
                     color: '#2563EB', 
                     marginBottom: '8px',
                     marginTop: '12px',
                     letterSpacing: '-0.01em'
                  }}>
                     Pro Investor
                  </h3>
                  <div style={{ 
                     display: 'flex', 
                     alignItems: 'baseline', 
                     gap: '6px', 
                     marginBottom: '24px' 
                  }}>
                     <span style={{ 
                        fontSize: 'clamp(40px, 5vw, 48px)', 
                        fontWeight: '900', 
                        color: '#0F172A',
                        letterSpacing: '-0.02em'
                     }}>
                        $99
                     </span>
                     <span style={{ color: '#64748B', fontSize: '16px', fontWeight: '500' }}>/mo</span>
                  </div>
                  <motion.div
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                  >
                     <Link 
                        href="/signup" 
                        style={{ 
                           display: 'block', 
                           width: '100%', 
                           padding: '14px', 
                           textAlign: 'center', 
                           borderRadius: '10px', 
                           background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)', 
                           color: 'white', 
                           fontWeight: '600', 
                           marginBottom: '32px',
                           boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                           transition: 'all 0.3s'
                        }}
                        className="pricing-btn-pro"
                     >
                        Start 7-Day Free Trial
                     </Link>
                  </motion.div>
                  <ul style={{ 
                     display: 'flex', 
                     flexDirection: 'column', 
                     gap: '16px', 
                     color: '#0F172A', 
                     fontWeight: '500' 
                  }}>
                     {[
                        { text: 'Unlimited Searches', bold: 'Unlimited' },
                        { text: 'Owner Phone & Email', bold: 'Owner Phone & Email' },
                        { text: 'Equity Calculator', bold: null },
                        { text: 'Daily "Fresh" Updates', bold: null }
                     ].map((item, i) => (
                        <motion.li 
                           key={i}
                           initial={{ opacity: 0, x: -10 }}
                           animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                           transition={{ delay: 0.7 + (i * 0.1), duration: 0.4 }}
                           style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                           <i className="fa-solid fa-check" style={{ color: '#2563EB' }}></i> 
                           <span>
                              {item.bold ? (
                                 <>
                                    <strong style={{ color: '#2563EB' }}>{item.bold}</strong>
                                    {item.text.replace(item.bold, '')}
                                 </>
                              ) : item.text}
                           </span>
                        </motion.li>
                     ))}
                  </ul>
               </motion.div>

               {/* 3. Team */}
               <motion.div 
                  className={styles.box_card} 
                  variants={cardVariants}
                  style={{ 
                     borderColor: '#E2E8F0',
                     position: 'relative',
                     overflow: 'hidden'
                  }}
                  whileHover={{ 
                     y: -6,
                     boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                     borderColor: '#CBD5E1',
                     transition: { duration: 0.3 }
                  }}
               >
                  <h3 style={{ 
                     fontSize: '18px', 
                     fontWeight: 'bold', 
                     color: '#0F172A', 
                     marginBottom: '8px',
                     letterSpacing: '-0.01em'
                  }}>
                     Team
                  </h3>
                  <div style={{ 
                     display: 'flex', 
                     alignItems: 'baseline', 
                     gap: '6px', 
                     marginBottom: '24px' 
                  }}>
                     <span style={{ 
                        fontSize: 'clamp(40px, 5vw, 48px)', 
                        fontWeight: '900', 
                        color: '#0F172A',
                        letterSpacing: '-0.02em'
                     }}>
                        $299
                     </span>
                     <span style={{ color: '#64748B', fontSize: '16px', fontWeight: '500' }}>/mo</span>
                  </div>
                  <motion.div
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                  >
                     <Link 
                        href="/contact" 
                        style={{ 
                           display: 'block', 
                           width: '100%', 
                           padding: '14px', 
                           textAlign: 'center', 
                           borderRadius: '10px', 
                           border: '1px solid #E2E8F0', 
                           color: '#0F172A', 
                           fontWeight: '600', 
                           marginBottom: '32px',
                           transition: 'all 0.3s'
                        }}
                        className="pricing-btn-team"
                     >
                        Contact Sales
                     </Link>
                  </motion.div>
                  <ul style={{ 
                     display: 'flex', 
                     flexDirection: 'column', 
                     gap: '16px', 
                     color: '#475569' 
                  }}>
                     {[
                        '5 User Seats',
                        'API Access',
                        'Priority Support'
                     ].map((item, i) => (
                        <motion.li 
                           key={i}
                           initial={{ opacity: 0, x: -10 }}
                           animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                           transition={{ delay: 0.8 + (i * 0.1), duration: 0.4 }}
                           style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                           <i className="fa-solid fa-check" style={{ color: '#10B981' }}></i> 
                           <span>{item}</span>
                        </motion.li>
                     ))}
                  </ul>
               </motion.div>

            </motion.div>
         </div>

         {/* Add hover styles */}
         <style jsx global>{`
            .pricing-btn-guest:hover {
               background: #F8FAFC !important;
               border-color: #2563EB !important;
               color: #2563EB !important;
            }
            .pricing-btn-pro:hover {
               box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4) !important;
               transform: translateY(-2px);
            }
            .pricing-btn-team:hover {
               background: #F8FAFC !important;
               border-color: #2563EB !important;
               color: #2563EB !important;
            }
         `}</style>
      </section>
   );
};

export default Pricing;
