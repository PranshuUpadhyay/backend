-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('teacher', 'student'))
);

-- Journals table
CREATE TABLE journals (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  published_at TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  published BOOLEAN DEFAULT FALSE
);

-- Attachments table
CREATE TABLE attachments (
  id SERIAL PRIMARY KEY,
  journal_id INTEGER REFERENCES journals(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('image', 'video', 'url', 'pdf')),
  url TEXT NOT NULL
);

-- Journal Tags table (who is tagged)
CREATE TABLE journal_tags (
  id SERIAL PRIMARY KEY,
  journal_id INTEGER REFERENCES journals(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications table (bonus)
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  journal_id INTEGER REFERENCES journals(id),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);