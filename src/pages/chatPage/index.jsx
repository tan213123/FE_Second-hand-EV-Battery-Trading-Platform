import React, { useState, useEffect, useRef } from 'react'
import './index.scss'

// Icon Components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)

const MoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2"/>
    <circle cx="12" cy="12" r="2"/>
    <circle cx="12" cy="19" r="2"/>
  </svg>
)

const ChatBubbleIcon = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

function ChatPage({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'unread'
  const [selectedChat, setSelectedChat] = useState(null) // Selected chat ID
  const [newMessage, setNewMessage] = useState('') // New message input
  const [messages, setMessages] = useState({}) // Store all messages
  
  // Mock data for conversations - Updated to electric vehicles
  const conversations = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      lastMessage: 'Xe điện này còn bán không ạ?',
      time: '10:30',
      unread: true,
      avatar: '👨',
      product: 'VinFast VF e34 2024'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      lastMessage: 'Pin xe điện có bền không?',
      time: '09:15',
      unread: false,
      avatar: '👩',
      product: 'Tesla Model 3'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      lastMessage: 'Xe điện đã bán chưa?',
      time: '08:45',
      unread: true,
      avatar: '👨‍💼',
      product: 'BMW iX3'
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      lastMessage: 'Cảm ơn bạn!',
      time: 'Hôm qua',
      unread: false,
      avatar: '👩‍💼',
      product: 'Audi e-tron'
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      lastMessage: 'Tôi sẽ đến xem xe điện vào cuối tuần',
      time: 'Hôm qua',
      unread: true,
      avatar: '👨‍🎓',
      product: 'Mercedes EQC'
    }
  ]

  // Initialize messages with mock data
  const initializeMessages = () => {
    const initialMessages = {
      1: [
        { id: 1, sender: 'other', message: 'Chào bạn, tôi quan tâm đến chiếc VinFast VF e34 này', time: '10:25' },
        { id: 2, sender: 'other', message: 'Xe điện này còn bán không ạ?', time: '10:30' },
        { id: 3, sender: 'me', message: 'Chào bạn! Xe vẫn còn bán nhé', time: '10:32' },
        { id: 4, sender: 'me', message: 'Bạn có muốn xem xe không?', time: '10:33' },
        { id: 5, sender: 'other', message: 'Có, tôi muốn xem xe vào cuối tuần này', time: '10:35' },
        { id: 6, sender: 'me', message: 'Tuyệt! Tôi sẽ gửi địa chỉ cho bạn', time: '10:36' },
        { id: 7, sender: 'other', message: 'Cảm ơn bạn nhiều!', time: '10:37' }
      ],
      2: [
        { id: 1, sender: 'other', message: 'Pin xe điện có bền không?', time: '09:15' },
        { id: 2, sender: 'me', message: 'Pin Tesla rất bền, có thể đi được 500km', time: '09:20' },
        { id: 3, sender: 'other', message: 'Thời gian sạc mất bao lâu?', time: '09:22' },
        { id: 4, sender: 'me', message: 'Sạc nhanh 30 phút, sạc thường 8 tiếng', time: '09:25' },
        { id: 5, sender: 'other', message: 'Cảm ơn bạn!', time: '09:26' }
      ],
      3: [
        { id: 1, sender: 'other', message: 'Xe điện đã bán chưa?', time: '08:45' },
        { id: 2, sender: 'me', message: 'Chưa bán, bạn quan tâm không?', time: '08:50' }
      ],
      4: [
        { id: 1, sender: 'other', message: 'Xe điện đã bán chưa?', time: 'Hôm qua' },
        { id: 2, sender: 'me', message: 'Chưa bán, bạn quan tâm không?', time: 'Hôm qua' },
        { id: 3, sender: 'other', message: 'Cảm ơn bạn!', time: 'Hôm qua' },
        { id: 4, sender: 'me', message: 'Không có gì!', time: 'Hôm qua' }
      ],
      5: [
        { id: 1, sender: 'other', message: 'Tôi sẽ đến xem xe điện vào cuối tuần', time: 'Hôm qua' },
        { id: 2, sender: 'me', message: 'Được rồi, tôi sẽ chờ bạn', time: 'Hôm qua' },
        { id: 3, sender: 'other', message: 'Xe có bảo hành không?', time: 'Hôm qua' },
        { id: 4, sender: 'me', message: 'Có bảo hành 3 năm cho pin và 5 năm cho xe', time: 'Hôm qua' },
        { id: 5, sender: 'other', message: 'Tuyệt vời! Tôi sẽ liên hệ lại', time: 'Hôm qua' }
      ]
    }
    return initialMessages
  }

  // Initialize messages on component mount
  useEffect(() => {
    if (Object.keys(messages).length === 0) {
      setMessages(initializeMessages())
    }
  }, [])

  // Get messages for selected chat
  const getMessages = (chatId) => {
    return messages[chatId] || []
  }

  // Filter conversations based on active tab
  const filteredConversations = conversations.filter(conv => {
    if (activeTab === 'unread') {
      return conv.unread
    }
    return true
  })

  // Filter by search term
  const searchFilteredConversations = filteredConversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.product.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get selected conversation
  const selectedConversation = conversations.find(conv => conv.id === selectedChat)
  const selectedMessages = selectedChat ? getMessages(selectedChat) : []

  // Send message function
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const currentTime = new Date().toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      message: newMessage.trim(),
      time: currentTime
    }

    // Update messages state
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg]
    }))

    // Clear input
    setNewMessage('')

    // Simulate auto-reply after 2 seconds
    setTimeout(() => {
      const autoReplies = [
        'Cảm ơn bạn đã quan tâm!',
        'Tôi sẽ kiểm tra và trả lời bạn sớm',
        'Xe vẫn còn bán nhé',
        'Bạn có muốn xem xe không?',
        'Giá có thể thương lượng được',
        'Xe rất mới và ít sử dụng',
        'Pin còn rất tốt',
        'Bạn có thể đến xem xe bất cứ lúc nào',
        'Tôi sẽ liên hệ lại với bạn',
        'Có thêm thông tin gì cần hỏi không?'
      ]
      
      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)]
      const replyTime = new Date().toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })

      const autoMsg = {
        id: Date.now() + 1,
        sender: 'other',
        message: randomReply,
        time: replyTime
      }

      setMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), autoMsg]
      }))
    }, 2000)
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Auto scroll to bottom when new messages arrive
  const messagesEndRef = useRef(null)
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedMessages])

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h1 className="sidebar-title">Chat</h1>
            <button className="more-btn">
              <MoreIcon />
            </button>
          </div>

          {/* Search Box */}
          <div className="search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Nhập 3 ký tự để bắt đầu tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
    
          {/* Tabs */}
          <div className="chat-tabs">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Tất cả tin nhắn
            </button>
            <button 
              className={`tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
              onClick={() => setActiveTab('unread')}
            >
              Tin chưa đọc
            </button>
          </div>

          {/* Chat List */}
          <div className="chat-list">
            {searchFilteredConversations.length > 0 ? (
              searchFilteredConversations.map(conv => (
                <div 
                  key={conv.id} 
                  className={`chat-item ${selectedChat === conv.id ? 'selected' : ''}`}
                  onClick={() => setSelectedChat(conv.id)}
                >
                  <div className="chat-avatar">
                    <span className="avatar-emoji">{conv.avatar}</span>
                    {conv.unread && <div className="unread-indicator"></div>}
                  </div>
                  <div className="chat-content">
                    <div className="chat-header">
                      <h4 className="chat-name">{conv.name}</h4>
                      <span className="chat-time">{conv.time}</span>
                    </div>
                    <p className="chat-product">{conv.product}</p>
                    <p className={`chat-message ${conv.unread ? 'unread' : ''}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-chat-list">
                <p>Không có cuộc trò chuyện nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="chat-main">
          {selectedChat ? (
            <div className="chat-conversation">
              {/* Chat Header */}
              <div className="conversation-header">
                <div className="conversation-info">
                  <div className="conversation-avatar">
                    <span className="avatar-emoji">{selectedConversation?.avatar}</span>
                  </div>
                  <div className="conversation-details">
                    <h3 className="conversation-name">{selectedConversation?.name}</h3>
                    <p className="conversation-product">{selectedConversation?.product}</p>
                  </div>
                </div>
                <div className="conversation-actions">
                  <button className="action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3h18v18H3zM9 9h6v6H9z"/>
                    </svg>
                  </button>
                  <button className="action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {selectedMessages.map(msg => (
                  <div key={msg.id} className={`message ${msg.sender}`}>
                    <div className="message-content">
                      <p>{msg.message}</p>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input">
                <div className="input-container">
                  <button className="attach-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"/>
                    </svg>
                  </button>
                  <input 
                    type="text" 
                    placeholder="Nhập tin nhắn..." 
                    className="message-text-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button 
                    className="send-btn"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-illustration">
                <div className="chat-avatars">
                  <div className="avatar avatar-1">
                    <div className="avatar-face">⚡</div>
                  </div>
                  <div className="chat-bubble bubble-1">
                    <div className="dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="avatar avatar-2">
                    <div className="avatar-face">🚗</div>
                  </div>
                  <div className="chat-bubble bubble-2">
                    <div className="dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="sparkle sparkle-1">✨</div>
                </div>
              </div>
              <h2 className="empty-title">Bạn chưa có cuộc trò chuyện nào!</h2>
              <p className="empty-description">
                Trải nghiệm chat để làm rõ thông tin về xe điện trước khi bắt đầu thực hiện mua bán
              </p>
              <button 
                className="btn-home"
                onClick={() => onNavigate && onNavigate('home')}
              >
                Về trang chủ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage
