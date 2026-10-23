// ── server.js — Digital Nexes Hardened Blog CMS Server ────────────────────────
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const db = require('./db');
const logger = require('./logger');

const app = express();
app.set('trust proxy', 1);

// ── RESILIENT SUBFOLDER ROUTING MIDDLEWARE ─────────────────────────────────────
// Ensures all routes work identically whether Passenger passes /cms prefix or strips it.
app.use((req, res, next) => {
  if (req.url.startsWith('/cms')) {
    req.url = req.url.replace(/^\/cms/, '') || '/';
  }
  next();
});

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'digital_nexes_secure_cms_key_production_2026';

// Ensure structural directories exist
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const LOCAL_UPLOADS = path.join(__dirname, 'uploads');
if (!fs.existsSync(LOCAL_UPLOADS)) fs.mkdirSync(LOCAL_UPLOADS, { recursive: true });

// ── SECURITY MIDDLEWARE ────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https://digitalnexes.com", "https://www.digitalnexes.com", "http://localhost:3001", "http://localhost:4200", "http://127.0.0.1:3001", "http://127.0.0.1:4200"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);
    if (origin === 'https://digitalnexes.com' || origin === 'https://www.digitalnexes.com') return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { error: 'Too many requests from this IP. Please try again later.' }
});
app.use('/api/', apiLimiter);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' }
});

// In-memory progressive failed login tracking for Account Lockout
const failedLoginTracker = new Map();

function checkAccountLockout(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const record = failedLoginTracker.get(ip);
  if (record && record.lockUntil && record.lockUntil > Date.now()) {
    const minutesLeft = Math.ceil((record.lockUntil - Date.now()) / 60000);
    return res.status(429).json({
      error: `Account temporarily locked due to repeated failed login attempts. Please try again in ${minutesLeft} minutes.`
    });
  }
  next();
}

function recordFailedLogin(ip) {
  const record = failedLoginTracker.get(ip) || { count: 0, lockUntil: 0, tier: 1 };
  record.count += 1;
  if (record.count >= 5) {
    // Progressive lockout tier: Tier 1 = 15m, Tier 2 = 1h, Tier 3+ = 24h
    const minutes = record.tier === 1 ? 15 : (record.tier === 2 ? 60 : 1440);
    record.lockUntil = Date.now() + minutes * 60 * 1000;
    record.tier = Math.min(record.tier + 1, 3);
    record.count = 0;
  }
  failedLoginTracker.set(ip, record);
}

function resetFailedLogin(ip) {
  failedLoginTracker.delete(ip);
}

// ── CSRF PROTECTION MIDDLEWARE (Double Submit Cookie Pattern) ──────────────────
function verifyCSRF(req, res, next) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    // Bypass CSRF for login and logout (no session/cookie yet for login; cookie cleared for logout)
    if (req.path === '/api/auth/login' || req.path === '/api/auth/logout') return next();

    const cookieToken = req.cookies && req.cookies.csrf_token;
    const headerToken = req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];
    const authHeader = req.headers['authorization'];

    // Allow if double-submit cookie matches OR if authenticated via Bearer JWT + X-CSRF-Token header
    // (The custom header cannot be set by cross-origin forms, so this is OWASP-compliant)
    if ((cookieToken && headerToken && cookieToken === headerToken) ||
        (authHeader && authHeader.startsWith('Bearer ') && headerToken && headerToken.length >= 32)) {
      return next();
    }

    logger.logAudit('Security Violation', req, { reason: 'CSRF token missing or mismatched' });
    return res.status(403).json({ error: 'Security Error: CSRF token missing or invalid.' });
  }
  next();
}
app.use(verifyCSRF);

// Serve dashboard on root and /admin with caching
const staticOptions = { maxAge: '1d', etag: true };
app.use('/', express.static(path.join(__dirname, 'admin'), staticOptions));
app.use('/admin', express.static(path.join(__dirname, 'admin'), staticOptions));

// Block predictable admin probes with 404
['/wp-admin', '/administrator', '/backend', '/login.php'].forEach(route => {
  app.use(route, (req, res) => res.status(404).send('404 Not Found'));
});

// Serve uploaded images with 7-day caching
const uploadStaticOptions = { maxAge: '7d', etag: true };
app.use('/uploads', express.static(LOCAL_UPLOADS, uploadStaticOptions));
app.use('/uploads', express.static(UPLOADS_DIR, uploadStaticOptions));

// ── UPLOAD SECURITY & MAGIC BYTES VERIFICATION ─────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Security Error: Only approved image MIME types are permitted.'));
    }
    const parts = file.originalname.split('.');
    if (parts.length > 2) {
      return cb(new Error('Security Error: Double extensions or executable names rejected.'));
    }
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'];
    const ext = parts[parts.length - 1].toLowerCase();
    if (!allowedExts.includes(ext)) {
      return cb(new Error('Security Error: Unsupported file extension.'));
    }
    cb(null, true);
  }
});

