const { Journal, JournalTag, Notification, User, Attachment } = require('../models');
const { Op } = require('sequelize');

exports.create = async (req, res) => {
  const { description, published_at, tagged_students = [], attachment_urls = [] } = req.body;

  // Parse tagged_students if it's a string (from form-data)
  let parsedTaggedStudents = tagged_students;
  if (typeof tagged_students === "string") {
    try {
      parsedTaggedStudents = JSON.parse(tagged_students);
    } catch (e) {
      parsedTaggedStudents = [];
    }
  }

  // Parse attachment_urls if it's a string (from form-data)
  let parsedAttachmentUrls = attachment_urls;
  if (typeof attachment_urls === "string") {
    try {
      parsedAttachmentUrls = JSON.parse(attachment_urls);
    } catch (e) {
      parsedAttachmentUrls = [];
    }
  }

  const journal = await Journal.create({ description, published_at, created_by: req.user.id });

  // Tag students & notify
  if (parsedTaggedStudents.length) {
    for (const student_id of parsedTaggedStudents) {
      await JournalTag.create({ journal_id: journal.id, student_id }); // <-- use student_id from loop
      await Notification.create({
        user_id: student_id, // <-- Notification uses user_id
        journal_id: journal.id,
        message: `You were tagged in a journal by ${req.user.username}`
      });
    }
  }

  // Attachments from uploaded files
  if (req.files) {
    for (const file of req.files) {
      await Attachment.create({
        journal_id: journal.id,
        type: file.mimetype.startsWith('image') ? 'image' :
              file.mimetype.startsWith('video') ? 'video' :
              file.mimetype === 'application/pdf' ? 'pdf' : 'url',
        url: file.path
      });
    }
  }

  // Attachments from external URLs
  if (parsedAttachmentUrls.length) {
    for (const att of parsedAttachmentUrls) {
      if (att.type && att.url) {
        await Attachment.create({
          journal_id: journal.id,
          type: att.type,
          url: att.url
        });
      }
    }
  }

  res.status(201).json(journal);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const journal = await Journal.findOne({ where: { id, created_by: req.user.id } });
  if (!journal) return res.status(404).json({ error: 'Not found' });
  const { description, published_at, tagged_students = [], attachment_urls = [] } = req.body;

  // Parse tagged_students if it's a string (from form-data)
  let parsedTaggedStudents = tagged_students;
  if (typeof tagged_students === "string") {
    try {
      parsedTaggedStudents = JSON.parse(tagged_students);
    } catch (e) {
      parsedTaggedStudents = [];
    }
  }

  // Parse attachment_urls if it's a string (from form-data)
  let parsedAttachmentUrls = attachment_urls;
  if (typeof attachment_urls === "string") {
    try {
      parsedAttachmentUrls = JSON.parse(attachment_urls);
    } catch (e) {
      parsedAttachmentUrls = [];
    }
  }

  if (description) journal.description = description;
  if (published_at) journal.published_at = published_at;
  await journal.save();

  // Update tags
  if (parsedTaggedStudents && parsedTaggedStudents.length) {
    await JournalTag.destroy({ where: { journal_id: journal.id } });
    for (const student_id of parsedTaggedStudents) {
      await JournalTag.create({ journal_id: journal.id, student_id }); // <-- use student_id from loop
      await Notification.create({
        user_id: student_id, // <-- Notification uses user_id
        journal_id: journal.id,
        message: `You were tagged in a journal by ${req.user.username}`
      });
    }
  }

  // Attachments from uploaded files (optional for update, depends on business logic)
  if (req.files) {
    for (const file of req.files) {
      await Attachment.create({
        journal_id: journal.id,
        type: file.mimetype.startsWith('image') ? 'image' :
              file.mimetype.startsWith('video') ? 'video' :
              file.mimetype === 'application/pdf' ? 'pdf' : 'url',
        url: file.path
      });
    }
  }

  // Attachments from external URLs
  if (parsedAttachmentUrls.length) {
    for (const att of parsedAttachmentUrls) {
      if (att.type && att.url) {
        await Attachment.create({
          journal_id: journal.id,
          type: att.type,
          url: att.url
        });
      }
    }
  }

  res.json(journal);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const journal = await Journal.findOne({ where: { id, created_by: req.user.id } });
  if (!journal) return res.status(404).json({ error: 'Not found' });
  await journal.destroy();
  res.status(204).send();
};

exports.publish = async (req, res) => {
  const { id } = req.params;
  const journal = await Journal.findOne({ where: { id, created_by: req.user.id } });
  if (!journal) return res.status(404).json({ error: 'Not found' });
  journal.published = true;
  journal.published_at = new Date();
  await journal.save();
  res.json(journal);
};

exports.feed = async (req, res) => {
  if (req.user.role === 'teacher') {
    const journals = await Journal.findAll({ where: { created_by: req.user.id }, include: [Attachment] });
    res.json(journals);
  } else {
    const now = new Date();
    const journals = await Journal.findAll({
      include: [
        { model: User, as: 'tagged', where: { id: req.user.id } },
        Attachment
      ],
      where: { published: true, published_at: { [Op.lte]: now } }
    });
    res.json(journals);
  }
};