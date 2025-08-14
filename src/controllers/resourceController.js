const resourceService = require('../services/resourceService');

exports.getAllResources = async (req, res, next) => {
  try {
    const items = await resourceService.getAllResources();
    res.json(items);
  } catch (err) { next(err); }
};

exports.getResourceById = async (req, res, next) => {
  try {
    const item = await resourceService.getResourceById(req.params.id);
    if (!item || item.is_deleted) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.createResource = async (req, res, next) => {
  try {
    const data = { ...req.body, createdById: req.user.id, created_on: new Date() };
    const item = await resourceService.createResource(data);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.updateResource = async (req, res, next) => {
  try {
    const data = { ...req.body, modifiedById: req.user.id, modified_on: new Date() };
    const item = await resourceService.updateResource(req.params.id, data);
    res.json(item);
  } catch (err) { next(err); }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const data = { is_deleted: true, modifiedById: req.user.id, modified_on: new Date() };
    await resourceService.deleteResource(req.params.id, data);
    res.status(204).end();
  } catch (err) { next(err); }
};