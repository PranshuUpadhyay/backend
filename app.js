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
const fs = require('fs'); // Import the file system module

app.get('/', (req, res) => {
  const filePath = './postman/JournalApp.postman_collection.json';

  // Read the JSON file and send it as a response
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      res.status(500).send('Error reading JSON file');
    } else {
      res.json(JSON.parse(data)); // Send parsed JSON content
    }
  });
});
// Error handler (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});

