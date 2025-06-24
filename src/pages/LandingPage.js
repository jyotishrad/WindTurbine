import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Fade,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import BarChartIcon from '@mui/icons-material/BarChart';
import SensorsIcon from '@mui/icons-material/Sensors';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import 'leaflet/dist/leaflet.css';

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Real-time Monitoring',
    description: 'Track performance metrics and sensor data in real-time with advanced visualization',
  },
  {
    icon: <BarChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Advanced Analytics',
    description: 'Comprehensive data analysis tools for performance optimization',
  },
  {
    icon: <SensorsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Smart Sensors',
    description: 'Integration with MPU-6050, SW-420, DHT11, LM35, and PZEM-004T sensors',
  },
  {
    icon: <BatteryChargingFullIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Power Management',
    description: 'Monitor power generation and consumption with detailed metrics',
  },
];

const MapEvents = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => onLocationSelect(e.latlng),
  });
  return null;
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <Fade in timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        {icon}
        <Typography variant="h6" sx={{ my: 2 }}>{title}</Typography>
        <Typography variant="body1" color="text.secondary">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">Learn More</Button>
      </CardActions>
    </Card>
  </Fade>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ lat: 13.1067, lng: 80.0695 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLocationSelect = (latlng) => {
    setPosition(latlng);
  };

  const handleSetLocation = () => {
    localStorage.setItem('turbineLocation', JSON.stringify(position));
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" sx={{ mb: 6, textAlign: 'center' }}>
        IoT-Based Wind Turbine Performance and Health Monitoring System
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <FeatureCard {...feature} delay={index * 200} />
          </Grid>
        ))}
      </Grid>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Select Turbine Location
        </Typography>
        <Box sx={{ height: 400, mb: 3, borderRadius: 1, overflow: 'hidden' }}>
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[position.lat, position.lng]} />
            <MapEvents onLocationSelect={handleLocationSelect} />
          </MapContainer>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Latitude"
              value={position.lat}
              onChange={(e) => setPosition({ ...position, lat: parseFloat(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Longitude"
              value={position.lng}
              onChange={(e) => setPosition({ ...position, lng: parseFloat(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: '100%' }}
              onClick={handleSetLocation}
            >
              Set Location
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LandingPage;