document.addEventListener('DOMContentLoaded', () => {

  const galleryImages = document.querySelectorAll('.product-image img, .lightbox-trigger');

  if (galleryImages.length > 0) {
    let lightbox = document.getElementById('lightbox-modal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox-modal';
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-content" id="lightbox-img" alt="Enlarged view">
        <div id="lightbox-caption"></div>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    galleryImages.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt || 'Urban Threads Product Item';
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.style.display = 'none';
      });
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
      }
    });
  }

  /* ------------------------------------------------------------------------
     2. Dynamic Product Search & Category Filtering
     ------------------------------------------------------------------------ */
  const searchInput = document.querySelector('input[name="q"]');
  const productCards = document.querySelectorAll('.product-card');
  const filterChips = document.querySelectorAll('.filter-chip');

  let activeCategory = 'all';

  function filterCatalog() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    productCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const category = card.getAttribute('data-category')?.toLowerCase() || 'all';
      const description = card.querySelector('.product-cat')?.textContent.toLowerCase() || '';

      const matchesSearch = title.includes(query) || description.includes(query);
      const matchesCategory = (activeCategory === 'all') || (category === activeCategory);

      if (matchesSearch && matchesCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCatalog);
  }

  if (filterChips.length > 0) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        activeCategory = chip.textContent.toLowerCase().trim();
        filterCatalog();
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. Interactive Shopping Cart & Drawer Modal
     ------------------------------------------------------------------------ */
  const cartBtn = document.querySelector('.cart-btn');
  const cartCountBadge = document.getElementById('cartCount');
  const addToCartButtons = document.querySelectorAll('[data-add], .btn-add');

  let cartItems = [];

  // Create Cart Modal / Drawer dynamically
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
        <div class="cart-items-container">
          <p class="empty-cart-msg">Your cart is currently empty.</p>
        </div>
        <div class="cart-drawer-footer">
          <div class="cart-total">Total: <span>R0.00</span></div>
          <button class="btn btn-primary checkout-btn" type="button">Proceed to Checkout</button>
        </div>
      </div>
    `;
    document.body.appendChild(cartModal);
  }

  const cartClose = cartModal.querySelector('.cart-close');
  const cartItemsContainer = cartModal.querySelector('.cart-items-container');
  const cartTotalSpan = cartModal.querySelector('.cart-total span');
  const checkoutBtn = cartModal.querySelector('.checkout-btn');

  // Toggle cart drawer open/close
  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cartModal.style.display = 'flex';
    });
  }

  if (cartClose) {
    cartClose.addEventListener('click', () => {
      cartModal.style.display = 'none';
    });
  }

  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      cartModal.style.display = 'none';
    }
  });

  // Add item to cart functionality
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const card = button.closest('.product-card');
      if (!card) return;

      const title = card.querySelector('h3')?.textContent || 'Product Item';
      const priceText = card.querySelector('.product-price')?.textContent || 'R0.00';
      const priceNum = parseFloat(priceText.replace('R', '').replace(',', '').trim()) || 0;
      const imgSrc = card.querySelector('img')?.src || '';

      // Check if already in cart
      const existing = cartItems.find(item => item.title === title);
      if (existing) {
        existing.quantity++;
      } else {
        cartItems.push({ title, price: priceNum, quantity: 1, image: imgSrc });
      }

      updateCartUI();

      // Button feedback
      const originalText = button.textContent;
      button.textContent = 'Added ✓';
      button.style.backgroundColor = '#2e7d32';
      button.style.color = '#ffffff';

      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.style.color = '';
      }, 1000);
    });
  });

  function updateCartUI() {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountBadge) cartCountBadge.textContent = totalCount;

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Your cart is currently empty.</p>`;
      cartTotalSpan.textContent = 'R0.00';
      return;
    }

    let html = '';
    let totalPrice = 0;

    cartItems.forEach((item, index) => {
      totalPrice += item.price * item.quantity;
      html += `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-details">
            <h4>${item.title}</h4>
            <p>R${item.price.toFixed(2)} x ${item.quantity}</p>
          </div>
          <button class="cart-item-remove" data-index="${index}">&times;</button>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = html;
    cartTotalSpan.textContent = `R${totalPrice.toFixed(2)}`;

    // Attach remove handlers
    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(remBtn => {
      remBtn.addEventListener('click', () => {
        const idx = parseInt(remBtn.getAttribute('data-index'));
        cartItems.splice(idx, 1);
        updateCartUI();
      });
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      alert('Proceeding to secure checkout gateway...');
      cartItems = [];
      updateCartUI();
      cartModal.style.display = 'none';
    });
  }

  /* ------------------------------------------------------------------------
     4. Form Validation & AJAX Asynchronous Handlers
     ------------------------------------------------------------------------ */
  function showError(inputElement, message) {
    let errorDisplay = inputElement.parentElement.querySelector('.error-msg');
    if (!errorDisplay) {
      errorDisplay = document.createElement('span');
      errorDisplay.className = 'error-msg';
      errorDisplay.style.color = '#d9534f';
      errorDisplay.style.fontSize = '0.85rem';
      errorDisplay.style.marginTop = '4px';
      errorDisplay.style.display = 'block';
      inputElement.parentElement.appendChild(errorDisplay);
    }
    errorDisplay.textContent = message;
    inputElement.style.borderColor = '#d9534f';
  }

  function clearError(inputElement) {
    const errorDisplay = inputElement.parentElement.querySelector('.error-msg');
    if (errorDisplay) {
      errorDisplay.remove();
    }
    inputElement.style.borderColor = '';
  }

  function validateInput(input) {
    const value = input.value.trim();
    if (input.hasAttribute('required') && !value) {
      showError(input, 'This field is required.');
      return false;
    }
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(input, 'Please enter a valid email address.');
        return false;
      }
    }
    clearError(input);
    return true;
  }

  const enquiriesForm = document.getElementById('enquiries-form');
  if (enquiriesForm) {
    enquiriesForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      enquiriesForm.querySelectorAll('input, textarea').forEach(input => {
        if (!validateInput(input)) isValid = false;
      });

      if (!isValid) return;

      let msgBox = document.getElementById('ajax-msg');
      if (!msgBox) {
        msgBox = document.createElement('div');
        msgBox.id = 'ajax-msg';
        msgBox.style.marginTop = '15px';
        msgBox.style.padding = '12px';
        msgBox.style.borderRadius = '4px';
        msgBox.style.backgroundColor = '#e8f5e9';
        msgBox.style.color = '#2e7d32';
        enquiriesForm.appendChild(msgBox);
      }

      msgBox.textContent = 'Submitting enquiry asynchronously...';
      setTimeout(() => {
        msgBox.textContent = 'Success! Your enquiry has been sent to Urban Threads.';
        enquiriesForm.reset();
      }, 800);
    });
  }

});
