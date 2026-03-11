import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Zoom logo on scroll
      gsap.to(contentRef.current, {
  scale: 4,
  opacity: 0,
  ease: "none",
  scrollTrigger: {
    trigger: heroRef.current,
    start: "top top",
    end: "bottom top",
    scrub: 0.5,
  },
});

      // Fade in next section
      gsap.fromTo(
        nextRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "bottom center",
            toggleActions: "play none none reverse",
          },
        }
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        className="h-[200vh] relative bg-black"
      >
{/* === BACKGROUND === */}

{/* Base dark layer with radial glow */}
<div className="absolute inset-0 bg-[#050505] bg-[radial-gradient(circle_at_50%_50%,rgba(255,175,1,0.12),transparent_60%)]"></div>

{/* Top/bottom gradient */}
<div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b] via-transparent to-black"></div>



        {/* Sticky Content */}
        
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden relative text-white">

  <div ref={contentRef} className="flex flex-col items-center relative will-change-transform">

    {/* Scroll to Enter (Above Logo) */}
    <div className="mb-6 tracking-[0.4em] text-xs uppercase text-gray-400">
      Scroll to Enter
    </div>
    

    {/* LOGO */}
    <h1 className="text-8xl md:text-9xl font-extrabold tracking-tight hero-logo">
    <span className="text-[#ffaf01]">
      Co
    </span>
    <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
      Lab
    </span>
  </h1>

  <div className="text-[#d49204] tracking-[0.4em] text-xs uppercase">
    Real-time AI collaboration platform
  </div>
  </div>
  

</div>
      </section>

      <div className="relative bg-black"></div>

    </>
  );
}
