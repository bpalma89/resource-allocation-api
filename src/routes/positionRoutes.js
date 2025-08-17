const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const auth = require('../utils/auth');
const { authorizeRoles } = require('../utils/middleware');
const ROLES = require('../utils/roles');

router.get('/', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), positionController.getAllPositions);
router.get('/:id', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), positionController.getPositionById);
router.post('/', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), positionController.createPosition);
router.put('/:id', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), positionController.updatePosition);
router.delete('/:id', auth, authorizeRoles(ROLES.ADMIN), positionController.deletePosition);
router.get('/:id/allocations', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), positionController.getPositionAllocations);

module.exports = router;
