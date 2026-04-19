require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productsRouter  = require('./routes/products');
const adminRouter    = require('./routes/admin');
const settingsRouter = require('./routes/settings');


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-password']
}));
app.use(express.json());

app.use('/api/products',  productsRouter);
app.use('/api/admin',     adminRouter);
app.use('/api/settings',  settingsRouter);


// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Suiting Fabrics API is running v2' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Express Global Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error', error: err.toString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
