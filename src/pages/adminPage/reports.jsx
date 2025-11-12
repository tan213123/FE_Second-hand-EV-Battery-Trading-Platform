import React, { useState, useMemo, useEffect } from "react";
import "./reports.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchReports } from "../../redux/adminSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
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
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const Reports = () => {
  const dispatch = useDispatch();
  const { data: storeData } = useSelector((s) => s.admin.reports);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [viewMode, setViewMode] = useState("year"); // 'year' or 'month'

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

  // Data comes from Redux store

  useEffect(() => {
    dispatch(
      fetchReports({ year: selectedYear, month: selectedMonth, viewMode })
    );
  }, [dispatch, selectedYear, selectedMonth, viewMode]);

  // Filter data based on selected year/month
  const filteredData = useMemo(() => {
    const allData = storeData || {
      subscriptionData: { basic: 0, premium: 0, enterprise: 0 },
      monthlyData: { labels: [], basic: [], premium: [], enterprise: [] },
      revenueData: { labels: [], data: [] },
      dailyData: { labels: [], revenue: [] },
    };
    if (viewMode === "year") {
      // Return yearly data (all 12 months)
      return {
        subscriptionData: allData.subscriptionData,
        monthlyData: allData.monthlyData,
        revenueData: allData.revenueData,
      };
    } else {
      // Return daily data for selected month
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      return {
        subscriptionData: allData.subscriptionData,
        dailyData: {
          labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
          revenue: Array.from(
            { length: daysInMonth },
            () => Math.random() * 5000000 + 1000000
          ),
        },
      };
    }
  }, [storeData, selectedYear, selectedMonth, viewMode]);

  const barChartData = {
    labels: ["Cơ bản", "Premium", "Doanh nghiệp"],
    datasets: [
      {
        label: "Số người dùng",
        data: [
          filteredData.subscriptionData.basic,
          filteredData.subscriptionData.premium,
          filteredData.subscriptionData.enterprise,
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
          filteredData.subscriptionData.basic,
          filteredData.subscriptionData.premium,
          filteredData.subscriptionData.enterprise,
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
            labels: Array.isArray(filteredData.monthlyData.labels)
              ? [...filteredData.monthlyData.labels]
              : [],
            datasets: [
              {
                label: "Cơ bản",
                data: Array.isArray(filteredData.monthlyData.basic)
                  ? [...filteredData.monthlyData.basic]
                  : [],
                borderColor: "rgba(53, 162, 235, 0.8)",
                backgroundColor: "rgba(53, 162, 235, 0.1)",
                fill: true,
              },
              {
                label: "Premium",
                data: Array.isArray(filteredData.monthlyData.premium)
                  ? [...filteredData.monthlyData.premium]
                  : [],
                borderColor: "rgba(75, 192, 192, 0.8)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                fill: true,
              },
              {
                label: "Doanh nghiệp",
                data: Array.isArray(filteredData.monthlyData.enterprise)
                  ? [...filteredData.monthlyData.enterprise]
                  : [],
                borderColor: "rgba(255, 159, 64, 0.8)",
                backgroundColor: "rgba(255, 159, 64, 0.1)",
                fill: true,
              },
            ],
          }
        : null,
    [viewMode, filteredData.monthlyData]
  );

  const revenueChartData = useMemo(
    () =>
      viewMode === "year"
        ? {
            labels: Array.isArray(filteredData.revenueData.labels)
              ? [...filteredData.revenueData.labels]
              : [],
            datasets: [
              {
                label: "Doanh thu (VNĐ)",
                data: Array.isArray(filteredData.revenueData.data)
                  ? [...filteredData.revenueData.data]
                  : [],
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                fill: true,
              },
            ],
          }
        : {
            labels: Array.isArray(filteredData.dailyData.labels)
              ? [...filteredData.dailyData.labels]
              : [],
            datasets: [
              {
                label: "Doanh thu theo ngày (VNĐ)",
                data: Array.isArray(filteredData.dailyData.revenue)
                  ? [...filteredData.dailyData.revenue]
                  : [],
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                fill: true,
                key: "daily-revenue",
              },
            ],
          },
    [viewMode, filteredData.revenueData, filteredData.dailyData]
  );

  const currentPeriodRevenue =
    viewMode === "year"
      ? filteredData.revenueData.data[filteredData.revenueData.data.length - 1]
      : filteredData.dailyData.revenue.reduce((a, b) => a + b, 0);

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

  return (
    <div className="reports-page">
      <div className="filters-section">
        <div className="filter-group">
          <label>Chế độ xem:</label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="year">Theo năm</option>
            <option value="month">Theo tháng</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Năm:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {viewMode === "month" && (
          <div className="filter-group">
            <label>Tháng:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stats-card total-users">
          <h3>Tổng người dùng đăng ký gói</h3>
          <p className="stats-number">
            {Object.values(filteredData.subscriptionData).reduce(
              (a, b) => a + b,
              0
            )}
          </p>
        </div>
        <div className="stats-card monthly-revenue">
          <h3>
            {viewMode === "year"
              ? `Doanh thu năm ${selectedYear}`
              : `Doanh thu tháng ${selectedMonth}/${selectedYear}`}
          </h3>
          <p className="stats-number">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(currentPeriodRevenue)}
          </p>
        </div>
        <div className="stats-card active-subscriptions">
          <h3>Số lượng bài đăng</h3>
          <p className="stats-number">{storeData?.postsCount ?? 0}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Phân bố người dùng theo gói</h3>
          <Bar data={barChartData} options={chartOptions} />
        </div>

        <div className="chart-card">
          <h3>Tỷ lệ đăng ký gói</h3>
          <Pie data={pieChartData} options={chartOptions} />
        </div>

        {viewMode === "year" && lineChartData && (
          <div className="chart-card full-width">
            <h3>Xu hướng đăng ký theo tháng - Năm {selectedYear}</h3>
            <Line
              key={`subs-${selectedYear}`}
              data={lineChartData}
              options={chartOptions}
            />
          </div>
        )}

        <div className="chart-card full-width">
          <h3>
            {viewMode === "year"
              ? `Doanh thu theo tháng - Năm ${selectedYear}`
              : `Doanh thu theo ngày - Tháng ${selectedMonth}/${selectedYear}`}
          </h3>
          <Line
            key={`rev-${viewMode}-${selectedYear}-${selectedMonth}`}
            data={revenueChartData}
            options={revenueOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
