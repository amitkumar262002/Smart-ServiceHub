import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/FindProviderAdvanced.css';
import ProviderComparison from './ProviderComparison';
import ProviderMapView from './ProviderMapView';
import AdvancedSearch from './AdvancedSearch';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Award, 
  Users, 
  TrendingUp,
  Shield,
  Zap,
  Heart,
  MessageCircle,
  ChevronDown,
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  UserCheck,
  Briefcase,
  DollarSign,
  Camera,
  Video,
  FileText,
  Download,
  Share2,
  Bookmark,
  ExternalLink,
  Wifi,
  Car,
  Languages,
  ThumbsUp,
  AlertCircle,
  TrendingDown,
  Map,
  BarChart3,
  Activity,
  Target,
  Globe,
  Navigation,
  FilterX,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  verified: boolean;
  available: boolean;
  emergency: boolean;
  experience: string;
  location: string;
  distance: string;
  price: string;
  image: string;
  phone: string;
  email: string;
  specialties: string[];
  certifications: string[];
  responseTime: string;
  completedJobs: number;
  languages: string[];
  about: string;
  workingHours: string;
  insurance: boolean;
  backgroundCheck: boolean;
  portfolio: string[];
  badges: string[];
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  // Advanced features
  onlineBooking: boolean;
  videoConsultation: boolean;
  freeEstimate: boolean;
  warranty: boolean;
  lastActive: string;
  responseRate: number;
  acceptanceRate: number;
  cancellationRate: number;
  averageResponseTime: string;
  premiumServices: string[];
  equipment: string[];
  serviceAreas: string[];
  paymentMethods: string[];
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  reviewsSummary: {
    recent: number;
    positive: number;
    neutral: number;
    negative: number;
  };
  trending: boolean;
  featured: boolean;
  topRated: boolean;
  quickResponder: boolean;
  // Map-specific properties
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  serviceRadius: number;
}

const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'John Smith',
    category: 'Plumbing',
    rating: 4.9,
    reviews: 342,
    verified: true,
    available: true,
    emergency: true,
    experience: '15+ years',
    location: 'Downtown District',
    distance: '2.3 km',
    price: '$80-120/hr',
    image: '👨‍🔧',
    phone: '+1 234-567-8901',
    email: 'john.smith@services.com',
    specialties: ['Emergency Repairs', 'Pipe Installation', 'Drain Cleaning'],
    certifications: ['Licensed Plumber', 'OSHA Certified', 'Green Plumbing'],
    responseTime: '15 mins',
    completedJobs: 1250,
    languages: ['English', 'Spanish'],
    about: 'Professional plumber with over 15 years of experience in residential and commercial plumbing. Specialized in emergency repairs and eco-friendly solutions.',
    workingHours: 'Mon-Sat: 8AM-8PM, Sun: 10AM-6PM',
    insurance: true,
    backgroundCheck: true,
    portfolio: ['plumbing1.jpg', 'plumbing2.jpg'],
    badges: ['Top Rated', 'Quick Response', 'Verified'],
    availability: {
      monday: true, tuesday: true, wednesday: true, thursday: true,
      friday: true, saturday: true, sunday: false
    },
    // Advanced features
    onlineBooking: true,
    videoConsultation: true,
    freeEstimate: true,
    warranty: true,
    lastActive: '2 mins ago',
    responseRate: 98,
    acceptanceRate: 95,
    cancellationRate: 2,
    averageResponseTime: '15 mins',
    premiumServices: ['24/7 Emergency', 'Eco-Friendly Solutions', 'Commercial Plumbing'],
    equipment: ['Pipe Inspection Camera', 'Hydro Jetting', 'Leak Detection Tools'],
    serviceAreas: ['Downtown', 'Midtown', 'Uptown', 'Westside'],
    paymentMethods: ['Credit Card', 'Cash', 'Bank Transfer', 'Digital Wallet'],
    website: 'www.johnsmithplumbing.com',
    socialMedia: {
      facebook: 'johnsmithplumbing',
      instagram: '@johnsmith_plumbing'
    },
    reviewsSummary: {
      recent: 45,
      positive: 310,
      neutral: 25,
      negative: 7
    },
    trending: true,
    featured: true,
    topRated: true,
    quickResponder: true,
    coordinates: { lat: 40.7580, lng: -73.9855 },
    address: '123 Main St, New York, NY 10001',
    serviceRadius: 15
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    category: 'Electrical',
    rating: 4.8,
    reviews: 289,
    verified: true,
    available: true,
    emergency: true,
    experience: '12+ years',
    location: 'West Side',
    distance: '3.7 km',
    price: '$90-150/hr',
    image: '👩‍⚡',
    phone: '+1 234-567-8902',
    email: 'sarah.j@electrical.com',
    specialties: ['Circuit Repair', 'Installation', 'Safety Inspection'],
    certifications: ['Master Electrician', 'Safety Certified', 'Solar Panel Expert'],
    responseTime: '20 mins',
    completedJobs: 980,
    languages: ['English', 'French'],
    about: 'Certified master electrician specializing in both residential and commercial projects. Expert in modern smart home installations.',
    workingHours: 'Mon-Fri: 7AM-7PM, Sat: 9AM-5PM',
    insurance: true,
    backgroundCheck: true,
    portfolio: ['electrical1.jpg', 'electrical2.jpg'],
    badges: ['Expert', 'Insured', 'Background Checked'],
    availability: {
      monday: true, tuesday: true, wednesday: true, thursday: true,
      friday: true, saturday: false, sunday: false
    },
    // Advanced features
    onlineBooking: true,
    videoConsultation: false,
    freeEstimate: true,
    warranty: true,
    lastActive: '5 mins ago',
    responseRate: 95,
    acceptanceRate: 92,
    cancellationRate: 3,
    averageResponseTime: '20 mins',
    premiumServices: ['Smart Home Installation', 'Solar Panel Setup', 'Commercial Electrical'],
    equipment: ['Multimeter', 'Circuit Testers', 'Wire Strippers', 'Safety Gear'],
    serviceAreas: ['West Side', 'North End', 'Central District'],
    paymentMethods: ['Credit Card', 'Bank Transfer', 'Financing Available'],
    website: 'www.sarahjohnsonelectrical.com',
    socialMedia: {
      linkedin: 'sarah-johnson-electrical'
    },
    reviewsSummary: {
      recent: 38,
      positive: 265,
      neutral: 18,
      negative: 6
    },
    trending: false,
    featured: true,
    topRated: true,
    quickResponder: true,
    coordinates: { lat: 40.7614, lng: -73.9776 },
    address: '456 West 34th St, New York, NY 10001',
    serviceRadius: 20
  },
  {
    id: '3',
    name: 'Mike Chen',
    category: 'Cleaning',
    rating: 4.7,
    reviews: 156,
    verified: true,
    available: false,
    emergency: false,
    experience: '8+ years',
    location: 'North Area',
    distance: '5.1 km',
    price: '$25-40/hr',
    image: '🧹',
    phone: '+1 234-567-8903',
    email: 'mike.chen@clean.com',
    specialties: ['Deep Cleaning', 'Office Cleaning', 'Eco-Friendly'],
    certifications: ['Cleaning Professional', 'Green Certified', 'COVID-19 Trained'],
    responseTime: '1 hour',
    completedJobs: 620,
    languages: ['English', 'Mandarin'],
    about: 'Professional cleaning service provider with expertise in both residential and commercial spaces. Uses eco-friendly products.',
    workingHours: 'Mon-Sat: 9AM-6PM',
    insurance: true,
    backgroundCheck: true,
    portfolio: ['cleaning1.jpg', 'cleaning2.jpg'],
    badges: ['Eco Friendly', 'Trusted', 'Professional'],
    availability: {
      monday: true, tuesday: true, wednesday: true, thursday: true,
      friday: true, saturday: true, sunday: false
    },
    // Advanced features
    onlineBooking: true,
    videoConsultation: false,
    freeEstimate: true,
    warranty: false,
    lastActive: '1 hour ago',
    responseRate: 88,
    acceptanceRate: 90,
    cancellationRate: 5,
    averageResponseTime: '1 hour',
    premiumServices: ['Post-Construction Cleaning', 'COVID-19 Sanitization', 'Green Cleaning'],
    equipment: ['HEPA Vacuums', 'Steam Cleaners', 'Eco-Friendly Supplies'],
    serviceAreas: ['North Area', 'East Side', 'Central'],
    paymentMethods: ['Credit Card', 'Cash', 'Digital Wallet'],
    reviewsSummary: {
      recent: 22,
      positive: 140,
      neutral: 12,
      negative: 4
    },
    trending: false,
    featured: false,
    topRated: false,
    quickResponder: false,
    coordinates: { lat: 40.7614, lng: -73.9776 },
    address: '456 West 34th St, New York, NY 10001',
    serviceRadius: 20
  },
  {
    id: '4',
    name: 'Emily Davis',
    category: 'Painting',
    rating: 4.9,
    reviews: 423,
    verified: true,
    available: true,
    emergency: false,
    experience: '10+ years',
    location: 'East End',
    distance: '4.2 km',
    price: '$35-60/hr',
    image: '🎨',
    phone: '+1 234-567-8904',
    email: 'emily.d@paint.com',
    specialties: ['Interior Painting', 'Exterior Painting', 'Decorative Finishes'],
    certifications: ['Licensed Painter', 'Color Specialist'],
    responseTime: '30 mins',
    completedJobs: 890,
    languages: ['English', 'Italian'],
    about: 'Professional painter with expertise in color coordination.',
    workingHours: 'Mon-Fri: 8AM-6PM',
    insurance: true,
    backgroundCheck: true,
    portfolio: ['interior-project.jpg', 'exterior-finish.jpg'],
    badges: ['Color Expert', 'Eco-Friendly'],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    onlineBooking: true,
    videoConsultation: true,
    freeEstimate: true,
    warranty: true,
    lastActive: '30 mins ago',
    responseRate: 96,
    acceptanceRate: 94,
    cancellationRate: 2,
    averageResponseTime: '30 mins',
    premiumServices: ['Color Consultation', 'Faux Finishing'],
    equipment: ['Professional Brushes', 'Spray Systems', 'Color Matching Tools'],
    serviceAreas: ['East End', 'Downtown', 'Waterfront'],
    paymentMethods: ['Credit Card', 'Bank Transfer', 'Payment Plans'],
    website: 'www.emilydavispainting.com',
    socialMedia: {
      instagram: '@emily_davis_painting',
      facebook: 'emilydavispainting'
    },
    reviewsSummary: {
      recent: 58,
      positive: 395,
      neutral: 22,
      negative: 6
    },
    trending: true,
    featured: true,
    topRated: true,
    quickResponder: true,
    coordinates: { lat: 40.7489, lng: -73.9680 },
    address: '789 East 42nd St, New York, NY 10017',
    serviceRadius: 12
  }
];

