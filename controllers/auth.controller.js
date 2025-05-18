const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { sign } = require('../utils/jwt');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hash, role });
    res.status(201).json({ id: user.id, username, role });
  } catch (e) {
    res.status(400).json({ error: 'Username exists' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = sign({ id: user.id, username: user.username, role: user.role });
  res.json({ token });
};