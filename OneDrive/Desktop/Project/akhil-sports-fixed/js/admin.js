// ===== ADMIN DASHBOARD =====

let editingProductId = null;
let tempImgs = [];

// Handle image upload
async function handleImgUpload(input) {
  const files = Array.from(input.files);
  for (const f of files) {
    if (tempImgs.length >= 5) { showToastMsg('Maximum 5 photos allowed', '<i class="fa-solid fa-triangle-exclamation"></i>'); break; }
    const url = await readFileAsDataURL(f);
    tempImgs.push(url);
  }
  input.value = '';
  renderImgGrid();
}

// Delete image from upload
function delImg(i) {
  tempImgs.splice(i, 1);
  renderImgGrid();
}

// Render image grid for product form
function renderImgGrid() {
  const grid = document.getElementById('img-grid');
  if (!grid) return;

  let html = '';

  if (tempImgs.length === 0) {
    html = `<label class="add-img-btn" style="width:100%;height:110px;border-radius:4px;flex-direction:column;gap:6px">
      <input type="file" accept="image/*" multiple onchange="handleImgUpload(this)"/>
      <span style="font-size:30px;color:var(--gray)"><i class="fa-solid fa-camera"></i></span>
      <span style="font-size:12px;color:var(--gray);font-weight:500">Click to add photos</span>
      <span style="font-size:11px;color:#aaa">JPG, PNG • Max 5 photos</span>
    </label>`;
  } else {
    tempImgs.forEach((url, i) => {
      html += `<div class="img-thumb">
        <img src="${url}" alt="product photo ${i + 1}"/>
        ${i === 0 ? `<div style="position:absolute;bottom:0;left:0;right:0;background:rgba(212,43,32,0.85);color:#fff;font-size:9px;font-weight:700;letter-spacing:1px;text-align:center;padding:2px 0;text-transform:uppercase">Main</div>` : ''}
        <button class="del-img" onclick="delImg(${i})"><i class="fa-solid fa-xmark"></i></button>
      </div>`;
    });
    if (tempImgs.length < 5) {
      html += `<label class="add-img-btn">
        <input type="file" accept="image/*" multiple onchange="handleImgUpload(this)"/>
        <span class="plus">+</span>
        <span class="addlbl">Add</span>
      </label>`;
    }
  }

  grid.innerHTML = html;
}

