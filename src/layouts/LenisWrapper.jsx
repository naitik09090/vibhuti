import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LenisWrapper({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Expose globally so ScrollToTop and other components can call lenis.scrollTo(0)
    window.__lenis = lenis;

    // Ensure page starts from top on first load
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Link Lenis to GSAP ticker
    const gsapUpdate = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapUpdate);

    // Custom animation frame loop for Lenis
    let rafId;
    const update = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      gsap.ticker.remove(gsapUpdate);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return <>{children}</>;
}
