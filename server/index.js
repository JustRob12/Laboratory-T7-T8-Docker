const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
// AWS EB sets PORT env variable, fallback to 8081
const port = process.env.PORT || 8081;
// Listen on all interfaces
const host = process.env.HOST || '0.0.0.0';

// Enable CORS for all origins to fix network errors
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Basic health check endpoint for AWS 
app.get('/', (req, res) => {
  res.send('Weather API is running!');
});

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    console.log('Fetching weather for city:', city);
    
    if (!process.env.OPENWEATHER_API_KEY) {
      console.error('ERROR: OpenWeather API key is not set');
      throw new Error('OpenWeather API key is not set');
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    console.log('Weather data received successfully');
    res.json(response.data);
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
  }
});

// Start the server
app.listen(port, host, () => {
  console.log(`Server running at http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/`);
  console.log('Environment variables:');
  console.log('- PORT:', port);
  console.log('- HOST:', host);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY ? 'Set' : 'NOT SET');
}); 