require('dotenv').config();
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const BLOGS_FILE = path.join(DATA_DIR, 'blogs.json');

// Ensure data and structural directories exist
['data', 'uploads', 'logs'].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Helper to read JSON safely
function readJSON(filePath, defaultData = null) {
  try {
    if (!fs.existsSync(filePath)) {
      if (defaultData !== null) {
        writeJSON(filePath, defaultData);
      }
      return defaultData;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultData;
  }
}

// Helper to write JSON atomically
function writeJSON(filePath, data) {
  try {
    const tempPath = filePath + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Enforce single allowed Content Writer account per production requirements
function initUsers() {
  const existingUsers = readJSON(USERS_FILE);
  const targetEmail = process.env.CMS_USERNAME || 'digitalnexes.content@2023';
  const hasTargetUser = existingUsers && existingUsers.some(u => u.email === targetEmail);

  if (!hasTargetUser || existingUsers.length !== 1 || existingUsers[0].email !== targetEmail) {
    const passwordHash = process.env.CMS_PASSWORD_HASH || '$2a$12$gTQAjCmI7ft.b9wH934ph.RQszk9Ju81eSboHdmmfgprb9Dnf.03m';
    const enforcedUser = [
      {
        id: 'usr_writer_main',
        email: targetEmail,
        password: passwordHash,
        name: 'Digital Nexes Content Writer',
        role: 'Content Writer',
        createdAt: new Date().toISOString()
      }
    ];
    writeJSON(USERS_FILE, enforcedUser);
    console.log(`[CMS DB] Enforced single allowed Content Writer account: ${targetEmail}`);
  }
}

// Initialize empty blogs file if it does not exist yet
// New blogs are created exclusively via the CMS — no sample data is seeded in production
function initBlogs() {
  if (!fs.existsSync(BLOGS_FILE)) {
    writeJSON(BLOGS_FILE, []);
    console.log('[CMS DB] Initialized empty blogs store. Use the CMS to publish your first article.');
  }
}

// Initialize database files
initUsers();
initBlogs();

module.exports = {
  getUsers: () => readJSON(USERS_FILE, []),
  saveUsers: (users) => writeJSON(USERS_FILE, users),
  getBlogs: () => readJSON(BLOGS_FILE, []),
  saveBlogs: (blogs) => writeJSON(BLOGS_FILE, blogs)
};
