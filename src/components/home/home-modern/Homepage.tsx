"use client";
import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LeadTypes from "./components/LeadTypes";
import WhyChooseUs from "./components/WhyChooseUs";
import SampleLeadTable from "./components/SampleLeadTable";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import RecentDeals from "./components/RecentDeals";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import styles from "./styles/homepage.module.scss";

const Homepage = () => {
  return (
    <div className={styles.homepage}>
      <Header />
      <Hero />
      <LeadTypes />
      <WhyChooseUs />
      <SampleLeadTable />
      <HowItWorks />
      <Features />
      <RecentDeals />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default Homepage;
