const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, param, validationResult } = require('express-validator');

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
router.get('/', async (req, res) => {
  const patients = await db.Patsiendid.findAll();
  res.json(patients);
});

router.get('/:id', async (req, res) => {
  try {
    const patient = await db.Patsiendid.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
router.post(
  '/',
  [
    body('Nimi').isString().notEmpty(),
    body('Vanus').isInt({ min: 0 }),
    body('T6ug').isString().notEmpty(), // Make sure to use T6ug everywhere
    body('Steriliseerimine').isBoolean(),
    body('LiigiID').isInt(),
    body('KliendiID').isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Map Tõug to T6ug if user sends Tõug (for compatibility)
if (req.body['Tõug'] && !req.body['T6ug']) {
    req.body['T6ug'] = req.body['Tõug'];
    delete req.body['Tõug'];
  }
  // Create patient without VisiidiID and HaiguslooID
  const patient = await db.Patsiendid.create(req.body);
  res.status(201).json(await db.Patsiendid.findByPk(patient.PatsiendiID));
} catch (err) {
      // Log all error details for deep debugging
      console.error('Sequelize error:', err);
      if (err.parent) console.error('Parent error:', err.parent);
      if (err.errors) console.error('Errors array:', err.errors);
      res.status(500).json({
        error: err.message,
        details: err.parent,
        errors: err.errors,
        stack: err.stack
      });
    }
  }
);

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
router.put(
  '/:id',
  [
    param('id').isInt(),
    body('Nimi').optional().isString(),
    body('Vanus').optional().isInt({ min: 0 }),
    body('T6ug').optional().isString(),
    body('Steriliseerimine').optional().isBoolean(),
    body('LiigiID').optional().isInt(),
    body('KliendiID').optional().isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const patient = await db.Patsiendid.findByPk(req.params.id);
      if (!patient) return res.status(404).json({ error: 'Not found' });
      await patient.update(req.body);
      res.json(patient);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /patsiendid/{id}:
 *   delete:
 *     summary: Delete a patient by ID
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
router.delete('/:id', async (req, res) => {
  try {
    const patient = await db.Patsiendid.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Not found' });
    await patient.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /patsiendid:
 *   delete:
 *     summary: Delete all patients
 *     tags: [Patsiendid]
 *     responses:
 *       204:
 *         description: All patients deleted
 */
router.delete('/', async (req, res) => {
  try {
    await db.Patsiendid.destroy({ where: {} });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;