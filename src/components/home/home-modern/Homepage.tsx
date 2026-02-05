"use client";
import React from "react";
import Header from "./components/Header";
import HeroSlider from "./components/HeroSlider";
import FeatureSection from "./components/FeatureSection";
import CenteredImage from "./components/CenteredImage";
import CenteredContent from "./components/CenteredContent";
import SignUpForm from "./components/SignUpForm";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import styles from "./styles/homepage.module.scss";

const Homepage = () => {
  return (
    <div className={styles.homepage}>
      <Header />

      {/* 1. Hero - Horizontal Scrolling Slider */}
      <HeroSlider />

      {/* 2. Image | Content - Key Benefit 1 */}
      <FeatureSection
        layout="image-left"
        title="Reach clients without leaving the chair"
        subtitle=""
        description="50 years ago, this was not possible. Now you can call them and close them while sitting on your chair. With 99Sellers, access hundreds of motivated sellers at your fingertips."
        features={[
          "Direct contact information for sellers",
          "Skip-traced phone and email data",
          "Updated daily from public records"
        ]}
        image="/images/home/benefit-reach.jpg"
        imageAlt="Reach clients remotely"
        ctaText="Get Started"
        ctaLink="/signup"
      />

      {/* 3. Content | Image - Key Benefit 2 */}
      <FeatureSection
        layout="image-right"
        title="Save Time and Effort"
        subtitle=""
        description="Not only you get more clients with 99Sellers account, you get MORE TIME!! No more driving around looking for 'For Sale' signs or cold calling from outdated lists."
        features={[
          "All leads in one dashboard",
          "Filter by location, equity, and more",
          "Export leads instantly"
        ]}
        image="/images/home/benefit-time-new.png"
        imageAlt="Save time with 99Sellers"
        ctaText="Learn More"
        ctaLink="/features"
      />

      {/* 4. Image in Center */}
      <CenteredImage
        image="/images/home/platform-showcase.jpg"
        imageAlt="99Sellers Platform Dashboard"
        caption="The 99Sellers dashboard - your command center for finding motivated sellers"
      />

      {/* 5. Content in Center */}
      <CenteredContent
        subtitle="Why Choose Us"
        title="99Sellers got you covered"
        description="For a closer, selling a distressed home might be an easy task. But finding an appropriate seller? That's where it's challenging. So why make it so hard on yourself?"
      />

      {/* 6. Image | Content - Benefit 3 */}
      <FeatureSection
        layout="image-left"
        title="10X your PROFIT!!"
        subtitle=""
        description="Simple tiny account giving the mountain size ROI is the biggest benefit. Join thousands of agents who have multiplied their deals using our platform."
        features={[
          "Access to 12.5M+ leads nationwide",
          "98% skip tracing accuracy",
          "Coverage in all 50 states"
        ]}
        image="/images/home/benefit-profit-new.png"
        imageAlt="Maximize your profit"
        ctaText="Start Free Trial"
        ctaLink="/signup"
      />

      {/* 7. Content | Image - How It Works */}
      <FeatureSection
        layout="image-right"
        title="How It Works"
        subtitle=""
        description="Getting started with 99Sellers is simple. Sign up, choose your target area, and start receiving leads immediately. Our platform does the heavy lifting for you."
        features={[
          "Create your free account",
          "Set your search criteria",
          "Receive fresh leads daily",
          "Close more deals"
        ]}
        image="/images/home/how-it-works-new.png"
        imageAlt="How 99Sellers works"
        ctaText="See Demo"
        ctaLink="#demo"
      />

      {/* Sign Up Form */}
      <SignUpForm />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* 8. Call to Action */}
      <FinalCTA />

      <Footer />
    </div>
  );
};

export default Homepage;
