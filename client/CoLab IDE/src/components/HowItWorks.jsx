import React, { useEffect, useRef } from "react";
import { UserPlus, MessageSquare, Sparkles, Play } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 1,
        },
      });

      // Animate line
      tl.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: "top" },
        { scaleY: 1, duration: 1 }
      );

      // Animate steps
      stepsRef.current.forEach((step, index) => {
        tl.from(
          step,
          {
            opacity: 0,
            x: index % 2 === 0 ? -80 : 80,
            duration: 0.8,
            ease: "power3.out",
            force3D: true,
          },
          "-=0.5"
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      icon: UserPlus,
      number: "01",
      title: "Create Workspace",
      description:
        "Sign up and create your project workspace in seconds. Invite team members to collaborate.",
    },
    {
      icon: MessageSquare,
      number: "02",
      title: "Chat & Collaborate",
      description:
        "Communicate with your team in real-time. Discuss ideas and plan your code together.",
    },
    {
      icon: Sparkles,
      number: "03",
      title: "Ask AI to Code",
      description:
        "Describe what you want to build. AI generates executable code instantly using Gemini.",
    },
    {
      icon: Play,
      number: "04",
      title: "Run & Deploy",
      description:
        "Execute your code directly in the browser. See results instantly with WebContainers.",
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-32 bg-[#1a1c1e] text-white"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Start Coding in <br />
            <span className="bg-gradient-to-r from-[#efac1c] to-[#ffaf01] bg-clip-text text-transparent">
              Four Simple Steps
            </span>
          </h2>
        </div>

        {/* Timeline Wrapper */}
        <div className="relative max-w-4xl mx-auto">

          {/* Vertical Line */}
          <div
            ref={lineRef}
            className="absolute left-1/2 top-0 w-[2px] h-full bg-gradient-to-b from-[#ffaf01] to-transparent -translate-x-1/2 origin-top"
          />

          <div className="space-y-20">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  ref={(el) => (stepsRef.current[index] = el)}
                  className={`relative flex ${
                    isLeft ? "justify-start" : "justify-end"
                  }`}
                >
<div className="relative bg-[#26282a] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-xl hover:border-[#ffaf01] transition-colors duration-300">

                    {/* Step Number */}
                    <span className="absolute -top-6 right-6 text-7xl font-black text-[#ffaf01]/10">
                      {step.number}
                    </span>

                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-[#ffaf01]/10 flex items-center justify-center text-[#ffaf01] mb-6">
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-semibold mb-3">
                      {step.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
