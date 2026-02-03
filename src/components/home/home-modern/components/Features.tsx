"use client";
import React from "react";
import styles from "../styles/homepage.module.scss";

const features = [
  {
    icon: "fa-solid fa-bolt",
    title: "Real-Time Updates",
    description: "New leads added daily from courthouse records, credit bureaus, and public filings."
  },
  {
    icon: "fa-solid fa-phone-volume",
    title: "Skip Tracing Included",
    description: "Every lead comes with verified phone numbers and email addresses."
  },
  {
    icon: "fa-solid fa-download",
    title: "Export Anywhere",
    description: "Download as CSV and import directly into your CRM or dialer."
  },
  {
    icon: "fa-solid fa-map-location-dot",
    title: "Nationwide Coverage",
    description: "Access motivated sellers in all 50 states. Filter by county, city, or zip."
  }
];

const Features = () => {
  return (
    <section className={styles.features_simple}>
      <h2 className={styles.section_title}>Built for Serious Investors</h2>

      <div className={styles.features_grid_simple}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature_card_simple}>
            <div className={styles.feature_icon_simple}>
              <i className={feature.icon}></i>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
