// controllers/haigusloodController.js
const db = require('../models');
const { logCreate, logDelete, logWarnNotFound, logError } = require('../logger');

exports.list = async (req, res, next) => {
  try {
    const items = await db.Haiguslood.findAll();
    res.json(items);
  } catch (err) {
    logError('MedicalRecord', 'listing', err.message, {});
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await db.Haiguslood.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('MedicalRecord', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(item);
  } catch (err) {
    logError('MedicalRecord', 'getting', err.message, { params: req.params });
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    req.body.Kuupäev = new Date().toISOString().slice(0, 10);
    const item = await db.Haiguslood.create(req.body);
    logCreate('MedicalRecord', req.user?.id || 'unknown', req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating MedicalRecord:', err);
    logError('MedicalRecord', 'creating', err.message, { data: req.body, full: err });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await db.Haiguslood.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('MedicalRecord', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    logError('MedicalRecord', 'updating', err.message, { params: req.params, data: req.body });
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const item = await db.Haiguslood.findByPk(req.params.id);
    if (!item) {
      logWarnNotFound('MedicalRecord', req.user?.id || 'unknown', req.params);
      return res.status(404).json({ error: 'Not found' });
    }
    await item.destroy();
    logDelete('MedicalRecord', req.user?.id || 'unknown', req.params);
    res.status(204).send();
  } catch (err) {
    logError('MedicalRecord', 'deleting', err.message, { params: req.params });
    next(err);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await db.Haiguslood.destroy({ where: {} });
    logDelete('All MedicalRecords', req.user?.id || 'unknown', {});
    res.status(204).send();
  } catch (err) {
    logError('MedicalRecord', 'deleting all', err.message, {});
    next(err);
  }
};
