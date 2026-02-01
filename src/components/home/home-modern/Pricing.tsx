"use client"
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const Pricing = ({ styles }: { styles: any }) => {
   return (
      <div className="py-5 bg-black">
         <div className="container">
            <div className="text-center mb-5">
               <h2 className="fw-900 text-white display-5">Simple Pricing.</h2>
               <p className="fs-5 text-white-50">Start your 7-day free trial. Cancel anytime.</p>
            </div>

            <div className="row justify-content-center g-4 align-items-center">
               {/* Starter */}
               <div className="col-lg-4 col-md-6">
                  <motion.div 
                     whileHover={{ y: -5 }}
                     className={`h-100 rounded-4 p-5 text-center ${styles.bg_glass} ${styles.feature_card} border border-white border-opacity-10`}
                  >
                     <div className="fw-bold text-white-50 text-uppercase small mb-3">Starter</div>
                     <h2 className="display-4 fw-bold text-white mb-0">$49</h2>
                     <span className="text-white-50 small">per month</span>
                     <hr className="my-4 border-white opacity-10" />
                     <ul className="list-unstyled text-start mb-5 d-inline-block mx-auto text-white-50">
                        <li className="mb-3"><i className="fa-solid fa-check text-white me-2"></i> 500 Leads / Mo</li>
                        <li className="mb-3"><i className="fa-solid fa-check text-white me-2"></i> County Search</li>
                        <li className="mb-3"><i className="fa-solid fa-check text-white me-2"></i> Basic Filters</li>
                     </ul>
                     <Link href="/signup" className="btn btn-outline-light fw-bold w-100 py-3 rounded-pill">Start Free Trial</Link>
                  </motion.div>
               </div>

               {/* PRO */}
               <div className="col-lg-4 col-md-6">
                  <motion.div 
                     initial={{ scale: 1 }}
                     whileHover={{ scale: 1.03 }}
                     className="bg-white text-dark rounded-4 p-5 h-100 text-center position-relative overflow-hidden shadow-lg border border-white"
                  >
                     <div className="position-absolute top-0 start-0 w-100 bg-primary py-1 text-white small fw-bold text-uppercase">Recommended</div>
                     <div className="fw-bold text-muted text-uppercase small mb-3 mt-3">Pro Investor</div>
                     <h2 className="display-4 fw-bold text-dark mb-0">$99</h2>
                     <span className="text-muted small">per month</span>
                     <hr className="my-4 opacity-25" />
                     <ul className="list-unstyled text-start mb-5 d-inline-block mx-auto text-dark fw-500">
                        <li className="mb-3"><i className="fa-solid fa-check text-primary me-2"></i> <strong>5,000 Leads</strong> / Mo</li>
                        <li className="mb-3"><i className="fa-solid fa-check text-primary me-2"></i> Nationwide Search</li>
                        <li className="mb-3"><i className="fa-solid fa-check text-primary me-2"></i> <strong>Skip Tracing</strong> (100 credits)</li>
                        <li className="mb-3"><i className="fa-solid fa-check text-primary me-2"></i> Equity Calculator</li>
                     </ul>
                     <Link href="/signup" className="btn btn-dark fw-bold w-100 py-3 rounded-pill text-uppercase shadow-lg">Get Started</Link>
                  </motion.div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Pricing;