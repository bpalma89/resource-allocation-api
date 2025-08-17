const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../utils/auth');
const { authorizeRoles } = require('../utils/middleware');
const ROLES = require('../utils/roles');

router.get('/', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), projectController.getAllProjects);
router.get('/:id', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), projectController.getProjectById);
router.post('/', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), projectController.createProject);
router.put('/:id', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), projectController.updateProject);
router.delete('/:id', auth, authorizeRoles(ROLES.ADMIN), projectController.deleteProject);
router.get('/:id/positions', auth, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), projectController.getProjectPositions);

module.exports = router;
