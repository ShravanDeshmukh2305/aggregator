const { check, validationResult } = require('express-validator');

exports.validateAuth = [
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];