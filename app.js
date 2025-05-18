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
  res.send("Auth POST {{baseUrl}}/auth/register - Register Teacher/Student <br> POST {{baseUrl}}/auth/login - Login Teacher/Student<br>Journal (Teacher Only):<br>POST {{baseUrl}}/journals - Create Journal<br> PUT {{baseUrl}}/journals/1 - Update Journal<br>DELETE {{baseUrl}}/journals/1 - Delete Journal<br>POST {{baseUrl}}/journals/1/publish - Publish Journal<br>Feed:<br>GET {{baseUrl}}/journals/feed - Teacher Feed<br>GET {{baseUrl}}/journals/feed - Student Feed<br>Notifications:<br>GET {{baseUrl}}/notifications - List Notifications (Student)<br>POST {{baseUrl}}/notifications/1/read - Mark Notification as Read (Student)<br>POST {{baseUrl}}/notifications - Create Notification (Teacher)); "
)});
// Error handler (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});

