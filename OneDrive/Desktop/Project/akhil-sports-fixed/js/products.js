// ===== PRODUCTS MANAGEMENT =====

let currentFilter = 'All';
let productSearch = '';
let reviewsData = {}; // { productId: [{user, rating, text, date}] }
let wishlist = []; // Store liked products

// Load reviews and wishlist from storage
function loadProductData() {
  const savedR = Storage.get('reviewsData');
  if (savedR) reviewsData = savedR;
  const savedW = Storage.get('wishlist');
  if (savedW) wishlist = savedW;
}

// Render single product card
function renderProductCard(p) {
  const avgRating = _getAvgRating(p.id);
  const stars = _starsHTML(avgRating);
  const reviewCount = (reviewsData[p.id] || []).length;
  const imgHTML = (p.imgs && p.imgs.length > 0)
    ? `<img src="${p.imgs[0]}" alt="${p.name}" loading="lazy"/>`
    : `<div class="no-img-placeholder">No Image</div>`;
    
  const isLiked = wishlist.includes(p.id);
  const likeBtn = `<button class="wishlist-btn ${isLiked ? 'active' : ''}" onclick="toggleWishlist(event, ${p.id}, this)"><i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i></button>`;

  return `<div class="prod-card">
    <div class="prod-img" onclick="showProductModal(${p.id})" style="cursor:pointer">${imgHTML}${p.badge ? `<span class="badge ${p.badge}" style="z-index:2">${p.badge.toUpperCase()}</span>` : ''}
      ${likeBtn}
    </div>
    <div class="prod-info">
      <div class="prod-name" onclick="showProductModal(${p.id})" style="cursor:pointer">${p.name}</div>
      <div class="prod-sub">${p.sub}</div>
      ${reviewCount > 0 ? `<div class="prod-rating">${stars}<span class="rating-count">(${reviewCount})</span></div>` : ''}
      <div class="prod-price">₹${p.price.toLocaleString('en-IN')}${p.old ? `<span class="prod-old">₹${p.old.toLocaleString('en-IN')}</span>` : ''}</div>
      <button class="add-cart-btn" onclick="addToCart(${p.id}, this)">Add to Cart</button>
    </div>
  </div>`;
}

// Toggle Wishlist (Like button)
function toggleWishlist(e, id, btn) {
  e.stopPropagation(); // Prevent opening product modal
  const idx = wishlist.indexOf(id);
  if (idx >= 0) {
    wishlist.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    showToastMsg('Removed from Wishlist', '<i class="fa-solid fa-heart-crack"></i>');
  } else {
    wishlist.push(id);
    btn.classList.add('active');
    btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    showToastMsg('Added to Wishlist!', '<i class="fa-solid fa-heart" style="color:var(--red)"></i>');
  }
  Storage.save('wishlist', wishlist);
  
  // If the user is on the dashboard, update the wishlist view dynamically
  if (typeof renderCustomerWishlist === 'function') {
    renderCustomerWishlist();
  }
}

// Render home page products (featured only)
function renderHomeProducts() {
  const el = document.getElementById('home-products');
  if (el) el.innerHTML = products.filter(p => p.badge).slice(0, 4).map(renderProductCard).join('');
}

