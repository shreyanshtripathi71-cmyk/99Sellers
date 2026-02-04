"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../styles/homepage.module.scss";

const PremiumCTA = () => {
  return (
    <section className={styles.offmarket_cta_simple}>
      <div className={styles.offmarket_container}>
        <motion.div
          className={styles.offmarket_content}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.offmarket_title}>
            Ready to Find <span>Off-Market Deals</span>?
          </h2>
          <p className={styles.offmarket_desc}>
            Join 12,000+ investors closing more deals with verified leads
          </p>
          <div className={styles.offmarket_buttons}>
            <Link href="/search" className={styles.offmarket_btn_primary}>
              Start Free Trial
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
            <Link href="#pricing" className={styles.offmarket_btn_ghost}>
              View Pricing
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumCTA;
