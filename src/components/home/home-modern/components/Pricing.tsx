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
    description: "Perfect for trying out 99Sellers with limited access.",
    features: [
      "50 leads per month",
      "1 county access",
      "Basic filters",
      "Email support"
    ],
    buttonText: "Get Started Free",
    buttonClass: "btn_secondary",
    popular: false
  },
  {
    name: "Premium",
    price: "$50",
    period: "/month",
    description: "Unlimited access to all leads and features. Best value for serious investors.",
    features: [
      "Unlimited leads",
      "All 50 states",
      "All 6 lead types",
      "Skip tracing included",
      "CRM export (CSV)",
      "Priority support"
    ],
    buttonText: "Start Free Trial",
    buttonClass: "btn_primary",
    popular: true
  }
];

const Pricing = () => {
  return (
    <section className={styles.pricing} id="pricing">
      <motion.h2
        className={styles.section_title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Simple, Transparent Pricing
      </motion.h2>

      <div className={styles.pricing_grid}>
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={`${styles.pricing_card} ${plan.popular ? styles.popular : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
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

            <Link href="/search" className={`${styles[plan.buttonClass]} ${styles.plan_btn}`}>
              {plan.buttonText}
            </Link>

            {plan.popular && (
              <div className={styles.guarantee_badge}>
                <i className="fa-solid fa-shield-check"></i>
                30-Day Money-Back Guarantee
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