const categories = [
  { id: 'all', name: 'All Services', icon: '🔧', color: '#6b7280' },
  { id: 'plumbing', name: 'Plumbing', icon: '👨‍🔧', color: '#3b82f6' },
  { id: 'electrical', name: 'Electrical', icon: '⚡', color: '#f59e0b' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹', color: '#10b981' },
  { id: 'painting', name: 'Painting', icon: '🎨', color: '#8b5cf6' },
  { id: 'carpentry', name: 'Carpentry', icon: '🔨', color: '#ef4444' },
  { id: 'hvac', name: 'HVAC', icon: '❄️', color: '#06b6d4' },
  { id: 'pest', name: 'Pest Control', icon: '🐛', color: '#84cc16' }
];

const sortOptions = [
  { id: 'rating', name: 'Highest Rated', icon: Star },
  { id: 'distance', name: 'Nearest', icon: MapPin },
  { id: 'price-low', name: 'Price Low to High', icon: SortAsc },
  { id: 'price-high', name: 'Price High to Low', icon: SortDesc },
  { id: 'experience', name: 'Most Experienced', icon: Award },
  { id: 'reviews', name: 'Most Reviews', icon: MessageCircle }
];

export default function FindProviderAdvanced() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [providerStats, setProviderStats] = useState<{ total: number; online: number; new: number }>({
    total: 0,
    online: 0,
    new: 0
  });
  const [showViewMode, setShowViewMode] = useState<'main' | 'comparison' | 'map' | 'advanced'>('main');
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const [filters, setFilters] = useState({
    verifiedOnly: false,
    availableOnly: false,
    emergencyOnly: false,
    onlineBookingOnly: false,
    videoConsultationOnly: false,
    freeEstimateOnly: false,
    warrantyOnly: false,
    priceRange: [0, 200],
    minRating: 0,
    distance: 10,
    responseRate: 0,
    languages: [] as string[],
    serviceAreas: [] as string[],
    paymentMethods: [] as string[]
  });
  const [savedProviders, setSavedProviders] = useState<string[]>([]);

  // Advanced search suggestions
  const generateSearchSuggestions = useCallback((query: string) => {
    if (!query) return [];
    
    const allProviders = mockProviders;
    const suggestions = new Set<string>();
    
    allProviders.forEach(provider => {
      // Add provider names
      if (provider.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(provider.name);
      }
      
      // Add specialties
      provider.specialties.forEach(specialty => {
        if (specialty.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(specialty);
        }
      });
      
      // Add categories
      if (provider.category.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(provider.category);
      }
      
      // Add service areas
      provider.serviceAreas.forEach(area => {
        if (area.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(area);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, []);

  // Update search suggestions
  useEffect(() => {
    if (searchQuery.length > 2) {
      const suggestions = generateSearchSuggestions(searchQuery);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  }, [searchQuery, generateSearchSuggestions]);

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeUpdates) return;
    
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Simulate provider availability changes
      const randomProvider = mockProviders[Math.floor(Math.random() * mockProviders.length)];
      if (Math.random() > 0.8) {
        setNotifications(prev => [
          ...prev,
          `${randomProvider.name} is now ${randomProvider.available ? 'available' : 'busy'}`
        ].slice(-3));
      }
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  // Calculate provider stats
  useEffect(() => {
    const online = mockProviders.filter(p => p.available).length;
    const newToday = Math.floor(mockProviders.length * 0.2); // Simulate new providers
    
    setProviderStats({
      total: mockProviders.length,
      online,
      new: newToday
    });
  }, []);

  // Generate share link
  const generateShareLink = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy !== 'rating') params.set('sort', sortBy);
    
    const link = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    setShareLink(link);
    setShowShareModal(true);
  }, [searchQuery, selectedCategory, sortBy]);

  // Copy link to clipboard
  const copyShareLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }, [shareLink]);

  // Save current search
  const saveCurrentSearch = useCallback(() => {
    if (searchQuery.trim()) {
      setSavedSearches(prev => [...new Set([searchQuery, ...prev])].slice(0, 5));
    }
  }, [searchQuery]);

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
    
    const savedProviders = localStorage.getItem('savedProviders');
    if (savedProviders) {
      setSavedProviders(JSON.parse(savedProviders));
    }
  }, []);

  // Save searches to localStorage
  useEffect(() => {
    if (savedSearches.length > 0) {
      localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
    }
  }, [savedSearches]);

  useEffect(() => {
    if (savedProviders.length > 0) {
      localStorage.setItem('savedProviders', JSON.stringify(savedProviders));
    }
  }, [savedProviders]);

  const filteredAndSortedProviders = useMemo(() => {
    let filtered = mockProviders.filter(provider => {
      // Search filter
      const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          provider.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          provider.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          provider.serviceAreas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
                            provider.category.toLowerCase() === selectedCategory.toLowerCase();
      
      // Advanced filters
      const matchesVerified = !filters.verifiedOnly || provider.verified;
      const matchesAvailable = !filters.availableOnly || provider.available;
      const matchesEmergency = !filters.emergencyOnly || provider.emergency;
      const matchesOnlineBooking = !filters.onlineBookingOnly || provider.onlineBooking;
      const matchesVideoConsultation = !filters.videoConsultationOnly || provider.videoConsultation;
      const matchesFreeEstimate = !filters.freeEstimateOnly || provider.freeEstimate;
      const matchesWarranty = !filters.warrantyOnly || provider.warranty;
      const matchesPrice = provider.price.includes('$') && 
                          parseInt(provider.price.split('-')[0].replace('$', '')) >= filters.priceRange[0] &&
                          parseInt(provider.price.split('-')[1].replace('$', '').replace('/hr', '')) <= filters.priceRange[1];
      const matchesRating = provider.rating >= filters.minRating;
      const matchesDistance = parseFloat(provider.distance) <= filters.distance;
      const matchesResponseRate = provider.responseRate >= filters.responseRate;
      const matchesLanguages = filters.languages.length === 0 || 
                              filters.languages.some(lang => provider.languages.includes(lang));
      const matchesServiceAreas = filters.serviceAreas.length === 0 || 
                                 filters.serviceAreas.some(area => provider.serviceAreas.includes(area));
      const matchesPaymentMethods = filters.paymentMethods.length === 0 || 
                                   filters.paymentMethods.some(method => provider.paymentMethods.includes(method));

      return matchesSearch && matchesCategory && matchesVerified && matchesAvailable && 
             matchesEmergency && matchesOnlineBooking && matchesVideoConsultation && 
             matchesFreeEstimate && matchesWarranty && matchesPrice && matchesRating && 
             matchesDistance && matchesResponseRate && matchesLanguages && 
             matchesServiceAreas && matchesPaymentMethods;
    });

    // Sort providers
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'price-low':
          return parseInt(a.price.split('-')[0].replace('$', '')) - 
                 parseInt(b.price.split('-')[0].replace('$', ''));
        case 'price-high':
          return parseInt(b.price.split('-')[1].replace('$', '').replace('/hr', '')) - 
                 parseInt(a.price.split('-')[1].replace('$', '').replace('/hr', ''));
        case 'experience':
          return parseInt(b.experience.split('+')[0]) - parseInt(a.experience.split('+')[0]);
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });
  }, [searchQuery, selectedCategory, sortBy, filters]);

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  const handleSaveProvider = (providerId: string) => {
    setSavedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleCompareProvider = (providerId: string) => {
    setComparisonList(prev => {
      if (prev.includes(providerId)) {
        return prev.filter(id => id !== providerId);
      } else if (prev.length < 3) {
        return [...prev, providerId];
      } else {
        // Show notification that max 3 providers can be compared
        setNotifications(prev => [...prev, 'Maximum 3 providers can be compared'].slice(-3));
        return prev;
      }
    });
  };

  const handleContactProvider = (provider: Provider, action: 'call' | 'email' | 'book' | 'video') => {
    switch (action) {
      case 'call':
        window.open(`tel:${provider.phone}`);
        break;
      case 'email':
        window.open(`mailto:${provider.email}`);
        break;
      case 'book':
        navigate(`/book/${provider.category.toLowerCase()}?provider=${provider.id}`);
        break;
      case 'video':
        if (provider.videoConsultation) {
          // Implement video consultation logic
          setNotifications(prev => [...prev, `Video consultation requested with ${provider.name}`].slice(-3));
        }
        break;
    }
  };

  const handleViewOnMap = (provider: Provider) => {
    setMapCenter({ lat: 40.7128, lng: -74.0060 });
    setShowViewMode('map');
  };

  const handleShareProvider = (provider: Provider) => {
    const link = `${window.location.origin}${window.location.pathname}?provider=${provider.id}`;
    setShareLink(link);
    setShowShareModal(true);
  };

  const handleOpenComparison = () => {
    if (comparisonList.length > 0) {
      setShowViewMode('comparison');
    } else {
      setNotifications(prev => [...prev, 'Please add providers to comparison list'].slice(-3));
    }
  };

  const handleOpenAdvancedSearch = () => {
    setShowViewMode('advanced');
  };

  const resetFilters = () => {
    setFilters({
      verifiedOnly: false,
      availableOnly: false,
      emergencyOnly: false,
      onlineBookingOnly: false,
      videoConsultationOnly: false,
      freeEstimateOnly: false,
      warrantyOnly: false,
      priceRange: [0, 200],
      minRating: 0,
      distance: 10,
      responseRate: 0,
      languages: [],
      serviceAreas: [],
      paymentMethods: []
    });
  };

  const ProviderCard = React.forwardRef<HTMLDivElement, { provider: Provider }>(({ provider }, ref) => (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className={`provider-card ${provider.featured ? 'featured' : ''} ${provider.trending ? 'trending' : ''}`}
      onClick={() => handleProviderClick(provider)}
    >
      {/* Featured/Trending Badges */}
      {(provider.featured || provider.trending) && (
        <div className="provider-badges-top">
          {provider.featured && <span className="badge featured-badge">⭐ Featured</span>}
          {provider.trending && <span className="badge trending-badge">🔥 Trending</span>}
        </div>
      )}

      <div className="provider-header">
        <div className="provider-avatar">
          <span className="avatar-emoji">{provider.image}</span>
          {provider.verified && <div className="verified-badge"><CheckCircle size={16} /></div>}
          {provider.available && <div className="available-dot"></div>}
          {provider.quickResponder && <div className="quick-responder-badge"><Zap size={12} /></div>}
        </div>
        <div className="provider-info">
          <h3 className="provider-name">{provider.name}</h3>
          <p className="provider-category">{provider.category}</p>
          <div className="provider-meta">
            <div className="rating">
              <Star className="star-icon" size={14} fill="#fbbf24" color="#fbbf24" />
              <span>{provider.rating}</span>
              <span className="reviews">({provider.reviews})</span>
            </div>
            <div className="location">
              <MapPin size={14} />
              <span>{provider.distance}</span>
            </div>
            <div className="last-active">
              <Activity size={14} />
              <span>{provider.lastActive}</span>
            </div>
          </div>
        </div>
        <div className="provider-actions">
          <button 
            className="save-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleSaveProvider(provider.id);
            }}
          >
            <Heart 
              size={20} 
              fill={savedProviders.includes(provider.id) ? '#ef4444' : 'none'} 
              color={savedProviders.includes(provider.id) ? '#ef4444' : '#6b7280'}
            />
          </button>
          <button 
            className="compare-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleCompareProvider(provider.id);
            }}
          >
            <Share2 
              size={20} 
              color={comparisonList.includes(provider.id) ? '#667eea' : '#6b7280'}
            />
          </button>
        </div>
      </div>

      {/* Advanced Stats */}
      <div className="provider-stats">
        <div className="stat">
          <Briefcase size={14} />
          <span>{provider.experience}</span>
        </div>
        <div className="stat">
          <Clock size={14} />
          <span>{provider.responseTime}</span>
        </div>
        <div className="stat">
          <Users size={14} />
          <span>{provider.completedJobs} jobs</span>
        </div>
        <div className="stat">
          <ThumbsUp size={14} />
          <span>{provider.responseRate}% response</span>
        </div>
      </div>

      {/* Specialties */}
      <div className="provider-specialties">
        {provider.specialties.slice(0, 2).map((specialty, index) => (
          <span key={index} className="specialty-tag">{specialty}</span>
        ))}
        {provider.specialties.length > 2 && (
          <span className="specialty-tag more">+{provider.specialties.length - 2}</span>
        )}
      </div>

      {/* Service Features */}
      <div className="provider-features">
        {provider.onlineBooking && <div className="feature-badge"><Calendar size={12} /> Online Booking</div>}
        {provider.videoConsultation && <div className="feature-badge"><Video size={12} /> Video Call</div>}
        {provider.freeEstimate && <div className="feature-badge"><DollarSign size={12} /> Free Estimate</div>}
        {provider.warranty && <div className="feature-badge"><Shield size={12} /> Warranty</div>}
        {provider.emergency && <div className="feature-badge emergency"><AlertCircle size={12} /> 24/7</div>}
      </div>

      {/* Recent Activity */}
      <div className="provider-activity">
        <div className="activity-item">
          <span className="activity-label">Recent Reviews:</span>
          <span className="activity-value">{provider.reviewsSummary.recent}</span>
        </div>
        <div className="activity-item">
          <span className="activity-label">Acceptance Rate:</span>
          <span className="activity-value">{provider.acceptanceRate}%</span>
        </div>
      </div>

      <div className="provider-footer">
        <div className="price">{provider.price}</div>
        <div className="actions">
          <button 
            className="action-btn call"
            onClick={(e) => {
              e.stopPropagation();
              handleContactProvider(provider, 'call');
            }}
          >
            <Phone size={16} />
          </button>
          {provider.videoConsultation && (
            <button 
              className="action-btn video"
              onClick={(e) => {
                e.stopPropagation();
                handleContactProvider(provider, 'video');
              }}
            >
              <Video size={16} />
            </button>
          )}
          <button 
            className="action-btn map"
            onClick={(e) => {
              e.stopPropagation();
              handleViewOnMap(provider);
            }}
          >
            <Map size={16} />
          </button>
          <button 
            className="action-btn book"
            onClick={(e) => {
              e.stopPropagation();
              handleContactProvider(provider, 'book');
            }}
          >
            <Calendar size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  ));

  return (
    <div className="find-provider-advanced">
      {/* Render different views based on showViewMode */}
      {showViewMode === 'comparison' ? (
        <ProviderComparison 
          providers={mockProviders.filter(p => comparisonList.includes(p.id))} 
          onClose={() => setShowViewMode('main')} 
        />
      ) : showViewMode === 'map' ? (
        <ProviderMapView 
          providers={mockProviders} 
          onClose={() => setShowViewMode('main')} 
        />
      ) : showViewMode === 'advanced' ? (
        <AdvancedSearch />
      ) : (
        <>
          {/* Header */}
          <div className="search-header">
            <div className="header-content">
              <h1>Find Professional Service Providers</h1>
              <p>Connect with verified and experienced professionals in your area</p>
            </div>
            
            {/* View Navigation */}
            <div className="view-navigation">
              <button 
                className={`view-nav-btn active`}
                onClick={() => setShowViewMode('main')}
              >
                <Grid3X3 size={16} />
                Browse
              </button>
              <button 
                className={`view-nav-btn`}
                onClick={() => setShowViewMode('map')}
              >
                <Map size={16} />
                Map View
              </button>
              <button 
                className={`view-nav-btn`}
                onClick={handleOpenComparison}
                disabled={comparisonList.length === 0}
              >
                <BarChart3 size={16} />
                Compare ({comparisonList.length})
              </button>
              <button 
                className={`view-nav-btn`}
                onClick={handleOpenAdvancedSearch}
              >
                <Search size={16} />
                Advanced Search
              </button>
              <button 
                className={`view-nav-btn`}
                onClick={() => navigate('/communication-hub')}
              >
                <MessageCircle size={16} />
                Chat
              </button>
              <button 
                className={`view-nav-btn`}
                onClick={() => navigate('/advanced-map-tracking')}
              >
                <Navigation size={16} />
                Live Tracking
              </button>
              <button 
                className={`view-nav-btn`}
                onClick={() => navigate('/video-call/demo')}
              >
                <Video size={16} />
                Video Call
              </button>
            </div>
        
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by name, category, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={20} />
            <span>Filters</span>
            {(filters.verifiedOnly || filters.availableOnly || filters.emergencyOnly) && (
              <div className="filter-indicator"></div>
            )}
          </button>
        </div>

        {/* Categories */}
        <div className="categories-scroll">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              style={{ '--category-color': category.color } as React.CSSProperties}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="filters-panel"
          >
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Quick Filters</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                    />
                    <UserCheck size={16} />
                    <span>Verified Only</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.availableOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, availableOnly: e.target.checked }))}
                    />
                    <Zap size={16} />
                    <span>Available Now</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.emergencyOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, emergencyOnly: e.target.checked }))}
                    />
                    <Shield size={16} />
                    <span>Emergency Service</span>
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</label>
                <div className="range-slider">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [parseInt(e.target.value), prev.priceRange[1]] 
                    }))}
                  />
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
                    }))}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Minimum Rating: {filters.minRating}+</label>
                <div className="rating-filter">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className={`rating-star ${star <= filters.minRating ? 'active' : ''}`}
                      onClick={() => setFilters(prev => ({ ...prev, minRating: star }))}
                    >
                      <Star size={20} fill={star <= filters.minRating ? '#fbbf24' : 'none'} color="#fbbf24" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Max Distance: {filters.distance}km</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={filters.distance}
                  onChange={(e) => setFilters(prev => ({ ...prev, distance: parseInt(e.target.value) }))}
                  className="distance-slider"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <div className="results-section">
        <div className="results-header">
          <div className="results-info">
            <h2>Found {filteredAndSortedProviders.length} Providers</h2>
            <p>Showing professionals matching your criteria</p>
          </div>
          
          <div className="results-controls">
            <div className="sort-dropdown">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={18} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Providers Grid/List */}
        <div className={`providers-container ${viewMode}`}>
          <AnimatePresence mode="popLayout">
            {filteredAndSortedProviders.map((provider: Provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </AnimatePresence>
        </div>

        {filteredAndSortedProviders.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No providers found</h3>
            <p>Try adjusting your search or filters to find more professionals</p>
            <button 
              className="reset-filters"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                resetFilters();
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Provider Detail Modal */}
      <AnimatePresence>
        {showModal && selectedProvider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="provider-header-info">
                  <div className="provider-avatar-large">
                    <span className="avatar-emoji-large">{selectedProvider.image}</span>
                    {selectedProvider.verified && <div className="verified-badge-large"><CheckCircle size={20} /></div>}
                  </div>
                  <div className="provider-details">
                    <h2>{selectedProvider.name}</h2>
                    <p className="provider-category-large">{selectedProvider.category}</p>
                    <div className="provider-rating-large">
                      <Star className="star-icon" size={18} fill="#fbbf24" color="#fbbf24" />
                      <span>{selectedProvider.rating}</span>
                      <span className="reviews">({selectedProvider.reviews} reviews)</span>
                    </div>
                    <div className="provider-location-large">
                      <MapPin size={16} />
                      <span>{selectedProvider.location} • {selectedProvider.distance} away</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="close-modal"
                  onClick={() => setShowModal(false)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="provider-section">
                  <h3>About</h3>
                  <p>{selectedProvider.about}</p>
                </div>

                <div className="provider-section">
                  <h3>Services & Specialties</h3>
                  <div className="specialties-grid">
                    {selectedProvider.specialties.map((specialty, index) => (
                      <span key={index} className="specialty-card">{specialty}</span>
                    ))}
                  </div>
                </div>

                <div className="provider-section">
                  <h3>Certifications & Badges</h3>
                  <div className="certifications-grid">
                    {selectedProvider.certifications.map((cert, index) => (
                      <div key={index} className="certification-card">
                        <Award size={16} />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="provider-stats-grid">
                  <div className="stat-card">
                    <Briefcase size={24} />
                    <div className="stat-info">
                      <span className="stat-value">{selectedProvider.experience}</span>
                      <span className="stat-label">Experience</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <Users size={24} />
                    <div className="stat-info">
                      <span className="stat-value">{selectedProvider.completedJobs}</span>
                      <span className="stat-label">Completed Jobs</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <Clock size={24} />
                    <div className="stat-info">
                      <span className="stat-value">{selectedProvider.responseTime}</span>
                      <span className="stat-label">Response Time</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <DollarSign size={24} />
                    <div className="stat-info">
                      <span className="stat-value">{selectedProvider.price}</span>
                      <span className="stat-label">Hourly Rate</span>
                    </div>
                  </div>
                </div>

                <div className="provider-section">
                  <h3>Contact Information</h3>
                  <div className="contact-info">
                    <div className="contact-item">
                      <Phone size={18} />
                      <span>{selectedProvider.phone}</span>
                    </div>
                    <div className="contact-item">
                      <Mail size={18} />
                      <span>{selectedProvider.email}</span>
                    </div>
                    <div className="contact-item">
                      <Clock size={18} />
                      <span>{selectedProvider.workingHours}</span>
                    </div>
                  </div>
                </div>

                <div className="provider-section">
                  <h3>Languages</h3>
                  <div className="languages-list">
                    {selectedProvider.languages.map((lang, index) => (
                      <span key={index} className="language-tag">{lang}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="contact-btn secondary"
                  onClick={() => handleContactProvider(selectedProvider, 'call')}
                >
                  <Phone size={18} />
                  Call Now
                </button>
                <button 
                  className="contact-btn secondary"
                  onClick={() => handleContactProvider(selectedProvider, 'email')}
                >
                  <Mail size={18} />
                  Send Message
                </button>
                <button 
                  className="contact-btn primary"
                  onClick={() => handleContactProvider(selectedProvider, 'book')}
                >
                  <Calendar size={18} />
                  Book Service
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
      )}
    </div>
  );
}
