import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gamesConfig } from '../config';
import type { GameItem } from '../config';
import { Play, Star, Users, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Games() { 
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [playingGame, setPlayingGame] = useState<GameItem | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const grid = gridRef.current;

    if (!section || !title || !grid) return;

    const ctx = gsap.context(() => {
      // Title animation
      const chars = title.querySelectorAll('.title-char');
      gsap.fromTo(chars,
        { opacity: 0, y: 50, rotation: () => gsap.utils.random(-20, 20) },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Underline draw
      const underline = title.querySelector('.title-underline');
      if (underline) {
        gsap.fromTo(underline,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.6,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.4,
          }
        );
      }

      // Game cards animation
      const cards = grid.querySelectorAll('.game-card');
      cards.forEach((card, i) => {
        const rotation = i % 2 === 0 ? -10 : 10;
        gsap.fromTo(card,
          { opacity: 0, y: 100, rotation },
          {
            opacity: 1,
            y: 0,
            rotation: (i % 3 - 1) * 2,
            duration: 0.6,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.5 + i * 0.1,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const titleChars = gamesConfig.title.split('').map((char, i) => (
    <span key={i} className="title-char inline-block">
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  const featuredGame = gamesConfig.games.find(g => g.featured);
  const otherGames = gamesConfig.games.filter(g => !g.featured);

  return (
    <section
      ref={sectionRef}
      id="games"
      className="relative py-32 bg-black overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-4">
            {titleChars}
          </h2>
          <div className="title-underline w-32 h-1 bg-[#ea0000] mx-auto origin-left" />
          <p className="text-xl text-white/60 mt-6 max-w-2xl mx-auto">
            {gamesConfig.subtitle}
          </p>
        </div>

        {/* Games Grid */}
        <div ref={gridRef} className="space-y-8">
          {/* Featured Game */}
          {featuredGame && (
            <div 
              className="game-card group relative rounded-3xl overflow-hidden cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-64 lg:h-96 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-[#ea0000]/30 to-purple-900/30"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <Star className="w-16 h-16 text-[#ea0000]" />
                    </div>
                  </div>
                  {/* Featured badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#ea0000] rounded-full text-white text-sm font-medium">
                    Featured
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <span className="text-[#ea0000] text-sm font-medium mb-2">
                    {featuredGame.category}
                  </span>
                  <h3 className="text-3xl lg:text-4xl font-medium text-white mb-4">
                    {featuredGame.title}
                  </h3>
                  <p className="text-white/60 text-lg mb-6">
                    {featuredGame.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setPlayingGame(featuredGame)}
                      className="flex items-center gap-2 px-6 py-3 bg-[#ea0000] text-white rounded-lg hover:bg-[#ff1a1a] transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      Play Now
                    </button>
                    <div className="flex items-center gap-2 text-white/50">
                      <Users className="w-5 h-5" />
                      <span>2-4 Players</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Games Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherGames.map((game, index) => (
              <div
                key={game.id}
                className="game-card group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transform: `rotate(${(index % 3 - 1) * 1}deg)`,
                }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-[#ea0000]/20 transition-colors">
                      {game.category === 'Adult' ? (
                        <span className="text-2xl">🔞</span>
                      ) : (
                        <GameIcon name={game.title} />
                      )}
                    </div>
                  </div>
                  {/* Category badge */}
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${
                    game.category === 'Adult' 
                      ? 'bg-red-900/80 text-red-200' 
                      : 'bg-white/10 text-white/70'
                  }`}>
                    {game.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-medium text-white mb-2 group-hover:text-[#ea0000] transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    {game.description}
                  </p>
                  <button 
                    onClick={() => setPlayingGame(game)}
                    className="flex items-center gap-2 text-[#ea0000] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-4 h-4" />
                    Play Now
                  </button>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 30px rgba(234, 0, 0, 0.1)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Player Overlay */}
      {playingGame && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={() => setPlayingGame(null)}
          />
          
          <div className="relative w-full max-w-6xl h-[85vh] bg-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/50 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#ea0000] flex items-center justify-center">
                  <GameIcon name={playingGame.title} />
                </div>
                <div>
                  <h3 className="text-white font-medium">{playingGame.title}</h3>
                  <p className="text-white/50 text-xs">{playingGame.category} • Press Esc to close</p>
                </div>
              </div>
              <button 
                onClick={() => setPlayingGame(null)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                title="Close Game"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Iframe Area */}
            <div className="flex-1 w-full bg-black">
              {playingGame.embedUrl ? (
                <iframe 
                  src={playingGame.embedUrl} 
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen"
                  title={playingGame.title}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
                  <Play className="w-16 h-16 mb-4 opacity-20" />
                  <p>Game embed not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Escape to Close */}
      {playingGame && (
        <div className="hidden">
          {/* We rely on global listener usually, but a quick effect is best */}
        </div>
      )}
    </section>
  );
}

// Helper component for game icons
function GameIcon({ name }: { name: string }) {
  const iconMap: Record<string, string> = {
    'Chess': '♟️',
    'Monopoly': '🎲',
    'Carroms': '🔴',
    'Jenga': '🧱',
    'Uno': '🃏',
    '8 Ball Pool': '🎱',
    'Ludo': '🎲',
  };
  
  return (
    <span className="text-3xl">{iconMap[name] || '🎮'}</span>
  );
}
