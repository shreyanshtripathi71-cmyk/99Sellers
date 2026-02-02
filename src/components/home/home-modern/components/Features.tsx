"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "../styles/homepage.module.scss";

const features = [
  {
    icon: "fa-solid fa-magnifying-glass-location",
    color: "blue",
    title: "Lead Discovery",
    description:
      "Search millions of distressed properties including foreclosures, probates, divorces, and tax defaults across all 50 states.",
  },
  {
    icon: "fa-solid fa-user-check",
    color: "green",
    title: "Skip Tracing",
    description:
      "Get verified phone numbers and email addresses for property owners with our industry-leading 95% hit rate.",
  },
  {
    icon: "fa-solid fa-chart-mixed",
    color: "purple",
    title: "Equity Analysis",
    description:
      "Instantly calculate potential equity, estimated ARV, and profit margins with our AI-powered valuation tools.",
  },
  {
    icon: "fa-solid fa-bell",
    color: "orange",
    title: "Smart Alerts",
    description:
      "Get notified instantly when new properties match your criteria. Never miss a deal again.",
  },
  {
    icon: "fa-solid fa-file-export",
    color: "cyan",
    title: "Easy Export",
    description:
      "Export leads to CSV, integrate with your CRM, or use our API to automate your entire workflow.",
  },
  {
    icon: "fa-solid fa-shield-check",
    color: "red",
    title: "Data Accuracy",
    description:
      "Our data is verified daily against county records and multiple sources to ensure 98% accuracy.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Features = () => {
  return (
    <section className={styles.features} id="features">
      <motion.div
        className={styles.section_header}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.section_label}>Features</span>
        <h2 className={styles.section_title}>
          Everything you need to close more deals
        </h2>
        <p className={styles.section_subtitle}>
          Powerful tools designed specifically for real estate investors who
          want to find and close distressed property deals faster.
        </p>
      </motion.div>

      <motion.div
        className={styles.features_grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={styles.feature_card}
            variants={itemVariants}
          >
            <div className={`${styles.feature_icon} ${styles[feature.color]}`}>
              <i className={feature.icon}></i>
            </div>
            <h3 className={styles.feature_title}>{feature.title}</h3>
            <p className={styles.feature_desc}>{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;
