import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ContactProvider.css'

const ContactProviderShowcase: React.FC = () => {
  const navigate = useNavigate()
  const [activeDemo, setActiveDemo] = useState<'features' | 'providers' | 'chat' | 'calls'>('features')

  const features = [
    {
      icon: '📞',
      title: 'Voice & Video Calls',
      description: 'HD quality voice and video calls with real-time connection',
      demo: 'Experience crystal-clear communication with service providers through our advanced calling system.'
    },
    {
      icon: '💬',
      title: 'Smart Chat Interface',
      description: 'AI-powered chat with quick replies and emoji support',
      demo: 'Intelligent messaging system with typing indicators, file sharing, and instant responses.'
    },
    {
      icon: '📍',
      title: 'Live Location Sharing',
      description: 'Share your real-time location for accurate service delivery',
      demo: 'One-click location sharing with GPS tracking for precise service provider navigation.'
    },
    {
      icon: '📅',
      title: 'Schedule Calls',
      description: 'Book appointments and schedule calls in advance',
      demo: 'Smart scheduling system with calendar integration and automated reminders.'
    },
    {
      icon: '🚨',
      title: 'Emergency Mode',
      description: 'Priority emergency services with instant provider connection',
      demo: 'Red alert system for urgent situations with immediate provider notification.'
    },
    {
      icon: '⭐',
      title: 'Verified Providers',
      description: 'Background-checked and verified service professionals',
      demo: 'Comprehensive verification process including identity, skills, and customer reviews.'
    }
  ]

  const demoProviders = [
    {
      name: 'Rajesh Kumar',
      specialty: 'Plumbing Expert',
      avatar: '👨‍🔧',
      rating: 4.8,
      status: 'online',
      responseTime: '< 5 min',
      demo: 'Currently handling emergency pipe repairs in Mumbai area'
    },
    {
      name: 'Priya Sharma',
      specialty: 'Electrical Specialist',
      avatar: '👩‍⚡',
      rating: 4.9,
      status: 'online',
      responseTime: '< 3 min',
      demo: 'Expert in electrical installations and safety inspections'
    }
  ]

  const chatDemo = [
    { type: 'provider', message: 'Hello! I\'m Rajesh, your plumbing expert. How can I help you today?' },
    { type: 'user', message: 'I have a leaking pipe in my kitchen' },
    { type: 'provider', message: 'I understand. Can you send me a photo of the leak?' },
    { type: 'user', message: '📍 Location shared' },
    { type: 'provider', message: 'I can see your location. I\'ll reach in 15 minutes!' }
  ]

  const callDemo = [
    { stage: 'calling', duration: '0:00', description: 'Connecting to Rajesh Kumar...' },
    { stage: 'connected', duration: '2:45', description: 'Call in progress - Discussing pipe repair' },
    { stage: 'ended', duration: '5:23', description: 'Call completed - Service scheduled' }
  ]

  return (
    <div className="contact-provider">
      {/* Header */}
      <div className="provider-header">
        <div className="header-content">
          <h1>Contact Provider Showcase</h1>
          <p>Experience advanced features for professional service provider communication</p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-number">6+</span>
            <span className="stat-label">Features</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
          <div className="stat">
            <span className="stat-number">HD</span>
            <span className="stat-label">Quality</span>
          </div>
        </div>
      </div>

      {/* Demo Navigation */}
      <div className="provider-selection">
        <div className="demo-nav">
          <button 
            className={`demo-btn ${activeDemo === 'features' ? 'active' : ''}`}
            onClick={() => setActiveDemo('features')}
          >
            ✨ Features
          </button>
          <button 
            className={`demo-btn ${activeDemo === 'providers' ? 'active' : ''}`}
            onClick={() => setActiveDemo('providers')}
          >
            👥 Providers
          </button>
          <button 
            className={`demo-btn ${activeDemo === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveDemo('chat')}
          >
            💬 Chat Demo
          </button>
          <button 
            className={`demo-btn ${activeDemo === 'calls' ? 'active' : ''}`}
            onClick={() => setActiveDemo('calls')}
          >
            📞 Call Demo
          </button>
        </div>

        {/* Features Demo */}
        {activeDemo === 'features' && (
          <div className="features-showcase">
            <h2>Advanced Communication Features</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="feature-demo">
                    <strong>Demo:</strong> {feature.demo}
                  </div>
                  <button 
                    className="action-btn primary"
                    onClick={() => navigate('/contact-provider')}
                  >
                    Try Feature
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Providers Demo */}
        {activeDemo === 'providers' && (
          <div className="providers-showcase">
            <h2>Live Provider Demonstration</h2>
            <div className="providers-grid">
              {demoProviders.map((provider, index) => (
                <div key={index} className="provider-card online">
                  <div className="provider-info">
                    <div className="provider-avatar">
                      <span className="avatar-emoji">{provider.avatar}</span>
                      <div className="status-indicator online"></div>
                    </div>
                    <div className="provider-details">
                      <h3>{provider.name}</h3>
                      <div className="specialty">{provider.specialty}</div>
                      <div className="provider-meta">
                        <span className="rating">⭐ {provider.rating}</span>
                        <span className="response-time">⏱️ {provider.responseTime}</span>
                      </div>
                      <div className="demo-status">
                        <strong>Live Demo:</strong> {provider.demo}
                      </div>
                    </div>
                  </div>
                  <div className="provider-actions">
                    <button className="action-btn primary">
                      <span>📞</span>
                      <span>Call Now</span>
                    </button>
                    <button className="action-btn secondary">
                      <span>💬</span>
                      <span>Start Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Demo */}
        {activeDemo === 'chat' && (
          <div className="chat-showcase">
            <h2>Smart Chat Interface Demo</h2>
            <div className="conversation-view">
              <div className="conversation-header">
                <div className="provider-info">
                  <div className="provider-avatar">
                    <span className="avatar-emoji">👨‍🔧</span>
                    <div className="status-indicator online"></div>
                  </div>
                  <div className="provider-details">
                    <h3>Rajesh Kumar</h3>
                    <div className="specialty">Plumbing Expert</div>
                    <div className="status-text">🟢 Active now</div>
                  </div>
                </div>
              </div>
              
              <div className="chat-interface">
                <div className="messages-container">
                  {chatDemo.map((msg, index) => (
                    <div key={index} className={`message ${msg.type}`}>
                      <div className="message-content">
                        <p>{msg.message}</p>
                        <span className="message-time">
                          {index === 0 ? '10:30 AM' : 
                           index === 1 ? '10:31 AM' : 
                           index === 2 ? '10:32 AM' : 
                           index === 3 ? '10:33 AM' : '10:34 AM'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="message-input">
                  <div className="input-actions">
                    <button className="action-btn">📎</button>
                    <button className="action-btn">😊</button>
                    <button className="action-btn">🎤</button>
                    <button className="action-btn">📍</button>
                  </div>
                  <input
                    type="text"
                    value="Thank you! See you soon."
                    readOnly
                  />
                  <button className="send-btn">➤</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call Demo */}
        {activeDemo === 'calls' && (
          <div className="calls-showcase">
            <h2>Voice & Video Call Experience</h2>
            <div className="call-demo-container">
              {callDemo.map((call, index) => (
                <div key={index} className="call-demo-card">
                  <div className="call-status">
                    <div className="call-icon">
                      {call.stage === 'calling' ? '📞' : 
                       call.stage === 'connected' ? '🟢' : '📴'}
                    </div>
                    <h3>{call.stage.charAt(0).toUpperCase() + call.stage.slice(1)}</h3>
                    <div className="call-duration">{call.duration}</div>
                    <p>{call.description}</p>
                  </div>
                  
                  {call.stage === 'connected' && (
                    <div className="call-controls-demo">
                      <button className="control-btn">🎤</button>
                      <button className="control-btn">📹</button>
                      <button className="control-btn end-call">📞</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="call-features">
              <h3>Advanced Call Features</h3>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">🔊</span>
                  <span>HD Audio Quality</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📹</span>
                  <span>Video Calling</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎙️</span>
                  <span>Noise Cancellation</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⏱️</span>
                  <span>Call Recording</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span>Multi-device Support</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🌐</span>
                  <span>Low Latency</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Actions */}
      <div className="floating-actions">
        <button 
          className="floating-btn emergency"
          onClick={() => navigate('/contact-provider')}
          title="Emergency Service"
        >
          🚨
        </button>
        <button 
          className="floating-btn"
          onClick={() => navigate('/contact-provider')}
          title="Contact Provider"
        >
          📞
        </button>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Experience Professional Service?</h2>
          <p>Connect with verified providers instantly using our advanced communication platform</p>
          <div className="cta-buttons">
            <button 
              className="action-btn primary large"
              onClick={() => navigate('/contact-provider')}
            >
              🚀 Try Contact Provider Now
            </button>
            <button 
              className="action-btn secondary large"
              onClick={() => navigate('/')}
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactProviderShowcase
