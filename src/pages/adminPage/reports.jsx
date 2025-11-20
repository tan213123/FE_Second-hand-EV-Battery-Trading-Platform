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

  // API state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [yearlyRevenue, setYearlyRevenue] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);
  const [subscriptionAnalytics, setSubscriptionAnalytics] = useState(null);
  const [packages, setPackages] = useState([]);

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
        };

        console.log("📊 Dashboard API Debug:", {
          params,
          viewMode,
        });

        // Fetch all dashboard endpoints in parallel
        const [statsRes, yearlyRes, monthlyRes, subsRes, packagesRes] =
          await Promise.all([
            api.get("/dashboard/stats", { params }),
            api.get("/dashboard/yearly-revenue", {
              params: { year: selectedYear },
            }),
            api.get("/dashboard/monthly-revenue", { params }),
            api.get("/dashboard/subscriptions", {
              params: { year: selectedYear },
            }),
            api.get("/package"),
          ]);

        console.log("✅ Dashboard API responses:", {
          stats: statsRes.data,
          yearly: yearlyRes.data,
          monthly: monthlyRes.data,
          subscriptions: subsRes.data,
          packages: packagesRes.data,
        });

        setDashboardStats(statsRes.data);
        setYearlyRevenue(yearlyRes.data);
        setMonthlyRevenue(monthlyRes.data);
        setSubscriptionAnalytics(subsRes.data);
        setPackages(packagesRes.data || []);
      } catch (e) {
        console.error("❌ Dashboard API error:", e?.response || e);
        setError(e?.response?.data?.message || "Không thể tải dữ liệu báo cáo");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedYear, selectedMonth, viewMode]);

  // Process real backend data
  const filteredData = useMemo(() => {
    const distribution = subscriptionAnalytics?.distribution || {};
    const subscriptionData = distribution; // map: packageName -> count

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
      const monthlySubs = subscriptionAnalytics?.monthly || [];
      const packageNames = packages.map((p) => p.name);
      const series = packageNames.map((name) => {
        const data = [];

        for (let month = 1; month <= 12; month++) {
          const monthRows = monthlySubs.filter(
            (item) => item.month === month && item.packageName === name
          );
          const total = monthRows.reduce(
            (sum, item) => sum + (item.count || 0),
            0
          );
          data.push(total);
        }

        return { name, data };
      });

      // Create data for all 12 months
      for (let month = 1; month <= 12; month++) {
        monthLabels.push(`Tháng ${month}`);
        const monthData = yearMonthlyData.find((item) => item.month === month);
        monthValues.push(monthData?.totalRevenue || 0);
      }

      return {
        subscriptionData,
        monthlyData: {
          labels: monthLabels,
          series,
        },
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
        subscriptionData,
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
    yearlyRevenue,
    monthlyRevenue,
    subscriptionAnalytics,
    packages,
    selectedYear,
    selectedMonth,
    viewMode,
  ]);

  const barChartData = {
    labels: (packages || []).map((p) => p.name),
    datasets: [
      {
        label: "Số người dùng",
        data: (packages || []).map(
          (p) => filteredData?.subscriptionData?.[p.name] ?? 0
        ),
        backgroundColor: (packages || []).map((_, idx) => {
          const colors = [
            "rgba(53, 162, 235, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(255, 159, 64, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 99, 132, 0.8)",
          ];
          return colors[idx % colors.length];
        }),
      },
    ],
  };

  const pieChartData = {
    labels: (packages || []).map((p) => p.name),
    datasets: [
      {
        data: (packages || []).map(
          (p) => filteredData?.subscriptionData?.[p.name] ?? 0
        ),
        backgroundColor: (packages || []).map((_, idx) => {
          const colors = [
            "rgba(53, 162, 235, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(255, 159, 64, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 99, 132, 0.8)",
          ];
          return colors[idx % colors.length];
        }),
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
              ...(Array.isArray(filteredData?.monthlyData?.series)
                ? filteredData.monthlyData.series.map((s, idx) => {
                    const colors = [
                      "rgba(53, 162, 235, 0.8)",
                      "rgba(75, 192, 192, 0.8)",
                      "rgba(255, 159, 64, 0.8)",
                      "rgba(153, 102, 255, 0.8)",
                      "rgba(255, 99, 132, 0.8)",
                    ];
                    const borderColor = colors[idx % colors.length];
                    const bgColor = borderColor.replace("0.8", "0.1");
                    return {
                      label: s.name,
                      data: Array.isArray(s.data) ? [...s.data] : [],
                      borderColor,
                      backgroundColor: bgColor,
                      fill: true,
                    };
                  })
                : []),
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
    maintainAspectRatio: false,
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
              title="Tổng số lượng bài đăng"
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
          <Card
            title="Tổng phân bố người dùng theo gói"
            style={{ height: "400px" }}
          >
            <Bar data={barChartData} options={chartOptions} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Tổng tỷ lệ đăng ký gói" style={{ height: "400px" }}>
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
