const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');

router.get('/', allocationController.getAllAllocations);
router.get('/:positionId/:resourceId', allocationController.getAllocation);
router.post('/', allocationController.createAllocation);
router.put('/:positionId/:resourceId', allocationController.updateAllocation);
router.delete('/:positionId/:resourceId', allocationController.deleteAllocation);

module.exports = router;
