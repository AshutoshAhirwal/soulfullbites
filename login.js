// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — Login / Register Page Logic
// ─────────────────────────────────────────────────────────────────────────────

const $ = (id) => document.getElementById(id);
const API_BASE = '/api';

// ── State ─────────────────────────────────────────────────────────────────────
let activeTab = 'login';

// ── Tab Switching ─────────────────────────────────────────────────────────────
function switchTab(to) {
  activeTab = to;
  const tabs = document.querySelector('.auth-tabs');
  const loginPanel = $('panel-login');
  const registerPanel = $('panel-register');
  const tabLogin = $('tab-login');
  const tabRegister = $('tab-register');

  clearMessage();

  if (to === 'register') {
    tabs.classList.add('on-register');
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
    tabLogin.setAttribute('aria-selected', 'false');
    tabRegister.setAttribute('aria-selected', 'true');
    loginPanel.classList.remove('active');
    registerPanel.classList.add('active');
  } else {
    tabs.classList.remove('on-register');
    tabRegister.classList.remove('active');
    tabLogin.classList.add('active');
    tabRegister.setAttribute('aria-selected', 'false');
    tabLogin.setAttribute('aria-selected', 'true');
    registerPanel.classList.remove('active');
    loginPanel.classList.add('active');
  }
}

$('tab-login').addEventListener('click', () => switchTab('login'));
$('tab-register').addEventListener('click', () => switchTab('register'));
document.querySelectorAll('.auth-switch-btn').forEach((btn) => {
  btn.addEventListener('click', () => switchTab(btn.dataset.to));
});

// ── Password Visibility Toggle ────────────────────────────────────────────────
document.querySelectorAll('.auth-toggle-pw').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = $(btn.dataset.target);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.setAttribute('aria-label', input.type === 'password' ? 'Show password' : 'Hide password');
  });
});

// ── Password Strength ─────────────────────────────────────────────────────────
const pwInput = $('reg-password');
const pwFill = $('pw-bar-fill');
const pwLabel = $('pw-strength-label');

function checkStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

pwInput?.addEventListener('input', () => {
  const pw = pwInput.value;
  if (!pw) {
    pwFill.style.width = '0';
    pwLabel.textContent = '';
    return;
  }
  const score = checkStrength(pw);
  const percent = Math.min(100, (score / 5) * 100);
  const colors = ['#e05252', '#e08652', '#e0c452', '#52c87d', '#2ea85f'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  pwFill.style.width = `${percent}%`;
  pwFill.style.backgroundColor = colors[score - 1] || '#e05252';
  pwLabel.textContent = labels[score - 1] || '';
});

// ── Message Banner ────────────────────────────────────────────────────────────
function showMessage(text, type = 'error') {
  const el = $('auth-message');
  el.textContent = text;
  el.className = `auth-message ${type}`;
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function clearMessage() {
  const el = $('auth-message');
  el.className = 'auth-message hidden';
  el.textContent = '';
}

// ── Loading State ─────────────────────────────────────────────────────────────
function setLoading(btnId, loading) {
  const btn = $(btnId);
  if (!btn) return;
  const text = btn.querySelector('.auth-btn-text');
  const spinner = btn.querySelector('.auth-btn-spinner');
  btn.disabled = loading;
  text.classList.toggle('hidden', loading);
  spinner.classList.toggle('hidden', !loading);
}

// ── API Call ──────────────────────────────────────────────────────────────────
async function apiCall(endpoint, method, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// ── Redirect after auth ───────────────────────────────────────────────────────
function getRedirect() {
  const params = new URLSearchParams(window.location.search);
  return params.get('redirect') || '/dashboard';
}

// ── Login Form ────────────────────────────────────────────────────────────────
$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessage();

  const email = $('login-email').value.trim();
  const password = $('login-password').value;
  const honeypot = $('login-hp')?.value || '';

  if (!email || !password) {
    showMessage('Please enter your email and password.');
    return;
  }

  setLoading('login-btn', true);

  const { ok, data } = await apiCall('/user-auth', 'POST', { email, password, website: honeypot });

  setLoading('login-btn', false);

  if (!ok) {
    showMessage(data.error || 'Login failed. Please try again.');
    return;
  }

  showMessage('Welcome back! Redirecting…', 'success');
  setTimeout(() => { window.location.href = getRedirect(); }, 800);
});

// ── Register Form ─────────────────────────────────────────────────────────────
$('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessage();

  const name = $('reg-name').value.trim();
  const phone = $('reg-phone').value.trim();
  const email = $('reg-email').value.trim();
  const password = $('reg-password').value;
  const confirm = $('reg-confirm').value;
  const terms = $('reg-terms').checked;
  const honeypot = $('reg-hp')?.value || '';

  // Collect hCaptcha token (null-safe — works even if hCaptcha fails to load)
  const hcaptchaToken = window.hcaptcha
    ? (window.hcaptcha.getResponse($('hcaptcha-widget')) || '')
    : '';

  if (!name || !email || !password) {
    showMessage('Please fill in all required fields.');
    return;
  }
  if (password.length < 8) {
    showMessage('Password must be at least 8 characters.');
    return;
  }
  if (password !== confirm) {
    showMessage('Passwords do not match.');
    return;
  }
  if (!terms) {
    showMessage('Please agree to the Terms & Conditions.');
    return;
  }

  setLoading('register-btn', true);

  const { ok, data } = await apiCall('/user-auth', 'PUT', {
    name, phone, email, password,
    website: honeypot,      // honeypot field
    hcaptchaToken,          // CAPTCHA token
  });

  setLoading('register-btn', false);

  if (!ok) {
    // Reset CAPTCHA on failure so user can try again
    if (window.hcaptcha) window.hcaptcha.reset();
    showMessage(data.error || 'Registration failed. Please try again.');
    return;
  }

  showMessage('Account created! Redirecting to your dashboard…', 'success');
  setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
});

// ── Forgot Password (placeholder) ─────────────────────────────────────────────
$('forgot-link').addEventListener('click', () => {
  showMessage('Password reset: please contact support@soulfullbites.com', 'success');
});

// ── Check if already logged in → redirect ────────────────────────────────────
(async () => {
  try {
    const res = await fetch(`${API_BASE}/user-auth`, { credentials: 'same-origin' });
    const data = await res.json();
    if (data.user) {
      window.location.href = getRedirect();
    }
  } catch {
    // not logged in, proceed normally
  }
})();
