import { useState } from 'react'
import './index.scss'

// Icon Components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
  </svg>
)

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
)

const XCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
)

const AlertCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

function TransactionHistoryPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Mock data for transactions
  const [transactions] = useState([
    {
      id: 'TXN001',
      type: 'buy',
      product: {
        title: 'VinFast VF 8 Plus 2023 - Xe điện cao cấp',
        image: '/api/placeholder/80/60',
        category: 'Xe điện'
      },
      seller: {
        name: 'Nguyễn Văn A',
        avatar: '/api/placeholder/32/32',
        rating: 4.8
      },
      amount: 280000000,
      status: 'completed',
      date: '2024-01-15',
      time: '14:30',
      paymentMethod: 'Chuyển khoản',
      notes: 'Giao dịch thành công, xe đã nhận',
      rating: 5,
      review: 'Xe rất tốt, người bán nhiệt tình'
    },
    {
      id: 'TXN002',
      type: 'sell',
      product: {
        title: 'Pin Lithium Tesla 72V 32Ah',
        image: '/api/placeholder/80/60',
        category: 'Pin xe điện'
      },
      buyer: {
        name: 'Trần Thị B',
        avatar: '/api/placeholder/32/32',
        rating: 4.6
      },
      amount: 32000000,
      status: 'completed',
      date: '2024-01-12',
      time: '09:15',
      paymentMethod: 'Tiền mặt',
      notes: 'Bán thành công, đã giao hàng',
      rating: 4,
      review: 'Người mua rất uy tín'
    },
    {
      id: 'TXN003',
      type: 'buy',
      product: {
        title: 'Yadea S3 Pro 2023 - Xe máy điện',
        image: '/api/placeholder/80/60',
        category: 'Xe máy điện'
      },
      seller: {
        name: 'Shop Xe Điện Yadea',
        avatar: '/api/placeholder/32/32',
        rating: 4.7
      },
      amount: 19500000,
      status: 'pending',
      date: '2024-01-10',
      time: '16:45',
      paymentMethod: 'Chuyển khoản',
      notes: 'Đang chờ xác nhận từ người bán',
      rating: null,
      review: null
    },
    {
      id: 'TXN004',
      type: 'sell',
      product: {
        title: 'VinFast VF e34 2022 - Ô tô điện sedan',
        image: '/api/placeholder/80/60',
        category: 'Xe điện'
      },
      buyer: {
        name: 'Lê Hoàng C',
        avatar: '/api/placeholder/32/32',
        rating: 4.9
      },
      amount: 520000000,
      status: 'cancelled',
      date: '2024-01-08',
      time: '11:20',
      paymentMethod: 'Chuyển khoản',
      notes: 'Giao dịch bị hủy do người mua thay đổi ý định',
      rating: null,
      review: null
    },
    {
      id: 'TXN005',
      type: 'buy',
      product: {
        title: 'Pin Ắc quy Lithium 48V 20Ah',
        image: '/api/placeholder/80/60',
        category: 'Pin xe điện'
      },
      seller: {
        name: 'Pin Xe Điện Cần Thơ',
        avatar: '/api/placeholder/32/32',
        rating: 4.6
      },
      amount: 12500000,
      status: 'shipped',
      date: '2024-01-05',
      time: '13:10',
      paymentMethod: 'Chuyển khoản',
      notes: 'Đã gửi hàng, đang vận chuyển',
      rating: null,
      review: null
    },
    {
      id: 'TXN006',
      type: 'sell',
      product: {
        title: 'Honda SH Mode 2023 - Xe máy điện',
        image: '/api/placeholder/80/60',
        category: 'Xe máy điện'
      },
      buyer: {
        name: 'Phạm Thu D',
        avatar: '/api/placeholder/32/32',
        rating: 4.5
      },
      amount: 45000000,
      status: 'completed',
      date: '2024-01-03',
      time: '10:30',
      paymentMethod: 'Tiền mặt',
      notes: 'Giao dịch thành công, xe đã bàn giao',
      rating: 5,
      review: 'Người mua rất hài lòng với sản phẩm'
    }
  ])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      completed: { 
        text: 'Hoàn thành', 
        color: '#4CAF50', 
        icon: <CheckCircleIcon />,
        bgColor: '#E8F5E8'
      },
      pending: { 
        text: 'Chờ xử lý', 
        color: '#FF9800', 
        icon: <ClockIcon />,
        bgColor: '#FFF3E0'
      },
      shipped: { 
        text: 'Đã gửi hàng', 
        color: '#2196F3', 
        icon: <ClockIcon />,
        bgColor: '#E3F2FD'
      },
      cancelled: { 
        text: 'Đã hủy', 
        color: '#F44336', 
        icon: <XCircleIcon />,
        bgColor: '#FFEBEE'
      }
    }
    return statusMap[status] || statusMap.pending
  }

  const getTypeInfo = (type) => {
    return type === 'buy' 
      ? { text: 'Mua', color: '#4CAF50', bgColor: '#E8F5E8' }
      : { text: 'Bán', color: '#2196F3', bgColor: '#E3F2FD' }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    totalTransactions: transactions.length,
    totalSpent: transactions.filter(t => t.type === 'buy' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    totalEarned: transactions.filter(t => t.type === 'sell' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    completedTransactions: transactions.filter(t => t.status === 'completed').length
  }

  return (
    <div className="transaction-history-page">
      <div className="container">
        {/* Header Section */}
        <div className="page-header">
          <div className="header-content">
            <h1>Lịch sử giao dịch</h1>
            <p>Theo dõi tất cả các giao dịch mua bán của bạn</p>
          </div>
          <button className="export-btn">
            <DownloadIcon />
            Xuất báo cáo
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircleIcon />
            </div>
            <div className="stat-content">
              <span className="stat-number">{stats.totalTransactions}</span>
              <span className="stat-label">Tổng giao dịch</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon spent">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-number">{formatCurrency(stats.totalSpent)}</span>
              <span className="stat-label">Đã chi tiêu</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon earned">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-number">{formatCurrency(stats.totalEarned)}</span>
              <span className="stat-label">Đã kiếm được</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon success">
              <CheckCircleIcon />
            </div>
            <div className="stat-content">
              <span className="stat-number">{stats.completedTransactions}</span>
              <span className="stat-label">Giao dịch thành công</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="search-filter-section">
          <div className="search-box">
            <SearchIcon />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo ID giao dịch hoặc tên sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="completed">Hoàn thành</option>
              <option value="pending">Chờ xử lý</option>
              <option value="shipped">Đã gửi hàng</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả loại</option>
              <option value="buy">Mua</option>
              <option value="sell">Bán</option>
            </select>
            
            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
            
            <button className="filter-btn">
              <FilterIcon />
              Bộ lọc nâng cao
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="transactions-list">
          {filteredTransactions.map(transaction => {
            const statusInfo = getStatusInfo(transaction.status)
            const typeInfo = getTypeInfo(transaction.type)
            const counterpart = transaction.type === 'buy' ? transaction.seller : transaction.buyer
            
            return (
              <div key={transaction.id} className="transaction-card">
                <div className="transaction-header">
                  <div className="transaction-id">
                    <span className="id-label">ID:</span>
                    <span className="id-value">{transaction.id}</span>
                  </div>
                  <div className="transaction-date">
                    <CalendarIcon />
                    <span>{formatDate(transaction.date)} {transaction.time}</span>
                  </div>
                </div>

                <div className="transaction-content">
                  <div className="product-info">
                    <img src={transaction.product.image} alt={transaction.product.title} />
                    <div className="product-details">
                      <h3>{transaction.product.title}</h3>
                      <span className="category">{transaction.product.category}</span>
                    </div>
                  </div>

                  <div className="transaction-details">
                    <div className="counterpart-info">
                      <img src={counterpart.avatar} alt={counterpart.name} />
                      <div className="counterpart-details">
                        <span className="counterpart-name">{counterpart.name}</span>
                        <div className="counterpart-rating">
                          <StarIcon />
                          <span>{counterpart.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="amount-info">
                      <span className="amount-label">
                        {transaction.type === 'buy' ? 'Đã chi:' : 'Đã nhận:'}
                      </span>
                      <span className="amount-value">{formatCurrency(transaction.amount)}</span>
                    </div>

                    <div className="status-info">
                      <div 
                        className="status-badge"
                        style={{ 
                          color: statusInfo.color,
                          backgroundColor: statusInfo.bgColor
                        }}
                      >
                        {statusInfo.icon}
                        <span>{statusInfo.text}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="transaction-footer">
                  <div className="transaction-meta">
                    <span className="type-badge" style={{ 
                      color: typeInfo.color,
                      backgroundColor: typeInfo.bgColor
                    }}>
                      {typeInfo.text}
                    </span>
                    <span className="payment-method">{transaction.paymentMethod}</span>
                  </div>

                  <div className="transaction-actions">
                    <button className="action-btn">
                      <EyeIcon />
                      Xem chi tiết
                    </button>
                    {transaction.status === 'completed' && !transaction.rating && (
                      <button className="action-btn primary">
                        Đánh giá
                      </button>
                    )}
                  </div>
                </div>

                {transaction.notes && (
                  <div className="transaction-notes">
                    <span className="notes-label">Ghi chú:</span>
                    <span className="notes-content">{transaction.notes}</span>
                  </div>
                )}

                {transaction.review && (
                  <div className="transaction-review">
                    <div className="review-header">
                      <span className="review-label">Đánh giá của bạn:</span>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} style={{ 
                            color: i < transaction.rating ? '#FFC107' : '#E0E0E0',
                            width: '16px',
                            height: '16px'
                          }} />
                        ))}
                      </div>
                    </div>
                    <p className="review-content">"{transaction.review}"</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <h3>Không tìm thấy giao dịch</h3>
            <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionHistoryPage
