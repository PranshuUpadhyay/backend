const { Notification, Journal } = require('../models');

exports.list = async (req, res) => {
  const notifications = await Notification.findAll({
    where: { user_id: req.user.id },
    include: [Journal],
    order: [['created_at', 'DESC']]
  });
  res.json(notifications);
};

exports.markRead = async (req, res) => {
  try {
    console.log(req.params)
    const {id}=req.params
    // Mark all notifications as read for the logged-in user
    const [updatedCount] = await Notification.update(
      { is_read: true },
      { where: { user_id:id } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'No notifications found' });
    }
    
    // Optionally, return the updated notifications
    const updatedNotifications = await Notification.findAll({
      where: { user_id:id },
      include: [Journal],
      order: [['created_at', 'DESC']]
    });
    res.json(updatedNotifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.create = async (req, res) => {
  try {
    const { message, user_id, journal_id } = req.body;

    if (!message || !user_id) {
      return res.status(422).json({ error: 'message and user_id are required' });
    }

    const notification = await Notification.create({
      message,
      user_id,
      journal_id
    });

    res.status(201).json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};