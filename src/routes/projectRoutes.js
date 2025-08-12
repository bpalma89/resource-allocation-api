const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../utils/auth');

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', auth, projectController.createProject);
router.put('/:id', auth, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;
