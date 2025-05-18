const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const controller = require('../controllers/notification.controller');

router.get('/', auth, controller.list);
router.post('/:id/read', auth, controller.markRead);
router.post('/', controller.create);

module.exports = router;