import { useEffect } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import UseCases from "../components/UseCases";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import { initLenis } from "../utils/lenis";

const LandingPage = () => {
  useEffect(() => {
    initLenis();
  }, []);

  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
