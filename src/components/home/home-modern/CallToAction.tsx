"use client"
import Link from "next/link";
import React from "react";

const CallToAction = ({ styles }: { styles: any }) => {
   return (
      <section className={styles.section_pad} style={{ background: '#2563EB', textAlign: 'center' }}>
         <div className="container">
            <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '24px' }}>
               Ready to find your next deal?
            </h2>
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 40px auto' }}>
               Join 15,000+ investors using 99Sellers to find off-market opportunities before they hit the MLS.
            </p>
            <Link href="/search" className="btn btn-light rounded-pill px-5 py-3 fw-bold fs-5 shadow-lg" style={{ background: 'white', color: '#2563EB', border: 'none' }}>
               Launch Dashboard
            </Link>
         </div>
      </section>
   );
};

export default CallToAction;