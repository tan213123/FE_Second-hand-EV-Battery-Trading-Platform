import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import './forgot.scss'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!email) {
      setError('Vui lòng nhập email')
      return
    }

    setSubmitting(true)
    const result = await authService.forgotPassword(email)
    setSubmitting(false)

    if (result.success) {
      setMessage('Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h1>Quên mật khẩu</h1>
        <p className="subtitle">Nhập email để nhận liên kết đặt lại mật khẩu</p>

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="forgot-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />

          <button type="submit" disabled={submitting}>
            {submitting ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
          </button>
        </form>

        <div className="actions">
          <button className="link" onClick={() => navigate('/login')}>Quay lại đăng nhập</button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage


