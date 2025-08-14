const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');
const auth = require('../utils/auth');
const { authorizeRoles } = require('../utils/middleware');
const ROLES = require('../utils/roles');

router.get('/', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), allocationController.getAllAllocations);
router.get('/:positionId/:resourceId', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), allocationController.getAllocation);
router.post('/', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), allocationController.createAllocation);
router.put('/:positionId/:resourceId', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), allocationController.updateAllocation);
router.delete('/:positionId/:resourceId', auth, authorizeRoles(ROLES.ADMIN), allocationController.deleteAllocation);

module.exports = router;
