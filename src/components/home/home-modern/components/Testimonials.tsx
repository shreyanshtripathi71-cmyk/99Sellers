"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "../styles/homepage.module.scss";

const testimonials = [
  {
    quote:
      "99Sellers completely transformed our lead generation. We closed 3 deals in the first month worth over $150K in profit.",
    name: "Marcus Thompson",
    role: "Real Estate Investor, Austin TX",
    initials: "MT",
  },
  {
    quote:
      "The skip tracing accuracy is incredible. I was skeptical at first, but the contact info is spot-on almost every time.",
    name: "Jennifer Roberts",
    role: "Wholesaler, Miami FL",
    initials: "JR",
  },
  {
    quote:
      "Finally a platform that understands what investors actually need. The equity analysis saves me hours every week.",
    name: "David Chen",
    role: "Fix & Flip Investor, Phoenix AZ",
    initials: "DC",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

const Testimonials = () => {
  return (
    <section className={styles.testimonials} id="testimonials">
      <motion.div
        className={styles.section_header}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.section_label}>Testimonials</span>
        <h2 className={styles.section_title}>Loved by investors nationwide</h2>
        <p className={styles.section_subtitle}>
          Join thousands of real estate investors who trust 99Sellers to find
          their next profitable deal.
        </p>
      </motion.div>

      <motion.div
        className={styles.testimonials_grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className={styles.testimonial_card}
            variants={itemVariants}
          >
            <p className={styles.testimonial_quote}>"{testimonial.quote}"</p>
            <div className={styles.testimonial_author}>
              <div className={styles.author_avatar}>{testimonial.initials}</div>
              <div className={styles.author_info}>
                <div className={styles.author_name}>{testimonial.name}</div>
                <div className={styles.author_role}>{testimonial.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonials;
