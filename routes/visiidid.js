const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, param } = require('express-validator');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const createCrudController = require('../controllers/crudController');
const { logCreate, logDelete, logWarnNotFound, logError } = require('../logger');

const crud = createCrudController(db.Visiit);

/**
 * @swagger
 * /visiidid:
 *   get:
 *     summary: Get all visits
 *     tags: [Visiidid]
 *     responses:
 *       200:
 *         description: List of visits
 */
// Protect all endpoints except admin-only with authenticateJWT and authorizeRoles('Admin', 'User')

// GET all visits
router.get('/', authenticateJWT, authorizeRoles('Admin', 'User'), crud.list);

/**
 * @swagger
 * /visiidid/{id}:
 *   get:
 *     summary: Get a visit by ID
 *     tags: [Visiidid]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Visit found
 *       404:
 *         description: Visit not found
 */
// GET visit by ID
router.get('/:id', authenticateJWT, authorizeRoles('Admin', 'User'), crud.get);

/**
 * @swagger
 * /visiidid:
 *   post:
 *     summary: Create a new visit
 *     tags: [Visiidid]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PatsiendiID:
 *                 type: integer
 *               HaigusluguID:
 *                 type: integer
 *               Kuup2ev:
 *                 type: string
 *                 format: date-time
 *               Kaal:
 *                 type: number
 *     responses:
 *       201:
 *         description: Visit created
 */
// POST create visit
router.post('/', authenticateJWT, authorizeRoles('Admin', 'User'), [
  body('PatsiendiID').isInt(),
  body('HaigusluguID').isInt(),
  body('Kuup2ev').isISO8601(),
  body('Kaal').isFloat()
], validate, async (req, res, next) => {
  try {
    const item = await db.Visiit.create(req.body);
    logCreate('Visit', req.user?.id || 'unknown', req.body);
    res.status(201).json(item);
  } catch (err) {
    logError('Visit', 'creating', err.message, { data: req.body });
    next(err);
  }
});

/**
 * @swagger
 * /visiidid/{id}:
 *   put:
 *     summary: Update a visit by ID
 *     tags: [Visiidid]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PatsiendiID:
 *                 type: integer
 *               HaigusluguID:
 *                 type: integer
 *               Kuup2ev:
 *                 type: string
 *                 format: date-time
 *               Kaal:
 *                 type: number
 *     responses:
 *       200:
 *         description: Visit updated
 *       404:
 *         description: Visit not found
 */
// PUT update visit
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'User'), [
  param('id').isInt(),
  body('PatsiendiID').optional().isInt(),
  body('HaigusluguID').optional().isInt(),
  body('Kuup2ev').optional().isISO8601(),
  body('Kaal').optional().isFloat()
], validate, crud.update);

// DELETE visit by ID (admin only)
/**
 * @swagger
 * /visiidid/{id}:
 *   delete:
 *     summary: Delete a visit by ID (Admin only)
 *     tags: [Visiidid]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Visit deleted
 *       404:
 *         description: Visit not found
 */
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  try {
    const item = await db.Visiit.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Visit', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.destroy();
    logDelete('Visit', req.user?.id || 'unknown', req.params);
    res.status(204).send();
  } catch (err) {
    logError('Visit', 'deleting', err.message, { params: req.params });
    next(err);
  }
});

// DELETE all visits (admin only)
/**
 * @swagger
 * /visiidid:
 *   delete:
 *     summary: Delete all visits (Admin only)
 *     tags: [Visiidid]
 *     responses:
 *       204:
 *         description: All visits deleted
 */
router.delete('/', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  try {
    await db.Visiit.destroy({ where: {} });
    logDelete('All Visits', req.user?.id || 'unknown', {});
    res.status(204).send();
  } catch (err) {
    logError('Visit', 'deleting all', err.message, {});
    next(err);
  }
});

module.exports = router;
