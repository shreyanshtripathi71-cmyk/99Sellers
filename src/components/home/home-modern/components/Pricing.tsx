"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../styles/homepage.module.scss";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    description: "Perfect for getting started and exploring the platform.",
    features: [
      "5 property searches per day",
      "Basic property details",
      "Limited equity data",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "For serious investors who want full access to all features.",
    features: [
      "Unlimited searches",
      "Full property details & addresses",
      "Complete equity analysis",
      "Skip tracing (500 credits/mo)",
      "Export to CSV",
      "Priority support",
      "Saved searches & alerts",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$299",
    period: "/month",
    description: "For teams and high-volume investors who need more power.",
    features: [
      "Everything in Pro",
      "Unlimited skip tracing",
      "API access",
      "Team collaboration",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options",
    ],
    cta: "Contact Sales",
    popular: false,
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

const Pricing = () => {
  return (
    <section className={styles.pricing} id="pricing">
      <motion.div
        className={styles.section_header}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.section_label}>Pricing</span>
        <h2 className={styles.section_title}>
          Simple, transparent pricing
        </h2>
        <p className={styles.section_subtitle}>
          Start for free, upgrade when you're ready. No hidden fees, cancel
          anytime.
        </p>
      </motion.div>

      <motion.div
        className={styles.pricing_grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={`${styles.pricing_card} ${plan.popular ? styles.popular : ""}`}
            variants={itemVariants}
          >
            <h3 className={styles.plan_name}>{plan.name}</h3>
            <div className={styles.plan_price}>
              <span className={styles.price_value}>{plan.price}</span>
              <span className={styles.price_period}>{plan.period}</span>
            </div>
            <p className={styles.plan_desc}>{plan.description}</p>
            
            <ul className={styles.plan_features}>
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <i className="fa-solid fa-check"></i>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={plan.name === "Enterprise" ? "/contact" : "/search"}
              className={`${
                plan.popular ? styles.btn_primary : styles.btn_outline
              } ${styles.plan_btn}`}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Pricing;
