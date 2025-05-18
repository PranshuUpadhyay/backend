const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

exports.sign = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '2h' });
exports.verify = (token) => jwt.verify(token, JWT_SECRET);