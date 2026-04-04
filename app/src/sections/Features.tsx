import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { featuresConfig } from '../config';
import { MessageSquare, Video, Users, Gamepad2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  MessageSquare,
  Video,
  Users,
  Gamepad2,
};

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current;

    if (!section || !title || !cards) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(title,
        { opacity: 0, x: -100, rotation: -10 },
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger animation
      const cardElements = cards.querySelectorAll('.feature-card');
      cardElements.forEach((card, i) => {
        const direction = i % 2 === 0 ? -90 : 90;
        gsap.fromTo(card,
          { opacity: 0, rotateY: direction },
          {
            opacity: 1,
            rotateY: 0,
            duration: 0.6,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.4 + i * 0.12,
          }
        );
      });

      // Parallax effect on cards
      cardElements.forEach((card, i) => {
        const yOffset = i % 2 === 0 ? 30 : -30;
        gsap.to(card, {
          y: yOffset,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-32 bg-black overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/5 to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6"
          >
            {featuresConfig.title}
          </h2>
          <p className="text-xl text-white/60 max-w-2xl">
            {featuresConfig.subtitle}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ perspective: '1200px' }}
        >
          {featuresConfig.features.map((feature) => {
            const Icon = iconMap[feature.icon] || MessageSquare;
            return (
              <div
                key={feature.id}
                className="feature-card group relative p-8 rounded-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(234, 0, 0, 0.15) 0%, transparent 70%)',
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-[#ea0000]/10 flex items-center justify-center mb-6 group-hover:bg-[#ea0000]/20 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-[#ea0000] group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Number */}
                  <span className="text-5xl font-bold text-white/5 absolute top-6 right-6">
                    {feature.id}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-medium text-white mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Border glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    border: '1px solid rgba(234, 0, 0, 0.3)',
                    boxShadow: '0 0 20px rgba(234, 0, 0, 0.1)',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
