// ===== AUTHENTICATION =====

let currentUser = null;
let fpMode = 'customer'; // 'customer' or 'owner'
let fpUser = null;
let tempProfImg = null;

// Customer registration and login forms
function showCustRegister() {
  document.getElementById('cust-login-form').style.display = 'none';
  document.getElementById('cust-reg-form').style.display = 'block';
}

function showCustLogin() {
  document.getElementById('cust-login-form').style.display = 'block';
  document.getElementById('cust-reg-form').style.display = 'none';
}

// Customer login
function custLogin() {
  const email = document.getElementById('cust-email').value.trim();
  const pass = document.getElementById('cust-pass').value;
  const err = document.getElementById('cust-err');
  err.classList.remove('show');
  if (!email || !pass) { showToastMsg('Email and password are required', '⚠️'); return; }
  if (!validateEmail(email)) { showToastMsg('Enter a valid email address', '⚠️'); return; }
  const found = customers.find(c => c.email.toLowerCase() === email.toLowerCase() && c.pass === pass);
  if (!found) { err.classList.add('show'); return; }
  currentUser = found;
  Storage.save('currentUser', currentUser);
  enterStore();
}

// Customer registration
function custRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const pass = document.getElementById('reg-pass').value;
  if (!name || !email || !pass) { showToastMsg('Please complete all registration fields', '⚠️'); return; }
  if (!validateEmail(email)) { showToastMsg('Please enter a valid email address', '⚠️'); return; }
  if (phone && !validatePhone(phone)) { showToastMsg('Please enter a valid 10-digit phone number', '⚠️'); return; }
  if (pass.length < 4) { showToastMsg('Password must be at least 4 characters', '⚠️'); return; }
  if (customers.some(c => c.email.toLowerCase() === email.toLowerCase())) { showToastMsg('Email already registered, please login', '⚠️'); return; }
  const newCust = { name, email, phone: phone || '', orders: 0, spent: 0, pass };
  customers.push(newCust);
  Storage.save('customers', customers);
  currentUser = newCust;
  Storage.save('currentUser', currentUser);
  enterStore();
}

