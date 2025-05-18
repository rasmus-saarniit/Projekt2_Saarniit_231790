const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// JWT authentication middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.warn('Tokeni verifitseerimine ebaõnnestus:', err.message);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    console.warn('Autentimise header puudub või on vales formaadis');
    res.sendStatus(401);
  }
}

// Role-based authorization middleware
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.warn('Autoriseerimine ebaõnnestus: kasutaja roll puudub või pole piisav', {
        user: req.user,
        requiredRoles: roles
      });
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
}

module.exports = { authenticateJWT, authorizeRoles };
