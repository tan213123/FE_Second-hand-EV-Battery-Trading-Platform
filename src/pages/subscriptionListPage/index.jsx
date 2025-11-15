import { useState, useEffect } from 'react'
import api from "../../config/api"

const SubscriptionListPage = () => {
    const [subscriptions, setSubscriptions] = useState([])
    const [loading, setLoading] = useState(true)
    const memberId = localStorage.getItem("memberId")

    useEffect(() => {
        if (!memberId) {
            setLoading(false)
            return
        }
        api.get(`/subscription/member/${memberId}`)
            .then(res => setSubscriptions(res.data))
            .catch(() => setSubscriptions([]))
            .finally(() => setLoading(false))
    }, [memberId])

    if (loading) return <div>Đang tải thông tin gói đã mua...</div>

    return (
        <div className="subscription-list">
            <h2>Gói đã mua của bạn:</h2>
            {subscriptions.length === 0 && (
                <div>Bạn chưa có gói nào hoặc chưa mua subscription.</div>
            )}
            {subscriptions.map(sub => (
                <div className="subscription-card" key={sub.subscriptionId || (sub.memberId + "_" + sub.packageId)}>
                    <div><b>Gói:</b> {sub.packageName || sub.pkgName}</div>
                    <div><b>Ngày bắt đầu:</b> {sub.startDate || '—'}</div>
                    <div><b>Ngày hết hạn:</b> {sub.endDate || '—'}</div>
                    <div><b>Bài đăng còn lại:</b> {sub.remainingPosts}</div>
                    <div><b>Trạng thái:</b> {sub.status}</div>
                </div>
            ))}
        </div>
    )
}

export default SubscriptionListPage
