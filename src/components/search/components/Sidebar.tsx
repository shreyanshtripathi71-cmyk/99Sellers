"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../styles/dashboard.module.scss";

interface SidebarProps {
  userPlan: "Free" | "Pro";
  onUpgrade: () => void;
}

const navItems = [
  {
    section: "Discover",
    items: [
      { href: "/search", icon: "fa-solid fa-magnifying-glass", label: "Search Leads" },
      { href: "/dashboard/saved-leads", icon: "fa-regular fa-bookmark", label: "Saved Leads" },
      { href: "/dashboard/saved-searches", icon: "fa-regular fa-folder", label: "Saved Searches" },
    ],
  },
  {
    section: "Tools",
    items: [
      { href: "/dashboard/export", icon: "fa-solid fa-download", label: "Export Data" },
    ],
  },
  {
    section: "Account",
    items: [
      { href: "/dashboard/profile", icon: "fa-regular fa-user", label: "Profile" },
      { href: "/dashboard/billing", icon: "fa-regular fa-credit-card", label: "Billing" },
      { href: "/dashboard/subscription", icon: "fa-solid fa-crown", label: "Subscription" },
      { href: "/dashboard/account-settings", icon: "fa-solid fa-gear", label: "Settings" },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ userPlan, onUpgrade }) => {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Brand */}
      <div className={styles.sidebar_brand}>
        <Link href="/" className={styles.brand_logo}>
          99<span>Sellers</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className={styles.sidebar_nav}>
        {navItems.map((section) => (
          <div key={section.section} className={styles.nav_section}>
            <div className={styles.nav_label}>{section.section}</div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.nav_item} ${pathname === item.href ? styles.active : ""}`}
              >
                <i className={item.icon}></i>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.sidebar_footer}>
        {userPlan === "Free" ? (
          <div className={styles.upgrade_card}>
            <h4>Upgrade to Pro</h4>
            <p>Unlock unlimited leads, full addresses, and advanced filters.</p>
            <button onClick={onUpgrade}>Upgrade Now</button>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <span className={styles.pro_badge}>PRO</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
