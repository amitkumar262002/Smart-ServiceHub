import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  TrendingUp,
  Star,
  MapPin,
  Users,
  Calendar,
  Heart,
  Share2,
  Download,
  RefreshCw,
  Save,
  Bookmark,
  History,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Sliders,
  Target,
  Zap,
  Shield,
  Award,
  Globe,
  Languages,
  DollarSign,
  Phone,
  Mail,
  Video,
  Car,
  Wifi,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Grid3X3,
  List,
  Eye,
  EyeOff
} from 'lucide-react';
import '../styles/AdvancedSearch.css';

interface SearchFilters {
  // Basic filters
  categories: string[];
  priceRange: [number, number];
  rating: number;
  distance: number;
  
  // Advanced filters
  verified: boolean;
  available: boolean;
  emergency: boolean;
  onlineBooking: boolean;
  videoConsultation: boolean;
  freeEstimate: boolean;
  warranty: boolean;
  insurance: boolean;
  backgroundCheck: boolean;
  
  // Response filters
  responseRate: number;
  responseTime: string;
  acceptanceRate: number;
  cancellationRate: number;
  
  // Experience filters
  minExperience: number;
  maxExperience: number;
  completedJobs: number;
  
  // Location filters
  serviceAreas: string[];
  languages: string[];
  paymentMethods: string[];
  
  // Special features
  trending: boolean;
  featured: boolean;
  topRated: boolean;
  quickResponder: boolean;
  premiumServices: string[];
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  lastUsed: string;
  resultCount: number;
}

interface SearchHistory {
  query: string;
  timestamp: string;
  resultCount: number;
}

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
    certifications: ['Licensed Plumber', 'OSHA Certified'],
    responseTime: '15 mins',
    completedJobs: 1250,
    languages: ['English', 'Spanish'],
    about: 'Professional plumber with over 15 years of experience.',
    workingHours: 'Mon-Sat: 8AM-8PM',
    insurance: true,
    backgroundCheck: true,
    onlineBooking: true,
    videoConsultation: true,
    freeEstimate: true,
    warranty: true,
    lastActive: '2 mins ago',
    responseRate: 98,
    acceptanceRate: 95,
    cancellationRate: 2,
    averageResponseTime: '15 mins',
    premiumServices: ['24/7 Emergency', 'Eco-Friendly Solutions'],
    equipment: ['Pipe Inspection Camera', 'Hydro Jetting'],
    serviceAreas: ['Downtown', 'Midtown', 'Uptown'],
    paymentMethods: ['Credit Card', 'Cash', 'Bank Transfer'],
    website: 'www.johnsmithplumbing.com',
    reviewsSummary: {
      recent: 45,
      positive: 310,
      neutral: 25,
      negative: 7
    },
    trending: true,
    featured: true,
    topRated: true,
    quickResponder: true
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
    certifications: ['Master Electrician', 'Safety Certified'],
    responseTime: '20 mins',
    completedJobs: 980,
    languages: ['English', 'French'],
    about: 'Certified master electrician specializing in smart homes.',
    workingHours: 'Mon-Fri: 7AM-7PM',
    insurance: true,
    backgroundCheck: true,
    onlineBooking: true,
    videoConsultation: false,
    freeEstimate: true,
    warranty: true,
    lastActive: '5 mins ago',
    responseRate: 95,
    acceptanceRate: 92,
    cancellationRate: 3,
    averageResponseTime: '20 mins',
    premiumServices: ['Smart Home Installation', 'Solar Panel Setup'],
    equipment: ['Multimeter', 'Circuit Testers'],
    serviceAreas: ['West Side', 'North End'],
    paymentMethods: ['Credit Card', 'Bank Transfer'],
    website: 'www.sarahjohnsonelectrical.com',
    reviewsSummary: {
      recent: 38,
      positive: 265,
      neutral: 18,
      negative: 6
    },
    trending: false,
    featured: true,
    topRated: true,
    quickResponder: true
  },
  {
    id: '3',
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
    equipment: ['Professional Brushes', 'Spray Systems'],
    serviceAreas: ['East End', 'Downtown'],
    paymentMethods: ['Credit Card', 'Bank Transfer'],
    website: 'www.emilydavispainting.com',
    reviewsSummary: {
      recent: 58,
      positive: 395,
      neutral: 22,
      negative: 6
    },
    trending: true,
    featured: true,
    topRated: true,
    quickResponder: true
  }
];

