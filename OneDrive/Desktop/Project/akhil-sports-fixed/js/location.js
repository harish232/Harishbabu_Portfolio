// ===== LOCATION & DELIVERY MANAGEMENT =====

const mandalData = {
  'Bapatla': [
    { name: 'Bapatla', pin: '522101', zone: 'local' },
    { name: 'Chirala', pin: '523155', zone: 'local' },
    { name: 'Repalle', pin: '522265', zone: 'local' },
    { name: 'Addanki', pin: '523201', zone: 'local' },
    { name: 'Vetapalem', pin: '523187', zone: 'local' },
    { name: 'Inkollu', pin: '523167', zone: 'local' },
    { name: 'Karamchedu', pin: '523116', zone: 'local' },
    { name: 'Vemuru', pin: '522261', zone: 'local' },
    { name: 'Nagaram', pin: '522268', zone: 'local' },
  ],
  'Guntur': [
    { name: 'Guntur City', pin: '522001', zone: 'nearby' },
    { name: 'Tenali', pin: '522201', zone: 'nearby' },
    { name: 'Narasaraopet', pin: '522601', zone: 'nearby' },
    { name: 'Mangalagiri', pin: '522503', zone: 'nearby' },
    { name: 'Ponnur', pin: '522124', zone: 'nearby' },
    { name: 'Sattenapalle', pin: '522403', zone: 'nearby' },
    { name: 'Piduguralla', pin: '522413', zone: 'nearby' },
  ],
  'Krishna': [
    { name: 'Vijayawada', pin: '520001', zone: 'nearby' },
    { name: 'Machilipatnam', pin: '521001', zone: 'nearby' },
    { name: 'Gudivada', pin: '521301', zone: 'nearby' },
    { name: 'Nuzvid', pin: '521201', zone: 'nearby' },
    { name: 'Gannavaram', pin: '521102', zone: 'nearby' },
  ],
  'Prakasam': [
    { name: 'Ongole', pin: '523001', zone: 'nearby' },
    { name: 'Markapur', pin: '523316', zone: 'nearby' },
    { name: 'Kandukur', pin: '523105', zone: 'nearby' },
    { name: 'Giddalur', pin: '523357', zone: 'nearby' },
  ],
  'Nellore': [
    { name: 'Nellore City', pin: '524001', zone: 'far' },
    { name: 'Gudur', pin: '524101', zone: 'far' },
    { name: 'Kavali', pin: '524201', zone: 'far' },
  ],
  'Hyderabad': [
    { name: 'Hyderabad City', pin: '500001', zone: 'far' },
    { name: 'Secunderabad', pin: '500003', zone: 'far' },
    { name: 'Kukatpally', pin: '500072', zone: 'far' },
    { name: 'LB Nagar', pin: '500074', zone: 'far' },
  ],
  'Vijayawada': [
    { name: 'Vijayawada Central', pin: '520001', zone: 'nearby' },
    { name: 'Benz Circle', pin: '520010', zone: 'nearby' },
    { name: 'Kanuru', pin: '520007', zone: 'nearby' },
  ],
  'Vishakhapatnam': [
    { name: 'Visakhapatnam City', pin: '530001', zone: 'far' },
    { name: 'Gajuwaka', pin: '530026', zone: 'far' },
    { name: 'Bheemunipatnam', pin: '531163', zone: 'far' },
  ],
  'Tirupati': [
    { name: 'Tirupati City', pin: '517501', zone: 'far' },
    { name: 'Tiruchanur', pin: '517503', zone: 'far' },
  ],
  'Other': [
    { name: 'Other Location', pin: '', zone: 'far' },
  ]
};

const zoneInfo = {
  local: { label: '🟢 Free Delivery', sub: 'Bapatla District — Free delivery!', charge: 0, color: '#dcfce7', textColor: '#166534', days: '1-2 days' },
  nearby: { label: '🟡 ₹60 Delivery', sub: 'AP Nearby — Standard delivery charge', charge: 60, color: '#fef9c3', textColor: '#854d0e', days: '2-3 days' },
  far: { label: '🔴 ₹120 Delivery', sub: 'Distant location — Extra delivery charge', charge: 120, color: '#fee2e2', textColor: '#991b1b', days: '3-5 days' },
};

let currentDeliveryZone = 'local';
let savedAddresses = [];

// Update mandals for selected district
function updateMandals() {
  const dist = document.getElementById('co-district').value;
  const mandalSel = document.getElementById('co-mandal');
  mandalSel.innerHTML = '<option value="">-- Select Mandal --</option>';
  document.getElementById('delivery-zone-badge').style.display = 'none';
  document.getElementById('co-pin').value = '';
  document.getElementById('co-city').value = dist;
  currentDeliveryZone = 'local';
  if (!dist || !mandalData[dist]) return;
  mandalData[dist].forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.name;
    opt.dataset.pin = m.pin;
    opt.dataset.zone = m.zone;
    opt.textContent = m.name + (m.pin ? ' — ' + m.pin : '');
    mandalSel.appendChild(opt);
  });
}

