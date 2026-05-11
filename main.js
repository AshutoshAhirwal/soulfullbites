const API_URL = '/api/checkout/waitlist';
const BAG_STORAGE_KEY = 'choc_bag';
const HISTORY_STORAGE_KEY = 'choc_history';
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAAC-oYQnEiMEhkCQO';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeBagItem(item = {}) {
  const qty = Math.max(0, Math.floor(Number(item.qty ?? item.quantity ?? 0) || 0));
  const price = Number(item.price || 0);

  return {
    id: String(item.id ?? '').trim(),
    name: String(item.name ?? '').trim(),
    price: Number.isFinite(price) ? price : 0,
    qty,
  };
}

function getStoredBag() {
  return getStoredJson(BAG_STORAGE_KEY, [])
    .map(normalizeBagItem)
    .filter((item) => item.id && item.name && item.qty > 0 && item.price >= 0);
}

function toBagItems(items = []) {
  return items
    .map((item) => normalizeBagItem({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty ?? item.quantity,
    }))
    .filter((item) => item.id && item.name && item.qty > 0);
}

function safeImageSrc(value) {
  const raw = String(value ?? '').trim();

  if (!raw) {
    return '/assets/chocolate_bar.png';
  }

  if (
    raw.startsWith('/api/')
    || raw.startsWith('http://')
    || raw.startsWith('https://')
    || raw.startsWith('blob:')
    || raw.startsWith('data:image/')
  ) {
    return raw;
  }

  return `/assets/${encodeURIComponent(raw)}`;
}

function sanitizeRichText(value) {
  const template = document.createElement('template');
  template.innerHTML = String(value ?? '').replace(/\n/g, '<br>');
  const allowedTags = new Set(['BR', 'EM', 'STRONG', 'B', 'I']);

  const sanitizeNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent || '');
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return document.createDocumentFragment();
    }

    if (!allowedTags.has(node.tagName)) {
      const fragment = document.createDocumentFragment();
      node.childNodes.forEach((child) => {
        fragment.appendChild(sanitizeNode(child));
      });
      return fragment;
    }

    const cleanNode = document.createElement(node.tagName.toLowerCase());
    node.childNodes.forEach((child) => {
      cleanNode.appendChild(sanitizeNode(child));
    });
    return cleanNode;
  };

  const fragment = document.createDocumentFragment();
  template.content.childNodes.forEach((node) => {
    fragment.appendChild(sanitizeNode(node));
  });
  return fragment;
}

function setRichText(el, value) {
  el.replaceChildren(sanitizeRichText(value));
}

function renderCheckoutSummary(items = [], totalAmount = 0) {
  const list = document.getElementById('checkout-items-list');
  const totalEl = document.getElementById('checkout-total');

  if (!list || !totalEl) {
    return;
  }

  list.innerHTML = '';

  items.forEach((item) => {
    const quantity = Math.max(0, Math.floor(Number(item.qty ?? item.quantity ?? 0) || 0));
    const price = Number(item.price || 0);
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.marginBottom = '0.8rem';
    row.style.fontSize = '0.9rem';

    const label = document.createElement('span');
    label.textContent = `${item.name} × ${quantity}`;

    const amount = document.createElement('span');
    amount.textContent = `₹${(price * quantity).toFixed(2)}`;

    row.append(label, amount);
    list.appendChild(row);
  });

  totalEl.textContent = `₹${Number(totalAmount || 0).toFixed(2)}`;
}

function initTurnstileWidgets(attempts = 20) {
  const widgets = document.querySelectorAll('[data-turnstile-widget]');
  if (widgets.length === 0) {
    return;
  }

  if (!window.turnstile) {
    if (attempts > 0) {
      setTimeout(() => initTurnstileWidgets(attempts - 1), 250);
    }
    return;
  }

  widgets.forEach((container) => {
    if (container.dataset.turnstileReady === 'true') {
      return;
    }

    const widgetId = window.turnstile.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: container.dataset.theme || 'light',
    });

    container.dataset.turnstileReady = 'true';
    container.dataset.widgetId = String(widgetId);
  });
}

