import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SpeedIcon from '@mui/icons-material/Speed';
import WaterIcon from '@mui/icons-material/Water';
import BoltIcon from '@mui/icons-material/Bolt';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SensorCard = ({ title, icon, data, color }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      height: '100%',
      borderTop: `4px solid ${color}`,
      borderRadius: '4px',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon}
      <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
    </Box>
    <Grid container spacing={2}>
      {Object.entries(data).map(([key, value]) => (
        <Grid item xs={6} key={key}>
          <Typography variant="body2" color="text.secondary">
            {key}
          </Typography>
          <Typography variant="h6">
            {value}
          </Typography>
        </Grid>
      ))}
    </Grid>
  </Paper>
);

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({
    mpu6050: { 'X-Axis': '0°', 'Y-Axis': '0°', 'Z-Axis': '0°', 'Acceleration': '0 m/s²' },
    vibration: { 'Status': 'Normal', 'Level': '0%', 'Frequency': '0 Hz', 'Amplitude': '0 mm' },
    environmental: { 'Humidity': '0%', 'Temp (DHT11)': '0°C', 'Temp (LM35)': '0°C', 'Pressure': '0 kPa' },
    power: { 'Voltage': '0V', 'Current': '0A', 'Power': '0W', 'Energy': '0kWh' }
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Power Output',
        data: [],
        borderColor: '#1a73e8',
        tension: 0.4,
      },
      {
        label: 'Temperature',
        data: [],
        borderColor: '#dc3545',
        tension: 0.4,
      }
    ]
  });

  useEffect(() => {
    const updateData = () => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString();

      setSensorData({
        mpu6050: {
          'X-Axis': `${(Math.random() * 360).toFixed(2)}°`,
          'Y-Axis': `${(Math.random() * 360).toFixed(2)}°`,
          'Z-Axis': `${(Math.random() * 360).toFixed(2)}°`,
          'Acceleration': `${(Math.random() * 10).toFixed(2)} m/s²`
        },
        vibration: {
          'Status': Math.random() > 0.7 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Normal',
          'Level': `${(Math.random() * 100).toFixed(1)}%`,
          'Frequency': `${(Math.random() * 60).toFixed(1)} Hz`,
          'Amplitude': `${(Math.random() * 5).toFixed(2)} mm`
        },
        environmental: {
          'Humidity': `${(Math.random() * 100).toFixed(1)}%`,
          'Temp (DHT11)': `${(20 + Math.random() * 10).toFixed(1)}°C`,
          'Temp (LM35)': `${(20 + Math.random() * 10).toFixed(1)}°C`,
          'Pressure': `${(100 + Math.random() * 2).toFixed(1)} kPa`
        },
        power: {
          'Voltage': `${(220 + Math.random() * 10).toFixed(1)}V`,
          'Current': `${(Math.random() * 5).toFixed(2)}A`,
          'Power': `${(220 * Math.random() * 5).toFixed(1)}W`,
          'Energy': `${(Math.random() * 1000).toFixed(1)}kWh`
        }
      });

      setChartData(prev => {
        const newLabels = [...prev.labels, timeLabel].slice(-10);
        const newPowerData = [...prev.datasets[0].data, parseFloat(sensorData.power.Power)].slice(-10);
        const newTempData = [...prev.datasets[1].data, parseFloat(sensorData.environmental['Temp (DHT11)'])].slice(-10);

        return {
          labels: newLabels,
          datasets: [
            {
              ...prev.datasets[0],
              data: newPowerData,
            },
            {
              ...prev.datasets[1],
              data: newTempData,
            }
          ]
        };
      });
    };

    const interval = setInterval(updateData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SensorCard
            title="Gyroscope & Acceleration"
            icon={<SpeedIcon sx={{ color: '#1a73e8' }} />}
            data={sensorData.mpu6050}
            color="#1a73e8"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SensorCard
            title="Vibration Status"
            icon={<WaterIcon sx={{ color: '#4caf50' }} />}
            data={sensorData.vibration}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SensorCard
            title="Environmental Conditions"
            icon={<ThermostatIcon sx={{ color: '#dc3545' }} />}
            data={sensorData.environmental}
            color="#dc3545"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SensorCard
            title="Power Metrics"
            icon={<BoltIcon sx={{ color: '#ff9800' }} />}
            data={sensorData.power}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Performance Trends</Typography>
            <Line data={chartData} options={{
              responsive: true,
              maintainAspectRatio: true,
              aspectRatio: 2,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;