const express = require('express');
const aiController = require('../controllers/aiController');

const router = express.Router();

router.get('/reply/:accountId/:messageId', aiController.getSuggestedReply);

module.exports = router;