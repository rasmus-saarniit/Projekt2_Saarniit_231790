const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, param, validationResult } = require('express-validator');

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
router.get('/', async (req, res) => {
  const records = await db.Haiguslood.findAll();
  res.json(records);
});

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
router.post(
  '/',
  [
    body('PatsiendiID').isInt(),
    body('T99tajaID').isInt(),
    body('KliendiID').isInt(),
    body('Kuup2ev').isISO8601(),
    body('Kirjeldus').isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const record = await db.Haiguslood.create(req.body);
    res.status(201).json(record);
  }
);

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
router.get('/:id', async (req, res) => {
  try {
    const record = await db.Haiguslood.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
router.put(
  '/:id',
  [
    param('id').isInt(),
    body('PatsiendiID').optional().isInt(),
    body('Kuup2ev').optional().isISO8601(),
    body('Kirjeldus').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const record = await db.Haiguslood.findByPk(req.params.id);
      if (!record) return res.status(404).json({ error: 'Not found' });
      await record.update(req.body);
      res.json(record);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /haiguslood/{id}:
 *   delete:
 *     summary: Delete a medical record by ID
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
router.delete('/:id', async (req, res) => {
  try {
    const record = await db.Haiguslood.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Not found' });
    await record.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /haiguslood:
 *   delete:
 *     summary: Delete all medical records
 *     tags: [Haiguslood]
 *     responses:
 *       204:
 *         description: All medical records deleted
 */
router.delete('/', async (req, res) => {
  try {
    await db.Haiguslood.destroy({ where: {} });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
