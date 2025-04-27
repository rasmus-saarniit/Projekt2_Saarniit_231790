// controllers/crudController.js
// Generic CRUD controller factory for Sequelize models

function createCrudController(model) {
  return {
    // List all
    list: async (req, res, next) => {
      try {
        const items = await model.findAll();
        res.json(items);
      } catch (err) {
        next(err);
      }
    },
    // Get by ID
    get: async (req, res, next) => {
      try {
        const item = await model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        res.json(item);
      } catch (err) {
        next(err);
      }
    },
    // Create
    create: async (req, res, next) => {
      try {
        const item = await model.create(req.body);
        res.status(201).json(item);
      } catch (err) {
        next(err);
      }
    },
    // Update
    update: async (req, res, next) => {
      try {
        const item = await model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        await item.update(req.body);
        res.json(item);
      } catch (err) {
        next(err);
      }
    },
    // Delete by ID
    delete: async (req, res, next) => {
      try {
        const item = await model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        await item.destroy();
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    },
    // Delete all
    deleteAll: async (req, res, next) => {
      try {
        await model.destroy({ where: {} });
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    }
  };
}

module.exports = createCrudController;
