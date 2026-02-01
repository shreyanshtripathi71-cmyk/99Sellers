// src/components/homes/home-modern/CallToAction.tsx
import Link from "next/link";
import React from "react";

const CallToAction = ({ styles }: { styles: any }) => {
   return (
      <div className="py-5 text-center position-relative overflow-hidden" style={{marginTop: '50px', marginBottom: '100px'}}>
         {/* Center Glow */}
         <div className={styles.glow_bg} style={{ width: '600px', height: '600px', opacity: 0.4 }}></div>
         
         <div className="container position-relative z-1 border-top border-white border-opacity-10 pt-5">
            <h2 className="text-white fw-900 display-4 mb-4">Ready to start digging?</h2>
            <p className="text-white-50 fs-5 mb-5 col-lg-6 mx-auto">
               Join 15,000+ investors using 99Sellers to find their next flip or wholesale deal.
            </p>
            <Link href="/search" className="btn btn-primary rounded-pill px-5 py-3 fw-bold fs-5 shadow-lg">
               Launch Dashboard <i className="fa-light fa-arrow-right ms-2"></i>
            </Link>
         </div>
      </div>
   );
};

export default CallToAction;