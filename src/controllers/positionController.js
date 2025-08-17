const positionService = require('../services/positionService');

exports.getAllPositions = async (req, res, next) => {
  try {
    const items = await positionService.getAllPositions();
    res.json(items);
  } catch (err) { next(err); }
};

exports.getPositionById = async (req, res, next) => {
  try {
    const item = await positionService.getPositionById(req.params.id);
    if (!item || item.is_deleted) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.createPosition = async (req, res, next) => {
  try {
    const data = { ...req.body, createdById: req.user.id, created_on: new Date() };
    const item = await positionService.createPosition(data);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.updatePosition = async (req, res, next) => {
  try {
    const data = { ...req.body, modifiedById: req.user.id, modified_on: new Date() };
    const item = await positionService.updatePosition(req.params.id, data);
    res.json(item);
  } catch (err) { next(err); }
};

exports.deletePosition = async (req, res, next) => {
  try {
    const data = { is_deleted: true, modifiedById: req.user.id, modified_on: new Date() };
    await positionService.deletePosition(req.params.id, data);
    res.status(204).end();
  } catch (err) { next(err); }
};

exports.getPositionAllocations = async (req, res, next) => {
  try {
    const position = await positionService.getPositionAllocations(req.params.id);
    if (!position || position.is_deleted) return res.status(404).json({ error: 'Position not found' });
    res.json(position.allocations);
  } catch (error) {
    next(error);
  }
};