// Update pincode and delivery zone
function updatePincode() {
  const mandalSel = document.getElementById('co-mandal');
  const sel = mandalSel.options[mandalSel.selectedIndex];
  if (!sel || !sel.dataset.pin) return;
  document.getElementById('co-pin').value = sel.dataset.pin;
  document.getElementById('co-city').value = sel.value;
  const zone = sel.dataset.zone || 'local';
  currentDeliveryZone = zone;
  const zi = zoneInfo[zone];
  const badge = document.getElementById('delivery-zone-badge');
  badge.style.display = 'block';
  badge.innerHTML = `<div style="background:${zi.color};border:1px solid ${zi.textColor}33;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px">
    <div>
      <div style="font-size:13px;font-weight:700;color:${zi.textColor}">${zi.label}</div>
      <div style="font-size:11px;color:${zi.textColor};opacity:.8;margin-top:2px">${zi.sub} · Delivery: ${zi.days}</div>
    </div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;color:${zi.textColor}">${zi.charge === 0 ? 'FREE' : '₹' + zi.charge}</div>
  </div>`;
  renderCheckoutSummary();
}

// Get delivery charge
function getDeliveryCharge() {
  const sub = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const zi = zoneInfo[currentDeliveryZone] || zoneInfo['local'];
  if (currentDeliveryZone === 'local' && sub >= 999) return 0;
  return zi.charge;
}

// Render saved addresses
function renderSavedAddresses() {
  const el = document.getElementById('saved-addr-section');
  if (!el) return;
  if (savedAddresses.length === 0) {
    el.innerHTML = `<div style="padding:12px 14px;background:#fafafa;border:1px dashed var(--border);font-size:13px;color:var(--gray);display:flex;align-items:center;gap:8px"><i class="fa-regular fa-address-book" style="font-size:16px"></i> No address saved yet. Please fill the details below.</div>`;
    return;
  }
  el.innerHTML = `<div style="margin-bottom:4px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--gray)">Saved Addresses</div>` +
    savedAddresses.map((a, i) => `
    <div class="saved-addr-card" id="saved-addr-${i}" onclick="selectSavedAddr(${i})" style="border:2px solid var(--border);padding:14px;margin-bottom:8px;cursor:pointer;transition:border-color .2s;background:#fff;display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
      <div style="display:flex;gap:10px;align-items:flex-start">
        <span style="font-size:16px;margin-top:2px;color:var(--dark)"><i class="fa-solid fa-house-chimney"></i></span>
        <div>
          <div style="font-size:13px;font-weight:600;margin-bottom:2px">${a.name} · ${a.phone}</div>
          <div style="font-size:12px;color:var(--gray);line-height:1.5">${a.addr}, ${a.city}, ${a.district} — ${a.pin}</div>
          <div style="font-size:11px;margin-top:4px;color:${zoneInfo[a.zone]?.textColor || '#555'};font-weight:600">${zoneInfo[a.zone]?.label || ''}</div>
        </div>
      </div>
      <button onclick="event.stopPropagation();deleteSavedAddr(${i})" style="background:none;border:none;color:var(--gray);cursor:pointer;font-size:14px;padding:2px 6px" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
    </div>`).join('') +
    `<div style="font-size:12px;color:var(--gray);margin-bottom:14px;padding:10px 0;border-top:1px dashed var(--border)"><i class="fa-solid fa-plus"></i> <a onclick="clearAddrForm()" style="color:var(--red);cursor:pointer;font-weight:600">Add New Address</a></div>`;
}

// Select saved address
function selectSavedAddr(i) {
  const a = savedAddresses[i];
  document.querySelectorAll('.saved-addr-card').forEach((el, j) => {
    el.style.borderColor = j === i ? 'var(--dark)' : 'var(--border)';
    el.style.background = j === i ? '#f9f8f5' : '#fff';
  });
  document.getElementById('co-fname').value = a.name.split(' ')[0] || '';
  document.getElementById('co-lname').value = a.name.split(' ').slice(1).join(' ') || '';
  document.getElementById('co-phone').value = a.phone;
  document.getElementById('co-addr').value = a.addr;
  document.getElementById('co-city').value = a.city;
  document.getElementById('co-pin').value = a.pin;
  const distSel = document.getElementById('co-district');
  distSel.value = a.district;
  updateMandals();
  const mandalSel = document.getElementById('co-mandal');
  for (let o of mandalSel.options) { if (o.value === a.mandal) { mandalSel.value = a.mandal; break; } }
  currentDeliveryZone = a.zone || 'local';
  updatePincode();
  showToastMsg('Address selected!', '<i class="fa-solid fa-location-dot"></i>');
}

// Delete saved address
function deleteSavedAddr(i) {
  savedAddresses.splice(i, 1);
  Storage.save('savedAddresses', savedAddresses);
  renderSavedAddresses();
}

// Clear address form
function clearAddrForm() {
  document.getElementById('co-fname').value = '';
  document.getElementById('co-lname').value = '';
  document.getElementById('co-phone').value = '';
  document.getElementById('co-addr').value = '';
  document.getElementById('co-city').value = '';
  document.getElementById('co-pin').value = '';
  document.getElementById('co-district').value = '';
  document.getElementById('co-mandal').innerHTML = '<option value="">-- Select Mandal --</option>';
  document.getElementById('delivery-zone-badge').style.display = 'none';
  document.querySelectorAll('.saved-addr-card').forEach(el => { el.style.borderColor = 'var(--border)'; el.style.background = '#fff'; });
  currentDeliveryZone = 'local';
}
