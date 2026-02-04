"use client";
import React from "react";
import Header from "./components/Header";
import HeroSlider from "./components/HeroSlider";
import LogoMarquee from "./components/LogoMarquee";
import HowItWorks from "./components/HowItWorks";
import DashboardShowcase from "./components/VideoShowcase";
import FeatureSection from "./components/FeatureSection";
import InvestorPlatformSection from "./components/InvestorPlatformSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import PremiumCTA from "./components/PremiumCTA";
import Footer from "./components/Footer";
import styles from "./styles/homepage.module.scss";

const Homepage = () => {
  return (
    <div className={styles.homepage}>
      <Header />
      
      {/* Hero Slider */}
      <HeroSlider />
      
      {/* Trusted By Logos */}
      <LogoMarquee />
      
      {/* How It Works - Step by Step */}
      <HowItWorks />
      
      {/* Dashboard Demo Section - Animated Preview */}
      <DashboardShowcase />
      
      {/* Feature Section 1: Fresh Leads */}
      <FeatureSection
        layout="image-left"
        title="Fresh Leads Delivered Daily"
        subtitle=""
        description="Our data engine scrapes thousands of public records sources daily, delivering the freshest motivated seller leads to your dashboard."
        features={[
          "Updated daily from 3,200+ county records",
          "Skip-traced with 98% accuracy",
          "Verified email addresses",
          "Property details including equity"
        ]}
        image="/images/home/property-phoenix.png"
        imageAlt="Real-time data dashboard"
        ctaText="See Fresh Leads"
        ctaLink="/search"
        stats={[
          { value: "3,200+", label: "Counties" },
          { value: "Daily", label: "Updates" }
        ]}
      />
      
      {/* Feature Section 2: Skip Tracing */}
      <FeatureSection
        layout="image-right"
        title="Reach Sellers on the First Call"
        subtitle=""
        description="Our skip tracing technology cross-references multiple sources to find the most accurate contact information for property owners."
        features={[
          "Multi-source verification",
          "Cell, landline, and email data",
          "Real-time carrier verification",
          "Unlimited skip traces on Premium"
        ]}
        image="/images/home/property-denver.png"
        imageAlt="Skip tracing feature"
        ctaText="Try Skip Tracing"
        ctaLink="/search"
        stats={[
          { value: "98%", label: "Accuracy" },
          { value: "2.1s", label: "Avg Time" }
        ]}
      />
      
      {/* Power Stats Section */}
      <InvestorPlatformSection />
      
      {/* Feature Section 3: Lead Types */}
      <FeatureSection
        layout="image-left"
        title="Every Motivated Seller Category"
        subtitle=""
        description="From foreclosures to probate, we cover every major category of distressed sellers. No need for multiple subscriptions."
        features={[
          "Foreclosures & Pre-Foreclosures",
          "Divorce Filings & Court Records",
          "Tax Liens & Delinquent Taxes",
          "Probate & Inherited Properties",
          "Code Violations & Evictions"
        ]}
        image="/images/home/property-austin.png"
        imageAlt="Lead categories"
        ctaText="Explore Lead Types"
        ctaLink="/search"
      />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* Final CTA */}
      <PremiumCTA />
      
      <Footer />
    </div>
  );
};

export default Homepage;
