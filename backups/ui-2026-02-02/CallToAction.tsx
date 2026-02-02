"use client"
import Link from "next/link";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const CallToAction = ({ styles }: { styles: any }) => {
   const ref = useRef(null);
   const isInView = useInView(ref, { once: true, margin: "-100px" });

   return (
      <section 
         className={styles.section_pad} 
         style={{ 
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #1E40AF 100%)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
         }}
         ref={ref}
      >
         {/* Animated background pattern */}
         <div 
            style={{
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               opacity: 0.1,
               backgroundImage: `
                  radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)
               `
            }}
         />
         
         {/* Subtle grid pattern */}
         <div 
            style={{
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
               `,
               backgroundSize: '60px 60px'
            }}
         />

         <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <motion.h2 
               style={{ 
                  fontSize: 'clamp(36px, 5vw, 48px)', 
                  fontWeight: '900', 
                  color: 'white', 
                  marginBottom: '24px',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.1'
               }}
               initial={{ opacity: 0, y: 30 }}
               animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
               transition={{ duration: 0.6 }}
            >
               Ready to find your next deal?
            </motion.h2>
            
            <motion.p 
               style={{ 
                  fontSize: 'clamp(18px, 2vw, 20px)', 
                  color: 'rgba(255,255,255,0.95)', 
                  maxWidth: '600px', 
                  margin: '0 auto 40px auto',
                  lineHeight: '1.6',
                  fontWeight: '400'
               }}
               initial={{ opacity: 0, y: 20 }}
               animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
               transition={{ duration: 0.6, delay: 0.2 }}
            >
               Join 15,000+ investors using 99Sellers to find off-market opportunities before they hit the MLS.
            </motion.p>
            
            {/* Trust indicators */}
            <motion.div
               style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '32px',
                  marginBottom: '40px',
                  flexWrap: 'wrap'
               }}
               initial={{ opacity: 0 }}
               animate={isInView ? { opacity: 1 } : { opacity: 0 }}
               transition={{ duration: 0.6, delay: 0.3 }}
            >
               {[
                  { icon: 'fa-chart-line', text: '15K+ Users' },
                  { icon: 'fa-database', text: '1M+ Leads' },
                  { icon: 'fa-clock', text: 'Daily Updates' }
               ].map((item, i) => (
                  <motion.div
                     key={i}
                     style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                        fontWeight: '600'
                     }}
                     initial={{ opacity: 0, y: 10 }}
                     animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                     transition={{ duration: 0.4, delay: 0.4 + (i * 0.1) }}
                  >
                     <div
                        style={{
                           width: 36,
                           height: 36,
                           borderRadius: '50%',
                           background: 'rgba(255, 255, 255, 0.15)',
                           backdropFilter: 'blur(8px)',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                     >
                        <i className={`fa-solid ${item.icon}`} style={{ fontSize: '14px', color: 'white' }}></i>
                     </div>
                     <span>{item.text}</span>
                  </motion.div>
               ))}
            </motion.div>
            
            {/* CTA Button */}
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
               transition={{ duration: 0.6, delay: 0.5 }}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.98 }}
            >
               <Link 
                  href="/search" 
                  className="cta-button"
                  style={{
                     display: 'inline-block',
                     padding: '18px 48px',
                     fontSize: '18px',
                     fontWeight: '700',
                     background: 'white',
                     color: '#2563EB',
                     borderRadius: '12px',
                     boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                     transition: 'all 0.3s',
                     border: 'none',
                     letterSpacing: '-0.01em'
                  }}
               >
                  Launch Dashboard
                  <motion.span
                     style={{ display: 'inline-block', marginLeft: '8px' }}
                     animate={{ x: [0, 4, 0] }}
                     transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                     →
                  </motion.span>
               </Link>
            </motion.div>

            {/* Fine print */}
            <motion.p
               style={{
                  marginTop: '24px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: '400'
               }}
               initial={{ opacity: 0 }}
               animate={isInView ? { opacity: 1 } : { opacity: 0 }}
               transition={{ duration: 0.6, delay: 0.7 }}
            >
               7-day free trial • No credit card required • Cancel anytime
            </motion.p>
         </div>

         {/* Button hover styles */}
         <style jsx global>{`
            .cta-button:hover {
               box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4) !important;
               transform: translateY(-2px) !important;
               background: #F8FAFC !important;
            }
         `}</style>
      </section>
   );
};

export default CallToAction;
