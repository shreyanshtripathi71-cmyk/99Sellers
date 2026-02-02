import React from "react";
import Hero from "./Hero";
import Features from "./Features";
import LiveDemo from "./LiveDemo";
import Pricing from "./Pricing";
import CallToAction from "./CallToAction";
import MarketingPoppins from "./MarketingPoppins";
import PublicHeader from "../../../layouts/headers/PublicHeader";
import styles from "./modern.module.scss"; 

const ModernHome = () => {
  return (
    <div className={styles.modern_wrapper}>
      <PublicHeader />
      
      {/* 1. Hero with Ticker */}
      <Hero styles={styles} />
      
      {/* 2. Boxy Features Grid */}
      <Features styles={styles} />
      
      {/* 3. Live Market Feed */}
      <LiveDemo styles={styles} />
      
      {/* 4. Pricing Tables */}
      <Pricing styles={styles} />
      
      {/* 5. Final CTA */}
      <CallToAction styles={styles} />
      
      {/* 6. Pop-up Modal */}
      <MarketingPoppins styles={styles} />
    </div>
  )
}

export default ModernHome;
