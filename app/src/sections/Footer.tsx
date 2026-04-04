import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { footerConfig, friendsList } from '../config';
import { Lock, MessageSquare, Twitter, Instagram, Github, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const marquee = marqueeRef.current;
    const content = contentRef.current;

    if (!footer || !marquee || !content) return;

    const ctx = gsap.context(() => {
      // Marquee animation
      const marqueeContent = marquee.querySelector('.marquee-content');
      if (marqueeContent) {
        gsap.to(marqueeContent, {
          x: '-50%',
          duration: 30,
          ease: 'none',
          repeat: -1,
        });
      }

      // Content entrance
      const columns = content.querySelectorAll('.footer-column');
      gsap.fromTo(columns,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Social icons
      const socials = content.querySelectorAll('.social-icon');
      gsap.fromTo(socials,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: footer,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          delay: 0.4,
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  // Create marquee text with highlighted characters
  const createMarqueeText = () => {
    const text = footerConfig.marqueeText;
    return text.split('').map((char, i) => {
      const isHighlighted = footerConfig.marqueeHighlightChars.includes(char);
      return (
        <span 
          key={i} 
          className={`inline-block ${isHighlighted ? 'text-[#ea0000]' : 'text-white/10'}`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <footer ref={footerRef} className="relative bg-black overflow-hidden">
      {/* Marquee */}
      <div 
        ref={marqueeRef}
        className="py-8 border-t border-b border-white/5 overflow-hidden"
      >
        <div className="marquee-content flex whitespace-nowrap">
          <span className="text-[120px] sm:text-[180px] lg:text-[220px] font-bold tracking-tighter mx-8">
            {createMarqueeText()}
          </span>
          <span className="text-[120px] sm:text-[180px] lg:text-[220px] font-bold tracking-tighter mx-8">
            {createMarqueeText()}
          </span>
        </div>
      </div>

      {/* Footer Content */}
      <div 
        ref={contentRef}
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="footer-column lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#ea0000] flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-medium text-white">FriendSpace</span>
            </div>
            <p className="text-white/50 mb-6 max-w-sm">
              {footerConfig.tagline}
            </p>

            {/* Online friends */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {friendsList.map((friend, i) => (
                  <div 
                    key={friend.id}
                    className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-white text-xs font-medium ${
                      friend.status === 'online' ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                    style={{ zIndex: friendsList.length - i }}
                    title={friend.name}
                  >
                    {friend.name[0]}
                  </div>
                ))}
              </div>
              <span className="text-white/40 text-sm">
                3 of 4 friends online
              </span>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="footer-column">
            <h4 className="text-white font-medium mb-4">Product</h4>
            <ul className="space-y-3">
              {footerConfig.navLinks1.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-white/50 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="footer-column">
            <h4 className="text-white font-medium mb-4">Support</h4>
            <ul className="space-y-3">
              {footerConfig.navLinks2.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-white/50 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <p className="text-white/40 text-sm">
            {footerConfig.copyright}
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="social-icon w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-[#ea0000] hover:text-white transition-all duration-300 hover:scale-110"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="social-icon w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-[#ea0000] hover:text-white transition-all duration-300 hover:scale-110"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="social-icon w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-[#ea0000] hover:text-white transition-all duration-300 hover:scale-110"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="social-icon w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-[#ea0000] hover:text-white transition-all duration-300 hover:scale-110"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
          </div>

          {/* Made with love */}
          <p className="text-white/40 text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-[#ea0000] fill-[#ea0000]" /> for friends
          </p>
        </div>
      </div>
    </footer>
  );
}
