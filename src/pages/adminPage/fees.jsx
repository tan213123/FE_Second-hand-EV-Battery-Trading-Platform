import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  List,
  Space,
  Divider,
  Spin,
  Alert,
  Tooltip,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StarFilled,
} from "@ant-design/icons";
import api from "../../config/api";
import "./fees.scss";

const defaultPackages = [
  {
    id: "pkg1",
    name: "Gói Tiêu chuẩn",
    type: "standard",
    price: 50000,
    duration: "15 ngày",
    icon: "",
    color: "#10b981",
    active: true,
    features: [
      { text: "Đăng 3 tin", included: true },
      { text: "Hiển thị trong 15 ngày", included: true },
      { text: "Được đẩy tin 3 lần", included: true },
      { text: "Hỗ trợ ưu tiên", included: true },
      { text: "Hiển thị trên trang chủ", included: true },
      { text: 'Nhãn "Tin nổi bật"', included: true },
      { text: "Ưu tiên hiển thị", included: false },
      { text: "Hỗ trợ 24/7", included: false },
    ],
    popular: false,
  },
  {
    id: "pkg2",
    name: "Gói Pro",
    type: "pro",
    price: 150000,
    duration: "30 ngày",
    icon: "",
    color: "#f59e0b",
    active: true,
    features: [
      { text: "Đăng không giới hạn", included: true },
      { text: "Hiển thị trong 30 ngày", included: true },
      { text: "Được đẩy tin không giới hạn", included: true },
      { text: "Hỗ trợ VIP", included: true },
      { text: "Hiển thị trên trang chủ", included: true },
      { text: 'Nhãn "Tin nổi bật"', included: true },
      { text: "Ưu tiên hiển thị hàng đầu", included: true },
      { text: "Hỗ trợ 24/7", included: true },
    ],
    popular: true,
  },
  {
    id: "pkg3",
    name: "Gói Đấu giá",
    type: "enterprise",
    price: 500000,
    duration: "90 ngày",
    icon: "",
    color: "#8b5cf6",
    active: true,
    features: [
      { text: "Đăng không giới hạn", included: true },
      { text: "Hiển thị trong 90 ngày", included: true },
      { text: "Được đẩy tin không giới hạn", included: true },
      { text: "Hỗ trợ VIP đặc biệt", included: true },
      { text: "Luôn hiển thị trên trang chủ", included: true },
      { text: 'Nhãn "Đối tác ưu tiên"', included: true },
      { text: "Ưu tiên hiển thị cao nhất", included: true },
      { text: "Hỗ trợ 24/7 + Auction Account", included: true },
    ],
    popular: false,
  },
];

