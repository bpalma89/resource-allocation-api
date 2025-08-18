const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateUser, authorizeRoles } = require('../utils/authUtils');
const ROLES = require('../utils/roles');

router.get('/', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), projectController.getAllProjects);
router.get('/:id', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), projectController.getProjectById);
router.post('/', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), projectController.createProject);
router.put('/:id', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), projectController.updateProject);
router.delete('/:id', authenticateUser, authorizeRoles(ROLES.ADMIN), projectController.deleteProject);
router.get('/:id/positions', authenticateUser, authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), projectController.getProjectPositions);

module.exports = router;
