const express = require('express');
const emailController = require('../controllers/emailController');

const router = express.Router();

router.get('/search', emailController.searchEmails);
router.get('/:accountId/:messageId', emailController.getEmailDetails);
router.patch('/:accountId/:messageId/read', emailController.markAsRead);

module.exports = router;