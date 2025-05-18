require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/db');
const errorHandler = require('./middleware/error.middleware');

app.use(express.json());
app.use('/uploads', express.static('uploads'));
// app.get('/', (req, res) => {
//   res.send('Welcome to the Journal App Backend!');
// });
// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/journals', require('./routes/journal.routes'));
app.use('/notifications', require('./routes/notification.routes'));
app.get('/', (req, res) => {
  res.send(`
    <h2>Auth</h2>
    <ul>
      <li><strong>POST</strong> {{baseUrl}}/auth/register - Register Teacher/Student</li>
      <li><strong>POST</strong> {{baseUrl}}/auth/login - Login Teacher/Student</li>
    </ul>

    <h2>Journal (Teacher Only)</h2>
    <ul>
      <li><strong>POST</strong> {{baseUrl}}/journals - Create Journal</li>
      <li><strong>PUT</strong> {{baseUrl}}/journals/1 - Update Journal</li>
      <li><strong>DELETE</strong> {{baseUrl}}/journals/1 - Delete Journal</li>
      <li><strong>POST</strong> {{baseUrl}}/journals/1/publish - Publish Journal</li>
    </ul>

    <h2>Feed</h2>
    <ul>
      <li><strong>GET</strong> {{baseUrl}}/journals/feed - Teacher Feed</li>
      <li><strong>GET</strong> {{baseUrl}}/journals/feed - Student Feed</li>
    </ul>

    <h2>Notifications</h2>
    <ul>
      <li><strong>GET</strong> {{baseUrl}}/notifications - List Notifications (Student)</li>
      <li><strong>POST</strong> {{baseUrl}}/notifications/1/read - Mark Notification as Read (Student)</li>
      <li><strong>POST</strong> {{baseUrl}}/notifications - Create Notification (Teacher)</li>
    </ul>
    <p>Please ensure if tagged_students are registered before attempting to tag them in Journal. If registered only then Role{Teacher} may tag the student in Journal .  </p>
  `);
});

// Error handler (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});