function verifyImageMagicBytes(buffer, mimetype) {
  if (!buffer || buffer.length < 4) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true;
  // GIF: GIF8
  if (buffer.toString('ascii', 0, 4) === 'GIF8') return true;
  // WEBP: RIFF....WEBP
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return true;
  // SVG: Check xml/svg tags without script execution
  if (mimetype === 'image/svg+xml') {
    const str = buffer.toString('utf8', 0, 500).toLowerCase();
    if ((str.includes('<svg') || str.includes('<?xml')) && !str.includes('<script') && !str.includes('javascript:')) {
      return true;
    }
  }
  return false;
}

// ── AUTHENTICATION & ACCESS CONTROL MIDDLEWARE ─────────────────────────────────
const tokenBlocklist = new Set();

function authenticateToken(req, res, next) {
  const cookieToken = req.cookies && req.cookies.cms_session;
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.split(' ')[1];
  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Authentication required.' });
  }

  if (tokenBlocklist.has(token)) {
    return res.status(401).json({ error: 'Session invalidated. Please log in again.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired session token.' });
    // Enforce role
    if (user.role !== 'Content Writer' && user.role !== 'writer') {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    req.user = user;
    req.token = token;
    next();
  });
}

// ── 1. AUTHENTICATION ENDPOINTS ────────────────────────────────────────────────
app.get('/api/auth/csrf', (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString('hex');
  res.cookie('csrf_token', csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 4 * 60 * 60 * 1000
  });
  res.json({ csrfToken });
});

app.post('/api/auth/login', loginLimiter, checkAccountLockout, (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const TARGET_USER = (process.env.CMS_USERNAME || 'digitalnexes.content@2023').trim().toLowerCase();
  if (email.trim().toLowerCase() !== TARGET_USER) {
    recordFailedLogin(ip);
    logger.logAudit('Failed Login', req, { email, reason: 'Unauthorized username attempt' });
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const users = db.getUsers();
  const user = users.find(u => u.email === TARGET_USER);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    recordFailedLogin(ip);
    logger.logAudit('Failed Login', req, { email, reason: 'Invalid password' });
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  resetFailedLogin(ip);

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: 'Content Writer' }, JWT_SECRET, { expiresIn: '4h' });
  const csrfToken = crypto.randomBytes(32).toString('hex');

  res.cookie('cms_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 4 * 60 * 60 * 1000
  });
  res.cookie('csrf_token', csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 4 * 60 * 60 * 1000
  });

  logger.logAudit('Login', req, { email: user.email });

  res.json({
    success: true,
    token,
    csrfToken,
    user: { id: user.id, email: user.email, name: user.name, role: 'Content Writer' }
  });
});

