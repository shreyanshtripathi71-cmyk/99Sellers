"use client"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Import Filler for Area Charts
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Equity Potential ($)',
        data: [120000, 190000, 150000, 250000, 220000, 300000, 380000],
        fill: true, // Fill area under line
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(25, 135, 84, 0.2)'); // Green
          gradient.addColorStop(1, 'rgba(25, 135, 84, 0.0)');
          return gradient;
        },
        borderColor: '#198754', // Bootstrap Success Green
        borderWidth: 2,
        tension: 0.4, // Smooth curve
        pointBackgroundColor: '#fff',
        pointBorderColor: '#198754',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
       legend: { display: false },
       tooltip: {
          backgroundColor: '#fff',
          titleColor: '#000',
          bodyColor: '#666',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
             label: function(context: any) {
                return ' $' + context.raw.toLocaleString();
             }
          }
       }
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: '#f3f3f3', drawBorder: false },
        ticks: { 
           color: '#999',
           font: { size: 11 },
           callback: function(value: any) {
              return '$' + value / 1000 + 'k';
           }
        }
      },
      x: {
         border: { display: false },
         grid: { display: false },
         ticks: { color: '#999', font: { size: 11 } }
      }
    },
  };

  return (
    <Line data={data} options={options} />
  );
};

export default DashboardChart;