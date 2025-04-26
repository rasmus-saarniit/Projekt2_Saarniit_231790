const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, param, validationResult } = require('express-validator');

/**
 * @swagger
 * /tootajad:
 *   get:
 *     summary: Get all employees
 *     tags: [Töötajad]
 *     responses:
 *       200:
 *         description: List of employees
 */
router.get('/', async (req, res) => {
  const employees = await db.T99tajad.findAll();
  res.json(employees);
});

/**
 * @swagger
 * /tootajad/{id}:
 *   get:
 *     summary: Get an employee by ID
 *     tags: [Töötajad]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee found
 *       404:
 *         description: Employee not found
 */
router.get('/:id', async (req, res) => {
  try {
    const employee = await db.T99tajad.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /tootajad:
 *   post:
 *     summary: Create a new employee
 *     tags: [Töötajad]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Eesnimi:
 *                 type: string
 *               Perekonnanimi:
 *                 type: string
 *               Valdkond:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee created
 */
router.post(
  '/',
  [
    body('Eesnimi').isString().notEmpty(),
    body('Perekonnanimi').isString().notEmpty(),
    body('Valdkond').isString().notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const employee = await db.T99tajad.create(req.body);
      res.status(201).json(employee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /tootajad/{id}:
 *   put:
 *     summary: Update an employee by ID
 *     tags: [Töötajad]
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
 *               Eesnimi:
 *                 type: string
 *               Perekonnanimi:
 *                 type: string
 *               Valdkond:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated
 *       404:
 *         description: Employee not found
 */
router.put(
  '/:id',
  [
    param('id').isInt(),
    body('Eesnimi').optional().isString(),
    body('Perekonnanimi').optional().isString(),
    body('Valdkond').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const employee = await db.T99tajad.findByPk(req.params.id);
      if (!employee) return res.status(404).json({ error: 'Not found' });
      await employee.update(req.body);
      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /tootajad/{id}:
 *   delete:
 *     summary: Delete an employee by ID
 *     tags: [Töötajad]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Employee deleted
 *       404:
 *         description: Employee not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const employee = await db.T99tajad.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Not found' });
    await employee.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /tootajad:
 *   delete:
 *     summary: Delete all employees
 *     tags: [Töötajad]
 *     responses:
 *       204:
 *         description: All employees deleted
 */
router.delete('/', async (req, res) => {
  try {
    await db.T99tajad.destroy({ where: {} });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
