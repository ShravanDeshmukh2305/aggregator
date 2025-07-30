const express = require('express');
const authController = require('../controllers/authController');
const { validateAuth } = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateAuth, authController.register);
router.post('/login', validateAuth, authController.login);

module.exports = router;