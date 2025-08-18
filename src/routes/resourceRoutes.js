const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { authenticateUser, authorizeRoles } = require('../utils/authUtils');
const ROLES = require('../utils/roles');

router.get('/', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), resourceController.getAllResources);
router.get('/:id', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), resourceController.getResourceById);
router.post('/', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), resourceController.createResource);
router.put('/:id', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), resourceController.updateResource);
router.delete('/:id', authenticateUser, authorizeRoles(ROLES.ADMIN), resourceController.deleteResource);

module.exports = router;
