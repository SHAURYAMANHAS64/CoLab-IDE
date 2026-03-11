import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleNavigate = () => {
    window.location.href = "/register";
  };

  return (
    <section
      ref={sectionRef}
      className="py-32 bg-[#111113] text-white relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">

        <div
          ref={contentRef}
          className="relative bg-[#1a1c1e] border border-white/10 rounded-3xl p-16 text-center overflow-hidden"
        >

          {/* Glow Background */}
          {/* <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#ffaf01]/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          </div> */}

          <div className="relative z-10">

            {/* Badge */}
            <div className="inline-flex items-center bg-white/10 rounded-full px-5 py-2 mb-8 text-sm font-medium">
              Ready to Transform Your Workflow?
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Start Building with AI <br />
              <span className="text-[#ffaf01]">Today</span>
            </h2>

            {/* Subtitle */}
            <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of developers who are already coding smarter with
              AI-powered collaboration
            </p>

            {/* Button */}
            <button onClick={handleNavigate} className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-[#ffaf01] text-black font-semibold text-lg hover:scale-105 transition-all duration-300 group">
              Start Coding Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
