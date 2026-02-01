// src/components/homes/home-modern/index.tsx
import React from "react";
import Hero from "./Hero";
import Features from "./Features";
import LiveDemo from "./LiveDemo";
import Pricing from "./Pricing";
import CallToAction from "./CallToAction";
import styles from "./modern.module.scss"; 
import PublicHeader from "@/layouts/headers/PublicHeader"; 

const ModernHome = () => {
  return (
    <div className={styles.modern_wrapper}>
      {/* We pass 'styles' to every component so they can share 
         the animations (anim_pulse, anim_float) and colors defined in the SCSS 
      */}
      <PublicHeader />
      <Hero styles={styles} />
      <Features styles={styles} />
      <LiveDemo styles={styles} />
      <Pricing styles={styles} />
      <CallToAction styles={styles} />
    </div>
  )
}

export default ModernHome;
