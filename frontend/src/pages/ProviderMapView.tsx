import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Calendar, 
  Navigation,
  ZoomIn,
  ZoomOut,
  Filter,
  Search,
  Layers,
  Globe,
  Car,
  Clock,
  Users,
  Heart,
  Share2,
  Video,
  CheckCircle,
  Shield,
  Zap,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Home,
  Target,
  Route,
  Activity
} from 'lucide-react';
import '../styles/ProviderMapView.css';

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
  // Map-specific properties
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  serviceRadius: number; // in km
}

interface ProviderMapViewProps {
  providers: Provider[];
  onClose: () => void;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
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
    quickResponder: true,
    coordinates: { lat: 40.7614, lng: -73.9776 },
    address: '456 West 34th St, New York, NY 10001',
    serviceRadius: 20
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
    quickResponder: true,
    coordinates: { lat: 40.7489, lng: -73.9680 },
    address: '789 East 42nd St, New York, NY 10017',
    serviceRadius: 12
  },
  {
    id: '4',
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
    certifications: ['Cleaning Professional', 'Green Certified'],
    responseTime: '1 hour',
    completedJobs: 620,
    languages: ['English', 'Mandarin'],
    about: 'Professional cleaning service provider.',
    workingHours: 'Mon-Sat: 9AM-6PM',
    insurance: true,
    backgroundCheck: true,
    onlineBooking: true,
    videoConsultation: false,
    freeEstimate: true,
    warranty: false,
    lastActive: '1 hour ago',
    responseRate: 88,
    acceptanceRate: 90,
    cancellationRate: 5,
    averageResponseTime: '1 hour',
    serviceAreas: ['North Area', 'East Side'],
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
    coordinates: { lat: 40.7831, lng: -73.9712 },
    address: '321 Upper West Side, New York, NY 10023',
    serviceRadius: 10
  }
];

