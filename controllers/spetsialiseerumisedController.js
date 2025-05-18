// controllers/spetsialiseerumisedController.js
const db = require('../models');
const { logCreate, logDelete, logWarnNotFound, logError } = require('../logger');
const { Op } = require('sequelize');

exports.list = async (req, res, next) => {
  const { Valdkond } = req.query;
  const where = {};
  if (Valdkond) where.Valdkond = { [Op.iLike]: `%${Valdkond}%` };
  try {
    const specs = await db.Spetsialiseerumine.findAll({ where });
    res.json(specs);
  } catch (err) {
    logError('Specialization', 'listing', err.message, {});
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await db.Spetsialiseerumine.create(req.body);
    logCreate('Specialization', req.user?.id || 'unknown', req.body);
    res.status(201).json(item);
  } catch (err) {
    logError('Specialization', 'creating', err.message, { data: req.body });
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { ArstiID, Valdkond } = req.params;
    const deleted = await db.Spetsialiseerumine.destroy({ where: { ArstiID, Valdkond } });
    if (deleted === 0) {
      logWarnNotFound('Specialization', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    logDelete('Specialization', req.user?.id || 'unknown', req.params);
    res.status(204).send();
  } catch (err) {
    logError('Specialization', 'deleting', err.message, { params: req.params });
    next(err);
  }
};
