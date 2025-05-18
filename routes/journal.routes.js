const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const auth = require('../middleware/auth.middleware');
const requireTeacher = require('../middleware/role.middleware')('teacher');
const controller = require('../controllers/journal.controller');
const { createJournalValidation } = require('../middleware/journalValidator.middleware');
const validate = require('../middleware/validate.middleware');

router.post(
  '/',
  auth,
  requireTeacher,
  upload.array('attachments'),
  createJournalValidation,
  validate,
  controller.create
);

router.put(
  '/:id',
  auth,
  requireTeacher,
  upload.array('attachments'),
  createJournalValidation,
  validate,
  controller.update
);

router.delete('/:id', auth, requireTeacher, controller.delete);
router.post('/:id/publish', auth, requireTeacher, controller.publish);
router.get('/feed', auth, controller.feed);

module.exports = router;