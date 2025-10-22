import React, { useState, useMemo, useEffect } from 'react';
import './posts.scss';

const samplePosts = [
  {
    id: 'POST001',
    title: 'Xe điện cũ - Like new',
    provinceCity: 'Hà Nội',
    postType: 'Bán',
    createdAt: '2025-09-20',
    memberId: 'MBR1001',
    price: 12500000,
    status: 'pending' // pending, approved, rejected
  },
  {
    id: 'POST002',
    title: 'Bán pin EV 48V',
    provinceCity: 'TP. Hồ Chí Minh',
    postType: 'Bán',
    createdAt: '2025-09-22',
    memberId: 'MBR1002',
    price: 3200000,
    status: 'pending'
  },
  {
    id: 'POST003',
    title: 'Trao đổi 60Ah',
    provinceCity: 'Đà Nẵng',
    postType: 'Trao đổi',
    createdAt: '2025-09-25',
    memberId: 'MBR1003',
    price: 0,
    status: 'approved'
  },
  {
    id: 'POST004',
    title: 'Pin lithium 72V mới 95%',
    provinceCity: 'Hải Phòng',
    postType: 'Bán',
    createdAt: '2025-09-26',
    memberId: 'MBR1004',
    price: 5800000,
    status: 'rejected'
  }
];

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    setPosts(samplePosts);
  }, []);

  const handleSort = (key) => {
    setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };

  const filtered = useMemo(() => {
    let result = posts;
    
    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(p => p.status === filterStatus);
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(p =>
        Object.values(p).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return result;
  }, [posts, searchTerm, filterStatus]);

  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered;
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key])) * dir);
  }, [filtered, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedPosts(paginated.map(p => p.id));
    else setSelectedPosts([]);
  };

  const handleSelect = (id) => {
    setSelectedPosts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDelete = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    setSelectedPosts(prev => prev.filter(x => x !== id));
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedPosts.length} bài đăng?`)) {
      setPosts(prev => prev.filter(p => !selectedPosts.includes(p.id)));
      setSelectedPosts([]);
    }
  };

  const handleApprove = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
  };

  const handleReject = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
  };

  const handleBulkApprove = () => {
    setPosts(prev => prev.map(p => 
      selectedPosts.includes(p.id) ? { ...p, status: 'approved' } : p
    ));
    setSelectedPosts([]);
  };

  const handleBulkReject = () => {
    setPosts(prev => prev.map(p => 
      selectedPosts.includes(p.id) ? { ...p, status: 'rejected' } : p
    ));
    setSelectedPosts([]);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');
  const formatPrice = (v) =>
    Number(v || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Chờ duyệt', class: 'status-pending' },
      approved: { text: 'Đã duyệt', class: 'status-approved' },
      rejected: { text: 'Từ chối', class: 'status-rejected' }
    };
    return badges[status] || badges.pending;
  };

  const statusCounts = useMemo(() => {
    return {
      all: posts.length,
      pending: posts.filter(p => p.status === 'pending').length,
      approved: posts.filter(p => p.status === 'approved').length,
      rejected: posts.filter(p => p.status === 'rejected').length
    };
  }, [posts]);

  return (
    <div className="users-management">
      <div className="card">
        <div className="card-header">
          <h2>Duyệt bài đăng</h2>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm Mã bài, Tiêu đề, Tỉnh/Thành phố, Loại bài, Mã thành viên, Giá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>

            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="select-entries">
              <option value={10}>10 dòng</option>
              <option value={25}>25 dòng</option>
              <option value={50}>50 dòng</option>
            </select>
          </div>
        </div>

        <div className="status-filter">
          <button 
            className={filterStatus === 'all' ? 'active' : ''} 
            onClick={() => setFilterStatus('all')}
          >
            Tất cả ({statusCounts.all})
          </button>
          <button 
            className={filterStatus === 'pending' ? 'active' : ''} 
            onClick={() => setFilterStatus('pending')}
          >
            Chờ duyệt ({statusCounts.pending})
          </button>
          <button 
            className={filterStatus === 'approved' ? 'active' : ''} 
            onClick={() => setFilterStatus('approved')}
          >
            Đã duyệt ({statusCounts.approved})
          </button>
          <button 
            className={filterStatus === 'rejected' ? 'active' : ''} 
            onClick={() => setFilterStatus('rejected')}
          >
            Từ chối ({statusCounts.rejected})
          </button>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={selectedPosts.length === paginated.length && paginated.length > 0} onChange={handleSelectAll} />
                </th>
                <th onClick={() => handleSort('id')} className="sortable">Mã bài đăng {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('title')} className="sortable">Tiêu đề {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('provinceCity')} className="sortable">Tỉnh/Thành phố {sortConfig.key === 'provinceCity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('postType')} className="sortable">Loại bài {sortConfig.key === 'postType' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('createdAt')} className="sortable">Ngày {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('memberId')} className="sortable">Mã thành viên {sortConfig.key === 'memberId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('price')} className="sortable">Giá {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('status')} className="sortable">Trạng thái {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => {
                const statusBadge = getStatusBadge(p.status);
                return (
                  <tr key={p.id} className={selectedPosts.includes(p.id) ? 'selected' : ''}>
                    <td>
                      <input type="checkbox" checked={selectedPosts.includes(p.id)} onChange={() => handleSelect(p.id)} />
                    </td>
                    <td>{p.id}</td>
                    <td>{p.title}</td>
                    <td>{p.provinceCity}</td>
                    <td>{p.postType}</td>
                    <td>{formatDate(p.createdAt)}</td>
                    <td>{p.memberId}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>
                      <span className={`status-badge ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {p.status === 'pending' && (
                          <>
                            <button className="btn-icon approve" onClick={() => handleApprove(p.id)} title="Duyệt">✓</button>
                            <button className="btn-icon reject" onClick={() => handleReject(p.id)} title="Từ chối">✗</button>
                          </>
                        )}
                        {p.status === 'approved' && (
                          <button className="btn-icon reject" onClick={() => handleReject(p.id)} title="Từ chối">✗</button>
                        )}
                        {p.status === 'rejected' && (
                          <button className="btn-icon approve" onClick={() => handleApprove(p.id)} title="Duyệt">✓</button>
                        )}
                        <button className="btn-icon" title="Chi tiết">🔍</button>
                        <button className="btn-icon delete" onClick={() => handleDelete(p.id)} title="Xóa">🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="bulk-actions">
            {selectedPosts.length > 0 && (
              <>
                <button className="btn-success" onClick={handleBulkApprove}>Duyệt ({selectedPosts.length})</button>
                <button className="btn-warning" onClick={handleBulkReject}>Từ chối ({selectedPosts.length})</button>
                <button className="btn-danger" onClick={handleBulkDelete}>Xóa ({selectedPosts.length})</button>
              </>
            )}
          </div>

          <div className="pagination">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>⟪</button>
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>⟨</button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>⟩</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>⟫</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
