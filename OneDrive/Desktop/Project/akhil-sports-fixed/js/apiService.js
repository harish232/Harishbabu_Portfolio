// ===== API SERVICE - Backend Integration =====

// Live Backend URL (Render nunchi copy cheskunna link ikkada pettu)
const API_BASE_URL = 'https://REPLACE_THIS_WITH_YOUR_RENDER_URL.onrender.com/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken') || null;
  }

  // Get authorization headers
  getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Auth: Login
  async login(email, password) {
    try {
      console.log('🔐 [API] Logging in...');
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (result.success) {
        this.token = result.token;
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        console.log('✅ [API] Login successful');
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ [API] Login failed:', error.message);
      throw error;
    }
  }

  // Auth: Register
  async register(name, email, password) {
    try {
      console.log('📝 [API] Registering...');
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({ name, email, password })
      });

      const result = await response.json();
      if (result.success) {
        this.token = result.token;
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        console.log('✅ [API] Registration successful');
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ [API] Registration failed:', error.message);
      throw error;
    }
  }

  // Orders: Place Order (complete flow)
  async placeOrder(orderData) {
    try {
      console.log('\n📤 [API] Sending order to server...');
      const response = await fetch(`${API_BASE_URL}/orders/place-order`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ [API] Order placed successfully:', result.order.id);
        return result;
      } else {
        console.error('❌ [API] Order failed:', result.error);
        throw new Error(typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
      }
    } catch (error) {
      console.error('❌ [API] Order submission failed:', error.message);
      throw error;
    }
  }

  // Orders: Get list
  async getOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/list`, {
        method: 'GET',
        headers: this.getHeaders(true)
      });

      const result = await response.json();
      return result.orders || [];
    } catch (error) {
      console.error('❌ [API] Failed to fetch orders:', error.message);
      return [];
    }
  }

  // Orders: Check inventory
  async getInventoryStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/inventory-status`, {
        method: 'GET',
        headers: this.getHeaders(false)
      });

      const result = await response.json();
      return result.inventory || {};
    } catch (error) {
      console.error('❌ [API] Failed to fetch inventory:', error.message);
      return {};
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Logout
  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }
}

// Global API instance
const api = new ApiService();
