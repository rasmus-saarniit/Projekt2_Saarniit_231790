// controllers/visiididController.js
const db = require('../models');
const { logCreate, logDelete, logWarnNotFound, logError } = require('../logger');

exports.list = async (req, res, next) => {
  try {
    const items = await db.Visiit.findAll();
    res.json(items);
  } catch (err) {
    logError('Visit', 'listing', err.message, {});
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await db.Visiit.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Visit', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(item);
  } catch (err) {
    logError('Visit', 'getting', err.message, { params: req.params });
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await db.Visiit.create(req.body);
    logCreate('Visit', req.user?.id || 'unknown', req.body);
    res.status(201).json(item);
  } catch (err) {
    logError('Visit', 'creating', err.message, { data: req.body });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await db.Visiit.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Visit', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    logError('Visit', 'updating', err.message, { params: req.params, data: req.body });
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const item = await db.Visiit.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Visit', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.destroy();
    logDelete('Visit', req.user?.id || 'unknown', req.params);
    res.status(204).send();
  } catch (err) {
    logError('Visit', 'deleting', err.message, { params: req.params });
    next(err);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await db.Visiit.destroy({ where: {} });
    logDelete('All Visits', req.user?.id || 'unknown', {});
    res.status(204).send();
  } catch (err) {
    logError('Visit', 'deleting all', err.message, {});
    next(err);
  }
};
