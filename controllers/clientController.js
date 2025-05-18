// controllers/clientController.js
const db = require('../models');
const { logCreate, logDelete, logWarnNotFound, logError } = require('../logger');

exports.list = async (req, res, next) => {
  try {
    const items = await db.Klient.findAll();
    res.json(items);
  } catch (err) {
    logError('Client', 'listing', err.message, {});
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await db.Klient.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Client', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(item);
  } catch (err) {
    logError('Client', 'getting', err.message, { params: req.params });
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await db.Klient.create(req.body);
    logCreate('Client', req.user?.id || 'unknown', req.body);
    res.status(201).json(item);
  } catch (err) {
    logError('Client', 'creating', err.message, { data: req.body });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await db.Klient.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Client', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    logError('Client', 'updating', err.message, { params: req.params, data: req.body });
    next(err);
  }
};

exports.delete = async (req, res, next) => {
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
};

exports.deleteAll = async (req, res, next) => {
  try {
    await db.Klient.destroy({ where: {} });
    logDelete('All Clients', req.user?.id || 'unknown', {});
    res.status(204).send();
  } catch (err) {
    logError('Client', 'deleting all', err.message, {});
    next(err);
  }
};
