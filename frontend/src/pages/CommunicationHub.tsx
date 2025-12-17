import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Video, 
  MessageCircle, 
  Users, 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  MoreVertical,
  Search,
  Filter,
  PhoneCall,
  MessageSquare,
  User,
  Clock,
  Check,
  CheckCheck,
  MapPin,
  Navigation,
  Wifi,
  Battery,
  Signal,
  Settings,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Monitor,
  Camera,
  CameraOff,
  MicOff,
  Share2,
  Circle,
  Pause,
  Play,
  X,
  ArrowLeft,
  UserPlus,
  Group,
  Archive,
  Star,
  Bell,
  Shield,
  Globe,
  Zap,
  Activity,
  TrendingUp,
  Calendar,
  FileText,
  Image,
  Download,
  Upload
} from 'lucide-react';
import '../styles/CommunicationHub.css';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'location';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    duration?: number;
    location?: { lat: number; lng: number; address: string };
  };
}

interface Call {
  id: string;
  type: 'audio' | 'video';
  participants: { id: string; name: string; avatar: string; status?: string }[];
  status: 'incoming' | 'outgoing' | 'active' | 'ended' | 'missed';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  quality?: 'excellent' | 'good' | 'poor';
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  lastSeen?: Date;
  phone?: string;
  email?: string;
  location?: { lat: number; lng: number; address: string };
  isVerified?: boolean;
  isFavorite?: boolean;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: Date;
}

interface CommunicationHubProps {
  initialView?: 'chats' | 'calls' | 'contacts';
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    avatar: '👨‍🔧',
    status: 'online',
    phone: '+1 234-567-8901',
    email: 'john.smith@services.com',
    location: { lat: 40.7580, lng: -73.9855, address: '123 Main St, New York, NY' },
    isVerified: true,
    isFavorite: true,
    unreadCount: 3,
    lastMessage: 'I can start the plumbing work tomorrow',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: '👩‍⚡',
    status: 'away',
    phone: '+1 234-567-8902',
    email: 'sarah.j@electrical.com',
    location: { lat: 40.7614, lng: -73.9776, address: '456 West 34th St, New York, NY' },
    isVerified: true,
    isFavorite: false,
    unreadCount: 1,
    lastMessage: 'The electrical inspection is complete',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '3',
    name: 'Emily Davis',
    avatar: '🎨',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60),
    phone: '+1 234-567-8904',
    email: 'emily.d@paint.com',
    location: { lat: 40.7489, lng: -73.9680, address: '789 East 42nd St, New York, NY' },
    isVerified: true,
    isFavorite: true,
    lastMessage: 'Paint samples are ready for review',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2)
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: 'current',
    content: 'Hi! I\'m available to discuss your plumbing project.',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: 'read'
  },
  {
    id: '2',
    senderId: 'current',
    receiverId: '1',
    content: 'Great! When can we schedule a consultation?',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    status: 'read'
  },
  {
    id: '3',
    senderId: '1',
    receiverId: 'current',
    content: 'I can start the plumbing work tomorrow',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    status: 'delivered'
  }
];

const mockCalls: Call[] = [
  {
    id: '1',
    type: 'video',
    participants: [{ id: '1', name: 'John Smith', avatar: '👨‍🔧', status: 'online' }],
    status: 'missed',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    duration: 0
  },
  {
    id: '2',
    type: 'audio',
    participants: [{ id: '2', name: 'Sarah Johnson', avatar: '👩‍⚡', status: 'offline' }],
    status: 'ended',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 4),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    duration: 1800,
  },
  {
    id: '3',
    type: 'video',
    participants: [{ id: '3', name: 'Emily Davis', avatar: '🎨', status: 'online' }],
    status: 'active',
    startTime: new Date(Date.now() - 1000 * 60 * 5),
    duration: 300,
    quality: 'excellent'
  }
];

export default function CommunicationHub({ initialView = 'chats' }: CommunicationHubProps) {
  const [activeView, setActiveView] = useState<'chats' | 'calls' | 'contacts'>(initialView);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callQuality, setCallQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [recordingMessage, setRecordingMessage] = useState(false);
  const [messageInputRef, setMessageInputRef] = useState<HTMLTextAreaElement | null>(null);
  const [calls, setCalls] = useState<Call[]>(mockCalls);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [showLocationSharing, setShowLocationSharing] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user location
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
          console.log('GPS access denied or unavailable - using mock location');
          // Use mock location if GPS is not available
          setUserLocation({
            lat: 40.7128,
            lng: -74.0060
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      console.log('Geolocation not supported - using mock location');
      // Use mock location if geolocation is not supported
      setUserLocation({
        lat: 40.7128,
        lng: -74.0060
      });
    }
  }, []);

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall && activeCall.status === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && selectedContact) {
        const newMsg: Message = {
          id: Date.now().toString(),
          senderId: selectedContact.id,
          receiverId: 'current',
          content: `Auto message from ${selectedContact.name}`,
          type: 'text',
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, newMsg]);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedContact]);

  // Simulate typing indicator
  useEffect(() => {
    if (selectedContact && Math.random() > 0.7) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedContact) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'current',
      receiverId: selectedContact.id,
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'delivered' as const }
            : msg
        )
      );
    }, 2000);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'read' as const }
            : msg
        )
      );
    }, 3000);
  }, [newMessage, selectedContact]);

  const handleStartCall = useCallback((contact: Contact, video: boolean = false) => {
    const call: Call = {
      id: Date.now().toString(),
      type: video ? 'video' : 'audio',
      participants: [{ id: contact.id, name: contact.name, avatar: contact.avatar }],
      status: 'outgoing',
      startTime: new Date()
    };

    setActiveCall(call);
    setIsVideoCall(video);
    setShowCallInterface(true);

    // Simulate call acceptance
    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, status: 'active' } : null);
    }, 2000);
  }, []);

  const handleEndCall = useCallback(() => {
    if (activeCall) {
      const endedCall = {
        ...activeCall,
        status: 'ended' as const,
        endTime: new Date(),
        duration: callDuration
      };
      setCalls(prev => [endedCall, ...prev]);
      setActiveCall(null);
      setShowCallInterface(false);
      setCallDuration(0);
      setIsMuted(false);
      setIsVideoOff(false);
      setIsSpeakerOn(false);
    }
  }, [activeCall, callDuration]);

  const handleShareLocation = useCallback(() => {
    if (userLocation && selectedContact) {
      const locationMessage: Message = {
        id: Date.now().toString(),
        senderId: 'current',
        receiverId: selectedContact.id,
        content: 'Live Location Shared',
        type: 'location',
        timestamp: new Date(),
        status: 'sending',
        metadata: {
          location: {
            lat: userLocation.lat,
            lng: userLocation.lng,
            address: 'Your current location'
          }
        }
      };
      setMessages(prev => [...prev, locationMessage]);
      setShowLocationSharing(false);
    }
  }, [userLocation, selectedContact]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const mins = Math.floor(diff / (1000 * 60));
      return mins === 0 ? 'Just now' : `${mins}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = messages.filter(msg =>
    msg.senderId === selectedContact?.id || msg.receiverId === selectedContact?.id
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="communication-hub"
    >
      {/* Main Interface */}
      <div className={`hub-container ${selectedContact ? 'chat-open' : ''}`}>
        {/* Sidebar */}
        <div className="hub-sidebar">
          {/* Header */}
          <div className="hub-header">
            <h2>Communication Hub</h2>
            <div className="header-actions">
              <button className="action-btn">
                <Users size={20} />
              </button>
              <button className="action-btn">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="view-tabs">
            <button 
              className={`tab-btn ${activeView === 'chats' ? 'active' : ''}`}
              onClick={() => setActiveView('chats')}
            >
              <MessageCircle size={18} />
              Chats
            </button>
            <button 
              className={`tab-btn ${activeView === 'calls' ? 'active' : ''}`}
              onClick={() => setActiveView('calls')}
            >
              <Phone size={18} />
              Calls
            </button>
            <button 
              className={`tab-btn ${activeView === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveView('contacts')}
            >
              <Users size={18} />
              Contacts
            </button>
          </div>

          {/* Search */}
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Content Based on Active View */}
          <div className="sidebar-content">
            {activeView === 'chats' && (
              <div className="chats-list">
                {filteredContacts.map(contact => (
                  <motion.div
                    key={contact.id}
                    className={`chat-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                    onClick={() => setSelectedContact(contact)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="chat-avatar">
                      <span>{contact.avatar}</span>
                      <div className={`status-indicator ${contact.status}`} />
                      {contact.isVerified && <div className="verified-badge">✓</div>}
                    </div>
                    <div className="chat-info">
                      <div className="chat-header">
                        <h3>{contact.name}</h3>
                        <span className="chat-time">
                          {contact.lastMessageTime && formatMessageTime(contact.lastMessageTime)}
                        </span>
                      </div>
                      <div className="chat-preview">
                        <p className="last-message">
                          {contact.lastMessage || 'No messages yet'}
                        </p>
                        {contact.unreadCount && contact.unreadCount > 0 && (
                          <span className="unread-count">{contact.unreadCount}</span>
                        )}
                      </div>
                    </div>
                    <div className="chat-actions">
                      <button 
                        className="quick-call"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartCall(contact, false);
                        }}
                      >
                        <Phone size={16} />
                      </button>
                      <button 
                        className="quick-video"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartCall(contact, true);
                        }}
                      >
                        <Video size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeView === 'calls' && (
              <div className="calls-list">
                <div className="calls-section">
                  <h3>Recent Calls</h3>
                  {calls.map(call => (
                    <motion.div
                      key={call.id}
                      className="call-item"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="call-avatar">
                        <span>{call.participants[0].avatar}</span>
                        <div className={`call-icon ${call.type}`}>
                          {call.type === 'video' ? <Video size={16} /> : <Phone size={16} />}
                        </div>
                      </div>
                      <div className="call-info">
                        <h4>{call.participants[0].name}</h4>
                        <div className="call-details">
                          <span className={`call-status ${call.status}`}>
                            {call.status === 'missed' ? 'Missed' : 
                             call.status === 'ended' ? 'Completed' : 
                             call.status}
                          </span>
                          {call.duration && call.duration > 0 && (
                            <span className="call-duration">
                              {formatCallDuration(call.duration)}
                            </span>
                          )}
                          {call.quality && (
                            <span className={`call-quality ${call.quality}`}>
                              {call.quality}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="call-time">
                        {call.startTime && formatMessageTime(call.startTime)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'contacts' && (
              <div className="contacts-list">
                <div className="contacts-section">
                  <h3>All Contacts</h3>
                  {filteredContacts.map(contact => (
                    <motion.div
                      key={contact.id}
                      className="contact-item"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="contact-avatar">
                        <span>{contact.avatar}</span>
                        <div className={`status-indicator ${contact.status}`} />
                        {contact.isVerified && <div className="verified-badge">✓</div>}
                      </div>
                      <div className="contact-info">
                        <h4>{contact.name}</h4>
                        <p className="contact-status">
                          {contact.status === 'online' ? 'Online' :
                           contact.status === 'away' ? 'Away' :
                           contact.status === 'busy' ? 'Busy' :
                           contact.lastSeen ? `Last seen ${formatMessageTime(contact.lastSeen)}` :
                           'Offline'}
                        </p>
                      </div>
                      <div className="contact-actions">
                        <button 
                          className="action-btn"
                          onClick={() => handleStartCall(contact, false)}
                        >
                          <Phone size={16} />
                        </button>
                        <button 
                          className="action-btn"
                          onClick={() => handleStartCall(contact, true)}
                        >
                          <Video size={16} />
                        </button>
                        <button 
                          className="action-btn"
                          onClick={() => setSelectedContact(contact)}
                        >
                          <MessageCircle size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        {selectedContact && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="chat-interface"
          >
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-contact-info">
                <button 
                  className="back-btn"
                  onClick={() => setSelectedContact(null)}
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="contact-avatar">
                  <span>{selectedContact.avatar}</span>
                  <div className={`status-indicator ${selectedContact.status}`} />
                </div>
                <div className="contact-details">
                  <h3>{selectedContact.name}</h3>
                  <p className="contact-status">
                    {selectedContact.status === 'online' ? 'Online' :
                     selectedContact.status === 'away' ? 'Away' :
                     selectedContact.status === 'busy' ? 'Busy' :
                     selectedContact.lastSeen ? `Last seen ${formatMessageTime(selectedContact.lastSeen)}` :
                     'Offline'}
                  </p>
                </div>
              </div>
              <div className="chat-actions">
                <button 
                  className="action-btn"
                  onClick={() => handleStartCall(selectedContact, false)}
                >
                  <Phone size={20} />
                </button>
                <button 
                  className="action-btn"
                  onClick={() => handleStartCall(selectedContact, true)}
                >
                  <Video size={20} />
                </button>
                <button 
                  className="action-btn"
                  onClick={() => setShowLocationSharing(true)}
                >
                  <MapPin size={20} />
                </button>
                <button className="action-btn">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              <div className="messages-list">
                {filteredMessages.map(message => (
                  <motion.div
                    key={message.id}
                    className={`message ${message.senderId === 'current' ? 'sent' : 'received'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message.type === 'text' && (
                      <div className="message-content">
                        <p>{message.content}</p>
                        <div className="message-meta">
                          <span className="message-time">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.senderId === 'current' && (
                            <span className={`message-status ${message.status}`}>
                              {message.status === 'sending' && <Clock size={12} />}
                              {message.status === 'sent' && <Check size={12} />}
                              {message.status === 'delivered' && <CheckCheck size={12} />}
                              {message.status === 'read' && <CheckCheck size={12} color="#3b82f6" />}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {message.type === 'location' && (
                      <div className="message-location">
                        <div className="location-content">
                          <MapPin size={20} />
                          <div>
                            <p>Live Location Shared</p>
                            <span className="location-address">
                              {message.metadata?.location?.address}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="typing-text">{selectedContact.name} is typing...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              <div className="input-actions">
                <button 
                  className="attach-btn"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                >
                  <Paperclip size={20} />
                </button>
                <button 
                  className="emoji-btn"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile size={20} />
                </button>
              </div>
              <textarea
                ref={setMessageInputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="input-actions">
                <button 
                  className={`record-btn ${recordingMessage ? 'recording' : ''}`}
                  onMouseDown={() => setRecordingMessage(true)}
                  onMouseUp={() => setRecordingMessage(false)}
                >
                  <Mic size={20} />
                </button>
                <button 
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send size={20} />
                </button>
              </div>

              {/* Attach Menu */}
              <AnimatePresence>
                {showAttachMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="attach-menu"
                  >
                    <button className="attach-option">
                      <Image size={20} />
                      <span>Photo/Video</span>
                    </button>
                    <button className="attach-option">
                      <FileText size={20} />
                      <span>Document</span>
                    </button>
                    <button 
                      className="attach-option"
                      onClick={handleShareLocation}
                    >
                      <MapPin size={20} />
                      <span>Location</span>
                    </button>
                    <button className="attach-option">
                      <User size={20} />
                      <span>Contact</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      {/* Call Interface */}
      <AnimatePresence>
        {showCallInterface && activeCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="call-overlay"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`call-interface ${isVideoCall ? 'video-call' : 'audio-call'}`}
            >
              {/* Video Call Background */}
              {isVideoCall && (
                <div className="video-background">
                  <div className="remote-video">
                    <div className="video-placeholder">
                      <span>{activeCall.participants[0].avatar}</span>
                      <p>{activeCall.participants[0].name}</p>
                    </div>
                  </div>
                  <div className="local-video">
                    <div className="video-placeholder small">
                      <span>You</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Call Header */}
              <div className="call-header">
                <div className="call-info">
                  <h3>{activeCall.participants[0].name}</h3>
                  <div className="call-status">
                    {activeCall.status === 'outgoing' && 'Calling...'}
                    {activeCall.status === 'incoming' && 'Incoming call...'}
                    {activeCall.status === 'active' && formatCallDuration(callDuration)}
                    {activeCall.status === 'ended' && 'Call ended'}
                  </div>
                  {callQuality && activeCall.status === 'active' && (
                    <div className={`call-quality-indicator ${callQuality}`}>
                      <Signal size={16} />
                      <span>{callQuality}</span>
                    </div>
                  )}
                </div>
                <button className="minimize-btn">
                  <Minimize2 size={20} />
                </button>
              </div>

              {/* Call Controls */}
              <div className="call-controls">
                <button 
                  className={`control-btn ${isMuted ? 'active' : ''}`}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                {isVideoCall && (
                  <button 
                    className={`control-btn ${isVideoOff ? 'active' : ''}`}
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? <CameraOff size={24} /> : <Camera size={24} />}
                  </button>
                )}
                <button 
                  className={`control-btn ${isSpeakerOn ? 'active' : ''}`}
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                >
                  {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>
                <button 
                  className="control-btn"
                  onClick={() => {/* Share screen */}}
                >
                  <Share2 size={24} />
                </button>
                <button 
                  className={`end-call-btn ${activeCall.status === 'active' ? 'active' : ''}`}
                  onClick={handleEndCall}
                >
                  <Phone size={24} />
                </button>
              </div>

              {/* Audio Call Visual */}
              {!isVideoCall && (
                <div className="audio-call-visual">
                  <div className="call-avatar-large">
                    <span>{activeCall.participants[0].avatar}</span>
                    <div className={`status-indicator ${activeCall.participants[0].status || 'online'}`} />
                  </div>
                  <div className="audio-waves">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="wave" />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Sharing Modal */}
      <AnimatePresence>
        {showLocationSharing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="location-modal"
            onClick={() => setShowLocationSharing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="location-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Share Location</h3>
              <p>Share your current location with {selectedContact?.name}</p>
              {userLocation && (
                <div className="location-preview">
                  <MapPin size={24} />
                  <span>Your current location</span>
                </div>
              )}
              <div className="location-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowLocationSharing(false)}
                >
                  Cancel
                </button>
                <button 
                  className="share-btn"
                  onClick={handleShareLocation}
                >
                  Share Location
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
