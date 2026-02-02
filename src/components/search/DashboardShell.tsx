"use client";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import styles from "./styles/dashboard.module.scss";

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const [userPlan, setUserPlan] = useState<"Free" | "Pro">("Pro");

  return (
    <div className={styles.dashboard_root}>
      <Sidebar userPlan={userPlan} onUpgrade={() => setUserPlan("Pro")} />
      <main className={styles.main_content}>
        <Header title={title} subtitle={subtitle} userPlan={userPlan} actions={actions} />
        <div className={styles.content_area}>{children}</div>
      </main>
    </div>
  );
};

export default DashboardShell;
