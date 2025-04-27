const { validationResult } = require('express-validator');
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.errors = errors.array();
    return next(err);
  }
  next();
};
