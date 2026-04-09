const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import routes
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const ordersEventDrivenRoutes = require('./routes/ordersEventDriven');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/orders', ordersEventDrivenRoutes); // Event-driven order processing
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('ERROR:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  AKHIL SPORTS BACKEND - Order Processing API  ║
║  Server running on http://localhost:${PORT}        ║
║  Mock Payment + Inventory + Notifications     ║
╚════════════════════════════════════════════════╝
  `);
});
