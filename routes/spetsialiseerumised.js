const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, param } = require('express-validator');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const createCrudController = require('../controllers/crudController');
const { logCreate, logDelete, logWarnNotFound, logError } = require('../logger');

const crud = createCrudController(db.Spetsialiseerumine);

/**
 * @swagger
 * /spetsialiseerumised:
 *   get:
 *     summary: Get all specializations (with optional filtering)
 *     tags: [Spetsialiseerumised]
 *     parameters:
 *       - in: query
 *         name: Valdkond
 *         schema:
 *           type: string
 *         description: Filter by field/area
 *     responses:
 *       200:
 *         description: List of specializations
 */
// Protect all endpoints except admin-only with authenticateJWT and authorizeRoles('Admin', 'User')

// Custom GET with filtering
router.get('/', authenticateJWT, authorizeRoles('Admin', 'User'), async (req, res, next) => {
  const { Valdkond } = req.query;
  const where = {};
  if (Valdkond) where.Valdkond = { [db.Sequelize.Op.iLike]: `%${Valdkond}%` };
  try {
    const specs = await db.Spetsialiseerumine.findAll({ where });
    res.json(specs);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /spetsialiseerumised:
 *   post:
 *     summary: Create a new specialization (Admin only)
 *     tags: [Spetsialiseerumised]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ArstiID:
 *                 type: integer
 *               Valdkond:
 *                 type: string
 *     responses:
 *       201:
 *         description: Specialization created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
// POST create specialization (admin or user)
router.post('/', authenticateJWT, authorizeRoles('Admin', 'User'), [
  body('ArstiID').isInt(),
  body('Valdkond').isString().notEmpty()
], validate, async (req, res, next) => {
  try {
    const item = await db.Spetsialiseerumine.create(req.body);
    logCreate('Specialization', req.user?.id || 'unknown', req.body);
    res.status(201).json(item);
  } catch (err) {
    logError('Specialization', 'creating', err.message, { data: req.body });
    next(err);
  }
});

/**
 * @swagger
 * /spetsialiseerumised/{ArstiID}/{Valdkond}:
 *   delete:
 *     summary: Delete a specialization by ArstiID and Valdkond (Admin only)
 *     tags: [Spetsialiseerumised]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ArstiID
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: Valdkond
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Specialization deleted
 *       404:
 *         description: Specialization not found
 *       403:
 *         description: Forbidden
 */
router.delete('/:ArstiID/:Valdkond',
  authenticateJWT,
  authorizeRoles('Admin'),
  param('ArstiID').isInt(),
  param('Valdkond').isString(),
  validate,
  async (req, res, next) => {
    try {
      const spec = await db.Spetsialiseerumine.findOne({
        where: {
          ArstiID: req.params.ArstiID,
          Valdkond: req.params.Valdkond
        }
      });
      if (!spec) {
        logWarnNotFound('Specialization', req.user?.id || 'unknown', req.params);
        return res.status(404).json({ error: 'Not found' });
      }
      await spec.destroy();
      logDelete('Specialization', req.user?.id || 'unknown', req.params);
      res.status(204).send();
    } catch (err) {
      logError('Specialization', 'deleting', err.message, { params: req.params });
      next(err);
    }
  }
);

/**
 * @swagger
 * /spetsialiseerumised:
 *   delete:
 *     summary: Delete all specializations (Admin only)
 *     tags: [Spetsialiseerumised]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: All specializations deleted
 *       403:
 *         description: Forbidden
 */
router.delete('/', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  try {
    await db.Spetsialiseerumine.destroy({ where: {} });
    logDelete('All Specializations', req.user?.id || 'unknown', {});
    res.status(204).send();
  } catch (err) {
    logError('Specialization', 'deleting all', err.message, {});
    next(err);
  }
});

module.exports = router;
