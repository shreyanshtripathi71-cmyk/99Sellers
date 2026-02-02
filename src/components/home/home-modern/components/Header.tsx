"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../styles/homepage.module.scss";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header_inner}>
        <Link href="/" className={styles.logo}>
          99<span>Sellers</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="#features">Features</Link>
          <Link href="#how-it-works">How It Works</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#testimonials">Testimonials</Link>
        </nav>

        <div className={styles.header_actions}>
          <Link href="/signin" className={styles.btn_secondary}>
            Sign In
          </Link>
          <Link href="/signin" className={styles.btn_primary}>
            Start Free Trial
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
