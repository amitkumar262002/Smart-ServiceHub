import React, { useState, useEffect, useRef } from 'react'
import './LiveChat.css'

interface ChatMessage {
  id: number
  text: string
  sender: 'user' | 'agent' | 'bot'
  timestamp: Date
  type: 'text' | 'file' | 'image' | 'quick-reply' | 'typing'
  reactions?: { emoji: string; count: number }[]
  read?: boolean
}

interface ChatAgent {
  id: number
  name: string
  avatar: string
  department: string
  rating: number
  status: 'online' | 'busy' | 'offline'
  languages: string[]
  avgResponseTime: string
  solvedTickets: number
}

interface QuickReply {
  id: number
  text: string
  action: string
}

const LiveChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<ChatAgent | null>(null)
  const [chatStatus, setChatStatus] = useState<'connecting' | 'active' | 'ended'>('connecting')
  const [queuePosition, setQueuePosition] = useState(0)
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [chatRating, setChatRating] = useState(0)
  const [showRating, setShowRating] = useState(false)
  const [satisfactionScore, setSatisfactionScore] = useState(0)
  const [chatTranscript, setChatTranscript] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([])
  const [chatCategories, setChatCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const agents: ChatAgent[] = [
    {
      id: 1,
      name: 'Alex Thompson',
      avatar: '👨‍💼',
      department: 'Technical Support',
      rating: 4.9,
      status: 'online',
      languages: ['English', 'Spanish'],
      avgResponseTime: '< 1 min',
      solvedTickets: 2341
    },
    {
      id: 2,
      name: 'Maria Garcia',
      avatar: '👩‍💼',
      department: 'Customer Service',
      rating: 4.8,
      status: 'online',
      languages: ['English', 'Spanish', 'French'],
      avgResponseTime: '< 2 min',
      solvedTickets: 1876
    },
    {
      id: 3,
      name: 'David Chen',
      avatar: '👨‍💻',
      department: 'Billing Support',
      rating: 4.9,
      status: 'busy',
      languages: ['English', 'Mandarin'],
      avgResponseTime: '< 3 min',
      solvedTickets: 1567
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      avatar: '👩‍🎓',
      department: 'Product Help',
      rating: 5.0,
      status: 'online',
      languages: ['English', 'German'],
      avgResponseTime: 'Instant',
      solvedTickets: 3456
    }
  ]

  const categories = [
    'Technical Issue',
    'Billing Question',
    'Account Help',
    'Product Inquiry',
    'Feature Request',
    'Bug Report',
    'General Support',
    'Urgent Issue'
  ]

  const quickReplyOptions: QuickReply[] = [
    { id: 1, text: 'Check order status', action: 'order_status' },
    { id: 2, text: 'Reset password', action: 'reset_password' },
    { id: 3, text: 'Billing inquiry', action: 'billing' },
    { id: 4, text: 'Technical support', action: 'technical' },
    { id: 5, text: 'Speak to agent', action: 'agent' },
    { id: 6, text: 'Leave feedback', action: 'feedback' }
  ]

  useEffect(() => {
    // Initialize chat with bot message
    const botMessage: ChatMessage = {
      id: Date.now(),
      text: '👋 Welcome to our live chat! I\'m here to help you. Please select a category for your inquiry or type your message below.',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
    setMessages([botMessage])
    setQuickReplies(quickReplyOptions)

    // Simulate connecting to agent
    setTimeout(() => {
      setChatStatus('active')
      const availableAgent = agents.find(agent => agent.status === 'online')
      if (availableAgent) {
        setSelectedAgent(availableAgent)
        const agentMessage: ChatMessage = {
          id: Date.now() + 1,
          text: `Hi! I'm ${availableAgent.name} from ${availableAgent.department}. How can I assist you today?`,
          sender: 'agent',
          timestamp: new Date(),
          type: 'text'
        }
        setMessages(prev => [...prev, agentMessage])
      }
    }, 2000)

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Simulate queue updates
    if (chatStatus === 'connecting') {
      const interval = setInterval(() => {
        setQueuePosition(prev => Math.max(0, prev - 1))
        setEstimatedWaitTime(prev => Math.max(0, prev - 30))
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [chatStatus])

  const sendMessage = () => {
    if (newMessage.trim() && chatStatus === 'active') {
      const message: ChatMessage = {
        id: Date.now(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        type: 'text',
        read: false
      }
      setMessages(prev => [...prev, message])
      setNewMessage('')
      
      // Simulate agent typing
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const responses = [
          'I understand your concern. Let me help you with that.',
          'That\'s a great question! Let me look into that for you.',
          'I can definitely assist you with this issue.',
          'Thank you for providing that information. Here\'s what I can do...',
          'I\'m checking our system for the best solution for you.'
        ]
        const agentMessage: ChatMessage = {
          id: Date.now() + 1,
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: 'agent',
          timestamp: new Date(),
          type: 'text'
        }
        setMessages(prev => [...prev, agentMessage])
      }, 2000)
    }
  }

  const sendQuickReply = (reply: QuickReply) => {
    const message: ChatMessage = {
      id: Date.now(),
      text: reply.text,
      sender: 'user',
      timestamp: new Date(),
      type: 'quick-reply'
    }
    setMessages(prev => [...prev, message])
    
    // Handle quick reply action
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        let responseText = ''
        switch (reply.action) {
          case 'order_status':
            responseText = 'I can help you check your order status. Could you please provide your order number?'
            break
          case 'reset_password':
            responseText = 'I can help you reset your password. I\'ll send you a secure link to reset it. What\'s your email address?'
            break
          case 'billing':
            responseText = 'I\'m connecting you to our billing specialist. They\'ll be with you in a moment.'
            break
          case 'technical':
            responseText = 'I\'m escalating this to our technical team. Can you describe the issue in more detail?'
            break
          case 'agent':
            responseText = 'I\'m transferring you to a human agent right away. Please hold for a moment.'
            break
          case 'feedback':
            responseText = 'Thank you for wanting to share feedback! We\'d love to hear your thoughts on our service.'
            break
          default:
            responseText = 'I\'m processing your request. One moment please.'
        }
        const botMessage: ChatMessage = {
          id: Date.now() + 1,
          text: responseText,
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        }
        setMessages(prev => [...prev, botMessage])
      }, 1500)
    }, 500)
  }

  const handleTyping = () => {
    if (!typingUsers.includes('You')) {
      setTypingUsers(prev => [...prev, 'You'])
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setTypingUsers(prev => prev.filter(user => user !== 'You'))
    }, 1000)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const fileMessage: ChatMessage = {
        id: Date.now(),
        text: `📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        sender: 'user',
        timestamp: new Date(),
        type: 'file'
      }
      setMessages(prev => [...prev, fileMessage])
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const endChat = () => {
    setChatStatus('ended')
    setShowRating(true)
    
    // Generate transcript
    const transcript = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.sender}: ${msg.text}`
    ).join('\n')
    setChatTranscript(transcript)
  }

  const submitRating = () => {
    // In real app, send rating to server
    console.log('Chat rating:', chatRating, 'Satisfaction:', satisfactionScore)
    setShowRating(false)
  }

  const addReaction = (messageId: number, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji)
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions?.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          }
        } else {
          return {
            ...msg,
            reactions: [...(msg.reactions || []), { emoji, count: 1 }]
          }
        }
      }
      return msg
    }))
  }

  const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '💯', '✨', '🙏', '💪', '😂']

  return (
    <div className={`live-chat-container ${isMinimized ? 'minimized' : ''} ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="chat-header">
        <div className="header-left">
          <div className="chat-status">
            <span className={`status-dot ${chatStatus}`}></span>
            <span className="status-text">
              {chatStatus === 'connecting' ? 'Connecting...' : 
               chatStatus === 'active' ? `${selectedAgent?.name || 'Support Agent'}` : 
               'Chat Ended'}
            </span>
          </div>
          {selectedAgent && chatStatus === 'active' && (
            <div className="agent-info">
              <span className="department">{selectedAgent.department}</span>
              <span className="rating">⭐ {selectedAgent.rating}</span>
            </div>
          )}
        </div>
        <div className="header-right">
          {chatStatus === 'connecting' && queuePosition > 0 && (
            <div className="queue-info">
              <span>Queue: #{queuePosition}</span>
              <span>~{estimatedWaitTime}s</span>
            </div>
          )}
          <div className="header-actions">
            <button 
              className="action-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute notifications' : 'Enable notifications'}
            >
              {soundEnabled ? '🔔' : '🔕'}
            </button>
            <button 
              className="action-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? '🗗' : '🗖'}
            </button>
            <button 
              className="action-btn"
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? '🗖' : '🗕'}
            </button>
            {chatStatus === 'active' && (
              <button 
                className="action-btn end-chat"
                onClick={endChat}
                title="End chat"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {!isMinimized && (
        <>
          {chatStatus === 'connecting' && (
            <div className="connecting-screen">
              <div className="connecting-animation">
                <div className="pulse-dot"></div>
                <div className="pulse-dot"></div>
                <div className="pulse-dot"></div>
              </div>
              <h3>Finding the best agent for you...</h3>
              <p>We're connecting you with a specialist who can help you best.</p>
              {queuePosition > 0 && (
                <div className="queue-details">
                  <span>You're #{queuePosition} in line</span>
                  <span>Estimated wait: {Math.floor(estimatedWaitTime / 60)} min {estimatedWaitTime % 60} sec</span>
                </div>
              )}
            </div>
          )}

          {chatStatus === 'active' && (
            <>
              {!selectedCategory && (
                <div className="category-selection">
                  <h4>Select a category for your inquiry:</h4>
                  <div className="category-grid">
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`category-btn ${isUrgent && category === 'Urgent Issue' ? 'urgent' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category === 'Urgent Issue' && '🚨 '}
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="chat-messages">
                {messages.map(message => (
                  <div key={message.id} className={`message ${message.sender}`}>
                    <div className="message-content">
                      <p>{message.text}</p>
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="message-reactions">
                          {message.reactions.map((reaction, index) => (
                            <span key={index} className="reaction">
                              {reaction.emoji} {reaction.count}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="message-meta">
                        <span className="timestamp">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.sender === 'user' && (
                          <span className="read-status">
                            {message.read ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <button 
                        className="add-reaction-btn"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        😊
                      </button>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="message agent typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                
                {typingUsers.length > 0 && (
                  <div className="typing-indicator-text">
                    {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {quickReplies.length > 0 && selectedCategory && (
                <div className="quick-replies">
                  <div className="quick-replies-grid">
                    {quickReplies.map(reply => (
                      <button
                        key={reply.id}
                        className="quick-reply-btn"
                        onClick={() => sendQuickReply(reply)}
                      >
                        {reply.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="chat-input">
                <div className="input-toolbar">
                  <button 
                    className="tool-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                  >
                    📎
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    hidden
                  />
                  <button 
                    className="tool-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Add emoji"
                  >
                    😊
                  </button>
                  <button 
                    className={`tool-btn ${isRecording ? 'recording' : ''}`}
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    title="Voice message"
                  >
                    🎤
                  </button>
                </div>
                <div className="input-field">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value)
                      handleTyping()
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={chatStatus !== 'active'}
                  />
                  <button 
                    className="send-btn"
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || chatStatus !== 'active'}
                  >
                    ➤
                  </button>
                </div>
              </div>

              {showEmojiPicker && (
                <div className="emoji-picker">
                  <div className="emoji-grid">
                    {emojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setNewMessage(prev => prev + emoji)
                          setShowEmojiPicker(false)
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {chatStatus === 'ended' && (
            <div className="chat-ended">
              <div className="ended-content">
                <h3>Chat Ended</h3>
                <p>Thank you for contacting us. We hope we were able to help!</p>
                
                {showRating && (
                  <div className="rating-section">
                    <h4>How would you rate this chat?</h4>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          className={`star ${star <= chatRating ? 'active' : ''}`}
                          onClick={() => setChatRating(star)}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    
                    <div className="satisfaction-section">
                      <h4>How satisfied are you with the resolution?</h4>
                      <div className="satisfaction-scale">
                        {[1, 2, 3, 4, 5].map(score => (
                          <button
                            key={score}
                            className={`satisfaction-btn ${score === satisfactionScore ? 'active' : ''}`}
                            onClick={() => setSatisfactionScore(score)}
                          >
                            {score === 1 ? '😞' : score === 2 ? '😐' : score === 3 ? '🙂' : score === 4 ? '😊' : '😄'}
                            <span>{score === 1 ? 'Very Unsatisfied' : score === 2 ? 'Unsatisfied' : score === 3 ? 'Neutral' : score === 4 ? 'Satisfied' : 'Very Satisfied'}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <button className="submit-rating-btn" onClick={submitRating}>
                      Submit Feedback
                    </button>
                  </div>
                )}
                
                <div className="chat-actions">
                  <button className="action-btn" onClick={() => window.print()}>
                    📄 Save Transcript
                  </button>
                  <button className="action-btn" onClick={() => window.location.reload()}>
                    💬 Start New Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default LiveChat
