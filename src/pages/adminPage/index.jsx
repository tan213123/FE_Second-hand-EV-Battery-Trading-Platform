import {
  Layout,
  Menu,
  Button,
  Input,
  Dropdown,
  Avatar,
  Space,
  Typography,
} from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  UserOutlined,
  BarChartOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  BellOutlined,
  SearchOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./index.scss";
import Users from "./users";
import Reports from "./reports";
import Fees from "./fees";
import Posts from "./posts";
import { useNavigate } from "react-router-dom";
import { logout as logoutMember } from "../../redux/memberSlice";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminPage = () => {
  const [activeKey, setActiveKey] = useState("reports");
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const member = useSelector((state) => state.member);
  const navigate = useNavigate();

  useEffect(() => {
    if (!member) {
      navigate("/login", { replace: true });
    }
  }, [member, navigate]);

  const getPageTitle = () => {
    switch (activeKey) {
      case "posts":
        return "Duyệt bài đăng";
      case "users":
        return "Quản lý người dùng";
      case "reports":
        return "Thống kê & Báo cáo";
      case "fees":
        return "Quản lý gói dịch vụ";
      default:
        return "Bảng điều khiển";
    }
  };

  const handleMenuClick = (e) => {
    setActiveKey(e.key);
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="settings" icon={<HomeOutlined />}>
        Cài đặt
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        danger
        onClick={() => {
          dispatch(logoutMember());
          navigate("/login", { replace: true });
        }}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div className="admin-logo">
          {collapsed ? "ADMIN" : "Bảng quản trị"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="reports" icon={<BarChartOutlined />}>
            Thống kê & Báo cáo
          </Menu.Item>
          <Menu.Item key="fees" icon={<DollarCircleOutlined />}>
            Quản lý gói dịch vụ
          </Menu.Item>
          <Menu.Item key="posts" icon={<FileTextOutlined />}>
            Duyệt bài đăng
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            Quản lý người dùng
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                  color: "white",
                }}
              />
              <Button
                type="primary"
                icon={<HomeOutlined />}
                onClick={() => navigate("/", { replace: true })}
                style={{ marginLeft: 12 }}
              >
                Home
              </Button>
              <Text
                strong
                style={{ marginLeft: 12, fontSize: "1.2em", color: "white" }}
              >
                {getPageTitle()}
              </Text>
            </div>
            <Space size="large" style={{ marginRight: 24 }}>
              <Input
                placeholder="Tìm kiếm..."
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
              <Button
                type="text"
                icon={
                  <BellOutlined style={{ fontSize: "16px", color: "white" }} />
                }
              />
              <Dropdown overlay={userMenu} placement="bottomRight">
                <Space style={{ cursor: "pointer" }}>
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                  />
                  <Text style={{ color: "white" }}>Quản trị viên</Text>
                </Space>
              </Dropdown>
              <Button
                type="danger"
                icon={<LogoutOutlined style={{ color: "white" }} />}
                onClick={() => {
                  dispatch(logoutMember());
                  navigate("/login", { replace: true });
                }}
              >
                <text style={{ color: "white" }}>Đăng xuất</text>
              </Button>
            </Space>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            borderRadius: 8,
          }}
        >
          {activeKey === "reports" && <Reports />}
          {activeKey === "fees" && <Fees />}
          {activeKey === "posts" && <Posts />}
          {activeKey === "users" && <Users />}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminPage
