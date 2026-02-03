"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/homepage.module.scss";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.header_inner}>
        <Link href="/" className={styles.logo}>
          99<span>Sellers</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="#lead-types">Lead Types</Link>
          <Link href="#how-it-works">How It Works</Link>
          <Link href="#pricing">Pricing</Link>
        </nav>

        <div className={styles.header_actions}>
          <div className={styles.header_phone}>
            <i className="fa-solid fa-phone"></i>
            (888) 99-LEADS
          </div>
          <Link href="/login" className={styles.btn_secondary}>
            Sign In
          </Link>
          <Link href="/search" className={styles.btn_primary}>
            Get Started Free
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
