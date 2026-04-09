// ===== CHECKOUT MANAGEMENT =====

// Render checkout summary
function renderCheckoutSummary() {
  const sub = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const del = getDeliveryCharge();
  const tot = sub + del;
  const zi = zoneInfo[currentDeliveryZone] || zoneInfo['local'];
  document.getElementById('checkout-summary').innerHTML = `
    <div class="os-title">Your Order</div>
    ${cart.map(i => `<div class="os-row"><span>${i.name} x${i.qty}</span><span>₹${(i.price * i.qty).toLocaleString('en-IN')}</span></div>`).join('')}
    <div class="os-row"><span>Subtotal</span><span>₹${sub.toLocaleString('en-IN')}</span></div>
    <div class="os-row"><span>Delivery (${zi.days})</span><span style="color:${del === 0 ? 'var(--green)' : 'var(--dark)'};font-weight:600">${del === 0 ? 'FREE' : '₹' + del}</span></div>
    <div class="os-row total"><span>Total</span><span>₹${tot.toLocaleString('en-IN')}</span></div>
    <button class="checkout-btn" onclick="placeOrder()">Place Order →</button>
    <div class="pay-icons" style="margin-top:12px"><div class="pay-icon">UPI</div><div class="pay-icon">GPay</div><div class="pay-icon">CARD</div><div class="pay-icon">COD</div></div>`;
}

// Get selected payment method
function getSelectedPayment() {
  const sel = document.querySelector('.pay-opt.sel .pay-opt-label');
  return sel ? sel.textContent : 'COD';
}