// Real Google Login Integration
function googleLogin() {
  // Mawa, idhi nee real Google Client ID. (Google Cloud Console nundi thechukovali)
  const GOOGLE_CLIENT_ID = '1069287367344-ouun63ktecsnq7sinenf7mg36cmadsmv.apps.googleusercontent.com';

  if (GOOGLE_CLIENT_ID === 'REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
    alert("Mawa! Nijamga Google tho verify ayyi login avvalante, nuvvu 'Google Cloud Console' lo project create chesi 'Client ID' thechukovali.\n\nAa ID ni auth.js lo pettali. Ippatiki dummy login tho continue avuthundhi.");
    // Fallback to Mock Login if Client ID is not provided
    _mockGoogleLogin();
    return;
  }

  // Initialize Real Google OAuth Client
  const client = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'email profile',
    callback: (response) => {
      if (response && response.access_token) {
        showToastMsg('Verifying your account...', '⏳');
        // Fetch user details using the access token
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` }
        })
        .then(res => res.json())
        .then(userInfo => {
          // Verification Complete! Create or login user
          const googleUser = { name: userInfo.name, email: userInfo.email, phone: '', orders: 0, spent: 0, pass: 'google_oauth_real' };
          let found = customers.find(c => c.email === googleUser.email);
          if (!found) { customers.push(googleUser); Storage.save('customers', customers); found = googleUser; }
          currentUser = found;
          Storage.save('currentUser', currentUser);
          enterStore();
          showToastMsg(`Welcome ${userInfo.name}!`, '✅');
        })
        .catch(err => showToastMsg('Failed to fetch Google profile', '⚠️'));
      }
    }
  });

  // Open Google Login Popup
  client.requestAccessToken();
}

function _mockGoogleLogin() {
  showToastMsg('Simulating Google Login...', '⏳');
  setTimeout(() => {
    const googleUser = { name: 'Google User', email: 'user@gmail.com', phone: '', orders: 0, spent: 0, pass: 'google_oauth_mock' };
    let found = customers.find(c => c.email === googleUser.email);
    if (!found) { customers.push(googleUser); Storage.save('customers', customers); found = googleUser; }
    currentUser = found;
    Storage.save('currentUser', currentUser);
    enterStore();
    showToastMsg('Logged in with Demo Google Account!', '✅');
  }, 1000);
}

// Owner login
function ownerLogin() {
  const user = document.getElementById('owner-user').value.trim();
  const pass = document.getElementById('owner-pass').value;
  const err = document.getElementById('owner-err');
  if (user === 'admin' && pass === 'akhil123') {
    err.classList.remove('show');
    showPage('page-owner');
    ownerTab('overview');
  } else {
    err.classList.add('show');
  }
}

// Profile Image Upload
async function uploadProfileImg(input) {
  if (!input.files || !input.files[0]) return;
  const url = await readFileAsDataURL(input.files[0]);
  tempProfImg = url;
  document.getElementById('prof-avatar-preview').innerHTML = `<img src="${url}"/>`;
}

function _updateNavAvatar() {
  const displayHtml = currentUser.profilePic 
    ? `<img src="${currentUser.profilePic}" style="width:20px;height:20px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:4px"/> ${currentUser.name.split(' ')[0]}`
    : `<i class="fa-regular fa-user"></i> ${currentUser.name.split(' ')[0]}`;
  document.getElementById('user-display').innerHTML = displayHtml;
}

// Enter main store
function enterStore() {
  _updateNavAvatar();
  document.getElementById('cust-welcome').textContent = `Welcome back, ${currentUser.name}!`;
  document.getElementById('prof-name').value = currentUser.name;
  document.getElementById('prof-email').value = currentUser.email;
  document.getElementById('prof-phone').value = currentUser.phone || '';
  showPage('page-store');
  goTo('home');
  renderHomeProducts();
  renderShopProducts();
  renderCustomerDashboard();
}

function saveProfile() {
  if (!currentUser) return;
  const name = document.getElementById('prof-name').value.trim();
  const email = document.getElementById('prof-email').value.trim();
  const phone = document.getElementById('prof-phone').value.trim();
  if (!name || !email) { showToastMsg('Name and email are required', '⚠️'); return; }
  if (!validateEmail(email)) { showToastMsg('Enter a valid email', '⚠️'); return; }
  if (phone && !validatePhone(phone)) { showToastMsg('Enter a valid 10-digit phone number', '⚠️'); return; }
  const duplicate = customers.find(c => c.email.toLowerCase() === email.toLowerCase() && c.email.toLowerCase() !== currentUser.email.toLowerCase());
  if (duplicate) { showToastMsg('That email is already used by another account', '⚠️'); return; }

  const previousEmail = currentUser.email;
  currentUser.name = name;
  currentUser.email = email;
  currentUser.phone = phone || '';
  if (tempProfImg) currentUser.profilePic = tempProfImg;

  const idx = customers.findIndex(c => c.email.toLowerCase() === previousEmail.toLowerCase());
  if (idx >= 0) {
    customers[idx] = { ...customers[idx], ...currentUser };
  } else {
    customers.push(currentUser);
  }
  Storage.save('currentUser', currentUser);
  Storage.save('customers', customers);
  document.getElementById('user-display').textContent = currentUser.name.split(' ')[0];
  renderCustomerDashboard();
  showToastMsg('Profile updated successfully', '✅');
}

function renderCustomerDashboard() {
  if (!currentUser) return;
  document.getElementById('cust-welcome').textContent = `Welcome back, ${currentUser.name}!`;
  document.getElementById('co-total').textContent = currentUser.orders || 0;
  document.getElementById('co-spent').textContent = `₹${(currentUser.spent || 0).toLocaleString('en-IN')}`;
  const orders = allOrders.filter(o => o.cust.toLowerCase() === currentUser.name.toLowerCase());
  const list = document.getElementById('customer-orders-list');
  if (!list) return;
  if (orders.length === 0) {
    list.innerHTML = `<div class="order-row"><div><div class="oid">No previous orders</div><div class="odate">Your order history will appear here once you place an order.</div></div></div>`;
    return;
  }
  list.innerHTML = orders.map(o => `
    <div class="order-row">
      <div>
        <div class="oid">#${o.id}</div>
        <div class="odate">${o.date} · ${o.items}</div>
        ${o.status === 'delivered' ? `<button class="return-btn" onclick="requestReturn('${o.id}')"><i class="fa-solid fa-rotate-left"></i> Return Order</button>` : ''}
      </div>
      <div><span class="status-badge ${o.status}">${o.status.replace('_', ' ')}</span></div>
      <div class="oprice">₹${o.total.toLocaleString('en-IN')}</div>
    </div>
  `).join('');
  
  renderCustomerWishlist();
  renderCustomerTickets();
}

// Return Order functionality
function requestReturn(id) {
  if (confirm('Are you sure you want to return this order? Our team will contact you shortly.')) {
    const order = allOrders.find(o => o.id === id);
    if (order) {
      order.status = 'return_requested';
      Storage.save('allOrders', allOrders);
      showToastMsg('Return request submitted!', '<i class="fa-solid fa-box-open"></i>');
      renderCustomerDashboard();
    }
  }
}

function renderCustomerWishlist() {
  const wlContainer = document.getElementById('customer-wishlist-list');
  if (!wlContainer) return;
  
  if (typeof wishlist === 'undefined' || !wishlist || wishlist.length === 0) {
    wlContainer.innerHTML = `<div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; color: var(--gray); background: #fafafa; border: 1px dashed var(--border); border-radius: 8px;">
      <div style="font-size: 32px; margin-bottom: 12px; color: var(--border);"><i class="fa-solid fa-heart-crack"></i></div>
      <p style="margin-bottom: 16px;">Your wishlist is empty. Save items you like to view them here.</p>
      <button class="btn-red" style="padding: 10px 20px; font-size: 13px;" onclick="goTo('shop')">Browse Products</button>
    </div>`;
    return;
  }
  
  const likedProducts = products.filter(p => wishlist.includes(p.id));
  wlContainer.innerHTML = likedProducts.map(renderProductCard).join('');
}

// Raise a support ticket
function raiseTicket() {
  const type = document.getElementById('ticket-type').value;
  const desc = document.getElementById('ticket-desc').value.trim();
  if (!desc) { showToastMsg('Please describe your issue', '<i class="fa-solid fa-triangle-exclamation"></i>'); return; }

  let allTickets = Storage.get('customerTickets') || [];
  const newTicket = {
    id: 'TKT-' + Math.floor(10000 + Math.random() * 90000),
    email: currentUser.email,
    type,
    desc,
    status: 'Open',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };
  
  allTickets.push(newTicket);
  Storage.save('customerTickets', allTickets);
  document.getElementById('ticket-desc').value = '';
  showToastMsg('Support ticket raised successfully!', '<i class="fa-solid fa-headset"></i>');
  renderCustomerTickets();
}

// Render customer support tickets
function renderCustomerTickets() {
  const el = document.getElementById('customer-tickets-list');
  if (!el) return;
  
  let allTickets = Storage.get('customerTickets') || [];
  let myTickets = allTickets.filter(t => t.email === currentUser.email);

  if (myTickets.length === 0) {
    el.innerHTML = '<div style="font-size: 13px; color: var(--gray); padding: 10px 0;">No support tickets raised yet.</div>';
    return;
  }

  el.innerHTML = myTickets.slice().reverse().map(t => `
    <div style="border: 1px solid var(--border); padding: 14px; margin-bottom: 12px; background: #fff; border-left: 3px solid ${t.status === 'Open' ? 'var(--yellow)' : 'var(--green)'};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div style="font-weight: 600; font-size: 14px;">${t.id} <span style="color: var(--gray); font-weight: 400; font-size: 13px;">— ${t.type}</span></div>
        <span class="status-badge ${t.status === 'Open' ? 'processing' : 'delivered'}">${t.status}</span>
      </div>
      <p style="font-size: 13px; color: var(--dark); margin-bottom: 8px; line-height: 1.5;">${t.desc}</p>
      <div style="font-size: 11px; color: var(--gray);">Raised on: ${t.date}</div>
    </div>
  `).join('');
}

// Logout
function doLogout() {
  currentUser = null;
  cart = [];
  Storage.remove('currentUser');
  Storage.remove('cart');
  updateCartCount();
  showPage('page-login');
}

// Forgot password modal
function showForgotModal(mode) {
  fpMode = mode;
  fpUser = null;
  document.getElementById('forgot-modal').style.display = 'block';
  ['fp-step1', 'fp-step2', 'fp-step3', 'fp-step4'].forEach((id, i) =>
    document.getElementById(id).style.display = i === 0 ? 'block' : 'none'
  );
  document.getElementById('fp-err').classList.remove('show');
  document.getElementById('fp-err2').classList.remove('show');
  document.getElementById('fp-err3').classList.remove('show');
  document.getElementById('fp-input1').value = '';
  document.getElementById('fp-answer').value = '';
  document.getElementById('fp-newpass').value = '';
  document.getElementById('fp-confirmpass').value = '';

  if (mode === 'owner') {
    document.getElementById('fp-step1-sub').textContent = 'Please enter owner username';
    document.getElementById('fp-label1').textContent = 'Username';
    document.getElementById('fp-input1').placeholder = 'admin';
    document.getElementById('fp-input1').type = 'text';
  } else {
    document.getElementById('fp-step1-sub').textContent = 'Please enter the email you registered with';
    document.getElementById('fp-label1').textContent = 'Email';
    document.getElementById('fp-input1').placeholder = 'your@email.com';
    document.getElementById('fp-input1').type = 'email';
  }
}

function closeForgotModal(e) {
  if (e && e.target !== document.querySelector('.modal-overlay')) return;
  document.getElementById('forgot-modal').style.display = 'none';
}

// Security question
function getSecurityQuestion(mode) {
  if (mode === 'owner') return { q: 'What is the store name you registered?', a: 'akhil sports' };
  if (fpUser) return { q: `What is your registered phone number?`, a: fpUser.phone || '9876543210' };
  return { q: 'What is your registered phone number?', a: '' };
}

// Forgot password steps
function fpStep1() {
  const val = document.getElementById('fp-input1').value.trim();
  const err = document.getElementById('fp-err');
  err.classList.remove('show');
  if (fpMode === 'owner') {
    if (val.toLowerCase() !== 'admin') { err.classList.add('show'); return; }
    fpUser = { name: 'Owner', phone: '' };
  } else {
    const found = customers.find(c => c.email.toLowerCase() === val.toLowerCase());
    if (!found) { err.classList.add('show'); return; }
    fpUser = found;
  }
  const sq = getSecurityQuestion(fpMode);
  document.getElementById('fp-question-text').textContent = sq.q;
  document.getElementById('fp-step1').style.display = 'none';
  document.getElementById('fp-step2').style.display = 'block';
}

function fpStep2() {
  const ans = document.getElementById('fp-answer').value.trim().toLowerCase();
  const err2 = document.getElementById('fp-err2');
  err2.classList.remove('show');
  const sq = getSecurityQuestion(fpMode);
  const correct = fpMode === 'owner' ? 'akhil sports' : (fpUser.phone || '').replace(/\s/g, '');
  const entered = ans.replace(/\s/g, '');
  if (entered !== correct.toLowerCase() && ans !== sq.a.toLowerCase()) {
    err2.classList.add('show'); return;
  }
  document.getElementById('fp-step2').style.display = 'none';
  document.getElementById('fp-step3').style.display = 'block';
}

function fpBackStep1() {
  document.getElementById('fp-step2').style.display = 'none';
  document.getElementById('fp-step1').style.display = 'block';
  document.getElementById('fp-err2').classList.remove('show');
}

function fpStep3() {
  const np = document.getElementById('fp-newpass').value;
  const cp = document.getElementById('fp-confirmpass').value;
  const err3 = document.getElementById('fp-err3');
  err3.classList.remove('show');
  if (!np || np !== cp) { err3.classList.add('show'); return; }
  if (np.length < 4) { err3.textContent = 'Password must be at least 4 characters.'; err3.classList.add('show'); return; }
  
  if (fpMode === 'owner') {
    showToastMsg('Owner password updated!', '🔒');
  } else if (fpUser) {
    fpUser.pass = np;
    const idx = customers.findIndex(c => c.email === fpUser.email);
    if (idx >= 0) customers[idx] = fpUser;
    Storage.save('customers', customers);
    showToastMsg('Password reset successful!', '✅');
  }
  document.getElementById('fp-step3').style.display = 'none';
  document.getElementById('fp-step4').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) {
    enterStore();
  }
});

// ===== ORDER TRACKING =====
function renderTrackingPage() {
  const el = document.getElementById('tracking-orders-list');
  if (!el) return;
  const orders = currentUser
    ? allOrders.filter(o => o.cust.toLowerCase() === currentUser.name.toLowerCase())
    : allOrders.slice(0, 3);

  if (orders.length === 0) {
    el.innerHTML = `<div style="text-align:center;padding:40px 0;color:var(--gray)">No orders to track yet. <a onclick="goTo('shop')" style="color:var(--red);cursor:pointer">Shop now →</a></div>`;
    return;
  }

  const statusSteps = ['pending','processing','shipped','delivered'];
  const stepLabels = {
    pending:    { label: 'Order placed',       sub: 'We received your order',           icon: '<i class="fa-solid fa-clipboard-check"></i>' },
    processing: { label: 'Packing',            sub: 'Your items are being packed',      icon: '<i class="fa-solid fa-box-open"></i>' },
    shipped:    { label: 'Out for delivery',   sub: 'On the way to you',               icon: '<i class="fa-solid fa-truck-fast"></i>' },
    delivered:  { label: 'Delivered',          sub: 'Order delivered successfully',    icon: '<i class="fa-solid fa-gift"></i>' }
  };

  el.innerHTML = orders.map(o => {
    const currentIdx = statusSteps.indexOf(o.status);
    const stepsHTML = statusSteps.map((s, i) => {
      const isDone   = i < currentIdx;
      const isActive = i === currentIdx;
      const info = stepLabels[s];
      return `<div class="track-step ${isDone ? 'done' : isActive ? 'active' : ''}" style="opacity:${isDone||isActive ? '1':'0.4'}">
        <div class="track-dot" style="${isDone||isActive?'background:var(--red);color:#fff':'background:var(--border);color:transparent'}">${isDone ? '<i class="fa-solid fa-check"></i>' : isActive ? info.icon : ''}</div>
        <div class="track-info">
          <div class="track-label">${info.label}</div>
          <div class="track-sub">${isActive ? '<strong>' + info.sub + '</strong>' : isDone ? info.sub : 'Pending'}</div>
        </div>
      </div>`;
    }).join('');

    return `<div style="background:#fff;border:1px solid var(--border);padding:20px;margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--border)">
        <div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700">#${o.id}</div>
          <div style="font-size:12px;color:var(--gray)">${o.date} · ${o.items}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700">₹${o.total.toLocaleString('en-IN')}</div>
          <div style="font-size:11px;color:var(--gray)">${o.pay}</div>
        </div>
      </div>
      <div class="tracking-steps">${stepsHTML}</div>
    </div>`;
  }).join('');
}

// Mobile sidebar toggle for owner dashboard
function toggleSidebar() {
  const nav = document.getElementById('sb-nav');
  const btn = document.getElementById('sb-toggle-btn');
  if (!nav) return;
  nav.classList.toggle('open');
  if (btn) btn.classList.toggle('open');
}
