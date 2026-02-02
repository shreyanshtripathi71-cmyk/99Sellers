"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Poppin {
  id: string;
  name: string;
  type: "banner" | "modal" | "toast" | "slide-in";
  title: string;
  message: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor: string;
  textColor: string;
  position: "top" | "bottom" | "center" | "bottom-right" | "bottom-left";
  trigger: "page-load" | "scroll" | "exit-intent" | "time-delay" | "click";
  triggerValue?: number;
  pages: string[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  priority: number;
  showOnMobile: boolean;
  showOnDesktop: boolean;
  dismissable: boolean;
  showOnce: boolean;
}

const MarketingPopup: React.FC = () => {
  const [activePoppin, setActivePoppin] = useState<Poppin | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  const loadPoppins = useCallback(() => {
    try {
      const saved = localStorage.getItem("99sellers_poppins");
      const dismissedIds = JSON.parse(localStorage.getItem("99sellers_dismissed_poppins") || "[]");
      setDismissed(dismissedIds);

      if (saved) {
        const poppins: Poppin[] = JSON.parse(saved);
        
        // Filter active poppins for current page
        const applicablePoppins = poppins.filter(p => {
          if (!p.isActive) return false;
          if (dismissedIds.includes(p.id) && p.showOnce) return false;
          
          // Check if current page matches
          const matchesPage = p.pages.some(page => {
            if (page === "*" || page === "all") return true;
            if (page === pathname) return true;
            if (pathname.startsWith(page)) return true;
            return false;
          });
          
          if (!matchesPage) return false;
          
          // Check dates
          const now = new Date();
          if (p.startDate && new Date(p.startDate) > now) return false;
          if (p.endDate && new Date(p.endDate) < now) return false;
          
          return true;
        });

        // Sort by priority and get highest
        applicablePoppins.sort((a, b) => a.priority - b.priority);
        
        if (applicablePoppins.length > 0) {
          const poppin = applicablePoppins[0];
          
          // Handle different triggers
          if (poppin.trigger === "page-load") {
            setTimeout(() => {
              setActivePoppin(poppin);
              setIsVisible(true);
            }, 500);
          } else if (poppin.trigger === "time-delay") {
            setTimeout(() => {
              setActivePoppin(poppin);
              setIsVisible(true);
            }, (poppin.triggerValue || 5) * 1000);
          } else if (poppin.trigger === "scroll") {
            // Will be handled by scroll listener
            setActivePoppin(poppin);
          } else {
            setActivePoppin(poppin);
            setIsVisible(true);
          }
        }
      }
    } catch (error) {
      console.error("Error loading poppins:", error);
    }
  }, [pathname]);

  useEffect(() => {
    loadPoppins();
  }, [loadPoppins]);

  // Scroll trigger handler
  useEffect(() => {
    if (activePoppin?.trigger === "scroll" && !isVisible) {
      const handleScroll = () => {
        const scrollDepth = activePoppin.triggerValue || 50;
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercentage >= scrollDepth) {
          setIsVisible(true);
          window.removeEventListener("scroll", handleScroll);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [activePoppin, isVisible]);

  const handleDismiss = () => {
    if (activePoppin) {
      if (activePoppin.showOnce) {
        const newDismissed = [...dismissed, activePoppin.id];
        setDismissed(newDismissed);
        localStorage.setItem("99sellers_dismissed_poppins", JSON.stringify(newDismissed));
      }
    }
    setIsVisible(false);
    setTimeout(() => setActivePoppin(null), 300);
  };

  if (!activePoppin || !isVisible) return null;

  // Render based on type
  if (activePoppin.type === "banner") {
    return (
      <div style={{
        position: "fixed",
        top: activePoppin.position === "top" ? 0 : "auto",
        bottom: activePoppin.position === "bottom" ? 0 : "auto",
        left: 0,
        right: 0,
        background: activePoppin.backgroundColor,
        color: activePoppin.textColor,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        zIndex: 9999,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        animation: "slideIn 0.3s ease",
      }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>
          {activePoppin.title} {activePoppin.message}
        </span>
        {activePoppin.buttonText && activePoppin.buttonLink && (
          <Link
            href={activePoppin.buttonLink}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: activePoppin.textColor,
              padding: "6px 16px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {activePoppin.buttonText}
          </Link>
        )}
        {activePoppin.dismissable && (
          <button
            onClick={handleDismiss}
            style={{
              background: "none",
              border: "none",
              color: activePoppin.textColor,
              cursor: "pointer",
              padding: 4,
              opacity: 0.7,
            }}
          >
            <i className="fa-solid fa-times"></i>
          </button>
        )}
      </div>
    );
  }

  if (activePoppin.type === "modal") {
    return (
      <>
        {/* Backdrop */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9998,
            animation: "fadeIn 0.3s ease",
          }}
          onClick={activePoppin.dismissable ? handleDismiss : undefined}
        />
        {/* Modal */}
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: activePoppin.backgroundColor,
          color: activePoppin.textColor,
          padding: 32,
          borderRadius: 16,
          maxWidth: 440,
          width: "90%",
          zIndex: 9999,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          animation: "scaleIn 0.3s ease",
          textAlign: "center",
        }}>
          {activePoppin.dismissable && (
            <button
              onClick={handleDismiss}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "none",
                border: "none",
                color: activePoppin.textColor,
                cursor: "pointer",
                padding: 8,
                opacity: 0.5,
                fontSize: 16,
              }}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          )}
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            {activePoppin.title}
          </h3>
          <p style={{ fontSize: 15, opacity: 0.8, marginBottom: 24, lineHeight: 1.6 }}>
            {activePoppin.message}
          </p>
          {activePoppin.buttonText && activePoppin.buttonLink && (
            <Link
              href={activePoppin.buttonLink}
              onClick={handleDismiss}
              style={{
                display: "inline-block",
                background: activePoppin.textColor === "#ffffff" ? "#3b82f6" : activePoppin.textColor,
                color: activePoppin.backgroundColor,
                padding: "12px 32px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {activePoppin.buttonText}
            </Link>
          )}
        </div>
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-100%); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </>
    );
  }

  if (activePoppin.type === "toast") {
    const positionStyles: React.CSSProperties = {
      position: "fixed",
      zIndex: 9999,
      ...(activePoppin.position === "bottom-right" && { bottom: 24, right: 24 }),
      ...(activePoppin.position === "bottom-left" && { bottom: 24, left: 24 }),
      ...(activePoppin.position === "top" && { top: 24, right: 24 }),
      ...(activePoppin.position === "bottom" && { bottom: 24, right: 24 }),
    };

    return (
      <div style={{
        ...positionStyles,
        background: activePoppin.backgroundColor,
        color: activePoppin.textColor,
        padding: 20,
        borderRadius: 12,
        maxWidth: 360,
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        animation: "slideInRight 0.3s ease",
      }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
              {activePoppin.title}
            </h4>
            <p style={{ fontSize: 13, opacity: 0.8, marginBottom: activePoppin.buttonText ? 12 : 0 }}>
              {activePoppin.message}
            </p>
            {activePoppin.buttonText && activePoppin.buttonLink && (
              <Link
                href={activePoppin.buttonLink}
                onClick={handleDismiss}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: activePoppin.textColor,
                  textDecoration: "underline",
                }}
              >
                {activePoppin.buttonText}
              </Link>
            )}
          </div>
          {activePoppin.dismissable && (
            <button
              onClick={handleDismiss}
              style={{
                background: "none",
                border: "none",
                color: activePoppin.textColor,
                cursor: "pointer",
                padding: 4,
                opacity: 0.5,
                alignSelf: "flex-start",
              }}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          )}
        </div>
        <style jsx global>{`
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  // Slide-in type
  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      background: activePoppin.backgroundColor,
      color: activePoppin.textColor,
      padding: 24,
      borderRadius: 16,
      maxWidth: 380,
      boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
      zIndex: 9999,
      animation: "slideUp 0.4s ease",
    }}>
      {activePoppin.dismissable && (
        <button
          onClick={handleDismiss}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            color: activePoppin.textColor,
            cursor: "pointer",
            opacity: 0.5,
          }}
        >
          <i className="fa-solid fa-times"></i>
        </button>
      )}
      <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
        {activePoppin.title}
      </h4>
      <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16, lineHeight: 1.5 }}>
        {activePoppin.message}
      </p>
      {activePoppin.buttonText && activePoppin.buttonLink && (
        <Link
          href={activePoppin.buttonLink}
          onClick={handleDismiss}
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.2)",
            color: activePoppin.textColor,
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {activePoppin.buttonText}
        </Link>
      )}
      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(100px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MarketingPopup;
