"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../styles/homepage.module.scss";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.hero_inner}>
        {/* Badge */}
        <motion.div
          className={styles.hero_badge}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          Now with AI-Powered Lead Scoring
        </motion.div>

        {/* Title */}
        <motion.h1
          className={styles.hero_title}
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Find Distressed Properties
          <br />
          <span className={styles.highlight}>Before Anyone Else</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={styles.hero_subtitle}
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          99Sellers is the all-in-one platform for real estate investors to
          discover foreclosures, probates, and motivated sellers with verified
          contact information.
        </motion.p>

        {/* Actions */}
        <motion.div
          className={styles.hero_actions}
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/search" className={`${styles.btn_primary} ${styles.btn_large}`}>
            Start Free Trial
            <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }}></i>
          </Link>
          <Link href="#features" className={`${styles.btn_outline} ${styles.btn_large}`}>
            See How It Works
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          className={styles.hero_stats}
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className={styles.stat_item}>
            <div className={styles.stat_value}>150K+</div>
            <div className={styles.stat_label}>Properties Listed</div>
          </div>
          <div className={styles.stat_item}>
            <div className={styles.stat_value}>$2.4B</div>
            <div className={styles.stat_label}>Deals Closed</div>
          </div>
          <div className={styles.stat_item}>
            <div className={styles.stat_value}>12K+</div>
            <div className={styles.stat_label}>Active Investors</div>
          </div>
          <div className={styles.stat_item}>
            <div className={styles.stat_value}>98%</div>
            <div className={styles.stat_label}>Data Accuracy</div>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className={styles.hero_image}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className={styles.image_wrapper}>
            <img
              src="https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200"
              alt="99Sellers Dashboard"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: 500,
                objectFit: "cover",
              }}
            />
          </div>

          {/* Floating Cards */}
          <motion.div
            className={`${styles.float_card} ${styles.left}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className={`${styles.float_icon} ${styles.success}`}>
              <i className="fa-solid fa-arrow-trend-up"></i>
            </div>
            <div className={styles.float_text}>
              <div className={styles.float_label}>Equity Found</div>
              <div className={styles.float_value}>+$342K</div>
            </div>
          </motion.div>

          <motion.div
            className={`${styles.float_card} ${styles.right}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div className={`${styles.float_icon} ${styles.primary}`}>
              <i className="fa-solid fa-house"></i>
            </div>
            <div className={styles.float_text}>
              <div className={styles.float_label}>New Leads Today</div>
              <div className={styles.float_value}>127</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
