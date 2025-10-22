import React, { useState, useMemo } from 'react';
import './reports.scss';
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
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

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
  LineElement
);

const Reports = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [viewMode, setViewMode] = useState('year'); // 'year' or 'month'

  // Generate years for dropdown (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
  ];

  // Mock data - replace with actual data from your backend
  const allData = {
    subscriptionData: {
      basic: 45,
      premium: 28,
      enterprise: 15
    },
    monthlyData: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      basic: [10, 12, 15, 18, 20, 22, 25, 28, 32, 35, 40, 45],
      premium: [5, 7, 8, 10, 12, 15, 18, 20, 22, 24, 26, 28],
      enterprise: [2, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15]
    },
    revenueData: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      data: [15, 20, 25, 30, 35, 45, 50, 60, 70, 80, 90, 100].map(x => x * 1000000)
    },
    // Daily data for when viewing a specific month
    dailyData: {
      // Example for a month with 30 days
      labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
      revenue: Array.from({ length: 30 }, () => Math.random() * 5000000 + 1000000)
    }
  };

  // Filter data based on selected year/month
  const filteredData = useMemo(() => {
    if (viewMode === 'year') {
      // Return yearly data (all 12 months)
      return {
        subscriptionData: allData.subscriptionData,
        monthlyData: allData.monthlyData,
        revenueData: allData.revenueData
      };
    } else {
      // Return daily data for selected month
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      return {
        subscriptionData: allData.subscriptionData,
        dailyData: {
          labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
          revenue: Array.from({ length: daysInMonth }, () => Math.random() * 5000000 + 1000000)
        }
      };
    }
  }, [selectedYear, selectedMonth, viewMode]);

  const barChartData = {
    labels: ['Cơ bản', 'Premium', 'Doanh nghiệp'],
    datasets: [
      {
        label: 'Số người dùng',
        data: [
          filteredData.subscriptionData.basic,
          filteredData.subscriptionData.premium,
          filteredData.subscriptionData.enterprise
        ],
        backgroundColor: ['rgba(53, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(255, 159, 64, 0.8)'],
      },
    ],
  };

  const pieChartData = {
    labels: ['Cơ bản', 'Premium', 'Doanh nghiệp'],
    datasets: [
      {
        data: [
          filteredData.subscriptionData.basic,
          filteredData.subscriptionData.premium,
          filteredData.subscriptionData.enterprise
        ],
        backgroundColor: ['rgba(53, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(255, 159, 64, 0.8)'],
      },
    ],
  };

  const lineChartData = viewMode === 'year' ? {
    labels: filteredData.monthlyData.labels,
    datasets: [
      {
        label: 'Cơ bản',
        data: filteredData.monthlyData.basic,
        borderColor: 'rgba(53, 162, 235, 0.8)',
        backgroundColor: 'rgba(53, 162, 235, 0.1)',
        fill: true,
      },
      {
        label: 'Premium',
        data: filteredData.monthlyData.premium,
        borderColor: 'rgba(75, 192, 192, 0.8)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
      },
      {
        label: 'Doanh nghiệp',
        data: filteredData.monthlyData.enterprise,
        borderColor: 'rgba(255, 159, 64, 0.8)',
        backgroundColor: 'rgba(255, 159, 64, 0.1)',
        fill: true,
      },
    ],
  } : null;

  const revenueChartData = viewMode === 'year' ? {
    labels: filteredData.revenueData.labels,
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: filteredData.revenueData.data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
      },
    ],
  } : {
    labels: filteredData.dailyData.labels,
    datasets: [
      {
        label: 'Doanh thu theo ngày (VNĐ)',
        data: filteredData.dailyData.revenue,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
      },
    ],
  };

  const totalRevenue = viewMode === 'year'
    ? filteredData.revenueData.data.reduce((a, b) => a + b, 0)
    : filteredData.dailyData.revenue.reduce((a, b) => a + b, 0);
  
  const currentPeriodRevenue = viewMode === 'year'
    ? filteredData.revenueData.data[filteredData.revenueData.data.length - 1]
    : filteredData.dailyData.revenue.reduce((a, b) => a + b, 0);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
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
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="reports-page">
      <div className="filters-section">
        <div className="filter-group">
          <label>Chế độ xem:</label>
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <option value="year">Theo năm</option>
            <option value="month">Theo tháng</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Năm:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {viewMode === 'month' && (
          <div className="filter-group">
            <label>Tháng:</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stats-card total-users">
          <h3>Tổng người dùng đăng ký gói</h3>
          <p className="stats-number">
            {Object.values(filteredData.subscriptionData).reduce((a, b) => a + b, 0)}
          </p>
        </div>
        <div className="stats-card monthly-revenue">
          <h3>{viewMode === 'year' ? `Doanh thu năm ${selectedYear}` : `Doanh thu tháng ${selectedMonth}/${selectedYear}`}</h3>
          <p className="stats-number">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(currentPeriodRevenue)}
          </p>
        </div>
        <div className="stats-card active-subscriptions">
          <h3>Gói phổ biến nhất</h3>
          <p className="stats-number">Cơ bản ({filteredData.subscriptionData.basic} người dùng)</p>
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

        {viewMode === 'year' && lineChartData && (
          <div className="chart-card full-width">
            <h3>Xu hướng đăng ký theo tháng - Năm {selectedYear}</h3>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        )}

        <div className="chart-card full-width">
          <h3>
            {viewMode === 'year' 
              ? `Doanh thu theo tháng - Năm ${selectedYear}` 
              : `Doanh thu theo ngày - Tháng ${selectedMonth}/${selectedYear}`}
          </h3>
          <Line data={revenueChartData} options={revenueOptions} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