// Render shop products with filter and search
function renderShopProducts() {
  const searchWords = productSearch.split(/\s+/).filter(Boolean);
  const filtered = products.filter(p => {
    const matchesCategory = currentFilter === 'All' ? true : p.cat === currentFilter;
    const text = `${p.name} ${p.sub} ${p.cat}`.toLowerCase();
    const matchesSearch = !searchWords.length || searchWords.every(word => text.includes(word));
    return matchesCategory && matchesSearch;
  });
  const shopEl = document.getElementById('shop-products');
  if (!shopEl) return;

  if (filtered.length === 0) {
    // ── Empty state UI ──
    const query = productSearch || currentFilter;
    shopEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon" style="color:var(--gray);font-size:40px;margin-bottom:16px"><i class="fa-solid fa-magnifying-glass"></i></div>
        <div class="empty-state-title">No results for "${query}"</div>
        <div class="empty-state-sub">Try a different keyword or browse all categories</div>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px">
          <button class="btn-red" style="padding:10px 22px;font-size:13px" onclick="setFilter('All',null);document.getElementById('shop-search').value='';productSearch=''">Browse All</button>
          ${['Cricket','Football','Badminton'].map(c => `<button class="filt-btn" onclick="setFilter('${c}',this)">${c}</button>`).join('')}
        </div>
      </div>`;
    return;
  }
  shopEl.innerHTML = filtered.map(renderProductCard).join('');
}

// Set product filter
function setFilter(cat, btn) {
  currentFilter = cat;
  productSearch = '';
  const searchInput = document.getElementById('shop-search');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filt-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderShopProducts();
}

// Handle search input in shop
function searchShopProducts() {
  const input = document.getElementById('shop-search');
  productSearch = input ? input.value.trim().toLowerCase() : '';
  document.querySelectorAll('.filt-btn').forEach(b => b.classList.remove('active'));
  renderShopProducts();
}

// Filter and navigate to shop
function filterShop(cat) {
  currentFilter = cat;
  productSearch = '';
  const searchInput = document.getElementById('shop-search');
  if (searchInput) searchInput.value = '';
  goTo('shop');
  setTimeout(() => {
    document.querySelectorAll('.filt-btn').forEach(b => {
      b.classList.toggle('active', b.textContent.replace(/[^\w]/g, '').toLowerCase() === cat.toLowerCase());
    });
    renderShopProducts();
  }, 50);
}

function showProductModal(id) {
  const p = products.find(x => x.id === id);
  const content = document.getElementById('product-modal-content');
  if (!p || !content) return;
  content.innerHTML = productModalHTML(p);
  const modal = document.getElementById('product-modal');
  if (modal) modal.style.display = 'block';
}

function closeProductModal(e) {
  if (e && e.target !== document.querySelector('#product-modal > .modal-overlay')) return;
  const modal = document.getElementById('product-modal');
  if (modal) modal.style.display = 'none';
}

function productModalHTML(p) {
  const description = p.desc || `High-quality ${p.cat.toLowerCase()} gear designed for comfort, durability, and performance.`;
  const features = p.features || ['Premium material', 'Lightweight construction', 'Excellent grip', 'Perfect for daily practice'];
  const reviews = reviewsData[p.id] || [];
  const avg = _getAvgRating(p.id);

  const mainImg = (p.imgs && p.imgs.length) ? p.imgs[0] : '';
  const imgHtml = mainImg ? `<img id="modal-main-img" src="${mainImg}" alt="${p.name}"/>` : '<div class="no-img-placeholder">No Image</div>';
  
  let galleryHtml = '';
  if (p.imgs && p.imgs.length > 1) {
    galleryHtml = `<div class="modal-gallery">` +
      p.imgs.map((src, i) => `<div class="modal-thumb ${i===0 ? 'active' : ''}" onclick="swapModalImg('${src}', this)"><img src="${src}"/></div>`).join('') +
      `</div>`;
  }

  return `
    <div class="modal-product-title">${p.name}</div>
    ${p.badge ? `<div class="product-detail-badge">${p.badge.toUpperCase()}</div>` : ''}
    <div class="modal-grid">
      <div class="detail-img-wrap">
        <div class="detail-img">${imgHtml}</div>
        ${galleryHtml}
      </div>
      <div class="detail-meta">
        <div class="detail-price">₹${p.price.toLocaleString('en-IN')}${p.old ? `<span class="prod-old">₹${p.old.toLocaleString('en-IN')}</span>` : ''}</div>
        <div class="detail-sub">${p.sub}</div>
        ${avg > 0 ? `<div style="display:flex;align-items:center;gap:6px;margin:6px 0">${_starsHTML(avg)}<span style="font-size:13px;color:var(--gray)">${avg.toFixed(1)} · ${reviews.length} review${reviews.length !== 1 ? 's' : ''}</span></div>` : ''}
        <p style="font-size:14px;color:var(--gray);margin:8px 0;line-height:1.6">${description}</p>
        <ul class="detail-features">${features.map(f => `<li>${f}</li>`).join('')}</ul>
        <div class="modal-actions">
          <button class="checkout-btn" onclick="addToCart(${p.id}, this, true)">Add to Cart</button>
          <button class="checkout-btn cart-clear-btn" onclick="goTo('shop');closeProductModal()">Continue Shopping</button>
        </div>
      </div>
    </div>

    <!-- Reviews section -->
    <div class="reviews-section">
      <div class="reviews-header">
        <span class="reviews-title">Customer Reviews</span>
        ${reviews.length > 0 ? `<span class="reviews-avg">${_starsHTML(avg)} ${avg.toFixed(1)}/5</span>` : ''}
      </div>

      ${reviews.length === 0
        ? `<div class="no-reviews">No reviews yet. Be the first to review!</div>`
        : reviews.map(r => `
          <div class="review-item" style="display:flex; gap:12px; margin-bottom:16px;">
            <div style="width:36px;height:36px;border-radius:50%;background:var(--light);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
              ${r.profilePic ? `<img src="${r.profilePic}" style="width:100%;height:100%;object-fit:cover;"/>` : `<i class="fa-regular fa-user" style="color:var(--gray)"></i>`}
            </div>
            <div style="flex:1;">
              <div class="review-top" style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <span class="review-user" style="font-weight:600;font-size:13px;">${r.user}</span>
                <span class="review-stars">${_starsHTML(r.rating)}</span>
                <span class="review-date" style="font-size:11px;color:var(--gray);margin-left:auto;">${r.date}</span>
              </div>
              <div class="review-text" style="font-size:13px;line-height:1.5;">${r.text}</div>
            </div>
          </div>`).join('')}

      ${currentUser ? `
        <div class="add-review">
          <div class="add-review-title">Write a Review</div>
          <div class="star-picker" id="star-picker-${p.id}">
            ${[1,2,3,4,5].map(n => `<span class="star-pick" data-val="${n}" onclick="pickStar(${p.id},${n})">☆</span>`).join('')}
          </div>
          <textarea id="review-text-${p.id}" placeholder="Share your experience with this product..." rows="3" style="width:100%;border:1px solid var(--border);padding:10px;font-family:'DM Sans',sans-serif;font-size:13px;resize:vertical;outline:none;margin-top:8px"></textarea>
          <button class="save-btn" style="margin-top:8px" onclick="submitReview(${p.id})">Submit Review</button>
        </div>` : `<div class="no-reviews" style="margin-top:12px"><a onclick="closeProductModal();showPage('page-login')" style="color:var(--red);cursor:pointer">Login</a> to write a review</div>`}
    </div>`;
}

// Swap Image in Modal (Amazon Style)
function swapModalImg(src, thumbEl) {
  document.getElementById('modal-main-img').src = src;
  document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

// Star rating helpers
let _pickedStars = {};
function pickStar(productId, val) {
  _pickedStars[productId] = val;
  const picker = document.getElementById('star-picker-' + productId);
  if (!picker) return;
  picker.querySelectorAll('.star-pick').forEach((s, i) => {
    s.textContent = i < val ? '★' : '☆';
    s.style.color = i < val ? '#F0B429' : '#ccc';
  });
}

function submitReview(productId) {
  const rating = _pickedStars[productId] || 0;
  const text = (document.getElementById('review-text-' + productId)?.value || '').trim();
  if (!rating) { showToastMsg('Please select a star rating', '<i class="fa-solid fa-star"></i>'); return; }
  if (!text) { showToastMsg('Please write something about the product', '<i class="fa-solid fa-pen"></i>'); return; }

  if (!reviewsData[productId]) reviewsData[productId] = [];
  reviewsData[productId].unshift({
    user: currentUser.name,
    profilePic: currentUser.profilePic || null,
    rating,
    text,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  });
  Storage.save('reviewsData', reviewsData);
  delete _pickedStars[productId];
  showToastMsg('Review submitted! Thank you.', '<i class="fa-solid fa-star" style="color:var(--yellow)"></i>');
  showProductModal(productId); // re-render modal
  renderHomeProducts();
  renderShopProducts();
}

function _getAvgRating(productId) {
  const r = reviewsData[productId] || [];
  if (!r.length) return 0;
  return r.reduce((s, x) => s + x.rating, 0) / r.length;
}

function _starsHTML(avg) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span style="color:${i <= Math.round(avg) ? '#F0B429' : '#ddd'};font-size:13px">${i <= Math.round(avg) ? '★' : '☆'}</span>`;
  }
  return html;
}

document.addEventListener('DOMContentLoaded', loadProductData);
