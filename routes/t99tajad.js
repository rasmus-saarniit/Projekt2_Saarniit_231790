const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, param } = require('express-validator');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const createCrudController = require('../controllers/crudController');

const crud = createCrudController(db.T99tajad);

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
// Protect all endpoints except admin-only with authenticateJWT and authorizeRoles('Admin', 'User')

// GET all employees
router.get('/', authenticateJWT, authorizeRoles('Admin', 'User'), crud.list);

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
// GET employee by ID (admin only)
router.get('/:id', authenticateJWT, authorizeRoles('Admin'), crud.get);

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
// POST create employee (admin or user)
// When creating an employee, link to the current user if available
router.post('/',
  authenticateJWT,
  authorizeRoles('Admin', 'User'),
  [
    body('Eesnimi').isString().notEmpty(),
    body('Perekonnanimi').isString().notEmpty(),
    body('Valdkond').isString().notEmpty()
  ],
  validate,
  async (req, res, next) => {
    try {
      const data = { ...req.body };
      if (req.user && req.user.id) {
        data.UserID = req.user.id;
      }
      const item = await db.T99tajad.create(data);
      res.status(201).json(item);
    } catch (err) {
      next(err);
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
// PUT update employee (admin or user)
router.put('/:id',
  authenticateJWT,
  authorizeRoles('Admin', 'User'),
  [
    param('id').isInt(),
    body('Eesnimi').optional().isString(),
    body('Perekonnanimi').optional().isString(),
    body('Valdkond').optional().isString()
  ],
  validate,
  crud.update
);

/**
 * @swagger
 * /tootajad/{id}:
 *   delete:
 *     summary: Delete an employee by ID (Admin only)
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
// DELETE employee by ID (protected)
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), crud.delete);

/**
 * @swagger
 * /tootajad:
 *   delete:
 *     summary: Delete all employees (Admin only)
 *     tags: [Töötajad]
 *     responses:
 *       204:
 *         description: All employees deleted
 */
// DELETE all employees (protected)
router.delete('/', authenticateJWT, authorizeRoles('Admin'), crud.deleteAll);

module.exports = router;
