import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import { authService } from '@/firebase/auth'

// Types for the component
interface FormData {
  displayName: string
  phone: string
  address: string
  bio: string
  website: string
  linkedin: string
  twitter: string
  instagram: string
  facebook: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedAt: string
}

// Mock user data for development
const mockUser = {
  uid: 'demo-user-123',
  email: 'superman.verma@example.com',
  displayName: 'Superman Verma',
  phone: '+91-9876543210',
  address: '123, Bhanwar Singh Street, Civil Lines, Jaipur - 302001',
  bio: 'Professional service provider with 5+ years of experience in home services and maintenance.',
  website: 'https://supermanverma.services',
  social: {
    linkedin: 'https://linkedin.com/in/supermanverma',
    twitter: 'https://twitter.com/supermanverma',
    instagram: 'https://instagram.com/supermanverma',
    facebook: 'https://facebook.com/supermanverma'
  },
  verification: {
    email: true,
    phone: true,
    identity: false,
    address: false
  },
  stats: {
    totalBookings: 156,
    completedBookings: 142,
    totalSpent: 28450,
    averageRating: 4.8,
    responseRate: 98,
    responseTime: '2 hours',
    memberSince: 'January 2022'
  },
  achievements: [
    {
      id: '1',
      title: 'Super Provider',
      description: 'Completed 100+ bookings with 4.5+ rating',
      icon: '',
      earnedAt: 'March 2023'
    },
    {
      id: '2',
      title: 'Quick Responder',
      description: 'Maintained 95%+ response rate for 6 months',
      icon: '',
      earnedAt: 'February 2023'
    },
    {
      id: '3',
      title: 'Customer Favorite',
      description: 'Received 50+ 5-star reviews',
      icon: '',
      earnedAt: 'January 2023'
    }
  ],
  skills: ['Plumbing', 'Electrical Work', 'AC Repair', 'Home Cleaning', 'Carpentry'],
  languages: ['English', 'Hindi', 'Punjabi'],
  preferences: {
    emailUpdates: true,
    notifications: true,
    darkMode: false,
    language: 'en'
  }
}

export default function ProfileAdvanced() {
  const navigate = useNavigate()
  const { user: authUser, updateUser, loading } = useUser()
  const [user, setUser] = useState<any>(mockUser)
  const [editMode, setEditMode] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [selectedAvatarType, setSelectedAvatarType] = useState<'upload' | 'gravatar' | 'default'>('default')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [newSkill, setNewSkill] = useState('')
  const [skills, setSkills] = useState<string[]>(mockUser.skills)
  const [languages, setLanguages] = useState<string[]>(mockUser.languages)
  const [newLanguage, setNewLanguage] = useState('')
  const [availability, setAvailability] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  })
  const [preferences, setPreferences] = useState(mockUser.preferences)
  const [formData, setFormData] = useState<FormData>({
    displayName: user.displayName || '',
    phone: user.phone || '',
    address: user.address || '',
    bio: user.bio || '',
    website: user.website || '',
    linkedin: user.social?.linkedin || '',
    twitter: user.social?.twitter || '',
    instagram: user.social?.instagram || '',
    facebook: user.social?.facebook || ''
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize user data from auth context
  useEffect(() => {
    if (authUser) {
      setUser({
        ...mockUser,
        uid: authUser.uid,
        email: authUser.email || mockUser.email,
        displayName: authUser.displayName || mockUser.displayName,
        photoURL: authUser.photoURL
      })
      
      setFormData({
        displayName: authUser.displayName || mockUser.displayName || '',
        phone: mockUser.phone || '',
        address: mockUser.address || '',
        bio: mockUser.bio || '',
        website: mockUser.website || '',
        linkedin: mockUser.social?.linkedin || '',
        twitter: mockUser.social?.twitter || '',
        instagram: mockUser.social?.instagram || '',
        facebook: mockUser.social?.facebook || ''
      })
    }
  }, [authUser])

  // Image upload functions
  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('File selected:', file.name, file.type, file.size)

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      console.log('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      console.log('Image size should be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Create preview and update immediately
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        console.log('Image loaded, URL length:', imageUrl.length)
        setPreviewImage(imageUrl)
        
        // Update user profile immediately with preview
        if (user) {
          const updatedUser = {
            ...user,
            photoURL: imageUrl
          }
          console.log('Updating user with new photoURL')
          setUser(updatedUser)
          
          // Update shared user context to sync with navbar
          updateUser({ photoURL: imageUrl })
          
          // Force re-render by updating state
          setTimeout(() => {
            console.log('User photoURL after update:', updatedUser.photoURL ? 'Set' : 'Not set')
          }, 100)
        }
      }
      reader.readAsDataURL(file)

      // Simulate upload to server
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setShowAvatarModal(false)
      setPreviewImage(null)
      
      console.log('Profile photo updated successfully!')
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }, [user])

  const handleAvatarClick = () => {
    console.log('Avatar clicked, current photoURL:', user?.photoURL ? 'Set' : 'Not set')
    setShowAvatarModal(true)
  }

  const handleAvatarTypeSelect = (type: 'upload' | 'gravatar' | 'default') => {
    console.log('Avatar type selected:', type)
    setSelectedAvatarType(type)
    if (type === 'upload') {
      fileInputRef.current?.click()
    } else if (type === 'default') {
      // Remove custom avatar and show initials
      if (user) {
        const updatedUser = { ...user, photoURL: null }
        console.log('Setting default avatar')
        setUser(updatedUser)
        
        // Update shared user context to sync with navbar
        updateUser({ photoURL: null })
      }
      setShowAvatarModal(false)
      setSelectedAvatarType('default')
    }
  }

  const handleGravatarSelect = (gravatarUrl: string) => {
    console.log('Gravatar selected:', gravatarUrl)
    if (user) {
      const updatedUser = { ...user, photoURL: gravatarUrl }
      setUser(updatedUser)
      
      // Update shared user context to sync with navbar
      updateUser({ photoURL: gravatarUrl })
    }
    setShowAvatarModal(false)
    setSelectedAvatarType('gravatar')
    console.log('Gravatar avatar updated successfully!')
  }

  // Generate resume content
  const generateResumeContent = () => {
    if (!user) return ''
    
    return `
RESUME - ${user.displayName}

=====================================
CONTACT INFORMATION
=====================================
Name: ${user.displayName}
Email: ${user.email}
Phone: ${user.phone || 'Not provided'}
Address: ${user.address || 'Not provided'}
Website: ${user.website || 'Not provided'}

=====================================
PROFESSIONAL SUMMARY
=====================================
${user.bio || 'No bio provided'}

=====================================
SKILLS & EXPERTISE
=====================================
${skills.join(', ')}

=====================================
LANGUAGES
=====================================
${languages.join(', ')}

=====================================
STATISTICS
=====================================
Total Bookings: ${user.stats?.totalBookings || 0}
Completed Bookings: ${user.stats?.completedBookings || 0}
Average Rating: ${user.stats?.averageRating || 0}/5.0
Response Rate: ${user.stats?.responseRate || 0}%
Response Time: ${user.stats?.responseTime || 'N/A'}

=====================================
VERIFICATION STATUS
=====================================
Email: ${user.verification?.email ? '✓ Verified' : '✗ Not Verified'}
Phone: ${user.verification?.phone ? '✓ Verified' : '✗ Not Verified'}
Identity: ${user.verification?.identity ? '✓ Verified' : '✗ Not Verified'}
Address: ${user.verification?.address ? '✓ Verified' : '✗ Not Verified'}

=====================================
ACHIEVEMENTS
=====================================
${user.achievements?.map((ach: Achievement) => `• ${ach.title}: ${ach.description}`).join('\n') || 'No achievements yet'}

=====================================
SOCIAL PROFILES
=====================================
LinkedIn: ${user.social?.linkedin || 'Not provided'}
Twitter: ${user.social?.twitter || 'Not provided'}
Instagram: ${user.social?.instagram || 'Not provided'}
Facebook: ${user.social?.facebook || 'Not provided'}

=====================================
MEMBER SINCE
=====================================
${user.stats?.memberSince || 'N/A'}

Generated on: ${new Date().toLocaleDateString()}
    `.trim()
  }

  // Download resume as text file
  const downloadResume = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${user?.displayName || 'profile'}_resume.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Enhanced profile sharing
  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.displayName}'s Profile`,
          text: `Check out ${user?.displayName}'s professional profile`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      console.log('Profile link copied to clipboard!')
    }
  }

  // Generate Gravatar URL with different options
  const getGravatarUrl = (style: 'identicon' | 'monsterid' | 'retro' | 'robohash' = 'identicon') => {
    if (!user?.email) return ''
    // Simple hash for demo (in production, use MD5)
    const emailHash = user.email.toLowerCase().trim()
    const hash = btoa(emailHash).replace(/=/g, '').substring(0, 32)
    return `https://www.gravatar.com/avatar/${hash}?s=200&d=${style}`
  }

  // Profile completion calculation
  const calculateProfileCompletion = () => {
    if (!user) return 0
    
    let completion = 0
    const items = [
      { field: user.displayName, weight: 15 },
      { field: user.email, weight: 10 },
      { field: user.phone, weight: 10 },
      { field: user.address, weight: 10 },
      { field: user.bio, weight: 15 },
      { field: user.website, weight: 5 },
      { field: skills.length > 0, weight: 10 },
      { field: languages.length > 0, weight: 5 },
      { field: user.verification?.email, weight: 5 },
      { field: user.verification?.phone, weight: 5 },
      { field: user.photoURL, weight: 10 }
    ]
    
    items.forEach(item => {
      if (item.field) completion += item.weight
    })
    
    return Math.min(completion, 100)
  }

  const getCompletionMessage = () => {
    const completion = calculateProfileCompletion()
    if (completion >= 90) return 'Excellent! Your profile is complete.'
    if (completion >= 70) return 'Good! Add a few more details to reach 100%'
    if (completion >= 50) return 'Halfway there! Complete your profile for better visibility.'
    return 'Start building your profile to attract more clients.'
  }

  const getCompletionItems = () => {
    if (!user) return []
    
    return [
      { label: 'Profile Photo', completed: !!user.photoURL },
      { label: 'Display Name', completed: !!user.displayName },
      { label: 'Email Verified', completed: !!user.verification?.email },
      { label: 'Phone Number', completed: !!user.phone },
      { label: 'Address', completed: !!user.address },
      { label: 'Bio/About', completed: !!user.bio },
      { label: 'Skills Added', completed: skills.length > 0 },
      { label: 'Languages Added', completed: languages.length > 0 },
      { label: 'Website', completed: !!user.website },
      { label: 'Phone Verified', completed: !!user.verification?.phone }
    ]
  }

  // Skills management
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  // Languages management
  const handleAddLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()])
      setNewLanguage('')
    }
  }

  const handleRemoveLanguage = (languageToRemove: string) => {
    setLanguages(languages.filter(language => language !== languageToRemove))
  }

  const handleSaveProfile = async () => {
    if (!user) return
    
    // Update user profile with all form data
    const updatedUser = {
      ...user,
      displayName: formData.displayName,
      phone: formData.phone,
      address: formData.address,
      bio: formData.bio,
      website: formData.website,
      social: {
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        instagram: formData.instagram,
        facebook: formData.facebook
      },
      skills,
      languages,
      availability
    }
    
    setUser(updatedUser)
    
    // Update shared user context to sync with navbar
    updateUser({ 
      displayName: updatedUser.displayName,
      photoURL: updatedUser.photoURL 
    })
    
    setEditMode(false)
    // In real app, save to backend API
  }

  const handleSavePreferences = async () => {
    if (!user) return
    
    setUser({
      ...user,
      preferences
    })
    // In real app, save to backend API
  }

  const handleSignOut = async () => {
    await authService.signOut()
    navigate('/')
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ]

  if (loading) {
    return (
      <div className="profile-advanced">
        <div className="loading-container">
          <div className="loading-spinner">⏳</div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="profile-advanced">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Profile Not Found</h2>
          <p>Please sign in to view your profile</p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-advanced">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-cover">
            <div className="cover-gradient"></div>
          </div>
          
          <div className="profile-header-content">
            <div className="profile-info-section">
              <div className="profile-title-section">
                <h1 className="profile-name-large">{user.displayName}</h1>
                <p className="profile-email">{user.email}</p>
                <div className="verification-badges">
                  {user.verification?.email && (
                    <span className="badge verified">✓ Email Verified</span>
                  )}
                  {user.verification?.phone && (
                    <span className="badge verified">✓ Phone Verified</span>
                  )}
                  {user.verification?.identity && (
                    <span className="badge verified">✓ ID Verified</span>
                  )}
                </div>
              </div>
              
              <div className="profile-stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{user.stats?.totalBookings || 0}</div>
                  <div className="stat-label">Total Bookings</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{user.stats?.completedBookings || 0}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">₹{user.stats?.totalSpent || 0}</div>
                  <div className="stat-label">Total Spent</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{user.stats?.averageRating || 0}</div>
                  <div className="stat-label">Avg Rating</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{user.stats?.responseRate}%</div>
                  <div className="stat-label">Response Rate</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{user.stats?.responseTime}</div>
                  <div className="stat-label">Response Time</div>
                </div>
              </div>
            </div>

            <div className="profile-avatar-section">
              <div className="profile-avatar-large" onClick={handleAvatarClick}>
                {user.photoURL && user.photoURL.startsWith('data:') ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} />
                ) : user.photoURL && user.photoURL.startsWith('http') ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} />
                ) : (
                  <span className="avatar-fallback-large">
                    {user.displayName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
                <div className="avatar-overlay">
                  <span className="avatar-icon">📷</span>
                  <span className="avatar-text">Change Photo</span>
                </div>
              </div>
              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
                  {user.photoURL ? 'Image set' : 'No image'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Navigation */}
        <div className="profile-nav">
          <div className="nav-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                <div className="tab-indicator"></div>
              </button>
            ))}
          </div>
          
          <div className="nav-actions">
            <button className="btn-secondary" onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              console.log('Profile link copied to clipboard!')
            }}>
              <span className="btn-icon">🔗</span>
              Share Profile
            </button>
            <button className="btn-primary" onClick={() => {
              // Generate and download resume
              const resumeContent = generateResumeContent()
              downloadResume(resumeContent)
            }}>
              <span className="btn-icon">📄</span>
              Download Resume
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <div className="content-full-width">
                <div className="card">
                  <div className="card-header">
                    <h2>About Me</h2>
                    <button
                      className="btn-edit"
                      onClick={() => setEditMode(!editMode)}
                    >
                      {editMode ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                  <div className="card-content">
                    {editMode ? (
                      <div className="edit-form">
                        <div className="form-group">
                          <label>Display Name</label>
                          <input
                            type="text"
                            value={formData.displayName}
                            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Address</label>
                          <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="form-input"
                            rows={3}
                          />
                        </div>
                        <div className="form-group">
                          <label>Bio</label>
                          <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="form-input"
                            rows={4}
                          />
                        </div>
                        <div className="form-group">
                          <label>Website</label>
                          <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>LinkedIn</label>
                          <input
                            type="url"
                            value={formData.linkedin || ''}
                            onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Twitter</label>
                          <input
                            type="url"
                            value={formData.twitter || ''}
                            onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Instagram</label>
                          <input
                            type="url"
                            value={formData.instagram || ''}
                            onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Facebook</label>
                          <input
                            type="url"
                            value={formData.facebook || ''}
                            onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                            className="form-input"
                          />
                        </div>
                        <div className="form-actions">
                          <button onClick={handleSaveProfile} className="btn-primary">Save Changes</button>
                          <button onClick={() => setEditMode(false)} className="btn-secondary">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="profile-details">
                        <div className="detail-item">
                          <span className="detail-label">Phone:</span>
                          <span className="detail-value">{user.phone || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Address:</span>
                          <span className="detail-value">{user.address || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Bio:</span>
                          <span className="detail-value">{user.bio || 'No bio provided'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Website:</span>
                          <span className="detail-value">{user.website || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Member Since:</span>
                          <span className="detail-value">{user.stats?.memberSince || 'N/A'}</span>
                        </div>
                        {(user.social?.linkedin || user.social?.twitter || user.social?.instagram || user.social?.facebook) && (
                          <div className="detail-item">
                            <span className="detail-label">Social:</span>
                            <div className="social-links">
                              {user.social?.linkedin && (
                                <a href={user.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                                  LinkedIn
                                </a>
                              )}
                              {user.social?.twitter && (
                                <a href={user.social.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                                  Twitter
                                </a>
                              )}
                              {user.social?.instagram && (
                                <a href={user.social.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                                  Instagram
                                </a>
                              )}
                              {user.social?.facebook && (
                                <a href={user.social.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                                  Facebook
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2>Recent Activity</h2>
                  </div>
                  <div className="card-content">
                    <div className="activity-list">
                      <div className="activity-item">
                        <div className="activity-icon">📅</div>
                        <div className="activity-content">
                          <div className="activity-title">Booking Completed</div>
                          <div className="activity-description">AC Repair Service with John Doe</div>
                          <div className="activity-time">2 hours ago</div>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon">⭐</div>
                        <div className="activity-content">
                          <div className="activity-title">Review Received</div>
                          <div className="activity-description">5 stars from Sarah Johnson</div>
                          <div className="activity-time">1 day ago</div>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon">💳</div>
                        <div className="activity-content">
                          <div className="activity-title">Payment Processed</div>
                          <div className="activity-description">₹1,200 for Plumbing Service</div>
                          <div className="activity-time">3 days ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2>Achievements</h2>
                  </div>
                  <div className="card-content">
                    <div className="achievements-grid">
                      {user.achievements?.map((achievement: Achievement) => (
                        <div key={achievement.id} className="achievement-card">
                          <div className="achievement-icon">{achievement.icon}</div>
                          <div className="achievement-info">
                            <div className="achievement-title">{achievement.title}</div>
                            <div className="achievement-description">{achievement.description}</div>
                            <div className="achievement-date">Earned {achievement.earnedAt}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2>Skills & Expertise</h2>
                    {editMode && (
                      <button className="btn-edit">Add Skill</button>
                    )}
                  </div>
                  <div className="card-content">
                    {editMode ? (
                      <div className="skills-editor">
                        <div className="skills-input-group">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a new skill..."
                            className="form-input"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                          />
                          <button onClick={handleAddSkill} className="btn-primary">Add</button>
                        </div>
                        <div className="skills-list">
                          {skills.map((skill, index) => (
                            <div key={index} className="skill-tag">
                              <span>{skill}</span>
                              <button onClick={() => handleRemoveSkill(skill)} className="skill-remove">×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="skills-display">
                        {skills.map((skill, index) => (
                          <span key={index} className="skill-badge">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2>Languages</h2>
                    {editMode && (
                      <button className="btn-edit">Add Language</button>
                    )}
                  </div>
                  <div className="card-content">
                    {editMode ? (
                      <div className="languages-editor">
                        <div className="languages-input-group">
                          <input
                            type="text"
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            placeholder="Add a new language..."
                            className="form-input"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
                          />
                          <button onClick={handleAddLanguage} className="btn-primary">Add</button>
                        </div>
                        <div className="languages-list">
                          {languages.map((language, index) => (
                            <div key={index} className="language-tag">
                              <span>{language}</span>
                              <button onClick={() => handleRemoveLanguage(language)} className="language-remove">×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="languages-display">
                        {languages.map((language, index) => (
                          <span key={index} className="language-badge">{language}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2>Profile Completion</h2>
                  </div>
                  <div className="card-content">
                    <div className="completion-meter">
                      <div className="completion-circle">
                        <svg viewBox="0 0 36 36" className="circular-chart">
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                          <path className="circle-bg"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path className="circle"
                            strokeDasharray={`${calculateProfileCompletion()}, 100`}
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text x="18" y="20.35" className="percentage">
                            {calculateProfileCompletion()}%
                          </text>
                        </svg>
                      </div>
                      <div className="completion-details">
                        <h3>Profile Strength</h3>
                        <p>{getCompletionMessage()}</p>
                        <div className="completion-items">
                          {getCompletionItems().map((item, index) => (
                            <div key={index} className={`completion-item ${item.completed ? 'completed' : 'pending'}`}>
                              <span className="item-icon">{item.completed ? '✓' : '○'}</span>
                              <span className="item-text">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2>Verification Status</h2>
                  </div>
                  <div className="card-content">
                    <div className="verification-list">
                      <div className={`verification-item ${user.verification?.email ? 'verified' : 'pending'}`}>
                        <span className="verification-icon">✓</span>
                        <div className="verification-info">
                          <div className="verification-title">Email Verification</div>
                          <div className="verification-status">
                            {user.verification?.email ? 'Verified' : 'Not Verified'}
                          </div>
                        </div>
                      </div>
                      <div className={`verification-item ${user.verification?.phone ? 'verified' : 'pending'}`}>
                        <span className="verification-icon">✓</span>
                        <div className="verification-info">
                          <div className="verification-title">Phone Verification</div>
                          <div className="verification-status">
                            {user.verification?.phone ? 'Verified' : 'Not Verified'}
                          </div>
                        </div>
                      </div>
                      <div className={`verification-item ${user.verification?.identity ? 'verified' : 'pending'}`}>
                        <span className="verification-icon">!</span>
                        <div className="verification-info">
                          <div className="verification-title">Identity Verification</div>
                          <div className="verification-status">
                            {user.verification?.identity ? 'Verified' : 'Not Verified'}
                          </div>
                        </div>
                      </div>
                      <div className={`verification-item ${user.verification?.address ? 'verified' : 'pending'}`}>
                        <span className="verification-icon">!</span>
                        <div className="verification-info">
                          <div className="verification-title">Address Verification</div>
                          <div className="verification-status">
                            {user.verification?.address ? 'Verified' : 'Not Verified'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="tab-content">
              <div className="content-grid">
                <div className="content-main">
                  <div className="card">
                    <div className="card-header">
                      <h2>Preferences</h2>
                    </div>
                    <div className="card-content">
                      <div className="preferences-form">
                        <div className="preference-item">
                          <div className="preference-info">
                            <div className="preference-title">Email Notifications</div>
                            <div className="preference-description">
                              Receive email updates about your bookings and account
                            </div>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={preferences.emailUpdates}
                              onChange={(e) => setPreferences({...preferences, emailUpdates: e.target.checked})}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                        <div className="preference-item">
                          <div className="preference-info">
                            <div className="preference-title">Push Notifications</div>
                            <div className="preference-description">
                              Get push notifications on your device
                            </div>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={preferences.notifications}
                              onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                        <div className="preference-item">
                          <div className="preference-info">
                            <div className="preference-title">Dark Mode</div>
                            <div className="preference-description">
                              Use dark theme across the application
                            </div>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={preferences.darkMode}
                              onChange={(e) => setPreferences({...preferences, darkMode: e.target.checked})}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                        <div className="preference-item">
                          <div className="preference-info">
                            <div className="preference-title">Language</div>
                            <div className="preference-description">
                              Choose your preferred language
                            </div>
                          </div>
                          <select
                            value={preferences.language}
                            onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                            className="form-select"
                          >
                            <option value="en">English</option>
                            <option value="hi">हिन्दी</option>
                            <option value="bn">বাংলা</option>
                            <option value="ta">தமிழ்</option>
                          </select>
                        </div>
                        <div className="form-actions">
                          <button onClick={handleSavePreferences} className="btn-primary">
                            Save Preferences
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="tab-content">
              <div className="content-grid">
                <div className="content-main">
                  <div className="card">
                    <div className="card-header">
                      <h2>Security Settings</h2>
                    </div>
                    <div className="card-content">
                      <div className="security-sections">
                        <div className="security-section">
                          <h3>Change Password</h3>
                          <p>Update your password to keep your account secure</p>
                          <button className="btn-secondary">Change Password</button>
                        </div>
                        <div className="security-section">
                          <h3>Two-Factor Authentication</h3>
                          <p>Add an extra layer of security to your account</p>
                          <button className="btn-secondary">Enable 2FA</button>
                        </div>
                        <div className="security-section">
                          <h3>Login Activity</h3>
                          <p>View recent login attempts and device activity</p>
                          <button className="btn-secondary">View Activity</button>
                        </div>
                        <div className="security-section danger">
                          <h3>Danger Zone</h3>
                          <p>Irreversible actions for your account</p>
                          <button className="btn-danger" onClick={handleSignOut}>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs (Bookings, Payments, Reviews) */}
          {['bookings', 'payments', 'reviews'].includes(activeTab) && (
            <div className="tab-content">
              <div className="coming-soon">
                <div className="coming-soon-icon">🚧</div>
                <h2>Coming Soon</h2>
                <p>This section is under development</p>
                <Link to="/bookings" className="btn-primary">
                  Go to {activeTab === 'bookings' ? 'My Bookings' : activeTab === 'payments' ? 'Payment Page' : 'Reviews'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className="modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="avatar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Profile Photo</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowAvatarModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="avatar-options">
                <button 
                  className={`avatar-option ${selectedAvatarType === 'upload' ? 'active' : ''}`}
                  onClick={() => handleAvatarTypeSelect('upload')}
                >
                  <div className="avatar-option-icon">📷</div>
                  <div className="avatar-option-info">
                    <div className="avatar-option-title">Upload Photo</div>
                    <div className="avatar-option-desc">Choose from your device (JPG, PNG, GIF)</div>
                    <div className="avatar-option-note">Max size: 5MB</div>
                  </div>
                </button>
                
                <button 
                  className={`avatar-option ${selectedAvatarType === 'gravatar' ? 'active' : ''}`}
                  onClick={() => handleAvatarTypeSelect('gravatar')}
                >
                  <div className="avatar-option-icon">👤</div>
                  <div className="avatar-option-info">
                    <div className="avatar-option-title">Use Gravatar</div>
                    <div className="avatar-option-desc">Import from email address</div>
                    <div className="avatar-option-note">Multiple styles available</div>
                  </div>
                </button>
                
                <button 
                  className={`avatar-option ${selectedAvatarType === 'default' ? 'active' : ''}`}
                  onClick={() => handleAvatarTypeSelect('default')}
                >
                  <div className="avatar-option-icon">🔤</div>
                  <div className="avatar-option-info">
                    <div className="avatar-option-title">Default Avatar</div>
                    <div className="avatar-option-desc">Use your initials</div>
                    <div className="avatar-option-note">Clean & professional</div>
                  </div>
                </button>
              </div>
              
              {selectedAvatarType === 'gravatar' && (
                <div className="gravatar-section">
                  <div className="gravatar-header">
                    <h4>Choose Gravatar Style</h4>
                    <p>Select your preferred avatar style</p>
                  </div>
                  <div className="gravatar-options-grid">
                    <div className="gravatar-option">
                      <img 
                        src={getGravatarUrl('identicon')} 
                        alt="Identicon"
                        onClick={() => handleGravatarSelect(getGravatarUrl('identicon'))}
                      />
                      <span>Identicon</span>
                    </div>
                    <div className="gravatar-option">
                      <img 
                        src={getGravatarUrl('monsterid')} 
                        alt="Monster ID"
                        onClick={() => handleGravatarSelect(getGravatarUrl('monsterid'))}
                      />
                      <span>Monster</span>
                    </div>
                    <div className="gravatar-option">
                      <img 
                        src={getGravatarUrl('retro')} 
                        alt="Retro"
                        onClick={() => handleGravatarSelect(getGravatarUrl('retro'))}
                      />
                      <span>Retro</span>
                    </div>
                    <div className="gravatar-option">
                      <img 
                        src={getGravatarUrl('robohash')} 
                        alt="Robohash"
                        onClick={() => handleGravatarSelect(getGravatarUrl('robohash'))}
                      />
                      <span>Robot</span>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedAvatarType === 'upload' && (
                <div className="upload-section">
                  <div className="upload-preview">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <span className="upload-icon">📷</span>
                        <span>No image selected</span>
                      </div>
                    )}
                  </div>
                  <div className="upload-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Image
                    </button>
                    {previewImage && (
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          if (user && previewImage) {
                            setUser({ ...user, photoURL: previewImage })
                            setShowAvatarModal(false)
                            setPreviewImage(null)
                            
                            // Update shared user context to sync with navbar
                            updateUser({ photoURL: previewImage })
                            
                            console.log('Profile photo updated successfully!')
                          }
                        }}
                      >
                        Confirm Upload
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {uploading && (
                <div className="upload-progress">
                  <div className="loading-spinner">⏳</div>
                  <p>Uploading image...</p>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>
              )}
              
              <div className="avatar-tips">
                <h4>Tips for best results:</h4>
                <ul>
                  <li>Use a square image for best fit</li>
                  <li>High resolution images look better</li>
                  <li>Clear photos of your face work best</li>
                  <li>Professional headshots recommended</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
    </div>
  )
}
