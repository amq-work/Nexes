// API_BASE environment detection:
// - On development (localhost or 127.0.0.1) → use http://localhost:3001/api
// - On production (digitalnexes.com/cms/admin) → use /cms/api
const API_BASE = (() => {
  const h = window.location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') return 'http://localhost:3001/api';
  return '/cms/api';
})();

let state = {
  token: localStorage.getItem('cms_token') || null,
  csrfToken: localStorage.getItem('cms_csrf_token') || null,
  user: JSON.parse(localStorage.getItem('cms_user') || 'null'),
  currentView: 'dashboard',
  currentBlogId: null,
  blocks: []
};

// Global fetch interceptor to automatically include HttpOnly cookies, JWT Bearer token & CSRF token
window._nativeFetch = window.fetch;
window.fetch = async function(url, options = {}) {
  options.credentials = 'include';
  options.headers = options.headers || {};
  if (state.token && !options.headers['Authorization']) {
    options.headers['Authorization'] = `Bearer ${state.token}`;
  }
  if (state.csrfToken && !options.headers['X-CSRF-Token'] && !options.headers['x-csrf-token']) {
    options.headers['X-CSRF-Token'] = state.csrfToken;
  }
  return window._nativeFetch(url, options);
};

// Automatic inactivity logout timer (60 minutes)
let inactivityTimer;
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  if (state.token) {
    inactivityTimer = setTimeout(() => {
      alert('Session expired due to inactivity. Please log in again.');
      logout();
    }, 60 * 60 * 1000);
  }
}
window.addEventListener('mousemove', resetInactivityTimer, { passive: true });
window.addEventListener('keydown', resetInactivityTimer, { passive: true });


// ── DOM ELEMENTS ──────────────────────────────────────────────────────────────
const loginView = document.getElementById('login-view');
const appView = document.getElementById('app-view');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const navItems = document.querySelectorAll('.nav-item');
const contentPanels = document.querySelectorAll('.content-panel');
const btnLogout = document.getElementById('btn-logout');

const statTotal = document.getElementById('stat-total');
const statPublished = document.getElementById('stat-published');
const statDraft = document.getElementById('stat-draft');
const blogsTableBody = document.getElementById('blogs-table-body');

const editorForm = document.getElementById('blog-editor-form');
const blocksContainer = document.getElementById('blocks-container');
const btnAddBlockTop = document.getElementById('btn-add-block-top');
const btnAddBlock = document.getElementById('btn-add-block');
const btnBackBlogs = document.getElementById('btn-back-blogs');
const btnSaveDraft = document.getElementById('btn-save-draft');
const btnPublishBlog = document.getElementById('btn-publish-blog');
const editorStatusBadge = document.getElementById('editor-status-badge');

// ── INITIALIZATION ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (state.token) {
    verifySession();
  } else {
    showLogin();
  }

  setupEventListeners();
});

function showLogin() {
  loginView.classList.add('active');
  appView.classList.remove('active');
}

function showApp() {
  loginView.classList.remove('active');
  appView.classList.add('active');
  if (state.user) {
    document.getElementById('user-name').textContent = state.user.name || 'Digital Nexes Content Writer';
    document.getElementById('user-email').textContent = state.user.email || 'digitalnexes.content@2023';
  }
  resetInactivityTimer();
  switchView('dashboard');
}

async function verifySession() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    if (res.ok) {
      const data = await res.json();
      state.user = data.user;
      localStorage.setItem('cms_user', JSON.stringify(state.user));
      showApp();
    } else {
      logout();
    }
  } catch (err) {
    console.warn('Backend reachable check failed, trying offline/local view if token valid...');
    if (state.token) showApp();
    else logout();
  }
}

