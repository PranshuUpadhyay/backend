const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { register, login } = require('../utils/validation');

router.post('/register', register, validate, controller.register);
router.post('/login', login, validate, controller.login);

module.exports = router;