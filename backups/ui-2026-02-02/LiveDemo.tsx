"use client"
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

interface LiveLead {
   id: number;
   type: string;
   typeColor: string;
   typeCode: string;
   address: string;
   city: string;
   state: string;
   equity: number;
   time: string;
}

const mockLeads: LiveLead[] = [
   { id: 1, type: "Pre-Foreclosure", typeColor: "#EF4444", typeCode: "PFA", address: "1024 Elm St", city: "Austin", state: "TX", equity: 73, time: "2m ago" },
   { id: 2, type: "Probate Sale", typeColor: "#8B5CF6", typeCode: "PRO", address: "550 Maple Ave", city: "Dallas", state: "TX", equity: 81, time: "15m ago" },
   { id: 3, type: "Tax Default", typeColor: "#10B981", typeCode: "TAX", address: "880 Oak Ln", city: "Houston", state: "TX", equity: 92, time: "1h ago" },
   { id: 4, type: "Divorce Filing", typeColor: "#3B82F6", typeCode: "DIV", address: "2210 Pine Rd", city: "San Antonio", state: "TX", equity: 68, time: "2h ago" },
   { id: 5, type: "Auction", typeColor: "#F59E0B", typeCode: "AUC", address: "1556 Cedar Blvd", city: "Fort Worth", state: "TX", equity: 85, time: "3h ago" },
];

// Interactive Floating Particles Component
const FloatingParticles = () => {
   const canvasRef = useRef<HTMLCanvasElement>(null);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      interface Particle {
         x: number;
         y: number;
         vx: number;
         vy: number;
         radius: number;
         color: string;
         opacity: number;
      }

      const particles: Particle[] = [];
      const colors = ['#2563EB', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B'];
      
      // Create particles
      for (let i = 0; i < 40; i++) {
         particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.5 + 0.2
         });
      }

      let animationFrameId: number;
      let mouseX = -1000;
      let mouseY = -1000;

      const handleMouseMove = (e: MouseEvent) => {
         const rect = canvas.getBoundingClientRect();
         mouseX = e.clientX - rect.left;
         mouseY = e.clientY - rect.top;
      };

      canvas.addEventListener('mousemove', handleMouseMove);

      const animate = () => {
         ctx.clearRect(0, 0, canvas.width, canvas.height);

         particles.forEach((particle, i) => {
            // Mouse interaction - particles move away from cursor
            const dx = particle.x - mouseX;
            const dy = particle.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
               const force = (100 - dist) / 100;
               particle.vx += (dx / dist) * force * 0.2;
               particle.vy += (dy / dist) * force * 0.2;
            }

            // Apply velocity
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Damping
            particle.vx *= 0.98;
            particle.vy *= 0.98;

            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) {
               particle.vx *= -1;
               particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > canvas.height) {
               particle.vy *= -1;
               particle.y = Math.max(0, Math.min(canvas.height, particle.y));
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
               const other = particles[j];
               const dx2 = particle.x - other.x;
               const dy2 = particle.y - other.y;
               const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

               if (dist2 < 120) {
                  ctx.beginPath();
                  ctx.moveTo(particle.x, particle.y);
                  ctx.lineTo(other.x, other.y);
                  ctx.strokeStyle = particle.color + '15';
                  ctx.lineWidth = 1;
                  ctx.stroke();
               }
            }
         });

         animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
         canvas.removeEventListener('mousemove', handleMouseMove);
         cancelAnimationFrame(animationFrameId);
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
            pointerEvents: 'all'
         }}
      />
   );
};

