import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Card,
  Typography,
  Pagination,
  Modal,
  notification,
  Spin,
  Alert,
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { adminService } from '../../services/adminService';

const { Option } = Select;
const { Title, Text } = Typography;
const { confirm } = Modal;

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sortOrder, setSortOrder] = useState({}); // { field: 'id', order: 'ascend' }

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  // 1. Refine dependencies for useCallback
  const fetchPosts = useCallback(async (
    page = pagination.current, // Use defaults from state if not provided
    pageSize = pagination.pageSize,
    status = filterStatus,
    search = searchTerm,
    sort = sortOrder
  ) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: page,
        size: pageSize,
        status: status === 'all' ? undefined : status,
        search: search || undefined,
      };

      if (sort.field) {
        params.sort = `${sort.field},${sort.order === 'ascend' ? 'asc' : 'desc'}`;
      }

      const response = await adminService.getPosts(params);
      const data = Array.isArray(response?.items) ? response.items : Array.isArray(response) ? response : [];

      setPosts(
        data.map((p) => ({
          key: p.id || p.postId,
          id: p.id || p.postId,
          title: p.title,
          provinceCity: p.provinceCity || p.location,
          postType: p.postType || p.type,
          createdAt: p.createdAt,
          memberId: p.memberId,
          price: p.price,
          status: p.status || 'pending',
        }))
      );
      // ONLY update total here. current and pageSize are managed by handleTableChange
      setPagination((prev) => ({
        ...prev,
        total: response?.totalItems || 0,
      }));
    } catch (e) {
      setError(e?.response?.data?.message || 'Không thể tải danh sách bài đăng');
      notification.error({
        message: 'Lỗi tải dữ liệu',
        description: e?.response?.data?.message || 'Không thể tải danh sách bài đăng',
      });
    } finally {
      setLoading(false);
    }
  }, [error]);


  // 2. useEffect now explicitly calls fetchPosts with current state values
  useEffect(() => {
    fetchPosts(pagination.current, pagination.pageSize, filterStatus, searchTerm, sortOrder);
  }, [pagination.current, pagination.pageSize, filterStatus, searchTerm, sortOrder, fetchPosts]);


  const handleTableChange = (newPagination, filters, sorter) => {
    // Only update pagination state here. useEffect will react to these changes.
    setPagination(newPagination);

    // Update sortOrder state
    if (sorter.field) {
      setSortOrder({ field: sorter.field, order: sorter.order });
    } else {
      setSortOrder({});
    }
  };

  // ... rest of the component remains the same ...
  const handleApprove = async (id) => {
    try {
      await adminService.approvePost(id);
      notification.success({ message: 'Duyệt bài đăng thành công' });
      // After an action, we want to refetch the current page to reflect changes
      fetchPosts(pagination.current, pagination.pageSize, filterStatus, searchTerm, sortOrder);
    } catch (e) {
      notification.error({
        message: 'Duyệt bài thất bại',
        description: e?.response?.data?.message || 'Có lỗi xảy ra khi duyệt bài.',
      });
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectPost(id);
      notification.success({ message: 'Từ chối bài đăng thành công' });
      fetchPosts(pagination.current, pagination.pageSize, filterStatus, searchTerm, sortOrder);
    } catch (e) {
      notification.error({
        message: 'Từ chối bài thất bại',
        description: e?.response?.data?.message || 'Có lỗi xảy ra khi từ chối bài.',
      });
    }
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa bài đăng này?',
      icon: <ExclamationCircleOutlined />,
      content: `Mã bài đăng: ${id}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // await adminService.deletePost(id); // Uncomment when implemented
          // For frontend simulation, filter posts directly.
          // For real API, fetchPosts() would reflect the change from the backend.
          setPosts(prev => prev.filter(p => p.id !== id));
          notification.success({ message: 'Xóa bài đăng thành công' });
          setSelectedRowKeys(prev => prev.filter(key => key !== id));
          fetchPosts(pagination.current, pagination.pageSize, filterStatus, searchTerm, sortOrder); // Refetch to get updated total/pages
        } catch (e) {
          notification.error({
            message: 'Xóa bài thất bại',
            description: e?.response?.data?.message || 'Có lỗi xảy ra khi xóa bài.',
          });
        }
      },
    });
  };

  const handleBulkApprove = async () => {
    confirm({
      title: `Bạn có chắc chắn muốn duyệt ${selectedRowKeys.length} bài đăng đã chọn?`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Duyệt',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map((id) => adminService.approvePost(id)));
          notification.success({ message: 'Duyệt hàng loạt thành công' });
          setSelectedRowKeys([]);
          fetchPosts(pagination.current, pagination.pageSize, filterStatus, searchTerm, sortOrder);
        } catch (e) {
          notification.error({
            message: 'Duyệt hàng loạt thất bại',
            description: e?.response?.data?.message || 'Có lỗi xảy ra khi duyệt hàng loạt.',
          });
        }
      },
    });
  };

  const handleBulkReject = async () => {
    confirm({
      title: `Bạn có chắc chắn muốn từ chối ${selectedRowKeys.length} bài đăng đã chọn?`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Từ chối',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map((id) => adminService.rejectPost(id)));
          notification.success({ message: 'Từ chối hàng loạt thành công' });
          setSelectedRowKeys([]);
          fetchPosts(pagination.current, pagination.pageSize, filterStatus, searchTerm, sortOrder);
        } catch (e) {
          notification.error({
            message: 'Từ chối hàng loạt thất bại',
            description: e?.response?.data?.message || 'Có lỗi xảy ra khi từ chối hàng loạt.',
          });
        }
      },
    });
  };

  const handleBulkDelete = () => {
    confirm({
      title: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} bài đăng đã chọn?`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // await Promise.all(selectedRowKeys.map(id => adminService.deletePost(id))); // Uncomment when implemented
          setPosts(prev => prev.filter(p => !selectedRowKeys.includes(p.id))); // For frontend simulation
          notification.success({ message: 'Xóa hàng loạt thành công' });
          setSelectedRowKeys([]);
          fetchPosts(pagination.current, pagination.pageSize, filterStatus, searchTerm, sortOrder);
        } catch (e) {
          notification.error({
            message: 'Xóa hàng loạt thất bại',
            description: e?.response?.data?.message || 'Có lỗi xảy ra khi xóa hàng loạt.',
          });
        }
      },
    });
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'pending':
        return <Tag color="gold">Chờ duyệt</Tag>;
      case 'approved':
        return <Tag color="green">Đã duyệt</Tag>;
      case 'rejected':
        return <Tag color="red">Từ chối</Tag>;
      default:
        return <Tag>Không rõ</Tag>;
    }
  };

  const statusCounts = useMemo(() => {
    // This should ideally reflect the backend counts, not just the currently fetched `posts` array.
    // If your API provides total counts for each status, use that.
    // For now, it reflects the `posts` in state.
    const counts = { all: 0, pending: 0, approved: 0, rejected: 0 };
    posts.forEach((p) => {
      counts.all++;
      if (p.status in counts) {
        counts[p.status]++;
      }
    });
    return counts;
  }, [posts]); // Recalculate if `posts` changes

  const columns = [
    {
      title: 'Mã bài đăng',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Tỉnh/Thành phố',
      dataIndex: 'provinceCity',
      key: 'provinceCity',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Loại bài',
      dataIndex: 'postType',
      key: 'postType',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      render: (text) => formatDisplayDate(text),
    },
    {
      title: 'Mã thành viên',
      dataIndex: 'memberId',
      key: 'memberId',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      render: (text) =>
        Number(text || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record.id)}
                title="Duyệt"
              />
              <Button
                type="danger"
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(record.id)}
                title="Từ chối"
              />
            </>
          )}
          {record.status === 'approved' && (
            <Button
              type="danger"
              icon={<CloseCircleOutlined />}
              onClick={() => handleReject(record.id)}
              title="Từ chối"
            />
          )}
          {record.status === 'rejected' && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleApprove(record.id)}
              title="Duyệt"
            />
          )}
          <Button icon={<EyeOutlined />} title="Chi tiết" />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <Card
      title={<Title level={4}>Duyệt bài đăng</Title>}
      extra={
        <Space>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            value={pagination.pageSize}
            onChange={(value) => setPagination((prev) => ({ ...prev, pageSize: value, current: 1 }))} // Reset current to 1 when page size changes
            style={{ width: 120 }}
          >
            <Option value={10}>10 dòng</Option>
            <Option value={25}>25 dòng</Option>
            <Option value={50}>50 dòng</Option>
          </Select>
        </Space>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => setFilterStatus('all')} type={filterStatus === 'all' ? 'primary' : 'default'}>
          Tất cả ({statusCounts.all})
        </Button>
        <Button onClick={() => setFilterStatus('pending')} type={filterStatus === 'pending' ? 'primary' : 'default'}>
          Chờ duyệt ({statusCounts.pending})
        </Button>
        <Button onClick={() => setFilterStatus('approved')} type={filterStatus === 'approved' ? 'primary' : 'default'}>
          Đã duyệt ({statusCounts.approved})
        </Button>
        <Button onClick={() => setFilterStatus('rejected')} type={filterStatus === 'rejected' ? 'primary' : 'default'}>
          Từ chối ({statusCounts.rejected})
        </Button>
      </Space>

      {error && <Alert message="Lỗi" description={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      <Table
        columns={columns}
        dataSource={posts}
        loading={loading}
        rowSelection={rowSelection}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} bài đăng`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
      />

      {selectedRowKeys.length > 0 && (
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Đã chọn {selectedRowKeys.length} bài đăng</Text>
          <Space>
            <Button type="primary" onClick={handleBulkApprove}>
              Duyệt hàng loạt ({selectedRowKeys.length})
            </Button>
            <Button type="warning" onClick={handleBulkReject}>
              Từ chối hàng loạt ({selectedRowKeys.length})
            </Button>
            <Button type="danger" onClick={handleBulkDelete}>
              Xóa hàng loạt ({selectedRowKeys.length})
            </Button>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default Posts;