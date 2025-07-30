const express = require('express');
const accountController = require('../controllers/accountController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, accountController.addAccount);
router.get('/', auth, accountController.getAccounts);
router.delete('/:id', auth, accountController.deleteAccount);

module.exports = router;