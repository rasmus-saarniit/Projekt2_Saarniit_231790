const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, param, validationResult } = require('express-validator');

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
router.get('/', async (req, res) => {
  const species = await db.Liik.findAll();
  res.json(species);
});

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
router.get('/:id', async (req, res) => {
  try {
    const liik = await db.Liik.findByPk(req.params.id);
    if (!liik) return res.status(404).json({ error: 'Not found' });
    res.json(liik);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
router.post(
  '/',
  [body('Nimetus').isString().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const liik = await db.Liik.create(req.body);
      res.status(201).json(liik);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

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
router.put(
  '/:id',
  [param('id').isInt(), body('Nimetus').optional().isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const liik = await db.Liik.findByPk(req.params.id);
      if (!liik) return res.status(404).json({ error: 'Not found' });
      await liik.update(req.body);
      res.json(liik);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /liigid/{id}:
 *   delete:
 *     summary: Delete a species by ID
 *     tags: [Liigid]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Species deleted
 *       404:
 *         description: Species not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const liik = await db.Liik.findByPk(req.params.id);
    if (!liik) return res.status(404).json({ error: 'Not found' });
    await liik.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /liigid:
 *   delete:
 *     summary: Delete all species
 *     tags: [Liigid]
 *     responses:
 *       204:
 *         description: All species deleted
 */
router.delete('/', async (req, res) => {
  try {
    await db.Liik.destroy({ where: {} });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
