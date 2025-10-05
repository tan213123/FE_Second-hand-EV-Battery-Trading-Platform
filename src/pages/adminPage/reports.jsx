import React from 'react';
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
  // Mock data - replace with actual data from your backend
  const subscriptionData = {
    basic: 45,
    premium: 28,
    enterprise: 15
  };

  const monthlyData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    basic: [10, 12, 15, 18, 20, 22, 25, 28, 32, 35, 40, 45],
    premium: [5, 7, 8, 10, 12, 15, 18, 20, 22, 24, 26, 28],
    enterprise: [2, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15]
  };

  const revenueData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    data: [15, 20, 25, 30, 35, 45, 50, 60, 70, 80, 90, 100].map(x => x * 1000000)
  };

  const barChartData = {
    labels: ['Cơ bản', 'Premium', 'Doanh nghiệp'],
    datasets: [
      {
        label: 'Số người dùng',
        data: [subscriptionData.basic, subscriptionData.premium, subscriptionData.enterprise],
        backgroundColor: ['rgba(53, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(255, 159, 64, 0.8)'],
      },
    ],
  };

  const pieChartData = {
    labels: ['Cơ bản', 'Premium', 'Doanh nghiệp'],
    datasets: [
      {
        data: [subscriptionData.basic, subscriptionData.premium, subscriptionData.enterprise],
        backgroundColor: ['rgba(53, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(255, 159, 64, 0.8)'],
      },
    ],
  };

  const lineChartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Cơ bản',
        data: monthlyData.basic,
        borderColor: 'rgba(53, 162, 235, 0.8)',
        backgroundColor: 'rgba(53, 162, 235, 0.1)',
        fill: true,
      },
      {
        label: 'Premium',
        data: monthlyData.premium,
        borderColor: 'rgba(75, 192, 192, 0.8)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
      },
      {
        label: 'Doanh nghiệp',
        data: monthlyData.enterprise,
        borderColor: 'rgba(255, 159, 64, 0.8)',
        backgroundColor: 'rgba(255, 159, 64, 0.1)',
        fill: true,
      },
    ],
  };

  const revenueChartData = {
    labels: revenueData.labels,
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: revenueData.data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
      },
    ],
  };

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
      <div className="stats-grid">
        <div className="stats-card total-users">
          <h3>Tổng người dùng đăng ký gói</h3>
          <p className="stats-number">{Object.values(subscriptionData).reduce((a, b) => a + b, 0)}</p>
        </div>
        <div className="stats-card monthly-revenue">
          <h3>Doanh thu tháng này</h3>
          <p className="stats-number">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(revenueData.data[revenueData.data.length - 1])}
          </p>
        </div>
        <div className="stats-card active-subscriptions">
          <h3>Gói phổ biến nhất</h3>
          <p className="stats-number">Cơ bản ({subscriptionData.basic} người dùng)</p>
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

        <div className="chart-card full-width">
          <h3>Xu hướng đăng ký theo tháng</h3>
          <Line data={lineChartData} options={chartOptions} />
        </div>

        <div className="chart-card full-width">
          <h3>Doanh thu theo tháng</h3>
          <Line data={revenueChartData} options={revenueOptions} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
