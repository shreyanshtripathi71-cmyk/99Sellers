"use client"
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";

const items = [
   { label: "Foreclosure Auctions", color: "#EF4444" },
   { label: "Probate Filings", color: "#6366F1" },
   { label: "Divorce Decrees", color: "#3B82F6" },
   { label: "Tax Defaults", color: "#10B981" }
];

// Interactive Network Nodes - represents data connections
const NetworkBackground = () => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const [nodes, setNodes] = useState<Array<{x: number, y: number, vx: number, vy: number}>>([]);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      const updateSize = () => {
         canvas.width = canvas.offsetWidth;
         canvas.height = canvas.offsetHeight;
      };
      updateSize();
      window.addEventListener('resize', updateSize);

      // Create nodes
      const nodeCount = 25;
      const initialNodes = Array.from({ length: nodeCount }, () => ({
         x: Math.random() * canvas.width,
         y: Math.random() * canvas.height,
         vx: (Math.random() - 0.5) * 0.3,
         vy: (Math.random() - 0.5) * 0.3
      }));
      setNodes(initialNodes);

      // Animation loop
      let animationId: number;
      const animate = () => {
         ctx.clearRect(0, 0, canvas.width, canvas.height);

         // Update and draw nodes
         initialNodes.forEach((node, i) => {
            // Move nodes
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
            ctx.fill();

            // Draw connections
            initialNodes.forEach((otherNode, j) => {
               if (i === j) return;
               const dx = node.x - otherNode.x;
               const dy = node.y - otherNode.y;
               const distance = Math.sqrt(dx * dx + dy * dy);

               if (distance < 150) {
                  ctx.beginPath();
                  ctx.moveTo(node.x, node.y);
                  ctx.lineTo(otherNode.x, otherNode.y);
                  ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - distance / 150)})`;
                  ctx.lineWidth = 0.5;
                  ctx.stroke();
               }
            });
         });

         animationId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
         cancelAnimationFrame(animationId);
         window.removeEventListener('resize', updateSize);
      };
   }, []);

   return (
      <canvas
         ref={canvasRef}
         style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.4
         }}
      />
   );
};

const Hero = ({ styles }: { styles: any }) => {
   const [index, setIndex] = useState(0);
   const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
   const [isHovering, setIsHovering] = useState(false);
   const sectionRef = useRef(null);
   const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

   // Ticker Logic
   useEffect(() => {
      const timer = setInterval(() => {
         setIndex((prev) => (prev + 1) % items.length);
      }, 3000);
      return () => clearInterval(timer);
   }, []);

   // Track cursor for magnetic effect
   const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
   };

   return (
      <section 
         ref={sectionRef}
         className={styles.section_pad} 
         onMouseMove={handleMouseMove}
         style={{
            paddingTop: '180px', 
            position: 'relative', 
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)'
         }}
      >
         {/* Interactive Network Background */}
         <NetworkBackground />

         {/* Subtle gradient overlay */}
         <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
            pointerEvents: 'none'
         }} />

         <div className={styles.container} style={{position: 'relative', zIndex: 10}}>
            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
               
               {/* Badge - Refined */}
               <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={styles.badge_pill}
                  style={{
                     background: 'rgba(16, 185, 129, 0.08)',
                     border: '1px solid rgba(16, 185, 129, 0.2)',
                     backdropFilter: 'blur(10px)'
                  }}
               >
                  <motion.span 
                     style={{
                        width: 6, 
                        height: 6, 
                        background: '#10B981', 
                        borderRadius: '50%', 
                        marginRight: 8,
                        display: 'inline-block',
                        boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)'
                     }}
                     animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.7, 1]
                     }}
                     transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                     }}
                  />
                  <span style={{fontSize: '13px', fontWeight: '600', letterSpacing: '0.02em'}}>
                     Live Data • Updated Every 15min
                  </span>
               </motion.div>

               {/* Headline - Premium Typography */}
               <motion.h1 
                  className={styles.hero_title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                     fontSize: 'clamp(48px, 6vw, 80px)',
                     fontWeight: '800',
                     lineHeight: '1.1',
                     letterSpacing: '-0.04em',
                     marginBottom: '24px'
                  }}
               >
                  Direct Access to <br />
                  <span style={{ position: 'relative', display: 'inline-block' }}>
                     <AnimatePresence mode="wait">
                        <motion.span
                           key={index}
                           initial={{ y: 60, opacity: 0, filter: 'blur(8px)' }}
                           animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                           exit={{ y: -60, opacity: 0, filter: 'blur(8px)' }}
                           transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                           style={{ 
                              color: items[index].color,
                              display: 'inline-block',
                              position: 'relative'
                           }}
                        >
                           {items[index].label}
                           {/* Subtle underline */}
                           <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              exit={{ scaleX: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              style={{
                                 position: 'absolute',
                                 bottom: '-8px',
                                 left: 0,
                                 right: 0,
                                 height: '3px',
                                 background: `linear-gradient(90deg, transparent, ${items[index].color}, transparent)`,
                                 transformOrigin: 'left'
                              }}
                           />
                        </motion.span>
                     </AnimatePresence>
                  </span>
               </motion.h1>

               {/* Description */}
               <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ 
                     fontSize: 'clamp(18px, 2vw, 22px)', 
                     color: '#64748B', 
                     marginBottom: '48px',
                     lineHeight: '1.7',
                     fontWeight: '400',
                     maxWidth: '700px',
                     margin: '0 auto 48px'
                  }}
               >
                  Stop waiting for the MLS. We aggregate <strong style={{color: '#0F172A', fontWeight: '600'}}>150M+ raw county records</strong> so you can find motivated sellers instantly.
               </motion.p>

               {/* CTA Buttons with Magnetic Effect */}
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ 
                     display: 'flex', 
                     justifyContent: 'center', 
                     gap: '16px',
                     flexWrap: 'wrap',
                     marginBottom: '64px'
                  }}
               >
                  <motion.div
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                  >
                     <Link 
                        href="/search" 
                        className={styles.btn_titan}
                        style={{
                           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
                           transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                        onMouseEnter={(e) => {
                           e.currentTarget.style.boxShadow = '0 8px 30px rgba(15, 23, 42, 0.2)';
                           e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                           e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
                           e.currentTarget.style.transform = 'translateY(0)';
                        }}
                     >
                        Browse Auction List
                     </Link>
                  </motion.div>
                  
                  <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     style={{ 
                        padding: '18px 36px', 
                        fontWeight: '600', 
                        color: '#475569', 
                        border: '1.5px solid #E2E8F0', 
                        borderRadius: '8px', 
                        background: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                        fontSize: '16px'
                     }}
                     onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#3B82F6';
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                     }}
                     onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.color = '#475569';
                        e.currentTarget.style.transform = 'translateY(0)';
                     }}
                  >
                     View Sample Data
                  </motion.button>
               </motion.div>
            </div>

            {/* Premium Data Table Mockup */}
            <motion.div 
               initial={{ opacity: 0, y: 80 }}
               animate={isInView ? { opacity: 1, y: 0 } : {}}
               transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
               style={{ 
                  marginTop: '80px',
                  maxWidth: '1100px',
                  margin: '80px auto 0'
               }}
            >
               <div style={{
                  borderRadius: '16px',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  boxShadow: '0 20px 70px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  background: 'white',
                  backdropFilter: 'blur(20px)'
               }}>
                  {/* Browser chrome */}
                  <div style={{ 
                     background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
                     borderBottom: '1px solid #E2E8F0', 
                     padding: '16px 24px', 
                     display: 'flex', 
                     alignItems: 'center',
                     gap: '8px' 
                  }}>
                     <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
                     <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
                     <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }} />
                     <div style={{ 
                        marginLeft: '16px', 
                        fontSize: '13px', 
                        color: '#64748B',
                        fontFamily: 'monospace'
                     }}>
                        99sellers.com/dashboard
                     </div>
                  </div>

                  {/* Table */}
                  <div style={{ padding: '0', background: 'white' }}>
                     {/* Header */}
                     <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '2.5fr 1fr 1fr 1fr', 
                        padding: '20px 32px', 
                        borderBottom: '1px solid #F1F5F9', 
                        background: '#FAFBFC',
                        fontSize: '12px', 
                        fontWeight: '700', 
                        color: '#64748B', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                     }}>
                        <div>Property Address</div>
                        <div>Distress Type</div>
                        <div>Auction Date</div>
                        <div style={{textAlign: 'right'}}>Debt Amount</div>
                     </div>

                     {/* Rows */}
                     {[
                        { addr: "1024 Elm St, Austin TX", type: "Foreclosure", date: "Feb 14, 2026", debt: "$124,500", color: "#EF4444", delay: 0.1 },
                        { addr: "550 Maple Ave, Dallas TX", type: "Probate", date: "Pending", debt: "$0", color: "#6366F1", delay: 0.2 },
                        { addr: "880 Oak Ln, Houston TX", type: "Divorce", date: "Mar 01, 2026", debt: "$210,000", color: "#3B82F6", delay: 0.3 },
                     ].map((row, i) => (
                        <motion.div 
                           key={i}
                           initial={{ opacity: 0, x: -30 }}
                           animate={isInView ? { opacity: 1, x: 0 } : {}}
                           transition={{ duration: 0.6, delay: 0.9 + row.delay, ease: [0.22, 1, 0.36, 1] }}
                           style={{ 
                              display: 'grid', 
                              gridTemplateColumns: '2.5fr 1fr 1fr 1fr', 
                              padding: '24px 32px', 
                              borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none',
                              alignItems: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                           }}
                           whileHover={{
                              backgroundColor: '#FAFBFC',
                              x: 4
                           }}
                        >
                           <div style={{ fontWeight: '600', color: '#0F172A', fontSize: '15px' }}>
                              {row.addr}
                           </div>
                           <div>
                              <span style={{ 
                                 fontSize: '13px', 
                                 padding: '6px 12px', 
                                 background: `${row.color}10`, 
                                 color: row.color,
                                 borderRadius: '6px', 
                                 fontWeight: '600',
                                 border: `1px solid ${row.color}20`
                              }}>
                                 {row.type}
                              </span>
                           </div>
                           <div style={{ fontSize: '14px', color: '#64748B', fontWeight: '500' }}>
                              {row.date}
                           </div>
                           <div style={{ 
                              textAlign: 'right', 
                              fontFamily: 'monospace', 
                              fontWeight: '700', 
                              color: '#0F172A',
                              fontSize: '15px'
                           }}>
                              {row.debt}
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </motion.div>
         </div>
      </section>
   );
};

export default Hero;
