"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../styles/homepage.module.scss";

const steps = [
  {
    number: "01",
    icon: "fa-solid fa-map-location-dot",
    title: "Choose Your Market",
    description: "Target specific zip codes, cities, or counties with our intuitive search."
  },
  {
    number: "02",
    icon: "fa-solid fa-filter",
    title: "Select Lead Types",
    description: "Filter by foreclosure, divorce, tax lien, probate, code violation, or eviction."
  },
  {
    number: "03",
    icon: "fa-solid fa-phone",
    title: "Get Contact Info",
    description: "Instantly access skip-traced phone numbers and verified emails."
  },
  {
    number: "04",
    icon: "fa-solid fa-handshake",
    title: "Close More Deals",
    description: "Export to CRM, start campaigns, and turn leads into deals."
  }
];

const HowItWorks = () => {
  return (
    <section className={styles.how_it_works_simple} id="how-it-works">
      <div className={styles.how_container_simple}>
        {/* Header */}
        <motion.div
          className={styles.how_header_simple}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.how_title_simple}>
            Find Leads in <span>4 Easy Steps</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className={styles.steps_timeline}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={styles.step_item_simple}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.step_number_simple}>{step.number}</div>
              <div className={styles.step_icon_simple}>
                <i className={step.icon}></i>
              </div>
              <div className={styles.step_content_simple}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={styles.step_connector_simple}></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className={styles.how_cta_simple}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/search" className={styles.how_btn_simple}>
            Try It Free
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
