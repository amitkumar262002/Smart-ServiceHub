import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Users, 
  Briefcase, 
  Award, 
  Shield,
  Zap,
  Heart,
  Share2,
  Video,
  DollarSign,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  UserCheck,
  ThumbsUp,
  Activity,
  ArrowLeft,
  ArrowRight,
  Download,
  Eye,
  MessageCircle
} from 'lucide-react';
import '../styles/ProviderComparison.css';

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

interface ProviderComparisonProps {
  providers: Provider[];
  onClose: () => void;
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

export default function ProviderComparison({ providers = mockProviders, onClose }: ProviderComparisonProps) {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<Provider[]>(providers);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showWinner, setShowWinner] = useState(false);

  // Calculate comparison scores
  const calculateScore = (provider: Provider): number => {
    let score = 0;
    if (provider.verified) score += 15;
    if (provider.available) score += 10;
    if (provider.emergency) score += 10;
    if (provider.insurance) score += 10;
    if (provider.onlineBooking) score += 5;
    if (provider.videoConsultation) score += 5;
    if (provider.freeEstimate) score += 5;
    if (provider.warranty) score += 5;
    score += (provider.rating / 5) * 20;
    score += (provider.responseRate / 100) * 15;
    score += Math.min(provider.reviews / 50, 1) * 10;
    score += (provider.acceptanceRate / 100) * 10;
    score -= provider.cancellationRate * 2;
    return Math.round(score);
  };

