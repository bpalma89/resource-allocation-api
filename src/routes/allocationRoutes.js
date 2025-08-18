const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');
const { authenticateUser, authorizeRoles } = require('../utils/authUtils');
const ROLES = require('../utils/roles');

router.get('/', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), allocationController.getAllAllocations);
router.get('/:positionId/:resourceId', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), allocationController.getAllocation);
router.post('/', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), allocationController.createAllocation);
router.put('/:positionId/:resourceId', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), allocationController.updateAllocation);
router.delete('/:positionId/:resourceId', authenticateUser, authorizeRoles(ROLES.ADMIN), allocationController.deleteAllocation);

module.exports = router;
