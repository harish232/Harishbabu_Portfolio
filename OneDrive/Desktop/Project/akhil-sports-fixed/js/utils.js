// ===== UTILITY FUNCTIONS =====

// Toast notifications
function showToastMsg(msg, icon = '<i class="fa-solid fa-circle-check"></i>') {
  const t = document.getElementById('toast');
  const toastIcon = document.getElementById('toast-item');
  const toastMsg = document.getElementById('toast-msg');
  if (!t || !toastIcon || !toastMsg) return;
  toastIcon.innerHTML = icon;
  toastMsg.innerHTML = ' ' + msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function safeRun(fn, fallback = null) {
  try {
    return fn();
  } catch (error) {
    console.error('Runtime error:', error);
    showToastMsg('Unexpected error occurred. Please try again.', '<i class="fa-solid fa-triangle-exclamation"></i>');
    return fallback;
  }
}

// LocalStorage helpers
const Storage = {
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Storage save failed for', key, error);
      showToastMsg('Unable to save data locally.', '⚠️');
    }
  },
  get: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Storage get failed for', key, error);
      showToastMsg('Unable to read saved data.', '⚠️');
      return null;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove failed for', key, error);
      showToastMsg('Unable to clear saved data.', '⚠️');
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear failed', error);
      showToastMsg('Unable to clear storage.', '⚠️');
    }
  }
};

// File reader for images
function readFileAsDataURL(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.readAsDataURL(file);
  });
}

// Toggle password visibility
function togglePass(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  if (inp.type === 'password') {
    inp.type = 'text';
    btn.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
  } else {
    inp.type = 'password';
    btn.innerHTML = '<i class="fa-regular fa-eye"></i>';
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return /^\d{10}$/.test(digits);
}

function validatePincode(pin) {
  return /^\d{5,6}$/.test(pin.trim());
}
