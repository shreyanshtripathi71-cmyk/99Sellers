"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

const Hero = ({ styles }: { styles: any }) => {
   // --- Mouse Parallax Logic ---
   const ref = useRef(null);
   const mouseX = useMotionValue(0);
   const mouseY = useMotionValue(0);

   const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      let { left, top, width, height } = currentTarget.getBoundingClientRect();
      let x = (clientX - left) / width - 0.5;
      let y = (clientY - top) / height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
   };

   const xSpring = useSpring(mouseX, { stiffness: 50, damping: 15 });
   const ySpring = useSpring(mouseY, { stiffness: 50, damping: 15 });
   
   const rotateX = useTransform(ySpring, [-0.5, 0.5], ["7deg", "-7deg"]);
   const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

   return (
      <section 
         ref={ref}
         onMouseMove={handleMouseMove}
         className="position-relative pt-150 pb-100 lg-pt-120 overflow-hidden"
         style={{ perspective: '1200px' }} // Critical for 3D depth
      >
         <div className="container mt-5">
            <div className="row align-items-center">
               
               {/* --- LEFT: Text Content --- */}
               <div className="col-lg-6 mb-5 mb-lg-0">
                  <motion.div 
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                     <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="d-inline-flex align-items-center bg-blue-50 text-primary border border-blue-100 rounded-pill px-3 py-1 mb-4 fs-13 fw-bold"
                     >
                        <span className={`bg-primary rounded-circle me-2 ${styles.anim_pulse}`} style={{width:8, height:8}}></span>
                        v2.4 Live: New AI Scoring
                     </motion.span>

                     <h1 className="display-3 fw-900 text-dark mb-4 lh-sm tracking-tight">
                        Find Deals the <br/>
                        <span className={styles.text_gradient}>MLS Missed.</span>
                     </h1>
                     
                     <p className="fs-18 text-secondary mb-5 col-xl-10 lh-base">
                        Stop overpaying. Access 150M+ off-market records including <strong>Foreclosure, Divorce, and Tax Liens</strong> with instant equity analysis.
                     </p>

                     {/* Interactive Search Bar */}
                     <motion.div 
                        whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white p-2 rounded-pill shadow-lg border d-flex align-items-center mb-4" 
                        style={{maxWidth: '550px'}}
                     >
                        <div className="px-4 border-end">
                           <i className="fa-light fa-location-dot text-primary fs-5"></i>
                        </div>
                        <input type="text" className="form-control border-0 shadow-none fw-500 fs-16" placeholder="Enter City (e.g. Austin, TX)..." />
                        <Link href="/search" className={styles.btn_primary}>Search</Link>
                     </motion.div>

                     <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="fs-13 text-muted fw-600"
                     >
                        Trusted by 12,000+ Investors from <span className="text-dark">RE/MAX, Keller Williams, & Exp</span>.
                     </motion.p>
                  </motion.div>
               </div>

               {/* --- RIGHT: 3D Parallax Visual --- */}
               <div className="col-lg-6">
                  <motion.div 
                     style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                     className="position-relative ps-lg-5" 
                  >
                     {/* Background Glow */}
                     <div className="position-absolute top-50 start-50 translate-middle bg-primary opacity-20 rounded-circle" 
                          style={{width: '450px', height: '450px', filter: 'blur(80px)', zIndex: -1}}></div>

                     {/* Floating Card 1 (Back Layer) */}
                     <motion.div 
                        style={{ z: 20, x: useTransform(xSpring, [-0.5, 0.5], [-30, 30]), y: useTransform(ySpring, [-0.5, 0.5], [-30, 30]) }}
                        className={`position-absolute bg-white p-3 rounded-4 shadow border`} 
                        initial={{ opacity: 0, x: 100 }} animate={{ opacity: 0.9, x: 0 }} transition={{ delay: 0.5 }}
                     >
                        <div className="d-flex align-items-center gap-3">
                           <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center" style={{width:40, height:40}}>
                              <i className="fa-light fa-gavel"></i>
                           </div>
                           <div>
                              <div className="fw-bold text-dark fs-14">Tax Default</div>
                              <div className="text-muted fs-12">Houston, TX</div>
                           </div>
                        </div>
                     </motion.div>

                     {/* Floating Card 2 (Main Layer - High Z-Index) */}
                     <motion.div 
                        style={{ z: 100 }} // Pops out the most
                        className="bg-white p-4 rounded-4 shadow-lg border position-relative mx-auto" 
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
                     >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                           <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1">Pre-Foreclosure</span>
                           <i className="fa-solid fa-heart text-danger"></i>
                        </div>
                        <h4 className="fw-bold text-dark m-0">1234 Maple Ave</h4>
                        <p className="text-muted mb-4">Austin, TX 78701</p>
                        <div className="d-flex justify-content-between align-items-center bg-light rounded-3 p-3 mb-3 border">
                           <span className="text-secondary fw-bold fs-12 uppercase">Est. Equity</span>
                           <span className="text-success fw-900 fs-18">+$145,000</span>
                        </div>
                        <button className="btn btn-dark w-100 rounded-pill fw-600 fs-14">View Details</button>
                     </motion.div>

                     {/* Floating Card 3 (Front Layer) */}
                     <motion.div 
                        style={{ z: 60, x: useTransform(xSpring, [-0.5, 0.5], [30, -30]), y: useTransform(ySpring, [-0.5, 0.5], [30, -30]) }}
                        className={`position-absolute bg-white p-3 rounded-4 shadow border`} 
                        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                     >
                        <div className="d-flex align-items-center gap-3">
                           <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style={{width:40, height:40}}>
                              <i className="fa-light fa-sack-dollar"></i>
                           </div>
                           <div>
                              <div className="fw-bold text-dark fs-14">High Equity</div>
                              <div className="text-success fw-bold fs-12">+$82k Profit</div>
                           </div>
                        </div>
                     </motion.div>

                  </motion.div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default Hero;