// Place order - with Razorpay for online payments, COD fallback
function placeOrder() {
  safeRun(async () => {
    if (!cart.length) {
      showToastMsg('Your cart is empty. Add items before placing an order.', '⚠️');
      goTo('shop');
      return;
    }

    const fname = document.getElementById('co-fname').value.trim();
    const phone = document.getElementById('co-phone').value.trim();
    const addr  = document.getElementById('co-addr').value.trim();
    const city  = document.getElementById('co-city').value.trim();
    const pin   = document.getElementById('co-pin').value.trim();

    if (!fname || !phone || !addr || !city || !pin) {
      showToastMsg('Please fill all delivery fields', '⚠️');
      return;
    }
    if (!validatePhone(phone)) { showToastMsg('Enter a valid 10-digit phone number', '⚠️'); return; }
    if (!validatePincode(pin)) { showToastMsg('Enter a valid 5 or 6 digit pincode', '⚠️'); return; }

    const pay = getSelectedPayment();
    const sub = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const del = getDeliveryCharge();
    const total = sub + del;
    const districtVal = document.getElementById('co-district').value || city;
    const lname = document.getElementById('co-lname') ? document.getElementById('co-lname').value.trim() : '';
    const email = document.getElementById('co-email') ? document.getElementById('co-email').value.trim() : '';

    // ── COD: save locally and show success ──
    if (pay === 'COD') {
      _saveOrderLocally({ fname, lname, phone, email, addr, city, pin, districtVal, pay, total, sub, del });
      return;
    }

    // ── Online payment via Razorpay ──
    if (typeof Razorpay === 'undefined') {
      showToastMsg('Payment gateway not loaded. Please try COD or refresh.', '⚠️');
      return;
    }

    // Try backend order creation first
    let rzpOrderId = null;
    let rzpKeyId = 'rzp_live_REPLACE_THIS_WITH_YOUR_REAL_KEY'; // ← Replace this with your actual Live Key ID from Razorpay

    try {
      if (await api.healthCheck()) {
        const res = await api.post('/orders/create-razorpay-order', { total });
        rzpOrderId = res.razorpay_order_id;
        rzpKeyId = res.key_id || rzpKeyId;
      }
    } catch (e) {
      console.warn('Backend unavailable, using client-only Razorpay');
    }

        // DEMO MODE: If key is not replaced, show a mock payment screen so the app doesn't break
        if (rzpKeyId.includes('REPLACE') || rzpKeyId.includes('XXXXX')) {
          showToastMsg('Demo Mode: Simulating Online Payment Gateway...', '⏳');
          setTimeout(() => {
            if (confirm("MOCK PAYMENT GATEWAY 💳\n\n(You haven't added a real Razorpay key yet)\n\nClick 'OK' to simulate a SUCCESSFUL payment.\nClick 'Cancel' to simulate a FAILED payment.")) {
              _saveOrderLocally({ fname, lname, phone, email, addr, city, pin, districtVal, pay, total, sub, del, rzpPaymentId: 'pay_mock_' + Math.floor(Math.random()*1000000) });
            } else {
              showToastMsg('Payment cancelled by user. Try COD.', '⚠️');
            }
          }, 1000);
          return;
        }

    const options = {
      key: rzpKeyId,
      amount: total * 100,          // paise lo
      currency: 'INR',
      name: 'Akhil Sports',
      description: 'Sports Equipment – Bapatla',
      image: '',
      order_id: rzpOrderId || undefined,
      prefill: {
        name: fname + (lname ? ' ' + lname : ''),
        email: email || '',
        contact: phone
      },
      notes: {
        address: `${addr}, ${city}, ${pin}`
      },
      theme: { color: '#D42B20' },

      handler: async function (response) {
        // Payment success
        let verified = true;
        try {
          if (await api.healthCheck()) {
            const v = await api.post('/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            verified = v.success;
          }
        } catch (e) {
         
          verified = true;
        }

        if (verified) {
          _saveOrderLocally({ fname, lname, phone, email, addr, city, pin, districtVal, pay, total, sub, del, rzpPaymentId: response.razorpay_payment_id });
        } else {
          showToastMsg('Payment verification failed. Contact support.', '⚠️');
        }
      },

      modal: {
        ondismiss: () => showToastMsg('Payment cancelled. Choose COD if you prefer cash.', '⚠️')
      }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function (resp) {
      showToastMsg('Payment failed: ' + (resp.error.description || 'Try again'), '⚠️');
    });
    rzp.open();
  });
}


function _saveOrderLocally({ fname, lname, phone, email, addr, city, pin, districtVal, pay, total, sub, del, rzpPaymentId }) {
  // Save address if checkbox ticked
  const saveCb = document.getElementById('save-addr-cb');
  if (saveCb && saveCb.checked) {
    const dist = document.getElementById('co-district').value;
    const mandalSel = document.getElementById('co-mandal');
    const mandal = mandalSel ? mandalSel.value : city;
    savedAddresses.push({ name: (fname + ' ' + (lname||'')).trim(), phone, addr, city, pin, district: dist || city, mandal, zone: currentDeliveryZone });
    Storage.save('savedAddresses', savedAddresses);
    saveCb.checked = false;
  }

  const orderId = 'AS-' + Math.floor(100000 + Math.random() * 900000);
  const itemsSummary = cart.map(i => `${i.name} x${i.qty}`).join(', ');
  const orderDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const newOrder = {
    id: orderId,
    cust: currentUser?.name || fname,
    phone,
    email: email || '',
    items: itemsSummary,
    total,
    status: 'pending',
    date: orderDate,
    pay: pay + (rzpPaymentId ? ' ✓' : ''),
    location: `${city}, ${districtVal} — ${pin}`,
    rzpPaymentId: rzpPaymentId || null
  };

  allOrders.unshift(newOrder);
  Storage.save('allOrders', allOrders);

  
  if (currentUser) {
    currentUser.orders = (currentUser.orders || 0) + 1;
    currentUser.spent = (currentUser.spent || 0) + total;
    Storage.save('currentUser', currentUser);
    const idx = customers.findIndex(c => c.email === currentUser.email);
    if (idx >= 0) customers[idx] = currentUser;
    Storage.save('customers', customers);
  }

  
  _sendWhatsAppNotification({ orderId, fname, lname, phone, itemsSummary, total, pay, addr, city, pin, rzpPaymentId });

  
  const orderBox = document.getElementById('order-id-box');
  if (orderBox) orderBox.textContent = 'Order #' + orderId;
  const thankYouMsg = document.getElementById('thank-you-msg');
  if (thankYouMsg) thankYouMsg.textContent = `Thank you, ${currentUser?.name || fname}! Your order has been received. We'll contact you shortly to confirm delivery.`;
  const summaryEl = document.getElementById('order-summary-success');
  if (summaryEl) {
    const itemsList = cart.map(i => `${i.name} x${i.qty}`).join('<br>');
    summaryEl.innerHTML = `<h4>Order Summary</h4><div class="item">${itemsList}</div><div class="item"><strong>Total: ₹${total.toLocaleString('en-IN')}</strong></div><div class="item" style="color:var(--gray);font-size:12px">Payment: ${pay}${rzpPaymentId ? ' · ID: ' + rzpPaymentId : ''}</div>`;
  }

  cart = [];
  currentDeliveryZone = 'local';
  Storage.save('cart', cart);
  updateCartCount();
  goTo('success');
}


function _sendWhatsAppNotification({ orderId, fname, lname, phone, itemsSummary, total, pay, addr, city, pin, rzpPaymentId }) {

  const OWNER_WHATSAPP = '918088886368'; // ఇక్కడ '91' పక్కన నీ ఒరిజినల్ 10 అంకెల వాట్సాప్ నెంబర్ ఇవ్వాలి 

  const name = (fname + ' ' + (lname || '')).trim();
  const payStatus = rzpPaymentId ? `✅ PAID (${pay})` : `💵 ${pay}`;
  const msg = `🏏 *New Order — Akhil Sports*\n\n` +
    `*Order ID:* ${orderId}\n` +
    `*Customer:* ${name}\n` +
    `*Phone:* ${phone}\n` +
    `*Items:* ${itemsSummary}\n` +
    `*Total:* ₹${total.toLocaleString('en-IN')}\n` +
    `*Payment:* ${payStatus}\n` +
    `*Address:* ${addr}, ${city} — ${pin}\n\n` +
    `_Please confirm & dispatch soon!_`;

  const url = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`;


  window.open(url, '_blank');
}