export default function AdvancedSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    priceRange: [0, 200],
    rating: 0,
    distance: 10,
    verified: false,
    available: false,
    emergency: false,
    onlineBooking: false,
    videoConsultation: false,
    freeEstimate: false,
    warranty: false,
    insurance: false,
    backgroundCheck: false,
    responseRate: 0,
    responseTime: 'any',
    acceptanceRate: 0,
    cancellationRate: 100,
    minExperience: 0,
    maxExperience: 30,
    completedJobs: 0,
    serviceAreas: [],
    languages: [],
    paymentMethods: [],
    trending: false,
    featured: false,
    topRated: false,
    quickResponder: false,
    premiumServices: []
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'location' | 'features'>('basic');
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);

  const categories = [
    { id: 'plumbing', name: 'Plumbing', icon: '👨‍🔧' },
    { id: 'electrical', name: 'Electrical', icon: '⚡' },
    { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
    { id: 'painting', name: 'Painting', icon: '🎨' },
    { id: 'carpentry', name: 'Carpentry', icon: '🔨' },
    { id: 'hvac', name: 'HVAC', icon: '❄️' },
    { id: 'landscaping', name: 'Landscaping', icon: '🌳' },
    { id: 'moving', name: 'Moving', icon: '🚚' }
  ];

  const serviceAreas = [
    'Downtown', 'Midtown', 'Uptown', 'West Side', 'East End', 
    'North End', 'South Bay', 'Central District', 'Waterfront', 'Suburbs'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'
  ];

  const paymentMethods = [
    'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 
    'Digital Wallet', 'PayPal', 'Venmo', 'Zelle', 'Cryptocurrency'
  ];

  const premiumServices = [
    '24/7 Emergency', 'Eco-Friendly', 'Smart Home', 'Commercial', 
    'Industrial', 'High-Rise', 'Historic Buildings', 'Luxury'
  ];

  // Filter providers based on search and filters
  const filteredProviders = useMemo(() => {
    return mockProviders.filter(provider => {
      // Search query
      const matchesSearch = !searchQuery || 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Categories
      const matchesCategory = filters.categories.length === 0 || 
        filters.categories.includes(provider.category.toLowerCase());

      // Price range
      const minPrice = parseInt(provider.price.split('-')[0].replace('$', ''));
      const maxPrice = parseInt(provider.price.split('-')[1].replace('$', '').replace('/hr', ''));
      const matchesPrice = minPrice >= filters.priceRange[0] && maxPrice <= filters.priceRange[1];

      // Rating
      const matchesRating = provider.rating >= filters.rating;

      // Distance
      const matchesDistance = parseFloat(provider.distance) <= filters.distance;

      // Boolean filters
      const matchesVerified = !filters.verified || provider.verified;
      const matchesAvailable = !filters.available || provider.available;
      const matchesEmergency = !filters.emergency || provider.emergency;
      const matchesOnlineBooking = !filters.onlineBooking || provider.onlineBooking;
      const matchesVideoConsultation = !filters.videoConsultation || provider.videoConsultation;
      const matchesFreeEstimate = !filters.freeEstimate || provider.freeEstimate;
      const matchesWarranty = !filters.warranty || provider.warranty;
      const matchesInsurance = !filters.insurance || provider.insurance;
      const matchesBackgroundCheck = !filters.backgroundCheck || provider.backgroundCheck;

      // Response filters
      const matchesResponseRate = provider.responseRate >= filters.responseRate;
      const matchesAcceptanceRate = provider.acceptanceRate >= filters.acceptanceRate;
      const matchesCancellationRate = provider.cancellationRate <= filters.cancellationRate;

      // Experience
      const experience = parseInt(provider.experience.replace('+ years', '').replace(' years', ''));
      const matchesExperience = experience >= filters.minExperience && experience <= filters.maxExperience;
      const matchesCompletedJobs = provider.completedJobs >= filters.completedJobs;

      // Service areas
      const matchesServiceAreas = filters.serviceAreas.length === 0 || 
        filters.serviceAreas.some(area => provider.serviceAreas.includes(area));

      // Languages
      const matchesLanguages = filters.languages.length === 0 || 
        filters.languages.some(lang => provider.languages.includes(lang));

      // Payment methods
      const matchesPaymentMethods = filters.paymentMethods.length === 0 || 
        filters.paymentMethods.some(method => provider.paymentMethods.includes(method));

      // Special features
      const matchesTrending = !filters.trending || provider.trending;
      const matchesFeatured = !filters.featured || provider.featured;
      const matchesTopRated = !filters.topRated || provider.topRated;
      const matchesQuickResponder = !filters.quickResponder || provider.quickResponder;

      // Premium services
      const matchesPremiumServices = filters.premiumServices.length === 0 || 
        filters.premiumServices.some(service => 
          provider.premiumServices.some(ps => ps.toLowerCase().includes(service.toLowerCase()))
        );

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && 
        matchesDistance && matchesVerified && matchesAvailable && matchesEmergency && 
        matchesOnlineBooking && matchesVideoConsultation && matchesFreeEstimate && 
        matchesWarranty && matchesInsurance && matchesBackgroundCheck && 
        matchesResponseRate && matchesAcceptanceRate && matchesCancellationRate && 
        matchesExperience && matchesCompletedJobs && matchesServiceAreas && 
        matchesLanguages && matchesPaymentMethods && matchesTrending && 
        matchesFeatured && matchesTopRated && matchesQuickResponder && 
        matchesPremiumServices;
    });
  }, [searchQuery, filters]);

  const handleSearch = useCallback(() => {
    // Add to search history
    const newHistory: SearchHistory = {
      query: searchQuery || 'All Providers',
      timestamp: new Date().toISOString(),
      resultCount: filteredProviders.length
    };
    setSearchHistory(prev => [newHistory, ...prev.slice(0, 9)]);
  }, [searchQuery, filteredProviders]);

  const handleSaveSearch = useCallback(() => {
    if (!searchName.trim()) return;

    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      resultCount: filteredProviders.length
    };

    setSavedSearches(prev => [...prev, newSavedSearch]);
    setShowSaveDialog(false);
    setSearchName('');
  }, [searchName, filters, filteredProviders]);

  const handleLoadSavedSearch = useCallback((savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters);
    setSearchQuery('');
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      categories: [],
      priceRange: [0, 200],
      rating: 0,
      distance: 10,
      verified: false,
      available: false,
      emergency: false,
      onlineBooking: false,
      videoConsultation: false,
      freeEstimate: false,
      warranty: false,
      insurance: false,
      backgroundCheck: false,
      responseRate: 0,
      responseTime: 'any',
      acceptanceRate: 0,
      cancellationRate: 100,
      minExperience: 0,
      maxExperience: 30,
      completedJobs: 0,
      serviceAreas: [],
      languages: [],
      paymentMethods: [],
      trending: false,
      featured: false,
      topRated: false,
      quickResponder: false,
      premiumServices: []
    });
    setSearchQuery('');
  }, []);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId]
    }));
  }, []);

  const toggleArrayItem = useCallback((field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value]
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="advanced-search-container"
    >
      {/* Header */}
      <div className="search-header">
        <div className="header-content">
          <h1>Advanced Search</h1>
          <p>Find the perfect provider with detailed filters</p>
        </div>
        <div className="header-actions">
          <button 
            className={`advanced-toggle ${showAdvanced ? 'active' : ''}`}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Sliders size={16} />
            {showAdvanced ? 'Simple' : 'Advanced'}
          </button>
          <button 
            className="save-search-btn"
            onClick={() => setShowSaveDialog(true)}
          >
            <Save size={16} />
            Save Search
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search providers, services, or specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={handleResetFilters}>
            <RefreshCw size={14} />
            Reset
          </button>
          <button className="quick-action-btn">
            <History size={14} />
            History
          </button>
          <button className="quick-action-btn">
            <Bookmark size={14} />
            Saved
          </button>
        </div>
      </div>

      {/* Search Results Summary */}
      <div className="results-summary">
        <div className="summary-left">
          <h2>{filteredProviders.length} Providers Found</h2>
          <p>Matching your criteria</p>
        </div>
        <div className="summary-right">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 size={16} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="search-content">
        {/* Filters Panel */}
        <div className="filters-panel">
          {/* Tabs */}
          <div className="filter-tabs">
            {['basic', 'advanced', 'location', 'features'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab as any)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Basic Tab */}
            {activeTab === 'basic' && (
              <div className="filter-section">
                <div className="filter-group">
                  <h4>Categories</h4>
                  <div className="category-grid">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        className={`category-chip ${filters.categories.includes(category.id) ? 'active' : ''}`}
                        onClick={() => toggleCategory(category.id)}
                      >
                        <span>{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <h4>Price Range</h4>
                  <div className="range-slider">
                    <div className="range-inputs">
                      <input
                        type="number"
                        value={filters.priceRange[0]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]]
                        }))}
                        placeholder="Min"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: [prev.priceRange[0], parseInt(e.target.value) || 200]
                        }))}
                        placeholder="Max"
                      />
                    </div>
                    <div className="range-track">
                      <div 
                        className="range-fill"
                        style={{
                          left: `${(filters.priceRange[0] / 200) * 100}%`,
                          width: `${((filters.priceRange[1] - filters.priceRange[0]) / 200) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="filter-group">
                  <h4>Minimum Rating</h4>
                  <div className="rating-selector">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        className={`rating-star ${star <= filters.rating ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, rating: star }))}
                      >
                        <Star size={20} fill={star <= filters.rating ? '#fbbf24' : 'none'} color="#fbbf24" />
                      </button>
                    ))}
                    <span>{filters.rating > 0 && `${filters.rating}+ stars`}</span>
                  </div>
                </div>

                <div className="filter-group">
                  <h4>Distance</h4>
                  <div className="distance-slider">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={filters.distance}
                      onChange={(e) => setFilters(prev => ({ ...prev, distance: parseInt(e.target.value) }))}
                    />
                    <span>{filters.distance} km</span>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="filter-section">
                <div className="filter-group">
                  <h4>Provider Quality</h4>
                  <div className="checkbox-grid">
                    {[
                      { key: 'verified', label: 'Verified Providers', icon: CheckCircle },
                      { key: 'available', label: 'Available Now', icon: Zap },
                      { key: 'emergency', label: 'Emergency Service', icon: AlertCircle },
                      { key: 'featured', label: 'Featured', icon: Star },
                      { key: 'trending', label: 'Trending', icon: TrendingUp },
                      { key: 'topRated', label: 'Top Rated', icon: Award }
                    ].map(({ key, label, icon: Icon }) => (
                      <label key={key} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={filters[key as keyof SearchFilters] as boolean}
                          onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.checked }))}
                        />
                        <Icon size={16} />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <h4>Service Features</h4>
                  <div className="checkbox-grid">
                    {[
                      { key: 'onlineBooking', label: 'Online Booking', icon: Calendar },
                      { key: 'videoConsultation', label: 'Video Consultation', icon: Video },
                      { key: 'freeEstimate', label: 'Free Estimate', icon: DollarSign },
                      { key: 'warranty', label: 'Warranty', icon: Shield },
                      { key: 'insurance', label: 'Insurance', icon: Shield },
                      { key: 'backgroundCheck', label: 'Background Check', icon: CheckCircle }
                    ].map(({ key, label, icon: Icon }) => (
                      <label key={key} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={filters[key as keyof SearchFilters] as boolean}
                          onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.checked }))}
                        />
                        <Icon size={16} />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <h4>Response Metrics</h4>
                  <div className="metric-inputs">
                    <div className="metric-input">
                      <label>Response Rate: {filters.responseRate}%+</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.responseRate}
                        onChange={(e) => setFilters(prev => ({ ...prev, responseRate: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="metric-input">
                      <label>Acceptance Rate: {filters.acceptanceRate}%+</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.acceptanceRate}
                        onChange={(e) => setFilters(prev => ({ ...prev, acceptanceRate: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="metric-input">
                      <label>Cancellation Rate: {filters.cancellationRate}%-</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.cancellationRate}
                        onChange={(e) => setFilters(prev => ({ ...prev, cancellationRate: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Location Tab */}
            {activeTab === 'location' && (
              <div className="filter-section">
                <div className="filter-group">
                  <h4>Service Areas</h4>
                  <div className="area-grid">
                    {serviceAreas.map(area => (
                      <button
                        key={area}
                        className={`area-chip ${filters.serviceAreas.includes(area) ? 'active' : ''}`}
                        onClick={() => toggleArrayItem('serviceAreas', area)}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <h4>Languages</h4>
                  <div className="language-grid">
                    {languages.map(language => (
                      <button
                        key={language}
                        className={`language-chip ${filters.languages.includes(language) ? 'active' : ''}`}
                        onClick={() => toggleArrayItem('languages', language)}
                      >
                        <Globe size={14} />
                        {language}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="filter-section">
                <div className="filter-group">
                  <h4>Premium Services</h4>
                  <div className="premium-grid">
                    {premiumServices.map(service => (
                      <button
                        key={service}
                        className={`premium-chip ${filters.premiumServices.includes(service) ? 'active' : ''}`}
                        onClick={() => toggleArrayItem('premiumServices', service)}
                      >
                        <Award size={14} />
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <h4>Payment Methods</h4>
                  <div className="payment-grid">
                    {paymentMethods.map(method => (
                      <button
                        key={method}
                        className={`payment-chip ${filters.paymentMethods.includes(method) ? 'active' : ''}`}
                        onClick={() => toggleArrayItem('paymentMethods', method)}
                      >
                        <DollarSign size={14} />
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="results-panel">
          {filteredProviders.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No providers found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className="reset-btn" onClick={handleResetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`provider-results ${viewMode}`}>
              {filteredProviders.map(provider => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="provider-result-card"
                >
                  <div className="provider-header">
                    <div className="provider-avatar">
                      <span>{provider.image}</span>
                      {provider.verified && <CheckCircle className="verified-badge" size={12} />}
                      {provider.available && <div className="availability-dot"></div>}
                    </div>
                    <div className="provider-info">
                      <h3>{provider.name}</h3>
                      <p>{provider.category}</p>
                      <div className="rating">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <span>{provider.rating}</span>
                        <small>({provider.reviews})</small>
                      </div>
                    </div>
                    <div className="provider-price">
                      <span>{provider.price}</span>
                    </div>
                  </div>

                  <div className="provider-details">
                    <div className="detail-item">
                      <MapPin size={14} />
                      <span>{provider.distance} • {provider.location}</span>
                    </div>
                    <div className="detail-item">
                      <Clock size={14} />
                      <span>{provider.responseTime} response</span>
                    </div>
                    <div className="detail-item">
                      <Users size={14} />
                      <span>{provider.completedJobs} jobs</span>
                    </div>
                  </div>

                  <div className="provider-features">
                    {provider.onlineBooking && <span className="feature">Online Booking</span>}
                    {provider.videoConsultation && <span className="feature">Video Call</span>}
                    {provider.freeEstimate && <span className="feature">Free Estimate</span>}
                    {provider.emergency && <span className="feature emergency">24/7</span>}
                  </div>

                  <div className="provider-actions">
                    <button className="action-btn primary">
                      View Details
                    </button>
                    <button className="action-btn secondary">
                      <Phone size={14} />
                    </button>
                    <button className="action-btn secondary">
                      <Mail size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Search Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="dialog-overlay"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="dialog-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Save Search</h3>
              <input
                type="text"
                placeholder="Enter search name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="dialog-input"
              />
              <div className="dialog-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </button>
                <button 
                  className="save-btn"
                  onClick={handleSaveSearch}
                  disabled={!searchName.trim()}
                >
                  Save Search
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
