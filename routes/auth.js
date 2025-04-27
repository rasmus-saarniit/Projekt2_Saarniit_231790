const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const { body } = require('express-validator');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { logCreate, logDelete, logWarnNotFound, logError } = require('../logger');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, User]
 *     responses:
 *       201:
 *         description: User registered
 */
router.post('/register',
  authenticateJWT,
  authorizeRoles('Admin'),
  [body('username').isString().notEmpty(), body('password').isString().isLength({ min: 6 }), body('role').optional().isIn(['Admin', 'User'])],
  validate,
  async (req, res, next) => {
    const { username, password, role } = req.body;
    try {
      const existing = await db.Kasutajad.findOne({ where: { username } });
      if (existing) return res.status(400).json({ error: 'User already exists' });
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await db.Kasutajad.create({ username, passwordHash, role: role || 'User' });
      logCreate('UserRegister', req.user?.id || 'unknown', { username, role: role || 'User' });
      res.status(201).json({ message: 'User registered', user: { id: user.id, username, role: user.role } });
    } catch (err) {
      logError('UserRegister', 'registering', err.message, { data: req.body });
      next(err);
    }
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 */
router.post('/login',
  [body('username').isString().notEmpty(), body('password').isString().notEmpty()],
  validate,
  async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const user = await db.Kasutajad.findOne({ where: { username } });
      if (!user) {
        logWarnNotFound('UserLogin', 'unknown', { username });
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        logWarnNotFound('UserLogin', user.id, { username });
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, username, role: user.role }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });
      logCreate('UserLogin', user.id, { username });
      res.json({ token });
    } catch (err) {
      logError('UserLogin', 'logging in', err.message, { username });
      next(err);
    }
  }
);

/**
 * @swagger
 * /auth/user:
 *   delete:
 *     summary: Delete a user by email (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Email/username of the user to delete
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden
 */
router.delete('/user', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username (email) is required' });
  try {
    const user = await db.Kasutajad.findOne({ where: { username } });
    if (!user) {
      logWarnNotFound('UserDelete', req.user?.id || 'unknown', { username });
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    logDelete('UserDelete', req.user?.id || 'unknown', { username });
    res.json({ message: `User ${username} deleted` });
  } catch (err) {
    logError('UserDelete', 'deleting', err.message, { username });
    next(err);
  }
});

module.exports = router;
