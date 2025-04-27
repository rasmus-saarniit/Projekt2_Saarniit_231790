const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, param } = require('express-validator');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const createCrudController = require('../controllers/crudController');
const { logCreate, logDelete, logWarnNotFound, logError } = require('../logger');

const crud = createCrudController(db.Patsiendid);

/**
 * @swagger
 * /patsiendid:
 *   get:
 *     summary: Get all patients
 *     tags: [Patsiendid]
 *     responses:
 *       200:
 *         description: List of patients
 */
// Protect all endpoints except admin-only with authenticateJWT and authorizeRoles('Admin', 'User')

// GET all patients
router.get('/', authenticateJWT, authorizeRoles('Admin', 'User'), crud.list);

/**
 * @swagger
 * /patsiendid/{id}:
 *   get:
 *     summary: Get a patient by ID
 *     tags: [Patsiendid]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient details
 *       404:
 *         description: Patient not found
 */
// GET patient by ID
router.get('/:id', authenticateJWT, authorizeRoles('Admin', 'User'), crud.get);

/**
 * @swagger
 * /patsiendid:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patsiendid]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nimi:
 *                 type: string
 *               Vanus:
 *                 type: integer
 *               T6ug:
 *                 type: string
 *               Steriliseerimine:
 *                 type: boolean
 *               LiigiID:
 *                 type: integer
 *               KliendiID:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Patient created
 */
// POST create patient
router.post('/', authenticateJWT, authorizeRoles('Admin', 'User'), [
  body('Nimi').isString().notEmpty(),
  body('Vanus').isInt({ min: 0 }),
  body('T6ug').isString().notEmpty(),
  body('Steriliseerimine').isBoolean(),
  body('LiigiID').isInt(),
  body('KliendiID').isInt()
], validate, async (req, res, next) => {
  try {
    const item = await db.Patsiendid.create(req.body);
    logCreate('Patient', req.user?.id || 'unknown', req.body);
    res.status(201).json(item);
  } catch (err) {
    logError('Patient', 'creating', err.message, { data: req.body });
    next(err);
  }
});

/**
 * @swagger
 * /patsiendid/{id}:
 *   put:
 *     summary: Update a patient by ID
 *     tags: [Patsiendid]
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
 *               Nimi:
 *                 type: string
 *               Vanus:
 *                 type: integer
 *               T6ug:
 *                 type: string
 *               Steriliseerimine:
 *                 type: boolean
 *               LiigiID:
 *                 type: integer
 *               KliendiID:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Patient updated
 *       404:
 *         description: Patient not found
 */
// PUT update patient
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'User'), [
  param('id').isInt(),
  body('Nimi').optional().isString(),
  body('Vanus').optional().isInt({ min: 0 }),
  body('T6ug').optional().isString(),
  body('Steriliseerimine').optional().isBoolean(),
  body('LiigiID').optional().isInt(),
  body('KliendiID').optional().isInt()
], validate, crud.update);

/**
 * @swagger
 * /patsiendid/{id}:
 *   delete:
 *     summary: Delete a patient by ID (Admin only)
 *     tags: [Patsiendid]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Patient deleted
 *       404:
 *         description: Patient not found
 */
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  try {
    const item = await db.Patsiendid.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Patient', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.destroy();
    logDelete('Patient', req.user?.id || 'unknown', req.params);
    res.status(204).send();
  } catch (err) {
    logError('Patient', 'deleting', err.message, { params: req.params });
    next(err);
  }
});

/**
 * @swagger
 * /patsiendid:
 *   delete:
 *     summary: Delete all patients (Admin only)
 *     tags: [Patsiendid]
 *     responses:
 *       204:
 *         description: All patients deleted
 */
router.delete('/', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  try {
    await db.Patsiendid.destroy({ where: {} });
    logDelete('All Patients', req.user?.id || 'unknown', {});
    res.status(204).send();
  } catch (err) {
    logError('Patient', 'deleting all', err.message, {});
    next(err);
  }
});

module.exports = router;