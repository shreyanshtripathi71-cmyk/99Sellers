"use client"
import React from "react";
import SpotlightCard from "../common/SpotlightCard"; // Adjust import path as needed

const Features = ({ styles }: { styles: any }) => {
   return (
      <div id="features" className="py-100">
         <div className="container">
            <div className="text-center mb-5">
               <span className="text-primary fw-bold text-uppercase fs-12 tracking-wide bg-blue-50 px-3 py-1 rounded-pill">Power Features</span>
               <h2 className="display-5 fw-900 text-dark mt-3 mb-3">Built for speed.</h2>
               <p className="text-secondary fs-18">Search, Skip-Trace, and Analyze in one dashboard.</p>
            </div>

            <div className="row g-4">
               {/* Card 1 */}
               <div className="col-lg-4">
                  <SpotlightCard className="h-100 p-4">
                     <div className={styles.icon_box_blue}><i className="fa-light fa-layer-group"></i></div>
                     <h4 className="fw-bold text-dark mb-3">Lead Stacking</h4>
                     <p className="text-secondary mb-4">Don't just find a foreclosure. Find a foreclosure owned by a tired landlord going through a divorce.</p>
                     <div className="d-flex flex-wrap gap-2">
                        {['Divorce', 'Tax Liens', 'Vacant'].map(t => (
                           <span key={t} className="badge bg-light text-dark border">{t}</span>
                        ))}
                     </div>
                  </SpotlightCard>
               </div>

               {/* Card 2 */}
               <div className="col-lg-4">
                  <SpotlightCard className="h-100 p-4">
                     <div className={styles.icon_box_blue}><i className="fa-light fa-address-book"></i></div>
                     <h4 className="fw-bold text-dark mb-3">Skip Tracing</h4>
                     <p className="text-secondary mb-4">Get verified mobile numbers & emails instantly. 98% accuracy rate.</p>
                     <div className="p-3 bg-light rounded-3 border">
                        <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                           <span className="fs-12 fw-bold text-muted">MOBILE</span>
                           <span className="fs-13 fw-bold text-dark font-monospace">(512) 555-0199</span>
                        </div>
                        <div className="d-flex justify-content-between">
                           <span className="fs-12 fw-bold text-muted">EMAIL</span>
                           <span className="fs-13 fw-bold text-dark font-monospace">jason@gmail.com</span>
                        </div>
                     </div>
                  </SpotlightCard>
               </div>

               {/* Card 3 */}
               <div className="col-lg-4">
                  <SpotlightCard className="h-100 p-4">
                     <div className={styles.icon_box_blue}><i className="fa-light fa-calculator"></i></div>
                     <h4 className="fw-bold text-dark mb-3">Equity Calculator</h4>
                     <p className="text-secondary mb-4">We instantly calculate the spread between Market Value and Total Debt.</p>
                     
                     <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fs-12 fw-bold text-muted">Equity Spread</span>
                        <span className="fs-12 fw-bold text-primary">65%</span>
                     </div>
                     <div className="progress mb-3" style={{height: 6}}>
                        <div className="progress-bar bg-primary" style={{width: '65%'}}></div>
                     </div>
                     <div className="d-flex justify-content-between bg-green-50 p-2 rounded border border-green-100">
                        <span className="fw-bold text-success fs-14">Profit</span>
                        <span className="fw-900 text-success fs-14">+$145,000</span>
                     </div>
                  </SpotlightCard>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Features;
