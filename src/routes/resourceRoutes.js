const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const authResource = require('../utils/auth');

router.get('/', resourceController.getAllResources);
router.get('/:id', resourceController.getResourceById);
router.post('/', authResource, resourceController.createResource);
router.put('/:id', authResource, resourceController.updateResource);
router.delete('/:id', authResource, resourceController.deleteResource);

module.exports = router;
