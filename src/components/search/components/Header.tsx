"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "../styles/dashboard.module.scss";

interface HeaderProps {
  title: string;
  subtitle?: string;
  userPlan: "Free" | "Pro";
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, userPlan, actions }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Get user initials from name or email
  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(" ");
      if (names.length >= 2) {
        return names[0][0].toUpperCase() + names[1][0].toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.name) {
      return user.name;
    }
    return user?.email?.split("@")[0] || "User";
  };

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

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
            {getUserInitials()}
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
                  <p className={styles.user_name}>{getDisplayName()}</p>
                  <p className={styles.user_email}>{user?.email || ""}</p>
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
                <Link href="/dashboard/billing" className={styles.user_menu_item}>
                  <i className="fa-regular fa-credit-card"></i>
                  Billing
                </Link>

                <div className={styles.user_menu_divider} />

                <button className={`${styles.user_menu_item} ${styles.danger}`} onClick={handleLogout}>
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
