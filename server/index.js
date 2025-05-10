const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

// Log environment variables (without exposing the API key)
console.log('Server Configuration:');
console.log('PORT:', port);
console.log('HOST:', host);
console.log('OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY ? 'Set' : 'Not Set');

app.use(cors());
app.use(express.json());

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    console.log('Fetching weather for city:', city);
    
    if (!process.env.OPENWEATHER_API_KEY) {
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

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
}); 