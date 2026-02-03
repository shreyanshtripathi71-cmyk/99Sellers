"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/dashboard.module.scss";

interface HeaderProps {
  title: string;
  subtitle?: string;
  userPlan: "Free" | "Pro";
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, userPlan, actions }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className={styles.top_header}>
      <div className={styles.header_left}>
        <h1 className={styles.page_title}>{title}</h1>
        {subtitle && (
          <span className={`${styles.badge} ${styles.badge_success}`}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10B981",
                display: "inline-block",
              }}
            ></span>
            {subtitle}
          </span>
        )}
      </div>

      <div className={styles.header_right}>
        {/* Page Actions */}
        {actions && <div className={styles.header_actions}>{actions}</div>}

        {/* User Menu */}
        <div style={{ position: "relative" }}>
          <button
            className={styles.user_avatar}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            JD
          </button>

          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 49,
                }}
                onClick={() => setShowUserMenu(false)}
              />

              <div className={styles.user_dropdown}>
                <div className={styles.user_info}>
                  <p className={styles.user_name}>John Doe</p>
                  <p className={styles.user_email}>john@example.com</p>
                  {userPlan === "Pro" && (
                    <span className={styles.pro_badge} style={{ marginTop: 8 }}>
                      PRO
                    </span>
                  )}
                </div>

                <Link href="/dashboard/profile" className={styles.user_menu_item}>
                  <i className="fa-regular fa-user"></i>
                  Profile
                </Link>
                <Link href="/dashboard/membership" className={styles.user_menu_item}>
                  <i className="fa-regular fa-credit-card"></i>
                  Billing
                </Link>

                <div className={styles.user_menu_divider} />

                <button className={`${styles.user_menu_item} ${styles.danger}`}>
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
