const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const { authenticateUser, authorizeRoles } = require('../utils/authUtils');
const ROLES = require('../utils/roles');

router.get('/', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), positionController.getAllPositions);
router.get('/:id', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), positionController.getPositionById);
router.post('/', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), positionController.createPosition);
router.put('/:id', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), positionController.updatePosition);
router.delete('/:id', authenticateUser, authorizeRoles(ROLES.ADMIN), positionController.deletePosition);
router.get('/:id/allocations', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), positionController.getPositionAllocations);

module.exports = router;
