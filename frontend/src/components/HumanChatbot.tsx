import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/HumanChatbot.css';

// Enhanced Memory System
interface Memory {
  lastService?: string;
  userName?: string;
  preferredLanguage?: 'hindi' | 'english' | 'hinglish' | 'tamil' | 'telugu' | 'bengali';
  conversationHistory?: string[];
  userPreferences?: {
    urgency?: 'low' | 'medium' | 'high';
    budget?: string;
    location?: string;
    preferredTime?: string;
    notifications?: boolean;
  };
  scheduledServices?: ScheduledService[];
  userLocation?: LocationData;
}

// Professional User Profile System
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyaltyPoints: number;
  totalServices: number;
  joinDate: string;
  preferredServices: string[];
}

// User Analytics
interface UserAnalytics {
  totalBookings: number;
  totalSpent: number;
  averageRating: number;
  mostUsedService: string;
  lastBooking: string;
  savingsAmount: number;
}

// Professional Review System
interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
  providerResponse?: string;
}

// Enhanced Service Interface
interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  urgency: 'low' | 'medium' | 'high';
  description: string;
  availableNow: boolean;
  rating: number;
  professionals: number;
  estimatedTime: string;
  tags: string[];
  reviews: Review[];
  provider?: {
    name: string;
    experience: string;
    certification: string;
    responseTime: string;
  };
}

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language: 'hindi' | 'english' | 'hinglish' | 'tamil' | 'telugu' | 'bengali';
  attachments?: Attachment[];
  voiceNote?: string;
  reactions?: string[];
  suggestions?: SmartSuggestion[];
  isTyping?: boolean;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  preview?: string;
}

interface SmartSuggestion {
  id: string;
  text: string;
  category: string;
  icon: string;
  action: () => void;
}

interface ScheduledService {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  professional: string;
  estimatedDuration: string;
  price: string;
}

interface LocationData {
  latitude?: number;
  longitude?: number;
  city?: string;
  area?: string;
  address?: string;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Enhanced Human-style phrases for multiple languages
const hindiPhrases = [
  "theek hai 👍", "no tension, main dekh lunga", "samajh gaya bhai", "bilkul ho jayega 😊",
  "chalo theek hai", "main hu na 😊", "kar deta hoon bhai", "pakka ho jayega",
  "bas 2 minute", "abhi fix karta hoon", "bilkul possible hai", "darr mat, main hoon na"
];

const englishPhrases = [
  "Got it 👍", "No worries, I got you!", "Sure, I'll handle that 😊", "Absolutely!",
  "You got it!", "I'm on it!", "Consider it done!", "Easy peasy!", "Right away!", "I've got this!"
];

// Professional Services with Real Reviews
const professionalServices: Service[] = [
  {
    id: '1',
    name: "Emergency Plumbing Repair",
    category: "plumbing",
    price: "₹800-2000",
    urgency: "high",
    description: "24/7 emergency plumbing services including leak repairs, pipe fixing, drain cleaning, bathroom fixtures, geyser repair",
    availableNow: true,
    rating: 4.8,
    professionals: 15,
    estimatedTime: "30-90 mins",
    tags: ["emergency", "leak", "drain", "geyser", "bathroom"],
    reviews: [
      {
        id: '1',
        userName: "Rahul Sharma",
        rating: 5,
        comment: "Amazing service! Came at 2AM and fixed the leak within 30 minutes. Professional and affordable.",
        date: "2024-01-15",
        helpful: 24,
        verified: true,
        providerResponse: "Thank you Rahul! We're always here for emergencies."
      }
    ]
  },
  {
    id: '2',
    name: "Expert Electrical Services",
    category: "electrical",
    price: "₹1000-3000",
    urgency: "high",
    description: "Professional electrical work including wiring, repairs, installations, safety inspections, switch board, meter issues",
    availableNow: true,
    rating: 4.9,
    professionals: 12,
    estimatedTime: "45-120 mins",
    tags: ["emergency", "wiring", "switch", "meter", "safety"],
    reviews: [
      {
        id: '3',
        userName: "Amit Kumar",
        rating: 5,
        comment: "Expert electrician, very professional. Fixed complex wiring issue safely.",
        date: "2024-01-12",
        helpful: 18,
        verified: true
      }
    ]
  }
];

const commonEmojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🙏', '💪', '👏', '🤝', '😎', '🤗', '😌', '🥳', '🤔', '😇', '🙄', '😴', '🚀', '💎', '🌟', '⭐', '🌈', '🎯', '🏆', '🎪', '🎭'];

const HumanChatbot: React.FC = () => {
  // Enhanced State with Professional Features
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [memory, setMemory] = useState<Memory>({});
  const [currentLanguage, setCurrentLanguage] = useState<'hindi' | 'english' | 'hinglish' | 'tamil' | 'telugu' | 'bengali'>('hinglish');
  const [showEmojis, setShowEmojis] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  // Professional Features State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [membershipTier, setMembershipTier] = useState<'bronze' | 'silver' | 'gold' | 'platinum'>('bronze');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showPriceEstimator, setShowPriceEstimator] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [scheduledServices, setScheduledServices] = useState<ScheduledService[]>([]);
  const [showServiceTracking, setShowServiceTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('online');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  // Refs
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Professional Features
  useEffect(() => {
    // Initialize User Profile
    const profile: UserProfile = {
      name: "User",
      email: "user@example.com",
      phone: "+91 9876543210",
      avatar: "👤",
      membershipTier: "silver",
      loyaltyPoints: 250,
      totalServices: 5,
      joinDate: "2024-01-01",
      preferredServices: ["plumbing", "electrical"]
    };
    setUserProfile(profile);

    // Initialize User Analytics
    const analytics: UserAnalytics = {
      totalBookings: 5,
      totalSpent: 8500,
      averageRating: 4.7,
      mostUsedService: "plumbing",
      lastBooking: "2024-01-15",
      savingsAmount: 1200
    };
    setUserAnalytics(analytics);

    // Load reviews
    setReviews(professionalServices.flatMap(s => s.reviews));
  }, []);

  // Advanced Language Detection with Emotional Context
  const detectLanguage = useCallback((text: string): 'hindi' | 'english' | 'hinglish' | 'tamil' | 'telugu' | 'bengali' => {
    const lowerText = text.toLowerCase();
    
    // Emotional and casual indicators
    const hindiEmotional = ['hai', 'hain', 'karna', 'kar', 'ki', 'ko', 'se', 'mein', 'bhai', 'kaise', 'kya', 'kidhar', 'kab', 'kyun', 'aap', 'tum', 'main', 'hum', 'na', 'to', 'bhi', 'hi', 'par', 'lekin', 'aur', 'ya', 'phir', 'tab', 'jab', 'agar', 'warna', 'nhi', 'nahi', 'han', 'haan', 'ji', 'jiye', 'sir', 'madam'];
    const englishEmotional = ['is', 'are', 'am', 'was', 'were', 'be', 'being', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall', 'hello', 'hi', 'hey', 'good', 'great', 'awesome', 'amazing', 'fantastic', 'wonderful', 'excellent', 'perfect', 'love', 'like', 'enjoy', 'happy', 'sad', 'angry', 'excited', 'worried', 'concerned'];
    
    // Service keywords for better detection
    const serviceKeywords = ['plumbing', 'electrical', 'cleaning', 'pest', 'ac', 'plumber', 'electrician', 'service', 'repair', 'fix', 'issue', 'problem', 'help', 'urgent', 'emergency', 'jaldi', 'karwana', 'chahiye', 'need', 'want'];
    
    const words = lowerText.split(' ');
    const hindiCount = words.filter(word => 
      hindiEmotional.some(hw => word.includes(hw) || hw.includes(word)) ||
      serviceKeywords.some(sk => word.includes(sk) && ['jaldi', 'karwana', 'chahiye'].some(hk => word.includes(hk)))
    ).length;
    
    const englishCount = words.filter(word => 
      englishEmotional.some(ew => word.includes(ew) || ew.includes(word)) ||
      serviceKeywords.some(sk => word.includes(sk) && ['need', 'want', 'help', 'urgent', 'emergency'].some(ek => word.includes(ek)))
    ).length;
    
    // Mixed language detection (Hinglish)
    const hinglishIndicators = ['bhai', 'plz', 'pls', 'thx', 'tx', 'asap', 'lol', 'omg', 'btw', 'fyi', 'tbh', 'idk', 'imo', 'imho'];
    const hinglishCount = words.filter(word => hinglishIndicators.some(hi => word.includes(hi))).length;
    
    // Time-based greetings
    const timeGreetings = ['good morning', 'good afternoon', 'good evening', 'good night', 'subh', 'shubh', 'sham', 'raat'];
    const hasTimeGreeting = timeGreetings.some(tg => lowerText.includes(tg));
    
    // Advanced decision logic
    if (hasTimeGreeting && hindiCount > 0) return 'hindi';
    if (hasTimeGreeting && englishCount > 0) return 'english';
    if (hinglishCount > 2) return 'hinglish';
    if (hindiCount > englishCount && hindiCount > 1) return 'hindi';
    if (englishCount > hindiCount && englishCount > 1) return 'english';
    if (hindiCount === englishCount && hindiCount > 0) return 'hinglish';
    
    // Default to hinglish for mixed patterns
    return 'hinglish';
  }, []);

  // Enhanced Service Detection
  const detectService = useCallback((text: string): string | null => {
    const serviceKeywords = {
      'plumbing': ['plumbing', 'pipe', 'leak', 'tap', 'faucet', 'drain', 'bathroom', 'toilet', 'sink', 'geyser', 'water', 'tank', 'shower'],
      'electrical': ['electric', 'wire', 'switch', 'light', 'fan', 'ac', 'power', 'connection', 'short circuit', 'socket', 'breaker', 'meter', 'board'],
      'cleaning': ['clean', 'cleaning', 'wash', 'dust', 'sweep', 'mop', 'house', 'home', 'office', 'deep clean', 'post construction', 'sofa', 'carpet'],
      'pest': ['pest', 'cockroach', 'termite', 'mosquito', 'rat', 'insect', 'bug', 'rodent', 'lizard', 'disinfection', 'bed bugs'],
      'ac': ['ac', 'air conditioner', 'cooling', 'gas', 'ac service', 'ac repair', 'ac installation', 'split ac', 'window ac', 'servicing']
    };

    const lowerText = text.toLowerCase();
    for (const [category, keywords] of Object.entries(serviceKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category;
      }
    }
    return null;
  }, []);

  // Professional Quick Actions Handler
  const handleQuickAction = useCallback((service: string, message: string) => {
    setInput(message);
    setTimeout(() => sendMessage(), 100);
    setShowQuickActions(false);
    
    // Auto-suggest appointment for non-urgent services
    const serviceData = professionalServices.find(s => s.category === service);
    if (serviceData && serviceData.urgency === 'low') {
      setTimeout(() => {
        setShowAppointmentModal(true);
        setSelectedService(serviceData);
      }, 2000);
    }
  }, []);

  // Enhanced Emoji Selection with proper functionality
  const handleEmojiSelect = useCallback((emoji: string) => {
    setInput(prev => prev + emoji);
    setShowEmojis(false);
    // Focus back to input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojis && event.target && !(event.target as Element).closest('.emoji-picker, .input-btn')) {
        setShowEmojis(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojis]);

  // Advanced Emotional Response System
  const generateHumanResponse = useCallback((userInput: string, detectedLanguage: 'hindi' | 'english' | 'hinglish' | 'tamil' | 'telugu' | 'bengali'): string => {
    const detectedService = detectService(userInput);
    const lowerInput = userInput.toLowerCase();
    
    // Update memory
    const newMemory = { ...memory };
    if (detectedService) {
      newMemory.lastService = detectedService;
    }
    setMemory(newMemory);
    
    // Enhanced Emotional Intelligence
    const isGreeting = lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('namaste') || lowerInput.includes('kaisi ho') || lowerInput.includes('kaiso ho');
    const isPersonalQuestion = lowerInput.includes('name') || lowerInput.includes('email') || lowerInput.includes('login') || lowerInput.includes('id') || lowerInput.includes('who are you');
    const isCasualChat = lowerInput.includes('kya kar rahe ho') || lowerInput.includes('how are you') || lowerInput.includes('what\'s up') || lowerInput.includes('aap kaise ho');
    
    // Memory check with emotional context
    let memoryContext = '';
    if (memory.lastService && detectedService !== memory.lastService && !isGreeting && !isPersonalQuestion) {
      if (detectedLanguage === 'hindi') {
        memoryContext = `Waise pichli baar aap ${memory.lastService} service ke baare mein puch rahe the 🙂\n\n`;
      } else {
        memoryContext = `By the way, last time you asked about ${memory.lastService} services 🙂\n\n`;
      }
    }

    // Advanced Emotional Phrases
    const getEmotionalPhrase = (lang: string, context: string) => {
      if (lang === 'hindi') {
        const phrases = [
          "bilkul ho jayega 😊", "main hu na aapke saath", "koi baat nahi bhai", "sab theek hai",
          "aapka din shubh ho", "main full support kar raha hoon", "chalo milkar solve karte hain", 
          "aap tension mat lo", "sab handle kar lenge", "main hoon na"
        ];
        return phrases[Math.floor(Math.random() * phrases.length)];
      } else {
        const phrases = [
          "I've got your back! 😊", "We'll solve this together", "Don't you worry!", "Everything's gonna be fine",
          "I'm here for you!", "Let's make it happen!", "Consider it done!", "No worries at all!",
          "We'll handle it!", "You can count on me!"
        ];
        return phrases[Math.floor(Math.random() * phrases.length)];
      }
    };

    // Personal Question Responses with Emotional Intelligence
    if (isPersonalQuestion) {
      if (lowerInput.includes('name')) {
        if (detectedLanguage === 'hindi') {
          return `🤗 Aapka dost! Main aapki service helper hoon. Mujhe aap "Service Helper" bol sakte hain!\n\nAapka profile dekhne ke liye 👤 Profile button par click kariye - wahan aapka naam, email aur sab details hain!\n\n${getEmotionalPhrase(detectedLanguage, 'personal')}`;
        } else {
          return `🤗 Your friendly helper! I'm your Service Assistant. You can call me "Service Helper"!\n\nClick the 👤 Profile button to see your name, email and all your details!\n\n${getEmotionalPhrase(detectedLanguage, 'personal')}`;
        }
      }
      
      if (lowerInput.includes('email')) {
        if (detectedLanguage === 'hindi') {
          return `📧 Aapka email check kar liya! Aapka registered email hai: ${userProfile?.email || 'user@example.com'}\n\n👤 Profile mein jaake aap apna email update bhi kar sakte hain.\n\n${getEmotionalPhrase(detectedLanguage, 'personal')}`;
        } else {
          return `📧 I've checked your email! Your registered email is: ${userProfile?.email || 'user@example.com'}\n\nYou can update your email in the 👤 Profile section.\n\n${getEmotionalPhrase(detectedLanguage, 'personal')}`;
        }
      }
      
      if (lowerInput.includes('login') || lowerInput.includes('id')) {
        if (detectedLanguage === 'hindi') {
          return `🔐 Aap already logged in hain! Aapka User ID: ${userProfile?.name || 'User'}\n\n👤 Profile mein aapka complete information hai.\n\n${getEmotionalPhrase(detectedLanguage, 'personal')}`;
        } else {
          return `🔐 You're already logged in! Your User ID: ${userProfile?.name || 'User'}\n\nCheck 👤 Profile for your complete information.\n\n${getEmotionalPhrase(detectedLanguage, 'personal')}`;
        }
      }
    }

    // Greeting Responses with Emotional Intelligence
    if (isGreeting) {
      if (detectedLanguage === 'hindi') {
        const timeBasedGreeting = new Date().getHours() < 12 ? "Good morning!" : new Date().getHours() < 17 ? "Good afternoon!" : "Good evening!";
        return `🌟 ${timeBasedGreeting} Main aapki service helper hoon! Aaj kya kaam karwana hai?\n\nAapke liye sab services ready hain:\n🔧 Plumbing • ⚡ Electrical • 🧹 Cleaning • 🐜 Pest Control • ❄️ AC Service\n\n${getEmotionalPhrase(detectedLanguage, 'greeting')}`;
      } else {
        const timeBasedGreeting = new Date().getHours() < 12 ? "Good morning!" : new Date().getHours() < 17 ? "Good afternoon!" : "Good evening!";
        return `🌟 ${timeBasedGreeting} I'm your service helper! What can I help you with today?\n\nAll services are ready for you:\n🔧 Plumbing • ⚡ Electrical • 🧹 Cleaning • 🐜 Pest Control • ❄️ AC Service\n\n${getEmotionalPhrase(detectedLanguage, 'greeting')}`;
      }
    }

    // Casual Chat Responses
    if (isCasualChat) {
      if (detectedLanguage === 'hindi') {
        return `😊 Main bilkul theek hoon! Aapka service helper hamesha ready rehta hoon.\n\nAaj kya kaam karwana hai? Aapke liye sab professionals available hain!\n\n${getEmotionalPhrase(detectedLanguage, 'casual')}`;
      } else {
        return `😊 I'm doing great! Your service helper is always ready to assist.\n\nWhat service do you need today? All professionals are available for you!\n\n${getEmotionalPhrase(detectedLanguage, 'casual')}`;
      }
    }

    // Professional service responses with emotional intelligence
    if (detectedService === 'plumbing') {
      const service = professionalServices.find(s => s.category === 'plumbing');
      if (detectedLanguage === 'hindi') {
        return `${memoryContext}🚰 Plumbing issue hai? Koi tension mat lo!\n\n${service?.rating || '4.8'} ⭐ rated experts immediately bhej raha hoon ✅\nAaj ${service?.professionals || 15} professionals available hain - 24/7 service!\n\nBatao kya problem hai - leak, drain, bathroom ya kuch aur?\n\n${getEmotionalPhrase(detectedLanguage, 'service')}`;
      } else {
        return `${memoryContext}� Plumbing issue? Don't worry at all!\n\nI'll immediately send ${service?.rating || '4.8'} ⭐ rated experts ✅\nWe have ${service?.professionals || 15} professionals available today - 24/7 service!\n\nTell me what's the problem - leak, drain, bathroom or something else?\n\n${getEmotionalPhrase(detectedLanguage, 'service')}`;
      }
    }

    if (detectedService === 'electrical') {
      const service = professionalServices.find(s => s.category === 'electrical');
      if (detectedLanguage === 'hindi') {
        return `${memoryContext}⚡ Electrical ka kaam hai? Main samajh gaya!\n\n${service?.rating || '4.9'} ⭐ expert electrician bhej raha hoon ✅\n${service?.professionals || 12} licensed professionals hain - Safety first!\n\nKya issue hai - short circuit, wiring, switch ya meter?\n\n${getEmotionalPhrase(detectedLanguage, 'service')}`;
      } else {
        return `${memoryContext}⚡ Electrical work? I understand!\n\nI'll send ${service?.rating || '4.9'} ⭐ expert electricians ✅\nWe have ${service?.professionals || 12} licensed professionals - Safety first!\n\nWhat's the issue - short circuit, wiring, switch or meter?\n\n${getEmotionalPhrase(detectedLanguage, 'service')}`;
      }
    }

    // Enhanced default response with emotional intelligence
    if (detectedLanguage === 'hindi') {
      return `${memoryContext}🤝 Main aapki complete service help kar raha hoon!\n\nAaj aap kya service chahiye? Main sab provide karta hoon:\n🔧 Plumbing • ⚡ Electrical • 🧹 Cleaning • 🐜 Pest Control • ❄️ AC Service • 🎨 Painting • 🔌 Appliance Repair\n\n**Advanced Features:**\n👤 Personal Profile Analytics\n⭐ Real Reviews & Ratings\n🏆 Loyalty Rewards Points\n💰 Smart Price Calculator\n📊 Service Tracking\n🚨 24/7 Emergency Support\n\nBatao main aapke liye kya kar sakta hoon?\n\n${getEmotionalPhrase(detectedLanguage, 'default')}`;
    } else {
      return `${memoryContext}🤝 I'm here to provide complete service assistance!\n\nWhat service do you need today? I provide everything:\n🔧 Plumbing • ⚡ Electrical • 🧹 Cleaning • 🐜 Pest Control • ❄️ AC Service • 🎨 Painting • 🔌 Appliance Repair\n\n**Advanced Features:**\n👤 Personal Profile Analytics\n⭐ Real Reviews & Ratings\n🏆 Loyalty Rewards Points\n💰 Smart Price Calculator\n📊 Service Tracking\n🚨 24/7 Emergency Support\n\nTell me how I can help you today!\n\n${getEmotionalPhrase(detectedLanguage, 'default')}`;
    }
  }, [detectService, memory, membershipTier, loyaltyPoints, userProfile, userAnalytics, reviews]);

  // Enhanced Smart Suggestions with Emotional Intelligence
  const generateSmartSuggestions = useCallback((text: string, language: string): SmartSuggestion[] => {
    const lowerText = text.toLowerCase();
    
    // Dynamic suggestions based on context
    if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('namaste')) {
      return [
        {
          id: "1",
          text: language === "hindi" ? "प्लंबिंग सेवा" : "Plumbing Service",
          category: "plumbing",
          icon: "🔧",
          action: () => handleQuickAction("plumbing", language === "hindi" ? "प्लंबिंग की जरूरत है" : "Need plumbing service")
        },
        {
          id: "2",
          text: language === "hindi" ? "मेरा प्रोफाइल देखें" : "My Profile",
          category: "profile",
          icon: "👤",
          action: () => setShowProfileModal(true)
        },
        {
          id: "3",
          text: language === "hindi" ? "आज की ऑफर" : "Today's Offers",
          category: "offers",
          icon: "🎉",
          action: () => setShowLoyaltyModal(true)
        }
      ];
    }
    
    if (lowerText.includes('name') || lowerText.includes('email') || lowerText.includes('profile')) {
      return [
        {
          id: "1",
          text: language === "hindi" ? "प्रोफाइल खोलें" : "Open Profile",
          category: "profile",
          icon: "👤",
          action: () => setShowProfileModal(true)
        },
        {
          id: "2",
          text: language === "hindi" ? "ईमेल अपडेट करें" : "Update Email",
          category: "profile",
          icon: "📧",
          action: () => setShowProfileModal(true)
        },
        {
          id: "3",
          text: language === "hindi" ? "एनालिटिक्स देखें" : "View Analytics",
          category: "analytics",
          icon: "📊",
          action: () => setShowAnalyticsModal(true)
        }
      ];
    }
    
    if (lowerText.includes('emergency') || lowerText.includes('urgent') || lowerText.includes('jaldi')) {
      return [
        {
          id: "1",
          text: language === "hindi" ? "आपातकालीन प्लंबर" : "Emergency Plumber",
          category: "plumbing",
          icon: "🔧",
          action: () => handleQuickAction("plumbing", language === "hindi" ? "आपातकालीन प्लंबिंग सेवा चाहिए" : "Emergency plumbing service needed")
        },
        {
          id: "2",
          text: language === "hindi" ? "आपातकालीन इलेक्ट्रीशियन" : "Emergency Electrician",
          category: "electrical",
          icon: "⚡",
          action: () => handleQuickAction("electrical", language === "hindi" ? "आपातकालीन इलेक्ट्रीशियन चाहिए" : "Emergency electrician needed")
        },
        {
          id: "3",
          text: language === "hindi" ? "आपातकालीन संपर्क" : "Emergency Contacts",
          category: "emergency",
          icon: "🚨",
          action: () => setShowEmergencyModal(true)
        }
      ];
    }
    
    // Default smart suggestions
    const suggestions: SmartSuggestion[] = [
      {
        id: "1",
        text: language === "hindi" ? "आपतकालीन प्लंबर" : "Emergency Plumber",
        category: "plumbing",
        icon: "🔧",
        action: () => handleQuickAction("plumbing", language === "hindi" ? "आपतकालीन प्लंबिंग सेवा चाहिए" : "Emergency plumbing service needed")
      },
      {
        id: "2",
        text: language === "hindi" ? "प्रोफाइल देखें" : "View Profile",
        category: "profile",
        icon: "👤",
        action: () => setShowProfileModal(true)
      },
      {
        id: "3",
        text: language === "hindi" ? "रिव्यू पढ़ें" : "Read Reviews",
        category: "reviews",
        icon: "⭐",
        action: () => setShowReviewsModal(true)
      },
      {
        id: "4",
        text: language === "hindi" ? "मूल्यांकन करें" : "Get Estimate",
        category: "pricing",
        icon: "💰",
        action: () => setShowPriceEstimator(true)
      }
    ];

    return suggestions.slice(0, 4);
  }, [handleQuickAction]);

  // Send Message Function
  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || isTyping) return;

    const language = detectLanguage(text);
    setCurrentLanguage(language);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
      language: language,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachments([]);
    setShowQuickActions(false);
    setIsTyping(true);

    // Fast response - 400ms
    setTimeout(() => {
      const response = generateHumanResponse(text, language);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response,
        timestamp: new Date().toISOString(),
        language: language,
        suggestions: generateSmartSuggestions(text, language)
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 400);
  }, [input, isTyping, attachments, detectLanguage, generateHumanResponse, generateSmartSuggestions]);

  // File Upload Handler
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments: Attachment[] = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  }, []);

  // Enhanced Welcome Message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        text: "👋 Namaste! Main aapki madad karne ke liye yahan hoon 😊\n\nMain sab types ke professional services provide karta hoon:\n🔧 Plumbing • ⚡ Electrical • 🧹 Cleaning • 🐜 Pest Control • ❄️ AC Service\n\n**Professional Features:**\n👤 User Profile with Analytics\n⭐ Real Reviews System\n🏆 Loyalty Rewards Program\n💰 Smart Price Estimator\n📊 Service Analytics Dashboard\n🚨 Emergency Services\n📅 Appointment Booking\n\nKya kaam karwana hai? Main hu na! 💪",
        timestamp: new Date().toISOString(),
        language: 'hinglish',
        suggestions: generateSmartSuggestions('', 'hinglish')
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, generateSmartSuggestions]);

  // Auto-scroll
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Show/Hide Quick Actions based on conversation
  const [showQuickActions, setShowQuickActions] = useState(true);

  return (
    <div className={`human-chatbot ${isOpen ? 'open' : 'closed'}`}>
      {/* Chat Button */}
      <button 
        className="chat-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Chat"
      >
        <span className="chat-icon">💬</span>
        <span className="chat-badge">Help</span>
        {messages.length > 1 && <span className="notification-dot"></span>}
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="notification-count">{notifications.filter(n => !n.read).length}</span>
        )}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="chat-popup">
          {/* Enhanced Header */}
          <div className="chat-header">
            <div className="header-left">
              <h3>Professional Service Helper</h3>
              <span className="status">
                {connectionStatus === 'online' ? '🟢 Online' : connectionStatus === 'offline' ? '🔴 Offline' : '🟡 Connecting'} • Available
              </span>
              {currentLocation && (
                <span className="location">📍 {currentLocation.city}</span>
              )}
            </div>
            <div className="header-right">
              <button className="header-btn" onClick={() => setShowProfileModal(true)} title="Profile">
                👤
              </button>
              <button className="header-btn" onClick={() => setShowReviewsModal(true)} title="Reviews">
                ⭐
              </button>
              <button className="header-btn" onClick={() => setShowAnalyticsModal(true)} title="Analytics">
                📊
              </button>
              <button className="header-btn" onClick={() => setShowLoyaltyModal(true)} title="Rewards">
                🏆
              </button>
              <button className="header-btn" onClick={() => setShowEmergencyModal(true)} title="Emergency">
                🚨
              </button>
              <button className="header-btn close-btn" onClick={() => setIsOpen(false)} title="Close">
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages" ref={messagesRef}>
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  
                  {/* Smart Suggestions */}
                  {message.suggestions && (
                    <div className="smart-suggestions">
                      {message.suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          className="suggestion-btn"
                          onClick={() => suggestion.action()}
                        >
                          <span className="suggestion-icon">{suggestion.icon}</span>
                          <span className="suggestion-text">{suggestion.text}</span>
                        </button>
                      ))}
                    </div>
                  )}
      
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="message assistant typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {/* Professional Quick Actions */}
            {showQuickActions && (
              <div className="quick-actions">
                <button 
                  className="quick-action"
                  onClick={() => handleQuickAction('plumbing', 'bhai plumbing issue hai jaldi')}
                >
                  🔧 Plumbing
                </button>
                <button 
                  className="quick-action"
                  onClick={() => handleQuickAction('electrical', 'electrical ka kaam hai')}
                >
                  ⚡ Electrical
                </button>
                <button 
                  className="quick-action"
                  onClick={() => handleQuickAction('cleaning', 'ghar ki cleaning karwani hai')}
                >
                  🧹 Cleaning
                </button>
                <button 
                  className="quick-action"
                  onClick={() => handleQuickAction('pest', 'pest control karwana hai')}
                >
                  🐜 Pest Control
                </button>
                <button 
                  className="quick-action"
                  onClick={() => handleQuickAction('ac', 'AC service karwana hai')}
                >
                  ❄️ AC Service
                </button>
                <button 
                  className="quick-action profile-btn"
                  onClick={() => setShowProfileModal(true)}
                >
                  👤 Profile
                </button>
                <button 
                  className="quick-action reviews-btn"
                  onClick={() => setShowReviewsModal(true)}
                >
                  ⭐ Reviews
                </button>
                <button 
                  className="quick-action emergency-btn"
                  onClick={() => setShowEmergencyModal(true)}
                >
                  🚨 Emergency
                </button>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="chat-input">
            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="attachments-preview">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="attachment-item">
                    {attachment.preview && (
                      <img src={attachment.preview} alt={attachment.name} className="attachment-thumb" />
                    )}
                    <span className="attachment-name">{attachment.name}</span>
                    <button className="remove-attachment" onClick={() => removeAttachment(attachment.id)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="input-container">
              <div className="input-left">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button className="input-btn" onClick={() => fileInputRef.current?.click()} title="Attach File">
                  📎
                </button>
                <button className="input-btn" onClick={() => setShowEmojis(!showEmojis)} title="Add Emoji">
                  😊
                </button>
              </div>

              <input
                ref={inputRef}
                type="text"
                className="message-input"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isTyping}
              />

              <div className="input-right">
                <button 
                  className="send-btn"
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  title="Send Message"
                >
                  {isTyping ? '⏳' : '📤'}
                </button>
              </div>
            </div>

            {/* Enhanced Emoji Picker - Fixed Positioning */}
            {showEmojis && (
              <div className="emoji-picker">
                <div className="emoji-grid">
                  {commonEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      className="emoji-btn"
                      onClick={() => handleEmojiSelect(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Professional Profile Modal */}
      {showProfileModal && userProfile && (
        <div className="modal-overlay">
          <div className="modal-content profile-modal">
            <div className="modal-header">
              <h3>Professional Profile</h3>
              <button className="close-btn" onClick={() => setShowProfileModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="profile-header">
                <div className="profile-avatar">{userProfile.avatar}</div>
                <div className="profile-info">
                  <h4>{userProfile.name}</h4>
                  <p>{userProfile.email}</p>
                  <p>{userProfile.phone}</p>
                </div>
              </div>
              <div className="profile-stats">
                <div className="stat-card">
                  <span className="stat-label">Membership</span>
                  <span className="stat-value">{userProfile.membershipTier.toUpperCase()}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Loyalty Points</span>
                  <span className="stat-value">{userProfile.loyaltyPoints}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Total Services</span>
                  <span className="stat-value">{userProfile.totalServices}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Member Since</span>
                  <span className="stat-value">{userProfile.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {showReviewsModal && (
        <div className="modal-overlay">
          <div className="modal-content reviews-modal">
            <div className="modal-header">
              <h3>Professional Reviews</h3>
              <button className="close-btn" onClick={() => setShowReviewsModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="reviews-summary">
                <div className="rating-overview">
                  <div className="rating-score">4.7</div>
                  <div className="rating-stars">⭐⭐⭐⭐⭐</div>
                  <div className="rating-count">{reviews.length} Reviews</div>
                </div>
                <div className="verified-badge">✅ All Reviews Verified</div>
              </div>
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <span className="reviewer-name">{review.userName}</span>
                        {review.verified && <span className="verified-badge">✅</span>}
                      </div>
                      <div className="review-rating">⭐ {review.rating}</div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    {review.providerResponse && (
                      <div className="provider-response">
                        <strong>Provider Response:</strong>
                        <p>{review.providerResponse}</p>
                      </div>
                    )}
                    <div className="review-footer">
                      <span className="review-date">{review.date}</span>
                      <button className="helpful-btn">
                        👍 Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && userAnalytics && (
        <div className="modal-overlay">
          <div className="modal-content analytics-modal">
            <div className="modal-header">
              <h3>Service Analytics</h3>
              <button className="close-btn" onClick={() => setShowAnalyticsModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="analytics-cards">
                <div className="analytics-card">
                  <div className="card-icon">📊</div>
                  <div className="card-content">
                    <h4>Total Bookings</h4>
                    <p>{userAnalytics.totalBookings}</p>
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="card-icon">💰</div>
                  <div className="card-content">
                    <h4>Total Spent</h4>
                    <p>₹{userAnalytics.totalSpent}</p>
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="card-icon">⭐</div>
                  <div className="card-content">
                    <h4>Average Rating</h4>
                    <p>{userAnalytics.averageRating}⭐</p>
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="card-icon">💎</div>
                  <div className="card-content">
                    <h4>Savings</h4>
                    <p>₹{userAnalytics.savingsAmount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Services Modal */}
      {showEmergencyModal && (
        <div className="modal-overlay">
          <div className="modal-content emergency-modal">
            <div className="modal-header">
              <h3>🚨 Emergency Services</h3>
              <button className="close-btn" onClick={() => setShowEmergencyModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="emergency-contacts">
                <h4>24/7 Emergency Hotline</h4>
                <div className="emergency-item">
                  <span className="emergency-icon">🔧</span>
                  <div className="emergency-info">
                    <strong>Emergency Plumbing</strong>
                    <p>Available 24/7 • Response: 15-30 mins</p>
                    <button className="emergency-btn">Call Now</button>
                  </div>
                </div>
                <div className="emergency-item">
                  <span className="emergency-icon">⚡</span>
                  <div className="emergency-info">
                    <strong>Emergency Electrical</strong>
                    <p>Available 24/7 • Response: 20-40 mins</p>
                    <button className="emergency-btn">Call Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HumanChatbot;