// ── EVENT LISTENERS ───────────────────────────────────────────────────────────
function setupEventListeners() {
  // Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        state.token = data.token;
        state.csrfToken = data.csrfToken || null;
        state.user = data.user;
        localStorage.setItem('cms_token', data.token);
        if (data.csrfToken) localStorage.setItem('cms_csrf_token', data.csrfToken);
        localStorage.setItem('cms_user', JSON.stringify(data.user));
        showApp();
      } else {
        loginError.textContent = data.error || 'Login failed.';
        loginError.style.display = 'block';
      }
    } catch (err) {
      loginError.textContent = 'Could not connect to CMS server.';
      loginError.style.display = 'block';
    }
  });

  // Logout
  btnLogout.addEventListener('click', logout);

  // Sidebar navigation
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.getAttribute('data-target');
      switchView(target);
    });
  });

  // Create Blog Buttons
  document.querySelectorAll('.btn-create-blog').forEach(btn => {
    btn.addEventListener('click', () => {
      openEditor(null);
    });
  });

  // Back to Blogs button
  btnBackBlogs.addEventListener('click', () => {
    switchView('blogs');
  });

  // Event delegation for action buttons in Blogs Table (Edit, Toggle Publish, Delete)
  blogsTableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.action-btn');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    if (action === 'edit') {
      openEditor(id);
    } else if (action === 'toggle-publish') {
      const status = btn.getAttribute('data-status');
      togglePublish(id, status);
    } else if (action === 'delete') {
      const title = btn.getAttribute('data-title');
      deleteBlog(id, title);
    }
  });

  // Add block buttons
  if (btnAddBlockTop) btnAddBlockTop.addEventListener('click', () => addBlock('Paragraph'));
  if (btnAddBlock) btnAddBlock.addEventListener('click', () => addBlock('Paragraph'));

  // Save / Publish Buttons
  btnSaveDraft.addEventListener('click', () => saveBlog('Draft'));
  btnPublishBlog.addEventListener('click', () => saveBlog('Published'));

  // Auto-generate slug from title if slug is empty
  document.getElementById('edit-title').addEventListener('input', (e) => {
    const slugInput = document.getElementById('edit-slug');
    if (!state.currentBlogId || !slugInput.value.trim()) {
      slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
  });

  // Featured Image file upload
  const fileInput = document.getElementById('edit-image-file');
  const urlInput = document.getElementById('edit-image-url');
  const previewBox = document.getElementById('edit-image-preview');

  fileInput.addEventListener('change', async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const uploadedUrl = await uploadImageFile(file);
      if (uploadedUrl) {
        urlInput.value = uploadedUrl;
        updateImagePreview(uploadedUrl, previewBox);
      }
    }
  });

  urlInput.addEventListener('input', (e) => {
    updateImagePreview(e.target.value.trim(), previewBox);
  });
}

function logout() {
  clearTimeout(inactivityTimer);
  if (state.token) {
    window._nativeFetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Authorization': `Bearer ${state.token}`, 'X-CSRF-Token': state.csrfToken || '' }
    }).catch(() => {});
  }
  state.token = null;
  state.csrfToken = null;
  state.user = null;
  localStorage.removeItem('cms_token');
  localStorage.removeItem('cms_csrf_token');
  localStorage.removeItem('cms_user');
  showLogin();
}



// ── VIEW SWITCHING ────────────────────────────────────────────────────────────
function switchView(viewName) {
  state.currentView = viewName;

  // Update nav items
  navItems.forEach(item => {
    if (item.getAttribute('data-target') === viewName) item.classList.add('active');
    else item.classList.remove('active');
  });

  // Update panels
  contentPanels.forEach(panel => {
    panel.classList.remove('active');
  });

  if (viewName === 'dashboard') {
    document.getElementById('view-dashboard').classList.add('active');
    loadDashboardStats();
  } else if (viewName === 'blogs') {
    document.getElementById('view-blogs').classList.add('active');
    loadBlogsTable();
  } else if (viewName === 'editor') {
    document.getElementById('view-editor').classList.add('active');
  }
}

// ── DASHBOARD STATS ───────────────────────────────────────────────────────────
async function loadDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    if (res.ok) {
      const data = await res.json();
      statTotal.textContent = data.total || 0;
      statPublished.textContent = data.published || 0;
      statDraft.textContent = data.draft || 0;
    }
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

