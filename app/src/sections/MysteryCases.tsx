import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mysteryConfig } from '../config';
import { Search, Lock, Unlock, Clock, Users, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function MysteryCases() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [hoveredCase, setHoveredCase] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cursor = cursorRef.current;
    const cards = cardsRef.current;

    if (!section || !title || !cursor || !cards) return;

    const ctx = gsap.context(() => {
      // Typewriter effect for title
      const text = mysteryConfig.title;
      title.innerHTML = '';
      
      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        title.appendChild(span);
        
        gsap.to(span, {
          opacity: 1,
          duration: 0.05,
          delay: i * 0.08,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Cursor blink
      gsap.to(cursor, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)',
        delay: text.length * 0.08,
      });

      // Cards deal animation
      const cardElements = cards.querySelectorAll('.case-card');
      cardElements.forEach((card, i) => {
        gsap.fromTo(card,
          { 
            opacity: 0, 
            rotation: gsap.utils.random(-30, 30),
            y: 100,
            scale: 0.8,
          },
          {
            opacity: 1,
            rotation: (i % 2 === 0 ? -2 : 2),
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.8 + i * 0.15,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'Advanced': return 'bg-orange-500/20 text-orange-400';
      case 'Expert': return 'bg-red-500/20 text-red-400';
      default: return 'bg-white/10 text-white/60';
    }
  };

  return (
    <section
      ref={sectionRef}
      id="mystery"
      className="relative py-32 bg-black overflow-hidden"
    >
      {/* Detective-themed background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.02) 10px,
            rgba(255,255,255,0.02) 20px
          )`,
        }} />
      </div>

      {/* Fingerprint overlay */}
      <div className="absolute top-20 right-20 w-64 h-64 opacity-5">
        <svg viewBox="0 0 100 100" className="w-full h-full text-white">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-4 inline-block"
          >
            {mysteryConfig.title}
          </h2>
          <span 
            ref={cursorRef}
            className="inline-block w-1 h-12 bg-[#ea0000] ml-1 align-middle"
          />
          <p className="text-xl text-white/60 mt-6 max-w-2xl mx-auto">
            {mysteryConfig.subtitle}
          </p>
        </div>

        {/* Case Files Grid */}
        <div 
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {mysteryConfig.cases.map((caseItem, index) => (
            <div
              key={caseItem.id}
              className="case-card group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transform: `rotate(${(index % 2 === 0 ? -2 : 2)}deg)`,
              }}
              onMouseEnter={() => setHoveredCase(caseItem.id)}
              onMouseLeave={() => setHoveredCase(null)}
            >
              {/* Case Image */}
              <div className="relative h-48 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-red-900/30 transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Mystery icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:bg-[#ea0000]/10 transition-colors">
                    <Search className="w-10 h-10 text-white/50 group-hover:text-[#ea0000] transition-colors" />
                  </div>
                </div>

                {/* Difficulty badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(caseItem.difficulty)}`}>
                  {caseItem.difficulty}
                </div>

                {/* Lock overlay */}
                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${hoveredCase === caseItem.id ? 'opacity-0' : 'opacity-100'}`}>
                  <Lock className="w-8 h-8 text-white/30" />
                </div>
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${hoveredCase === caseItem.id ? 'opacity-100' : 'opacity-0'}`}>
                  <Unlock className="w-8 h-8 text-[#ea0000]" />
                </div>
              </div>

              {/* Case Content */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-2 group-hover:text-[#ea0000] transition-colors">
                  {caseItem.title}
                </h3>
                <p className="text-white/50 text-sm mb-4 line-clamp-2">
                  {caseItem.description}
                </p>

                {/* Case stats */}
                <div className="flex items-center gap-4 text-white/40 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    45-60 min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    2-4 players
                  </span>
                </div>

                {/* Solve button */}
                <button className={`mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  hoveredCase === caseItem.id
                    ? 'bg-[#ea0000] text-white'
                    : 'bg-white/5 text-white/50'
                }`}>
                  Investigate
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 30px rgba(234, 0, 0, 0.1)',
                  border: '1px solid rgba(234, 0, 0, 0.2)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Detective note */}
        <div className="mt-16 text-center">
          <div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Search className="w-5 h-5 text-[#ea0000]" />
            <span className="text-white/60 text-sm">
              New cases added weekly. Stay sharp, detective.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
