const express = require('express');
const router = express.Router();
const db = require('../models');
const { body, param } = require('express-validator');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const createCrudController = require('../controllers/crudController');
const { logCreate, logDelete, logWarnNotFound, logError } = require('../logger');

const crud = createCrudController(db.Klient);

/**
 * @swagger
 * /kliendid:
 *   get:
 *     summary: Get all clients
 *     tags: [Kliendid]
 *     responses:
 *       200:
 *         description: List of clients
 */
// Protect all endpoints except admin-only with authenticateJWT and authorizeRoles('Admin', 'User')

// GET all clients
router.get('/', authenticateJWT, authorizeRoles('Admin', 'User'), crud.list);

/**
 * @swagger
 * /kliendid/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags: [Kliendid]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client found
 *       404:
 *         description: Client not found
 */
// GET client by ID
router.get('/:id', authenticateJWT, authorizeRoles('Admin', 'User'), crud.get);

/**
 * @swagger
 * /kliendid:
 *   post:
 *     summary: Create a new client
 *     tags: [Kliendid]
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
 *               Isikukood:
 *                 type: string
 *               Telefoninr:
 *                 type: string
 *               Epost:
 *                 type: string
 *               Elukoht:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client created
 */
// POST create client
router.post('/', authenticateJWT, authorizeRoles('Admin', 'User'), [
  body('Eesnimi').isString().notEmpty(),
  body('Perekonnanimi').isString().notEmpty(),
  body('Isikukood').isString().notEmpty(),
  body('Telefoninr').isString().notEmpty(),
  body('Epost').isString().notEmpty(),
  body('Elukoht').isString().notEmpty()
], validate, async (req, res, next) => {
  try {
    const item = await db.Klient.create(req.body);
    logCreate('Client', req.user?.id || 'unknown', req.body);
    res.status(201).json(item);
  } catch (err) {
    logError('Client', 'creating', err.message, { data: req.body });
    next(err);
  }
});

/**
 * @swagger
 * /kliendid/{id}:
 *   put:
 *     summary: Update a client by ID
 *     tags: [Kliendid]
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
 *               Isikukood:
 *                 type: string
 *               Telefoninr:
 *                 type: string
 *               Epost:
 *                 type: string
 *               Elukoht:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client updated
 *       404:
 *         description: Client not found
 */
// PUT update client
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'User'), [
  param('id').isInt(),
  body('Eesnimi').optional().isString(),
  body('Perekonnanimi').optional().isString(),
  body('Isikukood').optional().isString(),
  body('Telefoninr').optional().isString(),
  body('Epost').optional().isString(),
  body('Elukoht').optional().isString()
], validate, crud.update);

/**
 * @swagger
 * /kliendid/{id}:
 *   delete:
 *     summary: Delete a client by ID (Admin only)
 *     tags: [Kliendid]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Client deleted
 *       404:
 *         description: Client not found
 */
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  try {
    const item = await db.Klient.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Client', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.destroy();
    logDelete('Client', req.user?.id || 'unknown', req.params);
    res.status(204).send();
  } catch (err) {
    logError('Client', 'deleting', err.message, { params: req.params });
    next(err);
  }
});

/**
 * @swagger
 * /kliendid:
 *   delete:
 *     summary: Delete all clients (Admin only)
 *     tags: [Kliendid]
 *     responses:
 *       204:
 *         description: All clients deleted
 */
router.delete('/', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  try {
    await db.Klient.destroy({ where: {} });
    logDelete('All Clients', req.user?.id || 'unknown', {});
    res.status(204).send();
  } catch (err) {
    logError('Client', 'deleting all', err.message, {});
    next(err);
  }
});

module.exports = router;
