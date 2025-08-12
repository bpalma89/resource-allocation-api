const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const auth = require('../utils/auth');

router.get('/', positionController.getAllPositions);
router.get('/:id', positionController.getPositionById);
router.post('/', auth, positionController.createPosition);
router.put('/:id', auth, positionController.updatePosition);
router.delete('/:id', auth, positionController.deletePosition);

module.exports = router;