// Owner dashboard tabs
function ownerTab(tab) {
  document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
  const links = document.querySelectorAll('.sb-link');
  const tabMap = { overview: 0, orders: 1, products: 3, addproduct: 4, sales: 6, customers: 7, settings: 9 };
  if (links[tabMap[tab]]) links[tabMap[tab]].classList.add('active');

  const main = document.getElementById('owner-main');
  const totalRev = allOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = allOrders.length;

  if (tab === 'overview') {
    main.innerHTML = `
      <div class="dash-header"><h2>Overview</h2><span class="date">Today: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span></div>
      <div class="stats-row">
        <div class="stat-box"><div class="s-val">₹${totalRev.toLocaleString('en-IN')}</div><div class="s-lbl">Total Revenue</div><div class="s-chg up">↑ 18% this month</div></div>
        <div class="stat-box"><div class="s-val">${totalOrders}</div><div class="s-lbl">Total Orders</div><div class="s-chg up">↑ 5 new today</div></div>
        <div class="stat-box"><div class="s-val">${products.length}</div><div class="s-lbl">Products Listed</div><div class="s-chg up">↑ Active</div></div>
        <div class="stat-box"><div class="s-val">${customers.length}</div><div class="s-lbl">Customers</div><div class="s-chg up">↑ 2 new this week</div></div>
      </div>
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px">
        <div class="dash-panel">
          <h3>Recent Orders <a onclick="ownerTab('orders')">View all</a></h3>
          <table>
            <tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr>
            ${allOrders.slice(0, 5).map(o => `<tr>
              <td style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:14px">#${o.id}</td>
              <td>${o.cust}</td>
              <td style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700">₹${o.total.toLocaleString('en-IN')}</td>
              <td><span class="tbl-badge status-badge ${o.status}">${o.status}</span></td>
              <td style="color:var(--gray)">${o.date}</td>
            </tr>`).join('')}
          </table>
        </div>
        <div class="dash-panel">
          <h3>Weekly Sales</h3>
          <div class="chart-bars">
            ${[{ d: 'Mon', v: 3200 }, { d: 'Tue', v: 5100 }, { d: 'Wed', v: 2800 }, { d: 'Thu', v: 6400 }, { d: 'Fri', v: 4900 }, { d: 'Sat', v: 7200 }, { d: 'Sun', v: 3100 }].map(b => `
              <div class="bar-wrap">
                <div class="bar-val">₹${(b.v / 1000).toFixed(1)}k</div>
                <div class="bar" style="height:${Math.round(b.v / 80)}px"></div>
                <div class="bar-lbl">${b.d}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="dash-panel">
        <h3>Low Stock Alert</h3>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
          ${products.filter(p => p.stock < 15).slice(0, 4).map(p => `
            <div style="background:var(--light);border:1px solid var(--border);padding:14px;display:flex;align-items:center;gap:10px">
              ${p.imgs && p.imgs.length > 0
          ? `<img src="${p.imgs[0]}" style="width:32px;height:32px;object-fit:cover;border-radius:2px;flex-shrink:0"/>`
          : `<div style="width:32px;height:32px;background:#F9F8F5;border-radius:2px;flex-shrink:0;"></div>`}
              <div><div style="font-size:13px;font-weight:600">${p.name}</div><div style="font-size:12px;color:var(--red);font-weight:600">${p.stock} left</div></div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  else if (tab === 'orders') {
    main.innerHTML = `
      <div class="dash-header"><h2>All Orders</h2><span class="date">${allOrders.length} total orders</span></div>
      <div class="dash-panel">
        <h3>Orders</h3>
        <table>
          <tr><th>Order ID</th><th>Customer</th><th>Phone</th><th>Items</th><th>Location</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr>
          ${allOrders.map((o, i) => `<tr>
            <td style="font-family:'Barlow Condensed',sans-serif;font-weight:700">#${o.id}</td>
            <td>${o.cust}</td>
            <td style="color:var(--gray)">${o.phone}</td>
            <td style="font-size:12px;color:var(--gray);max-width:150px">${o.items}</td>
            <td style="font-size:12px;color:var(--gray)">${o.location || 'Bapatla'}</td>
            <td style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700">₹${o.total.toLocaleString('en-IN')}</td>
            <td>${o.pay}</td>
            <td><span class="tbl-badge status-badge ${o.status}">${o.status}</span></td>
            <td style="color:var(--gray)">${o.date}</td>
            <td>
              <select onchange="updateOrderStatus(${i},this.value)" style="border:1px solid var(--border);padding:4px 8px;font-size:12px;outline:none;cursor:pointer">
                <option ${o.status === 'pending' ? 'selected' : ''}>pending</option>
                <option ${o.status === 'processing' ? 'selected' : ''}>processing</option>
                <option ${o.status === 'shipped' ? 'selected' : ''}>shipped</option>
                <option ${o.status === 'delivered' ? 'selected' : ''}>delivered</option>
              </select>
            </td>
          </tr>`).join('')}
        </table>
      </div>`;
  }

  else if (tab === 'products') {
    main.innerHTML = `
      <div class="dash-header"><h2>Products</h2><button class="save-btn" onclick="ownerTab('addproduct')">+ Add Product</button></div>
      <div class="dash-panel">
        <h3>All Products (${products.length})</h3>
        <table>
          <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Badge</th><th>Actions</th></tr>
          ${products.map(p => `<tr>
            <td style="display:flex;align-items:center;gap:10px;padding:12px 10px">
              ${p.imgs && p.imgs.length > 0
              ? `<img src="${p.imgs[0]}" style="width:44px;height:44px;object-fit:cover;border:1px solid var(--border);flex-shrink:0"/>`
              : `<div style="width:44px;height:44px;background:#F9F8F5;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;"></div>`
            }
              <div><div style="font-weight:600;font-size:13px">${p.name}</div><div style="font-size:11px;color:var(--gray)">${p.sub}</div></div>
            </td>
            <td>${p.cat}</td>
            <td style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700">₹${p.price.toLocaleString('en-IN')}</td>
            <td><span style="color:${p.stock < 10 ? 'var(--red)' : p.stock < 20 ? '#a16207' : 'var(--green)'};font-weight:600">${p.stock}</span></td>
            <td>${p.badge ? `<span class="tbl-badge badge ${p.badge}">${p.badge}</span>` : '-'}</td>
            <td style="display:flex;gap:6px;padding:12px">
              <button onclick="editProduct(${p.id})" style="background:var(--dark);color:#fff;border:none;padding:6px 14px;font-size:12px;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:1px">EDIT</button>
              <button onclick="deleteProduct(${p.id})" style="background:transparent;color:var(--red);border:1px solid var(--red);padding:6px 12px;font-size:12px;cursor:pointer">✕</button>
            </td>
          </tr>`).join('')}
        </table>
      </div>`;
  }

  else if (tab === 'addproduct') {
    const ep = editingProductId ? products.find(p => p.id === editingProductId) : null;
    if (ep && ep.imgs && ep.imgs.length > 0 && tempImgs.length === 0) {
      tempImgs = [...ep.imgs];
    }
    main.innerHTML = `
      <div class="dash-header"><h2>${ep ? 'Edit Product' : 'Add Product'}</h2></div>
      <div class="prod-form">
        <h3>${ep ? 'Edit: ' + ep.name : 'New Product'}</h3>
        <div class="img-upload-section">
          <label class="img-upload-label">Product Photos <span style="color:#aaa;font-weight:400;font-size:10px">(Max 5 · First photo = main photo)</span></label>
          <div class="img-grid" id="img-grid"></div>
          <div class="img-note">Clear photos build customer trust.</div>
        </div>
        <div style="border-top:1px solid var(--border);margin-bottom:20px"></div>
        <div class="pf-grid">
          <div class="pf-group"><label>Product Name</label><input type="text" id="pf-name" value="${ep ? ep.name : ''}" placeholder="e.g. English Willow Bat"/></div>
          <div class="pf-group"><label>Sub Title</label><input type="text" id="pf-sub" value="${ep ? ep.sub : ''}" placeholder="e.g. Grade 1 · Full Size"/></div>
        </div>
        <div class="pf-grid full">
          <div class="pf-group"><label>Category</label>
            <select id="pf-cat">
              ${['Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis', 'Fitness', 'Running', 'Boxing', 'Swimming'].map(c => `<option ${ep && ep.cat === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="pf-grid">
          <div class="pf-group"><label>Price (₹)</label><input type="number" id="pf-price" value="${ep ? ep.price : ''}" placeholder="1499"/></div>
          <div class="pf-group"><label>Original Price (₹) — fill if discount applies</label><input type="number" id="pf-old" value="${ep && ep.old ? ep.old : ''}" placeholder="2000"/></div>
        </div>
        <div class="pf-grid">
          <div class="pf-group"><label>Stock Quantity</label><input type="number" id="pf-stock" value="${ep ? ep.stock : ''}" placeholder="20"/></div>
          <div class="pf-group"><label>Badge</label>
            <select id="pf-badge">
              <option value="" ${ep && !ep.badge ? 'selected' : ''}>None</option>
              <option value="new" ${ep && ep.badge === 'new' ? 'selected' : ''}>New</option>
              <option value="sale" ${ep && ep.badge === 'sale' ? 'selected' : ''}>Sale</option>
              <option value="hot" ${ep && ep.badge === 'hot' ? 'selected' : ''}>Hot</option>
            </select>
          </div>
        </div>
        <div class="pf-btns">
          <button class="save-btn" onclick="saveProduct()">${ep ? 'Update Product' : 'Save Product'}</button>
          <button class="cancel-btn" onclick="editingProductId=null;tempImgs=[];ownerTab('products')">Cancel</button>
        </div>
      </div>`;
    setTimeout(renderImgGrid, 0);
  }

  else if (tab === 'sales') {
    const delivered = allOrders.filter(o => o.status === 'delivered').length;
    const pending = allOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;
    const catSales = {};
    products.forEach(p => { if (!catSales[p.cat]) catSales[p.cat] = 0; catSales[p.cat] += p.price * 2; });
    main.innerHTML = `
      <div class="dash-header"><h2>Sales Report</h2><span class="date">All time</span></div>
      <div class="stats-row">
        <div class="stat-box"><div class="s-val">₹${totalRev.toLocaleString('en-IN')}</div><div class="s-lbl">Total Revenue</div></div>
        <div class="stat-box"><div class="s-val">${allOrders.length}</div><div class="s-lbl">Total Orders</div></div>
        <div class="stat-box"><div class="s-val">${delivered}</div><div class="s-lbl">Delivered</div></div>
        <div class="stat-box"><div class="s-val">${pending}</div><div class="s-lbl">Pending</div></div>
      </div>`;
  }

  else if (tab === 'customers') {
    main.innerHTML = `
      <div class="dash-header"><h2>Customers</h2><span class="date">${customers.length} registered</span></div>
      <div class="dash-panel">
        <h3>All Customers</h3>
        <table>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th></tr>
          ${customers.map(c => `<tr>
            <td style="font-weight:600">${c.name}</td>
            <td style="color:var(--gray)">${c.email}</td>
            <td style="color:var(--gray)">${c.phone || '-'}</td>
            <td style="font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700">${c.orders}</td>
            <td style="font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700">₹${c.spent.toLocaleString('en-IN')}</td>
          </tr>`).join('')}
        </table>
      </div>`;
  }

  else if (tab === 'settings') {
    main.innerHTML = `
      <div class="dash-header"><h2>Store Settings</h2></div>
      <div class="prod-form">
        <h3>Store Information</h3>
        <div class="pf-grid"><div class="pf-group"><label>Store Name</label><input type="text" value="Akhil Sports"/></div><div class="pf-group"><label>Owner Name</label><input type="text" value="Akhil"/></div></div>
        <div class="pf-grid"><div class="pf-group"><label>Phone</label><input type="tel" value="+91 98765 43210"/></div><div class="pf-group"><label>Email</label><input type="email" value="akhilsports@email.com"/></div></div>
        <div class="pf-grid full"><div class="pf-group"><label>Address</label><input type="text" value="Main Road, Bapatla, Andhra Pradesh - 522101"/></div></div>
        <div class="pf-grid"><div class="pf-group"><label>Delivery Charge (₹)</label><input type="number" value="60"/></div><div class="pf-group"><label>Free Delivery Above (₹)</label><input type="number" value="999"/></div></div>
        <div class=\"pf-btns\"><button class=\"save-btn\" onclick=\"showToastMsg('Settings saved!','✅')\">Save Settings</button></div>
      </div>`;
  }
}

// Update order status
function updateOrderStatus(idx, status) {
  allOrders[idx].status = status;
  Storage.save('allOrders', allOrders);
  showToastMsg(`Order status updated to ${status}`, '<i class="fa-solid fa-circle-check"></i>');
}

// Edit product
function editProduct(id) {
  editingProductId = id;
  tempImgs = [];
  ownerTab('addproduct');
}

// Delete product
function deleteProduct(id) {
  if (confirm('Delete this product?')) {
    products = products.filter(p => p.id !== id);
    Storage.save('products', products);
    showToastMsg('Product deleted', '<i class="fa-solid fa-trash"></i>');
    ownerTab('products');
  }
}

// Save product
function saveProduct() {
  const name = document.getElementById('pf-name').value.trim();
  const sub = document.getElementById('pf-sub').value.trim();
  const cat = document.getElementById('pf-cat').value;
  const price = parseInt(document.getElementById('pf-price').value);
  const oldVal = parseInt(document.getElementById('pf-old').value) || null;
  const stock = parseInt(document.getElementById('pf-stock').value) || 0;
  const badge = document.getElementById('pf-badge').value;
  if (!name || !price) { showToastMsg('Please fill Name and Price', '<i class="fa-solid fa-triangle-exclamation"></i>'); return; }
  if (editingProductId) {
    const idx = products.findIndex(p => p.id === editingProductId);
    products[idx] = { ...products[idx], name, sub, cat, price, old: oldVal, stock, badge, imgs: [...tempImgs] };
    editingProductId = null;
    tempImgs = [];
    Storage.save('products', products);
    showToastMsg('Product updated!', '<i class="fa-solid fa-circle-check"></i>');
  } else {
    const newId = Math.max(0, ...products.map(p => p.id)) + 1;
    products.push({ id: newId, name, sub, cat, price, old: oldVal, stock, badge, imgs: [...tempImgs] });
    tempImgs = [];
    Storage.save('products', products);
    showToastMsg('Product added!', '<i class="fa-solid fa-circle-check"></i>');
  }
  ownerTab('products');
  renderHomeProducts();
  renderShopProducts();
}
