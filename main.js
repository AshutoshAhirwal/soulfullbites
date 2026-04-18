const API_URL = '/api/send-order';
const BAG_STORAGE_KEY = 'choc_bag';
const HISTORY_STORAGE_KEY = 'choc_history';

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

window.addEventListener('load', async () => {
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
        payload.message || 'You are on the waitlist.',
        payload.customerEmailSkipped ? 'warning' : 'success',
      );

      form.reset();
    } catch (error) {
      console.error('Waitlist Error:', error);
      if (button) {
        button.textContent = 'Try Again';
        button.disabled = false;
      }
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

  let bag = getStoredJson(BAG_STORAGE_KEY, []);

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
            <h4 style="margin:0; font-size: 1rem;">${item.name}</h4>
            <span style="color: var(--gold); font-size: 0.8rem;">₹${item.price} × ${item.qty}</span>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button class="qty-btn" data-id="${item.id}" data-action="minus" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ddd; background: #fff; cursor: pointer;">-</button>
            <button class="qty-btn" data-id="${item.id}" data-action="plus" style="width: 25px; height: 25px; border-radius: 50%; border: 1px solid #ddd; background: #fff; cursor: pointer;">+</button>
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
    cartDrawer.style.right = '-400px';
  });

  document.querySelectorAll('.btn-buy').forEach((button) => {
    button.addEventListener('click', (event) => {
      const card = event.target.closest('.product-card');
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
      setTimeout(() => {
        button.textContent = oldText;
      }, 1200);
    });
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
    const bag = getStoredJson(BAG_STORAGE_KEY, []);

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

    const total = bag.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const orderLines = bag.map((item) => ({
      id: item.id,
      name: item.name,
      qty: item.qty,
      price: item.price,
      lineTotal: item.price * item.qty,
    }));

    const orderData = {
      user_name: name,
      user_email: email,
      user_phone: phone,
      user_address: address,
      user_city: city,
      user_zip: zip,
      order_items: orderLines.map((item) => `${item.name} (${item.qty})`).join(', '),
      order_lines: orderLines,
      order_total: `₹${total}`,
      order_total_value: total,
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
      const resData = await requestJson('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          security_token: formData.get('cf-turnstile-response'),
          hp_data: formData.get('hp_field'),
        }),
      });

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
            const verifyRes = await requestJson('/api/verify-payment', {
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
              items: bag,
              total,
              status: 'paid',
            });
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 5)));
            localStorage.removeItem(BAG_STORAGE_KEY);

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
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: phone
        },
        theme: {
          color: "#4a2c1a"
        },
        modal: {
          ondismiss: function() {
            if (button) {
              button.textContent = 'Pay Now & Confirm Order';
              button.disabled = false;
            }
            setFormMessage(orderForm, 'Payment cancelled.', 'info');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Order Error:', error);
      if (button) {
        button.textContent = 'Try Again';
        button.disabled = false;
      }
      setFormMessage(orderForm, error.message || 'Unable to initiate payment right now.', 'error');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const historyContainer = document.getElementById('history-container');
  const historySection = document.getElementById('recent-orders-section');

  if (!historyContainer || !historySection) return;

  const history = getStoredJson(HISTORY_STORAGE_KEY, []);

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
      <p style="font-size: 0.75rem; color: #a07050; letter-spacing: 0.1rem; text-transform: uppercase; margin-bottom: 0.5rem;">Ordered on ${order.date}</p>
      <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${order.id || `Order ${index + 1}`}</h4>
      <p style="font-size: 0.9rem; color: #666; margin-bottom: 0.6rem;">${itemsText}</p>
      <p style="font-size: 0.8rem; color: var(--text-light); margin-bottom: 1.5rem;">Status: ${order.status || 'new'}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #ddd; padding-top: 1.5rem;">
        <span style="font-weight: 700; color: var(--gold);">Total: ₹${order.total}</span>
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

    localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(order.items));
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
        reviewsContainer.innerHTML = data.reviews.map((r, i) => `
          <article class="review-card" style="animation-delay: ${i * 0.1}s">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h4>${r.customer_name}</h4>
                <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
              </div>
              ${r.is_verified ? '<span class="verified-buyer-tag">Verified Buyer</span>' : ''}
            </div>
            <p class="review-content">"${r.comment}"</p>
            <span class="review-date">${new Date(r.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
          </article>
        `).join('');
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
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
