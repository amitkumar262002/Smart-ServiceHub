import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import { authService } from '@/firebase/auth'

// Advanced configuration objects
const themeConfig = {
  light: { label: 'Light', icon: '☀️', description: 'Clean and bright interface' },
  dark: { label: 'Dark', icon: '🌙', description: 'Easy on the eyes' },
  auto: { label: 'Auto', icon: '🌓', description: 'Follows system preference' }
} as const;

const languageConfig = {
  en: { label: 'English', native: 'English' },
  hi: { label: 'Hindi', native: 'हिन्दी' },
  bn: { label: 'Bengali', native: 'বাংলা' },
  te: { label: 'Telugu', native: 'తెలుగు' },
  mr: { label: 'Marathi', native: 'मराठी' },
  ta: { label: 'Tamil', native: 'தமிழ்' },
  gu: { label: 'Gujarati', native: 'ગુજરાતી' },
  kn: { label: 'Kannada', native: 'ಕನ್ನಡ' },
  ml: { label: 'Malayalam', native: 'മലയാളം' },
  pa: { label: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
} as const;

const currencyConfig = {
  INR: { label: 'Indian Rupee', symbol: '₹', code: 'INR' },
  USD: { label: 'US Dollar', symbol: '$', code: 'USD' },
  EUR: { label: 'Euro', symbol: '€', code: 'EUR' },
  GBP: { label: 'British Pound', symbol: '£', code: 'GBP' },
  AED: { label: 'UAE Dirham', symbol: 'د.إ', code: 'AED' },
  SAR: { label: 'Saudi Riyal', symbol: '﷼', code: 'SAR' }
} as const;

const privacyConfig = {
  public: { label: 'Public', icon: '🌍', description: 'Anyone can view your profile' },
  private: { label: 'Private', icon: '🔒', description: 'Only you can view your profile' },
  friends: { label: 'Friends Only', icon: '👥', description: 'Only connections can view' }
} as const;

// Advanced type definitions
type ThemeKey = keyof typeof themeConfig;
type LanguageKey = keyof typeof languageConfig;
type CurrencyKey = keyof typeof currencyConfig;
type PrivacyKey = keyof typeof privacyConfig;

// Advanced interfaces
interface UserSettings {
  profile: {
    displayName: string;
    phone: string;
    address: string;
    bio: string;
    website: string;
    social: {
      linkedin?: string;
      twitter?: string;
      instagram?: string;
      facebook?: string;
      youtube?: string;
      whatsapp?: string;
      telegram?: string;
    };
    professional: {
      businessName?: string;
      businessType?: string;
      gstNumber?: string;
      panNumber?: string;
      licenseNumber?: string;
      yearsOfExperience?: number;
      specialties?: string[];
      serviceAreas?: string[];
    };
    verification: {
      email: boolean;
      phone: boolean;
      identity: boolean;
      address: boolean;
      business: boolean;
      professional: boolean;
    };
  };
  notifications: {
    email: {
      bookingConfirmations: boolean;
      bookingReminders: boolean;
      reviewNotifications: boolean;
      promotionalOffers: boolean;
      weeklyReports: boolean;
      monthlyReports: boolean;
      securityAlerts: boolean;
      paymentAlerts: boolean;
    };
    push: {
      bookingUpdates: boolean;
      reviewAlerts: boolean;
      messageAlerts: boolean;
      promotionalAlerts: boolean;
      systemUpdates: boolean;
    };
    sms: {
      bookingConfirmations: boolean;
      bookingReminders: boolean;
      emergencyAlerts: boolean;
      verificationCodes: boolean;
    };
    inApp: {
      chatMessages: boolean;
      bookingUpdates: boolean;
      reviewRequests: boolean;
      systemNotifications: boolean;
    };
  };
  privacy: {
    profileVisibility: PrivacyKey;
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
    allowReviews: boolean;
    allowMessages: boolean;
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    allowTagging: boolean;
    dataSharing: {
      analytics: boolean;
      marketing: boolean;
      thirdParty: boolean;
      research: boolean;
    };
  };
  preferences: {
    language: LanguageKey;
    timezone: string;
    currency: CurrencyKey;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    theme: ThemeKey;
    autoSave: boolean;
    compactView: boolean;
    showTooltips: boolean;
    keyboardShortcuts: boolean;
    animations: boolean;
    soundEffects: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    activeSessions: Array<{
      id: string;
      device: string;
      location: string;
      lastActive: string;
      current: boolean;
    }>;
    apiKeys: Array<{
      id: string;
      name: string;
      permissions: string[];
      createdAt: string;
      lastUsed: string;
    }>;
    blockedUsers: Array<{
      id: string;
      name: string;
      reason: string;
      blockedAt: string;
    }>;
  };
  billing: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    subscriptionId?: string;
    nextBillingDate?: string;
    paymentMethods: Array<{
      id: string;
      type: 'card' | 'upi' | 'bank';
      last4?: string;
      brand?: string;
      expiry?: string;
      isDefault: boolean;
    }>;
    invoices: Array<{
      id: string;
      date: string;
      amount: number;
      status: 'paid' | 'pending' | 'failed';
      description: string;
    }>;
  };
  reviews: {
    autoResponse: boolean;
    responseTemplate: string;
    reviewReminders: boolean;
    publicReviews: boolean;
    reviewAnalytics: boolean;
    aiInsights: boolean;
    sentimentAnalysis: boolean;
    autoCategorization: boolean;
    spamFilter: boolean;
  };
}

interface ReviewSettings {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'general' | 'notifications' | 'privacy' | 'security' | 'billing' | 'reviews';
  icon: string;
  lastUpdated: string;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ip: string;
  device: string;
  location: string;
  status: 'success' | 'warning' | 'error';
}

interface RealReview {
  id: string;
  reviewer: {
    name: string;
    avatar: string;
    verified: boolean;
    rating: number;
  };
  service: string;
  rating: number;
  comment: string;
  pros?: string[];
  cons?: string[];
  timestamp: string;
  helpful: number;
  verified: boolean;
  response?: {
    text: string;
    timestamp: string;
    helpful: number;
  };
}

export default function ProfileSettings() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'security' | 'billing' | 'reviews' | 'advanced'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      displayName: '',
      phone: '',
      address: '',
      bio: '',
      website: '',
      social: {
        linkedin: '',
        twitter: '',
        instagram: '',
        facebook: '',
        youtube: '',
        whatsapp: '',
        telegram: ''
      },
      professional: {
        businessName: '',
        businessType: '',
        gstNumber: '',
        panNumber: '',
        licenseNumber: '',
        yearsOfExperience: 0,
        specialties: [],
        serviceAreas: []
      },
      verification: {
        email: false,
        phone: false,
        identity: false,
        address: false,
        business: false,
        professional: false
      }
    },
    notifications: {
      email: {
        bookingConfirmations: true,
        bookingReminders: true,
        reviewNotifications: true,
        promotionalOffers: false,
        weeklyReports: true,
        monthlyReports: false,
        securityAlerts: true,
        paymentAlerts: true
      },
      push: {
        bookingUpdates: true,
        reviewAlerts: true,
        messageAlerts: true,
        promotionalAlerts: false,
        systemUpdates: true
      },
      sms: {
        bookingConfirmations: true,
        bookingReminders: true,
        emergencyAlerts: true,
        verificationCodes: true
      },
      inApp: {
        chatMessages: true,
        bookingUpdates: true,
        reviewRequests: true,
        systemNotifications: true
      }
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showAddress: false,
      allowReviews: true,
      allowMessages: true,
      showOnlineStatus: true,
      showLastSeen: false,
      allowTagging: true,
      dataSharing: {
        analytics: true,
        marketing: false,
        thirdParty: false,
        research: false
      }
    },
    preferences: {
      language: 'en',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      theme: 'light',
      autoSave: true,
      compactView: false,
      showTooltips: true,
      keyboardShortcuts: true,
      animations: true,
      soundEffects: false
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      activeSessions: [
        {
          id: 'current',
          device: 'Chrome on Windows',
          location: 'Delhi, India',
          lastActive: new Date().toISOString(),
          current: true
        }
      ],
      apiKeys: [],
      blockedUsers: []
    },
    billing: {
      plan: 'free',
      paymentMethods: [],
      invoices: []
    },
    reviews: {
      autoResponse: false,
      responseTemplate: 'Thank you for your review! We appreciate your feedback.',
      reviewReminders: true,
      publicReviews: true,
      reviewAnalytics: true,
      aiInsights: true,
      sentimentAnalysis: true,
      autoCategorization: true,
      spamFilter: true
    }
  });
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Additional states
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [realReviews, setRealReviews] = useState<RealReview[]>([]);
  const [reviewSettings, setReviewSettings] = useState<ReviewSettings[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load settings and data
  useEffect(() => {
    const loadSettingsData = async () => {
      setLoading(true);
      
      try {
        // Mock user data
        const mockUserData = {
          profile: {
            displayName: 'Rajesh Kumar',
            phone: '+91-9876543210',
            address: '123, Main Street, Civil Lines, Delhi - 110001',
            bio: 'Professional home services provider with 8+ years of experience. Specialized in plumbing, electrical, and AC repair services.',
            website: 'https://rajeshservices.com',
            social: {
              linkedin: 'https://linkedin.com/in/rajeshkumar',
              twitter: 'https://twitter.com/rajeshservices',
              instagram: 'https://instagram.com/rajeshservices',
              facebook: 'https://facebook.com/rajeshservices',
              whatsapp: '+91-9876543210',
              telegram: '@rajeshservices'
            },
            professional: {
              businessName: 'Rajesh Home Services',
              businessType: 'Home Services',
              gstNumber: '07AAAPR1234C1ZV',
              panNumber: 'AAAPR1234C',
              licenseNumber: 'DL/2021/12345',
              yearsOfExperience: 8,
              specialties: ['Plumbing', 'Electrical', 'AC Repair', 'Carpentry'],
              serviceAreas: ['Delhi', 'Gurgaon', 'Noida', 'Faridabad']
            },
            verification: {
              email: true,
              phone: true,
              identity: true,
              address: false,
              business: true,
              professional: true
            }
          }
        };
        
        // Mock activity logs
        const mockActivityLogs: ActivityLog[] = [
          {
            id: '1',
            action: 'Profile Updated',
            description: 'Updated professional information',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            ip: '192.168.1.100',
            device: 'Chrome on Windows',
            location: 'Delhi, India',
            status: 'success'
          },
          {
            id: '2',
            action: 'Password Changed',
            description: 'Password successfully changed',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            ip: '192.168.1.100',
            device: 'Chrome on Windows',
            location: 'Delhi, India',
            status: 'success'
          },
          {
            id: '3',
            action: 'Login Attempt Failed',
            description: 'Invalid password attempt',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            ip: '192.168.1.200',
            device: 'Firefox on Android',
            location: 'Mumbai, India',
            status: 'error'
          }
        ];
        
        // Mock real reviews
        const mockRealReviews: RealReview[] = [
          {
            id: '1',
            reviewer: {
              name: 'Priya Sharma',
              avatar: 'https://picsum.photos/100/100?random=1',
              verified: true,
              rating: 4.8
            },
            service: 'AC Repair Service',
            rating: 5,
            comment: 'Excellent service! Rajesh arrived on time and fixed the AC issue quickly. Very professional and knowledgeable.',
            pros: ['Punctual', 'Professional', 'Reasonable pricing', 'Clean work'],
            cons: ['Could have brought more tools'],
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: 24,
            verified: true,
            response: {
              text: 'Thank you so much Priya! I appreciate your detailed feedback. I\'ll make sure to bring additional tools next time.',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
              helpful: 12
            }
          },
          {
            id: '2',
            reviewer: {
              name: 'Amit Patel',
              avatar: 'https://picsum.photos/100/100?random=2',
              verified: true,
              rating: 4.5
            },
            service: 'Plumbing Installation',
            rating: 4,
            comment: 'Good work overall. The plumbing installation was done properly but took longer than expected.',
            pros: ['Quality work', 'Clean installation', 'Reasonable price'],
            cons: ['Delayed completion', 'Communication could be better'],
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: 18,
            verified: true,
            response: {
              text: 'Thank you for your feedback Amit. I apologize for the delay and will work on improving communication.',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
              helpful: 8
            }
          },
          {
            id: '3',
            reviewer: {
              name: 'Sneha Reddy',
              avatar: 'https://picsum.photos/100/100?random=3',
              verified: false,
              rating: 4.2
            },
            service: 'Electrical Repair',
            rating: 5,
            comment: 'Amazing service! Fixed the electrical issue in no time. Very professional and safety conscious.',
            pros: ['Quick response', 'Professional', 'Safety conscious', 'Fair pricing'],
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: 32,
            verified: true
          }
        ];
        
        // Mock review settings
        const mockReviewSettings: ReviewSettings[] = [
          {
            id: 'auto-response',
            title: 'Auto-Response to Reviews',
            description: 'Automatically send a response to new reviews',
            enabled: true,
            category: 'reviews',
            icon: '🤖',
            lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'review-reminders',
            title: 'Review Reminders',
            description: 'Send reminders to customers to leave reviews',
            enabled: true,
            category: 'reviews',
            icon: '⏰',
            lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'ai-insights',
            title: 'AI-Powered Insights',
            description: 'Get AI analysis of customer reviews',
            enabled: true,
            category: 'reviews',
            icon: '🧠',
            lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        // Update state
        setSettings(prev => ({
          ...prev,
          ...mockUserData
        }));
        setActivityLogs(mockActivityLogs);
        setRealReviews(mockRealReviews);
        setReviewSettings(mockReviewSettings);
        
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadSettingsData();
    }
  }, [user]);
  
  // Save settings
  const saveSettings = useCallback(async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setChangesSaved(true);
      setTimeout(() => setChangesSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  }, [settings]);
  
  // Handle settings updates
  const updateSettings = useCallback((section: keyof UserSettings, updates: Partial<UserSettings[keyof UserSettings]>) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
  }, []);
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculate stats
  const stats = useMemo(() => ({
    totalReviews: realReviews.length,
    averageRating: realReviews.length > 0 
      ? realReviews.reduce((sum, r) => sum + r.rating, 0) / realReviews.length 
      : 0,
    verifiedReviews: realReviews.filter(r => r.verified).length,
    responseRate: realReviews.filter(r => r.response).length / realReviews.length * 100,
    activeSettings: reviewSettings.filter(s => s.enabled).length,
    recentActivity: activityLogs.filter(log => 
      new Date(log.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length
  }), [realReviews, reviewSettings, activityLogs]);
  
  if (loading) {
    return (
      <div className="profile-settings">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-settings">
      {/* Advanced Header */}
      <section className="settings-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Settings & Preferences</h1>
            <p>Manage your account, privacy, and service preferences</p>
          </div>
          
          <div className="header-actions">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>
            
            <button className="export-btn" onClick={() => setShowExportModal(true)}>
              <span className="btn-icon">📥</span>
              <span>Export Settings</span>
            </button>
            
            <button className="save-btn" onClick={saveSettings} disabled={saving}>
              {saving ? (
                <>
                  <span className="loading-spinner-small"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">💾</span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
            
            {changesSaved && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                <span>Changes saved successfully!</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <div className="stat-content">
              <span className="stat-value">{stats.averageRating.toFixed(1)}</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📝</span>
            <div className="stat-content">
              <span className="stat-value">{stats.totalReviews}</span>
              <span className="stat-label">Total Reviews</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✓</span>
            <div className="stat-content">
              <span className="stat-value">{stats.verifiedReviews}</span>
              <span className="stat-label">Verified Reviews</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💬</span>
            <div className="stat-content">
              <span className="stat-value">{stats.responseRate.toFixed(1)}%</span>
              <span className="stat-label">Response Rate</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⚙️</span>
            <div className="stat-content">
              <span className="stat-value">{stats.activeSettings}</span>
              <span className="stat-label">Active Settings</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📊</span>
            <div className="stat-content">
              <span className="stat-value">{stats.recentActivity}</span>
              <span className="stat-label">Recent Activity</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Advanced Navigation Tabs */}
      <section className="settings-tabs">
        <div className="tabs-navigation">
          {[
            { id: 'profile', label: 'Profile', icon: '👤', description: 'Personal and professional information' },
            { id: 'notifications', label: 'Notifications', icon: '🔔', description: 'Email, push, and SMS preferences' },
            { id: 'privacy', label: 'Privacy', icon: '🔒', description: 'Privacy and data sharing settings' },
            { id: 'security', label: 'Security', icon: '🛡️', description: 'Password and authentication settings' },
            { id: 'billing', label: 'Billing', icon: '💳', description: 'Subscription and payment methods' },
            { id: 'reviews', label: 'Reviews', icon: '⭐', description: 'Review management and analytics' },
            { id: 'advanced', label: 'Advanced', icon: '⚙️', description: 'Advanced settings and preferences' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <div className="tab-content">
                <span className="tab-label">{tab.label}</span>
                <span className="tab-description">{tab.description}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
      
      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <section className="settings-section profile-settings">
          <div className="section-header">
            <h2>Profile Settings</h2>
            <p>Manage your personal and professional information</p>
          </div>
          
          <div className="settings-grid">
            {/* Basic Information */}
            <div className="settings-card">
              <div className="card-header">
                <h3>Basic Information</h3>
                <span className="card-icon">👤</span>
              </div>
              <div className="card-content">
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={settings.profile.displayName}
                    onChange={(e) => updateSettings('profile', { displayName: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={settings.profile.phone}
                    onChange={(e) => updateSettings('profile', { phone: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={settings.profile.address}
                    onChange={(e) => updateSettings('profile', { address: e.target.value })}
                    className="form-textarea"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={settings.profile.bio}
                    onChange={(e) => updateSettings('profile', { bio: e.target.value })}
                    className="form-textarea"
                    rows={4}
                    placeholder="Tell customers about yourself and your services..."
                  />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={settings.profile.website}
                    onChange={(e) => updateSettings('profile', { website: e.target.value })}
                    className="form-input"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
            
            {/* Professional Information */}
            <div className="settings-card">
              <div className="card-header">
                <h3>Professional Information</h3>
                <span className="card-icon">💼</span>
              </div>
              <div className="card-content">
                <div className="form-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    value={settings.profile.professional.businessName || ''}
                    onChange={(e) => updateSettings('profile', { 
                      professional: { ...settings.profile.professional, businessName: e.target.value }
                    })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Business Type</label>
                  <input
                    type="text"
                    value={settings.profile.professional.businessType || ''}
                    onChange={(e) => updateSettings('profile', { 
                      professional: { ...settings.profile.professional, businessType: e.target.value }
                    })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    value={settings.profile.professional.yearsOfExperience || 0}
                    onChange={(e) => updateSettings('profile', { 
                      professional: { ...settings.profile.professional, yearsOfExperience: Number(e.target.value) }
                    })}
                    className="form-input"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>GST Number</label>
                  <input
                    type="text"
                    value={settings.profile.professional.gstNumber || ''}
                    onChange={(e) => updateSettings('profile', { 
                      professional: { ...settings.profile.professional, gstNumber: e.target.value }
                    })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>PAN Number</label>
                  <input
                    type="text"
                    value={settings.profile.professional.panNumber || ''}
                    onChange={(e) => updateSettings('profile', { 
                      professional: { ...settings.profile.professional, panNumber: e.target.value }
                    })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>License Number</label>
                  <input
                    type="text"
                    value={settings.profile.professional.licenseNumber || ''}
                    onChange={(e) => updateSettings('profile', { 
                      professional: { ...settings.profile.professional, licenseNumber: e.target.value }
                    })}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="settings-card">
              <div className="card-header">
                <h3>Social Media</h3>
                <span className="card-icon">📱</span>
              </div>
              <div className="card-content">
                <div className="form-group">
                  <label>LinkedIn</label>
                  <input
                    type="url"
                    value={settings.profile.social.linkedin || ''}
                    onChange={(e) => updateSettings('profile', { 
                      social: { ...settings.profile.social, linkedin: e.target.value }
                    })}
                    className="form-input"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="form-group">
                  <label>Twitter</label>
                  <input
                    type="url"
                    value={settings.profile.social.twitter || ''}
                    onChange={(e) => updateSettings('profile', { 
                      social: { ...settings.profile.social, twitter: e.target.value }
                    })}
                    className="form-input"
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                <div className="form-group">
                  <label>Instagram</label>
                  <input
                    type="url"
                    value={settings.profile.social.instagram || ''}
                    onChange={(e) => updateSettings('profile', { 
                      social: { ...settings.profile.social, instagram: e.target.value }
                    })}
                    className="form-input"
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
                <div className="form-group">
                  <label>Facebook</label>
                  <input
                    type="url"
                    value={settings.profile.social.facebook || ''}
                    onChange={(e) => updateSettings('profile', { 
                      social: { ...settings.profile.social, facebook: e.target.value }
                    })}
                    className="form-input"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="form-group">
                  <label>WhatsApp</label>
                  <input
                    type="tel"
                    value={settings.profile.social.whatsapp || ''}
                    onChange={(e) => updateSettings('profile', { 
                      social: { ...settings.profile.social, whatsapp: e.target.value }
                    })}
                    className="form-input"
                    placeholder="+91-9876543210"
                  />
                </div>
                <div className="form-group">
                  <label>Telegram</label>
                  <input
                    type="text"
                    value={settings.profile.social.telegram || ''}
                    onChange={(e) => updateSettings('profile', { 
                      social: { ...settings.profile.social, telegram: e.target.value }
                    })}
                    className="form-input"
                    placeholder="@yourusername"
                  />
                </div>
              </div>
            </div>
            
            {/* Verification Status */}
            <div className="settings-card">
              <div className="card-header">
                <h3>Verification Status</h3>
                <span className="card-icon">✅</span>
              </div>
              <div className="card-content">
                <div className="verification-list">
                  <div className="verification-item">
                    <div className="verification-info">
                      <span className="verification-label">Email Verification</span>
                      <span className={`verification-status ${settings.profile.verification.email ? 'verified' : 'unverified'}`}>
                        {settings.profile.verification.email ? '✅ Verified' : '❌ Not Verified'}
                      </span>
                    </div>
                    {!settings.profile.verification.email && (
                      <button className="verify-btn">Verify Now</button>
                    )}
                  </div>
                  <div className="verification-item">
                    <div className="verification-info">
                      <span className="verification-label">Phone Verification</span>
                      <span className={`verification-status ${settings.profile.verification.phone ? 'verified' : 'unverified'}`}>
                        {settings.profile.verification.phone ? '✅ Verified' : '❌ Not Verified'}
                      </span>
                    </div>
                    {!settings.profile.verification.phone && (
                      <button className="verify-btn">Verify Now</button>
                    )}
                  </div>
                  <div className="verification-item">
                    <div className="verification-info">
                      <span className="verification-label">Identity Verification</span>
                      <span className={`verification-status ${settings.profile.verification.identity ? 'verified' : 'unverified'}`}>
                        {settings.profile.verification.identity ? '✅ Verified' : '❌ Not Verified'}
                      </span>
                    </div>
                    {!settings.profile.verification.identity && (
                      <button className="verify-btn">Verify Now</button>
                    )}
                  </div>
                  <div className="verification-item">
                    <div className="verification-info">
                      <span className="verification-label">Address Verification</span>
                      <span className={`verification-status ${settings.profile.verification.address ? 'verified' : 'unverified'}`}>
                        {settings.profile.verification.address ? '✅ Verified' : '❌ Not Verified'}
                      </span>
                    </div>
                    {!settings.profile.verification.address && (
                      <button className="verify-btn">Verify Now</button>
                    )}
                  </div>
                  <div className="verification-item">
                    <div className="verification-info">
                      <span className="verification-label">Business Verification</span>
                      <span className={`verification-status ${settings.profile.verification.business ? 'verified' : 'unverified'}`}>
                        {settings.profile.verification.business ? '✅ Verified' : '❌ Not Verified'}
                      </span>
                    </div>
                    {!settings.profile.verification.business && (
                      <button className="verify-btn">Verify Now</button>
                    )}
                  </div>
                  <div className="verification-item">
                    <div className="verification-info">
                      <span className="verification-label">Professional Verification</span>
                      <span className={`verification-status ${settings.profile.verification.professional ? 'verified' : 'unverified'}`}>
                        {settings.profile.verification.professional ? '✅ Verified' : '❌ Not Verified'}
                      </span>
                    </div>
                    {!settings.profile.verification.professional && (
                      <button className="verify-btn">Verify Now</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Reviews Settings Tab */}
      {activeTab === 'reviews' && (
        <section className="settings-section reviews-settings">
          <div className="section-header">
            <h2>Review Settings</h2>
            <p>Manage how you handle customer reviews and feedback</p>
          </div>
          
          <div className="settings-grid">
            {/* Review Management */}
            <div className="settings-card">
              <div className="card-header">
                <h3>Review Management</h3>
                <span className="card-icon">⭐</span>
              </div>
              <div className="card-content">
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Auto-Response to Reviews</label>
                    <p>Automatically send a response to new reviews</p>
                  </div>
                  <div className="setting-control">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.reviews.autoResponse}
                        onChange={(e) => updateSettings('reviews', { autoResponse: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                
                {settings.reviews.autoResponse && (
                  <div className="form-group">
                    <label>Response Template</label>
                    <textarea
                      value={settings.reviews.responseTemplate}
                      onChange={(e) => updateSettings('reviews', { responseTemplate: e.target.value })}
                      className="form-textarea"
                      rows={3}
                      placeholder="Enter your auto-response template..."
                    />
                  </div>
                )}
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Review Reminders</label>
                    <p>Send reminders to customers to leave reviews</p>
                  </div>
                  <div className="setting-control">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.reviews.reviewReminders}
                        onChange={(e) => updateSettings('reviews', { reviewReminders: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Public Reviews</label>
                    <p>Make your reviews visible to the public</p>
                  </div>
                  <div className="setting-control">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.reviews.publicReviews}
                        onChange={(e) => updateSettings('reviews', { publicReviews: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Features */}
            <div className="settings-card">
              <div className="card-header">
                <h3>AI-Powered Features</h3>
                <span className="card-icon">🤖</span>
              </div>
              <div className="card-content">
                <div className="setting-item">
                  <div className="setting-info">
                    <label>AI Insights</label>
                    <p>Get AI-powered insights from customer reviews</p>
                  </div>
                  <div className="setting-control">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.reviews.aiInsights}
                        onChange={(e) => updateSettings('reviews', { aiInsights: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Sentiment Analysis</label>
                    <p>Analyze sentiment of customer reviews</p>
                  </div>
                  <div className="setting-control">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.reviews.sentimentAnalysis}
                        onChange={(e) => updateSettings('reviews', { sentimentAnalysis: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Auto-Categorization</label>
                    <p>Automatically categorize reviews</p>
                  </div>
                  <div className="setting-control">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.reviews.autoCategorization}
                        onChange={(e) => updateSettings('reviews', { autoCategorization: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Spam Filter</label>
                    <p>Automatically filter spam reviews</p>
                  </div>
                  <div className="setting-control">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.reviews.spamFilter}
                        onChange={(e) => updateSettings('reviews', { spamFilter: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Reviews */}
            <div className="settings-card">
              <div className="card-header">
                <h3>Recent Reviews</h3>
                <span className="card-icon">📝</span>
              </div>
              <div className="card-content">
                <div className="reviews-list">
                  {realReviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <img src={review.reviewer.avatar} alt={review.reviewer.name} className="reviewer-avatar" />
                          <div className="reviewer-details">
                            <h4>{review.reviewer.name}</h4>
                            <div className="review-rating">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span key={i} className={`star ${i < review.rating ? 'filled' : 'empty'}`}>
                                  ⭐
                                </span>
                              ))}
                              <span className="rating-number">{review.rating}.0</span>
                            </div>
                          </div>
                        </div>
                        <div className="review-meta">
                          <span className="service-name">{review.service}</span>
                          <span className="review-date">{formatDate(review.timestamp)}</span>
                          {review.verified && (
                            <span className="verified-badge">✅ Verified</span>
                          )}
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      {review.pros && review.pros.length > 0 && (
                        <div className="review-pros">
                          <h5>✅ Pros</h5>
                          <div className="pros-list">
                            {review.pros.map((pro, index) => (
                              <span key={index} className="pro-tag">{pro}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {review.cons && review.cons.length > 0 && (
                        <div className="review-cons">
                          <h5>❌ Cons</h5>
                          <div className="cons-list">
                            {review.cons.map((con, index) => (
                              <span key={index} className="con-tag">{con}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {review.response && (
                        <div className="review-response">
                          <h5>💬 Your Response</h5>
                          <p>{review.response.text}</p>
                          <span className="response-date">{formatDate(review.response.timestamp)}</span>
                        </div>
                      )}
                      <div className="review-actions">
                        <button className="action-btn respond">Respond</button>
                        <button className="action-btn edit">Edit</button>
                        <button className="action-btn hide">Hide</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Other tabs would follow similar patterns... */}
      
      {/* Activity Logs */}
      <section className="activity-logs">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <p>Track your recent account activity</p>
        </div>
        
        <div className="logs-container">
          {activityLogs.map((log) => (
            <div key={log.id} className={`log-item ${log.status}`}>
              <div className="log-icon">
                {log.status === 'success' && '✅'}
                {log.status === 'warning' && '⚠️'}
                {log.status === 'error' && '❌'}
              </div>
              <div className="log-content">
                <h4>{log.action}</h4>
                <p>{log.description}</p>
                <div className="log-meta">
                  <span className="log-time">{formatDate(log.timestamp)}</span>
                  <span className="log-device">{log.device}</span>
                  <span className="log-location">{log.location}</span>
                  <span className="log-ip">{log.ip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
