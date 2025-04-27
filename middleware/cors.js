// middleware/cors.js
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173', // Vite/React dev server
  'http://localhost:3000', // Backend (for Swagger UI, etc.)
  // Add your production frontend URL here, e.g.:
  // 'https://your-frontend-domain.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Swagger UI)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies/credentials if needed
};

module.exports = cors(corsOptions);