const LiveDemo = ({ styles }: { styles: any }) => {
   const [leads, setLeads] = useState(mockLeads);
   const [newLeadIndex, setNewLeadIndex] = useState(0);
   const ref = useRef(null);
   const isInView = useInView(ref, { once: true, margin: "-100px" });

   useEffect(() => {
      const interval = setInterval(() => {
         // Simulate new lead arriving
         const nextLead = mockLeads[newLeadIndex % mockLeads.length];
         setLeads(prev => [{ ...nextLead, id: Date.now(), time: "Just now" }, ...prev.slice(0, 4)]);
         setNewLeadIndex(prev => prev + 1);
      }, 5000);

      return () => clearInterval(interval);
   }, [newLeadIndex]);

   return (
      <section 
         className={styles.section_pad} 
         id="demo"
         style={{ 
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
            position: 'relative',
            overflow: 'hidden'
         }}
         ref={ref}
      >
         {/* Interactive Floating Particles Background */}
         <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.6,
            pointerEvents: 'none'
         }}>
            <FloatingParticles />
         </div>

         <div className={styles.container} style={{ position: 'relative', zIndex: 1 }}>
            
            {/* Section Header */}
            <motion.div 
               style={{ 
                  textAlign: 'center', 
                  marginBottom: '60px',
                  maxWidth: '700px',
                  margin: '0 auto 60px'
               }}
               initial={{ opacity: 0, y: 20 }}
               animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
               transition={{ duration: 0.6 }}
            >
               <div style={{
                  display: 'inline-block',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  color: '#2563EB',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  background: 'rgba(37, 99, 235, 0.1)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: '1px solid rgba(37, 99, 235, 0.2)'
               }}>
                  LIVE DEMO
               </div>
               <h2 style={{ 
                  fontSize: 'clamp(36px, 5vw, 48px)', 
                  fontWeight: '800',
                  color: '#0F172A',
                  marginBottom: '16px',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.1'
               }}>
                  See Real Deals in<br />Real Time
               </h2>
               <p style={{ 
                  fontSize: 'clamp(16px, 2vw, 18px)', 
                  color: '#475569',
                  lineHeight: '1.6'
               }}>
                  Watch as new distressed properties flow into the terminal. Updated every 15 minutes from courthouse records.
               </p>
            </motion.div>

            {/* Live Terminal Feed */}
            <motion.div 
               style={{
                  background: 'white',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
                  maxWidth: '900px',
                  margin: '0 auto'
               }}
               initial={{ opacity: 0, y: 40 }}
               animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
               transition={{ duration: 0.6, delay: 0.3 }}
            >
               {/* Header */}
               <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 24px',
                  borderBottom: '1px solid #E2E8F0',
                  background: '#F8FAFC'
               }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#10B981',
                        display: 'inline-block',
                        animation: 'pulse 2s infinite',
                        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)'
                     }}></span>
                     <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#0F172A' 
                     }}>
                        Live Feed
                     </span>
                  </div>
                  <div style={{ 
                     fontSize: '13px', 
                     color: '#64748B',
                     fontWeight: '500'
                  }}>
                     {leads.length} recent leads
                  </div>
               </div>

               {/* Body */}
               <div style={{ padding: '16px' }}>
                  <AnimatePresence mode="popLayout">
                     {leads.map((lead, idx) => (
                        <motion.div
                           key={lead.id}
                           layout
                           initial={{ opacity: 0, x: -20, scale: 0.95 }}
                           animate={{ opacity: 1, x: 0, scale: 1 }}
                           exit={{ opacity: 0, x: 20, scale: 0.95 }}
                           transition={{ duration: 0.4 }}
                           style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              padding: '16px',
                              background: idx === 0 && lead.time === "Just now" ? 'rgba(37, 99, 235, 0.05)' : 'white',
                              border: `1px solid ${idx === 0 && lead.time === "Just now" ? 'rgba(37, 99, 235, 0.2)' : '#F1F5F9'}`,
                              borderRadius: '12px',
                              marginBottom: '12px',
                              cursor: 'pointer',
                              zIndex: leads.length - idx
                           }}
                           whileHover={{
                              scale: 1.02,
                              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                              transition: { duration: 0.2 }
                           }}
                        >
                           {/* Badge */}
                           <div style={{
                              background: `${lead.typeColor}15`,
                              color: lead.typeColor,
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '700',
                              fontFamily: 'monospace',
                              border: `1px solid ${lead.typeColor}30`,
                              minWidth: '48px',
                              textAlign: 'center'
                           }}>
                              {lead.typeCode}
                           </div>
                           
                           {/* Content */}
                           <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                 fontSize: '15px',
                                 fontWeight: '600',
                                 color: '#0F172A',
                                 marginBottom: '4px',
                                 overflow: 'hidden',
                                 textOverflow: 'ellipsis',
                                 whiteSpace: 'nowrap'
                              }}>
                                 {lead.address}, {lead.city}, {lead.state}
                              </div>
                              <div style={{ 
                                 display: 'flex', 
                                 alignItems: 'center', 
                                 gap: '8px',
                                 fontSize: '13px'
                              }}>
                                 <span style={{ 
                                    color: lead.equity > 75 ? '#10B981' : '#F59E0B',
                                    fontWeight: '600'
                                 }}>
                                    +{lead.equity}% Equity
                                 </span>
                                 <span style={{ color: '#CBD5E1' }}>•</span>
                                 <span style={{ color: '#64748B' }}>
                                    {lead.time}
                                 </span>
                              </div>
                           </div>
                           
                           {/* Actions */}
                           <div style={{ display: 'flex', gap: '8px' }}>
                              <motion.button 
                                 style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '8px',
                                    border: '1px solid #E2E8F0',
                                    background: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#64748B',
                                    fontSize: '14px'
                                 }}
                                 whileHover={{ 
                                    background: '#F8FAFC',
                                    borderColor: '#2563EB',
                                    color: '#2563EB',
                                    scale: 1.1
                                 }}
                                 whileTap={{ scale: 0.95 }}
                              >
                                 <i className="fa-regular fa-eye"></i>
                              </motion.button>
                              <motion.button 
                                 style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '8px',
                                    border: '1px solid #E2E8F0',
                                    background: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#64748B',
                                    fontSize: '14px'
                                 }}
                                 whileHover={{ 
                                    background: '#FEF2F2',
                                    borderColor: '#EF4444',
                                    color: '#EF4444',
                                    scale: 1.1
                                 }}
                                 whileTap={{ scale: 0.95 }}
                              >
                                 <i className="fa-regular fa-heart"></i>
                              </motion.button>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>

               {/* Footer */}
               <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 24px',
                  borderTop: '1px solid #E2E8F0',
                  background: '#F8FAFC'
               }}>
                  <span style={{ 
                     fontSize: '13px', 
                     color: '#64748B',
                     fontWeight: '500'
                  }}>
                     New leads arrive every 15 minutes
                  </span>
                  <motion.a 
                     href="/search"
                     style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none'
                     }}
                     whileHover={{ gap: '10px' }}
                     transition={{ duration: 0.2 }}
                  >
                     Start Searching 
                     <i className="fa-solid fa-arrow-right"></i>
                  </motion.a>
               </div>
            </motion.div>

         </div>

         {/* Pulse animation */}
         <style jsx>{`
            @keyframes pulse {
               0%, 100% {
                  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
               }
               50% {
                  box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
               }
            }
         `}</style>
      </section>
   );
};

export default LiveDemo;
