import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroConfig } from '../config';
import { Lock, MessageSquare, Gamepad2, Play, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    const cards = cardsRef.current;

    if (!section || !title || !subtitle || !cta || !cards) return;

    const ctx = gsap.context(() => {
      // Title character animation
      const chars = title.querySelectorAll('.char');
      gsap.fromTo(chars,
        { opacity: 0, rotateX: 90, y: 50 },
        {
          opacity: 1,
          rotateX: 0,
          y: 0,
          duration: 0.6,
          stagger: 0.04,
          ease: 'expo.out',
          delay: 0.2,
        }
      );

      // Subtitle word animation
      const words = subtitle.querySelectorAll('.word');
      gsap.fromTo(words,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'expo.out',
          delay: 0.8,
        }
      );

      // CTA buttons
      gsap.fromTo(cta.children,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'elastic.out(1, 0.5)',
          delay: 1.2,
        }
      );

      // Floating cards
      const cardElements = cards.querySelectorAll('.glass-card');
      gsap.fromTo(cardElements,
        { opacity: 0, z: -500, scale: 0.5 },
        {
          opacity: 1,
          z: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'expo.out',
          delay: 0.6,
        }
      );

      // Continuous floating animation for cards
      cardElements.forEach((card, i) => {
        gsap.to(card, {
          y: '+=15',
          rotation: i % 2 === 0 ? 3 : -3,
          duration: 4 + i,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });

      // Scroll parallax effects
      gsap.to(title, {
        y: -150,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(subtitle, {
        y: -80,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(cards, {
        scale: 1.2,
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const titleChars = heroConfig.title.split('').map((char, i) => (
    <span key={i} className="char inline-block" style={{ transformStyle: 'preserve-3d' }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  const subtitleWords = heroConfig.subtitle.split(' ').map((word, i) => (
    <span key={i} className="word inline-block mr-2">
      {word}
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
      style={{ perspective: '1000px' }}
    >
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(234, 0, 0, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(234, 0, 0, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(30, 30, 30, 1) 0%, rgba(0, 0, 0, 1) 100%)
            `,
          }}
        />
        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-800/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            {/* Services label */}
            <div className="flex items-center gap-3 text-white/50 text-sm tracking-widest uppercase">
              <div className="w-8 h-px bg-white/30" />
              {heroConfig.servicesLabel}
            </div>

            {/* Main title */}
            <h1
              ref={titleRef}
              className="text-5xl sm:text-6xl lg:text-7xl font-medium text-white leading-tight"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {titleChars}
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed"
            >
              {subtitleWords}
            </p>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-wrap gap-4 pt-4">
              <button className="group relative px-8 py-4 bg-[#ea0000] text-white font-medium rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,0,0,0.4)]">
                <span className="relative z-10 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Enter Your Space
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff1a1a] to-[#cc0000] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button className="px-8 py-4 border border-white/20 text-white font-medium rounded-lg backdrop-blur-sm bg-white/5 transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:scale-105">
                Explore Features
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-6 text-sm text-white/50">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                4 Friends Online
              </span>
              <span>•</span>
              <span>End-to-End Encrypted</span>
              <span>•</span>
              <span>100% Private</span>
            </div>
          </div>

          {/* Right: Floating Glass Cards */}
          <div
            ref={cardsRef}
            className="relative h-[500px] hidden lg:block"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          >
            {/* Card 1 - Messages */}
            <div 
              className="glass-card absolute top-10 right-20 w-40 h-40 rounded-2xl flex flex-col items-center justify-center gap-3"
              style={{ 
                transform: 'translateZ(100px)',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <MessageSquare className="w-10 h-10 text-[#ea0000]" />
              <span className="text-white/80 text-sm font-medium">Messages</span>
            </div>

            {/* Card 2 - Games */}
            <div 
              className="glass-card absolute top-32 left-10 w-36 h-36 rounded-2xl flex flex-col items-center justify-center gap-3"
              style={{ 
                transform: 'translateZ(50px) rotate(-5deg)',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Gamepad2 className="w-9 h-9 text-[#ea0000]" />
              <span className="text-white/80 text-sm font-medium">Games</span>
            </div>

            {/* Card 3 - Watch */}
            <div 
              className="glass-card absolute bottom-20 right-10 w-44 h-44 rounded-2xl flex flex-col items-center justify-center gap-3"
              style={{ 
                transform: 'translateZ(150px) rotate(3deg)',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Play className="w-11 h-11 text-[#ea0000]" />
              <span className="text-white/80 text-sm font-medium">Watch Party</span>
            </div>

            {/* Card 4 - Security */}
            <div 
              className="glass-card absolute bottom-10 left-20 w-32 h-32 rounded-2xl flex flex-col items-center justify-center gap-2"
              style={{ 
                transform: 'translateZ(80px) rotate(5deg)',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Shield className="w-8 h-8 text-[#ea0000]" />
              <span className="text-white/80 text-xs font-medium">Secure</span>
            </div>

            {/* Decorative rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/5 rounded-full" />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
