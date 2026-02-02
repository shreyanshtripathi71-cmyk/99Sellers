"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../styles/homepage.module.scss";

const CTA = () => {
  return (
    <section className={styles.cta}>
      <motion.div
        className={styles.cta_inner}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.cta_title}>
          Ready to find your next deal?
        </h2>
        <p className={styles.cta_subtitle}>
          Join thousands of investors who use 99Sellers to find and close
          distressed property deals. Start your free trial today — no credit
          card required.
        </p>
        <div className={styles.cta_actions}>
          <Link href="/search" className={`${styles.btn_white} ${styles.btn_large}`}>
            Start Free Trial
            <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }}></i>
          </Link>
          <Link href="/contact" className={`${styles.btn_outline} ${styles.btn_large}`} style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
            Contact Sales
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
