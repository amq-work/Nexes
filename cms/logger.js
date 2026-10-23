// ── logger.js — Digital Nexes CMS Audit Logger ───────────────────────────────
const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(__dirname, 'logs');
const AUDIT_FILE = path.join(LOGS_DIR, 'audit.json');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

function readAuditLogs() {
  try {
    if (!fs.existsSync(AUDIT_FILE)) {
      writeAuditLogs([]);
      return [];
    }
    const content = fs.readFileSync(AUDIT_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[CMS Logger] Error reading audit file:', err);
    return [];
  }
}

function writeAuditLogs(logs) {
  try {
    const tempPath = AUDIT_FILE + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(logs, null, 2), 'utf8');
    fs.renameSync(tempPath, AUDIT_FILE);
  } catch (err) {
    console.error('[CMS Logger] Error writing audit file:', err);
  }
}

/**
 * Log an audit event
 * @param {string} action - 'Login', 'Logout', 'Failed Login', 'Blog Created', 'Blog Edited', 'Blog Published', 'Blog Deleted'
 * @param {object} req - Express request object
 * @param {object} details - Additional details (e.g. blog title, error info)
 */
function logAudit(action, req, details = {}) {
  const timestamp = new Date().toISOString();
  const ip = req ? (req.ip || req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || 'unknown') : 'system';
  let userId = 'anonymous';
  if (req && req.user) {
    userId = req.user.email || req.user.id;
  } else if (details && details.email) {
    userId = details.email;
  }

  const entry = {
    id: 'log_' + Date.now() + '_' + Math.round(Math.random() * 1000),
    timestamp,
    action,
    userId,
    ip,
    details
  };

  // Read existing logs, append, and keep last 2000 logs to prevent unbounded file growth
  const logs = readAuditLogs();
  logs.unshift(entry); // Newest first
  if (logs.length > 2000) {
    logs.length = 2000;
  }
  writeAuditLogs(logs);

  console.log(`[CMS AUDIT] ${timestamp} | ${action.padEnd(14)} | User: ${userId.padEnd(25)} | IP: ${ip} | ${JSON.stringify(details)}`);
  return entry;
}

module.exports = {
  logAudit,
  readAuditLogs
};
