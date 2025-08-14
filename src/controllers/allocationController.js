const allocationService = require('../services/allocationService');
const { validateExists, validateAllocationUniqueness  } = require('../utils/validator');

exports.getAllAllocations = async (req, res, next) => {
  try {
    const items = await allocationService.getAllAllocations();
    res.json(items);
  } catch (err) { next(err); }
};

exports.getAllocation = async (req, res, next) => {
  try {
    const { positionId, resourceId } = req.params;
    const item = await allocationService.getAllocation(positionId, resourceId);
    if (!item || item.is_deleted) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.createAllocation = async (req, res, next) => {
  try {
    const data = { ...req.body, createdById: req.user.id, created_on: new Date() };

    await validateExists('position', req.body.positionId, 'Position');
    await validateExists('resource', req.body.resourceId, 'Resource');
    await validateAllocationUniqueness(req.body.positionId, req.body.resourceId);
    
    const item = await allocationService.createAllocation(data);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.updateAllocation = async (req, res, next) => {
  try {
    const { positionId, resourceId } = req.params;
    const { positionId: newPositionId, resourceId: newResourceId } = req.body;

    const isChangingKey = newPositionId && newResourceId &&
      (newPositionId !== positionId || newResourceId !== resourceId);

    if (isChangingKey) {
      await validateAllocationUniqueness(newPositionId, newResourceId);
    }

    const data = { ...req.body, modifiedById: req.user.id, modified_on: new Date() };
    const item = await allocationService.updateAllocation(positionId, resourceId, data);
    res.json(item);
  } catch (err) { next(err); }
};

exports.deleteAllocation = async (req, res, next) => {
  try {
    const { positionId, resourceId } = req.params;
    const data = { is_deleted: true, modifiedById: req.user.id, modified_on: new Date() };
    await allocationService.deleteAllocation(positionId, resourceId, data);
    res.status(204).end();
  } catch (err) { next(err); }
};