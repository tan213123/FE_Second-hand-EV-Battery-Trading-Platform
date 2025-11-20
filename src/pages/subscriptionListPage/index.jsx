import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from "../../config/api"
import './index.scss'

const SubscriptionListPage = () => {
    const [subscriptions, setSubscriptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState(null)
    const member = useSelector((state) => state.member)
    const memberId = member?.memberId ?? member?.id ?? member?.memberID
    const navigate = useNavigate()

    useEffect(() => {
        if (!memberId) {
            setLoading(false)
            return
        }
        api.get(`/subscription/member/${memberId}`)
            .then(res => setSubscriptions(res.data || []))
            .catch((error) => {
                console.error("Không thể tải subscriptions:", error)
                setSubscriptions([])
            })
            .finally(() => setLoading(false))
    }, [memberId])

    const formatDate = (date) => {
        if (!date) return '—'
        try {
            return new Date(date).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })
        } catch {
            return date
        }
    }

    const formatStatus = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'Đang hoạt động'
            case 'EXPIRED':
                return 'Đã hết hạn'
            case 'CANCELLED':
                return 'Đã hủy'
            case 'PENDING':
                return 'Chờ kích hoạt'
            default:
                return status || '—'
        }
    }

    if (loading) {
        return (
            <div className="subscription-list loading-state">
                <div className="loading-spinner" />
                <p>Đang tải thông tin gói đã mua...</p>
            </div>
        )
    }

    if (!memberId) {
        return (
            <div className="subscription-list empty-state">
                <p>Bạn cần đăng nhập để xem gói đã mua.</p>
                <button onClick={() => navigate('/login')}>Đăng nhập</button>
            </div>
        )
    }

    const handleCancel = async (sub) => {
        if (!memberId) {
            alert('Bạn cần đăng nhập để thao tác')
            navigate('/login')
            return
        }
        const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy gói này?')
        if (!confirmCancel) return
        const pkgId = sub.packageId || sub.pkgId
        if (!pkgId) return
        try {
            setCancellingId(pkgId)
            await api.patch(`/subscription/${memberId}/${pkgId}/cancel`)
            const res = await api.get(`/subscription/member/${memberId}`)
            setSubscriptions(res.data || [])
            alert('Hủy gói thành công')
        } catch (error) {
            console.error('Không thể hủy gói:', error)
            alert(error.response?.data?.message || 'Không thể hủy gói. Vui lòng thử lại sau.')
        } finally {
            setCancellingId(null)
        }
    }

    return (
        <div className="subscription-list">
            <div className="subscription-header">
                <div>
                    <p className="eyebrow">Gói đăng tin</p>
                    <h2>Gói đã mua của bạn</h2>
                    <p className="subtitle">Quản lý thời hạn, số bài đăng và thao tác với gói hiện tại</p>
                </div>
                <button className="primary-btn" onClick={() => navigate('/packages')}>
                    + Chọn gói khác
                </button>
            </div>

            {subscriptions.length === 0 ? (
                <div className="empty-state card">
                    <h3>Chưa có gói nào hoạt động</h3>
                    <p>Hãy chọn một gói đăng tin để bắt đầu bán hàng nhanh hơn.</p>
                    <button className="primary-btn" onClick={() => navigate('/packages')}>
                        Khám phá gói đăng tin
                    </button>
                </div>
            ) : (
                <div className="subscription-grid">
                    {subscriptions.map(sub => {
                        const pkgId = sub.packageId || sub.pkgId
                        const statusClass = (sub.status || '').toLowerCase()

                        return (
                            <div className="subscription-card card" key={sub.subscriptionId || (sub.memberId + "_" + pkgId)}>
                                <div className="subscription-card__header">
                                    <div>
                                        <p className="plan-label">Gói đang dùng</p>
                                        <h3 className="plan-name">{sub.packageName || sub.pkgName}</h3>
                                    </div>
                                    <span className={`status-badge ${statusClass}`}>
                                        {formatStatus(sub.status)}
                                    </span>
                                </div>

                                <div className="subscription-card__body">
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <p className="info-label">Ngày bắt đầu</p>
                                            <p className="info-value">{formatDate(sub.startDate)}</p>
                                        </div>
                                        <div className="info-item">
                                            <p className="info-label">Ngày hết hạn</p>
                                            <p className="info-value">{formatDate(sub.endDate)}</p>
                                        </div>
                                        <div className="info-item">
                                            <p className="info-label">Bài đăng còn lại</p>
                                            <p className="info-value highlight">{sub.remainingPosts ?? '—'}</p>
                                        </div>
                                        <div className="info-item">
                                            <p className="info-label">Mã thành viên</p>
                                            <p className="info-value">{sub.memberId}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="subscription-actions">
                                    <button
                                        className="btn-upgrade"
                                        onClick={() => navigate('/packages')}
                                    >
                                        Nâng cấp gói
                                    </button>
                                    <button
                                        className="btn-cancel"
                                        onClick={() => handleCancel(sub)}
                                        disabled={cancellingId === pkgId}
                                    >
                                        {cancellingId === pkgId ? 'Đang hủy...' : 'Hủy gói'}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default SubscriptionListPage
