import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Phone, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff, 
  Maximize2, 
  Minimize2, 
  Settings, 
  Users, 
  MessageSquare, 
  Share2, 
  Circle,
  Camera, 
  CameraOff, 
  Volume2, 
  VolumeX, 
  Wifi, 
  Battery, 
  Signal, 
  Clock, 
  ArrowLeft, 
  X, 
  Plus, 
  Grid3X3, 
  User, 
  MoreVertical, 
  ScreenShare, 
  Pause, 
  Play, 
  Square, 
  Star, 
  Heart, 
  Send, 
  Paperclip, 
  Smile, 
  Download, 
  Upload, 
  Image, 
  FileText, 
  Zap, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Radio, 
  Settings2, 
  Eye, 
  EyeOff, 
  WifiOff, 
  BatteryLow
} from 'lucide-react';
import '../styles/RealVideoCall.css';

interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor';
  batteryLevel?: number;
  signalStrength?: 'excellent' | 'good' | 'poor' | 'none';
  role: 'host' | 'participant' | 'moderator';
  isSpeaking?: boolean;
  audioLevel?: number;
}

interface CallMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'file' | 'image';
}

interface CallSettings {
  videoQuality: 'auto' | '360p' | '720p' | '1080p' | '4k';
  audioQuality: 'low' | 'standard' | 'high';
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  hdVideo: boolean;
  virtualBackground: string;
  frameRate: 24 | 30 | 60;
}

interface CallStats {
  duration: number;
  dataUsage: {
    sent: number;
    received: number;
  };
  connectionQuality: 'excellent' | 'good' | 'poor';
  packetLoss: number;
  latency: number;
  bandwidth: {
    upload: number;
    download: number;
  };
}

const mockParticipants: CallParticipant[] = [
  {
    id: '1',
    name: 'John Smith',
    avatar: '👨‍🔧',
    isMuted: false,
    isVideoOff: false,
    isScreenSharing: false,
    connectionQuality: 'excellent',
    batteryLevel: 85,
    signalStrength: 'excellent',
    role: 'host',
    isSpeaking: false,
    audioLevel: 0.3
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: '👩‍⚡',
    isMuted: true,
    isVideoOff: false,
    isScreenSharing: false,
    connectionQuality: 'good',
    batteryLevel: 67,
    signalStrength: 'good',
    role: 'participant',
    isSpeaking: false,
    audioLevel: 0.1
  },
  {
    id: '3',
    name: 'Emily Davis',
    avatar: '🎨',
    isMuted: false,
    isVideoOff: true,
    isScreenSharing: false,
    connectionQuality: 'excellent',
    batteryLevel: 92,
    signalStrength: 'excellent',
    role: 'participant',
    isSpeaking: true,
    audioLevel: 0.7
  }
];

const virtualBackgrounds = [
  { id: 'none', name: 'None', url: '' },
  { id: 'blur', name: 'Blur', url: '' },
  { id: 'office', name: 'Office', url: '/backgrounds/office.jpg' },
  { id: 'nature', name: 'Nature', url: '/backgrounds/nature.jpg' },
  { id: 'abstract', name: 'Abstract', url: '/backgrounds/abstract.jpg' }
];

export default function RealVideoCall() {
  const { callId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended' | 'reconnecting'>('connecting');
  const [participants, setParticipants] = useState<CallParticipant[]>(mockParticipants);
  const [currentParticipant, setCurrentParticipant] = useState<CallParticipant>(mockParticipants[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'speaker' | 'focus'>('grid');
  const [messages, setMessages] = useState<CallMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [callSettings, setCallSettings] = useState<CallSettings>({
    videoQuality: 'auto',
    audioQuality: 'high',
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    hdVideo: true,
    virtualBackground: 'none',
    frameRate: 30
  });
  const [callStats, setCallStats] = useState<CallStats>({
    duration: 0,
    dataUsage: { sent: 0, received: 0 },
    connectionQuality: 'excellent',
    packetLoss: 0.1,
    latency: 25,
    bandwidth: { upload: 2.5, download: 5.2 }
  });
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [signalStrength, setSignalStrength] = useState<'excellent' | 'good' | 'poor' | 'none'>('excellent');
  const [connectionSpeed, setConnectionSpeed] = useState('5G');

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
        setCallStats(prev => ({
          ...prev,
          duration: prev.duration + 1,
          dataUsage: {
            sent: prev.dataUsage.sent + Math.random() * 0.1,
            received: prev.dataUsage.received + Math.random() * 0.2
          }
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Simulate call connection
  useEffect(() => {
    setTimeout(() => {
      setCallStatus('connected');
    }, 2000);
  }, []);

  // Simulate participant audio levels
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants(prev => prev.map(participant => ({
        ...participant,
        isSpeaking: Math.random() > 0.8,
        audioLevel: Math.random()
      })));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Get battery level
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleEndCall = useCallback(() => {
    setCallStatus('ended');
    setTimeout(() => {
      navigate('/communication-hub');
    }, 1000);
  }, [navigate]);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    setParticipants(prev => prev.map(p => 
      p.id === currentParticipant.id 
        ? { ...p, isMuted: !isMuted }
        : p
    ));
  }, [isMuted, currentParticipant.id]);

  const handleToggleVideo = useCallback(() => {
    setIsVideoOff(prev => !prev);
    setParticipants(prev => prev.map(p => 
      p.id === currentParticipant.id 
        ? { ...p, isVideoOff: !isVideoOff }
        : p
    ));
  }, [isVideoOff, currentParticipant.id]);

  const handleToggleScreenShare = useCallback(() => {
    setIsScreenSharing(prev => !prev);
    setParticipants(prev => prev.map(p => 
      p.id === currentParticipant.id 
        ? { ...p, isScreenSharing: !isScreenSharing }
        : p
    ));
  }, [isScreenSharing, currentParticipant.id]);

  const handleToggleRecording = useCallback(() => {
    setIsRecording(prev => !prev);
    if (!isRecording) {
      // Start recording
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderId: 'system',
        senderName: 'System',
        content: 'Recording started',
        timestamp: new Date(),
        type: 'system'
      }]);
    } else {
      // Stop recording
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderId: 'system',
        senderName: 'System',
        content: 'Recording stopped and saved',
        timestamp: new Date(),
        type: 'system'
      }]);
    }
  }, [isRecording]);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;

    const message: CallMessage = {
      id: Date.now().toString(),
      senderId: currentParticipant.id,
      senderName: currentParticipant.name,
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  }, [newMessage, currentParticipant]);

  const handleToggleSpeaker = useCallback(() => {
    setIsSpeakerOn(prev => !prev);
  }, []);

  const handleLayoutChange = useCallback((newLayout: 'grid' | 'speaker' | 'focus') => {
    setLayout(newLayout);
  }, []);

  const formatCallDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const formatDataUsage = (bytes: number): string => {
    if (bytes < 1024) return `${bytes.toFixed(1)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getConnectionQualityColor = (quality: string): string => {
    switch (quality) {
      case 'excellent': return '#10b981';
      case 'good': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSignalIcon = () => {
    switch (signalStrength) {
      case 'excellent': return <Signal className="signal-excellent" size={16} />;
      case 'good': return <Signal className="signal-good" size={16} />;
      case 'poor': return <Signal className="signal-poor" size={16} />;
      case 'none': return <WifiOff size={16} />;
      default: return <Signal size={16} />;
    }
  };

  const getBatteryIcon = () => {
    if (batteryLevel > 60) {
      return <Battery className="battery-good" size={16} />;
    } else if (batteryLevel > 20) {
      return <Battery className="battery-medium" size={16} />;
    } else {
      return <BatteryLow className="battery-low" size={16} />;
    }
  };

  const activeParticipants = participants.filter(p => !p.isVideoOff || !p.isMuted);
  const screenSharingParticipant = participants.find(p => p.isScreenSharing);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`real-video-call ${isFullscreen ? 'fullscreen' : ''}`}
    >
      {/* Call Header */}
      <div className="call-header">
        <div className="call-info">
          <button 
            className="back-btn"
            onClick={handleEndCall}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="call-details">
            <h3>Video Call</h3>
            <div className="call-meta">
              <span className={`call-status ${callStatus}`}>
                {callStatus === 'connecting' ? 'Connecting...' :
                 callStatus === 'connected' ? formatCallDuration(callDuration) :
                 callStatus === 'reconnecting' ? 'Reconnecting...' :
                 'Call Ended'}
              </span>
              <span className="participant-count">
                {participants.length} participants
              </span>
              {isRecording && (
                <span className="recording-indicator">
                  <Circle size={14} />
                  Recording
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="call-controls-header">
          <div className="connection-status">
            {getSignalIcon()}
            <span>{connectionSpeed}</span>
          </div>
          <div className="battery-status">
            {getBatteryIcon()}
            <span>{batteryLevel}%</span>
          </div>
          <button 
            className={`control-btn ${showStats ? 'active' : ''}`}
            onClick={() => setShowStats(!showStats)}
          >
            <Activity size={20} />
          </button>
          <button 
            className={`control-btn ${isFullscreen ? 'active' : ''}`}
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      {/* Main Call Area */}
      <div className="call-main">
        {/* Video Grid */}
        <div className={`video-grid layout-${layout}`}>
          {/* Screen Share */}
          {screenSharingParticipant && (
            <div className="video-container screen-share main">
              <video
                ref={screenShareRef}
                autoPlay
                playsInline
                className="video-element"
              />
              <div className="participant-overlay">
                <div className="participant-info">
                  <span className="participant-name">
                    {screenSharingParticipant.name}'s Screen
                  </span>
                  <div className="participant-status">
                    <ScreenShare size={16} />
                    <span>Sharing</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Speaker (Focus/Speaker View) */}
          {(layout === 'speaker' || layout === 'focus') && !screenSharingParticipant && (
            <div className="video-container main">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="video-element"
              />
              <div className="participant-overlay">
                <div className="participant-info">
                  <span className="participant-name">
                    {participants[1]?.name || 'Participant'}
                  </span>
                  <div className="participant-status">
                    {participants[1]?.isMuted && <MicOff size={16} />}
                    {participants[1]?.isSpeaking && (
                      <div className="speaking-indicator" />
                    )}
                  </div>
                </div>
                <div className="quality-indicator">
                  <div 
                    className="quality-dot"
                    style={{ backgroundColor: getConnectionQualityColor(participants[1]?.connectionQuality || 'good') }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Participant Videos */}
          <div className={`participants-grid ${layout}`}>
            {participants.map(participant => (
              <div
                key={participant.id}
                className={`video-container ${participant.id === currentParticipant.id ? 'self' : ''} ${participant.isSpeaking ? 'speaking' : ''}`}
              >
                {participant.isVideoOff ? (
                  <div className="video-placeholder">
                    <span className="participant-avatar">{participant.avatar}</span>
                    <span className="participant-name">{participant.name}</span>
                    {participant.isMuted && <MicOff size={24} />}
                  </div>
                ) : (
                  <video
                    autoPlay
                    playsInline
                    className="video-element"
                    muted={participant.id === currentParticipant.id}
                  />
                )}
                
                <div className="participant-overlay">
                  <div className="participant-info">
                    <span className="participant-name">{participant.name}</span>
                    <div className="participant-status">
                      {participant.isMuted && <MicOff size={14} />}
                      {participant.role === 'host' && <Star size={14} />}
                      {participant.isSpeaking && (
                        <div className="speaking-indicator" />
                      )}
                    </div>
                  </div>
                  <div className="connection-quality">
                    <div 
                      className="quality-dot"
                      style={{ backgroundColor: getConnectionQualityColor(participant.connectionQuality) }}
                    />
                  </div>
                </div>

                {/* Audio Level Indicator */}
                {participant.isSpeaking && (
                  <div className="audio-level-indicator">
                    <div 
                      className="audio-bar"
                      style={{ height: `${participant.audioLevel ? participant.audioLevel * 100 : 0}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Side Panels */}
        <div className="side-panels">
          {/* Participants Panel */}
          <AnimatePresence>
            {showParticipants && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="participants-panel"
              >
                <div className="panel-header">
                  <h3>Participants ({participants.length})</h3>
                  <button 
                    className="close-btn"
                    onClick={() => setShowParticipants(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="participants-list">
                  {participants.map(participant => (
                    <div key={participant.id} className="participant-item">
                      <div className="participant-avatar">
                        <span>{participant.avatar}</span>
                        {participant.isSpeaking && (
                          <div className="speaking-ring" />
                        )}
                      </div>
                      <div className="participant-details">
                        <div className="participant-name-row">
                          <span className="name">{participant.name}</span>
                          {participant.role === 'host' && <Star size={14} className="host-badge" />}
                        </div>
                        <div className="participant-status">
                          {participant.isMuted && <MicOff size={14} />}
                          {participant.isVideoOff && <VideoOff size={14} />}
                          {participant.isScreenSharing && <ScreenShare size={14} />}
                        </div>
                      </div>
                      <div className="participant-actions">
                        <button className="action-btn">
                          <Volume2 size={16} />
                        </button>
                        <button className="action-btn">
                          <Video size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Panel */}
          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="chat-panel"
              >
                <div className="panel-header">
                  <h3>Chat</h3>
                  <button 
                    className="close-btn"
                    onClick={() => setShowChat(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="messages-container" ref={messagesContainerRef}>
                  {messages.map(message => (
                    <div key={message.id} className={`message ${message.type}`}>
                      {message.type === 'system' ? (
                        <div className="system-message">
                          <span>{message.content}</span>
                          <span className="timestamp">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      ) : (
                        <div className="user-message">
                          <div className="message-header">
                            <span className="sender">{message.senderName}</span>
                            <span className="timestamp">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="message-content">{message.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="message-input-container">
                  <button className="attach-btn">
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="message-input"
                  />
                  <button 
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="settings-panel"
              >
                <div className="panel-header">
                  <h3>Settings</h3>
                  <button 
                    className="close-btn"
                    onClick={() => setShowSettings(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="settings-content">
                  {/* Video Settings */}
                  <div className="settings-section">
                    <h4>Video</h4>
                    <div className="setting-item">
                      <label>Quality</label>
                      <select 
                        value={callSettings.videoQuality}
                        onChange={(e) => setCallSettings(prev => ({
                          ...prev,
                          videoQuality: e.target.value as any
                        }))}
                        className="setting-select"
                      >
                        <option value="auto">Auto</option>
                        <option value="360p">360p</option>
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                        <option value="4k">4K</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <label>Frame Rate</label>
                      <select 
                        value={callSettings.frameRate}
                        onChange={(e) => setCallSettings(prev => ({
                          ...prev,
                          frameRate: parseInt(e.target.value) as 24 | 30 | 60
                        }))}
                        className="setting-select"
                      >
                        <option value="24">24 FPS</option>
                        <option value="30">30 FPS</option>
                        <option value="60">60 FPS</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <label>Virtual Background</label>
                      <select 
                        value={callSettings.virtualBackground}
                        onChange={(e) => setCallSettings(prev => ({
                          ...prev,
                          virtualBackground: e.target.value
                        }))}
                        className="setting-select"
                      >
                        {virtualBackgrounds.map(bg => (
                          <option key={bg.id} value={bg.id}>{bg.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Audio Settings */}
                  <div className="settings-section">
                    <h4>Audio</h4>
                    <div className="setting-item">
                      <label>Quality</label>
                      <select 
                        value={callSettings.audioQuality}
                        onChange={(e) => setCallSettings(prev => ({
                          ...prev,
                          audioQuality: e.target.value as any
                        }))}
                        className="setting-select"
                      >
                        <option value="low">Low</option>
                        <option value="standard">Standard</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="setting-toggle">
                      <label>Echo Cancellation</label>
                      <input
                        type="checkbox"
                        checked={callSettings.echoCancellation}
                        onChange={(e) => setCallSettings(prev => ({
                          ...prev,
                          echoCancellation: e.target.checked
                        }))}
                      />
                    </div>
                    <div className="setting-toggle">
                      <label>Noise Suppression</label>
                      <input
                        type="checkbox"
                        checked={callSettings.noiseSuppression}
                        onChange={(e) => setCallSettings(prev => ({
                          ...prev,
                          noiseSuppression: e.target.checked
                        }))}
                      />
                    </div>
                    <div className="setting-toggle">
                      <label>Auto Gain Control</label>
                      <input
                        type="checkbox"
                        checked={callSettings.autoGainControl}
                        onChange={(e) => setCallSettings(prev => ({
                          ...prev,
                          autoGainControl: e.target.checked
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Call Controls */}
      <div className="call-controls">
        <div className="controls-left">
          <button 
            className={`control-btn ${layout === 'grid' ? 'active' : ''}`}
            onClick={() => handleLayoutChange('grid')}
          >
            <Grid3X3 size={20} />
          </button>
          <button 
            className={`control-btn ${layout === 'speaker' ? 'active' : ''}`}
            onClick={() => handleLayoutChange('speaker')}
          >
            <User size={20} />
          </button>
          <button 
            className={`control-btn ${showParticipants ? 'active' : ''}`}
            onClick={() => setShowParticipants(!showParticipants)}
          >
            <Users size={20} />
          </button>
          <button 
            className={`control-btn ${showChat ? 'active' : ''}`}
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare size={20} />
          </button>
        </div>

        <div className="controls-center">
          <button 
            className={`control-btn ${isMuted ? 'active' : ''}`}
            onClick={handleToggleMute}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button 
            className={`control-btn ${isVideoOff ? 'active' : ''}`}
            onClick={handleToggleVideo}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>
          <button 
            className={`control-btn ${isScreenSharing ? 'active' : ''}`}
            onClick={handleToggleScreenShare}
          >
            {isScreenSharing ? <MonitorOff size={24} /> : <Monitor size={24} />}
          </button>
          <button 
            className={`control-btn ${isRecording ? 'active' : ''}`}
            onClick={handleToggleRecording}
          >
            <Circle size={24} />
          </button>
          <button 
            className={`end-call-btn ${callStatus === 'connected' ? 'active' : ''}`}
            onClick={handleEndCall}
          >
            <Phone size={24} />
          </button>
        </div>

        <div className="controls-right">
          <button 
            className={`control-btn ${!isSpeakerOn ? 'active' : ''}`}
            onClick={handleToggleSpeaker}
          >
            {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button 
            className={`control-btn ${showSettings ? 'active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Call Stats Overlay */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="call-stats-overlay"
          >
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Duration</span>
                <span className="stat-value">{formatCallDuration(callStats.duration)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Upload</span>
                <span className="stat-value">{formatDataUsage(callStats.dataUsage.sent)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Download</span>
                <span className="stat-value">{formatDataUsage(callStats.dataUsage.received)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Quality</span>
                <span 
                  className="stat-value"
                  style={{ color: getConnectionQualityColor(callStats.connectionQuality) }}
                >
                  {callStats.connectionQuality}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Latency</span>
                <span className="stat-value">{callStats.latency}ms</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Packet Loss</span>
                <span className="stat-value">{(callStats.packetLoss * 100).toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Status */}
      {callStatus === 'reconnecting' && (
        <div className="connection-status-overlay">
          <div className="status-content">
            <AlertTriangle size={48} />
            <h3>Connection Lost</h3>
            <p>Attempting to reconnect...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
