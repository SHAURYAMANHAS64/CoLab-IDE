import React, { useEffect, useRef } from "react";
import { GraduationCap, Briefcase, Lightbulb, Rocket } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const UseCases = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            force3D: true,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            delay: index * 0.15,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const useCases = [
    {
      icon: GraduationCap,
      title: "Education & Learning",
      description:
        "Perfect for students and educators. Learn coding with instant feedback and AI assistance.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=75&auto=format",
    },
    {
      icon: Briefcase,
      title: "Remote Teams",
      description:
        "Collaborate seamlessly across time zones. Real-time sync keeps everyone on the same page.",
      image:
        "https://images.unsplash.com/photo-1622675363311-3e1904dc1885?w=600&q=75&auto=format",
    },
    {
      icon: Lightbulb,
      title: "Rapid Prototyping",
      description:
        "Turn ideas into working prototypes in minutes. AI accelerates your development workflow.",
      image:
        "https://images.unsplash.com/photo-1623715537851-8bc15aa8c145?w=600&q=75&auto=format",
    },
    {
      icon: Rocket,
      title: "Hackathons & Events",
      description:
        "Build fast, collaborate easily. Perfect for time-constrained coding events and competitions.",
      image:
        "https://images.unsplash.com/photo-1611648694931-1aeda329f9da?w=600&q=75&auto=format",
    },
  ];

  return (
    <section
      id="use-cases"
      ref={sectionRef}
      className="py-32 bg-[#111113]"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#ffaf01]/10 border border-[#ffaf01]/20 rounded-full px-4 py-2 mb-6">
            <Lightbulb className="w-4 h-4 text-[#ffaf01]" />
            <span className="text-sm font-medium text-[#ffaf01]">
              Use Cases
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Built for <br />
            <span className="bg-gradient-to-r from-[#dba736] to-[#ffaf01] bg-clip-text text-transparent">
              Every Developer
            </span>
          </h2>

          <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto">
            Whether you're learning, teaching, or building the next big thing
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-10">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;

            return (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="group bg-[#1a1c1e] border border-white/10 rounded-2xl overflow-hidden hover:border-[#ffaf01] transition-colors duration-300"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={useCase.image}
                    alt={useCase.title}
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={240}
                    className="w-full h-full object-cover"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="w-16 h-16 rounded-xl bg-[#ffaf01]/10 flex items-center justify-center text-[#ffaf01] mb-6">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {useCase.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {useCase.description}
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

export default UseCases;
