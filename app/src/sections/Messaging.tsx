import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { messagingConfig } from '../config';
import { Check, CheckCheck, Mic, Paperclip, Smile, Send, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Messaging() {
  const sectionRef = useRef<HTMLElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const chat = chatRef.current;
    const content = contentRef.current;

    if (!section || !chat || !content) return;

    const ctx = gsap.context(() => {
      // Chat container entrance
      gsap.fromTo(chat,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Message bubbles pop in
      const messages = chat.querySelectorAll('.message-bubble');
      messages.forEach((msg, i) => {
        gsap.fromTo(msg,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.3 + i * 0.2,
          }
        );
      });

      // Content entrance
      gsap.fromTo(content.children,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
          delay: 0.2,
        }
      );

      // Chat parallax
      gsap.to(chat, {
        y: -30,
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
      id="messaging"
      className="relative py-32 bg-black overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Chat Interface Mockup */}
          <div
            ref={chatRef}
            className="relative"
          >
            <div 
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ea0000] to-[#990000] flex items-center justify-center text-white font-medium">
                      G
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Game Night Squad</h4>
                    <p className="text-white/50 text-sm">4 members • 3 online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/50">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs">Encrypted</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 space-y-4 h-[400px] overflow-hidden">
                {/* Message 1 */}
                <div className="message-bubble flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-medium">
                    A
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/70 text-sm font-medium">Alex</span>
                      <span className="text-white/30 text-xs">2:30 PM</span>
                    </div>
                    <div 
                      className="inline-block px-4 py-2 rounded-2xl rounded-tl-sm"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <p className="text-white/90">Who's up for Ludo tonight? 🎲</p>
                    </div>
                  </div>
                </div>

                {/* Message 2 */}
                <div className="message-bubble flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-medium">
                    J
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/70 text-sm font-medium">Jordan</span>
                      <span className="text-white/30 text-xs">2:31 PM</span>
                    </div>
                    <div 
                      className="inline-block px-4 py-2 rounded-2xl rounded-tl-sm"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <p className="text-white/90">Count me in! What time? ⏰</p>
                    </div>
                  </div>
                </div>

                {/* Message 3 - Self */}
                <div className="message-bubble flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-[#ea0000] flex-shrink-0 flex items-center justify-center text-white text-sm font-medium">
                    Y
                  </div>
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <span className="text-white/30 text-xs">2:32 PM</span>
                      <span className="text-white/70 text-sm font-medium">You</span>
                    </div>
                    <div 
                      className="inline-block px-4 py-2 rounded-2xl rounded-tr-sm text-left"
                      style={{
                        background: 'rgba(234, 0, 0, 0.2)',
                        border: '1px solid rgba(234, 0, 0, 0.3)',
                      }}
                    >
                      <p className="text-white/90">8 PM works for everyone? 🌙</p>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <CheckCheck className="w-4 h-4 text-[#ea0000]" />
                    </div>
                  </div>
                </div>

                {/* Message 4 */}
                <div className="message-bubble flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-medium">
                    S
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/70 text-sm font-medium">Sam</span>
                      <span className="text-white/30 text-xs">2:33 PM</span>
                    </div>
                    <div 
                      className="inline-block px-4 py-2 rounded-2xl rounded-tl-sm"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <p className="text-white/90">Perfect! Let's dominate! 🔥</p>
                    </div>
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-medium">
                    A
                  </div>
                  <div 
                    className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-white/10">
                <div 
                  className="flex items-center gap-3 px-4 py-3 rounded-full"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Paperclip className="w-5 h-5 text-white/40 hover:text-white/70 cursor-pointer transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-white/90 placeholder-white/40 outline-none text-sm"
                    readOnly
                  />
                  <Smile className="w-5 h-5 text-white/40 hover:text-white/70 cursor-pointer transition-colors" />
                  <Mic className="w-5 h-5 text-white/40 hover:text-white/70 cursor-pointer transition-colors" />
                  <button className="w-8 h-8 rounded-full bg-[#ea0000] flex items-center justify-center hover:bg-[#ff1a1a] transition-colors">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border border-white/5 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 border border-white/5 rounded-full" />
          </div>

          {/* Right: Content */}
          <div ref={contentRef} className="space-y-8">
            <div>
              <h2 className="text-4xl sm:text-5xl font-medium text-white mb-6">
                {messagingConfig.title}
              </h2>
              <p className="text-xl text-white/60 leading-relaxed">
                {messagingConfig.description}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {messagingConfig.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#ea0000]/10 flex items-center justify-center group-hover:bg-[#ea0000]/20 transition-colors">
                    <Check className="w-5 h-5 text-[#ea0000]" />
                  </div>
                  <span className="text-white/80 group-hover:text-white transition-colors">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="group flex items-center gap-3 text-[#ea0000] font-medium hover:gap-4 transition-all">
              Start Chatting
              <span className="w-6 h-px bg-[#ea0000] group-hover:w-8 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
