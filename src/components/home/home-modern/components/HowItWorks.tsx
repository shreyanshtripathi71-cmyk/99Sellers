"use client";
import React from "react";
import styles from "../styles/homepage.module.scss";

const steps = [
  {
    number: "01",
    title: "Pick Your Market",
    description: "Select your target counties, cities, or zip codes across all 50 states.",
    icon: "fa-solid fa-map-location-dot"
  },
  {
    number: "02",
    title: "Choose Lead Types",
    description: "Filter by foreclosures, divorces, tax liens, probate, and more.",
    icon: "fa-solid fa-filter"
  },
  {
    number: "03",
    title: "Start Closing",
    description: "Download verified contacts and reach motivated sellers instantly.",
    icon: "fa-solid fa-handshake"
  }
];

const HowItWorks = () => {
  return (
    <section className={styles.how_it_works_bg} id="how-it-works">
      <div className={styles.how_inner}>
        <h2 className={styles.section_title_white}>
          Your Path to the First Deal
        </h2>

        <div className={styles.steps_row}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step_item}>
              <div className={styles.step_number}>{step.number}</div>
              <div className={styles.step_icon}>
                <i className={step.icon}></i>
              </div>
              <h3 className={styles.step_title}>{step.title}</h3>
              <p className={styles.step_desc}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
