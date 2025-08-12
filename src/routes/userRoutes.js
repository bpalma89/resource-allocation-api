const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../utils/auth');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.post('/login', userController.login);

module.exports = router;
