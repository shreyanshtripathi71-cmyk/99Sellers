"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/homepage.module.scss";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Link href="#testimonials">Testimonials</Link>
          <Link href="/blog">Blog</Link>
        </nav>

        <div className={styles.header_actions}>
          <a href="tel:+18005551234" className={styles.header_phone}>
            <i className="fa-solid fa-phone"></i>
            (800) 555-1234
          </a>
          <Link href="/login" className={styles.btn_secondary}>
            Sign In
          </Link>
          <Link href="/search" className={styles.btn_primary}>
            Get Started Free
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={styles.mobile_menu_toggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <i className={mobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobile_menu}>
          <nav className={styles.mobile_nav}>
            <Link href="#lead-types" onClick={() => setMobileMenuOpen(false)}>Lead Types</Link>
            <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Testimonials</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
          </nav>
          <div className={styles.mobile_actions}>
            <a href="tel:+18005551234" className={styles.mobile_phone}>
              <i className="fa-solid fa-phone"></i>
              (800) 555-1234
            </a>
            <Link href="/login" className={styles.btn_secondary}>Sign In</Link>
            <Link href="/search" className={styles.btn_primary}>Get Started Free</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
