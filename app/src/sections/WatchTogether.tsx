import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { watchConfig, friendsList } from '../config';
import { Youtube, Play, PlayCircle, Star, Monitor, Mic, Smile, List } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Youtube,
  Play,
  PlayCircle,
  Star,
};

export function WatchTogether() {
  const sectionRef = useRef<HTMLElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const platformsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const screen = screenRef.current;
    const platforms = platformsRef.current;
    const content = contentRef.current;

    if (!section || !screen || !platforms || !content) return;

    const ctx = gsap.context(() => {
      // Screen entrance
      gsap.fromTo(screen,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Ambient glow
      const glow = screen.querySelector('.ambient-glow');
      if (glow) {
        gsap.fromTo(glow,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 0.5,
            scale: 1,
            duration: 1,
            ease: 'smooth',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.2,
          }
        );

        // Pulsing animation
        gsap.to(glow, {
          opacity: 0.6,
          duration: 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      // Platforms orbit in
      const platformItems = platforms.querySelectorAll('.platform-item');
      platformItems.forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.6 + i * 0.12,
          }
        );
      });

      // Content entrance
      gsap.fromTo(content.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Scroll zoom effect on screen
      gsap.to(screen, {
        scale: 1.1,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="watch"
      className="relative py-32 bg-black overflow-hidden"
    >
      {/* Cinematic gradient background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at 50% 100%, rgba(234, 0, 0, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 0%, rgba(0, 100, 255, 0.05) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Screen Mockup */}
        <div ref={screenRef} className="relative mb-16">
          {/* Ambient glow behind screen */}
          <div 
            className="ambient-glow absolute -inset-8 rounded-3xl blur-3xl"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(234, 0, 0, 0.2) 0%, transparent 70%)',
            }}
          />

          {/* Screen */}
          <div 
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(234, 0, 0, 0.1)',
            }}
          >
            {/* Screen Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-white/50" />
                <span className="text-white/70 text-sm">Watch Party</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white/50 text-sm">4 watching</span>
              </div>
            </div>

            {/* Video Area */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              {/* Film frame effect */}
              <div className="absolute inset-4 border border-white/5 rounded-lg" />
              
              {/* Play button */}
              <div className="relative z-10 text-center">
                <button className="w-20 h-20 rounded-full bg-[#ea0000]/90 flex items-center justify-center hover:bg-[#ea0000] hover:scale-110 transition-all duration-300 group">
                  <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                </button>
                <p className="text-white/50 mt-4 text-sm">Click to start watching together</p>
              </div>

              {/* Reactions overlay */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Smile className="w-5 h-5 text-white/70" />
                </button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                  <span className="text-xl hover:scale-125 transition-transform cursor-pointer">🔥</span>
                  <span className="text-xl hover:scale-125 transition-transform cursor-pointer">😂</span>
                  <span className="text-xl hover:scale-125 transition-transform cursor-pointer">❤️</span>
                  <span className="text-xl hover:scale-125 transition-transform cursor-pointer">😱</span>
                </div>
              </div>
            </div>

            {/* Screen Footer */}
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {friendsList.slice(0, 4).map((friend, i) => (
                    <div 
                      key={friend.id}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-black flex items-center justify-center text-white text-xs font-medium"
                      style={{ zIndex: 4 - i }}
                    >
                      {friend.name[0]}
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ea0000]/20 text-[#ea0000] text-sm hover:bg-[#ea0000]/30 transition-colors">
                  <Mic className="w-4 h-4" />
                  Voice Chat
                </button>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <List className="w-4 h-4" />
                <span>Playlist</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
            {watchConfig.title}
          </h2>
          <p className="text-xl text-white/60 mb-12">
            {watchConfig.subtitle}
          </p>

          {/* Platform Icons */}
          <div ref={platformsRef} className="flex flex-wrap justify-center gap-4 mb-12">
            {watchConfig.platforms.map((platform, index) => {
              const Icon = iconMap[platform.icon] || Play;
              return (
                <div
                  key={index}
                  className="platform-item flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: platform.color }}
                  />
                  <span className="text-white/80 text-sm font-medium">{platform.name}</span>
                </div>
              );
            })}
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {watchConfig.features.map((feature, index) => (
              <div
                key={index}
                className="p-4 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <p className="text-white/70 text-sm">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
