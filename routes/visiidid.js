const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, param, validationResult } = require('express-validator');

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
router.get('/', async (req, res) => {
  const visits = await db.Visiit.findAll();
  res.json(visits);
});

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
router.get('/:id', async (req, res) => {
  try {
    const visit = await db.Visiit.findByPk(req.params.id);
    if (!visit) return res.status(404).json({ error: 'Not found' });
    res.json(visit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
router.post(
  '/',
  [
    body('PatsiendiID').isInt(),
    body('HaigusluguID').isInt(),
    body('Kuup2ev').isISO8601(),
    body('Kaal').isFloat()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const visit = await db.Visiit.create(req.body);
      res.status(201).json(visit);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

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
router.put(
  '/:id',
  [
    param('id').isInt(),
    body('PatsiendiID').optional().isInt(),
    body('HaigusluguID').optional().isInt(),
    body('Kuup2ev').optional().isISO8601(),
    body('Kaal').optional().isFloat()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const visit = await db.Visiit.findByPk(req.params.id);
      if (!visit) return res.status(404).json({ error: 'Not found' });
      await visit.update(req.body);
      res.json(visit);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /visiidid/{id}:
 *   delete:
 *     summary: Delete a visit by ID
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
router.delete('/:id', async (req, res) => {
  try {
    const visit = await db.Visiit.findByPk(req.params.id);
    if (!visit) return res.status(404).json({ error: 'Not found' });
    await visit.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /visiidid:
 *   delete:
 *     summary: Delete all visits
 *     tags: [Visiidid]
 *     responses:
 *       204:
 *         description: All visits deleted
 */
router.delete('/', async (req, res) => {
  try {
    await db.Visiit.destroy({ where: {} });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
