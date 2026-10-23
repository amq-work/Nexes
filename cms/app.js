// ── app.js — CloudLinux Node.js Selector Startup File Safeguard ────────────────
// In some cPanel / CloudLinux environments, the default startup file is app.js.
// This file cleanly delegates execution to our primary server.js.
require('./server.js');
