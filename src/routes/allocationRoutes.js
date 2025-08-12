const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');
const authAlloc = require('../utils/auth');

router.get('/', allocationController.getAllAllocations);
router.get('/:positionId/:resourceId', allocationController.getAllocation);
router.post('/', authAlloc, allocationController.createAllocation);
router.put('/:positionId/:resourceId', authAlloc, allocationController.updateAllocation);
router.delete('/:positionId/:resourceId', authAlloc, allocationController.deleteAllocation);

module.exports = router;
