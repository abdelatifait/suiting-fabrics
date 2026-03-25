require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productsRouter = require('./routes/products');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://suiting-fabrics.vercel.app', 'http://localhost:8080'],
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
