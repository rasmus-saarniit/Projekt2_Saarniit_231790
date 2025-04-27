const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, param } = require('express-validator');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const createCrudController = require('../controllers/crudController');
const { logCreate, logDelete, logWarnNotFound, logError } = require('../logger');

const crud = createCrudController(db.Haiguslood);

/**
 * @swagger
 * /haiguslood:
 *   get:
 *     summary: Get all medical records
 *     tags: [Haiguslood]
 *     responses:
 *       200:
 *         description: List of medical records
 */
// Protect all endpoints except admin-only with authenticateJWT and authorizeRoles('Admin', 'User')

// GET all medical records
router.get('/', authenticateJWT, authorizeRoles('Admin', 'User'), crud.list);

/**
 * @swagger
 * /haiguslood/{id}:
 *   get:
 *     summary: Get a medical record by ID
 *     tags: [Haiguslood]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medical record found
 *       404:
 *         description: Medical record not found
 */
// GET medical record by ID
router.get('/:id', authenticateJWT, authorizeRoles('Admin', 'User'), crud.get);

/**
 * @swagger
 * /haiguslood:
 *   post:
 *     summary: Loo uus haiguslugu
 *     tags: [Haiguslood]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PatsiendiID:
 *                 type: integer
 *               T99tajaID:
 *                 type: integer
 *               KliendiID:
 *                 type: integer
 *               Kuup2ev:
 *                 type: string
 *                 format: date-time
 *               Kirjeldus:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medical record created
 */
// POST create medical record
router.post('/', authenticateJWT, authorizeRoles('Admin', 'User'), [
  body('PatsiendiID').isInt(),
  body('T99tajaID').isInt(),
  body('KliendiID').isInt(),
  body('Kuup2ev').isISO8601(),
  body('Kirjeldus').isString()
], validate, async (req, res, next) => {
  try {
    const item = await db.Haiguslood.create(req.body);
    logCreate('MedicalRecord', req.user?.id || 'unknown', req.body);
    res.status(201).json(item);
  } catch (err) {
    logError('MedicalRecord', 'creating', err.message, { data: req.body });
    next(err);
  }
});

/**
 * @swagger
 * /haiguslood/{id}:
 *   put:
 *     summary: Update a medical record by ID
 *     tags: [Haiguslood]
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
 *               Kuup2ev:
 *                 type: string
 *                 format: date-time
 *               Kirjeldus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medical record updated
 *       404:
 *         description: Medical record not found
 */
// PUT update medical record
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'User'), [
  param('id').isInt(),
  body('PatsiendiID').optional().isInt(),
  body('Kuup2ev').optional().isISO8601(),
  body('Kirjeldus').optional().isString()
], validate, crud.update);

/**
 * @swagger
 * /haiguslood/{id}:
 *   delete:
 *     summary: Delete a medical record by ID (Admin only)
 *     tags: [Haiguslood]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Medical record deleted
 *       404:
 *         description: Medical record not found
 */
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  try {
    const item = await db.Haiguslood.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('MedicalRecord', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.destroy();
    logDelete('MedicalRecord', req.user?.id || 'unknown', req.params);
    res.status(204).send();
  } catch (err) {
    logError('MedicalRecord', 'deleting', err.message, { params: req.params });
    next(err);
  }
});

/**
 * @swagger
 * /haiguslood:
 *   delete:
 *     summary: Delete all medical records (Admin only)
 *     tags: [Haiguslood]
 *     responses:
 *       204:
 *         description: All medical records deleted
 */
router.delete('/', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  try {
    await db.Haiguslood.destroy({ where: {} });
    logDelete('All MedicalRecords', req.user?.id || 'unknown', {});
    res.status(204).send();
  } catch (err) {
    logError('MedicalRecord', 'deleting all', err.message, {});
    next(err);
  }
});

module.exports = router;
