// controllers/t99tajadController.js
const db = require('../models');
const { logWarnNotFound, logError } = require('../logger');

exports.list = async (req, res, next) => {
  try {
    const items = await db.T99tajad.findAll();
    res.json(items);
  } catch (err) {
    logError('Employee', 'listing', err.message, {});
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await db.T99tajad.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Employee', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(item);
  } catch (err) {
    logError('Employee', 'getting', err.message, { params: req.params });
    next(err);
  }
};

exports.create = async (req, res, next) => {
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
};

exports.update = async (req, res, next) => {
  try {
    const item = await db.T99tajad.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Employee', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    logError('Employee', 'updating', err.message, { params: req.params, data: req.body });
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const item = await db.T99tajad.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Employee', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.destroy();
    res.status(204).send();
  } catch (err) {
    logError('Employee', 'deleting', err.message, { params: req.params });
    next(err);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await db.T99tajad.destroy({ where: {} });
    res.status(204).send();
  } catch (err) {
    logError('Employee', 'deleting all', err.message, {});
    next(err);
  }
};
