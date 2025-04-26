const express = require('express');
const router = express.Router();
const db = require('../models');

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
router.get('/', async (req, res) => {
  const clients = await db.Klient.findAll();
  res.json(clients);
});


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
router.post('/', async (req, res) => {
  try {
    const client = await db.Klient.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    console.error(err); // Log the full error to the server console
    res.status(500).json({ error: err.message, details: err.parent });
  }
});

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
router.get('/:id', async (req, res) => {
  const client = await db.Klient.findByPk(req.params.id);
  if (!client) return res.status(404).json({ error: 'Not found' });
  res.json(client);
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
router.put('/:id', async (req, res) => {
  const client = await db.Klient.findByPk(req.params.id);
  if (!client) return res.status(404).json({ error: 'Not found' });
  await client.update(req.body);
  res.json(client);
});

/**
 * @swagger
 * /kliendid/{id}:
 *   delete:
 *     summary: Delete a client by ID
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
router.delete('/:id', async (req, res) => {
  const client = await db.Klient.findByPk(req.params.id);
  if (!client) return res.status(404).json({ error: 'Not found' });
  await client.destroy();
  res.status(204).send();
});

/**
 * @swagger
 * /kliendid:
 *   delete:
 *     summary: Delete all clients
 *     tags: [Kliendid]
 *     responses:
 *       204:
 *         description: All clients deleted
 */
router.delete('/', async (req, res) => {
  await db.Klient.destroy({ where: {} });
  res.status(204).send();
});

module.exports = router;
