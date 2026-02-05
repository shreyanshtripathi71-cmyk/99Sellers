"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/homepage.module.scss";

// Client's exact content for the hero slides
const heroContent = [
  {
    title: "Find 100s of motivated sellers at few clicks",
    subtitle: "Never let the lack of information stops you from closing deals",
    image: "/images/home/hero-slide-1.jpg"
  },
  {
    title: "Want basket full of sales lead today?",
    subtitle: "Hundreds and thousands of distressed sellers are just waiting for you to sell their home. All they need is an agent in action. Just with few clicks, the list of all potential sellers will be delivered to you.",
    image: "/images/home/hero-slide-2.jpg"
  },
  {
    title: "Sellers are waiting to sell their property.",
    subtitle: "Selling a house is not a child's play. Finding a house isn't either. That's why we decided to give the Real Estate agents a helping hand. By removing half of their responsibility, we can make them so lighter that they can fly in higher altitudes of success.",
    image: "/images/home/hero-slide-3.jpg"
  }
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroContent.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroContent.length) % heroContent.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className={styles.hero_slider}>
      {/* Background Images with Ken Burns effect */}
      <div className={styles.hero_slider_bg}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className={styles.hero_slide_image}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src={heroContent[currentIndex].image}
              alt=""
              aria-hidden="true"
              onError={(e) => {
                // Fallback gradient if image doesn't load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </motion.div>
        </AnimatePresence>
        <div className={styles.hero_slider_overlay}></div>
      </div>

      {/* Content */}
      <div className={styles.hero_slider_content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className={styles.hero_slider_text}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={styles.hero_slider_title}>
              {heroContent[currentIndex].title}
            </h1>
            <p className={styles.hero_slider_subtitle}>
              {heroContent[currentIndex].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CTA Buttons */}
        <motion.div
          className={styles.hero_slider_cta}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/signup" className={styles.hero_slider_btn_primary}>
            Get Started Free
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
          <Link href="#how-it-works" className={styles.hero_slider_btn_secondary}>
            <i className="fa-solid fa-play-circle"></i>
            See How It Works
          </Link>
        </motion.div>

        {/* Navigation Arrows */}
        <div className={styles.hero_slider_nav}>
          <button
            className={styles.hero_nav_arrow}
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            className={styles.hero_nav_arrow}
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        {/* Slide Indicators */}
        <div className={styles.hero_slider_dots}>
          {heroContent.map((_, index) => (
            <button
              key={index}
              className={`${styles.hero_slider_dot} ${index === currentIndex ? styles.active : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
