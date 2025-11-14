import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import api from "../../config/api";

import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Card,
  Typography,
  Modal,
  notification,
  Alert,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;
const { confirm } = Modal;

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, approved, rejected
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sortOrder, setSortOrder] = useState({}); // { field: 'id', order: 'ascend' }
  const [approvingIds, setApprovingIds] = useState([]);
  const [rejectingIds, setRejectingIds] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);

  const member = useSelector((state) => state.member);
  const adminMemberId = useMemo(
    () =>
      (member &&
        (member.id ?? member.memberId ?? member.accountId ?? member.userId)) ||
      null,
    [member]
  );

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  // 1. Refine dependencies for useCallback
  const fetchPosts = useCallback(
    async (page, pageSize, status, search, sort) => {
      setLoading(true);
      setError("");
      try {
        // Convert frontend status values to backend enum values
        const getBackendStatus = (frontendStatus) => {
          switch (frontendStatus) {
            case "pending":
              return "PENDING_APPROVAL";
            case "approved":
              return "APPROVED";
            case "rejected":
              return "REJECTED";
            case "deleted":
              return "DELETED";
            case "archived":
              return "ARCHIVED";
            case "all":
              return undefined;
            default:
              return undefined;
          }
        };

        // Use different endpoints based on whether we're filtering by status
        let res;
        let actualParams;

        if (status === "all") {
          // Get all articles - don't send status parameter
          actualParams = {
            page: page,
            size: pageSize,
            search: search || undefined,
          };
          if (sort.field) {
            actualParams.sort = `${sort.field},${
              sort.order === "ascend" ? "asc" : "desc"
            }`;
          }
          res = await api.get("/article", { params: actualParams });
        } else {
          // Get articles by specific status using the dedicated endpoint
          actualParams = {
            status: getBackendStatus(status),
            page: page,
            size: pageSize,
            search: search || undefined,
          };
          if (sort.field) {
            actualParams.sort = `${sort.field},${
              sort.order === "ascend" ? "asc" : "desc"
            }`;
          }
          res = await api.get("/article/status", { params: actualParams });
        }
        const response = res.data;

        // Debug: Log the API response to see what statuses we're getting
        console.log("📊 API Response Debug:", {
          endpoint: status === "all" ? "/article" : "/article/status",
          params: actualParams,
          totalItems: response?.totalItems || response?.totalElements || 0,
          itemsCount:
            response?.items?.length ||
            response?.content?.length ||
            response?.length ||
            0,
          sampleStatuses: (
            response?.items ||
            response?.content ||
            response ||
            []
          )
            .slice(0, 3)
            .map((p) => ({
              id: p.articleId || p.id,
              rawStatus: p.status || p.articleStatus,
              normalizedStatus: (() => {
                const raw = (p.status || p.articleStatus || "PENDING_APPROVAL")
                  .toString()
                  .trim()
                  .toUpperCase();
                switch (raw) {
                  case "PENDING_APPROVAL":
                    return "pending";
                  case "APPROVED":
                    return "approved";
                  case "REJECTED":
                    return "rejected";
                  case "DELETED":
                    return "deleted";
                  case "ARCHIVED":
                    return "archived";
                  default:
                    return "pending";
                }
              })(),
            })),
        });
        const data = Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response)
          ? response
          : Array.isArray(response?.content)
          ? response.content
          : [];

        setPosts(
          data.map((p) => ({
            key: p.articleId || p.id || p.postId,
            id: p.articleId || p.id || p.postId,
            title: p.title,
            provinceCity: p.provinceCity || p.location,
            postType: (() => {
              const primary = p.articleType || p.postType || "";
              const secondary = (p.type || "").toString();
              const pick =
                primary ||
                (/(car|battery|motor)/i.test(secondary) ? secondary : "");
              const norm = pick.toString().toUpperCase();
              if (norm.includes("BATTERY")) return "battery";
              if (norm.includes("CAR")) return "car";
              if (norm.includes("MOTOR")) return "motor";
              return "";
            })(),
            createdAt: p.createdAt || p.publicDate || p.postedDate,
            memberId: p.memberId,
            price: p.price,
            status: (() => {
              const raw = (p.status || p.articleStatus || "PENDING_APPROVAL")
                .toString()
                .trim()
                .toUpperCase();
              // Map backend enum values to frontend status
              switch (raw) {
                case "PENDING_APPROVAL":
                  return "pending";
                case "APPROVED":
                  return "approved";
                case "REJECTED":
                  return "rejected";
                case "DELETED":
                  return "deleted";
                case "ARCHIVED":
                  return "archived";
                default:
                  return "pending"; // fallback
              }
            })(),
          }))
        );
        // ONLY update total here. current and pageSize are managed by handleTableChange
        setPagination((prev) => ({
          ...prev,
          total:
            response?.totalItems || response?.totalElements || data.length || 0,
        }));
      } catch (e) {
        setError(
          e?.response?.data?.message || "Không thể tải danh sách bài đăng"
        );
        notification.error({
          message: "Lỗi tải dữ liệu",
          description:
            e?.response?.data?.message || "Không thể tải danh sách bài đăng",
        });
      } finally {
        setLoading(false);
      }
    },
    [] // Stable function with no dependencies
  );

  // 2. useEffect to fetch posts when dependencies change
  useEffect(() => {
    fetchPosts(
      pagination.current,
      pagination.pageSize,
      filterStatus,
      searchTerm,
      sortOrder
    );
  }, [
    pagination.current,
    pagination.pageSize,
    filterStatus,
    searchTerm,
    sortOrder,
    fetchPosts,
  ]);

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
      setApprovingIds((prev) => [...prev, id]);
      if (!adminMemberId) {
        notification.error({ message: "Không tìm thấy mã quản trị để duyệt" });
        return;
      }
      const res = await api.post(
        `/article/${id}/approve?memberId=${adminMemberId}`
      );
      console.log("Approve response:", {
        status: res.status,
        data: res.data,
        id,
      });
      notification.success({ message: "Duyệt bài đăng thành công" });
      fetchPosts(
        pagination.current,
        pagination.pageSize,
        filterStatus,
        searchTerm,
        sortOrder
      );
    } catch (e) {
      console.error("Approve error:", e?.response || e);
      notification.error({
        message: "Duyệt bài thất bại",
        description:
          e?.response?.data?.message || "Có lỗi xảy ra khi duyệt bài.",
      });
    } finally {
      setApprovingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleReject = async (id) => {
    try {
      setRejectingIds((prev) => [...prev, id]);
      if (!adminMemberId) {
        notification.error({
          message: "Không tìm thấy mã quản trị để từ chối",
        });
        return;
      }
      const res = await api.post(
        `/article/${id}/reject?memberId=${adminMemberId}`
      );
      console.log("Reject response:", {
        status: res.status,
        data: res.data,
        id,
      });
      notification.success({ message: "Từ chối bài đăng thành công" });
      fetchPosts(
        pagination.current,
        pagination.pageSize,
        filterStatus,
        searchTerm,
        sortOrder
      );
    } catch (e) {
      console.error("Reject error:", e?.response || e);
      notification.error({
        message: "Từ chối bài thất bại",
        description:
          e?.response?.data?.message || "Có lỗi xảy ra khi từ chối bài.",
      });
    } finally {
      setRejectingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingIds((prev) => [...prev, id]);
      const res = await api.delete(`/article/${id}?memberId=${adminMemberId}`);
      console.log("Delete response:", {
        status: res.status,
        data: res.data,
        id,
      });
      notification.success({ message: "Xóa bài đăng thành công" });
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
      fetchPosts(
        pagination.current,
        pagination.pageSize,
        filterStatus,
        searchTerm,
        sortOrder
      );
    } catch (e) {
      console.error("Delete error:", e?.response || e);
      notification.error({
        message: "Xóa bài thất bại",
        description: e?.response?.data?.message || "Có lỗi xảy ra khi xóa bài.",
      });
    } finally {
      setDeletingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleBulkApprove = async () => {
    confirm({
      title: `Bạn có chắc chắn muốn duyệt ${selectedRowKeys.length} bài đăng đã chọn?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Duyệt",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          if (!adminMemberId) {
            notification.error({
              message: "Không tìm thấy mã quản trị để duyệt",
            });
            return;
          }
          await Promise.all(
            selectedRowKeys.map((id) =>
              api.post(`/article/${id}/approve?memberId=${adminMemberId}`)
            )
          );
          notification.success({ message: "Duyệt hàng loạt thành công" });
          setSelectedRowKeys([]);
          fetchPosts(
            pagination.current,
            pagination.pageSize,
            filterStatus,
            searchTerm,
            sortOrder
          );
        } catch (e) {
          console.error("Bulk approve error:", e?.response || e);
          notification.error({
            message: "Duyệt hàng loạt thất bại",
            description:
              e?.response?.data?.message ||
              "Có lỗi xảy ra khi duyệt hàng loạt.",
          });
        }
      },
    });
  };

  const handleBulkReject = async () => {
    confirm({
      title: `Bạn có chắc chắn muốn từ chối ${selectedRowKeys.length} bài đăng đã chọn?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Từ chối",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          if (!adminMemberId) {
            notification.error({
              message: "Không tìm thấy mã quản trị để từ chối",
            });
            return;
          }
          await Promise.all(
            selectedRowKeys.map((id) =>
              api.post(`/article/${id}/reject?memberId=${adminMemberId}`)
            )
          );
          notification.success({ message: "Từ chối hàng loạt thành công" });
          setSelectedRowKeys([]);
          fetchPosts(
            pagination.current,
            pagination.pageSize,
            filterStatus,
            searchTerm,
            sortOrder
          );
        } catch (e) {
          console.error("Bulk reject error:", e?.response || e);
          notification.error({
            message: "Từ chối hàng loạt thất bại",
            description:
              e?.response?.data?.message ||
              "Có lỗi xảy ra khi từ chối hàng loạt.",
          });
        }
      },
    });
  };

  const handleBulkDelete = () => {
    confirm({
      title: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} bài đăng đã chọn?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys.map((id) =>
              api.delete(`/article/${id}?memberId=${adminMemberId}`)
            )
          );
          notification.success({ message: "Xóa hàng loạt thành công" });
          setSelectedRowKeys([]);
          fetchPosts(
            pagination.current,
            pagination.pageSize,
            filterStatus,
            searchTerm,
            sortOrder
          );
        } catch (e) {
          notification.error({
            message: "Xóa hàng loạt thất bại",
            description:
              e?.response?.data?.message || "Có lỗi xảy ra khi xóa hàng loạt.",
          });
        }
      },
    });
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "pending":
        return <Tag color="warning">Chờ duyệt</Tag>;
      case "approved":
        return <Tag color="success">Đã duyệt</Tag>;
      case "rejected":
        return <Tag color="error">Từ chối</Tag>;
      case "deleted":
        return <Tag color="red">Đã xóa</Tag>;
      case "archived":
        return <Tag color="default">Lưu trữ</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  const statusCounts = useMemo(() => {
    // This should ideally reflect the backend counts, not just the currently fetched `posts` array.
    // If your API provides total counts for each status, use that.
    // For now, it reflects the `posts` in state.
    const counts = {
      all: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      deleted: 0,
      archived: 0,
    };
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
      title: "Mã bài đăng",
      dataIndex: "id",
      key: "id",
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Tỉnh/Thành phố",
      dataIndex: "provinceCity",
      key: "provinceCity",
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Loại bài",
      dataIndex: "postType",
      key: "postType",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (text) =>
        text ? text.charAt(0).toUpperCase() + text.slice(1) : "—",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (text) => formatDisplayDate(text),
    },
    {
      title: "Mã thành viên",
      dataIndex: "memberId",
      key: "memberId",
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (text) =>
        Number(text || 0).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (status) => getStatusTag(status),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          {record.status === "pending" && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record.id)}
                loading={approvingIds.includes(record.id)}
                title="Duyệt"
              />
              <Button
                type="danger"
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(record.id)}
                loading={rejectingIds.includes(record.id)}
                title="Từ chối"
              />
            </>
          )}
          {record.status === "approved" && (
            <Button
              type="danger"
              icon={<CloseCircleOutlined />}
              onClick={() => handleReject(record.id)}
              loading={rejectingIds.includes(record.id)}
              title="Từ chối"
            />
          )}
          {record.status === "rejected" && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleApprove(record.id)}
              loading={approvingIds.includes(record.id)}
              title="Duyệt"
            />
          )}
          <Button icon={<EyeOutlined />} title="Chi tiết" />
          <Popconfirm
            title="Xóa bài đăng?"
            description={`Mã bài đăng: ${record.id}`}
            okText="Xóa"
            okType="danger"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              loading={deletingIds.includes(record.id)}
              title="Xóa"
            />
          </Popconfirm>
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
            onChange={(value) =>
              setPagination((prev) => ({
                ...prev,
                pageSize: value,
                current: 1,
              }))
            } // Reset current to 1 when page size changes
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
        <Button
          onClick={() => setFilterStatus("all")}
          type={filterStatus === "all" ? "primary" : "default"}
        >
          Tất cả ({statusCounts.all})
        </Button>
        <Button
          onClick={() => setFilterStatus("pending")}
          type={filterStatus === "pending" ? "primary" : "default"}
        >
          Chờ duyệt ({statusCounts.pending})
        </Button>
        <Button
          onClick={() => setFilterStatus("approved")}
          type={filterStatus === "approved" ? "primary" : "default"}
        >
          Đã duyệt ({statusCounts.approved})
        </Button>
        <Button
          onClick={() => setFilterStatus("rejected")}
          type={filterStatus === "rejected" ? "primary" : "default"}
        >
          Từ chối ({statusCounts.rejected})
        </Button>
      </Space>

      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Table
        columns={columns}
        dataSource={posts}
        loading={loading}
        rowSelection={rowSelection}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} bài đăng`,
        }}
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
      />

      {selectedRowKeys.length > 0 && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
