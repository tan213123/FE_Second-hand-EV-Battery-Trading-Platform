import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../../redux/authSlice'
import './reset.scss'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const reset = useSelector((s) => s.auth?.reset || { status: 'idle', error: null, data: null })
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (!tokenFromUrl) {
      setError('Token không hợp lệ hoặc đã hết hạn')
    } else {
      setToken(tokenFromUrl)
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin')
      return
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    if (!token) {
      setError('Token không hợp lệ')
      return
    }

    const action = await dispatch(resetPassword({ token, newPassword }))
    if (resetPassword.fulfilled.match(action)) {
      setMessage('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } else {
      setError(action.payload || 'Không thể đặt lại mật khẩu')
    }
  }

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h1>Đặt lại mật khẩu</h1>
        <p className="subtitle">Nhập mật khẩu mới cho tài khoản của bạn</p>

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="reset-form">
          <label htmlFor="newPassword">Mật khẩu mới</label>
          <input
            id="newPassword"
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={reset.status === 'loading' || !token}
            minLength={6}
          />

          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={reset.status === 'loading' || !token}
            minLength={6}
          />

          <button type="submit" disabled={reset.status === 'loading' || !token}>
            {reset.status === 'loading' ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </button>
        </form>

        <div className="actions">
          <button className="link" onClick={() => navigate('/login')}>
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage

