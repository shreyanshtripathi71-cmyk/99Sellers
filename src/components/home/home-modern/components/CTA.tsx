"use client";
import React from "react";
import Link from "next/link";
import styles from "../styles/homepage.module.scss";

const CTA = () => {
  return (
    <section className={styles.cta_simple}>
      <div className={styles.cta_content}>
        <h2 className={styles.cta_title}>
          Stop Competing. <span>Start Closing.</span>
        </h2>
        <p className={styles.cta_subtitle}>
          Join 12,000+ investors who are finding off-market deals before anyone else.
        </p>
        <div className={styles.cta_buttons}>
          <Link href="/search" className={styles.cta_btn_primary}>
            Get Started Free
          </Link>
          <Link href="#pricing" className={styles.cta_btn_secondary}>
            View Pricing
          </Link>
        </div>
        <p className={styles.cta_note}>
          <i className="fa-solid fa-shield-check"></i>
          30-day money-back guarantee • No credit card required
        </p>
      </div>
    </section>
  );
};

export default CTA;
