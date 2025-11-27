import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  Descriptions,
  Spin,
  Image,
  Form,
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
  const navigate = useNavigate();
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
  const [approvingIds, setApprovingIds] = useState([]);
  const [rejectingIds, setRejectingIds] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailArticle, setDetailArticle] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectingArticleId, setRejectingArticleId] = useState(null);
  const [rejectForm] = Form.useForm();

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
    async (page, pageSize, status, search) => {
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
            // Remove server-side sorting
          };
          res = await api.get("/article", { params: actualParams });
        } else {
          // Get articles by specific status using the dedicated endpoint
          actualParams = {
            status: getBackendStatus(status),
            page: page,
            size: pageSize,
            search: search || undefined,
            // Remove server-side sorting
          };
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

        // Sort by ID in descending order on the client side
        const sortedData = [...data].sort((a, b) => {
          const idA = a.articleId || a.id || a.postId || 0;
          const idB = b.articleId || b.id || b.postId || 0;
          return idB - idA; // Sort in descending order
        });

        setPosts(
          sortedData.map((p) => ({
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
      searchTerm
    );
  }, [
    pagination.current,
    pagination.pageSize,
    filterStatus,
    searchTerm,
    fetchPosts,
  ]);

  const handleViewDetail = async (id) => {
    try {
      setDetailLoading(true);
      setDetailVisible(true);
      const res = await api.get(`/article/${id}`);
      setDetailArticle(res.data);
    } catch (e) {
      console.error("Load article detail error:", e?.response || e);
      notification.error({
        message: "Không thể tải chi tiết bài đăng",
        description:
          e?.response?.data?.message ||
          "Đã xảy ra lỗi khi tải chi tiết bài đăng.",
      });
      setDetailVisible(false);
      setDetailArticle(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    // Only update pagination state here. useEffect will react to these changes.
    setPagination(newPagination);
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
        searchTerm
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

  const handleReject = (id) => {
    setRejectingArticleId(id);
    setRejectModalVisible(true);
    rejectForm.resetFields();
  };

  const handleRejectSubmit = async () => {
    try {
      const values = await rejectForm.validateFields();
      const id = rejectingArticleId;

      if (!id) {
        notification.error({ message: "Không tìm thấy ID bài đăng" });
        return;
      }

      setRejectingIds((prev) => [...prev, id]);
      if (!adminMemberId) {
        notification.error({
          message: "Không tìm thấy mã quản trị để từ chối",
        });
        return;
      }

      const res = await api.post(
        `/article/${id}/reject?memberId=${adminMemberId}`,
        { rejectionReason: values.rejectionReason }
      );

      console.log("Reject response:", {
        status: res.status,
        data: res.data,
        id,
      });

      notification.success({ message: "Từ chối bài đăng thành công" });
      setRejectModalVisible(false);
      setRejectingArticleId(null);
      rejectForm.resetFields();

      fetchPosts(
        pagination.current,
        pagination.pageSize,
        filterStatus,
        searchTerm
      );
    } catch (e) {
      if (e.errorFields) {
        // Form validation errors
        return;
      }
      console.error("Reject error:", e?.response || e);
      notification.error({
        message: "Từ chối bài thất bại",
        description:
          e?.response?.data?.message || "Có lỗi xảy ra khi từ chối bài.",
      });
    } finally {
      if (rejectingArticleId) {
        setRejectingIds((prev) => prev.filter((x) => x !== rejectingArticleId));
      }
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
        searchTerm
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
            searchTerm
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

  const handleBulkReject = () => {
    if (selectedRowKeys.length === 0) {
      notification.warning({ message: "Vui lòng chọn ít nhất một bài đăng" });
      return;
    }

    Modal.confirm({
      title: `Từ chối ${selectedRowKeys.length} bài đăng đã chọn`,
      content: (
        <Form form={rejectForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="rejectionReason"
            label="Lý do từ chối"
            rules={[
              { required: true, message: "Vui lòng nhập lý do từ chối" },
              { min: 10, message: "Lý do từ chối phải có ít nhất 10 ký tự" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập lý do từ chối bài đăng..."
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: "Từ chối",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const values = await rejectForm.validateFields();

          if (!adminMemberId) {
            notification.error({
              message: "Không tìm thấy mã quản trị để từ chối",
            });
            return;
          }

          await Promise.all(
            selectedRowKeys.map((id) =>
              api.post(`/article/${id}/reject?memberId=${adminMemberId}`, {
                rejectionReason: values.rejectionReason,
              })
            )
          );

          notification.success({ message: "Từ chối hàng loạt thành công" });
          setSelectedRowKeys([]);
          rejectForm.resetFields();

          fetchPosts(
            pagination.current,
            pagination.pageSize,
            filterStatus,
            searchTerm
          );
        } catch (e) {
          if (e.errorFields) {
            // Form validation errors
            return Promise.reject(e);
          }
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
    if (selectedRowKeys.length === 0) {
      notification.warning({ message: "Vui lòng chọn ít nhất một bài đăng" });
      return;
    }

    const hasApproved = selectedRowKeys.some((id) => {
      const post = posts.find((p) => p.id === id);
      return post && post.status === "approved";
    });

    if (hasApproved) {
      notification.warning({
        message: "Không thể xóa bài đăng đã duyệt",
        description: "Vui lòng bỏ chọn các bài đăng đã duyệt trước khi xóa.",
      });
      return;
    }

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
            searchTerm
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
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tỉnh/Thành phố",
      dataIndex: "provinceCity",
      key: "provinceCity",
    },
    {
      title: "Loại bài",
      dataIndex: "postType",
      key: "postType",
      render: (text) =>
        text ? text.charAt(0).toUpperCase() + text.slice(1) : "—",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDisplayDate(text),
    },
    {
      title: "Mã thành viên",
      dataIndex: "memberId",
      key: "memberId",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
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
          <Button
            icon={<EyeOutlined />}
            title="Xem chi tiết / Chỉnh sửa"
            onClick={() => handleViewDetail(record.id)}
          >
            Xem chi tiết
          </Button>
          {record.status !== "approved" && (
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
          )}
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

      <Modal
        open={detailVisible}
        title={
          detailArticle
            ? `Chi tiết bài đăng #${
                detailArticle.articleId || detailArticle.id || ""
              }`
            : "Chi tiết bài đăng"
        }
        footer={null}
        onCancel={() => {
          setDetailVisible(false);
          setDetailArticle(null);
        }}
        width={800}
      >
        {detailLoading ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <Spin />
          </div>
        ) : detailArticle ? (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã bài đăng">
              {detailArticle.articleId || detailArticle.id}
            </Descriptions.Item>
            <Descriptions.Item label="Tiêu đề">
              {detailArticle.title}
            </Descriptions.Item>
            <Descriptions.Item label="Nội dung">
              {detailArticle.content}
            </Descriptions.Item>
            <Descriptions.Item label="Tỉnh/Thành phố">
              {detailArticle.provinceCity || detailArticle.location}
            </Descriptions.Item>
            <Descriptions.Item label="Loại bài">
              {detailArticle.articleType}
            </Descriptions.Item>
            <Descriptions.Item label="Thành viên">
              {detailArticle.memberName} (ID: {detailArticle.memberId})
            </Descriptions.Item>
            {detailArticle.contactPhone && (
              <Descriptions.Item label="Số điện thoại liên hệ">
                {detailArticle.contactPhone}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Giá">
              {Number(detailArticle.price || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {formatDisplayDate(
                detailArticle.createdAt ||
                  detailArticle.createAt ||
                  detailArticle.publicDate ||
                  detailArticle.postedDate
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(
                (() => {
                  const raw = (
                    detailArticle.status ||
                    detailArticle.articleStatus ||
                    "PENDING_APPROVAL"
                  )
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
                })()
              )}
            </Descriptions.Item>
            {detailArticle.brand && (
              <Descriptions.Item label="Hãng xe">
                {detailArticle.brand}
              </Descriptions.Item>
            )}
            {detailArticle.year && (
              <Descriptions.Item label="Năm sản xuất">
                {detailArticle.year}
              </Descriptions.Item>
            )}
            {detailArticle.vehicleCapacity && (
              <Descriptions.Item label="Dung tích (cc)">
                {detailArticle.vehicleCapacity}
              </Descriptions.Item>
            )}
            {detailArticle.licensesPlate && (
              <Descriptions.Item label="Biển số xe">
                {detailArticle.licensesPlate}
              </Descriptions.Item>
            )}
            {detailArticle.origin && (
              <Descriptions.Item label="Xuất xứ">
                {detailArticle.origin}
              </Descriptions.Item>
            )}
            {detailArticle.milesTraveled && (
              <Descriptions.Item label="Số km đã đi">
                {detailArticle.milesTraveled}
              </Descriptions.Item>
            )}
            {detailArticle.warrantyMonths && (
              <Descriptions.Item label="Bảo hành (tháng)">
                {detailArticle.warrantyMonths}
              </Descriptions.Item>
            )}
            {detailArticle.mainImageUrl && (
              <Descriptions.Item label="Ảnh chính">
                <Image
                  src={detailArticle.mainImageUrl}
                  alt={detailArticle.title}
                  width={200}
                />
              </Descriptions.Item>
            )}
            {detailArticle.description && (
              <Descriptions.Item label="Mô tả">
                {detailArticle.description}
              </Descriptions.Item>
            )}
            {detailArticle.rejectionReason && (
              <Descriptions.Item label="Lý do từ chối">
                <Alert
                  message={detailArticle.rejectionReason}
                  type="error"
                  showIcon
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : (
          <Text>Không có dữ liệu bài đăng.</Text>
        )}
      </Modal>

      {/* Modal nhập lý do từ chối */}
      <Modal
        title="Từ chối bài đăng"
        open={rejectModalVisible}
        onOk={handleRejectSubmit}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectingArticleId(null);
          rejectForm.resetFields();
        }}
        okText="Từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        confirmLoading={
          rejectingArticleId && rejectingIds.includes(rejectingArticleId)
        }
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="rejectionReason"
            label="Lý do từ chối"
            rules={[
              { required: true, message: "Vui lòng nhập lý do từ chối" },
              { min: 10, message: "Lý do từ chối phải có ít nhất 10 ký tự" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập lý do từ chối bài đăng (tối thiểu 10 ký tự)..."
              showCount
              maxLength={500}
            />
          </Form.Item>
          <Alert
            message="Lưu ý"
            description="Lý do từ chối sẽ được gửi qua email cho người đăng bài."
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Form>
      </Modal>

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
