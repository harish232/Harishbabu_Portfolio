// ===== CART MANAGEMENT =====

let cart = [];

// Add item to cart
function addToCart(id, btn = null, isModal = false) {
  const processAdd = () => {
    safeRun(() => {
      const p = products.find(x => x.id === id);
      if (!p) {
        showToastMsg('Product not found.', '<i class="fa-solid fa-triangle-exclamation"></i>');
        return;
      }
      const ex = cart.find(x => x.id === id);
      if (ex) ex.qty++;
      else cart.push({ ...p, qty: 1 });
      Storage.save('cart', cart);
      updateCartCount();
      showToastMsg(`${p.name} added to cart!`, '<i class="fa-solid fa-cart-arrow-down"></i>');
    });
  };

  if (btn) {
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Adding...';
    btn.disabled = true;
    
    setTimeout(() => {
      processAdd();
      btn.innerHTML = origHTML;
      btn.disabled = false;
      if (isModal) closeProductModal();
    }, 450); // 450ms delay for smooth visual feedback
  } else {
    processAdd();
  }
}

// Update cart count in navbar
function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;
  countEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

// Render cart page
function renderCart() {
  const el = document.getElementById('cart-content');
  if (!el) return;
  if (cart.length === 0) {
    el.innerHTML = `<div class="cart-empty"><div class="big-e" style="color:var(--border)"><i class="fa-solid fa-cart-shopping"></i></div><p>Your cart is empty!</p><button class="btn-red" onclick="goTo('shop')" style="padding:13px 28px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:1.5px;border:none;cursor:pointer">Browse Products</button></div>`;
    return;
  }
  const sub = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const del = sub >= 999 ? 0 : 60;
  const tot = sub + del;
  el.innerHTML = `<div class="cart-layout">
    <div class="cart-items">${cart.map(i => `<div class="cart-item">
      <div class="ci-img">${i.imgs && i.imgs.length > 0 ? `<img src="${i.imgs[0]}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover"/>` : ''}</div>
      <div><div class="ci-name">${i.name}</div><div class="ci-sub">${i.sub}</div>
        <div class="qty-ctrl"><button onclick="chQty(${i.id},-1)">−</button><span>${i.qty}</span><button onclick="chQty(${i.id},1)">+</button></div>
      </div>
      <div class="ci-price"><div class="price">₹${(i.price * i.qty).toLocaleString('en-IN')}</div><span class="ci-remove" onclick="rmItem(${i.id})"><i class="fa-regular fa-trash-can"></i> Remove</span></div>
    </div>`).join('')}</div>
    <div>${oSummaryHTML(sub, del, tot, true)}</div>
  </div>`;
}

// Order summary HTML
function oSummaryHTML(sub, del, tot, withCheckout = false) {
  return `<div class="order-summary">
    <div class="os-title">Order Summary</div>
    <div class="os-row"><span>Subtotal</span><span>₹${sub.toLocaleString('en-IN')}</span></div>
    <div class="os-row"><span>Delivery</span><span>${del === 0 ? '<span style="color:green">FREE</span>' : '₹' + del}</span></div>
    ${del > 0 ? `<div class="os-row"><span style="color:var(--red);font-size:12px">Add ₹${999 - sub} for free delivery</span></div>` : ''}
    <div class="os-row total"><span>Total</span><span>₹${tot.toLocaleString('en-IN')}</span></div>
    <div class="promo-row"><input type="text" placeholder="Promo code"/><button>Apply</button></div>
    ${withCheckout ? `<button class="checkout-btn cart-clear-btn" onclick="clearCart()">Clear Cart</button><button class="checkout-btn" onclick="goTo('checkout')">Proceed to Checkout →</button>` : `<button class="checkout-btn" onclick="placeOrder()">Place Order →</button>`}
    <div class="pay-icons"><div class="pay-icon">UPI</div><div class="pay-icon">GPay</div><div class="pay-icon">PhonePe</div><div class="pay-icon">CARD</div><div class="pay-icon">COD</div></div>
  </div>`;
}

// Change item quantity
function chQty(id, d) {
  const i = cart.find(x => x.id === id);
  if (!i) return;
  i.qty += d;
  if (i.qty <= 0) cart = cart.filter(x => x.id !== id);
  Storage.save('cart', cart);
  updateCartCount();
  renderCart();
}

// Remove item from cart
function rmItem(id) {
  cart = cart.filter(x => x.id !== id);
  Storage.save('cart', cart);
  updateCartCount();
  renderCart();
}

function clearCart() {
  cart = [];
  Storage.save('cart', cart);
  updateCartCount();
  renderCart();
  showToastMsg('Cart cleared successfully.', '<i class="fa-solid fa-broom"></i>');
}

// Select payment method
function selPay(el) {
  document.querySelectorAll('.pay-opt').forEach(o => { o.classList.remove('sel'); o.querySelector('input').checked = false; });
  el.classList.add('sel');
  el.querySelector('input').checked = true;
}
