document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. Gallery Lightbox with Previous / Next & Keyboard Support
     ------------------------------------------------------------------------ */
  const galleryImages = Array.from(document.querySelectorAll('.product-image img, .lightbox-trigger'));
  let currentImgIndex = 0;

  if (galleryImages.length > 0) {
    let lightbox = document.getElementById('lightbox-modal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox-modal';
      lightbox.className = 'lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.innerHTML = `
        <div class="lightbox-inner">
          <button type="button" class="lightbox-close" aria-label="Close preview">&times; Close</button>
          <img class="lightbox-content" id="lightbox-img" alt="Enlarged product view">
          <p id="lightbox-caption" class="lightbox-caption"></p>
          <div class="lightbox-nav">
            <button type="button" id="lb-prev">&larr; Previous</button>
            <span id="lb-counter"></span>
            <button type="button" id="lb-next">Next &rarr;</button>
          </div>
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lbCounter = document.getElementById('lb-counter');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    function showSlide(index) {
      currentImgIndex = (index + galleryImages.length) % galleryImages.length;
      const img = galleryImages[currentImgIndex];
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Urban Threads Product';
      lightboxCaption.textContent = img.alt || 'Urban Threads Product Item';
      if (lbCounter) lbCounter.textContent = `${currentImgIndex + 1} / ${galleryImages.length}`;
    }

    galleryImages.forEach((img, idx) => {
      img.style.cursor = 'pointer';
      img.setAttribute('tabindex', '0');
      const openModal = () => {
        showSlide(idx);
        lightbox.style.display = 'flex';
        lightboxClose.focus();
      };
      img.addEventListener('click', openModal);
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
      });
    });

    document.getElementById('lb-prev')?.addEventListener('click', () => showSlide(currentImgIndex - 1));
    document.getElementById('lb-next')?.addEventListener('click', () => showSlide(currentImgIndex + 1));
    lightboxClose?.addEventListener('click', () => { lightbox.style.display = 'none'; });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.style.display = 'none'; });
    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display !== 'flex') return;
      if (e.key === 'Escape') lightbox.style.display = 'none';
      if (e.key === 'ArrowLeft') showSlide(currentImgIndex - 1);
      if (e.key === 'ArrowRight') showSlide(currentImgIndex + 1);
    });
  }

  /* ------------------------------------------------------------------------
     2. Dynamic Product Search, Category Filtering & Sorting
     ------------------------------------------------------------------------ */
  const searchInput = document.querySelector('input[name="q"]');
  const productGrid = document.querySelector('.product-grid');
  const productCards = Array.from(document.querySelectorAll('.product-card'));
  const filterChips = document.querySelectorAll('.filter-chip');
  const sortSelect = document.getElementById('sortSelect');
  const catalogCount = document.getElementById('catalogCount');
  const noResultsMsg = document.getElementById('noResultsMsg');

  let activeCategory = 'all';

  // Support search query passed from other pages via ?q=
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('q') && searchInput) {
    searchInput.value = urlParams.get('q');
  }

  function getPrice(card) {
    const txt = card.querySelector('.product-price')?.textContent || '0';
    return parseFloat(txt.replace(/[^0-9.]/g, '')) || 0;
  }

  function filterAndSortCatalog() {
    if (!productCards.length) return;
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let visibleCards = productCards.filter(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const category = card.getAttribute('data-category')?.toLowerCase() || 'all';
      const matchesSearch = title.includes(query) || category.includes(query);
      const matchesCategory = (activeCategory === 'all') || (category === activeCategory);
      const show = matchesSearch && matchesCategory;
      card.style.display = show ? 'block' : 'none';
      return show;
    });

    const sortVal = sortSelect?.value || 'default';
    if (productGrid && sortVal !== 'default') {
      const sorted = [...productCards].sort((a, b) => {
        if (sortVal === 'price-asc') return getPrice(a) - getPrice(b);
        if (sortVal === 'price-desc') return getPrice(b) - getPrice(a);
        const nameA = a.querySelector('h3')?.textContent || '';
        const nameB = b.querySelector('h3')?.textContent || '';
        return nameA.localeCompare(nameB);
      });
      sorted.forEach(card => productGrid.appendChild(card));
    }

    if (catalogCount) catalogCount.textContent = `Showing ${visibleCards.length} of ${productCards.length} items`;
    if (noResultsMsg) noResultsMsg.hidden = visibleCards.length > 0;
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (productCards.length) filterAndSortCatalog();
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !productCards.length && searchInput.value.trim()) {
        e.preventDefault();
        window.location.href = `gallery.html?q=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }

  sortSelect?.addEventListener('change', filterAndSortCatalog);

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');
      activeCategory = chip.textContent.toLowerCase().trim();
      filterAndSortCatalog();
    });
  });

  if (productCards.length) filterAndSortCatalog();

  /* ------------------------------------------------------------------------
     3. Interactive Shopping Cart Drawer
     ------------------------------------------------------------------------ */
  const cartBtn = document.querySelector('.cart-btn');
  const cartCountBadge = document.getElementById('cartCount');
  const addToCartButtons = document.querySelectorAll('[data-add], .btn-add');
  let cartItems = [];

  let cartModal = document.getElementById('cart-drawer-modal');
  if (!cartModal) {
    cartModal = document.createElement('div');
    cartModal.id = 'cart-drawer-modal';
    cartModal.className = 'cart-drawer';
    cartModal.innerHTML = `
      <div class="cart-drawer-content">
        <div class="cart-drawer-header">
          <h3>Your Shopping Cart</h3>
          <span class="cart-close">&times;</span>
        </div>
        <div class="cart-items-container"><p class="empty-cart-msg">Your cart is currently empty.</p></div>
        <div class="cart-drawer-footer">
          <div class="cart-total">Total: <span>R0.00</span></div>
          <button class="btn btn-primary checkout-btn" type="button">Request Quote via Enquiry</button>
        </div>
      </div>
    `;
    document.body.appendChild(cartModal);
  }

  const cartItemsContainer = cartModal.querySelector('.cart-items-container');
  const cartTotalSpan = cartModal.querySelector('.cart-total span');

  cartBtn?.addEventListener('click', (e) => { e.preventDefault(); cartModal.style.display = 'flex'; });
  cartModal.querySelector('.cart-close')?.addEventListener('click', () => { cartModal.style.display = 'none'; });
  cartModal.addEventListener('click', (e) => { if (e.target === cartModal) cartModal.style.display = 'none'; });

  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const card = button.closest('.product-card');
      if (!card) return;
      const title = card.querySelector('h3')?.textContent || 'Product Item';
      const priceNum = getPrice(card);
      const imgSrc = card.querySelector('img')?.src || '';

      const existing = cartItems.find(item => item.title === title);
      if (existing) existing.quantity++;
      else cartItems.push({ title, price: priceNum, quantity: 1, image: imgSrc });

      updateCartUI();
      const orig = button.textContent;
      button.textContent = 'Added ✓';
      button.style.backgroundColor = '#2e7d32';
      button.style.color = '#fff';
      setTimeout(() => { button.textContent = orig; button.style.backgroundColor = ''; button.style.color = ''; }, 1000);
    });
  });

  function updateCartUI() {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountBadge) cartCountBadge.textContent = totalCount;
    if (!cartItems.length) {
      cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Your cart is currently empty.</p>`;
      cartTotalSpan.textContent = 'R0.00';
      return;
    }
    let totalPrice = 0;
    cartItemsContainer.innerHTML = cartItems.map((item, idx) => {
      totalPrice += item.price * item.quantity;
      return `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-details"><h4>${item.title}</h4><p>R${item.price.toFixed(2)} x ${item.quantity}</p></div>
          <button class="cart-item-remove" data-index="${idx}" aria-label="Remove item">&times;</button>
        </div>
      `;
    }).join('');
    cartTotalSpan.textContent = `R${totalPrice.toFixed(2)}`;
    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cartItems.splice(parseInt(btn.dataset.index, 10), 1);
        updateCartUI();
      });
    });
  }

  cartModal.querySelector('.checkout-btn')?.addEventListener('click', () => {
    window.location.href = 'enquiries.html';
  });

  /* ------------------------------------------------------------------------
     4. Form Validation, Quote Calculation & Email Preparation
     ------------------------------------------------------------------------ */
  const productPrices = {
    jacket: { label: 'Canvas Field Jacket', price: 899 },
    belt: { label: 'Woven Belt — Tan', price: 249 },
    sneaker: { label: 'Low-Top Street Sneaker', price: 1199 },
    polo: { label: 'White Polo Shirt', price: 249 }
  };

  function showError(field, message) {
    let err = field.parentElement.querySelector('.error-msg');
    if (!err) {
      err = document.createElement('span');
      err.className = 'error-msg';
      field.parentElement.appendChild(err);
    }
    err.textContent = message;
    field.setAttribute('aria-invalid', 'true');
  }

  function clearError(field) {
    const err = field.parentElement.querySelector('.error-msg');
    if (err) err.remove();
    field.removeAttribute('aria-invalid');
  }

  function validateFormFields(form) {
    let isValid = true;
    form.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach(field => {
      if (field.name === 'bot-field') return;
      const val = field.value.trim();
      if (field.hasAttribute('required') && !val) {
        showError(field, 'This field is required.');
        isValid = false;
      } else if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        showError(field, 'Please enter a valid email address.');
        isValid = false;
      } else if (field.minLength > 0 && val && val.length < field.minLength) {
        showError(field, `Please enter at least ${field.minLength} characters.`);
        isValid = false;
      } else if (field.type === 'number' && (parseInt(val, 10) < 1 || parseInt(val, 10) > 100)) {
        showError(field, 'Please enter a quantity between 1 and 100.');
        isValid = false;
      } else {
        clearError(field);
      }
    });
    return isValid;
  }

  // Product Enquiry Form (calculates indicative quote + submits)
  const enquiriesForm = document.getElementById('enquiries-form');
  if (enquiriesForm) {
    enquiriesForm.noValidate = true;
    enquiriesForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = enquiriesForm.querySelector('.form-status');
      if (!validateFormFields(enquiriesForm)) {
        status.classList.add('is-error');
        status.textContent = 'Please fix the highlighted errors above before submitting.';
        enquiriesForm.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }

      const name = enquiriesForm.querySelector('[name="name"]').value.trim();
      const topic = enquiriesForm.querySelector('[name="topic"]').value;
      const prodKey = enquiriesForm.querySelector('[name="product"]').value;
      const qty = parseInt(enquiriesForm.querySelector('[name="quantity"]').value, 10) || 1;
      const item = productPrices[prodKey] || { label: prodKey, price: 0 };
      const total = (item.price * qty).toFixed(2);

      try {
        await fetch(enquiriesForm.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(enquiriesForm)).toString()
        });
      } catch (_) {}

      status.classList.remove('is-error');
      const eqMail = `mailto:urbanThread@gmail.com?subject=${encodeURIComponent(`Urban Threads Enquiry - ${item.label}`)}&body=${encodeURIComponent(`Name: ${name}\nTopic: ${topic}\nProduct: ${item.label}\nQuantity: ${qty}\nIndicative Total: R${total}`)}`;
      status.innerHTML = `Thank you, ${name}! Your ${topic.toLowerCase()} for ${qty} &times; ${item.label} (indicative total: R${total}) has been submitted. <a href="${eqMail}" class="btn btn-ghost" style="margin-top:.5rem;display:inline-block;">Send Email Copy</a>`;
      enquiriesForm.reset();
    });
  }

  // General Contact Form (validates + prepares mailto email draft)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.noValidate = true;
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = contactForm.querySelector('.form-status');
      const draftLink = document.getElementById('email-draft');
      if (!validateFormFields(contactForm)) {
        status.classList.add('is-error');
        status.textContent = 'Please fix the highlighted errors above before sending.';
        contactForm.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }

      const name = contactForm.querySelector('[name="name"]').value.trim();
      const email = contactForm.querySelector('[name="email"]').value.trim();
      const phone = contactForm.querySelector('[name="phone"]').value.trim();
      const topic = contactForm.querySelector('[name="topic"]').value;
      const message = contactForm.querySelector('[name="message"]').value.trim();

      const subject = encodeURIComponent(`Urban Threads — ${topic}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message}`);
      const mailtoHref = `mailto:urbanThread@gmail.com?subject=${subject}&body=${body}`;

      try {
        await fetch(contactForm.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(contactForm)).toString()
        });
      } catch (_) {}

      status.classList.remove('is-error');
      status.textContent = `Thank you, ${name}! Your message has been validated and recorded. Click "Open email draft" below to send a direct copy to urbanThread@gmail.com.`;
      if (draftLink) {
        draftLink.href = mailtoHref;
        draftLink.hidden = false;
      }
      contactForm.reset();
    });
  }
});

