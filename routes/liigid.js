const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, param } = require('express-validator');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const createCrudController = require('../controllers/crudController');
const { logCreate, logDelete, logWarnNotFound, logError } = require('../logger');

const crud = createCrudController(db.Liik);
const liigidController = require('../controllers/liigidController');
/**
 * @swagger
 * /liigid:
 *   get:
 *     summary: Get all species
 *     tags: [Liigid]
 *     responses:
 *       200:
 *         description: List of species
 */
// Protect all endpoints except admin-only with authenticateJWT and authorizeRoles('Admin', 'User')

// GET all species
router.get('/', authenticateJWT, authorizeRoles('Admin', 'User'), crud.list);

/**
 * @swagger
 * /liigid/{id}:
 *   get:
 *     summary: Get a species by ID
 *     tags: [Liigid]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Species found
 *       404:
 *         description: Species not found
 */
// GET species by ID
router.get('/:id', authenticateJWT, authorizeRoles('Admin', 'User'), crud.get);

/**
 * @swagger
 * /liigid:
 *   post:
 *     summary: Create a new species
 *     tags: [Liigid]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nimetus:
 *                 type: string
 *     responses:
 *       201:
 *         description: Species created
 */
// POST create species
router.post('/', authenticateJWT, authorizeRoles('Admin', 'User'), [body('Nimetus').isString().notEmpty()], validate, async (req, res, next) => {
  try {
    const item = await db.Liik.create(req.body);
    logCreate('Species', req.user?.id || 'unknown', req.body);
    res.status(201).json(item);
  } catch (err) {
    logError('Species', 'creating', err.message, { data: req.body });
    next(err);
  }
});

/**
 * @swagger
 * /liigid/{id}:
 *   put:
 *     summary: Update a species by ID
 *     tags: [Liigid]
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
 *               Nimetus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Species updated
 *       404:
 *         description: Species not found
 */
// PUT update species
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'User'), [param('id').isInt(), body('Nimetus').optional().isString()], validate, liigidController.update);

/**
 * @swagger
 * /liigid:
 *   delete:
 *     summary: Delete all species (Admin only)
 *     tags: [Liigid]
 *     responses:
 *       204:
 *         description: All species deleted
 */
router.delete('/', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  try {
    await db.Liik.destroy({ where: {} });
    logDelete('All Species', req.user?.id || 'unknown', {});
    res.status(204).send();
  } catch (err) {
    logError('Species', 'deleting all', err.message, {});
    next(err);
  }
});

// DELETE species by ID (admin only)
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  try {
    const item = await db.Liik.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Species', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.destroy();
    logDelete('Species', req.user?.id || 'unknown', req.params);
    res.status(204).send();
  } catch (err) {
    logError('Species', 'deleting', err.message, { params: req.params });
    next(err);
  }
});

module.exports = router;
