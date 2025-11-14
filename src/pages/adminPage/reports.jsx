import React, { useState, useMemo, useEffect } from "react";
import "./reports.scss";
import api from "../../config/api";
import {
  Card,
  Select,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Spin,
  Alert,
} from "antd";
import {
  CalendarOutlined,
  BarChartOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const { Title } = Typography;
const { Option } = Select;

const Reports = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [viewMode, setViewMode] = useState("year"); // 'year' or 'month'
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'inactive'

  // API state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [yearlyRevenue, setYearlyRevenue] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);

  // Convert frontend status to backend status
  const getBackendStatus = (frontendStatus) => {
    switch (frontendStatus) {
      case "active":
        return "ACTIVE";
      case "inactive":
        return "INACTIVE";
      case "all":
        return undefined;
      default:
        return undefined;
    }
  };

  // Generate years for dropdown (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
  ];

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          year: selectedYear,
          ...(viewMode === "month" && { month: selectedMonth }),
          ...(getBackendStatus(statusFilter) && {
            status: getBackendStatus(statusFilter),
          }),
        };

        console.log("📊 Dashboard API Debug:", {
          params,
          viewMode,
          statusFilter,
          backendStatus: getBackendStatus(statusFilter),
        });

        // Fetch all dashboard endpoints in parallel
        const [statsRes, yearlyRes, monthlyRes] = await Promise.all([
          api.get("/dashboard/stats", { params }),
          api.get("/dashboard/yearly-revenue", {
            params: { year: selectedYear },
          }),
          api.get("/dashboard/monthly-revenue", { params }),
        ]);

        console.log("✅ Dashboard API responses:", {
          stats: statsRes.data,
          yearly: yearlyRes.data,
          monthly: monthlyRes.data,
        });

        setDashboardStats(statsRes.data);
        setYearlyRevenue(yearlyRes.data);
        setMonthlyRevenue(monthlyRes.data);
      } catch (e) {
        console.error("❌ Dashboard API error:", e?.response || e);
        setError(e?.response?.data?.message || "Không thể tải dữ liệu báo cáo");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedYear, selectedMonth, viewMode, statusFilter]);

  // Process real backend data
  const filteredData = useMemo(() => {
    const defaultData = {
      subscriptionData: { basic: 0, premium: 0, enterprise: 0 },
      monthlyData: { labels: [], data: [] },
      revenueData: { labels: [], data: [] },
      dailyData: { labels: [], revenue: [] },
    };

    // Mock subscription data (since backend doesn't have this yet)
    const mockSubscriptionData = {
      basic: Math.floor(Math.random() * 100) + 50,
      premium: Math.floor(Math.random() * 80) + 30,
      enterprise: Math.floor(Math.random() * 40) + 10,
    };

    if (viewMode === "year") {
      // Process yearly revenue data
      const yearlyData = yearlyRevenue?.yearlyRevenue || [];
      const currentYearData = yearlyData.find(
        (item) => item.year === selectedYear
      );

      // Process monthly revenue data for the selected year
      const monthlyData = monthlyRevenue?.monthlyRevenue || [];
      const yearMonthlyData = monthlyData.filter(
        (item) => item.year === selectedYear
      );

      const monthLabels = [];
      const monthValues = [];

      // Create data for all 12 months
      for (let month = 1; month <= 12; month++) {
        monthLabels.push(`Tháng ${month}`);
        const monthData = yearMonthlyData.find((item) => item.month === month);
        monthValues.push(monthData?.totalRevenue || 0);
      }

      return {
        subscriptionData: mockSubscriptionData,
        revenueData: {
          labels: monthLabels,
          data: monthValues,
        },
        currentRevenue: currentYearData?.totalRevenue || 0,
      };
    } else {
      // Monthly view - show daily data (mock for now)
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const monthlyData = monthlyRevenue?.monthlyRevenue || [];
      const currentMonthData = monthlyData.find(
        (item) => item.year === selectedYear && item.month === selectedMonth
      );

      const dailyRevenue = currentMonthData?.totalRevenue || 0;
      const avgDailyRevenue = dailyRevenue / daysInMonth;

      return {
        subscriptionData: mockSubscriptionData,
        dailyData: {
          labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
          revenue: Array.from(
            { length: daysInMonth },
            () => avgDailyRevenue * (0.8 + Math.random() * 0.4) // Vary around average
          ),
        },
        currentRevenue: dailyRevenue,
      };
    }
  }, [
    dashboardStats,
    yearlyRevenue,
    monthlyRevenue,
    selectedYear,
    selectedMonth,
    viewMode,
  ]);

  const barChartData = {
    labels: ["Cơ bản", "Premium", "Doanh nghiệp"],
    datasets: [
      {
        label: "Số người dùng",
        data: [
          filteredData?.subscriptionData?.basic ?? 0,
          filteredData?.subscriptionData?.premium ?? 0,
          filteredData?.subscriptionData?.enterprise ?? 0,
        ],
        backgroundColor: [
          "rgba(53, 162, 235, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
      },
    ],
  };

  const pieChartData = {
    labels: ["Cơ bản", "Premium", "Doanh nghiệp"],
    datasets: [
      {
        data: [
          filteredData?.subscriptionData?.basic ?? 0,
          filteredData?.subscriptionData?.premium ?? 0,
          filteredData?.subscriptionData?.enterprise ?? 0,
        ],
        backgroundColor: [
          "rgba(53, 162, 235, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
      },
    ],
  };

  const lineChartData = useMemo(
    () =>
      viewMode === "year"
        ? {
            labels: Array.isArray(filteredData?.monthlyData?.labels)
              ? [...filteredData.monthlyData.labels]
              : [],
            datasets: [
              {
                label: "Cơ bản",
                data: Array.isArray(filteredData?.monthlyData?.basic)
                  ? [...filteredData.monthlyData.basic]
                  : [],
                borderColor: "rgba(53, 162, 235, 0.8)",
                backgroundColor: "rgba(53, 162, 235, 0.1)",
                fill: true,
              },
              {
                label: "Premium",
                data: Array.isArray(filteredData?.monthlyData?.premium)
                  ? [...filteredData.monthlyData.premium]
                  : [],
                borderColor: "rgba(75, 192, 192, 0.8)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                fill: true,
              },
              {
                label: "Doanh nghiệp",
                data: Array.isArray(filteredData?.monthlyData?.enterprise)
                  ? [...filteredData.monthlyData.enterprise]
                  : [],
                borderColor: "rgba(255, 159, 64, 0.8)",
                backgroundColor: "rgba(255, 159, 64, 0.1)",
                fill: true,
              },
            ],
          }
        : null,
    [viewMode, filteredData?.monthlyData]
  );

  const revenueChartData = useMemo(
    () =>
      viewMode === "year"
        ? {
            labels: Array.isArray(filteredData?.revenueData?.labels)
              ? [...filteredData.revenueData.labels]
              : [],
            datasets: [
              {
                label: "Doanh thu (VNĐ)",
                data: Array.isArray(filteredData?.revenueData?.data)
                  ? [...filteredData.revenueData.data]
                  : [],
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                fill: true,
              },
            ],
          }
        : {
            labels: Array.isArray(filteredData?.dailyData?.labels)
              ? [...filteredData.dailyData.labels]
              : [],
            datasets: [
              {
                label: "Doanh thu theo ngày (VNĐ)",
                data: Array.isArray(filteredData?.dailyData?.revenue)
                  ? [...filteredData.dailyData.revenue]
                  : [],
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                fill: true,
                key: "daily-revenue",
              },
            ],
          },
    [viewMode, filteredData?.revenueData, filteredData?.dailyData]
  );

  const currentPeriodRevenue = filteredData?.currentRevenue || 0;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const revenueOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  };

  // Loading and error states
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Đang tải báo cáo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi tải báo cáo"
        description={error}
        type="error"
        showIcon
        style={{ margin: 16 }}
      />
    );
  }

  return (
    <div className="reports-page">
      <Card
        title={<Title level={4}>Báo cáo thống kê</Title>}
        style={{ marginBottom: 16 }}
      >
        <Space size="large" wrap>
          <Space>
            <CalendarOutlined />
            <span>Chế độ xem:</span>
            <Select
              value={viewMode}
              onChange={setViewMode}
              style={{ width: 120 }}
            >
              <Option value="year">Theo năm</Option>
              <Option value="month">Theo tháng</Option>
            </Select>
          </Space>

          <Space>
            <span>Năm:</span>
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              style={{ width: 100 }}
            >
              {years.map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </Space>

          {viewMode === "month" && (
            <Space>
              <span>Tháng:</span>
              <Select
                value={selectedMonth}
                onChange={setSelectedMonth}
                style={{ width: 120 }}
              >
                {months.map((month) => (
                  <Option key={month.value} value={month.value}>
                    {month.label}
                  </Option>
                ))}
              </Select>
            </Space>
          )}

          <Space>
            <span>Trạng thái:</span>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Space>
        </Space>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng người dùng đăng ký gói"
              value={dashboardStats?.totalSubs ?? 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={
                viewMode === "year"
                  ? `Doanh thu năm ${selectedYear}`
                  : `Doanh thu tháng ${selectedMonth}/${selectedYear}`
              }
              value={currentPeriodRevenue}
              prefix={<DollarOutlined />}
              formatter={(value) =>
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(value)
              }
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Số lượng bài đăng"
              value={
                dashboardStats?.totalArticles ??
                dashboardStats?.articleCount ??
                dashboardStats?.postsCount ??
                dashboardStats?.totalPosts ??
                0
              }
              prefix={<BarChartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Phân bố người dùng theo gói" style={{ height: "400px" }}>
            <Bar data={barChartData} options={chartOptions} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Tỷ lệ đăng ký gói" style={{ height: "400px" }}>
            <Pie data={pieChartData} options={chartOptions} />
          </Card>
        </Col>

        {viewMode === "year" && lineChartData && (
          <Col xs={24}>
            <Card title={`Xu hướng đăng ký theo tháng - Năm ${selectedYear}`}>
              <Line
                key={`subs-${selectedYear}`}
                data={lineChartData}
                options={chartOptions}
              />
            </Card>
          </Col>
        )}

        <Col xs={24}>
          <Card
            title={
              viewMode === "year"
                ? `Doanh thu theo tháng - Năm ${selectedYear}`
                : `Doanh thu theo ngày - Tháng ${selectedMonth}/${selectedYear}`
            }
          >
            <Line
              key={`rev-${viewMode}-${selectedYear}-${selectedMonth}`}
              data={revenueChartData}
              options={revenueOptions}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
