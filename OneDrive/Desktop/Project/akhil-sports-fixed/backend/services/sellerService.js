// Seller Service Subscriber
// Handles: Dashboard alerts, Packing prompts, Real-time notifications
const messageQueue = require('./messageQueue');

const sellerOrders = new Map(); // seller -> orders
const sellerAlerts = [];

// Seller Dashboard Service
const sellerDashboardService = {
  async updateOrder(orderId, status, data = {}) {
    console.log(`   📊 SELLER DASHBOARD updated for Order ${orderId}`);
    console.log(`      Status: ${status}`);
    return true;
  }
};

// Packing System / Warehouse Management
const packingService = {
  async createPackingTask(orderId, items, priority = 'normal') {
    console.log(`   📦 PACKING TASK created for Order ${orderId}`);
    console.log(`      Items: ${items.map(i => `${i.name} x${i.quantity}`).join(', ')}`);
    console.log(`      Priority: ${priority}`);
    return {
      taskId: `PKG-${orderId}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  }
};

// Real-time Notification Service for Sellers
const sellerNotificationService = {
  notifications: new Map(),
  
  async send(sellerId, notification) {
    console.log(`   🔴 SELLER ALERT to ${sellerId}`);
    console.log(`      Message: ${notification.message}`);
    
    if (!this.notifications.has(sellerId)) {
      this.notifications.set(sellerId, []);
    }
    this.notifications.get(sellerId).push({
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    });
    return true;
  }
};

// Subscribe to Order.Placed event
messageQueue.subscribe('Order.Placed', 'SellerService', async (message, eventId) => {
  const { orderId, seller, items, totalAmount } = message;
  
  console.log(`\n    🏪 [SELLER SERVICE] Processing Order ${orderId}`);
  
  // 1. Update seller dashboard
  await sellerDashboardService.updateOrder(orderId, 'new_order_received', {
    itemCount: items.length,
    totalAmount
  });

  // 2. Create packing task (HIGH PRIORITY if large order)
  const priority = totalAmount > 5000 ? 'high' : 'normal';
  const packingTask = await packingService.createPackingTask(orderId, items, priority);

  // 3. Send seller alert - "New Order! Start Packing"
  await sellerNotificationService.send(seller, {
    type: 'new_order',
    title: '🚨 NEW ORDER ALERT!',
    message: `Order #${orderId} received! Items: ${items.map(i => i.name).join(', ')}. Amount: ₹${totalAmount}. START PACKING NOW!`,
    priority,
    orderData: { orderId, items, totalAmount }
  });

  // 4. Store for seller tracking
  if (!sellerOrders.has(seller)) {
    sellerOrders.set(seller, []);
  }
  sellerOrders.get(seller).push({
    orderId,
    status: 'packing_needed',
    items,
    totalAmount,
    timestamp: new Date().toISOString()
  });

  console.log(`    ✅ [SELLER SERVICE] Packing task created for Order ${orderId}`);
});

module.exports = {
  sellerOrders,
  sellerAlerts,
  sellerDashboardService,
  packingService,
  sellerNotificationService
};