const Fees = () => {
  const [packages, setPackages] = useState([]);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const startAdd = () => {
    setEditing("new");
    form.resetFields();
    form.setFieldsValue({
      name: "",
      type: "",
      price: undefined,
      numberOfPost: undefined,
      description: "",
      durationDays: undefined,
      icon: "",
      features: [],
      color: "#10b981",
      popular: false,
    });
    setShowModal(true);
  };

  const startEdit = (pkg) => {
    const durationDaysValue =
      pkg.durationDays ??
      (pkg.duration ? parseInt(pkg.duration, 10) : undefined);

    setEditing(pkg.id);
    form.setFieldsValue({
      name: pkg.name,
      type: pkg.type,
      price: pkg.price,
      numberOfPost: pkg.numberOfPost,
      description: pkg.description,
      durationDays: durationDaysValue,
      icon: pkg.icon ?? "",
      features: [...(pkg.features || [])],
      color: pkg.color ?? "#10b981",
      popular: pkg.popular ?? false,
    });
    setShowModal(true);
  };

  const cancel = () => {
    setEditing(null);
    setShowModal(false);
    form.resetFields();
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy danh sách gói từ API khi component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  // Fetch packages from API
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token && token.startsWith("demo")) {
        // Demo admin: dùng dữ liệu mặc định, không gọi API
        setPackages(defaultPackages);
      } else {
        const response = await api.get("/package/active");
        if (Array.isArray(response.data)) {
          const normalized = response.data.map((pkg) => ({
            ...pkg,
            id: pkg.packageId ?? pkg.id,
          }));
          setPackages(normalized);
        } else {
          setPackages([]);
        }
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setError("Không thể tải danh sách gói từ server.");
    } finally {
      setLoading(false);
    }
  };

  // No feature-editing helpers needed now; features are only shown for demo packages.

  const save = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Map AntD form values to backend PackagesRequest
      const packageData = {
        name: values.name,
        numberOfPost: Number(values.numberOfPost),
        description: values.description,
        price: Number(values.price),
        durationDays: Number(values.durationDays),
      };

      const token = localStorage.getItem("token");
      if (token && token.startsWith("demo")) {
        // Demo mode - update local state only
        if (editing === "new") {
          const id = `pkg${packages.length + 1}`;
          setPackages((prev) => [...prev, { id, ...packageData }]);
          message.success(" Tạo gói mới (demo) thành công!");
        } else {
          setPackages((prev) =>
            prev.map((p) => (p.id === editing ? { ...p, ...packageData } : p))
          );
          message.success(" Cập nhật gói (demo) thành công!");
        }
      } else {
        // Thực hiện gọi API thật
        if (editing === "new") {
          const response = await api.post("/package", packageData);
          if (response.data) {
            const newPkg = {
              ...response.data,
              id: response.data.packageId ?? response.data.id,
            };
            setPackages((prev) => [...prev, newPkg]);
            message.success(" Tạo gói mới thành công!");
          } else {
            const id = `pkg${packages.length + 1}`;
            setPackages((prev) => [...prev, { id, ...packageData }]);
            message.warning("Đã lưu cục bộ do lỗi API");
          }
        } else {
          try {
            await api.put(`/package/${editing}`, packageData);
            setPackages((prev) =>
              prev.map((p) =>
                p.id === editing ? { ...p, ...packageData, id: p.id } : p
              )
            );
            message.success(" Cập nhật gói thành công!");
          } catch (apiError) {
            console.error("API Update Error:", apiError);
            // Fallback to local update if API fails
            setPackages((prev) =>
              prev.map((p) => (p.id === editing ? { ...p, ...packageData } : p))
            );
            message.warning("Đã cập nhật cục bộ do lỗi API");
          }
        }
      }
    } catch (error) {
      console.error(" Lỗi khi lưu gói:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Không thể lưu thay đổi";
      message.error(`Lỗi: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa gói này không?")) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!(token && token.startsWith("demo"))) {
          await api.delete(`/package/${id}`);
        }
        // Cập nhật state
        setPackages((prev) => prev.filter((p) => p.id !== id));
        message.success(" Xóa gói thành công!");
        setError(null);
      } catch (error) {
        console.error(" Lỗi khi xóa gói:", error);
        const errorMsg =
          error.response?.data?.message || error.message || "Không thể xóa gói";
        message.error(`Lỗi: ${errorMsg}`);

        // Fallback: xóa khỏi state local
        setPackages((prev) => prev.filter((p) => p.id !== id));
      } finally {
        setLoading(false);
      }
    }
  };

  const formatPrice = (price) => {
    // Convert to number and round to remove decimals
    const num = Math.round(parseFloat(price || 0));
    // Format with dots as thousand separators and no decimal places
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  return (
    <div className="fees-management">
      <Card
        title={
          <Space>
            <h2 style={{ margin: 0 }}>Quản lý gói dịch vụ</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={startAdd}
              loading={loading}
            >
              Thêm gói mới
            </Button>
          </Space>
        }
      >
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Spin spinning={loading}>
          <div className="packages-grid">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`package-card ${pkg.popular ? "popular" : ""} ${
                  !pkg.active ? "inactive" : ""
                }`}
                style={{
                  borderTop: `4px solid ${pkg.color}`,
                  height: "100%",
                  position: "relative",
                }}
                hoverable
              >
                {pkg.popular && (
                  <div
                    className="ant-tag ant-tag-gold"
                    style={{ position: "absolute", top: 10, right: 10 }}
                  >
                    <StarFilled /> Phổ biến nhất
                  </div>
                )}
                {!pkg.active && (
                  <div
                    className="ant-tag ant-tag-red"
                    style={{ position: "absolute", top: 10, right: 10 }}
                  >
                    Đã tắt
                  </div>
                )}

                <div
                  className="package-header"
                  style={{ textAlign: "center", marginBottom: 16 }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>
                    {pkg.icon}
                  </div>
                  <h3 style={{ margin: "8px 0" }}>{pkg.name}</h3>
                  {pkg.description && (
                    <div
                      style={{
                        color: "#000",
                        margin: "4px 0",
                        fontSize: "0.9em",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {pkg.description.replace(/\.\s*/g, ".\n")}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: pkg.color,
                      marginTop: "8px",
                    }}
                  >
                    {formatPrice(parseFloat(pkg.price || 0))}
                    <span
                      style={{ fontSize: "1rem", color: "#666", marginLeft: 4 }}
                    >
                      /
                      {pkg.duration ||
                        (pkg.durationDays ? `${pkg.durationDays} ngày` : "")}
                    </span>
                  </div>
                </div>

                <Divider style={{ margin: "12px 0" }} />

                <List
                  itemLayout="horizontal"
                  dataSource={pkg.features || []}
                  locale={{
                    emptyText: pkg.description ? (
                      <div style={{ color: "#000", whiteSpace: "pre-line" }}>
                        {pkg.description.replace(/\.\s*/g, ".\n")}
                      </div>
                    ) : (
                      "Không có mô tả"
                    ),
                  }}
                  renderItem={(feature) => (
                    <List.Item style={{ padding: "4px 0" }}>
                      <List.Item.Meta
                        avatar={
                          feature.included ? (
                            <CheckCircleOutlined style={{ color: "#52c41a" }} />
                          ) : (
                            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                          )
                        }
                        title={
                          <span
                            style={{
                              color: feature.included ? "inherit" : "#999",
                            }}
                          >
                            {feature.text}
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />

                <div
                  style={{
                    marginTop: 24,
                    display: "flex",
                    gap: 8,
                    justifyContent: "center",
                  }}
                >
                  <Tooltip title="Chỉnh sửa">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => startEdit(pkg)}
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => remove(pkg.id)}
                    />
                  </Tooltip>
                </div>
              </Card>
            ))}
          </div>
        </Spin>
      </Card>

      <Modal
        title={editing === "new" ? "Thêm gói mới" : "Chỉnh sửa gói"}
        open={showModal}
        onCancel={cancel}
        footer={[
          <Button key="cancel" onClick={cancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={save} loading={loading}>
            Lưu
          </Button>,
        ]}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            icon: "⭐",
            color: "#10b981",
            popular: false,
            features: [],
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Form.Item
              name="name"
              label="Tên gói"
              rules={[{ required: true, message: "Vui lòng nhập tên gói" }]}
            >
              <Input placeholder="VD: Gói Pro" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Giá (VND)"
              rules={[{ required: true, message: "Vui lòng nhập giá" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={1000}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => (value ? value.replace(/\D/g, "") : "")}
                placeholder="VD: 150000"
              />
            </Form.Item>

            <Form.Item
              name="numberOfPost"
              label="Số bài đăng"
              rules={[{ required: true, message: "Vui lòng nhập số bài đăng" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                placeholder="VD: 10"
              />
            </Form.Item>

            <Form.Item
              name="durationDays"
              label="Thời hạn (ngày)"
              rules={[
                { required: true, message: "Vui lòng nhập thời hạn (ngày)" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                placeholder="VD: 30"
              />
            </Form.Item>

            <Form.Item name="icon" label="Icon">
              <Select>
                <Select.Option value="⭐">⭐ Ngôi sao</Select.Option>
                <Select.Option value="👑">👑 Vương miện</Select.Option>
                <Select.Option value="💼">💼 Cặp</Select.Option>
                <Select.Option value="🎯">🎯 Mục tiêu</Select.Option>
                <Select.Option value="🚀">🚀 Tên lửa</Select.Option>
                <Select.Option value="💎">💎 Kim cương</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="color" label="Màu sắc">
              <Input type="color" style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết về gói" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Fees;