function resetTurnstile(form) {
  const container = form?.querySelector('[data-turnstile-widget]');
  if (!container || !window.turnstile || !container.dataset.widgetId) {
    return;
  }

  window.turnstile.reset(container.dataset.widgetId);
}

function initMobileNav() {
  const nav = document.getElementById('main-nav');
  const navLinks = nav?.querySelector('.nav-links');

  if (!nav || !navLinks || nav.querySelector('.nav-toggle')) {
    return;
  }

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  const panel = document.createElement('div');
  panel.className = 'mobile-nav-panel';

  const panelInner = document.createElement('div');
  panelInner.className = 'mobile-nav-panel-inner';

  navLinks.querySelectorAll('a').forEach((link) => {
    panelInner.appendChild(link.cloneNode(true));
  });

  const instagramLink = nav.querySelector('.nav-insta');
  if (instagramLink) {
    panelInner.appendChild(instagramLink.cloneNode(true));
  }

  panel.appendChild(panelInner);
  document.body.appendChild(panel);
  nav.insertBefore(toggle, nav.querySelector('.nav-right'));

  const closePanel = () => {
    panel.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mobile-nav-open');
  };

  toggle.addEventListener('click', () => {
    const nextState = !panel.classList.contains('open');
    panel.classList.toggle('open', nextState);
    toggle.classList.toggle('open', nextState);
    toggle.setAttribute('aria-expanded', String(nextState));
    document.body.classList.toggle('mobile-nav-open', nextState);
  });

  panel.addEventListener('click', (event) => {
    if (event.target === panel || event.target.closest('a')) {
      closePanel();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePanel();
    }
  });
}

function setFormMessage(form, message, tone = 'info') {
  if (!form) {
    return;
  }

  let messageEl = form.querySelector('[data-form-message]');

  if (!messageEl) {
    messageEl = document.createElement('p');
    messageEl.dataset.formMessage = 'true';
    messageEl.style.marginTop = '0.9rem';
    messageEl.style.fontSize = '0.9rem';
    form.appendChild(messageEl);
  }

  const colors = {
    info: '#6b4226',
    success: '#2d6e4b',
    warning: '#8a6318',
    error: '#9d3030',
  };

  messageEl.textContent = message;
  messageEl.style.color = colors[tone] || colors.info;
}

function getStoredJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function runBasicLoader() {
  const loader = document.getElementById('loader');
  const brand = document.querySelector('.loader-brand');
  const bar = document.querySelector('.loader-progress');

  if (!loader) {
    return;
  }

  setTimeout(() => brand?.classList.add('show'), 100);

  let progress = 0;
  const interval = setInterval(() => {
    progress = Math.min(progress + 12, 100);
    if (bar) {
      bar.style.width = `${progress}%`;
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 450);
      }, 150);
    }
  }, 45);
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initTurnstileWidgets();
});

window.addEventListener('load', async () => {
  // Apply dynamic content first
  await applyDynamicContent();
  initTurnstileWidgets();

  if (document.querySelector('#main-canvas')) {
    const { startHomeExperience } = await import('./home-scene.js');
    startHomeExperience();
    return;
  }
  
  if (document.querySelector('#about-canvas')) {
    const { startAboutExperience } = await import('./about-scene.js');
    startAboutExperience();
  }

  if (document.querySelector('#inspiration-canvas')) {
    const { startInspirationExperience } = await import('./inspiration-scene.js');
    startInspirationExperience();
  }

  if (document.querySelector('#recipe-canvas')) {
    const { startRecipeExperience } = await import('./recipe-scene.js');
    startRecipeExperience();
  }

  if (document.querySelector('#faq-canvas')) {
    const { startFAQExperience } = await import('./faq-scene.js');
    startFAQExperience();
  }

  runBasicLoader();
});

async function applyDynamicContent() {
  try {
    const res = await fetch('/api/content');
    if (!res.ok) return;
    const content = await res.json();
    
    document.querySelectorAll('[data-content-key]').forEach(el => {
      const key = el.dataset.contentKey;
      if (content[key]) {
        // Special handling for HTML content (to allow <em>, <br> etc)
        const isHtmlTag = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'BLOCKQUOTE', 'LI'].includes(el.tagName);
        if (isHtmlTag || el.dataset.allowHtml === 'true') {
            setRichText(el, content[key]);
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = content[key];
        } else {
          el.textContent = content[key];
        }
      }
    });

    if (content.site_title) {
        document.querySelectorAll('.nav-brand, .loader-brand, .logo-text, .admin-brand').forEach(el => el.textContent = content.site_title);
    }
    
    if (content.insta_link) {
        document.querySelectorAll('.nav-insta, .social-link-insta').forEach(el => {
            el.href = content.insta_link;
        });
    }

    } catch (err) {
    console.warn('CMS skip:', err);
  }

  // INDEPENDENT LOADING: These should run regardless of CMS content fetch results
  if (document.getElementById('shop-grid')) {
      await loadShopProducts();
  }
  if (document.querySelector('.faq-accordion')) {
      await loadPageFaqs();
  }
}

async function loadShopProducts() {
  const grid = document.getElementById('shop-grid');
  if (!grid) return;

  try {
    const timestamp = Date.now();
    const res = await fetch(`/api/products?t=${timestamp}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const products = await res.json();

    if (products.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.5; padding: 5rem;">Our chocolate library is currently being restocked. Please check back soon.</p>';
      return;
    }

    grid.innerHTML = products.map((product) => {
      let images = [];

      try {
        images = JSON.parse(product.images_json || '[]');
      } catch {
        images = [product.image_slug || 'chocolate_bar.png'];
      }

      if (images.length === 0) {
        images = [product.image_slug || 'chocolate_bar.png'];
      }

      const price = Number(product.price || 0);
      const flavorNote = escapeHtml(product.flavor_note || product.description || 'Seasonal tasting notes updated each batch.');
      const ingredients = escapeHtml(product.ingredients || 'Ingredients updated in each handcrafted batch.');
      const safeName = escapeHtml(product.name);

      const imageHtml = images.length > 1
        ? `
          <div class="product-slider" data-current="0">
            <div class="slider-track">
              ${images.map((img) => `<img src="${safeImageSrc(img)}" alt="${safeName}">`).join('')}
            </div>
            <div class="slider-nav">
              ${images.map((_, index) => `<div class="slider-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`).join('')}
            </div>
            <div class="slider-arrow prev" aria-label="Previous product image">←</div>
            <div class="slider-arrow next" aria-label="Next product image">→</div>
          </div>`
        : `
          <div class="product-img-wrapper" style="overflow:hidden; border-radius: 1.8rem; margin-bottom: 2rem;">
            <img src="${safeImageSrc(images[0])}" alt="${safeName}" class="product-img" style="margin-bottom: 0;">
          </div>`;

      return `
        <article class="product-card" data-id="${escapeHtml(product.id)}" data-name="${safeName}" data-price="${price}">
          ${imageHtml}
          <h3>${safeName}</h3>
          <span class="price">₹${price.toFixed(2)}</span>
          <button class="btn-buy">Add to Bag</button>
          <p class="flavor-desc" style="font-size: 0.8rem; margin-top: 1rem; color: var(--text-light);">${flavorNote}</p>
          <ul class="product-meta">
            <li><strong>Ingredients:</strong> ${ingredients}</li>
            <li><strong>Fresh dispatch:</strong> 2 to 4 working days</li>
            <li><strong>Best for:</strong> gifting, tasting flights, and premium dessert tables</li>
          </ul>
        </article>
      `;
    }).join('');

    initProductSliders();
  } catch (err) {
    console.error('Shop load error:', err);
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.6; padding: 5rem;">We could not load the catalog right now. Please refresh in a moment.</p>';
  }
}

function initProductSliders() {
    document.querySelectorAll('.product-slider').forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const dots = slider.querySelectorAll('.slider-dot');
        const arrows = slider.querySelectorAll('.slider-arrow');
        let current = 0;
        const count = dots.length;

        const update = () => {
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
        };

        arrows.forEach(arrow => {
            arrow.addEventListener('click', (e) => {
                e.stopPropagation();
                if (arrow.classList.contains('next')) {
                    current = (current + 1) % count;
                } else {
                    current = (current - 1 + count) % count;
                }
                update();
            });
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                current = parseInt(dot.dataset.index);
                update();
            });
        });
    });
}

async function loadPageFaqs() {
  const container = document.querySelector('.faq-accordion');
  if (!container) return;

  try {
    const res = await fetch('/api/content?section=faq');
    if (!res.ok) throw new Error('Failed to fetch FAQs');
    const faqs = await res.json();

    if (faqs.length === 0) {
      container.innerHTML = '<p style="text-align: center; opacity: 0.5;">Our Archive is currently being re-indexed.</p>';
      return;
    }

    const categories = {};
    faqs.forEach((faq) => {
      if (!categories[faq.category]) categories[faq.category] = [];
      categories[faq.category].push(faq);
    });

    container.innerHTML = Object.entries(categories).map(([category, items]) => `
      <div class="faq-section">
        <h2 class="faq-section-title">${escapeHtml(category)}</h2>
        ${items.map((item) => `
          <div class="faq-item">
            <div class="faq-question">
              <h3>${escapeHtml(item.question)}</h3>
              <div class="faq-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
            </div>
            <div class="faq-answer">
              <p>${escapeHtml(item.answer)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');

    container.querySelectorAll('.faq-item').forEach((item) => {
      item.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        container.querySelectorAll('.faq-item').forEach((other) => other.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  } catch (err) {
    console.error('FAQ load error:', err);
    container.innerHTML = '<p style="text-align: center; opacity: 0.6;">We could not load the FAQ right now.</p>';
  }
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || 'Request failed');
  }

  return payload;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('waitlist-form');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.target.querySelector('button');
    const email = document.getElementById('email-input')?.value || '';

    if (button) {
      button.textContent = 'Sending...';
      button.disabled = true;
    }

    setFormMessage(form, 'Saving your request...');

    try {
      const formData = new FormData(form);
      const payload = await requestJson(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: email,
          source: 'SoulfullBites Waitlist',
          security_token: formData.get('cf-turnstile-response'),
          hp_data: formData.get('hp_field'),
        }),
      });

      if (button) {
        button.textContent = payload.customerEmailSkipped ? 'Saved' : 'You\'re On The List';
        button.style.background = 'linear-gradient(135deg, #6aaf6a, #3a8a3a)';
      }

      setFormMessage(
        form,
        payload.message || 'You are on the insider list.',
        payload.customerEmailSkipped ? 'warning' : 'success',
      );

      form.reset();
      resetTurnstile(form);
    } catch (error) {
      console.error('Waitlist Error:', error);
      if (button) {
        button.textContent = 'Try Again';
        button.disabled = false;
      }
      resetTurnstile(form);
      setFormMessage(form, error.message || 'Unable to save your request right now.', 'error');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const cartToggle = document.getElementById('cart-toggle');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartClose = document.getElementById('cart-close');
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const emptyMsg = document.getElementById('empty-msg');

  if (!cartToggle) return;

  let bag = getStoredBag();
  const getClosedCartOffset = () => (window.innerWidth <= 900 ? '-100vw' : '-400px');

  const updateUI = () => {
    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;

    if (bag.length === 0) {
      emptyMsg?.style.setProperty('display', 'block');
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
      }
    } else {
      emptyMsg?.style.setProperty('display', 'none');
      if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
      }

      bag.forEach((item) => {
        total += item.price * item.qty;
        count += item.qty;

        const itemEl = document.createElement('div');
        itemEl.style.display = 'flex';
        itemEl.style.justifyContent = 'space-between';
        itemEl.style.alignItems = 'center';
        itemEl.style.marginBottom = '1.5rem';
        itemEl.style.padding = '1rem';
        itemEl.style.background = '#f9f9f9';
        itemEl.style.borderRadius = '1rem';
        itemEl.innerHTML = `
          <div>
            <h4 style="margin:0; font-size: 1rem;">${escapeHtml(item.name)}</h4>
            <span style="color: var(--gold); font-size: 0.8rem;">₹${item.price.toFixed(2)} × ${item.qty}</span>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button class="qty-btn" data-id="${escapeHtml(item.id)}" data-action="minus" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ddd; background: #fff; cursor: pointer;">-</button>
            <button class="qty-btn" data-id="${escapeHtml(item.id)}" data-action="plus" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ddd; background: #fff; cursor: pointer;">+</button>
          </div>
        `;
        cartItems.appendChild(itemEl);
      });
    }

    if (cartCount) {
      cartCount.textContent = String(count);
    }
    if (cartTotal) {
      cartTotal.textContent = `₹${total.toFixed(2)}`;
    }

    localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bag));
  };

  cartToggle.addEventListener('click', () => {
    cartDrawer.style.right = '0';
  });

  cartClose?.addEventListener('click', () => {
    cartDrawer.style.right = getClosedCartOffset();
  });

  window.addEventListener('resize', () => {
    if (cartDrawer.style.right && cartDrawer.style.right !== '0px' && cartDrawer.style.right !== '0') {
      cartDrawer.style.right = getClosedCartOffset();
    }
  });

  document.body.addEventListener('click', (event) => {
    const button = event.target.closest('.btn-buy');
    if (!button) return;

    const card = button.closest('.product-card');
    if (!card) return;

    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price || '0');
    const existing = bag.find((item) => item.id === id);

    if (existing) {
      existing.qty += 1;
    } else {
      bag.push({ id, name, price, qty: 1 });
    }

    updateUI();
    cartDrawer.style.right = '0';

    const oldText = button.textContent;
    button.textContent = 'Added';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = oldText;
      button.disabled = false;
    }, 1200);
  });

  cartItems?.addEventListener('click', (event) => {
    if (!event.target.classList.contains('qty-btn')) {
      return;
    }

    const item = bag.find((entry) => entry.id === event.target.dataset.id);
    if (!item) {
      return;
    }

    if (event.target.dataset.action === 'plus') {
      item.qty += 1;
    } else {
      item.qty -= 1;
      if (item.qty <= 0) {
        bag = bag.filter((entry) => entry.id !== item.id);
      }
    }

    updateUI();
  });

  checkoutBtn?.addEventListener('click', () => {
    localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bag));
    window.location.href = '/checkout';
  });

  updateUI();
});

document.addEventListener('DOMContentLoaded', () => {
  const orderForm = document.getElementById('secure-checkout-form');
  if (!orderForm) return;

  orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = document.getElementById('pay-button');
    const bag = getStoredBag();

    if (bag.length === 0) {
      setFormMessage(orderForm, 'Your bag is empty. Add a product first.', 'warning');
      return;
    }

    const name = document.getElementById('checkout-name').value;
    const email = document.getElementById('checkout-email').value;
    const phone = document.getElementById('checkout-phone').value;
    const address = document.getElementById('checkout-address').value;
    const city = document.getElementById('checkout-city').value;
    const zip = document.getElementById('checkout-zip').value;
    const note = document.getElementById('checkout-note').value;

    const orderData = {
      user_name: name,
      user_email: email,
      user_phone: phone,
      user_address: address,
      user_city: city,
      user_zip: zip,
      bag_items: bag.map((item) => ({ id: item.id, qty: item.qty })),
      user_note: note,
      source: 'SoulfullBites Order',
    };

    if (button) {
      button.textContent = 'Preparing Payment...';
      button.disabled = true;
    }
    setFormMessage(orderForm, 'Setting up secure payment...');

    try {
      const formData = new FormData(orderForm);
      
      // 1. Create Razorpay Order
      const resData = await requestJson('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          security_token: formData.get('cf-turnstile-response'),
          hp_data: formData.get('hp_field'),
        }),
      });

      const authoritativeItems = toBagItems(resData.orderSummary?.items || bag);
      const authoritativeTotal = Number(resData.orderSummary?.totalAmount || 0);
      localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(authoritativeItems));
      renderCheckoutSummary(authoritativeItems, authoritativeTotal);

      if (!window.Razorpay) {
        throw new Error('Secure payment window failed to load. Please refresh and try again.');
      }

      setFormMessage(
        orderForm,
        `Secure total confirmed: ${resData.orderSummary?.totalDisplay || `₹${authoritativeTotal.toFixed(2)}`}`,
        'info',
      );

      // 2. Open Razorpay Checkout
      const options = {
        key: resData.keyId,
        amount: resData.amount,
        currency: resData.currency,
        name: "SoulfullBites",
        description: "Artisanal Chocolate Order",
        order_id: resData.razorpayOrderId,
        handler: async function (response) {
          if (button) button.textContent = 'Verifying Payment...';
          setFormMessage(orderForm, 'Verifying payment status...');

          try {
            // 3. Verify Payment
            const verifyRes = await requestJson('/api/checkout/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: resData.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            // 4. Success Tasks
            const history = getStoredJson(HISTORY_STORAGE_KEY, []);
            history.unshift({
              id: verifyRes.order.id,
              date: new Date().toLocaleDateString(),
              items: toBagItems(verifyRes.order.items),
              total: Number(verifyRes.order.totalAmount || 0),
              status: verifyRes.order.paymentStatus || verifyRes.order.status || 'paid',
            });
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 5)));
            localStorage.removeItem(BAG_STORAGE_KEY);
            resetTurnstile(orderForm);

            if (button) button.textContent = 'Payment Received';
            setFormMessage(orderForm, 'Payment successful! Redirecting...', 'success');

            setTimeout(() => {
              window.location.href = '/shop';
            }, 2000);
          } catch (err) {
            console.error('Verification Error:', err);
            setFormMessage(orderForm, 'Payment recorded but verification failed. Our team will contact you.', 'warning');
            if (button) {
              button.textContent = 'Contact Support';
              button.disabled = false;
            }
            resetTurnstile(orderForm);
          }
        },
        prefill: {
          name,
          email,
          contact: phone,
        },
        theme: {
          color: '#4a2c1a',
        },
        modal: {
          ondismiss: function() {
            if (button) {
              button.textContent = 'Pay Now & Confirm Order';
              button.disabled = false;
            }
            setFormMessage(orderForm, 'Payment cancelled.', 'info');
            resetTurnstile(orderForm);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Order Error:', error);
      if (button) {
        button.textContent = 'Try Again';
        button.disabled = false;
      }
      resetTurnstile(orderForm);
      setFormMessage(orderForm, error.message || 'Unable to initiate payment right now.', 'error');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const historyContainer = document.getElementById('history-container');
  const historySection = document.getElementById('recent-orders-section');

  if (!historyContainer || !historySection) return;

  const history = getStoredJson(HISTORY_STORAGE_KEY, []).map((order) => ({
    ...order,
    items: toBagItems(order.items || []),
    total: Number(String(order.total ?? 0).replace(/[^\d.]/g, '')) || 0,
  }));

  if (history.length === 0) {
    historySection.style.display = 'none';
    return;
  }

  historySection.style.display = 'block';
  historyContainer.innerHTML = '';

  history.forEach((order, index) => {
    const orderEl = document.createElement('div');
    orderEl.style.padding = '2.5rem';
    orderEl.style.background = '#fff';
    orderEl.style.borderRadius = '1.5rem';
    orderEl.style.border = '1px solid rgba(74, 44, 26, 0.08)';
    orderEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.02)';

    const itemsText = order.items.map((item) => `${item.qty}× ${item.name}`).join(', ');

    orderEl.innerHTML = `
      <p style="font-size: 0.75rem; color: #a07050; letter-spacing: 0.1rem; text-transform: uppercase; margin-bottom: 0.5rem;">Ordered on ${escapeHtml(order.date)}</p>
      <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${escapeHtml(order.id || `Order ${index + 1}`)}</h4>
      <p style="font-size: 0.9rem; color: #666; margin-bottom: 0.6rem;">${escapeHtml(itemsText)}</p>
      <p style="font-size: 0.8rem; color: var(--text-light); margin-bottom: 1.5rem;">Status: ${escapeHtml(order.status || 'new')}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #ddd; padding-top: 1.5rem;">
        <span style="font-weight: 700; color: var(--gold);">Total: ₹${order.total.toFixed(2)}</span>
        <button class="reorder-btn" data-index="${index}" style="padding: 0.8rem 1.5rem; background: var(--choc-dark); color: #fff; border: none; border-radius: 2rem; cursor: pointer; font-size: 0.85rem;">Reorder</button>
      </div>
    `;

    historyContainer.appendChild(orderEl);
  });

  historyContainer.addEventListener('click', (event) => {
    if (!event.target.classList.contains('reorder-btn')) {
      return;
    }

    const order = history[Number(event.target.dataset.index)];
    if (!order) {
      return;
    }

    localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(toBagItems(order.items)));
    window.location.href = '/checkout';
  });
});

// --- REVIEWS LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
  const reviewsContainer = document.getElementById('reviews-container');
  const openFormBtn = document.getElementById('open-review-form');
  const modal = document.getElementById('review-modal');
  const closeModalBtn = document.getElementById('close-review-modal');
  const reviewForm = document.getElementById('review-form');
  const stars = document.querySelectorAll('.star');
  let selectedRating = 0;

  if (!reviewsContainer) return;

  const loadReviews = async () => {
    try {
      const data = await requestJson('/api/reviews');
      if (data.reviews && data.reviews.length > 0) {
        reviewsContainer.innerHTML = data.reviews.map((r, i) => {
          const rating = Math.min(5, Math.max(0, Number(r.rating) || 0));

          return `
          <article class="review-card" style="animation-delay: ${i * 0.1}s">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h4>${escapeHtml(r.customer_name)}</h4>
                <div class="review-stars">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
              </div>
              ${r.is_verified ? '<span class="verified-buyer-tag">Verified Buyer</span>' : ''}
            </div>
            <p class="review-content">"${escapeHtml(r.comment)}"</p>
            <span class="review-date">${new Date(r.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
          </article>
        `;
        }).join('');
      } else {
        reviewsContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1; opacity: 0.5;">Verified reviews will appear here after delivered orders start coming in.</p>';
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
      reviewsContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1; opacity: 0.6;">We could not load reviews right now.</p>';
    }
  };

  loadReviews();

  // Modal toggle
  openFormBtn?.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  closeModalBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Star logic
  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      const val = parseInt(star.dataset.value);
      stars.forEach(s => s.style.color = parseInt(s.dataset.value) <= val ? 'var(--gold)' : '#ddd');
    });

    star.addEventListener('mouseout', () => {
      stars.forEach(s => s.style.color = parseInt(s.dataset.value) <= selectedRating ? 'var(--gold)' : '#ddd');
    });

    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.value);
    });
  });

  // Form submission
  reviewForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (selectedRating === 0) {
      alert('Please select a rating');
      return;
    }

    const submitBtn = reviewForm.querySelector('button');
    const msg = document.getElementById('review-msg');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying & Submitting...';

    try {
      await requestJson('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: document.getElementById('review-order-id').value,
          customerName: document.getElementById('review-name').value,
          rating: selectedRating,
          comment: document.getElementById('review-comment').value
        })
      });

      msg.textContent = 'Review submitted! Thank you for your feedback.';
      msg.style.color = 'green';
      reviewForm.reset();
      selectedRating = 0;
      stars.forEach(s => s.style.color = '#ddd');
      
      setTimeout(() => {
        modal.style.display = 'none';
        loadReviews();
        msg.textContent = '';
      }, 2000);
    } catch (err) {
      msg.textContent = err.message || 'Submission failed. Please check your Order ID.';
      msg.style.color = 'red';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Verified Review';
    }
  });

  // Allow closing modal on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
});
