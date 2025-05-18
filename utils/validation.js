const { body } = require('express-validator');

exports.register = [
  body('username').isString().isLength({ min: 3 }),
  body('password').isString().isLength({ min: 4 }),
  body('role').isIn(['teacher', 'student'])
];

exports.login = [
  body('username').isString(),
  body('password').isString()
];

exports.journal = [
  body('description').isString().notEmpty(),
  body('published_at').optional().isISO8601(),
  body('tagged_students').optional().isArray()
];