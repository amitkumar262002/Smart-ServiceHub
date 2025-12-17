import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Map, 
  Navigation, 
  MapPin, 
  Target, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Activity,
  Wifi,
  Battery,
  Signal,
  Clock,
  Users,
  Route,
  Share2,
  Download,
  Settings,
  Filter,
  Search,
  Plus,
  Minus,
  Compass,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Fullscreen,
  Smartphone,
  Globe,
  Satellite,
  MapIcon,
  Navigation2,
  AlertTriangle,
  CheckCircle,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  MessageCircle,
  Phone,
  Video,
  Camera,
  Mic,
  Volume2,
  VolumeX,
  WifiOff,
  BatteryLow
} from 'lucide-react';
import '../styles/AdvancedMapTracking.css';

interface LocationPoint {
  id: string;
  lat: number;
  lng: number;
  timestamp: Date;
  accuracy: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  type: 'current' | 'provider' | 'service_area' | 'route' | 'waypoint';
  metadata?: {
    name?: string;
    address?: string;
    status?: 'active' | 'inactive' | 'moving' | 'stopped';
    battery?: number;
    signal?: number;
    lastUpdate?: Date;
  };
}

interface TrackingSession {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  distance: number;
  duration: number;
  points: LocationPoint[];
  status: 'active' | 'paused' | 'completed';
  participants: string[];
  shared: boolean;
}

interface MapLayer {
  id: string;
  name: string;
  type: 'standard' | 'satellite' | 'terrain' | 'traffic' | 'transit';
  visible: boolean;
  opacity: number;
}

interface Provider {
  id: string;
  name: string;
  avatar: string;
  category: string;
  location: LocationPoint;
  status: 'online' | 'offline' | 'busy' | 'moving';
  serviceRadius: number;
  lastUpdate: Date;
  contact: {
    phone: string;
    email: string;
  };
  rating: number;
  verified: boolean;
}

const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'John Smith',
    avatar: '👨‍🔧',
    category: 'Plumbing',
    location: {
      id: '1',
      lat: 40.7580,
      lng: -73.9855,
      timestamp: new Date(),
      accuracy: 10,
      type: 'provider',
      metadata: {
        name: 'John Smith',
        address: '123 Main St, New York, NY',
        status: 'active'
      }
    },
    status: 'moving',
    serviceRadius: 15,
    lastUpdate: new Date(),
    contact: {
      phone: '+1 234-567-8901',
      email: 'john.smith@services.com'
    },
    rating: 4.9,
    verified: true
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: '👩‍⚡',
    category: 'Electrical',
    location: {
      id: '2',
      lat: 40.7614,
      lng: -73.9776,
      timestamp: new Date(),
      accuracy: 8,
      type: 'provider',
      metadata: {
        name: 'Sarah Johnson',
        address: '456 West 34th St, New York, NY',
        status: 'active'
      }
    },
    status: 'online',
    serviceRadius: 20,
    lastUpdate: new Date(),
    contact: {
      phone: '+1 234-567-8902',
      email: 'sarah.j@electrical.com'
    },
    rating: 4.8,
    verified: true
  }
];

const defaultMapLayers: MapLayer[] = [
  { id: '1', name: 'Standard', type: 'standard', visible: true, opacity: 1 },
  { id: '2', name: 'Satellite', type: 'satellite', visible: false, opacity: 0.8 },
  { id: '3', name: 'Traffic', type: 'traffic', visible: false, opacity: 0.7 },
  { id: '4', name: 'Transit', type: 'transit', visible: false, opacity: 0.6 }
];

export default function AdvancedMapTracking() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [trackingSessions, setTrackingSessions] = useState<TrackingSession[]>([]);
  const [activeSession, setActiveSession] = useState<TrackingSession | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 40.7128, lng: -74.0060 });
  const [mapZoom, setMapZoom] = useState(14);
  const [mapLayers, setMapLayers] = useState<MapLayer[]>(defaultMapLayers);
  const [showLayers, setShowLayers] = useState(false);
  const [showProviders, setShowProviders] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showServiceAreas, setShowServiceAreas] = useState(true);
  const [trackingActive, setTrackingActive] = useState(false);
  const [trackingPaused, setTrackingPaused] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [signalStrength, setSignalStrength] = useState<'excellent' | 'good' | 'poor' | 'none'>('excellent');
  const [batteryLevel, setBatteryLevel] = useState<number>(85);
  const [connectionSpeed, setConnectionSpeed] = useState<string>('4G');
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [trackingMode, setTrackingMode] = useState<'live' | 'route' | 'area'>('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<MapLayer | null>(null);
  const [routePoints, setRoutePoints] = useState<LocationPoint[]>([]);
  const [waypoints, setWaypoints] = useState<LocationPoint[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [mapRotation, setMapRotation] = useState(0);
  const [compassHeading, setCompassHeading] = useState(0);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location: LocationPoint = {
            id: 'current',
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date(),
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
            type: 'current'
          };
          
          setCurrentLocation(location);
          setMapCenter({ lat: location.lat, lng: location.lng });
          setGpsAccuracy(location.accuracy);
          setSignalStrength('excellent');
          
          // Update compass heading
          if (position.coords.heading !== null) {
            setCompassHeading(position.coords.heading);
          }
          
          // Add to active tracking session
          if (trackingActive && !trackingPaused && activeSession) {
            const updatedSession = {
              ...activeSession,
              points: [...activeSession.points, location],
              distance: calculateDistance(activeSession.points.concat([location])),
              duration: Math.floor((Date.now() - activeSession.startTime.getTime()) / 1000)
            };
            setActiveSession(updatedSession);
          }
        },
        (error) => {
          console.log('GPS access denied or unavailable - using mock location');
          setSignalStrength('none');
          // Use mock location if GPS is not available
          const mockLocation: LocationPoint = {
            id: 'current',
            lat: 40.7128,
            lng: -74.0060,
            timestamp: new Date(),
            accuracy: 50,
            type: 'current'
          };
          setCurrentLocation(mockLocation);
          setMapCenter({ lat: mockLocation.lat, lng: mockLocation.lng });
          setGpsAccuracy(mockLocation.accuracy);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000 // Allow cached position up to 1 minute old
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.log('Geolocation not supported - using mock location');
      // Use mock location if geolocation is not supported
      const mockLocation: LocationPoint = {
        id: 'current',
        lat: 40.7128,
        lng: -74.0060,
        timestamp: new Date(),
        accuracy: 50,
        type: 'current'
      };
      setCurrentLocation(mockLocation);
      setMapCenter({ lat: mockLocation.lat, lng: mockLocation.lng });
      setGpsAccuracy(mockLocation.accuracy);
    }
  }, [trackingActive, trackingPaused, activeSession]);

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

  // Simulate provider movement
  useEffect(() => {
    const interval = setInterval(() => {
      setProviders(prev => prev.map(provider => {
        if (provider.status === 'moving' && Math.random() > 0.7) {
          const newLat = provider.location.lat + (Math.random() - 0.5) * 0.001;
          const newLng = provider.location.lng + (Math.random() - 0.5) * 0.001;
          
          return {
            ...provider,
            location: {
              ...provider.location,
              lat: newLat,
              lng: newLng,
              timestamp: new Date()
            }
          };
        }
        return provider;
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate distance between points
  const calculateDistance = (points: LocationPoint[]): number => {
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const R = 6371; // Earth's radius in km
      const dLat = (curr.lat - prev.lat) * Math.PI / 180;
      const dLng = (curr.lng - prev.lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(prev.lat * Math.PI / 180) * Math.cos(curr.lat * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistance += R * c;
    }
    return totalDistance;
  };

  // Start tracking session
  const startTracking = useCallback(() => {
    const session: TrackingSession = {
      id: Date.now().toString(),
      name: `Tracking Session ${trackingSessions.length + 1}`,
      startTime: new Date(),
      distance: 0,
      duration: 0,
      points: currentLocation ? [currentLocation] : [],
      status: 'active',
      participants: [],
      shared: false
    };
    
    setActiveSession(session);
    setTrackingSessions(prev => [session, ...prev]);
    setTrackingActive(true);
    setTrackingPaused(false);
    setIsRecording(true);
  }, [currentLocation, trackingSessions]);

  // Pause/Resume tracking
  const toggleTrackingPause = useCallback(() => {
    setTrackingPaused(prev => !prev);
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        status: trackingPaused ? 'active' : 'paused'
      });
    }
  }, [trackingPaused, activeSession]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (activeSession) {
      const completedSession = {
        ...activeSession,
        endTime: new Date(),
        status: 'completed' as const
      };
      
      setTrackingSessions(prev => 
        prev.map(session => 
          session.id === activeSession.id ? completedSession : session
        )
      );
      
      setActiveSession(null);
      setTrackingActive(false);
      setTrackingPaused(false);
      setIsRecording(false);
    }
  }, [activeSession]);

  // Share location
  const shareLocation = useCallback(() => {
    if (currentLocation) {
      const shareData = {
        title: 'My Current Location',
        text: `Check out my current location: ${currentLocation.lat}, ${currentLocation.lng}`,
        url: `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`
      };
      
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.url);
      }
    }
  }, [currentLocation]);

  // Center map on current location
  const centerOnLocation = useCallback(() => {
    if (currentLocation) {
      setMapCenter({ lat: currentLocation.lat, lng: currentLocation.lng });
      setMapZoom(16);
    }
  }, [currentLocation]);

  // Toggle layer visibility
  const toggleLayer = useCallback((layerId: string) => {
    setMapLayers(prev => 
      prev.map((layer: MapLayer) => 
        layer.id === layerId 
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
  }, []);

  // Format duration
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Format distance
  const formatDistance = (km: number): string => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    } else {
      return `${km.toFixed(2)}km`;
    }
  };

  // Get signal strength indicator
  const getSignalIcon = () => {
    switch (signalStrength) {
      case 'excellent':
        return <Signal className="signal-excellent" size={20} />;
      case 'good':
        return <Signal className="signal-good" size={20} />;
      case 'poor':
        return <Signal className="signal-poor" size={20} />;
      case 'none':
        return <WifiOff size={20} />;
      default:
        return <Signal size={20} />;
    }
  };

  // Get battery icon
  const getBatteryIcon = () => {
    if (batteryLevel > 60) {
      return <Battery className="battery-good" size={20} />;
    } else if (batteryLevel > 20) {
      return <Battery className="battery-medium" size={20} />;
    } else {
      return <BatteryLow className="battery-low" size={20} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`advanced-map-tracking ${showFullscreen ? 'fullscreen' : ''}`}
    >
      {/* Map Container */}
      <div className="map-container" ref={mapRef}>
        {/* Map View */}
        <div className="map-view">
          {/* Simulated Map */}
          <div 
            className="map-surface"
            style={{
              transform: `scale(${1 + (mapZoom - 14) * 0.1}) rotate(${mapRotation}deg)`,
              background: mapStyle === 'satellite' 
                ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                : mapStyle === 'terrain'
                ? 'linear-gradient(135deg, #8b7355 0%, #a0826d 100%)'
                : 'linear-gradient(135deg, #e8f4f8 0%, #d1e7dd 100%)'
            }}
          >
            {/* Current Location */}
            {currentLocation && (
              <motion.div
                className="current-location-marker"
                style={{
                  left: `${50 + (currentLocation.lng - mapCenter.lng) * 1000}%`,
                  top: `${50 - (currentLocation.lat - mapCenter.lat) * 1000}%`
                }}
                animate={{
                  scale: trackingActive ? [1, 1.2, 1] : 1
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <div className="location-dot">
                  <Target size={24} />
                  {gpsAccuracy && (
                    <div 
                      className="accuracy-circle"
                      style={{
                        width: `${gpsAccuracy * 2}px`,
                        height: `${gpsAccuracy * 2}px`
                      }}
                    />
                  )}
                </div>
              </motion.div>
            )}

            {/* Provider Markers */}
            {showProviders && providers.map(provider => (
              <motion.div
                key={provider.id}
                className={`provider-marker ${provider.status}`}
                style={{
                  left: `${50 + (provider.location.lng - mapCenter.lng) * 1000}%`,
                  top: `${50 - (provider.location.lat - mapCenter.lat) * 1000}%`
                }}
                whileHover={{ scale: 1.2 }}
                onClick={() => setSelectedProvider(provider)}
              >
                <div className="provider-avatar">
                  <span>{provider.avatar}</span>
                  <div className={`status-dot ${provider.status}`} />
                </div>
                
                {/* Service Area */}
                {showServiceAreas && (
                  <div 
                    className="service-area"
                    style={{
                      width: `${provider.serviceRadius * 100}px`,
                      height: `${provider.serviceRadius * 100}px`
                    }}
                  />
                )}
              </motion.div>
            ))}

            {/* Route Lines */}
            {showRoutes && routePoints.length > 1 && (
              <svg className="route-overlay">
                <polyline
                  points={routePoints.map(point => 
                    `${50 + (point.lng - mapCenter.lng) * 1000},${50 - (point.lat - mapCenter.lat) * 1000}`
                  ).join(' ')}
                  fill="none"
                  stroke="#667eea"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
              </svg>
            )}

            {/* Waypoints */}
            {waypoints.map((waypoint, index) => (
              <div
                key={waypoint.id}
                className="waypoint-marker"
                style={{
                  left: `${50 + (waypoint.lng - mapCenter.lng) * 1000}%`,
                  top: `${50 - (waypoint.lat - mapCenter.lat) * 1000}%`
                }}
              >
                <div className="waypoint-number">{index + 1}</div>
              </div>
            ))}

            {/* Compass */}
            <div 
              className="compass"
              style={{ transform: `rotate(${compassHeading}deg)` }}
            >
              <Compass size={40} />
              <div className="compass-needle" />
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="map-controls">
          {/* Zoom Controls */}
          <div className="zoom-controls">
            <button 
              className="control-btn"
              onClick={() => setMapZoom(prev => Math.min(20, prev + 1))}
            >
              <Plus size={20} />
            </button>
            <button 
              className="control-btn"
              onClick={() => setMapZoom(prev => Math.max(1, prev - 1))}
            >
              <Minus size={20} />
            </button>
          </div>

          {/* Layer Controls */}
          <div className="layer-controls">
            <button 
              className={`control-btn ${showLayers ? 'active' : ''}`}
              onClick={() => setShowLayers(!showLayers)}
            >
              <Layers size={20} />
            </button>
            <button 
              className={`control-btn ${showProviders ? 'active' : ''}`}
              onClick={() => setShowProviders(!showProviders)}
            >
              <Users size={20} />
            </button>
            <button 
              className={`control-btn ${showRoutes ? 'active' : ''}`}
              onClick={() => setShowRoutes(!showRoutes)}
            >
              <Route size={20} />
            </button>
            <button 
              className={`control-btn ${showServiceAreas ? 'active' : ''}`}
              onClick={() => setShowServiceAreas(!showServiceAreas)}
            >
              <Target size={20} />
            </button>
          </div>

          {/* View Controls */}
          <div className="view-controls">
            <button 
              className="control-btn"
              onClick={centerOnLocation}
            >
              <Navigation2 size={20} />
            </button>
            <button 
              className="control-btn"
              onClick={() => setMapRotation(prev => prev + 90)}
            >
              <RotateCw size={20} />
            </button>
            <button 
              className={`control-btn ${showFullscreen ? 'active' : ''}`}
              onClick={() => setShowFullscreen(!showFullscreen)}
            >
              <Fullscreen size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-input-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search location, provider, or address..."
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
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-left">
            <div className="status-item">
              {getSignalIcon()}
              <span>{connectionSpeed}</span>
            </div>
            <div className="status-item">
              {getBatteryIcon()}
              <span>{batteryLevel}%</span>
            </div>
            {gpsAccuracy && (
              <div className="status-item">
                <Target size={16} />
                <span>±{Math.round(gpsAccuracy)}m</span>
              </div>
            )}
          </div>
          <div className="status-right">
            <div className="status-item">
              <MapPin size={16} />
              <span>{mapZoom}z</span>
            </div>
            <div className="status-item">
              <Clock size={16} />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="side-panel">
        {/* Tracking Controls */}
        <div className="tracking-controls">
          <h3>Live Tracking</h3>
          {!trackingActive ? (
            <button 
              className="start-tracking-btn"
              onClick={startTracking}
            >
              <Play size={20} />
              Start Tracking
            </button>
          ) : (
            <div className="tracking-active">
              <div className="tracking-info">
                <div className="tracking-status">
                  <div className={`status-indicator ${trackingPaused ? 'paused' : 'active'}`} />
                  <span>{trackingPaused ? 'Paused' : 'Recording'}</span>
                </div>
                {activeSession && (
                  <div className="tracking-stats">
                    <div className="stat">
                      <span className="stat-label">Distance</span>
                      <span className="stat-value">{formatDistance(activeSession.distance)}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Duration</span>
                      <span className="stat-value">{formatDuration(activeSession.duration)}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Points</span>
                      <span className="stat-value">{activeSession.points.length}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="tracking-actions">
                <button 
                  className="control-btn"
                  onClick={toggleTrackingPause}
                >
                  {trackingPaused ? <Play size={20} /> : <Pause size={20} />}
                </button>
                <button 
                  className="control-btn"
                  onClick={stopTracking}
                >
                  <Square size={20} />
                </button>
                <button 
                  className="control-btn"
                  onClick={shareLocation}
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Map Style Selector */}
        <div className="map-style-selector">
          <h3>Map Style</h3>
          <div className="style-options">
            {[
              { id: 'standard', name: 'Standard', icon: MapIcon },
              { id: 'satellite', name: 'Satellite', icon: Satellite },
              { id: 'terrain', name: 'Terrain', icon: Globe }
            ].map(style => (
              <button
                key={style.id}
                className={`style-option ${mapStyle === style.id ? 'active' : ''}`}
                onClick={() => setMapStyle(style.id as any)}
              >
                <style.icon size={20} />
                <span>{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Layer Panel */}
        <AnimatePresence>
          {showLayers && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="layer-panel"
            >
              <h3>Map Layers</h3>
              <div className="layer-list">
                {mapLayers.map(layer => (
                  <div key={layer.id} className="layer-item">
                    <label className="layer-toggle">
                      <input
                        type="checkbox"
                        checked={layer.visible}
                        onChange={() => toggleLayer(layer.id)}
                      />
                      <span className="layer-name">{layer.name}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={layer.opacity}
                      onChange={(e) => {
                        const newOpacity = parseFloat(e.target.value);
                        setMapLayers(prev => 
                          prev.map(l => 
                            l.id === layer.id ? { ...l, opacity: newOpacity } : l
                          )
                        );
                      }}
                      className="opacity-slider"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Provider List */}
        <div className="provider-list">
          <h3>Nearby Providers</h3>
          <div className="providers">
            {providers.map(provider => (
              <motion.div
                key={provider.id}
                className={`provider-card ${selectedProvider?.id === provider.id ? 'selected' : ''}`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedProvider(provider)}
              >
                <div className="provider-info">
                  <div className="provider-avatar">
                    <span>{provider.avatar}</span>
                    <div className={`status-dot ${provider.status}`} />
                  </div>
                  <div className="provider-details">
                    <h4>{provider.name}</h4>
                    <p>{provider.category}</p>
                    <div className="provider-meta">
                      <span className="rating">⭐ {provider.rating}</span>
                      <span className="distance">
                        {currentLocation && 
                          formatDistance(
                            calculateDistance([
                              currentLocation,
                              provider.location
                            ])
                          )
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="provider-actions">
                  <button className="action-btn">
                    <Phone size={16} />
                  </button>
                  <button className="action-btn">
                    <MessageCircle size={16} />
                  </button>
                  <button className="action-btn">
                    <Navigation2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tracking Sessions */}
        {trackingSessions.length > 0 && (
          <div className="tracking-sessions">
            <h3>Tracking History</h3>
            <div className="sessions-list">
              {trackingSessions.slice(0, 5).map(session => (
                <div key={session.id} className="session-item">
                  <div className="session-info">
                    <h4>{session.name}</h4>
                    <p>{formatDistance(session.distance)} • {formatDuration(session.duration)}</p>
                    <span className={`session-status ${session.status}`}>
                      {session.status === 'active' ? '🔴 Live' :
                       session.status === 'paused' ? '⏸️ Paused' :
                       '✅ Completed'}
                    </span>
                  </div>
                  <div className="session-actions">
                    <button className="action-btn">
                      <Download size={16} />
                    </button>
                    <button className="action-btn">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Provider Detail Modal */}
      <AnimatePresence>
        {selectedProvider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="provider-modal"
            onClick={() => setSelectedProvider(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="provider-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="provider-header">
                <div className="provider-avatar-large">
                  <span>{selectedProvider.avatar}</span>
                  <div className={`status-dot ${selectedProvider.status}`} />
                </div>
                <div className="provider-details">
                  <h3>{selectedProvider.name}</h3>
                  <p>{selectedProvider.category}</p>
                  <div className="provider-rating">
                    ⭐ {selectedProvider.rating} • {selectedProvider.verified ? '✓ Verified' : ''}
                  </div>
                </div>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedProvider(null)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="provider-location">
                <h4>Current Location</h4>
                <p>{selectedProvider.location.metadata?.address}</p>
                <div className="location-stats">
                  <div className="stat">
                    <span>Distance</span>
                    <span>
                      {currentLocation && 
                        formatDistance(
                          calculateDistance([
                            currentLocation,
                            selectedProvider.location
                          ])
                        )
                      }
                    </span>
                  </div>
                  <div className="stat">
                    <span>Service Area</span>
                    <span>{selectedProvider.serviceRadius}km</span>
                  </div>
                  <div className="stat">
                    <span>Last Update</span>
                    <span>{formatDuration(Math.floor((Date.now() - selectedProvider.lastUpdate.getTime()) / 1000))} ago</span>
                  </div>
                </div>
              </div>
              
              <div className="provider-contact">
                <h4>Contact</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>{selectedProvider.contact.phone}</span>
                  </div>
                  <div className="contact-item">
                    <MessageCircle size={16} />
                    <span>{selectedProvider.contact.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="provider-actions">
                <button className="action-btn primary">
                  <Navigation2 size={20} />
                  Get Directions
                </button>
                <button className="action-btn">
                  <Phone size={20} />
                  Call
                </button>
                <button className="action-btn">
                  <MessageCircle size={20} />
                  Message
                </button>
                <button className="action-btn">
                  <Video size={20} />
                  Video Call
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