// ── BLOGS TABLE ───────────────────────────────────────────────────────────────
async function loadBlogsTable() {
  blogsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px; color: var(--text-muted);">Loading articles...</td></tr>`;
  try {
    const res = await fetch(`${API_BASE}/blogs/all`, {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    if (res.ok) {
      const blogs = await res.json();
      renderBlogsTable(blogs);
    } else {
      blogsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--danger);">Failed to fetch articles.</td></tr>`;
    }
  } catch (err) {
    blogsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--danger);">Error connecting to CMS server.</td></tr>`;
  }
}

function renderBlogsTable(blogs = []) {
  if (blogs.length === 0) {
    blogsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--text-muted);">No blog articles found. Click "+ Create New Blog" to get started!</td></tr>`;
    return;
  }

  blogsTableBody.innerHTML = blogs.map(blog => {
    const isPub = blog.status === 'Published';
    const badgeClass = isPub ? 'badge-pub' : 'badge-draft';
    return `
      <tr>
        <td>
          <div class="blog-title-cell">${escapeHtml(blog.title)}</div>
          <div class="blog-meta-sub">/insights/${escapeHtml(blog.slug)} • ${escapeHtml(blog.readingTime || '5 min read')}</div>
        </td>
        <td>${escapeHtml(blog.category || 'General')}</td>
        <td>${escapeHtml(blog.date || '')}</td>
        <td><span class="badge ${badgeClass}">${blog.status}</span></td>
        <td class="text-right">
          <div class="action-btns">
            <button class="btn btn-secondary btn-sm action-btn" data-action="edit" data-id="${blog.id}">Edit</button>
            <button class="btn btn-secondary btn-sm action-btn" data-action="toggle-publish" data-id="${blog.id}" data-status="${blog.status}">${isPub ? 'Unpublish' : 'Publish'}</button>
            <button class="btn btn-danger btn-sm action-btn" data-action="delete" data-id="${blog.id}" data-title="${escapeHtml(blog.title)}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ── BLOG EDITOR & STRUCTURED BLOCK MANAGEMENT ─────────────────────────────────
async function openEditor(blogId = null) {
  state.currentBlogId = blogId;
  switchView('editor');

  const titleInput = document.getElementById('edit-title');
  const subtitleInput = document.getElementById('edit-subtitle');
  const slugInput = document.getElementById('edit-slug');
  const categoryInput = document.getElementById('edit-category');
  const tagsInput = document.getElementById('edit-tags');
  const dateInput = document.getElementById('edit-date');
  const readTimeInput = document.getElementById('edit-reading-time');
  const urlInput = document.getElementById('edit-image-url');
  const previewBox = document.getElementById('edit-image-preview');
  const seoTitleInput = document.getElementById('edit-seo-title');
  const metaDescInput = document.getElementById('edit-meta-desc');
  const canonicalInput = document.getElementById('edit-canonical');
  const ogImageInput = document.getElementById('edit-og-image');
  const robotsSelect = document.getElementById('edit-robots');

  if (!blogId) {
    // New Blog
    editorStatusBadge.textContent = 'New Draft';
    editorStatusBadge.className = 'badge badge-draft';
    titleInput.value = '';
    subtitleInput.value = '';
    slugInput.value = '';
    categoryInput.value = 'Technology';
    tagsInput.value = 'AI, Digital Transformation, Strategy';
    dateInput.value = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    readTimeInput.value = '';
    urlInput.value = '/assets/logo.webp';
    updateImagePreview('/assets/logo.webp', previewBox);
    seoTitleInput.value = '';
    metaDescInput.value = '';
    canonicalInput.value = '';
    ogImageInput.value = '/assets/logo.webp';
    robotsSelect.value = 'Index';

    // Initialize 2 default blocks
    state.blocks = [
      { id: 'blk_' + Date.now() + '_1', type: 'Paragraph', content: '' },
      { id: 'blk_' + Date.now() + '_2', type: 'H2 Heading', content: '' },
      { id: 'blk_' + Date.now() + '_3', type: 'Paragraph', content: '' }
    ];
    renderBlocks();
  } else {
    // Edit Existing Blog
    try {
      const res = await fetch(`${API_BASE}/blogs/${blogId}`, {
        headers: { 'Authorization': `Bearer ${state.token}` }
      });
      if (res.ok) {
        const blog = await res.json();
        const isPub = blog.status === 'Published';
        editorStatusBadge.textContent = blog.status;
        editorStatusBadge.className = `badge ${isPub ? 'badge-pub' : 'badge-draft'}`;

        titleInput.value = blog.title || '';
        subtitleInput.value = blog.subtitle || '';
        slugInput.value = blog.slug || '';
        categoryInput.value = blog.category || '';
        tagsInput.value = Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || '');
        dateInput.value = blog.date || '';
        readTimeInput.value = blog.readingTime || '';
        urlInput.value = blog.featuredImage || '/assets/logo.webp';
        updateImagePreview(urlInput.value, previewBox);

        seoTitleInput.value = blog.seoTitle || '';
        metaDescInput.value = blog.metaDescription || '';
        canonicalInput.value = blog.canonicalUrl || '';
        ogImageInput.value = blog.openGraphImage || '';
        robotsSelect.value = blog.robots || 'Index';

        state.blocks = Array.isArray(blog.blocks) && blog.blocks.length > 0
          ? JSON.parse(JSON.stringify(blog.blocks))
          : [{ id: 'blk_' + Date.now(), type: 'Paragraph', content: '' }];
        renderBlocks();
      } else {
        alert('Could not load blog details.');
        switchView('blogs');
      }
    } catch (err) {
      alert('Error fetching blog details.');
      switchView('blogs');
    }
  }
}

window.editBlog = (id) => openEditor(id);

// ── BLOCK RENDERER ────────────────────────────────────────────────────────────
function renderBlocks() {
  blocksContainer.innerHTML = '';
  if (state.blocks.length === 0) {
    blocksContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">No blocks added. Click "+ Add Content Block" below.</p>`;
    return;
  }

  state.blocks.forEach((blk, idx) => {
    const blockEl = document.createElement('div');
    blockEl.className = 'block-item';
    blockEl.setAttribute('data-idx', idx);

    // Left side dropdown
    const types = ['H2 Heading', 'H3 Heading', 'H4 Heading', 'Paragraph', 'Bullet List', 'Numbered List', 'Quote', 'Image', 'Divider'];
    const selectHtml = `
      <div class="block-left">
        <label>Content Type</label>
        <select class="block-type-select" onchange="changeBlockType(${idx}, this.value)">
          ${types.map(t => `<option value="${t}" ${t === blk.type ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
        <span class="block-hint">Block #${idx + 1}</span>
      </div>
    `;

    // Right side input area
    let inputHtml = '';
    if (blk.type === 'H2 Heading' || blk.type === 'H3 Heading' || blk.type === 'H4 Heading') {
      inputHtml = `<input type="text" class="block-input" placeholder="Enter ${blk.type} text..." value="${escapeHtml(blk.content || '')}" oninput="updateBlockContent(${idx}, this.value)">`;
    } else if (blk.type === 'Paragraph') {
      inputHtml = `<textarea class="block-input block-textarea" rows="4" placeholder="Enter paragraph text..." oninput="updateBlockContent(${idx}, this.value)">${escapeHtml(blk.content || '')}</textarea>`;
    } else if (blk.type === 'Bullet List') {
      inputHtml = `
        <textarea class="block-input block-textarea" rows="3" placeholder="Enter bullet list items (one item per line)..." oninput="updateBlockContent(${idx}, this.value)">${escapeHtml(blk.content || '')}</textarea>
        <span class="block-hint">Each line will automatically generate one bullet item (&lt;li&gt;).</span>
      `;
    } else if (blk.type === 'Numbered List') {
      inputHtml = `
        <textarea class="block-input block-textarea" rows="3" placeholder="Enter numbered list items (one item per line)..." oninput="updateBlockContent(${idx}, this.value)">${escapeHtml(blk.content || '')}</textarea>
        <span class="block-hint">Each line will automatically generate one numbered item (&lt;li&gt;).</span>
      `;
    } else if (blk.type === 'Quote') {
      inputHtml = `<textarea class="block-input" rows="2" placeholder="Enter quote text..." oninput="updateBlockContent(${idx}, this.value)">${escapeHtml(blk.content || '')}</textarea>`;
    } else if (blk.type === 'Divider') {
      inputHtml = `<div class="divider-display"><div class="divider-line"></div></div><span class="block-hint">Visual divider section (&lt;hr&gt;). No text required.</span>`;
    } else if (blk.type === 'Image') {
      inputHtml = `
        <div class="block-image-wrap">
          <div class="block-img-row">
            <div class="block-img-preview" id="preview-blk-${idx}">
              ${blk.url ? `<img src="${blk.url}">` : `<span>No Img</span>`}
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
              <input type="text" class="block-input url-input" placeholder="Image URL (/uploads/... or /assets/...)" value="${escapeHtml(blk.url || '')}" oninput="updateBlockImage(${idx}, 'url', this.value)">
              <input type="file" accept="image/*" class="file-input" id="file-blk-${idx}" onchange="handleBlockImageUpload(${idx}, this)">
              <label for="file-blk-${idx}" class="btn btn-secondary btn-sm" style="align-self:flex-start;">Upload Image File</label>
            </div>
          </div>
          <input type="text" class="block-input" placeholder="Alt Text (SEO description for screen readers)" value="${escapeHtml(blk.alt || '')}" oninput="updateBlockImage(${idx}, 'alt', this.value)">
          <input type="text" class="block-input" placeholder="Optional Image Caption" value="${escapeHtml(blk.caption || '')}" oninput="updateBlockImage(${idx}, 'caption', this.value)">
        </div>
      `;
    }

    const rightHtml = `<div class="block-right">${inputHtml}</div>`;

    // Controls
    const controlsHtml = `
      <div class="block-actions">
        <button type="button" class="btn-icon" title="Move Up" onclick="moveBlock(${idx}, -1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
        </button>
        <button type="button" class="btn-icon" title="Move Down" onclick="moveBlock(${idx}, 1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <button type="button" class="btn-icon" title="Duplicate Block" onclick="duplicateBlock(${idx})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
        <button type="button" class="btn-icon btn-icon-danger" title="Delete Block" onclick="deleteBlockItem(${idx})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `;

    blockEl.innerHTML = selectHtml + rightHtml + controlsHtml;
    blocksContainer.appendChild(blockEl);
  });
}

// Block manipulation window functions
window.changeBlockType = (idx, newType) => {
  state.blocks[idx].type = newType;
  if (newType === 'Image' && !state.blocks[idx].url) {
    state.blocks[idx].url = '/assets/logo.webp';
    state.blocks[idx].alt = 'Illustration';
    state.blocks[idx].caption = '';
  }
  renderBlocks();
};

window.updateBlockContent = (idx, val) => {
  state.blocks[idx].content = val;
};

window.updateBlockImage = (idx, field, val) => {
  state.blocks[idx][field] = val;
  if (field === 'url') {
    const preview = document.getElementById(`preview-blk-${idx}`);
    if (preview) preview.innerHTML = val ? `<img src="${val}">` : `<span>No Img</span>`;
  }
};

window.handleBlockImageUpload = async (idx, inputEl) => {
  if (inputEl.files && inputEl.files[0]) {
    const uploadedUrl = await uploadImageFile(inputEl.files[0]);
    if (uploadedUrl) {
      state.blocks[idx].url = uploadedUrl;
      renderBlocks();
    }
  }
};

window.moveBlock = (idx, dir) => {
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= state.blocks.length) return;
  const temp = state.blocks[idx];
  state.blocks[idx] = state.blocks[newIdx];
  state.blocks[newIdx] = temp;
  renderBlocks();
};

window.duplicateBlock = (idx) => {
  const clone = JSON.parse(JSON.stringify(state.blocks[idx]));
  clone.id = 'blk_' + Date.now() + '_' + Math.round(Math.random() * 1000);
  state.blocks.splice(idx + 1, 0, clone);
  renderBlocks();
};

window.deleteBlockItem = (idx) => {
  if (state.blocks.length <= 1) {
    alert('An article must have at least one content block.');
    return;
  }
  state.blocks.splice(idx, 1);
  renderBlocks();
};

function addBlock(type = 'Paragraph') {
  state.blocks.push({
    id: 'blk_' + Date.now() + '_' + Math.round(Math.random() * 1000),
    type: type,
    content: ''
  });
  renderBlocks();
  // Scroll to bottom of blocks
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, 100);
}

// ── IMAGE UPLODER FUNCTION ────────────────────────────────────────────────────
async function uploadImageFile(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.token}`,
        'X-CSRF-Token': state.csrfToken || ''
      },
      body: formData
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      return data.url;
    } else {
      alert(data.error || `Image upload failed (HTTP ${res.status}).`);
      return null;
    }
  } catch (err) {
    alert('Failed to connect to image upload server.');
    return null;
  }
}

function updateImagePreview(url, previewBox) {
  if (!previewBox) return;
  if (url) {
    previewBox.innerHTML = `<img src="${url}" onerror="this.parentElement.innerHTML='<span>Invalid Img</span>'">`;
  } else {
    previewBox.innerHTML = `<span>No image selected</span>`;
  }
}

// ── SAVE / PUBLISH BLOG SUBMISSION ────────────────────────────────────────────
async function saveBlog(targetStatus) {
  const title = document.getElementById('edit-title').value.trim();
  if (!title) {
    alert('Please enter a Blog Title before saving.');
    document.getElementById('edit-title').focus();
    return;
  }

  const payload = {
    title: title,
    subtitle: document.getElementById('edit-subtitle').value.trim(),
    slug: document.getElementById('edit-slug').value.trim(),
    category: document.getElementById('edit-category').value.trim() || 'Technology',
    tags: document.getElementById('edit-tags').value.trim(),
    date: document.getElementById('edit-date').value.trim(),
    readingTime: document.getElementById('edit-reading-time').value.trim(),
    featuredImage: document.getElementById('edit-image-url').value.trim() || '/assets/logo.webp',
    status: targetStatus,
    seoTitle: document.getElementById('edit-seo-title').value.trim(),
    metaDescription: document.getElementById('edit-meta-desc').value.trim(),
    canonicalUrl: document.getElementById('edit-canonical').value.trim(),
    openGraphImage: document.getElementById('edit-og-image').value.trim() || '/assets/logo.webp',
    robots: document.getElementById('edit-robots').value,
    blocks: state.blocks
  };

  const url = state.currentBlogId ? `${API_BASE}/blogs/${state.currentBlogId}` : `${API_BASE}/blogs`;
  const method = state.currentBlogId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`,
        'X-CSRF-Token': state.csrfToken || ''
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      alert(`Blog successfully ${targetStatus === 'Published' ? 'published' : 'saved as draft'}!`);
      switchView('blogs');
    } else {
      alert(data.error || `Failed to save blog post (HTTP ${res.status}).`);
    }
  } catch (err) {
    alert('Error connecting to backend server while saving.');
  }
}

// ── DELETE & TOGGLE PUBLISH ───────────────────────────────────────────────────
window.deleteBlog = async (id, title) => {
  if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

  try {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${state.token}`, 'X-CSRF-Token': state.csrfToken || '' }
    });
    if (res.ok) {
      loadBlogsTable();
      loadDashboardStats();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || `Failed to delete blog (HTTP ${res.status}).`);
    }
  } catch (err) {
    alert('Error connecting to backend server.');
  }
};

window.togglePublish = async (id, currentStatus) => {
  const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';

  try {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`,
        'X-CSRF-Token': state.csrfToken || ''
      },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      loadBlogsTable();
      loadDashboardStats();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || `Failed to update status (HTTP ${res.status}).`);
    }
  } catch (err) {
    alert('Error connecting to backend server.');
  }
};

function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
