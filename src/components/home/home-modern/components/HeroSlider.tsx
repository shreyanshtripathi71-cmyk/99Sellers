"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/homepage.module.scss";

const heroContent = [
  {
    prefix: "We Deliver",
    highlight: "Off-Market",
    suffix: "Leads That Convert.",
    subtitle: "Access verified motivated sellers—foreclosures, divorces, tax liens & more with 98% accurate skip-traced contact data."
  },
  {
    prefix: "Find",
    highlight: "Motivated Sellers",
    suffix: "Before Anyone Else.",
    subtitle: "Get early access to 24,500+ distressed properties with skip-traced phone and email—updated daily."
  },
  {
    prefix: "Close More",
    highlight: "Deals",
    suffix: "Every Single Month.",
    subtitle: "Join 12,000+ investors who use 99Sellers to find off-market properties across all 50 states."
  }
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextContent = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroContent.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextContent, 5000);
    return () => clearInterval(interval);
  }, [nextContent]);

  return (
    <section className={styles.hero_modern}>
      {/* Background */}
      <div className={styles.hero_bg}>
        <div className={styles.hero_bg_image}>
          <img src="/images/home/hero-background.png" alt="" aria-hidden="true" />
        </div>
        <div className={styles.hero_bg_overlay}></div>
        <div className={styles.hero_bg_gradient}></div>
      </div>

      <div className={styles.hero_content_wrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={styles.hero_text_block}
          >
            <h1 className={styles.hero_main_title}>
              <span className={styles.title_prefix}>{heroContent[currentIndex].prefix}</span>
              <span className={styles.title_highlight}>{heroContent[currentIndex].highlight}</span>
              <span className={styles.title_suffix}>{heroContent[currentIndex].suffix}</span>
            </h1>

            <p className={styles.hero_main_subtitle}>
              {heroContent[currentIndex].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CTA Buttons */}
        <motion.div
          className={styles.hero_cta_row}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/search" className={styles.hero_btn_primary}>
            <span>Claim Your Area</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
          <Link href="#how-it-works" className={styles.hero_btn_ghost}>
            <i className="fa-solid fa-play-circle"></i>
            <span>See How It Works</span>
          </Link>
        </motion.div>

        {/* Slide Indicators */}
        <div className={styles.hero_dots}>
          {heroContent.map((_, index) => (
            <button
              key={index}
              className={`${styles.hero_dot} ${index === currentIndex ? styles.active : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
