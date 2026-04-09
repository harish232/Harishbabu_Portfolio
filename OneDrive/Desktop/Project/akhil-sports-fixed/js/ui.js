// ===== UI NAVIGATION =====

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function toggleNav() {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;
  nav.classList.toggle('active');
}

function closeNav() {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;
  nav.classList.remove('active');
}

function goTo(sub) {
  document.querySelectorAll('[id^="sub-"]').forEach(s => {
    s.style.display = 'none';
    s.classList.add('hidden');
  });
  const target = document.getElementById('sub-' + sub);
  if (target) {
    target.style.display = 'block';
    target.classList.remove('hidden');
  }
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const nl = document.getElementById('nav-' + sub);
  if (nl) nl.classList.add('active');
  window.scrollTo(0, 0);
  closeNav();
  if (sub === 'cart') renderCart();
  if (sub === 'checkout') { renderCheckoutSummary(); setTimeout(renderSavedAddresses, 50); }
  if (sub === 'shop') renderShopProducts();
  if (sub === 'tracking') renderTrackingPage();
}

// Initialize pill toggles
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.pill').forEach(p => {
    p.addEventListener('click', function () {
      document.querySelectorAll('.pill').forEach(x => x.classList.remove('sel'));
      this.classList.add('sel');
    });
  });

  updateCartCount();
  renderHomeProducts();
  renderShopProducts();
  renderSavedAddresses();
  renderCheckoutSummary();

  if (currentUser) {
    enterStore();
  } else {
    showPage('page-login');
    showCustLogin();
  }
});
