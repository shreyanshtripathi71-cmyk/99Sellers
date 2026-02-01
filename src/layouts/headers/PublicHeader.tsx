"use client"
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const PublicHeader = () => {
   const [isScrolled, setIsScrolled] = useState(false);
   const { scrollY } = useScroll();

   useMotionValueEvent(scrollY, "change", (latest) => {
      setIsScrolled(latest > 20);
   });

   return (
      <motion.header 
         className="fixed-top w-100"
         animate={{
            padding: isScrolled ? '16px 0' : '24px 0',
            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0)',
            backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
            borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(0,0,0,0)',
         }}
         transition={{ duration: 0.3 }}
         style={{ zIndex: 1000 }}
      >
         <div className="container d-flex align-items-center justify-content-between">
            {/* Minimalist Logo */}
            <Link href="/" className="text-decoration-none">
               <h4 className="m-0 fw-bold text-dark" style={{fontSize: '20px', letterSpacing: '-0.5px'}}>
                  99Sellers.
               </h4>
            </Link>

            {/* Action Group */}
            <div className="d-flex align-items-center gap-3">
               <Link href="/login" className="fw-600 text-dark text-decoration-none fs-14 px-3" style={{opacity: 0.8}}>
                  Log in
               </Link>
               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/search" className="btn btn-dark rounded-pill fw-600 px-4 py-2 fs-14 shadow-lg border-0">
                     Start Free
                  </Link>
               </motion.div>
            </div>
         </div>
      </motion.header>
   );
};

export default PublicHeader;