app.post('/api/auth/logout', (req, res) => {
  const cookieToken = req.cookies && req.cookies.cms_session;
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.split(' ')[1];
  const token = cookieToken || bearerToken;

  if (token) {
    tokenBlocklist.add(token);
  }

  res.clearCookie('cms_session', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.clearCookie('csrf_token', { httpOnly: false, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  logger.logAudit('Logout', req);
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ── 2. DASHBOARD STATS (with 30-second cache) ───────────────────────────────────
let _statsCache = null;
let _statsCacheTs = 0;

app.get('/api/stats', authenticateToken, (req, res) => {
  const now = Date.now();
  if (_statsCache && (now - _statsCacheTs) < 30000) {
    return res.json(_statsCache);
  }
  const blogs = db.getBlogs();
  _statsCache = {
    total: blogs.length,
    published: blogs.filter(b => b.status === 'Published').length,
    draft: blogs.filter(b => b.status === 'Draft').length
  };
  _statsCacheTs = now;
  res.json(_statsCache);
});

let _blogsCache = null;
function invalidateCaches() {
  _statsCache = null;
  _statsCacheTs = 0;
  _blogsCache = null;
}

// ── SITEMAP AUTO-GENERATOR ──────────────────────────────────────────────────────
const SITEMAP_PATH = path.join(__dirname, '../sitemap.xml');
const SITEMAP_PUBLIC_PATH = path.join(__dirname, '../public/sitemap.xml');

function regenerateSitemap() {
  try {
    const blogs = db.getBlogs();
    const published = blogs.filter(b => b.status === 'Published');
    const now = new Date().toISOString();

    const urls = [
      `  <url>\n    <loc>https://digitalnexes.com/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`,
      `  <url>\n    <loc>https://digitalnexes.com/about</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
      `  <url>\n    <loc>https://digitalnexes.com/services</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
      `  <url>\n    <loc>https://digitalnexes.com/projects</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
      `  <url>\n    <loc>https://digitalnexes.com/blog</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`,
      `  <url>\n    <loc>https://digitalnexes.com/contact</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`,
      ...published.map(b => {
        const loc = `https://digitalnexes.com/insights/${b.slug}`;
        const lastmod = (b.updatedAt || b.createdAt || now).substring(0, 10);
        return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
      })
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

    // Write to production root and website public folder
    try { fs.writeFileSync(SITEMAP_PATH, xml, 'utf8'); } catch (e) {}
    try { fs.writeFileSync(SITEMAP_PUBLIC_PATH, xml, 'utf8'); } catch (e) {}
  } catch (err) {
    console.error('[CMS Sitemap] Failed to regenerate sitemap:', err.message);
  }
}

// Serve sitemap.xml if requested via CMS path
app.get('/sitemap.xml', (req, res) => {
  if (fs.existsSync(SITEMAP_PATH)) {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile(SITEMAP_PATH);
  } else if (fs.existsSync(SITEMAP_PUBLIC_PATH)) {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile(SITEMAP_PUBLIC_PATH);
  } else {
    regenerateSitemap();
    if (fs.existsSync(SITEMAP_PATH)) {
      res.setHeader('Content-Type', 'application/xml');
      res.sendFile(SITEMAP_PATH);
    } else {
      res.status(404).send('Sitemap not found.');
    }
  }
});

// ── 3. BLOG MANAGEMENT ENDPOINTS ───────────────────────────────────────────────
// Public: Get all published blogs (cached in-memory for instant performance)
app.get('/api/blogs', (req, res) => {
  if (_blogsCache) {
    return res.json(_blogsCache);
  }
  const blogs = db.getBlogs();
  const published = blogs
    .filter(b => b.status === 'Published')
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  _blogsCache = published;
  res.json(published);
});

// Protected: Get ALL blogs
app.get('/api/blogs/all', authenticateToken, (req, res) => {
  const blogs = db.getBlogs();
  res.json(blogs.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)));
});

// Public: Get single blog by slug
app.get('/api/blogs/slug/:slug', (req, res) => {
  const blogs = db.getBlogs();
  const blog = blogs.find(b => b.slug === req.params.slug);
  if (!blog || (blog.status !== 'Published' && !req.query.preview)) {
    return res.status(404).json({ error: 'Blog post not found.' });
  }
  res.json(blog);
});

// Protected: Get single blog by ID
app.get('/api/blogs/:id', authenticateToken, (req, res) => {
  const blogs = db.getBlogs();
  const blog = blogs.find(b => b.id === req.params.id);
  if (!blog) {
    return res.status(404).json({ error: 'Blog post not found.' });
  }
  res.json(blog);
});

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function calculateReadingTime(blocks = []) {
  let text = '';
  blocks.forEach(blk => {
    if (blk.content && typeof blk.content === 'string') text += ' ' + blk.content;
  });
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

// Protected: Create blog
app.post('/api/blogs', authenticateToken, (req, res) => {
  const {
    title, subtitle, slug, featuredImage, date, readingTime,
    category, tags, status, seoTitle, metaDescription,
    canonicalUrl, openGraphImage, robots, blocks
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Blog title is required.' });
  }

  const blogs = db.getBlogs();
  const finalSlug = (slug && slug.trim()) ? generateSlug(slug) : generateSlug(title);

  if (blogs.some(b => b.slug === finalSlug)) {
    return res.status(400).json({ error: `A blog post with slug "${finalSlug}" already exists.` });
  }

  const newBlog = {
    id: 'blog_' + Date.now(),
    title: title.trim(),
    subtitle: subtitle ? subtitle.trim() : '',
    slug: finalSlug,
    featuredImage: featuredImage || '/assets/logo.webp',
    date: date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    readingTime: readingTime || calculateReadingTime(blocks),
    category: category || 'Technology',
    tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
    status: status === 'Published' ? 'Published' : 'Draft',
    seoTitle: seoTitle || title.trim() + ' | Digital Nexes',
    metaDescription: metaDescription || (subtitle ? subtitle.trim() : ''),
    canonicalUrl: canonicalUrl || `https://digitalnexes.com/insights/${finalSlug}`,
    openGraphImage: openGraphImage || featuredImage || '/assets/logo.webp',
    robots: robots === 'No Index' ? 'No Index' : 'Index',
    blocks: Array.isArray(blocks) ? blocks : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  blogs.push(newBlog);
  db.saveBlogs(blogs);
  invalidateCaches();
  regenerateSitemap();

  logger.logAudit('Blog Created', req, { id: newBlog.id, title: newBlog.title, status: newBlog.status });
  res.status(201).json({ success: true, blog: newBlog });
});

// Protected: Update blog
app.put('/api/blogs/:id', authenticateToken, (req, res) => {
  const blogs = db.getBlogs();
  const index = blogs.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Blog post not found.' });

  const current = blogs[index];
  const {
    title, subtitle, slug, featuredImage, date, readingTime,
    category, tags, status, seoTitle, metaDescription,
    canonicalUrl, openGraphImage, robots, blocks
  } = req.body;

  const finalSlug = (slug && slug.trim()) ? generateSlug(slug) : (title ? generateSlug(title) : current.slug);

  if (blogs.some(b => b.slug === finalSlug && b.id !== current.id)) {
    return res.status(400).json({ error: `A blog post with slug "${finalSlug}" already exists.` });
  }

  const updatedBlog = {
    ...current,
    title: title !== undefined ? title.trim() : current.title,
    subtitle: subtitle !== undefined ? subtitle.trim() : current.subtitle,
    slug: finalSlug,
    featuredImage: featuredImage !== undefined ? featuredImage : current.featuredImage,
    date: date !== undefined ? date : current.date,
    readingTime: readingTime !== undefined ? readingTime : calculateReadingTime(blocks || current.blocks),
    category: category !== undefined ? category : current.category,
    tags: tags !== undefined ? (Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : [])) : current.tags,
    status: status === 'Published' ? 'Published' : 'Draft',
    seoTitle: seoTitle !== undefined ? seoTitle : current.seoTitle,
    metaDescription: metaDescription !== undefined ? metaDescription : current.metaDescription,
    canonicalUrl: canonicalUrl !== undefined ? canonicalUrl : `https://digitalnexes.com/insights/${finalSlug}`,
    openGraphImage: openGraphImage !== undefined ? openGraphImage : current.openGraphImage,
    robots: robots === 'No Index' ? 'No Index' : 'Index',
    blocks: Array.isArray(blocks) ? blocks : current.blocks,
    updatedAt: new Date().toISOString()
  };

  blogs[index] = updatedBlog;
  db.saveBlogs(blogs);
  invalidateCaches();
  regenerateSitemap();

  logger.logAudit(updatedBlog.status === 'Published' && current.status !== 'Published' ? 'Blog Published' : 'Blog Edited', req, { id: updatedBlog.id, title: updatedBlog.title });
  res.json({ success: true, blog: updatedBlog });
});

// Protected: Delete blog
app.delete('/api/blogs/:id', authenticateToken, (req, res) => {
  const blogs = db.getBlogs();
  const blogToDelete = blogs.find(b => b.id === req.params.id);
  if (!blogToDelete) return res.status(404).json({ error: 'Blog post not found.' });

  const filtered = blogs.filter(b => b.id !== req.params.id);
  db.saveBlogs(filtered);
  invalidateCaches();
  regenerateSitemap();

  logger.logAudit('Blog Deleted', req, { id: req.params.id, title: blogToDelete.title });
  res.json({ success: true, message: 'Blog deleted successfully.' });
});

// ── 4. SECURE IMAGE UPLOAD ENDPOINT ────────────────────────────────────────────
app.post('/api/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file uploaded.' });

    // Validate actual file signature (magic bytes)
    if (!verifyImageMagicBytes(req.file.buffer, req.file.mimetype)) {
      logger.logAudit('Security Alert', req, { reason: 'Invalid image signature detected during upload' });
      return res.status(400).json({ error: 'Security error: Invalid file signature. File is not a genuine image.' });
    }

    // Generate random cryptographic UUID filename
    const filename = `img_${crypto.randomUUID()}.webp`;
    const targetPath = path.join(UPLOADS_DIR, filename);

    // Compress via sharp
    await sharp(req.file.buffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(targetPath);

    // Save to local cms/uploads for serving (cms/ IS the subdomain root)
    const localPath = path.join(LOCAL_UPLOADS, filename);
    try { fs.copyFileSync(targetPath, localPath); } catch (e) {}

    // Serve via /uploads/ so image works seamlessly across both website root and cms
    const fileUrl = `/uploads/${filename}`;
    res.json({ success: true, url: fileUrl, filename });
  } catch (err) {
    console.error('[CMS Upload Error]:', err.message || err);
    res.status(400).json({ error: err.message || 'Failed to process uploaded file.' });
  }
});

// ── 5. PRODUCTION ERROR HANDLER ────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[CMS Production Error]:', err.stack || err.message || err);
  const isSafeMsg = err.message && !err.message.includes('/') && !err.message.includes('\\') && !err.message.includes('ENOENT') && !err.message.includes('SQL') && !err.message.includes('dir');
  res.status(err.status || 500).json({
    error: isSafeMsg ? err.message : 'An internal server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`[DIGITAL NEXES CMS] Server running securely on port ${PORT}`);
  console.log(`[DIGITAL NEXES CMS] Admin Portal: https://digitalnexes.com/cms/admin (Dev: http://localhost:${PORT}/admin)`);
});
