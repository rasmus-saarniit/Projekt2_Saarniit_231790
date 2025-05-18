// controllers/patsiendidController.js
const db = require('../models');
const { logCreate, logDelete, logWarnNotFound, logError } = require('../logger');

exports.list = async (req, res, next) => {
  try {
    const items = await db.Patsiendid.findAll();
    res.json(items);
  } catch (err) {
    logError('Patient', 'listing', err.message, {});
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await db.Patsiendid.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Patient', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(item);
  } catch (err) {
    logError('Patient', 'getting', err.message, { params: req.params });
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await db.Patsiendid.create(req.body);
    logCreate('Patient', req.user?.id || 'unknown', req.body);
    res.status(201).json(item);
  } catch (err) {
    logError('Patient', 'creating', err.message, { data: req.body });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await db.Patsiendid.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Patient', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    logError('Patient', 'updating', err.message, { params: req.params, data: req.body });
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const item = await db.Patsiendid.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Patient', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.destroy();
    logDelete('Patient', req.user?.id || 'unknown', req.params);
    res.status(204).send();
  } catch (err) {
    logError('Patient', 'deleting', err.message, { params: req.params });
    next(err);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await db.Patsiendid.destroy({ where: {} });
    logDelete('All Patients', req.user?.id || 'unknown', {});
    res.status(204).send();
  } catch (err) {
    logError('Patient', 'deleting all', err.message, {});
    next(err);
  }
};
