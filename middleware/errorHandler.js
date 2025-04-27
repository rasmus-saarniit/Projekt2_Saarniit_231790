// middleware/errorHandler.js
// Global error handler for consistent error responses
module.exports = (err, req, res, next) => {
  // Log error details for debugging
  console.error('Global error handler:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    details: err.details || undefined,
    errors: err.errors || undefined
  });
};
