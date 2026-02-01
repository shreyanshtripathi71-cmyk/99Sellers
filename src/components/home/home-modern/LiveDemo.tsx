"use client"
import React from "react";
import { motion } from "framer-motion";

const leads = [
   { addr: "1024 Elm St", city: "Dallas, TX", profit: 124, type: "Foreclosure" },
   { addr: "550 Maple Ave", city: "Austin, TX", profit: 89, type: "Tax Lien" },
   { addr: "880 Oak Ln", city: "Houston, TX", profit: 145, type: "Probate" },
   { addr: "202 Pine St", city: "Miami, FL", profit: 210, type: "Divorce" },
   { addr: "15 Sunset Blvd", city: "LA, CA", profit: 350, type: "Foreclosure" },
];

// Duplicate leads to ensure smooth seamless loop
const marqueeLeads = [...leads, ...leads, ...leads];

const LiveDemo = ({ styles }: { styles: any }) => {
   return (
      <div className="py-100 bg-light border-top border-bottom">
         <div className="container">
            <div className="row align-items-center">
               
               <div className="col-lg-5 mb-5 mb-lg-0">
                  <motion.div
                     initial={{ opacity: 0, x: -50 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8 }}
                  >
                     <h2 className="fw-900 text-dark display-6 mb-4">Real-Time Market Data.</h2>
                     <p className="fs-18 text-secondary mb-4">
                        See properties hit the market the second they are recorded at the county courthouse.
                     </p>
                     <ul className="list-unstyled">
                        {[
                           "Nationwide Coverage (All 50 States)",
                           "Daily Updates at 6:00 AM",
                           "Export to Excel / CSV Instantly"
                        ].map((text, i) => (
                           <li key={i} className="d-flex align-items-center mb-3 fw-600 text-dark">
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width:24, height:24, fontSize:12}}>
                                 <i className="fa-solid fa-check"></i>
                              </div>
                              {text}
                           </li>
                        ))}
                     </ul>
                  </motion.div>
               </div>

               <div className="col-lg-7 ps-lg-5">
                  <div className="bg-white border rounded-4 shadow-lg overflow-hidden p-4 position-relative" style={{ height: '500px' }}>
                     {/* Header */}
                     <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3 position-relative z-1 bg-white">
                        <h5 className="fw-bold m-0">Recent Distressed Leads</h5>
                        <div className="d-flex align-items-center gap-2 bg-light px-3 py-1 rounded-pill border">
                           <span className={`bg-success rounded-circle ${styles.anim_pulse}`} style={{width:8, height:8}}></span>
                           <span className="fs-12 fw-bold text-success">Live Feed</span>
                        </div>
                     </div>
                     
                     {/* Vertical Marquee Mask */}
                     <div className="overflow-hidden position-relative" style={{ height: '400px' }}>
                        {/* Gradient Masks for Top/Bottom Fade */}
                        <div className="position-absolute top-0 start-0 w-100 bg-gradient-to-b from-white to-transparent" style={{ height: '50px', zIndex: 2, background: 'linear-gradient(to bottom, white, transparent)' }}></div>
                        <div className="position-absolute bottom-0 start-0 w-100 bg-gradient-to-t from-white to-transparent" style={{ height: '50px', zIndex: 2, background: 'linear-gradient(to top, white, transparent)' }}></div>

                        <motion.div 
                           className="d-flex flex-column gap-3"
                           animate={{ y: [0, -600] }} // Adjust based on height of items
                           transition={{ 
                              repeat: Infinity, 
                              ease: "linear", 
                              duration: 15 // Speed of scroll
                           }}
                        >
                           {marqueeLeads.map((item, i) => (
                              <div key={i} className="d-flex align-items-center justify-content-between p-3 rounded-3 border bg-light">
                                 <div className="d-flex align-items-center gap-3">
                                    <div className="bg-white border rounded-circle d-flex align-items-center justify-content-center" style={{width: 45, height: 45}}>
                                       <i className="fa-light fa-house-chimney text-primary"></i>
                                    </div>
                                    <div>
                                       <div className="fw-bold text-dark fs-14">{item.addr}</div>
                                       <div className="text-muted fs-12">{item.city} • Found Just Now</div>
                                    </div>
                                 </div>
                                 <div className="text-end">
                                    <div className="badge bg-danger bg-opacity-10 text-danger mb-1">{item.type}</div>
                                    <div className="fw-bold text-success fs-13">+${item.profit}k Equity</div>
                                 </div>
                              </div>
                           ))}
                        </motion.div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
};

export default LiveDemo;