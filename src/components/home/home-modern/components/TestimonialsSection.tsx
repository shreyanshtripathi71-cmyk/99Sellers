"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/homepage.module.scss";

const testimonials = [
  {
    id: 1,
    name: "Marcus Johnson",
    role: "Real Estate Investor",
    location: "Phoenix, AZ",
    image: "/images/home/testimonial-marcus.png",
    quote: "99Sellers completely transformed my business. I went from 2-3 deals a month to closing 8-10. The lead quality is incredible.",
    stats: { deals: "8-10", timeframe: "per month", roi: "340%" }
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Wholesaler",
    location: "Houston, TX",
    image: "/images/home/testimonial-sarah.png",
    quote: "The skip tracing accuracy is unmatched. I'm reaching motivated sellers on the first call. This is a game changer.",
    stats: { deals: "12", timeframe: "first month", roi: "520%" }
  },
  {
    id: 3,
    name: "David Williams",
    role: "Broker",
    location: "Atlanta, GA",
    image: "/images/home/testimonial-david.png",
    quote: "My team relies on 99Sellers for all our off-market deals. The data is fresh, accurate, and helps us move faster than competitors.",
    stats: { deals: "$2.1M", timeframe: "in deals", roi: "890%" }
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className={styles.testimonials_section}>
      <div className={styles.testimonials_container}>
        <motion.div
          className={styles.testimonials_header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.testimonials_title}>
            Real Results from <span>Real Investors</span>
          </h2>
          <p className={styles.testimonials_subtitle}>
            See how thousands of investors are scaling their business with 99Sellers
          </p>
        </motion.div>

        <div className={styles.testimonials_content}>
          <div className={styles.testimonials_cards}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className={`${styles.testimonial_card} ${index === activeIndex ? styles.active : ""}`}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveIndex(index)}
              >
                <div className={styles.testimonial_quote}>
                  <i className="fa-solid fa-quote-left"></i>
                  <p>{testimonial.quote}</p>
                </div>

                <div className={styles.testimonial_author}>
                  <div className={styles.author_image}>
                    <img src={testimonial.image} alt={testimonial.name} />
                  </div>
                  <div className={styles.author_info}>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                    <span>{testimonial.location}</span>
                  </div>
                </div>

                <div className={styles.testimonial_stats}>
                  <div className={styles.tstat}>
                    <span className={styles.tstat_value}>{testimonial.stats.deals}</span>
                    <span className={styles.tstat_label}>{testimonial.stats.timeframe}</span>
                  </div>
                  <div className={styles.tstat}>
                    <span className={styles.tstat_value}>{testimonial.stats.roi}</span>
                    <span className={styles.tstat_label}>ROI</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className={styles.testimonials_dots}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`${styles.tdot} ${index === activeIndex ? styles.active : ""}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>

        <motion.div
          className={styles.testimonials_cta}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link href="/search" className={styles.btn_testimonial_cta}>
            Join 12,000+ Successful Investors
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
