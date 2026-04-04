import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ctaConfig } from '../config';
import { Sparkles, ArrowRight, Plus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const buttons = buttonsRef.current;
    const decor = decorRef.current;

    if (!section || !title || !buttons || !decor) return;

    const ctx = gsap.context(() => {
      // Title lines animation
      const lines = title.querySelectorAll('.title-line');
      gsap.fromTo(lines[0],
        { opacity: 0, x: -200 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
      gsap.fromTo(lines[1],
        { opacity: 0, x: 200 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          delay: 0.15,
        }
      );

      // Buttons animation
      gsap.fromTo(buttons.children,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
          delay: 0.4,
        }
      );

      // Decorative elements
      const shapes = decor.querySelectorAll('.decor-shape');
      gsap.fromTo(shapes,
        { opacity: 0, scale: 0 },
        {
          opacity: 0.1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
          delay: 0.3,
        }
      );

      // Continuous floating for shapes
      shapes.forEach((shape, i) => {
        gsap.to(shape, {
          y: gsap.utils.random(-20, 20),
          x: gsap.utils.random(-10, 10),
          rotation: gsap.utils.random(-10, 10),
          duration: 4 + i,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-black overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at 30% 50%, rgba(234, 0, 0, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 50%, rgba(234, 0, 0, 0.1) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Decorative shapes */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="decor-shape absolute top-20 left-20 w-16 h-16 border border-white/10 rounded-lg" />
        <div className="decor-shape absolute top-40 right-32 w-12 h-12 border border-white/10 rounded-full" />
        <div className="decor-shape absolute bottom-32 left-40 w-20 h-20 border border-[#ea0000]/10 rotate-45" />
        <div className="decor-shape absolute bottom-20 right-20 w-8 h-8 bg-[#ea0000]/5 rounded-full" />
        <div className="decor-shape absolute top-1/2 left-10 w-6 h-6 border border-white/5 rounded-lg" />
        <div className="decor-shape absolute top-1/3 right-16 w-10 h-10 border border-white/10" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center">
          {/* Title */}
          <h2 
            ref={titleRef}
            className="text-5xl sm:text-6xl lg:text-7xl font-medium text-white mb-6"
          >
            <span className="title-line block">{ctaConfig.title.split(' ').slice(0, 2).join(' ')}</span>
            <span className="title-line block text-[#ea0000]">{ctaConfig.title.split(' ').slice(2).join(' ')}</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-white/60 mb-12 max-w-xl mx-auto">
            {ctaConfig.subtitle}
          </p>

          {/* Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap justify-center gap-4">
            <button className="group relative px-8 py-4 bg-[#ea0000] text-white font-medium rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(234,0,0,0.4)]">
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                {ctaConfig.primaryButton}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff1a1a] to-[#cc0000] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button className="group px-8 py-4 border border-white/20 text-white font-medium rounded-xl backdrop-blur-sm bg-white/5 transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:scale-105 flex items-center gap-3">
              <Plus className="w-5 h-5" />
              {ctaConfig.secondaryButton}
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/40 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              End-to-end encrypted
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Free forever
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
