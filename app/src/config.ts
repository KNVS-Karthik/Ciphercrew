// ============================================================================
// CipherCrew - Encrypted Squad Space Configuration
// ============================================================================

export interface SiteConfig {
  title: string;
  description: string;
  language: string;
}

export const siteConfig: SiteConfig = {
  title: "CipherCrew - Your Encrypted Squad Space",
  description: "Private messaging, games, and shared experiences for your exclusive crew",
  language: "en",
};

// ============================================================================
// Navigation Configuration
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
}

export interface NavigationConfig {
  logo: string;
  items: NavItem[];
}

export const navigationConfig: NavigationConfig = {
  logo: "CipherCrew",
  items: [
    { label: "Home", href: "#hero" },
    { label: "Messages", href: "#messaging" },
    { label: "Games", href: "#games" },
    { label: "Watch Together", href: "#watch" },
    { label: "Mystery", href: "#mystery" },
  ],
};

// ============================================================================
// Hero Section Configuration
// ============================================================================

export interface HeroConfig {
  title: string;
  subtitle: string;
  backgroundImage: string;
  servicesLabel: string;
  copyright: string;
}

export const heroConfig: HeroConfig = {
  title: "Your Private Space",
  subtitle: "Encrypted messaging, games, and shared experiences for you and your closest friends",
  backgroundImage: "/hero-bg.jpg",
  servicesLabel: "Connect | Play | Share",
  copyright: "100% Private & Secure",
};

// ============================================================================
// Features Section Configuration
// ============================================================================

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FeaturesConfig {
  title: string;
  subtitle: string;
  features: FeatureItem[];
}

export const featuresConfig: FeaturesConfig = {
  title: "Everything You Need",
  subtitle: "All your favorite ways to connect, in one secure place",
  features: [
    {
      id: "01",
      title: "Encrypted Messaging",
      description: "End-to-end encrypted messages that keep your conversations private",
      icon: "MessageSquare",
    },
    {
      id: "02",
      title: "Voice & Video Calls",
      description: "Crystal clear quality for face-to-face conversations",
      icon: "Video",
    },
    {
      id: "03",
      title: "Group Spaces",
      description: "Create rooms for every mood and occasion",
      icon: "Users",
    },
    {
      id: "04",
      title: "Game Lounge",
      description: "Play together, stay together with classic games",
      icon: "Gamepad2",
    },
  ],
};

// ============================================================================
// Messaging Section Configuration
// ============================================================================

export interface MessagingConfig {
  title: string;
  description: string;
  features: string[];
}

export const messagingConfig: MessagingConfig = {
  title: "Chat Without Limits",
  description: "End-to-end encrypted messages that disappear when you want them to. Your conversations, your control.",
  features: [
    "Direct Messages & Group Chats",
    "Self-destructing Messages",
    "Voice Notes & File Sharing",
    "Reactions & Reply Threads",
  ],
};

// ============================================================================
// Games Section Configuration
// ============================================================================

export interface GameItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  featured?: boolean;
}

export interface GamesConfig {
  title: string;
  subtitle: string;
  games: GameItem[];
}

export const gamesConfig: GamesConfig = {
  title: "Game On",
  subtitle: "Challenge your friends to classic games and discover new favorites",
  games: [
    {
      id: 1,
      title: "Ludo",
      category: "Classic",
      description: "The timeless board game for 2-4 players",
      image: "/game-ludo.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "Chess",
      category: "Strategy",
      description: "Master the game of kings",
      image: "/game-chess.jpg",
    },
    {
      id: 3,
      title: "Monopoly",
      category: "Classic",
      description: "Buy, sell, and trade your way to victory",
      image: "/game-monopoly.jpg",
    },
    {
      id: 4,
      title: "Carroms",
      category: "Classic",
      description: "Strike and pocket in this precision game",
      image: "/game-carroms.jpg",
    },
    {
      id: 5,
      title: "Jenga",
      category: "Skill",
      description: "How high can you go before it falls?",
      image: "/game-jenga.jpg",
    },
    {
      id: 6,
      title: "Monopoly 18+",
      category: "Adult",
      description: "A spicier version for grown-up game nights",
      image: "/game-monopoly-18.jpg",
    },
    {
      id: 7,
      title: "Jenga 18+",
      category: "Adult",
      description: "Truth or dare meets tower stacking",
      image: "/game-jenga-18.jpg",
    },
  ],
};

