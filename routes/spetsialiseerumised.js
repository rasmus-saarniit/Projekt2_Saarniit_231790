const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, param, validationResult } = require('express-validator');

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
router.get('/', async (req, res) => {
  const { Valdkond } = req.query;
  const where = {};
  if (Valdkond) where.Valdkond = { [db.Sequelize.Op.iLike]: `%${Valdkond}%` };
  try {
    const specs = await db.Spetsialiseerumine.findAll({ where });
    res.json(specs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /spetsialiseerumised/{id}:
 *   get:
 *     summary: Get a specialization by ID
 *     tags: [Spetsialiseerumised]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Specialization found
 *       404:
 *         description: Specialization not found
 */
router.get('/:id', async (req, res) => {
  try {
    const spec = await db.Spetsialiseerumine.findByPk(req.params.id);
    if (!spec) return res.status(404).json({ error: 'Not found' });
    res.json(spec);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /spetsialiseerumised:
 *   post:
 *     summary: Create a new specialization
 *     tags: [Spetsialiseerumised]
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
 */
router.post(
  '/',
  [
    body('ArstiID').isInt(),
    body('Valdkond').isString().notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const spec = await db.Spetsialiseerumine.create(req.body);
      res.status(201).json(spec);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /spetsialiseerumised/{id}:
 *   put:
 *     summary: Update a specialization by ID
 *     tags: [Spetsialiseerumised]
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
 *               ArstiID:
 *                 type: integer
 *               Valdkond:
 *                 type: string
 *     responses:
 *       200:
 *         description: Specialization updated
 *       404:
 *         description: Specialization not found
 */
router.put(
  '/:id',
  [
    param('id').isInt(),
    body('ArstiID').optional().isInt(),
    body('Valdkond').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const spec = await db.Spetsialiseerumine.findByPk(req.params.id);
      if (!spec) return res.status(404).json({ error: 'Not found' });
      await spec.update(req.body);
      res.json(spec);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /spetsialiseerumised/{id}:
 *   delete:
 *     summary: Delete a specialization by ID
 *     tags: [Spetsialiseerumised]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Specialization deleted
 *       404:
 *         description: Specialization not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const spec = await db.Spetsialiseerumine.findByPk(req.params.id);
    if (!spec) return res.status(404).json({ error: 'Not found' });
    await spec.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /spetsialiseerumised:
 *   delete:
 *     summary: Delete all specializations
 *     tags: [Spetsialiseerumised]
 *     responses:
 *       204:
 *         description: All specializations deleted
 */
router.delete('/', async (req, res) => {
  try {
    await db.Spetsialiseerumine.destroy({ where: {} });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
