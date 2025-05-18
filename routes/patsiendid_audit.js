const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: Kustutatud patsiendid
 *     description: Kustutatud patsientide auditi logi
 */

/**
 * @swagger
 * /patsiendid_audit:
 *   get:
 *     summary: Tagasta kõik kustutatud patsiendid
 *     tags: [Kustutatud patsiendid]
 *     responses:
 *       200:
 *         description: Kõik kustutatud patsiendid
 */
router.get('/', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  try {
    const deletedPatients = await db.Patsiendid_Audit.findAll({
      include: [{ model: db.Kasutajad, as: 'Kasutajad', attributes: ['id', 'username', 'role'] }]
    });
    res.json(deletedPatients);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /patsiendid_audit/{id}:
 *   get:
 *     summary: Tagasta kustutatud patsient ID järgi
 *     tags: [Kustutatud patsiendid]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kustutatud patsient leitud
 *       404:
 *         description: Kustutatud patsient puudub
 */
router.get('/:id', authenticateJWT, authorizeRoles('Admin'), async (req, res, next) => {
  try {
    const deletedPatient = await db.Patsiendid_Audit.findOne({
      where: { PatsiendiID: req.params.id },
      include: [{ model: db.Kasutajad, as: 'Kasutajad', attributes: ['id', 'username', 'role'] }]
    });
    if (!deletedPatient) return res.status(404).json({ error: 'Not found' });
    res.json(deletedPatient);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
