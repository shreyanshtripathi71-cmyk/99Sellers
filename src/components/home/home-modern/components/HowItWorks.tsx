"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "../styles/homepage.module.scss";

const steps = [
  {
    number: 1,
    title: "Search for Properties",
    description:
      "Use our advanced filters to find distressed properties that match your investment criteria. Filter by state, distress type, equity percentage, and more.",
  },
  {
    number: 2,
    title: "Analyze the Deal",
    description:
      "Review property details, estimated equity, debt amounts, and comparable sales. Our AI-powered tools help you identify the best opportunities instantly.",
  },
  {
    number: 3,
    title: "Get Contact Information",
    description:
      "Access verified owner contact details including phone numbers and email addresses. Our skip tracing has a 95% hit rate.",
  },
  {
    number: 4,
    title: "Close the Deal",
    description:
      "Reach out to motivated sellers, negotiate your terms, and close profitable deals. Export leads to your CRM or marketing tools for automated outreach.",
  },
];

const HowItWorks = () => {
  return (
    <section className={styles.how_it_works} id="how-it-works">
      <motion.div
        className={styles.section_header}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.section_label}>How It Works</span>
        <h2 className={styles.section_title}>
          From search to closing in 4 simple steps
        </h2>
        <p className={styles.section_subtitle}>
          Our streamlined workflow helps you find and close deals faster than
          ever before.
        </p>
      </motion.div>

      <div className={styles.steps_container}>
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            className={styles.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={styles.step_number}>{step.number}</div>
            <div className={styles.step_content}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
