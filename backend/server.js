require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productsRouter = require('./routes/products');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    // or from file:// protocol (origin is null), localhost (any port), or Vercel
    const allowed = [
      'https://suiting-fabrics.vercel.app',
    ];
    if (!origin || origin === 'null' || /^http:\/\/localhost(:\d+)?$/.test(origin) || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-admin-password']
}));
app.use(express.json());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Suiting Fabrics API is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Express Global Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error', error: err.toString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
