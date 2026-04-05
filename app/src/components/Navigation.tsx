import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, Lock, LogOut, User } from 'lucide-react';
import { navigationConfig } from '../config';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export function Navigation() {
  const { user, logout, onlineUsers } = useAuth();
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 100);
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ctx = gsap.context(() => {
      const logo = nav.querySelector('.nav-logo');
      const links = nav.querySelectorAll('.nav-link');

      gsap.fromTo(logo,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', delay: 0 }
      );

      gsap.fromTo(links,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'expo.out', delay: 0.1 }
      );
    }, nav);

    return () => ctx.revert();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    // If it's a specific route like '/chat'
    if (href === '/chat') {
      navigate('/chat');
      return;
    }

    // Clean href (support both '#hero' and '/#hero')
    const hash = href.includes('#') ? '#' + href.split('#')[1] : href;

    if (location.pathname !== '/') {
      // Not on home page, navigate to home then scroll
      navigate('/' + hash);
      // Let the browser handle the scroll after navigation
      setTimeout(() => {
        const target = document.querySelector(hash);
        target?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Already on home, just scroll
      const target = document.querySelector(hash);
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-xl py-3'
            : 'bg-transparent py-5'
        } ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="nav-logo flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#ea0000] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-medium text-white group-hover:text-[#ea0000] transition-colors duration-300">
              {navigationConfig.logo}
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navigationConfig.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="nav-link text-sm text-white/70 hover:text-white transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#ea0000] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Online indicator */}
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {onlineUsers.length} online
            </div>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ea0000] to-[#990000] flex items-center justify-center text-white text-sm font-medium">
                  {user?.displayName?.[0] || 'U'}
                </div>
                <span className="text-white/80 text-sm">{user?.displayName}</span>
              </button>

              {showUserMenu && (
                <div 
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-50"
                  style={{
                    background: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors text-sm">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-white hover:text-[#ea0000] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {/* User info */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ea0000] to-[#990000] flex items-center justify-center text-white text-2xl font-medium">
              {user?.displayName?.[0] || 'U'}
            </div>
            <div className="text-center">
              <p className="text-white text-xl font-medium">{user?.displayName}</p>
              <p className="text-white/50 text-sm">@{user?.username}</p>
            </div>
          </div>

          {navigationConfig.items.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-3xl text-white hover:text-[#ea0000] transition-colors duration-300"
              style={{
                transform: isMobileMenuOpen
                  ? 'translateY(0)'
                  : 'translateY(30px)',
                opacity: isMobileMenuOpen ? 1 : 0,
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
              }}
            >
              {item.label}
            </a>
          ))}

          <button 
            onClick={handleLogout}
            className="mt-8 flex items-center gap-3 px-8 py-3 border border-red-500/50 text-red-400 text-lg font-medium rounded-xl"
            style={{
              transform: isMobileMenuOpen
                ? 'translateY(0)'
                : 'translateY(30px)',
              opacity: isMobileMenuOpen ? 1 : 0,
              transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s`,
            }}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
}
