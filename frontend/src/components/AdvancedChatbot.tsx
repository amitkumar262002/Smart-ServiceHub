import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/AdvancedChatbot.css';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  category?: string;
  metadata?: {
    suggestedActions?: string[];
    keywords?: string[];
    confidence?: number;
    urgency?: 'low' | 'medium' | 'high';
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

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

// Mock Data
const mockServices = [
  { id: '1', name: 'Deep Cleaning', category: 'cleaning', price: '$50-100', rating: 4.8, icon: '🧹' },
  { id: '2', name: 'Plumbing Repair', category: 'plumbing', price: '$80-150', rating: 4.6, icon: '🔧' },
  { id: '3', name: 'Electrical Work', category: 'electrical', price: '$100-200', rating: 4.7, icon: '⚡' },
  { id: '4', name: 'Pest Control', category: 'pest', price: '$60-120', rating: 4.5, icon: '🐜' },
  { id: '5', name: 'Emergency Service', category: 'emergency', price: '$150-300', rating: 4.9, icon: '🚨' },
];

const commonEmojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🙏', '💪', '👏', '🤝'];

const AdvancedChatbot: React.FC = () => {
  // State Management
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentCategory, setCurrentCategory] = useState<string>('general');

  // Refs
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        text: `👋 Hello! I'm your Advanced Service Assistant! 

I can help you with:
🧹 Cleaning Services - Deep cleaning, regular maintenance
🔧 Plumbing Repairs - Fix leaks, installations, emergencies
⚡ Electrical Work - Safety inspections, repairs
🐜 Pest Control - Safe and effective treatments
🚨 Emergency Services - 24/7 urgent help
💰 Price Quotes - Compare and save money

Try asking me:
• "I need cleaning services"
• "My faucet is leaking"
• "Emergency electrical help"
• "Get quotes for pest control"

How can I help you today?`,
        timestamp: new Date().toISOString(),
        sentiment: 'positive',
        category: 'general',
        metadata: {
          suggestedActions: [
            'Find cleaning services',
            'Fix plumbing issue',
            'Electrical help needed',
            'Pest control quote',
            'Emergency service',
            'Compare prices'
          ],
          keywords: ['help', 'services', 'cleaning', 'plumbing', 'electrical'],
          confidence: 1.0,
          urgency: 'low'
        }
      };

      setMessages([welcomeMessage]);
      setShowSuggestions(true);
      
      // Initial smart suggestions
      const initialSuggestions: SmartSuggestion[] = [
        { id: '1', text: 'Book Cleaning Service', category: 'cleaning', priority: 1, icon: '🧹', action: 'book' },
        { id: '2', text: 'Fix Plumbing Issue', category: 'plumbing', priority: 1, icon: '🔧', action: 'fix' },
        { id: '3', text: 'Electrical Help', category: 'electrical', priority: 1, icon: '⚡', action: 'help' },
        { id: '4', text: 'Pest Control Quote', category: 'pest', priority: 2, icon: '🐜', action: 'quote' },
        { id: '5', text: 'Emergency Service', category: 'emergency', priority: 1, icon: '🚨', action: 'emergency' },
        { id: '6', text: 'Compare Prices', category: 'pricing', priority: 2, icon: '💰', action: 'compare' }
      ];
      setSmartSuggestions(initialSuggestions);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Generate AI Response - Enhanced with more features
  const generateAIResponse = useCallback((userInput: string): Message => {
    const input = userInput.toLowerCase();
    let responseText = '';
    let category = 'general';
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let suggestedActions: string[] = [];

    // Enhanced intent detection with more patterns
    if (input.includes('clean') || input.includes('cleaning') || input.includes('wash') || input.includes('dust')) {
      category = 'cleaning';
      responseText = `🧹 I'd be happy to help you find the perfect cleaning service!

I can connect you with top-rated professionals for:
• Deep House Cleaning - $50-100 (3-4 hours)
• Regular Maintenance - $30-60 (2 hours)
• Move-in/Move-out Cleaning - $80-150 (4-6 hours)
• Office Cleaning - $40-80 (2-3 hours)
• Post-Construction Cleaning - $100-200 (6-8 hours)

All our cleaners are:
✅ Background checked and verified
✅ Fully insured for your protection  
✅ 5-star rated with 100+ reviews
✅ Eco-friendly products available
✅ Same-day service available
✅ Satisfaction guaranteed

What type of cleaning service do you need and when?`;
      suggestedActions = ['Book Deep Cleaning', 'Regular Cleaning', 'Move-in Cleaning', 'Office Cleaning', 'Get Quote', 'Same-day Service'];
    } else if (input.includes('plumb') || input.includes('leak') || input.includes('faucet') || input.includes('pipe') || input.includes('drain')) {
      category = 'plumbing';
      responseText = `🔧 Plumbing issues can be stressful! I'm here to help you find reliable plumbers quickly.

Common services we handle:
• Leak Repairs - $80-150 (1-2 hours)
• Pipe Installation - $150-300 (2-4 hours)
• Drain Cleaning - $60-120 (1-2 hours)
• Water Heater Service - $100-250 (2-3 hours)
• Emergency Plumbing - $150-400 (Immediate response)
• Bathroom Fixtures - $80-200 (1-3 hours)

Our plumbers:
✅ Licensed & insured professionals
✅ 24/7 emergency availability
✅ Upfront pricing with no hidden fees
✅ 1-year warranty on all work
✅ Same-day service for most issues
✅ Emergency 30-minute response

What plumbing issue are you experiencing and is it urgent?`;
      suggestedActions = ['Fix Leak Now', 'Emergency Plumber', 'Get Quote', 'Schedule Service', 'Water Heater', 'Drain Cleaning'];
    } else if (input.includes('electric') || input.includes('power') || input.includes('wire') || input.includes('outlet') || input.includes('switch')) {
      category = 'electrical';
      responseText = `⚡ Electrical safety is crucial! Let me connect you with certified electricians.

Services available:
• Safety Inspections - $100-200 (1-2 hours)
• Outlet/Switch Repair - $80-150 (1-2 hours)
• Panel Upgrades - $500-1500 (4-8 hours)
• Lighting Installation - $150-400 (2-4 hours)
• Emergency Electrical - $200-500 (Immediate response)
• Ceiling Fan Installation - $100-250 (2-3 hours)

All electricians are:
✅ Licensed and certified professionals
✅ Background checked for your safety
✅ Fully insured with liability coverage
✅ Upfront pricing with detailed quotes
✅ Emergency 24/7 service available
✅ Code-compliant work guaranteed

What electrical service do you need? Is this an emergency?`;
      suggestedActions = ['Safety Inspection', 'Repair Service', 'Emergency Help', 'Panel Upgrade', 'Lighting Install', 'Get Quote'];
    } else if (input.includes('pest') || input.includes('bug') || input.includes('insect') || input.includes('rodent') || input.includes('termite')) {
      category = 'pest';
      responseText = `🐜 I understand pest problems can be frustrating! Let me find you expert pest control services.

Services we offer:
• General Pest Control - $60-120 (1-2 hours)
• Termite Treatment - $200-500 (2-4 hours)
• Bed Bug Removal - $300-800 (4-6 hours)
• Rodent Control - $100-250 (1-3 hours)
• Eco-Friendly Options - +$20 (Safe for kids/pets)
• Emergency Service - $150-400 (Same day)

Our pest control experts:
✅ Licensed and certified technicians
✅ Pet and family safe treatments
✅ Eco-friendly green options available
✅ 100% satisfaction guaranteed
✅ Free inspections and quotes
✅ Emergency same-day service

What type of pest issue are you dealing with? Do you have children or pets?`;
      suggestedActions = ['Free Inspection', 'General Pest Control', 'Emergency Service', 'Eco-Friendly Options', 'Termite Treatment', 'Bed Bug Removal'];
    } else if (input.includes('emergency') || input.includes('urgent') || input.includes('asap') || input.includes('immediate')) {
      category = 'emergency';
      responseText = `🚨 I understand this is urgent! Let me get you emergency service right away.

Emergency services available 24/7:
• Emergency Plumbing - $150-400 (30-min response)
• Emergency Electrical - $200-500 (30-min response)
• Emergency HVAC - $200-600 (45-min response)
• Water Damage - $300-800 (1-hour response)
• Lockout Services - $50-150 (15-min response)
• Gas Leak Detection - $100-300 (Immediate)

Our emergency team:
✅ Available 24/7/365 including holidays
✅ 30-minute response time guaranteed
✅ Licensed and insured professionals
✅ Upfront emergency pricing
✅ Work guaranteed for 1 year
✅ Emergency dispatch tracking

What emergency service do you need immediately? Is anyone in danger?`;
      suggestedActions = ['Emergency Plumbing', 'Emergency Electrical', 'Water Damage', 'Gas Leak', 'Lockout Help', 'Call Now'];
    } else if (input.includes('price') || input.includes('cost') || input.includes('quote') || input.includes('estimate') || input.includes('cheap')) {
      category = 'pricing';
      responseText = `💰 I'd be happy to help you find the best prices! Here are our competitive rates:

🧹 Cleaning Services:
• Regular Cleaning - $30-60 per visit
• Deep Cleaning - $50-100 per visit
• Move-out Cleaning - $80-150 per visit
• Office Cleaning - $40-80 per visit

🔧 Plumbing Services:
• Basic Repairs - $80-150 per job
• Emergency - $150-400 per job
• Installation - $150-300 per job
• Drain Cleaning - $60-120 per job

⚡ Electrical Services:
• Inspections - $100-200 per visit
• Repairs - $80-150 per job
• Installations - $150-400 per job
• Panel Work - $500-1500 per job

🐜 Pest Control:
• General Treatment - $60-120 per visit
• Termite - $200-500 per treatment
• Emergency - $100-250 per visit

All prices include:
✅ Free estimates and quotes
✅ No hidden fees or charges
✅ Payment plans available
✅ 100% satisfaction guarantee
✅ Emergency pricing available
✅ Multi-service discounts

What service would you like a detailed quote for?`;
      suggestedActions = ['Get Cleaning Quote', 'Plumbing Quote', 'Electrical Quote', 'Pest Control Quote', 'Compare All Services', 'Discount Options'];
    } else if (input.includes('book') || input.includes('schedule') || input.includes('appointment') || input.includes('reserve')) {
      category = 'booking';
      responseText = `📅 Perfect! I can help you schedule your service appointment.

Booking options available:
• Same-day appointments - Call now
• Next-day service - Book by 6pm
• Weekly service plans - Save 20%
• Monthly maintenance - Save 25%
• Emergency service - Available 24/7

Easy booking process:
1. Choose your service type
2. Select preferred date/time
3. Get instant confirmation
4. Professional arrives on time
5. Pay after service completion

Flexible scheduling:
✅ Morning slots (8am-12pm)
✅ Afternoon slots (12pm-5pm)
✅ Evening slots (5pm-8pm)
✅ Weekend availability
✅ Holiday service available
✅ Text reminders included

What service would you like to book and when do you prefer?`;
      suggestedActions = ['Book Cleaning', 'Schedule Plumbing', 'Reserve Electrical', 'Set Up Pest Control', 'Emergency Booking', 'Weekly Service'];
    } else if (input.includes('review') || input.includes('rating') || input.includes('feedback') || input.includes('testimonials')) {
      category = 'reviews';
      responseText = `⭐ Great idea to check reviews! Here are our latest customer ratings:

Overall Customer Satisfaction: 4.8/5 stars
📊 Based on 2,847 verified reviews

Recent Customer Reviews:
� "Amazing cleaning service! Very thorough and professional." - Sarah M.
⭐⭐⭐⭐⭐ Deep Cleaning, 2 days ago

🔧 "Fixed my leaky faucet quickly. Fair pricing and great work!" - John D.
⭐⭐⭐⭐⭐ Plumbing Repair, 1 week ago

⚡ "Professional electrician, solved our power issues safely." - Mike R.
⭐⭐⭐⭐⭐ Electrical Service, 3 days ago

🐜 "Eco-friendly pest control worked great, safe for my pets!" - Lisa K.
⭐⭐⭐⭐⭐ Pest Control, 5 days ago

Service Ratings:
• Cleaning Services - 4.9/5 (1,234 reviews)
• Plumbing Services - 4.7/5 (856 reviews)
• Electrical Services - 4.8/5 (623 reviews)
• Pest Control - 4.6/5 (134 reviews)

All reviews are from verified customers with photos and detailed feedback.

What service are you interested in seeing more reviews for?`;
      suggestedActions = ['Cleaning Reviews', 'Plumbing Reviews', 'Electrical Reviews', 'Pest Control Reviews', 'Write Review', 'Top Rated'];
    } else {
      responseText = `�🤝 I'm here to help you find the perfect service! 

I can assist you with:
🧹 Professional cleaning services (all types)
🔧 Reliable plumbing repairs (emergency available)
⚡ Licensed electrical work (safety first)
🐜 Safe pest control (eco-friendly options)
🚨 24/7 emergency services (immediate response)
💰 Competitive price quotes (free estimates)
📅 Easy booking and scheduling
⭐ Verified customer reviews
🎯 Service recommendations

Simply tell me what you need help with, and I'll connect you with the best local professionals who are:
✅ Background checked and verified
✅ Fully licensed and insured
✅ Highly rated (4.5+ stars average)
✅ Insured for your protection
✅ Upfront pricing with no surprises
✅ Guaranteed satisfaction

You can ask me things like:
• "I need my house cleaned"
• "My sink is leaking"
• "Emergency electrical help"
• "Get quotes for pest control"
• "Book an appointment"
• "Show me reviews"

What service are you looking for today?`;
      suggestedActions = ['Cleaning Services', 'Plumbing Help', 'Electrical Work', 'Pest Control', 'Emergency Service', 'Get Quotes', 'Book Appointment', 'Check Reviews'];
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      text: responseText,
      timestamp: new Date().toISOString(),
      sentiment,
      category,
      metadata: {
        suggestedActions,
        keywords: input.split(' ').filter(word => word.length > 3),
        confidence: 0.9,
        urgency: category === 'emergency' ? 'high' : 'medium'
      }
    };
  }, []);

  // Send Message - Fast Response
  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
      metadata: {
        keywords: text.split(' ').filter(word => word.length > 3)
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowSuggestions(false);

    // Fast response - 600ms for better UX
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Show smart suggestions after response
      if (aiResponse.metadata?.suggestedActions) {
        const suggestions: SmartSuggestion[] = aiResponse.metadata.suggestedActions.map((action, index) => ({
          id: (index + 1).toString(),
          text: action,
          category: aiResponse.category || 'general',
          priority: 1,
          icon: aiResponse.category === 'cleaning' ? '🧹' : 
                aiResponse.category === 'plumbing' ? '🔧' : 
                aiResponse.category === 'electrical' ? '⚡' : 
                aiResponse.category === 'pest' ? '🐜' : 
                aiResponse.category === 'emergency' ? '🚨' : 
                aiResponse.category === 'pricing' ? '💰' : '💬',
          action: 'response'
        }));
        setSmartSuggestions(suggestions);
        setShowSuggestions(true);
      }
    }, 600);
  }, [input, isTyping, generateAIResponse]);

  // Handle Action Click
  const handleActionClick = useCallback((action: string) => {
    setInput(action);
    sendMessage();
  }, [sendMessage]);

  // Handle Smart Suggestion Click
  const handleSuggestionClick = useCallback((suggestion: SmartSuggestion) => {
    setCurrentCategory(suggestion.category);
    handleActionClick(suggestion.text);
  }, [handleActionClick]);

  // Handle Emoji Select
  const handleEmojiSelect = useCallback((emoji: string) => {
    setInput(prev => prev + emoji);
    setShowEmojis(false);
    inputRef.current?.focus();
  }, []);

  // Handle File Upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments: Attachment[] = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file)
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  }, []);

  // Remove Attachment
  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  }, []);

  // Toggle Theme
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Clear Chat
  const clearChat = useCallback(() => {
    setMessages([]);
    setShowSuggestions(false);
    setCurrentCategory('general');
  }, []);

  return (
    <div className={`advanced-chatbot ${theme} ${isOpen ? 'open' : 'closed'}`}>
      {/* Chat Button */}
      <button 
        className="chat-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Chat"
      >
        <span className="chat-icon">💬</span>
        <span className="chat-badge">Chat</span>
        {messages.length > 1 && <span className="notification-dot"></span>}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="chat-popup">
          {/* Header */}
          <div className="chat-header">
            <div className="header-left">
              <h3>Service Assistant</h3>
              <span className="status">Online • Ready to Help</span>
            </div>
            <div className="header-right">
              <button className="header-btn" onClick={toggleTheme} title="Toggle Theme">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <button className="header-btn" onClick={clearChat} title="Clear Chat">
                🗑️
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
                </div>
                <div className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
          </div>

          {/* Smart Suggestions */}
          {showSuggestions && smartSuggestions.length > 0 && (
            <div className="smart-suggestions">
              <div className="suggestions-grid">
                {smartSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    className="suggestion-btn"
                    onClick={() => handleSuggestionClick(suggestion)}
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
            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="attachments">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="attachment">
                    <span className="attachment-name">{attachment.name}</span>
                    <button className="remove-btn" onClick={() => removeAttachment(attachment.id)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="input-container">
              <div className="input-left">
                {/* File Upload */}
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

                {/* Emoji Picker */}
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
                {/* Voice Recording */}
                <button 
                  className={`input-btn voice-btn ${isRecording ? 'recording' : ''}`}
                  onClick={() => setIsRecording(!isRecording)}
                  title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
                >
                  {isRecording ? '⏹️' : '🎤'}
                </button>

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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedChatbot;
