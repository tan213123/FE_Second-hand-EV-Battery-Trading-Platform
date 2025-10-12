import { useNavigate } from 'react-router-dom'
import { useCompare } from '../../contexts/CompareContext'
import './index.scss'

const CompareBar = () => {
  const navigate = useNavigate()
  const { compareItems, removeFromCompare, clearAll } = useCompare()

  if (compareItems.length === 0) return null

  return (
    <div className="compare-bar">
      <div className="compare-bar-content">
        <div className="compare-items">
          <div className="compare-label">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
            </svg>
            <span>So sánh ({compareItems.length}/4)</span>
          </div>
          
          <div className="compare-list">
            {compareItems.map(item => (
              <div key={item.id} className="compare-item">
                <img src={item.image} alt={item.title} />
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCompare(item.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="compare-actions">
          <button className="btn-clear" onClick={clearAll}>
            Xóa tất cả
          </button>
          <button className="btn-compare" onClick={() => navigate('/compare')}>
            So sánh ngay
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompareBar
