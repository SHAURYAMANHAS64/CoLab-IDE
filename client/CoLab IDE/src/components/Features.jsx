import React, { useEffect, useRef } from "react";
import { Sparkles, Users, Zap, Cloud, Lock, Code2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray(".feature-row");

      rows.forEach((row) => {
        gsap.fromTo(
          row.children,
          {
            opacity: 0,
            y: 80,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            force3D: true,
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "AI Code Generation",
      description:
        "Let AI write code for you. Powered by Google Gemini for intelligent, context-aware code generation.",
      image:
        "https://images.unsplash.com/photo-1595623654300-b27329804025?w=500&q=75&auto=format",
    },
    {
      icon: Users,
      title: "Real-Time Collaboration",
      description:
        "Code together with your team. See changes instantly and chat while you work.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=75&auto=format",
    },
    {
      icon: Zap,
      title: "Instant Execution",
      description:
        "Run Node.js apps directly in your browser with WebContainers. No server setup needed.",
      image:
        "https://images.unsplash.com/photo-1623715537851-8bc15aa8c145?w=500&q=75&auto=format",
    },
    {
      icon: Cloud,
      title: "Cloud Workspaces",
      description:
        "Access your projects from anywhere. Everything is saved and synced in real-time.",
      image:
        "https://images.unsplash.com/photo-1611648694931-1aeda329f9da?w=500&q=75&auto=format",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description:
        "Enterprise-grade security with authentication and encrypted data transmission.",
      image:
        "https://images.pexels.com/photos/6177683/pexels-photo-6177683.jpeg?auto=compress&w=500",
    },
    {
      icon: Code2,
      title: "Zero Setup",
      description:
        "Start coding immediately. No installations, no configurations, just pure productivity.",
      image:
        "https://images.unsplash.com/photo-1637073849667-91120a924221?w=500&q=75&auto=format",
    },
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-32 bg-[#111113]"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#ffaf01]/10 border border-[#ffaf01]/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#ffaf01]" />
            <span className="text-sm font-medium text-[#ffaf01]">
              Features
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Everything You Need to <br />
            <span className="bg-gradient-to-r from-[#ffaf01] to-[#ffaf01] bg-clip-text text-transparent">
              Code Smarter
            </span>
          </h2>

          <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto">
            A complete development environment designed for modern teams
          </p>
        </div>

        {/* Row 1 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 feature-row mb-8">
          {features.slice(0, 3).map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-[#1a1c1e] border border-white/10 rounded-2xl overflow-hidden hover:border-[#ffaf01] transition-colors duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    loading="lazy"
                    decoding="async"
                    width={500}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-[#ffaf01]/10 flex items-center justify-center text-[#ffaf01] mb-6">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 2 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 feature-row">
          {features.slice(3, 6).map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-[#1a1c1e] border border-white/10 rounded-2xl overflow-hidden hover:border-[#ffaf01] transition-colors duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    loading="lazy"
                    decoding="async"
                    width={500}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-[#ffaf01]/10 flex items-center justify-center text-[#ffaf01] mb-6">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Features;
