import React, { useState, useEffect } from "react";
import "./users.scss";
import { useDispatch } from "react-redux";
import { fetchUsers as fetchUsersThunk } from "../../redux/adminSlice";
import api from "../../config/api";
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Typography,
  Tag,
  Popconfirm,
  Spin,
  Alert,
  message,
} from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const Users = () => {
  const dispatch = useDispatch();
  // API state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // No status filtering - always show all users
  // Fetch users
  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {
          page: currentPage,
          size: itemsPerPage,
          search: searchTerm || undefined,
        };

        console.log("📊 Users API Debug:", {
          endpoint: "/admin/users",
          params,
        });
        const action = await dispatch(fetchUsersThunk(params));
        if (fetchUsersThunk.fulfilled.match(action)) {
          const data = action.payload;
          console.log("User data from API:", data); // Debug log to check API response
          const list = Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
            ? data
            : [];
          setUsers(
            list.map((u) => ({
              nameId: u.nameId || u.memberId || u.id,
              fullName: u.fullName || u.name,
              address: u.address,
              dateOfBirth: u.dateOfBirth,
              phoneNumber: u.phoneNumber || u.phone,
              role: u.role,
              email: u.email,
              gender: u.gender || u.sex,
              dateSignup: u.dateSignup || u.createdAt,
              status: (() => {
                const raw = (u.status || "ACTIVE")
                  .toString()
                  .trim()
                  .toUpperCase();
                // Map backend enum values to frontend status
                switch (raw) {
                  case "ACTIVE":
                    return "active";
                  case "INACTIVE":
                    return "inactive";
                  case "BLOCKED":
                    return "blocked"; // Legacy support
                  default:
                    return u.blocked ? "blocked" : "active"; // Fallback
                }
              })(),
              postsCount: u.postsCount ?? u.numPosts ?? 0,
              violationsCount: u.violationsCount ?? u.numViolations ?? 0,
            }))
          );
        } else {
          throw new Error(
            action.payload || "Không thể tải danh sách người dùng"
          );
        }
      } catch (e) {
        setError(
          e?.response?.data?.message || "Không thể tải danh sách người dùng"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    return () => controller.abort();
  }, [currentPage, itemsPerPage, searchTerm]);

  // Filter users based on search term only
  const filteredUsers = users.filter((user) => {
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return Object.values(user).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term)
      );
    }

    return true;
  });

  // Handlers for user actions
  const handleDelete = async (nameId) => {
    try {
      console.log("🗑️ Deleting user:", {
        endpoint: `/members/${nameId}`,
        nameId,
      });

      const res = await api.delete(`/members/${nameId}`);
      console.log("✅ Delete response:", {
        status: res.status,
        data: res.data,
        nameId,
      });

      // Remove from local state
      setUsers((prev) => prev.filter((user) => user.nameId !== nameId));
      setSelectedUsers((prev) => prev.filter((id) => id !== nameId));

      message.success("Xóa người dùng thành công");
    } catch (e) {
      console.error("❌ Delete error:", e?.response || e);
      message.error(
        "Xóa người dùng thất bại: " +
          (e?.response?.data?.message || "Có lỗi xảy ra khi xóa người dùng.")
      );
    }
  };

  const handleBulkDelete = async () => {
    try {
      console.log("🗑️ Bulk deleting users:", { userIds: selectedUsers });

      // Delete all selected users in parallel
      const deletePromises = selectedUsers.map((nameId) =>
        api.delete(`/members/${nameId}`)
      );

      await Promise.all(deletePromises);

      console.log("✅ Bulk delete successful");

      // Remove from local state
      setUsers((prev) =>
        prev.filter((user) => !selectedUsers.includes(user.nameId))
      );
      setSelectedUsers([]);

      message.success(`Xóa ${selectedUsers.length} người dùng thành công`);
    } catch (e) {
      console.error("❌ Bulk delete error:", e?.response || e);
      message.error(
        "Xóa hàng loạt thất bại: " +
          (e?.response?.data?.message || "Có lỗi xảy ra khi xóa người dùng.")
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("vi-VN");
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "active":
        return <Tag color="success">Hoạt động</Tag>;
      case "inactive":
        return <Tag color="default">Không hoạt động</Tag>;
      case "blocked":
        return <Tag color="error">Đã khóa</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  const totalUsers = users.length;

  // Define table columns for Ant Design Table
  const columns = [
    {
      title: "Mã người dùng",
      dataIndex: "nameId",
      key: "nameId",
      width: 120,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 130,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (gender) => {
        const genderMap = {
          MALE: "Nam",
          FEMALE: "Nữ",
          OTHER: "Khác",
        };
        return genderMap[gender] || gender || "Chưa xác định";
      },
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role) => {
        const roleMap = {
          ADMIN: "Quản trị viên",
          MEMBER: "Thành viên",
        };
        return roleMap[role] || role || "Chưa xác định";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="Xóa người dùng?"
            description={`Mã người dùng: ${record.nameId}`}
            onConfirm={() => handleDelete(record.nameId)}
            okText="Xóa"
            okType="danger"
            cancelText="Hủy"
          >
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              size="small"
              title="Xóa người dùng"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle table change (pagination only)
  const handleTableChange = (paginationInfo) => {
    if (paginationInfo.current !== currentPage) {
      setCurrentPage(paginationInfo.current);
    }
    if (paginationInfo.pageSize !== itemsPerPage) {
      setItemsPerPage(paginationInfo.pageSize);
      setCurrentPage(1);
    }
  };

  // Row selection for bulk actions
  const rowSelection = {
    selectedRowKeys: selectedUsers,
    onChange: (selectedRowKeys) => {
      setSelectedUsers(selectedRowKeys);
    },
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error}
        type="error"
        showIcon
        style={{ margin: 16 }}
      />
    );
  }

  return (
    <Card
      title={<Title level={4}>Quản lý người dùng</Title>}
      extra={
        <Space>
          <Input
            placeholder="Tìm kiếm người dùng..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            value={itemsPerPage}
            onChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
            style={{ width: 120 }}
          >
            <Option value={10}>10 dòng</Option>
            <Option value={25}>25 dòng</Option>
            <Option value={50}>50 dòng</Option>
          </Select>
        </Space>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Button type="primary">Tất cả ({totalUsers})</Button>
      </div>
      {selectedUsers.length > 0 && (
        <Space style={{ marginBottom: 16 }}>
          <Popconfirm
            title={`Xóa ${selectedUsers.length} người dùng?`}
            description="Bạn có chắc chắn muốn xóa các người dùng đã chọn?"
            onConfirm={handleBulkDelete}
            okText="Xóa"
            okType="danger"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa ({selectedUsers.length})
            </Button>
          </Popconfirm>
        </Space>
      )}

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="nameId"
        rowSelection={rowSelection}
        pagination={{
          current: currentPage,
          pageSize: itemsPerPage,
          total: filteredUsers.length,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} người dùng`,
        }}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 1200 }}
        size="middle"
      />
    </Card>
  );
};

export default Users;
