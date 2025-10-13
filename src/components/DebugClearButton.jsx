// Component debug để xóa localStorage - XÓA FILE NÀY SAU KHI HOÀN THÀNH TEST
const DebugClearButton = () => {
  const clearSavedItems = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm đã lưu?')) {
      localStorage.removeItem('savedItems')
      localStorage.removeItem('compareItems')
      window.location.reload()
    }
  }

  return (
    <button 
      onClick={clearSavedItems}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 4px 20px rgba(255, 68, 68, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.05)'
        e.target.style.boxShadow = '0 6px 24px rgba(255, 68, 68, 0.6)'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)'
        e.target.style.boxShadow = '0 4px 20px rgba(255, 68, 68, 0.4)'
      }}
    >
      <span style={{ fontSize: '18px' }}>🗑️</span>
      <span>Clear Saved (Debug)</span>
    </button>
  )
}

export default DebugClearButton
