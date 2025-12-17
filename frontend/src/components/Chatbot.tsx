import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useUser } from '@/contexts/UserContext'
import '../styles/Chatbot.css'

// Advanced Configuration Objects
const chatConfig = {
  themes: {
    light: { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb' },
    dark: { primary: '#4c51bf', secondary: '#553c9a', accent: '#d53f8c' },
    professional: { primary: '#2b6cb0', secondary: '#2c5282', accent: '#3182ce' }
  },
  categories: {
    cleaning: { icon: '🧹', priority: 'high', color: '#48bb78' },
    plumbing: { icon: '🔧', priority: 'high', color: '#4299e1' },
    electrical: { icon: '⚡', priority: 'high', color: '#ed8936' },
    pest: { icon: '🐛', priority: 'medium', color: '#9f7aea' },
    appliance: { icon: '🔌', priority: 'medium', color: '#38b2ac' },
    painting: { icon: '🎨', priority: 'low', color: '#f56565' },
    carpentry: { icon: '🔨', priority: 'low', color: '#d69e2e' }
  },
  languages: {
    en: { name: 'English', code: 'en', greeting: 'Hello! How can I help you today?' },
    hi: { name: 'हिन्दी', code: 'hi', greeting: 'नमस्ते! मैं आज आपकी कैसे मदद कर सकता हूँ?' },
    bn: { name: 'বাংলা', code: 'bn', greeting: 'হ্যালো! আমি আজ আপনাকে কিভাবে সাহায্য করতে পারি?' },
    ta: { name: 'தமிழ்', code: 'ta', greeting: 'வணக்கம்! நான் இன்று உங்களுக்கு எப்படி உதவ முடியும்?' },
    te: { name: 'తెలుగు', code: 'te', greeting: 'హలో! నేను ఈ రోజు మీకు ఎలా సహాయం చేయగలను?' },
    mr: { name: 'मराठी', code: 'mr', greeting: 'हेलो! मी आज तुम्हाली कशी मदत करू शकतो?' },
    gu: { name: 'ગુજરાતી', code: 'gu', greeting: 'હેલો! હું આજ તમને કઈ રીતે મદદ કરી શકું?' },
    kn: { name: 'ಕನ್ನಡ', code: 'kn', greeting: 'ಹಲೋ! ನಾನು ಇಂದು ನಿಮ್ಮನ್ನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' },
    ml: { name: 'മലയാളം', code: 'ml', greeting: 'ഹലോ! ഞാൻ ഇന്ന് നിങ്ങളെ എങ്ങനെ സഹായിക്കാൻ കഴിയും?' },
    pa: { name: 'ਪੰਜਾਬੀ', code: 'pa', greeting: 'ਹੈਲੋ! ਮੈਂ ਅੱਜ ਤੁਹਾਨੂੰ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?' }
  },
  voiceConfig: {
    languages: ['en-IN', 'hi-IN', 'bn-IN', 'ta-IN', 'te-IN'],
    maxDuration: 30,
    sampleRate: 16000
  },
  fileConfig: {
    allowedTypes: ['image/*', 'application/pdf', '.doc,.docx,.txt'],
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 3
  },
  aiConfig: {
    confidence: 0.85,
    maxTokens: 500,
    temperature: 0.7,
    model: 'gpt-4-turbo'
  },
  responses: {
    empathy: {
      angry: "I'm really sorry you're going through this. I'll do my best to fix it right away. 💛",
      frustrated: "I understand your frustration. Let me help you resolve this quickly. 🤝",
      happy: "That makes my day! Thank you for the positive feedback. 🌟",
      confused: "Let me clarify that for you. I'm here to help! 💡",
      urgent: "This sounds urgent. I'll prioritize finding the best solution for you. ⚡"
    },
    suggestions: {
      cleaning: 'Popular services: Deep Home Cleaning, Kitchen Degrease, Sofa Shampoo, Window Cleaning',
      plumbing: 'Top picks: Tap Repair, Leak Fix, Water Tank Cleaning, Drain Unclogging',
      electrical: 'Recommended: Fan Install, Light Fixture, Appliance Repair, Wiring Issues',
      pest: 'Best options: Cockroach Control, Termite Treatment, Rodent Control, Bed Bug Removal',
      appliance: 'Expert services: AC Repair, Refrigerator Service, Washing Machine Fix, Microwave Repair',
      painting: 'Quality work: Wall Painting, Texture Design, Polishing, Waterproofing',
      carpentry: 'Skilled crafts: Furniture Repair, Door Installation, Custom Cabinets, Wood Polishing'
    },
    smartSuggestions: [
      'Book a service right away',
      'Get instant quotes',
      'Find verified providers',
      'Read customer reviews',
      'Check service availability',
      'Compare prices',
      'Schedule appointment',
      'Contact support team'
    ]
  }
} as const;

// Advanced Type Definitions
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  category?: string;
  language?: string;
  metadata?: {
    typing?: boolean;
    suggestedActions?: string[];
    reviews?: ReviewData[];
    serviceProviders?: ProviderData[];
    confidence?: number;
    attachments?: Attachment[];
    voiceMessage?: VoiceMessage;
    translatedText?: string;
    keywords?: string[];
    urgency?: 'low' | 'medium' | 'high';
    followUpQuestions?: string[];
  };
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

interface VoiceMessage {
  id: string;
  duration: number;
  url: string;
  transcript: string;
  language: string;
  confidence: number;
}

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  reviewer: string;
  service: string;
  date: string;
  helpful: number;
  verified: boolean;
  sentiment: 'positive' | 'negative' | 'neutral';
  pros?: string[];
  cons?: string[];
  response?: string;
  images?: string[];
}

interface ProviderData {
  id: string;
  name: string;
  rating: number;
  services: string[];
  responseTime: string;
  priceRange: string;
  verified: boolean;
  available: boolean;
  reviews: number;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  languages?: string[];
  specialties?: string[];
  certifications?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  lastActive: string;
  category?: string;
  resolved: boolean;
  language?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
}

interface TypingIndicator {
  isTyping: boolean;
  text: string;
  delay: number;
}

interface ChatAnalytics {
  totalMessages: number;
  averageResponseTime: number;
  sentimentScore: number;
  resolvedIssues: number;
  categoryFrequency: Record<string, number>;
  userSatisfaction: number;
  languageUsage: Record<string, number>;
  attachmentCount: number;
  voiceMessageCount: number;
  sessionDuration: number;
  topCategories: Array<{ category: string; count: number }>;
  userEngagement: {
    messagesPerSession: number;
    averageSessionLength: number;
    returnRate: number;
  };
}

interface SmartSuggestion {
  id: string;
  text: string;
  category: string;
  priority: number;
  icon: string;
  action: string;
}

interface ChatSettings {
  language: string;
  voiceEnabled: boolean;
  autoTranslate: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'professional';
  fontSize: 'small' | 'medium' | 'large';
  autoSave: boolean;
  shareData: boolean;
}

interface ChatHistory {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messageCount: number;
  category?: string;
  resolved: boolean;
  rating?: number;
}

// Enhanced Mock Data
const mockReviews: ReviewData[] = [
  {
    id: '1',
    rating: 5,
    comment: 'Excellent AC repair service! The technician was professional and fixed the issue quickly. Very knowledgeable about different AC brands and provided useful maintenance tips.',
    reviewer: 'Priya Sharma',
    service: 'AC Repair',
    date: '2024-01-15',
    helpful: 24,
    verified: true,
    sentiment: 'positive',
    pros: ['Professional technician', 'Quick service', 'Reasonable pricing', 'Provided maintenance tips'],
    cons: ['Could have been more punctual'],
    response: 'Thank you Priya! We appreciate your detailed feedback. We\'ll work on improving our punctuality.',
    images: ['https://picsum.photos/300/200?random=1']
  },
  {
    id: '2',
    rating: 4,
    comment: 'Good plumbing work, but took longer than expected. Quality was good though. The plumber was knowledgeable and explained the issue clearly.',
    reviewer: 'Amit Patel',
    service: 'Plumbing',
    date: '2024-01-12',
    helpful: 18,
    verified: true,
    sentiment: 'neutral',
    pros: ['Quality work', 'Clear explanation', 'Professional behavior'],
    cons: ['Took longer than expected', 'Slightly expensive'],
    response: 'Thanks Amit! We\'ll work on our timing and pricing. Glad you were satisfied with the quality.',
    images: ['https://picsum.photos/300/200?random=2']
  },
  {
    id: '3',
    rating: 5,
    comment: 'Amazing deep cleaning service! My house looks brand new. Highly recommend! The team was thorough and paid attention to every detail.',
    reviewer: 'Sneha Reddy',
    service: 'Deep Cleaning',
    date: '2024-01-10',
    helpful: 32,
    verified: true,
    sentiment: 'positive',
    pros: ['Thorough cleaning', 'Attention to detail', 'Professional team', 'Eco-friendly products'],
    cons: ['None'],
    response: 'Thank you Sneha! We\'re delighted you loved our service. We always strive for excellence!',
    images: ['https://picsum.photos/300/200?random=3', 'https://picsum.photos/300/200?random=4']
  },
  {
    id: '4',
    rating: 2,
    comment: 'Poor customer service and the work was not up to standards. Very disappointed with the overall experience.',
    reviewer: 'Rahul Kumar',
    service: 'Electrical',
    date: '2024-01-08',
    helpful: 15,
    verified: false,
    sentiment: 'negative',
    pros: ['None'],
    cons: ['Poor customer service', 'Substandard work', 'Unprofessional behavior'],
    response: 'We sincerely apologize for your poor experience, Rahul. We\'d like to make this right - please contact our support team.',
    images: []
  },
  {
    id: '5',
    rating: 5,
    comment: 'Very professional pest control service. They explained everything clearly and did a thorough job. No more pests!',
    reviewer: 'Anjali Gupta',
    service: 'Pest Control',
    date: '2024-01-05',
    helpful: 28,
    verified: true,
    sentiment: 'positive',
    pros: ['Professional service', 'Clear explanations', 'Thorough job', 'Long-lasting results'],
    cons: ['Slightly expensive'],
    response: 'Thank you Anjali! We\'re glad our pest control service worked well for you. Your satisfaction is our priority!',
    images: ['https://picsum.photos/300/200?random=5']
  },
  {
    id: '6',
    rating: 4,
    comment: 'Good painting service but the color matching could have been better. Overall satisfied with the work.',
    reviewer: 'Rohit Verma',
    service: 'Wall Painting',
    date: '2024-01-03',
    helpful: 20,
    verified: true,
    sentiment: 'neutral',
    pros: ['Professional painters', 'Clean work', 'Reasonable pricing'],
    cons: ['Color matching issues', 'Took extra day'],
    response: 'Thanks Rohit! We\'ll work on our color matching process. Glad you were satisfied overall.',
    images: ['https://picsum.photos/300/200?random=6']
  }
];

const mockProviders: ProviderData[] = [
  {
    id: '1',
    name: 'Rajesh Home Services',
    rating: 4.8,
    services: ['Plumbing', 'Electrical', 'AC Repair', 'Water Tank Cleaning'],
    responseTime: '30 mins',
    priceRange: '₹500-2000',
    verified: true,
    available: true,
    reviews: 156,
    location: 'Delhi NCR',
    phone: '+91-9876543210',
    email: 'rajesh@homeservices.com',
    website: 'https://rajeshhomeservices.com',
    languages: ['Hindi', 'English', 'Punjabi'],
    specialties: ['Emergency Repairs', 'Maintenance', 'Installation'],
    certifications: ['Plumbing License', 'Electrical Certificate', 'AC Repair Certification']
  },
  {
    id: '2',
    name: 'QuickFix Solutions',
    rating: 4.5,
    services: ['Deep Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning', 'Sofa Shampoo'],
    responseTime: '1 hour',
    priceRange: '₹800-3000',
    verified: true,
    available: true,
    reviews: 92,
    location: 'Mumbai',
    phone: '+91-9876543211',
    email: 'info@quickfixsolutions.in',
    website: 'https://quickfixsolutions.in',
    languages: ['Hindi', 'English', 'Marathi'],
    specialties: ['Deep Cleaning', 'Eco-friendly Products', 'Post-construction Cleaning'],
    certifications: ['Cleaning Services Certificate', 'Eco-friendly Certification']
  },
  {
    id: '3',
    name: 'TechPro Appliances',
    rating: 4.7,
    services: ['AC Repair', 'Refrigerator', 'Washing Machine', 'Microwave Repair'],
    responseTime: '45 mins',
    priceRange: '₹1000-5000',
    verified: true,
    available: false,
    reviews: 124,
    location: 'Bangalore',
    phone: '+91-9876543212',
    email: 'service@techproappliances.com',
    website: 'https://techproappliances.com',
    languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
    specialties: ['Brand Specialist', 'Warranty Services', 'Emergency Repairs'],
    certifications: ['LG Certified', 'Samsung Authorized', 'Whirlpool Certified']
  },
  {
    id: '4',
    name: 'PaintPerfect',
    rating: 4.6,
    services: ['Wall Painting', 'Texture Design', 'Polishing', 'Waterproofing'],
    responseTime: '2 hours',
    priceRange: '₹2000-8000',
    verified: true,
    available: true,
    reviews: 87,
    location: 'Pune',
    phone: '+91-9876543213',
    email: 'quotes@paintperfect.com',
    website: 'https://paintperfect.com',
    languages: ['English', 'Hindi', 'Marathi'],
    specialties: ['Interior Painting', 'Exterior Painting', 'Texture Design'],
    certifications: ['Painting License', 'Safety Certified']
  },
  {
    id: '5',
    name: 'PestControl Experts',
    rating: 4.9,
    services: ['Cockroach Control', 'Termite Treatment', 'Rodent Control', 'Bed Bug Removal'],
    responseTime: '3 hours',
    priceRange: '₹1500-6000',
    verified: true,
    available: true,
    reviews: 203,
    location: 'Chennai',
    phone: '+91-9876543214',
    email: 'help@pestcontrolexperts.in',
    website: 'https://pestcontrolexperts.in',
    languages: ['English', 'Tamil', 'Telugu'],
    specialties: ['Eco-friendly Methods', 'Long-term Solutions', 'Commercial Services'],
    certifications: ['Pest Control License', 'Eco-friendly Certified', 'Government Approved']
  }
];

const greetings = [
  'Hello! I\'m your AI Service Assistant. How can I help you today? 🤖✨',
  'Hi there! Need help finding the perfect service? I\'m here for you! 💡',
  'Welcome! I can help you book services, read reviews, and get recommendations. What do you need? 🌟',
  'Hey! I\'m powered by advanced AI to give you the best service recommendations. Ask me anything! 🚀'
];

export default function Chatbot() {
  const { user } = useUser();
  
  // Advanced State Management
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark' | 'professional'>('light');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showProviders, setShowProviders] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState<TypingIndicator>({ isTyping: false, text: '', delay: 0 });
  const [analytics, setAnalytics] = useState<ChatAnalytics>({
    totalMessages: 0,
    averageResponseTime: 0,
    sentimentScore: 0,
    resolvedIssues: 0,
    categoryFrequency: {},
    userSatisfaction: 0,
    languageUsage: {},
    attachmentCount: 0,
    voiceMessageCount: 0,
    sessionDuration: 0,
    topCategories: [],
    userEngagement: {
      messagesPerSession: 0,
      averageSessionLength: 0,
      returnRate: 0
    }
  });
  
  // Advanced Features State
  const [settings, setSettings] = useState<ChatSettings>({
    language: 'en',
    voiceEnabled: false,
    autoTranslate: false,
    soundEnabled: true,
    notificationsEnabled: true,
    theme: 'light',
    fontSize: 'medium',
    autoSave: true,
    shareData: false
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  
  // Refs
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Memoized Values
  const greeting = useMemo(() => {
    const langConfig = chatConfig.languages[currentLanguage as keyof typeof chatConfig.languages];
    return langConfig?.greeting || greetings[0];
  }, [currentLanguage]);
  
  // Initialize welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        text: `👋 Hello! I'm your Service Assistant! 

I can help you with:
🔧 Finding reliable service providers
⭐ Reading customer reviews and ratings
📅 Booking appointments and services
💰 Getting price quotes and estimates
🚨 Emergency service requests
🌐 Multi-language support

Try asking me:
• "Find a cleaning service near me"
• "Show me plumbing reviews"
• "I need emergency electrical help"
• "Get quotes for home repair"

How can I assist you today?`,
        timestamp: new Date().toISOString(),
        sentiment: 'positive',
        category: 'general',
        language: currentLanguage,
        metadata: {
          suggestedActions: [
            'Find a cleaning service',
            'Show me reviews',
            'Need plumbing help',
            'Emergency service needed',
            'Get price quotes',
            'Electrical issue'
          ],
          keywords: ['help', 'services', 'reviews', 'booking', 'emergency'],
          confidence: 1.0,
          urgency: 'low'
        }
      };
      
      setMessages([welcomeMessage]);
      setShowSmartSuggestions(true);
      
      // Generate initial smart suggestions
      const initialSuggestions: SmartSuggestion[] = [
        { id: '1', text: 'Find a cleaning service', category: 'cleaning', priority: 1, icon: '🧹', action: 'book' },
        { id: '2', text: 'Show me reviews', category: 'reviews', priority: 2, icon: '⭐', action: 'reviews' },
        { id: '3', text: 'Need plumbing help', category: 'plumbing', priority: 1, icon: '🔧', action: 'emergency' },
        { id: '4', text: 'Emergency service needed', category: 'emergency', priority: 1, icon: '🚨', action: 'emergency' },
        { id: '5', text: 'Get price quotes', category: 'quotes', priority: 2, icon: '💰', action: 'quote' }
      ];
      setSmartSuggestions(initialSuggestions);
      
      // Initialize session
      const session: ChatSession = {
        id: Date.now().toString(),
        title: 'New Chat',
        createdAt: new Date().toISOString(),
        messages: [welcomeMessage],
        lastActive: new Date().toISOString(),
        category: 'general',
        resolved: false,
        language: currentLanguage,
        sentiment: 'positive'
      };
      setCurrentSession(session);
    }
  }, [isOpen, messages.length, currentLanguage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);
  const generateSmartSuggestions = useCallback((userInput: string): SmartSuggestion[] => {
    const input = userInput.toLowerCase();
    const suggestions: SmartSuggestion[] = [];
    
    // Service-based suggestions
    if (input.includes('clean')) {
      suggestions.push(
        { id: '1', text: 'Book deep cleaning', category: 'cleaning', priority: 1, icon: '🧹', action: 'book' },
        { id: '2', text: 'Get cleaning quotes', category: 'cleaning', priority: 2, icon: '💰', action: 'quote' },
        { id: '3', text: 'View cleaning reviews', category: 'cleaning', priority: 3, icon: '⭐', action: 'reviews' }
      );
    }
    
    if (input.includes('plumb')) {
      suggestions.push(
        { id: '4', text: 'Emergency plumbing', category: 'plumbing', priority: 1, icon: '🚽', action: 'emergency' },
        { id: '5', text: 'Fix leak', category: 'plumbing', priority: 2, icon: '🔧', action: 'fix' },
        { id: '6', text: 'Find plumbers', category: 'plumbing', priority: 3, icon: '👨‍🔧', action: 'find' }
      );
    }
    
    // General suggestions
    if (suggestions.length === 0) {
      suggestions.push(
        { id: '7', text: 'Book a service', category: 'general', priority: 1, icon: '📅', action: 'book' },
        { id: '8', text: 'Get quotes', category: 'general', priority: 2, icon: '💰', action: 'quote' },
        { id: '9', text: 'Read reviews', category: 'general', priority: 3, icon: '⭐', action: 'reviews' },
        { id: '10', text: 'Contact support', category: 'general', priority: 4, icon: '📞', action: 'support' }
      );
    }
    
    return suggestions.slice(0, 5);
  }, []);
  
  // Voice Recording Functions
  const startVoiceRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      voiceRecorderRef.current = recorder;
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Mock transcription
        const mockTranscript = "Voice message transcript would appear here";
        
        const voiceMessage: VoiceMessage = {
          id: Date.now().toString(),
          duration: Math.floor(audioBlob.size / 1000),
          url: audioUrl,
          transcript: mockTranscript,
          language: currentLanguage,
          confidence: 0.85
        };
        
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          text: mockTranscript,
          timestamp: new Date().toISOString(),
          metadata: {
            voiceMessage
          }
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsRecording(false);
        
        // Trigger AI response
        setTimeout(() => {
          const aiResponse = generateAIResponse(mockTranscript);
          setMessages(prev => [...prev, aiResponse]);
        }, 1000);
      };
      
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting voice recording:', error);
      setIsRecording(false);
    }
  }, [currentLanguage]);
  
  const stopVoiceRecording = useCallback(() => {
    if (voiceRecorderRef.current && isRecording) {
      voiceRecorderRef.current.stop();
      voiceRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }, [isRecording]);
  
  // File Upload Functions
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newAttachments: Attachment[] = [];
    
    files.forEach((file) => {
      if (file.size <= chatConfig.fileConfig.maxSize) {
        const attachment: Attachment = {
          id: Date.now().toString() + Math.random().toString(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString()
        };
        newAttachments.push(attachment);
      }
    });
    
    setAttachments(prev => [...prev, ...newAttachments]);
    
    // Add message about file upload
    const uploadMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: `Uploaded ${newAttachments.length} file(s)`,
      timestamp: new Date().toISOString(),
      metadata: {
        attachments: newAttachments
      }
    };
    
    setMessages(prev => [...prev, uploadMessage]);
  }, []);
  
  // Translation Functions
  const translateMessage = useCallback(async (messageId: string, targetLanguage: string) => {
    setIsTranslating(true);
    
    // Mock translation
    setTimeout(() => {
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            metadata: {
              ...msg.metadata,
              translatedText: `[Translated to ${targetLanguage}] ${msg.text}`
            }
          };
        }
        return msg;
      }));
      setIsTranslating(false);
    }, 1000);
  }, []);
  
  // Search Functions
  const searchMessages = useCallback((query: string) => {
    const filtered = messages.filter(msg => 
      msg.text.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMessages(filtered);
  }, [messages]);
  
  // Auto-save Function
  const autoSaveChat = useCallback(() => {
    if (settings.autoSave && currentSession) {
      setAutoSaveStatus('saving');
      
      // Mock save to localStorage
      setTimeout(() => {
        localStorage.setItem(`chat_${currentSession.id}`, JSON.stringify(currentSession));
        setAutoSaveStatus('saved');
      }, 500);
    }
  }, [settings.autoSave, currentSession]);
  
  // Auto-save when messages change
  useEffect(() => {
    autoSaveChat();
  }, [messages, autoSaveChat]);
  
  // Initialize Chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        text: greeting,
        timestamp: new Date().toISOString(),
        language: currentLanguage,
        metadata: {
          suggestedActions: ['Find a Service', 'Read Reviews', 'Book Appointment', 'Get Recommendations'],
          followUpQuestions: [
            'What type of service are you looking for?',
            'Do you need immediate assistance?',
            'What\'s your preferred budget range?',
            'Any specific requirements?'
          ]
        }
      };
      setMessages([welcomeMessage]);
      
      // Initialize session
      const session: ChatSession = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [welcomeMessage],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        resolved: false,
        language: currentLanguage,
        sentiment: 'positive',
        priority: 'medium'
      };
      setCurrentSession(session);
    }
  }, [isOpen, messages.length, greeting, currentLanguage]);
  
  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Generate smart suggestions when input changes
  useEffect(() => {
    if (input.length > 2) {
      const suggestions = generateSmartSuggestions(input);
      setSmartSuggestions(suggestions);
      setShowSmartSuggestions(true);
    } else {
      setShowSmartSuggestions(false);
    }
  }, [input, generateSmartSuggestions]);
  
  // Enhanced AI Response Generation
  const generateAIResponse = useCallback((userInput: string): Message => {
    const input = userInput.toLowerCase();
    const timestamp = new Date().toISOString();
    
    // Advanced Sentiment Analysis
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let category = 'general';
    let urgency: 'low' | 'medium' | 'high' = 'medium';
    let keywords: string[] = [];
    
    // Detect sentiment with more patterns
    if (/(angry|bad|upset|worst|frustrat|disappointed|terrible|awful|hate|useless)/.test(input)) {
      sentiment = 'negative';
      urgency = 'high';
    } else if (/(love|great|awesome|thanks|thank|excellent|amazing|wonderful|perfect|brilliant)/.test(input)) {
      sentiment = 'positive';
      urgency = 'low';
    } else if (/(urgent|emergency|asap|immediately|right now|hurry)/.test(input)) {
      urgency = 'high';
    }
    
    // Extract keywords
    const keywordPatterns = {
      cleaning: ['clean', 'wash', 'dirt', 'stain', 'hygiene', 'sanitize'],
      plumbing: ['leak', 'tap', 'pipe', 'drain', 'clog', 'water', 'bathroom'],
      electrical: ['fan', 'light', 'switch', 'wire', 'power', 'ac', 'refrigerator'],
      pest: ['pest', 'cockroach', 'termite', 'rat', 'insect', 'bug'],
      painting: ['paint', 'color', 'wall', 'design', 'texture', 'polish'],
      carpentry: ['wood', 'furniture', 'door', 'cabinet', 'carpenter', 'repair']
    };
    
    Object.entries(keywordPatterns).forEach(([cat, patterns]) => {
      if (patterns.some(pattern => input.includes(pattern))) {
        category = cat;
        keywords.push(...patterns.filter(p => input.includes(p)));
      }
    });
    
    // Generate empathetic response with more context
    let empathyText = '';
    if (sentiment === 'negative') {
      empathyText = urgency === 'high' 
        ? "I understand this is urgent and you're upset. Let me help you immediately! ⚡"
        : "I'm really sorry you're going through this. I'll do my best to fix it right away. 💛";
    } else if (sentiment === 'positive') {
      empathyText = "That makes my day! Thank you for the positive feedback. 🌟";
    } else {
      empathyText = "I understand. Here's what I can do for you. 🤝";
    }
    
    // Generate more conversational and user-friendly responses
    let responseText = '';
    let suggestedActions: string[] = [];
    let relevantReviews: ReviewData[] = [];
    let relevantProviders: ProviderData[] = [];
    let followUpQuestions: string[] = [];
    
    // More empathetic and conversational responses
    if (category === 'cleaning') {
      responseText = `${empathyText}\n\n🧹 I'd be happy to help you find the perfect cleaning service! Whether you need deep cleaning, regular maintenance, or move-in cleaning, I can connect you with top-rated professionals.\n\nWhat type of cleaning service are you looking for today?`;
      suggestedActions = ['Book Deep Cleaning', 'Regular Cleaning', 'Move-in Cleaning', 'Get Quote'];
      relevantReviews = mockReviews.filter(r => r.service.includes('Clean') || r.service.includes('Cleaning'));
      relevantProviders = mockProviders.filter(p => p.services.some(s => s.includes('Clean')));
      followUpQuestions = [
        'How many rooms need cleaning?',
        'Do you need deep cleaning or regular maintenance?',
        'Any specific areas that need extra attention?',
        'When would you like the service?'
      ];
    } else if (category === 'plumbing') {
      responseText = `${empathyText}\n\n🔧 Plumbing issues can be stressful! Don't worry, I'll help you find reliable plumbers who can fix your problem quickly and affordably.\n\nCan you tell me more about the plumbing issue you're experiencing?`;
      suggestedActions = ['Fix Plumbing Issue', 'Emergency Plumber', 'Find Plumbers', 'Get Quote'];
      relevantReviews = mockReviews.filter(r => r.service.includes('Plumb'));
      relevantProviders = mockProviders.filter(p => p.services.some(s => s.includes('Plumb')));
      followUpQuestions = [
        'What specific plumbing problem are you facing?',
        'Is this an emergency situation?',
        'Which area of your home is affected?',
        'When do you need the service?'
      ];
    } else if (category === 'electrical') {
      responseText = `${empathyText}\n\n⚡ Electrical issues should always be taken seriously! I'll help you find certified electricians who can safely resolve your problem.\n\nWhat electrical service do you need help with?`;
      suggestedActions = ['Electrical Repair', 'Safety Inspection', 'Find Electricians', 'Emergency Service'];
      relevantReviews = mockReviews.filter(r => r.service.includes('Electrical'));
      relevantProviders = mockProviders.filter(p => p.services.some(s => s.includes('AC') || s.includes('Appliance')));
      followUpQuestions = [
        'What electrical appliance needs service?',
        'Is there any safety concern I should know about?',
        'When did the issue start?',
        'Have you noticed any other symptoms?'
      ];
    } else if (category === 'pest') {
      responseText = `${empathyText}\n\n🐜 Dealing with pests can be frustrating! I'll connect you with professional pest control experts who can effectively solve your problem.\n\nWhat type of pest are you dealing with?`;
      suggestedActions = ['Pest Control', 'Free Inspection', 'Emergency Service', 'Eco-friendly Options'];
      relevantReviews = mockReviews.filter(r => r.service.includes('Pest'));
      followUpQuestions = [
        'What type of pest are you seeing?',
        'How severe is the infestation?',
        'Do you have pets or children at home?',
        'Do you prefer eco-friendly solutions?'
      ];
    } else if (category === 'pricing') {
      responseText = `${empathyText}\n\n💰 I totally understand wanting to find the best value! Let me help you find quality services that fit your budget.\n\nWhat's your preferred price range for this service?`;
      suggestedActions = ['Budget Options', 'Premium Services', 'Compare Prices', 'Get Multiple Quotes'];
      followUpQuestions = [
        'What\'s your budget range?',
        'Are you looking for one-time or regular service?',
        'Do you prefer quality over cost?',
        'Any specific requirements?'
      ];
    } else if (category === 'reviews') {
      responseText = `${empathyText}\n\n⭐ Great idea to check reviews! I'll show you real customer experiences to help you make the best choice.\n\nWhat service are you looking for reviews about?`;
      suggestedActions = ['Top Rated Services', 'Recent Reviews', 'Verified Reviews', 'Compare Services'];
      relevantReviews = mockReviews.sort((a, b) => b.helpful - a.helpful).slice(0, 3);
      followUpQuestions = [
        'What service are you interested in?',
        'Do you want to see recent reviews?',
        'Any specific rating preference (4+ stars)?',
        'Are you looking for verified reviews only?'
      ];
    } else if (category === 'booking') {
      responseText = `${empathyText}\n\n📅 Perfect! I'll help you schedule your service at a time that works best for you.\n\nWhat service would you like to book and when?`;
      suggestedActions = ['Book Now', 'Check Availability', 'Schedule Later', 'Reschedule'];
      followUpQuestions = [
        'What service do you need?',
        'When would you prefer the appointment?',
        'Is this an emergency?',
        'Any specific time preferences?'
      ];
    } else if (category === 'emergency') {
      responseText = `${empathyText}\n\n🚨 I understand this is urgent! Let me find emergency service providers who can help you right away.\n\nWhat emergency service do you need immediately?`;
      suggestedActions = ['Emergency Plumbing', 'Emergency Electrical', '24/7 Service', 'Urgent Help'];
      followUpQuestions = [
        'What type of emergency is this?',
        'Is anyone in immediate danger?',
        'What\'s your location?',
        'Can you describe the urgency?'
      ];
    } else {
      responseText = `${empathyText}\n\n🤝 I'm here to help! I can assist you with finding reliable service providers for cleaning, plumbing, electrical work, pest control, and much more.\n\nWhat type of service are you looking for today?`;
      suggestedActions = ['Browse All Services', 'Get Recommendations', 'Popular Services', 'Contact Support'];
      followUpQuestions = [
        'What type of service do you need?',
        'Is this for your home or business?',
        'When do you need the service?',
        'Any specific requirements?'
      ];
    }
    
    return {
      id: Date.now().toString(),
      role: 'assistant',
      text: responseText,
      timestamp,
      sentiment,
      category,
      language: currentLanguage,
      metadata: {
        suggestedActions,
        reviews: relevantReviews,
        serviceProviders: relevantProviders,
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        keywords,
        urgency,
        followUpQuestions
      }
    };
  }, [currentLanguage]);
  
  // Send Message
  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || isTyping) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
      language: currentLanguage,
      metadata: {
        keywords: text.split(' ').filter(word => word.length > 3)
      }
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowSmartSuggestions(false);
    
    // Faster typing indicator
    setTypingIndicator({ isTyping: true, text: 'Bot is typing...', delay: 500 });
    
    // Faster AI response - reduced from 1500ms to 800ms for better UX
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      setTypingIndicator({ isTyping: false, text: '', delay: 0 });
      
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 2,
        averageResponseTime: 800, // Updated to reflect faster response
        sentimentScore: aiResponse.sentiment === 'positive' ? prev.sentimentScore + 0.1 : 
                       aiResponse.sentiment === 'negative' ? prev.sentimentScore - 0.1 : prev.sentimentScore,
        categoryFrequency: {
          ...prev.categoryFrequency,
          [aiResponse.category || 'general']: (prev.categoryFrequency[aiResponse.category || 'general'] || 0) + 1
        },
        languageUsage: {
          ...prev.languageUsage,
          [currentLanguage]: (prev.languageUsage[currentLanguage] || 0) + 1
        }
      }));
      
      // Update session
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          messages: [...currentSession.messages, userMessage, aiResponse],
          lastActive: new Date().toISOString(),
          sentiment: aiResponse.sentiment,
          category: aiResponse.category
        };
        setCurrentSession(updatedSession);
      }
      
      // Show smart suggestions after response
      if (aiResponse.metadata?.suggestedActions && aiResponse.metadata.suggestedActions.length > 0) {
        const suggestions: SmartSuggestion[] = aiResponse.metadata.suggestedActions.map((action, index) => ({
          id: (index + 1).toString(),
          text: action,
          category: aiResponse.category || 'general',
          priority: 1,
          icon: aiResponse.category === 'cleaning' ? '🧹' : 
                aiResponse.category === 'plumbing' ? '🔧' : 
                aiResponse.category === 'emergency' ? '🚨' : 
                aiResponse.category === 'quotes' ? '💰' : '💬',
          action: 'response'
        }));
        setSmartSuggestions(suggestions);
        setShowSmartSuggestions(true);
      }
    }, 800); // Reduced from 1500ms to 800ms for faster response
  }, [input, isTyping, generateAIResponse, currentSession, currentLanguage]);
  
  // Handle Action Click - Faster response for better UX
  const handleActionClick = useCallback((action: string) => {
    const actionMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: action,
      timestamp: new Date().toISOString(),
      language: currentLanguage
    };
    setMessages(prev => [...prev, actionMessage]);
    setInput(action);
    setShowSmartSuggestions(false);
    
    // Faster AI response for action clicks - 500ms instead of 500ms
    setTimeout(() => {
      const aiResponse = generateAIResponse(action);
      setMessages(prev => [...prev, aiResponse]);
      
      // Show smart suggestions after action response
      if (aiResponse.metadata?.suggestedActions && aiResponse.metadata.suggestedActions.length > 0) {
        const suggestions: SmartSuggestion[] = aiResponse.metadata.suggestedActions.map((actionText, index) => ({
          id: (index + 1).toString(),
          text: actionText,
          category: aiResponse.category || 'general',
          priority: 1,
          icon: aiResponse.category === 'cleaning' ? '🧹' : 
                aiResponse.category === 'plumbing' ? '🔧' : 
                aiResponse.category === 'emergency' ? '🚨' : 
                aiResponse.category === 'quotes' ? '💰' : 
                aiResponse.category === 'electrical' ? '⚡' : 
                aiResponse.category === 'pest' ? '🐜' : '💬',
          action: 'response'
        }));
        setSmartSuggestions(suggestions);
        setShowSmartSuggestions(true);
      }
    }, 500);
  }, [generateAIResponse, currentLanguage]);
  
  // Handle Smart Suggestion Click
  const handleSmartSuggestionClick = useCallback((suggestion: SmartSuggestion) => {
    handleActionClick(suggestion.text);
  }, [handleActionClick]);
  
  // Format Time
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get Sentiment Icon
  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };
  
  // Get Category Icon
  const getCategoryIcon = (category?: string) => {
    return chatConfig.categories[category as keyof typeof chatConfig.categories]?.icon || '💬';
  };
  
  // Get Urgency Color
  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return '#f56565';
      case 'medium': return '#ed8936';
      case 'low': return '#48bb78';
      default: return '#718096';
    }
  };
  
  // Handle Language Change
  const handleLanguageChange = useCallback((language: string) => {
    setCurrentLanguage(language);
    setSettings(prev => ({ ...prev, language }));
  }, []);
  
  // Handle Theme Change
  const handleThemeChange = useCallback((newTheme: 'light' | 'dark' | 'professional') => {
    setTheme(newTheme);
    setSettings(prev => ({ ...prev, theme: newTheme }));
  }, []);
  
  // Handle Theme Toggle (for button click)
  const handleThemeToggle = useCallback(() => {
    const themes: ('light' | 'dark' | 'professional')[] = ['light', 'dark', 'professional'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    handleThemeChange(nextTheme);
  }, [theme, handleThemeChange]);
  
  // Handle Font Size Change
  const handleFontSizeChange = useCallback((size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    setSettings(prev => ({ ...prev, fontSize: size }));
  }, []);
  
  // Export Chat History
  const exportChatHistory = useCallback(() => {
    if (currentSession) {
      const chatData = {
        session: currentSession,
        analytics,
        settings,
        exportedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-history-${currentSession.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [currentSession, analytics, settings]);
  
  // Clear Chat
  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentSession(null);
    setAttachments([]);
    setSmartSuggestions([]);
    setShowSmartSuggestions(false);
  }, []);
  
  // Toggle Fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);
  
  // Handle Emoji Selection
  const handleEmojiSelect = useCallback((emoji: string) => {
    setInput(prev => prev + emoji);
    setShowEmojis(false);
    inputRef.current?.focus();
  }, []);
  
  // Common Emojis
  const commonEmojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🙏', '💪', '👏', '🤝'];
  
  return (
    <div className={`advanced-chatbot ${isOpen ? 'open' : 'closed'} theme-${theme} font-size-${fontSize} ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Chat FAB */}
      <button 
        className="chat-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with Service Assistant"
      >
        <span className="fab-icon">💬</span>
        <span className="fab-badge">Bot</span>
        {messages.length > 1 && (
          <span className="notification-dot"></span>
        )}
        {autoSaveStatus === 'saving' && (
          <span className="saving-indicator">💾</span>
        )}
      </button>
      
      {/* Chat Panel */}
      {isOpen && (
        <div className={`chat-panel ${isFullscreen ? 'fullscreen-panel' : ''}`} role="dialog" aria-label="Advanced Service Assistant">
          {/* Header */}
          <div className="chat-header">
            <div className="header-content">
              <div className="header-info">
                <h3>Service Assistant</h3>
                <span className="status-badge">Online • Ready to Help</span>
                {autoSaveStatus === 'saved' && (
                  <span className="auto-save-status">✓ Auto-saved</span>
                )}
              </div>
              <div className="header-actions">
                <button 
                  className="header-btn"
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  title="Chat Analytics"
                >
                  📊
                </button>
                <button 
                  className="header-btn"
                  onClick={() => setShowHistory(!showHistory)}
                  title="Chat History"
                >
                  📝
                </button>
                <button 
                  className="header-btn"
                  onClick={() => setShowSettings(!showSettings)}
                  title="Settings"
                >
                  ⚙️
                </button>
                <button 
                  className="header-btn"
                  onClick={exportChatHistory}
                  title="Export Chat"
                >
                  💾
                </button>
                <button 
                  className="header-btn"
                  onClick={toggleFullscreen}
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? '🗗' : '🗖'}
                </button>
                <button 
                  className="header-btn"
                  onClick={() => setShowSearch(!showSearch)}
                  title="Search Messages"
                >
                  🔍
                </button>
                <button 
                  className="header-btn"
                  onClick={handleThemeToggle}
                  title="Toggle Theme"
                >
                  {theme === 'light' ? '🌙' : theme === 'dark' ? '☀️' : '🎨'}
                </button>
                <button 
                  className="header-btn close-btn"
                  onClick={() => setIsOpen(false)}
                  title="Close Chat"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="language-selector">
              <select 
                value={currentLanguage} 
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="language-dropdown"
              >
                {Object.entries(chatConfig.languages).map(([code, lang]) => (
                  <option key={code} value={code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Search Bar */}
          {showSearch && (
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchMessages(e.target.value);
                }}
                className="search-input"
              />
              <button 
                className="search-close"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                  setFilteredMessages([]);
                }}
              >
                ✕
              </button>
            </div>
          )}
          
          {/* Analytics Panel */}
          {showAnalytics && (
            <div className="analytics-panel">
              <h4>📊 Chat Analytics</h4>
              <div className="analytics-grid">
                <div className="analytics-item">
                  <span className="analytics-value">{analytics.totalMessages}</span>
                  <span className="analytics-label">Messages</span>
                </div>
                <div className="analytics-item">
                  <span className="analytics-value">{analytics.averageResponseTime}ms</span>
                  <span className="analytics-label">Avg Response</span>
                </div>
                <div className="analytics-item">
                  <span className="analytics-value">{(analytics.sentimentScore * 100).toFixed(0)}%</span>
                  <span className="analytics-label">Satisfaction</span>
                </div>
                <div className="analytics-item">
                  <span className="analytics-value">{analytics.attachmentCount}</span>
                  <span className="analytics-label">Attachments</span>
                </div>
                <div className="analytics-item">
                  <span className="analytics-value">{analytics.voiceMessageCount}</span>
                  <span className="analytics-label">Voice Messages</span>
                </div>
                <div className="analytics-item">
                  <span className="analytics-value">{Object.keys(analytics.languageUsage).length}</span>
                  <span className="analytics-label">Languages Used</span>
                </div>
              </div>
              
              {/* Category Frequency */}
              <div className="category-frequency">
                <h5>Service Categories</h5>
                {Object.entries(analytics.categoryFrequency).map(([category, count]) => (
                  <div key={category} className="category-item">
                    <span className="category-icon">{getCategoryIcon(category)}</span>
                    <span className="category-name">{category}</span>
                    <span className="category-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Settings Panel */}
          {showSettings && (
            <div className="settings-panel">
              <h4>⚙️ Chat Settings</h4>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Voice Messages</label>
                  <button 
                    className={`toggle-btn ${settings.voiceEnabled ? 'active' : ''}`}
                    onClick={() => setSettings(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }))}
                  >
                    {settings.voiceEnabled ? '🎤' : '🔇'}
                  </button>
                </div>
                <div className="setting-item">
                  <label>Auto Translate</label>
                  <button 
                    className={`toggle-btn ${settings.autoTranslate ? 'active' : ''}`}
                    onClick={() => setSettings(prev => ({ ...prev, autoTranslate: !prev.autoTranslate }))}
                  >
                    {settings.autoTranslate ? '🌐' : '📝'}
                  </button>
                </div>
                <div className="setting-item">
                  <label>Sound Effects</label>
                  <button 
                    className={`toggle-btn ${settings.soundEnabled ? 'active' : ''}`}
                    onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                  >
                    {settings.soundEnabled ? '🔊' : '🔈'}
                  </button>
                </div>
                <div className="setting-item">
                  <label>Notifications</label>
                  <button 
                    className={`toggle-btn ${settings.notificationsEnabled ? 'active' : ''}`}
                    onClick={() => setSettings(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }))}
                  >
                    {settings.notificationsEnabled ? '🔔' : '🔕'}
                  </button>
                </div>
                <div className="setting-item">
                  <label>Font Size</label>
                  <select 
                    value={fontSize} 
                    onChange={(e) => handleFontSizeChange(e.target.value as 'small' | 'medium' | 'large')}
                    className="font-size-select"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div className="setting-item">
                  <button 
                    className="clear-chat-btn"
                    onClick={clearChat}
                  >
                    🗑️ Clear Chat
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Messages Container */}
          <div className="chat-messages" ref={messagesRef}>
            {(showSearch && searchQuery ? filteredMessages : messages).map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.role} ${message.sentiment} ${message.metadata?.urgency ? `urgency-${message.metadata.urgency}` : ''}`}
              >
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-role">
                      {message.role === 'assistant' ? '🤖 Service Assistant' : '👤 You'}
                    </span>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                    {message.sentiment && (
                      <span className="message-sentiment">
                        {getSentimentIcon(message.sentiment)}
                      </span>
                    )}
                    {message.category && (
                      <span className="message-category">
                        {getCategoryIcon(message.category)}
                      </span>
                    )}
                    {message.metadata?.urgency && (
                      <span 
                        className="message-urgency"
                        style={{ color: getUrgencyColor(message.metadata.urgency) }}
                      >
                        {message.metadata.urgency.toUpperCase()}
                      </span>
                    )}
                    {message.language && message.language !== 'en' && (
                      <span className="message-language">{message.language.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="message-text">
                    {message.text}
                    {message.metadata?.translatedText && (
                      <div className="translated-text">
                        {message.metadata.translatedText}
                      </div>
                    )}
                  </div>
                  
                  {/* Voice Message */}
                  {message.metadata?.voiceMessage && (
                    <div className="voice-message">
                      <audio controls className="voice-audio">
                        <source src={message.metadata.voiceMessage.url} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                      <div className="voice-transcript">
                        <strong>Transcript:</strong> {message.metadata.voiceMessage.transcript}
                      </div>
                    </div>
                  )}
                  
                  {/* Attachments */}
                  {message.metadata?.attachments && message.metadata.attachments.length > 0 && (
                    <div className="message-attachments">
                      {message.metadata.attachments.map((attachment) => (
                        <div key={attachment.id} className="attachment">
                          {attachment.type.startsWith('image/') ? (
                            <img src={attachment.url} alt={attachment.name} className="attachment-image" />
                          ) : (
                            <div className="attachment-file">
                              <span className="file-icon">📄</span>
                              <span className="file-name">{attachment.name}</span>
                              <span className="file-size">{(attachment.size / 1024).toFixed(1)} KB</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Keywords */}
                  {message.metadata?.keywords && message.metadata.keywords.length > 0 && (
                    <div className="message-keywords">
                      {message.metadata.keywords.map((keyword, index) => (
                        <span key={index} className="keyword-tag">{keyword}</span>
                      ))}
                    </div>
                  )}
                  
                  {/* Suggested Actions */}
                  {message.metadata?.suggestedActions && (
                    <div className="suggested-actions">
                      {message.metadata.suggestedActions.map((action, index) => (
                        <button
                          key={index}
                          className="action-btn"
                          onClick={() => handleActionClick(action)}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Follow-up Questions */}
                  {message.metadata?.followUpQuestions && message.metadata.followUpQuestions.length > 0 && (
                    <div className="follow-up-questions">
                      <h5>💡 Follow-up Questions:</h5>
                      {message.metadata.followUpQuestions.map((question, index) => (
                        <button
                          key={index}
                          className="question-btn"
                          onClick={() => handleActionClick(question)}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Relevant Reviews */}
                  {message.metadata?.reviews && message.metadata.reviews.length > 0 && (
                    <div className="message-reviews">
                      <h5>📝 Relevant Reviews</h5>
                      {message.metadata.reviews.map((review) => (
                        <div key={review.id} className="review-card">
                          <div className="review-header">
                            <span className="reviewer-name">{review.reviewer}</span>
                            <div className="review-rating">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span key={i} className={`star ${i < review.rating ? 'filled' : 'empty'}`}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                            <span className="review-date">{review.date}</span>
                            {review.verified && (
                              <span className="verified-badge">✓ Verified</span>
                            )}
                          </div>
                          <p className="review-comment">{review.comment}</p>
                          <div className="review-meta">
                            <span className="review-service">{review.service}</span>
                            <span className="review-helpful">👍 {review.helpful} helpful</span>
                          </div>
                          
                          {/* Pros and Cons */}
                          {review.pros && review.pros.length > 0 && (
                            <div className="review-pros">
                              <h6>✅ Pros:</h6>
                              <div className="pros-list">
                                {review.pros.map((pro, index) => (
                                  <span key={index} className="pro-tag">{pro}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {review.cons && review.cons.length > 0 && (
                            <div className="review-cons">
                              <h6>❌ Cons:</h6>
                              <div className="cons-list">
                                {review.cons.map((con, index) => (
                                  <span key={index} className="con-tag">{con}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Response */}
                          {review.response && (
                            <div className="review-response">
                              <h6>📝 Response:</h6>
                              <p>{review.response}</p>
                            </div>
                          )}
                          
                          {/* Images */}
                          {review.images && review.images.length > 0 && (
                            <div className="review-images">
                              {review.images.map((image, index) => (
                                <img key={index} src={image} alt={`Review image ${index + 1}`} className="review-image" />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Service Providers */}
                  {message.metadata?.serviceProviders && message.metadata.serviceProviders.length > 0 && (
                    <div className="message-providers">
                      <h5>🔧 Recommended Providers</h5>
                      {message.metadata.serviceProviders.map((provider) => (
                        <div key={provider.id} className="provider-card">
                          <div className="provider-header">
                            <h6>{provider.name}</h6>
                            <span className={`availability ${provider.available ? 'available' : 'busy'}`}>
                              {provider.available ? '✓ Available' : '🕐 Busy'}
                            </span>
                            {provider.verified && (
                              <span className="verified-provider">✓ Verified</span>
                            )}
                          </div>
                          <div className="provider-info">
                            <div className="provider-rating">
                              ⭐ {provider.rating} ({provider.reviews} reviews)
                            </div>
                            <div className="provider-response">🕐 {provider.responseTime}</div>
                            <div className="provider-price">💰 {provider.priceRange}</div>
                            {provider.location && (
                              <div className="provider-location">📍 {provider.location}</div>
                            )}
                          </div>
                          <div className="provider-services">
                            {provider.services.map((service, index) => (
                              <span key={index} className="service-tag">{service}</span>
                            ))}
                          </div>
                          {provider.languages && provider.languages.length > 0 && (
                            <div className="provider-languages">
                              <span className="languages-label">🌐 Languages:</span>
                              {provider.languages.map((lang, index) => (
                                <span key={index} className="language-tag">{lang}</span>
                              ))}
                            </div>
                          )}
                          {provider.specialties && provider.specialties.length > 0 && (
                            <div className="provider-specialties">
                              <span className="specialties-label">⭐ Specialties:</span>
                              {provider.specialties.map((specialty, index) => (
                                <span key={index} className="specialty-tag">{specialty}</span>
                              ))}
                            </div>
                          )}
                          {provider.certifications && provider.certifications.length > 0 && (
                            <div className="provider-certifications">
                              <span className="certifications-label">🏆 Certifications:</span>
                              {provider.certifications.map((cert, index) => (
                                <span key={index} className="certification-tag">{cert}</span>
                              ))}
                            </div>
                          )}
                          <div className="provider-contact">
                            {provider.phone && (
                              <button className="contact-btn" onClick={() => window.open(`tel:${provider.phone}`)}>
                                📞 Call
                              </button>
                            )}
                            {provider.email && (
                              <button className="contact-btn" onClick={() => window.open(`mailto:${provider.email}`)}>
                                📧 Email
                              </button>
                            )}
                            {provider.website && (
                              <button className="contact-btn" onClick={() => window.open(provider.website, '_blank')}>
                                🌐 Website
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                <span className="typing-text">{typingIndicator.text}</span>
              </div>
            )}
          </div>
          
          {/* Smart Suggestions */}
          {showSmartSuggestions && smartSuggestions.length > 0 && (
            <div className="smart-suggestions">
              <h6>💡 Smart Suggestions:</h6>
              <div className="suggestions-list">
                {smartSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    className="smart-suggestion-btn"
                    onClick={() => handleSmartSuggestionClick(suggestion)}
                  >
                    <span className="suggestion-icon">{suggestion.icon}</span>
                    <span className="suggestion-text">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input Area */}
          <div className="chat-input">
            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="attachments-preview">
                <h6>📎 Attachments:</h6>
                <div className="attachments-list">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="attachment-preview">
                      {attachment.type.startsWith('image/') ? (
                        <img src={attachment.url} alt={attachment.name} className="preview-image" />
                      ) : (
                        <div className="preview-file">
                          <span className="file-icon">📄</span>
                          <span className="file-name">{attachment.name}</span>
                        </div>
                      )}
                      <button 
                        className="remove-attachment"
                        onClick={() => setAttachments(prev => prev.filter(a => a.id !== attachment.id))}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="input-container">
              <div className="input-left">
                {/* File Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={chatConfig.fileConfig.allowedTypes.join(',')}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button 
                  className="input-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach File"
                >
                  📎
                </button>
                
                {/* Voice Recording */}
                {settings.voiceEnabled && (
                  <button 
                    className={`input-btn voice-btn ${isRecording ? 'recording' : ''}`}
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
                  >
                    {isRecording ? '⏹️' : '🎤'}
                  </button>
                )}
                
                {/* Emoji Picker */}
                <button 
                  className="input-btn"
                  onClick={() => setShowEmojis(!showEmojis)}
                  title="Add Emoji"
                >
                  😊
                </button>
              </div>
              
              <div className="input-center">
                <input
                  ref={inputRef}
                  type="text"
                  className="message-input"
                  placeholder={`Ask me anything about services, reviews, or bookings... (${currentLanguage.toUpperCase()})`}
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
              </div>
              
              <div className="input-right">
                {/* Translation */}
                {settings.autoTranslate && currentLanguage !== 'en' && (
                  <button 
                    className="input-btn"
                    onClick={() => {
                      if (input.trim()) {
                        translateMessage(Date.now().toString(), 'en');
                      }
                    }}
                    title="Translate to English"
                    disabled={isTranslating}
                  >
                    {isTranslating ? '⏳' : '🌐'}
                  </button>
                )}
                
                {/* Send Button */}
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
            
            {/* Emoji Picker */}
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
            
            {/* Quick Actions */}
            <div className="quick-actions">
              <button 
                className="quick-action"
                onClick={() => handleActionClick('Find a cleaning service')}
              >
                🧹 Cleaning
              </button>
              <button 
                className="quick-action"
                onClick={() => handleActionClick('Need plumbing help')}
              >
                🔧 Plumbing
              </button>
              <button 
                className="quick-action"
                onClick={() => handleActionClick('Electrical issue')}
              >
                ⚡ Electrical
              </button>
              <button 
                className="quick-action"
                onClick={() => handleActionClick('Show me reviews')}
              >
                ⭐ Reviews
              </button>
              <button 
                className="quick-action"
                onClick={() => handleActionClick('Emergency service needed')}
              >
                🚨 Emergency
              </button>
              <button 
                className="quick-action"
                onClick={() => handleActionClick('Get price quotes')}
              >
                💰 Quotes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
