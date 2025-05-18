
const { body } = require('express-validator');

/**
 * Validation rules for creating a journal.
 */
const createJournalValidation = [
  body('description').isString().notEmpty(),
  body('published_at').optional().isISO8601(),
  body('tagged_students')
    .custom(value => {
      let arr = value;
      // If sent as string, try to parse
      if (typeof value === 'string') {
        try {
          arr = JSON.parse(value);
        } catch (e) {
          throw new Error('tagged_students must be a valid JSON array');
        }
      }
      // Check is array and all elements are numbers
      if (!Array.isArray(arr) || !arr.every(v => typeof v === 'number')) {
        throw new Error('tagged_students must be an array of numbers');
      }
      return true;
    })
    .optional()
];

module.exports = { createJournalValidation };