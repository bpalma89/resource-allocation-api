const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const auth = require('../utils/auth');
const { authorizeRoles } = require('../utils/middleware');
const ROLES = require('../utils/roles');

router.get('/', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), resourceController.getAllResources);
router.get('/:id', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), resourceController.getResourceById);
router.post('/', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), resourceController.createResource);
router.put('/:id', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), resourceController.updateResource);
router.delete('/:id', auth, authorizeRoles(ROLES.ADMIN), resourceController.deleteResource);

module.exports = router;
