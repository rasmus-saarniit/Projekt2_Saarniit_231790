// controllers/liigidController.js
const db = require('../models');
const { logCreate, logDelete, logWarnNotFound, logError } = require('../logger');

exports.list = async (req, res, next) => {
  try {
    const items = await db.Liik.findAll();
    res.json(items);
  } catch (err) {
    logError('Species', 'listing', err.message, {});
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await db.Liik.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Species', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(item);
  } catch (err) {
    logError('Species', 'getting', err.message, { params: req.params });
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await db.Liik.create(req.body);
    logCreate('Species', req.user?.id || 'unknown', req.body);
    res.status(201).json(item);
  } catch (err) {
    logError('Species', 'creating', err.message, { data: req.body });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await db.Liik.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Species', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    logError('Species', 'updating', err.message, { params: req.params, data: req.body });
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const item = await db.Liik.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('Species', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.destroy();
    logDelete('Species', req.user?.id || 'unknown', req.params);
    res.status(204).send();
  } catch (err) {
    logError('Species', 'deleting', err.message, { params: req.params });
    next(err);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await db.Liik.destroy({ where: {} });
    logDelete('All Species', req.user?.id || 'unknown', {});
    res.status(204).send();
  } catch (err) {
    logError('Species', 'deleting all', err.message, {});
    next(err);
  }
};