// ============================================================================
// Watch Together Section Configuration
// ============================================================================

export interface PlatformItem {
  name: string;
  icon: string;
  color: string;
}

export interface WatchConfig {
  title: string;
  subtitle: string;
  platforms: PlatformItem[];
  features: string[];
}

export const watchConfig: WatchConfig = {
  title: "Watch Together, Wherever",
  subtitle: "Synchronized streaming for the perfect movie night with friends",
  platforms: [
    { name: "YouTube Premium", icon: "Youtube", color: "#FF0000" },
    { name: "Netflix", icon: "Play", color: "#E50914" },
    { name: "Prime Video", icon: "PlayCircle", color: "#00A8E1" },
    { name: "Hotstar", icon: "Star", color: "#1F80E0" },
  ],
  features: [
    "Perfect Sync Playback",
    "Built-in Voice Chat",
    "Live Reactions",
    "Shared Playlists",
  ],
};

// ============================================================================
// Mystery Cases Section Configuration
// ============================================================================

export interface MysteryCase {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  image: string;
}

export interface MysteryConfig {
  title: string;
  subtitle: string;
  cases: MysteryCase[];
}

export const mysteryConfig: MysteryConfig = {
  title: "Mystery Awaits",
  subtitle: "Put your detective skills to the test. Solve cases with your friends.",
  cases: [
    {
      id: 1,
      title: "The Vanishing Heirloom",
      difficulty: "Beginner",
      description: "A priceless family treasure has gone missing. Can you find the thief?",
      image: "/mystery-1.jpg",
    },
    {
      id: 2,
      title: "Midnight at the Manor",
      difficulty: "Intermediate",
      description: "Strange happenings at the old estate. Uncover the dark secrets within.",
      image: "/mystery-2.jpg",
    },
    {
      id: 3,
      title: "The Cipher Society",
      difficulty: "Advanced",
      description: "Decode ancient messages to uncover a centuries-old conspiracy.",
      image: "/mystery-3.jpg",
    },
    {
      id: 4,
      title: "Whispers in the Dark",
      difficulty: "Expert",
      description: "A chilling case that will test even the sharpest minds.",
      image: "/mystery-4.jpg",
    },
  ],
};

// ============================================================================
// CTA Section Configuration
// ============================================================================

export interface CTAConfig {
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
}

export const ctaConfig: CTAConfig = {
  title: "Ready to Connect?",
  subtitle: "Your private space is just one click away",
  primaryButton: "Create Your Room",
  secondaryButton: "Join Existing Room",
};

// ============================================================================
// Footer Configuration
// ============================================================================

export interface FooterLink {
  label: string;
  href: string;
  icon?: string;
}

export interface FooterConfig {
  marqueeText: string;
  marqueeHighlightChars: string[];
  navLinks1: FooterLink[];
  navLinks2: FooterLink[];
  ctaText: string;
  ctaHref: string;
  copyright: string;
  tagline: string;
}

export const footerConfig: FooterConfig = {
  marqueeText: "Encrypted Squad Endless Vibes",
  marqueeHighlightChars: ["E", "S", "E", "V"],
  navLinks1: [
    { label: "Home", href: "#hero" },
    { label: "Messages", href: "#messaging" },
    { label: "Games", href: "#games" },
  ],
  navLinks2: [
    { label: "Watch Together", href: "#watch" },
    { label: "Mystery Cases", href: "#mystery" },
    { label: "Privacy", href: "#" },
  ],
  ctaText: "Get Started",
  ctaHref: "#hero",
  copyright: "© 2024 CipherCrew. All rights reserved.",
  tagline: "Encrypted squad, endless vibes",
};

// ============================================================================
// Friends List Configuration
// ============================================================================

export interface Friend {
  id: number;
  name: string;
  avatar: string;
  status: "online" | "offline" | "busy" | "away";
  lastSeen?: string;
}

export const friendsList: Friend[] = [
  {
    id: 1,
    name: "You",
    avatar: "/avatar-1.jpg",
    status: "online",
  },
  {
    id: 2,
    name: "Alex",
    avatar: "/avatar-2.jpg",
    status: "online",
  },
  {
    id: 3,
    name: "Jordan",
    avatar: "/avatar-3.jpg",
    status: "away",
    lastSeen: "5 min ago",
  },
  {
    id: 4,
    name: "Sam",
    avatar: "/avatar-4.jpg",
    status: "busy",
  },
];
