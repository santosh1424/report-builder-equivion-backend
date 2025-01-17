require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const presetRoutes = require('./routes/presetRoutes');
const probe42Routes = require('./routes/probe42Routes');
const searchRoutes = require('./routes/searchRoutes');
// screenerRoutes + yahooFinanceRoutes
const screenerRoutes = require('./routes/screenerRoutes');

const yahooFinanceRoutes = require('./routes/yahooFinanceRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Only connect to MongoDB if we're not testing
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/presets', presetRoutes);
app.use('/api/probe42', probe42Routes);

// 
app.use('/api/screener', screenerRoutes);
app.use('/api/yahoo-finance', yahooFinanceRoutes);
app.use('/api/chat', chatRoutes);  // Add the chat route
app.use('/api/search', searchRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Only start the server if we're not testing
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  const IP = process.env.IP || '127.0.0.1'; // Default to localhost if IP is not set
  app.listen(PORT, IP, () => {
    console.log(`Server is running on http://${IP}:${PORT}`);
  });
}

module.exports = app; 