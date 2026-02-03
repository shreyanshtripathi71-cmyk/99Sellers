"use client";
import React from "react";
import styles from "../styles/homepage.module.scss";

const testimonials = [
  {
    quote: "I closed my first deal within 3 weeks of signing up. The foreclosure leads are incredibly fresh.",
    name: "Marcus Johnson",
    role: "Wholesaler, Phoenix AZ",
    deals: "12",
    profit: "$147K"
  },
  {
    quote: "The contact accuracy is way better than what I was paying for elsewhere. Worth every penny.",
    name: "Sarah Mitchell",
    role: "Flipper, Atlanta GA",
    deals: "8",
    profit: "$89K"
  },
  {
    quote: "The probate leads alone have been worth it. I've built relationships with estate attorneys who now send me referrals.",
    name: "David Chen",
    role: "Buy & Hold Investor, Houston TX",
    deals: "5",
    profit: "$62K"
  }
];

const Testimonials = () => {
  return (
    <section className={styles.testimonials_simple}>
      <h2 className={styles.section_title}>What Investors Are Saying</h2>

      <div className={styles.testimonials_grid_simple}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className={styles.testimonial_card_simple}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <p className={styles.quote}>"{testimonial.quote}"</p>
            <div className={styles.metrics}>
              <span><strong>{testimonial.deals}</strong> Deals</span>
              <span><strong>{testimonial.profit}</strong> Profit</span>
            </div>
            <div className={styles.author}>
              <span className={styles.name}>{testimonial.name}</span>
              <span className={styles.role}>{testimonial.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