  const getWinner = () => {
    return comparisonData.reduce((prev, current) => 
      calculateScore(prev) > calculateScore(current) ? prev : current
    );
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
          alert(`Video consultation requested with ${provider.name}`);
        }
        break;
    }
  };

  const exportComparison = () => {
    const csvContent = [
      ['Name', 'Category', 'Rating', 'Reviews', 'Price', 'Response Rate', 'Experience', 'Score'],
      ...comparisonData.map(p => [
        p.name,
        p.category,
        p.rating,
        p.reviews,
        p.price,
        `${p.responseRate}%`,
        p.experience,
        calculateScore(p)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'provider-comparison.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const winner = showWinner ? getWinner() : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="provider-comparison-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="comparison-container"
      >
        {/* Header */}
        <div className="comparison-header">
          <div className="header-left">
            <h2>Provider Comparison</h2>
            <p>Compare {comparisonData.length} professionals side by side</p>
          </div>
          <div className="header-right">
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                <Eye size={16} />
                Table View
              </button>
              <button
                className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
              >
                <Users size={16} />
                Card View
              </button>
            </div>
            <button
              className={`winner-toggle ${showWinner ? 'active' : ''}`}
              onClick={() => setShowWinner(!showWinner)}
            >
              <Trophy size={16} />
              {showWinner ? 'Hide Winner' : 'Show Winner'}
            </button>
            <button className="export-btn" onClick={exportComparison}>
              <Download size={16} />
              Export
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Winner Announcement */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="winner-announcement"
          >
            <div className="winner-content">
              <Trophy className="trophy-icon" size={24} />
              <div className="winner-info">
                <h3>🏆 Best Match: {winner.name}</h3>
                <p>Score: {calculateScore(winner)}/100 • {winner.category} • {winner.rating}⭐</p>
              </div>
              <button 
                className="select-winner-btn"
                onClick={() => handleContactProvider(winner, 'book')}
              >
                Select Provider
              </button>
            </div>
          </motion.div>
        )}

        {/* Comparison Content */}
        <div className="comparison-content">
          {viewMode === 'table' ? (
            <div className="comparison-table">
              <div className="table-header">
                <div className="provider-column">Provider</div>
                <div className="rating-column">Rating</div>
                <div className="price-column">Price</div>
                <div className="response-column">Response</div>
                <div className="experience-column">Experience</div>
                <div className="features-column">Features</div>
                <div className="score-column">Score</div>
                <div className="actions-column">Actions</div>
              </div>
              
              {comparisonData.map((provider) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`table-row ${winner?.id === provider.id ? 'winner-row' : ''}`}
                >
                  <div className="provider-column">
                    <div className="provider-info">
                      <div className="provider-avatar">
                        <span>{provider.image}</span>
                        {provider.verified && <CheckCircle className="verified-badge" size={12} />}
                      </div>
                      <div className="provider-details">
                        <h4>{provider.name}</h4>
                        <p>{provider.category}</p>
                        <div className="provider-badges">
                          {provider.featured && <span className="badge featured">Featured</span>}
                          {provider.trending && <span className="badge trending">Trending</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rating-column">
                    <div className="rating-display">
                      <Star size={14} fill="#fbbf24" color="#fbbf24" />
                      <span>{provider.rating}</span>
                      <small>({provider.reviews})</small>
                    </div>
                  </div>
                  
                  <div className="price-column">
                    <span className="price">{provider.price}</span>
                  </div>
                  
                  <div className="response-column">
                    <div className="response-rate">
                      <span>{provider.responseRate}%</span>
                      <small>{provider.averageResponseTime}</small>
                    </div>
                  </div>
                  
                  <div className="experience-column">
                    <span>{provider.experience}</span>
                  </div>
                  
                  <div className="features-column">
                    <div className="feature-list">
                      {provider.onlineBooking && <Calendar size={12} />}
                      {provider.videoConsultation && <Video size={12} />}
                      {provider.freeEstimate && <DollarSign size={12} />}
                      {provider.warranty && <Shield size={12} />}
                      {provider.emergency && <AlertCircle size={12} />}
                    </div>
                  </div>
                  
                  <div className="score-column">
                    <div className="score-display">
                      <span className="score">{calculateScore(provider)}</span>
                      <div className="score-bar">
                        <div 
                          className="score-fill" 
                          style={{ width: `${calculateScore(provider)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="actions-column">
                    <div className="action-buttons">
                      <button onClick={() => handleContactProvider(provider, 'call')}>
                        <Phone size={14} />
                      </button>
                      <button onClick={() => handleContactProvider(provider, 'email')}>
                        <Mail size={14} />
                      </button>
                      <button onClick={() => handleContactProvider(provider, 'book')}>
                        <Calendar size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="comparison-cards">
              {comparisonData.map((provider) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`comparison-card ${winner?.id === provider.id ? 'winner-card' : ''}`}
                >
                  {winner?.id === provider.id && (
                    <div className="winner-badge">
                      <Trophy size={16} />
                      Best Match
                    </div>
                  )}
                  
                  <div className="card-header">
                    <div className="provider-avatar-large">
                      <span>{provider.image}</span>
                      {provider.verified && <CheckCircle className="verified-badge" size={16} />}
                    </div>
                    <div className="provider-info">
                      <h3>{provider.name}</h3>
                      <p>{provider.category}</p>
                      <div className="rating">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <span>{provider.rating}</span>
                        <small>({provider.reviews} reviews)</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-stats">
                    <div className="stat">
                      <MapPin size={14} />
                      <span>{provider.distance}</span>
                    </div>
                    <div className="stat">
                      <Clock size={14} />
                      <span>{provider.responseTime}</span>
                    </div>
                    <div className="stat">
                      <Users size={14} />
                      <span>{provider.completedJobs} jobs</span>
                    </div>
                  </div>
                  
                  <div className="card-features">
                    <h4>Services</h4>
                    <div className="feature-tags">
                      {provider.onlineBooking && <span className="tag">Online Booking</span>}
                      {provider.videoConsultation && <span className="tag">Video Call</span>}
                      {provider.freeEstimate && <span className="tag">Free Estimate</span>}
                      {provider.warranty && <span className="tag">Warranty</span>}
                      {provider.emergency && <span className="tag emergency">24/7</span>}
                    </div>
                  </div>
                  
                  <div className="card-specialties">
                    <h4>Specialties</h4>
                    <div className="specialty-list">
                      {provider.specialties.slice(0, 3).map((specialty, index) => (
                        <span key={index} className="specialty">{specialty}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="card-score">
                    <div className="score-info">
                      <span className="score-label">Match Score</span>
                      <span className="score-value">{calculateScore(provider)}/100</span>
                    </div>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ width: `${calculateScore(provider)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="primary-btn"
                      onClick={() => handleContactProvider(provider, 'book')}
                    >
                      Book Now
                    </button>
                    <div className="secondary-actions">
                      <button onClick={() => handleContactProvider(provider, 'call')}>
                        <Phone size={14} />
                      </button>
                      <button onClick={() => handleContactProvider(provider, 'email')}>
                        <Mail size={14} />
                      </button>
                      {provider.videoConsultation && (
                        <button onClick={() => handleContactProvider(provider, 'video')}>
                          <Video size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Trophy icon for winner display
const Trophy = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C13.1 2 14 2.9 14 4V5H16C17.1 5 18 5.9 18 7V19C18 20.1 17.1 21 16 21H8C6.9 21 6 20.1 6 19V7C6 5.9 6.9 5 8 5H10V4C10 2.9 10.9 2 12 2ZM12 4C11.4 4 11 4.4 11 5V6H13V5C13 4.4 12.6 4 12 4ZM8 7V19H16V7H8Z" fill="#fbbf24"/>
    <path d="M9 9H15V11H9V9ZM9 13H15V15H9V13Z" fill="#fbbf24"/>
  </svg>
);
