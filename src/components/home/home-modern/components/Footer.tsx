"use client";
import React from "react";
import Link from "next/link";
import styles from "../styles/homepage.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_inner}>
        <div className={styles.footer_brand}>
          <Link href="/" className={styles.logo}>
            99<span>Sellers</span>
          </Link>
          <p>
            The all-in-one platform for real estate investors to discover
            distressed properties and close more deals.
          </p>
        </div>

        <div className={styles.footer_links}>
          <div className={styles.footer_col}>
            <h4>Product</h4>
            <Link href="#features">Features</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#how-it-works">How It Works</Link>
            <Link href="/search">Lead Search</Link>
          </div>

          <div className={styles.footer_col}>
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/careers">Careers</Link>
          </div>

          <div className={styles.footer_col}>
            <h4>Legal</h4>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookie Policy</Link>
          </div>

          <div className={styles.footer_col}>
            <h4>Support</h4>
            <Link href="/help">Help Center</Link>
            <Link href="/docs">Documentation</Link>
            <Link href="/api">API Reference</Link>
          </div>
        </div>
      </div>

      <div className={styles.footer_bottom}>
        <p>© 2026 99Sellers. All rights reserved.</p>
        <div className={styles.social_links}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-x-twitter"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-facebook-f"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