export default function ProviderMapView({ 
  providers = mockProviders, 
  onClose, 
  initialCenter = { lat: 40.7580, lng: -73.9855 },
  initialZoom = 13 
}: ProviderMapViewProps) {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(initialZoom);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [showServiceAreas, setShowServiceAreas] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Provider | null>(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Filter providers
  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          provider.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          provider.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || provider.category.toLowerCase() === filterCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [providers, searchQuery, filterCategory]);

  // Calculate distance between two points
  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get providers within viewport
  const getProvidersInViewport = () => {
    return filteredProviders.filter(provider => {
      const distance = calculateDistance(mapCenter, provider.coordinates);
      return distance <= (50 / zoom); // Approximate viewport radius
    });
  };

  const handleContactProvider = (provider: Provider, action: 'call' | 'email' | 'book' | 'video' | 'directions') => {
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
          alert(`Video consultation requested with ${provider.name}`);
        }
        break;
      case 'directions':
        setSelectedRoute(provider);
        setShowDirections(true);
        break;
    }
  };

  const handleMapClick = (coordinates: { lat: number; lng: number }) => {
    setMapCenter(coordinates);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 1));
  };

  const handleGoToUserLocation = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setZoom(15);
    }
  };

  const categories = [
    { id: 'all', name: 'All Services', icon: '🔧' },
    { id: 'plumbing', name: 'Plumbing', icon: '👨‍🔧' },
    { id: 'electrical', name: 'Electrical', icon: '⚡' },
    { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
    { id: 'painting', name: 'Painting', icon: '🎨' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="map-view-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="map-container"
      >
        {/* Map Header */}
        <div className="map-header">
          <div className="header-left">
            <h2>Provider Map</h2>
            <p>{filteredProviders.length} providers in your area</p>
          </div>
          <div className="header-right">
            <div className="map-controls">
              <button className="control-btn" onClick={handleZoomIn}>
                <ZoomIn size={16} />
              </button>
              <button className="control-btn" onClick={handleZoomOut}>
                <ZoomOut size={16} />
              </button>
              <button className="control-btn" onClick={handleGoToUserLocation}>
                <Target size={16} />
              </button>
            </div>
            <div className="map-style-selector">
              <select 
                value={mapStyle} 
                onChange={(e) => setMapStyle(e.target.value as any)}
                className="style-select"
              >
                <option value="standard">Standard</option>
                <option value="satellite">Satellite</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
            <div className="layer-controls">
              <button 
                className={`layer-btn ${showServiceAreas ? 'active' : ''}`}
                onClick={() => setShowServiceAreas(!showServiceAreas)}
              >
                <Layers size={16} />
                Service Areas
              </button>
              <button 
                className={`layer-btn ${showHeatmap ? 'active' : ''}`}
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                <Activity size={16} />
                Heatmap
              </button>
            </div>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="map-search-bar">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search providers, services, or areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="filter-panel"
              >
                <div className="category-filters">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`category-filter ${filterCategory === category.id ? 'active' : ''}`}
                      onClick={() => setFilterCategory(category.id)}
                    >
                      <span>{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map View */}
        <div className="map-view">
          {/* Simulated Map */}
          <div className="map-surface">
            {/* Grid overlay for visual effect */}
            <div className="map-grid"></div>
            
            {/* Service Areas */}
            {showServiceAreas && filteredProviders.map(provider => (
              <div
                key={`area-${provider.id}`}
                className="service-area"
                style={{
                  left: `${50 + (provider.coordinates.lng - mapCenter.lng) * zoom * 2}%`,
                  top: `${50 - (provider.coordinates.lat - mapCenter.lat) * zoom * 2}%`,
                  width: `${provider.serviceRadius * zoom * 0.5}%`,
                  height: `${provider.serviceRadius * zoom * 0.5}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity: hoveredProvider === provider.id ? 0.3 : 0.15
                }}
              />
            ))}
            
            {/* Provider Markers */}
            {getProvidersInViewport().map(provider => (
              <motion.div
                key={provider.id}
                className={`provider-marker ${provider.available ? 'available' : 'busy'} ${hoveredProvider === provider.id ? 'hovered' : ''}`}
                style={{
                  left: `${50 + (provider.coordinates.lng - mapCenter.lng) * zoom * 2}%`,
                  top: `${50 - (provider.coordinates.lat - mapCenter.lat) * zoom * 2}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                whileHover={{ scale: 1.2 }}
                onClick={() => setSelectedProvider(provider)}
                onHoverStart={() => setHoveredProvider(provider.id)}
                onHoverEnd={() => setHoveredProvider(null)}
              >
                <div className="marker-icon">
                  <span>{provider.image}</span>
                  {provider.verified && <CheckCircle className="verified-badge" size={12} />}
                  {provider.available && <div className="availability-dot"></div>}
                </div>
                <div className="marker-tooltip">
                  <div className="tooltip-content">
                    <h4>{provider.name}</h4>
                    <p>{provider.category}</p>
                    <div className="tooltip-rating">
                      <Star size={12} fill="#fbbf24" color="#fbbf24" />
                      <span>{provider.rating}</span>
                    </div>
                    <p>{provider.distance} away</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* User Location */}
            {userLocation && (
              <div
                className="user-location"
                style={{
                  left: `${50 + (userLocation.lng - mapCenter.lng) * zoom * 2}%`,
                  top: `${50 - (userLocation.lat - mapCenter.lat) * zoom * 2}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <Target size={20} />
                <div className="location-pulse"></div>
              </div>
            )}
            
            {/* Route Display */}
            {showDirections && selectedRoute && (
              <svg className="route-overlay">
                <path
                  d={`M ${50 + (userLocation?.lng || mapCenter.lng - mapCenter.lng) * zoom * 2} ${50 - (userLocation?.lat || mapCenter.lat - mapCenter.lat) * zoom * 2} L ${50 + (selectedRoute.coordinates.lng - mapCenter.lng) * zoom * 2} ${50 - (selectedRoute.coordinates.lat - mapCenter.lat) * zoom * 2}`}
                  stroke="#667eea"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Provider List Sidebar */}
        <div className="provider-sidebar">
          <div className="sidebar-header">
            <h3>Nearby Providers</h3>
            <span className="provider-count">{getProvidersInViewport().length} in view</span>
          </div>
          
          <div className="provider-list">
            {getProvidersInViewport().map(provider => (
              <motion.div
                key={provider.id}
                className={`provider-card ${selectedProvider?.id === provider.id ? 'selected' : ''}`}
                onClick={() => setSelectedProvider(provider)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="card-header">
                  <div className="provider-avatar">
                    <span>{provider.image}</span>
                    {provider.verified && <CheckCircle className="verified-badge" size={12} />}
                    {provider.available && <div className="availability-dot"></div>}
                  </div>
                  <div className="provider-info">
                    <h4>{provider.name}</h4>
                    <p>{provider.category}</p>
                    <div className="rating">
                      <Star size={12} fill="#fbbf24" color="#fbbf24" />
                      <span>{provider.rating}</span>
                      <small>({provider.reviews})</small>
                    </div>
                  </div>
                  <div className="provider-distance">
                    <MapPin size={14} />
                    <span>{provider.distance}</span>
                  </div>
                </div>
                
                <div className="card-stats">
                  <div className="stat">
                    <Clock size={12} />
                    <span>{provider.responseTime}</span>
                  </div>
                  <div className="stat">
                    <Users size={12} />
                    <span>{provider.completedJobs} jobs</span>
                  </div>
                  <div className="stat">
                    <Activity size={12} />
                    <span>{provider.responseRate}%</span>
                  </div>
                </div>
                
                <div className="card-actions">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleContactProvider(provider, 'directions');
                  }}>
                    <Route size={14} />
                    Directions
                  </button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleContactProvider(provider, 'call');
                  }}>
                    <Phone size={14} />
                  </button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleContactProvider(provider, 'book');
                  }}>
                    <Calendar size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Provider Detail Modal */}
        <AnimatePresence>
          {selectedProvider && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="provider-detail-modal"
              onClick={() => setSelectedProvider(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <div className="provider-info">
                    <div className="provider-avatar-large">
                      <span>{selectedProvider.image}</span>
                      {selectedProvider.verified && <CheckCircle className="verified-badge" size={16} />}
                      {selectedProvider.available && <div className="availability-dot"></div>}
                    </div>
                    <div>
                      <h3>{selectedProvider.name}</h3>
                      <p>{selectedProvider.category}</p>
                      <div className="rating">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <span>{selectedProvider.rating}</span>
                        <small>({selectedProvider.reviews} reviews)</small>
                      </div>
                    </div>
                  </div>
                  <button className="close-modal" onClick={() => setSelectedProvider(null)}>
                    <X size={20} />
                  </button>
                </div>
                
                <div className="modal-body">
                  <div className="provider-details">
                    <div className="detail-section">
                      <h4>Contact & Location</h4>
                      <div className="detail-item">
                        <MapPin size={14} />
                        <span>{selectedProvider.address}</span>
                      </div>
                      <div className="detail-item">
                        <Phone size={14} />
                        <span>{selectedProvider.phone}</span>
                      </div>
                      <div className="detail-item">
                        <Mail size={14} />
                        <span>{selectedProvider.email}</span>
                      </div>
                    </div>
                    
                    <div className="detail-section">
                      <h4>Services</h4>
                      <div className="specialty-list">
                        {selectedProvider.specialties.map((specialty, index) => (
                          <span key={index} className="specialty-tag">{specialty}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="detail-section">
                      <h4>Features</h4>
                      <div className="feature-list">
                        {selectedProvider.onlineBooking && <div className="feature">Online Booking</div>}
                        {selectedProvider.videoConsultation && <div className="feature">Video Consultation</div>}
                        {selectedProvider.freeEstimate && <div className="feature">Free Estimate</div>}
                        {selectedProvider.warranty && <div className="feature">Warranty</div>}
                        {selectedProvider.emergency && <div className="feature emergency">24/7 Emergency</div>}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <div className="price">{selectedProvider.price}</div>
                  <div className="action-buttons">
                    <button onClick={() => handleContactProvider(selectedProvider, 'directions')}>
                      <Route size={16} />
                      Get Directions
                    </button>
                    <button onClick={() => handleContactProvider(selectedProvider, 'call')}>
                      <Phone size={16} />
                      Call
                    </button>
                    {selectedProvider.videoConsultation && (
                      <button onClick={() => handleContactProvider(selectedProvider, 'video')}>
                        <Video size={16} />
                        Video Call
                      </button>
                    )}
                    <button 
                      className="primary-btn"
                      onClick={() => handleContactProvider(selectedProvider, 'book')}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
