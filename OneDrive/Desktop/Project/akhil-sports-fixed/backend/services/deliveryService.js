// Delivery Partner Service Subscriber
// Handles: Pickup requests, Address info, ETA calculation, Route optimization
const messageQueue = require('./messageQueue');

const pickupRequests = [];

// Route Optimization Service
const routeService = {
  async calculateETA(pickupLocation, deliveryLocation) {
    // Mock ETA calculation (30-120 minutes based on distance mock)
    const eta = Math.floor(Math.random() * 90) + 30; // 30-120 mins
    return eta;
  }
};

// Pickup Assignment Service
const pickupAssignmentService = {
  async assignPickup(orderId, itemCount) {
    // Mock partner assignment (randomly assign partner ID)
    const partnerId = `DP-${Math.floor(Math.random() * 1000) + 1000}`;
    return partnerId;
  }
};

// Delivery Partner Notification Service
const deliveryNotificationService = {
  notifications: new Map(),
  
  async sendPickupRequest(partnerId, request) {
    console.log(`   🚛 DELIVERY PARTNER ${partnerId} PICKUP REQUEST`);
    console.log(`      Order: ${request.orderId}`);
    console.log(`      Pickup Address: ${request.pickupAddress}`);
    console.log(`      Delivery Address: ${request.deliveryAddress}`);
    console.log(`      Items Count: ${request.itemCount}`);
    console.log(`      ETA: ${request.eta} minutes`);
    
    if (!this.notifications.has(partnerId)) {
      this.notifications.set(partnerId, []);
    }
    this.notifications.get(partnerId).push({
      type: 'pickup_request',
      ...request,
      status: 'pending_acceptance',
      timestamp: new Date().toISOString()
    });
    return true;
  }
};

// Subscribe to Order.Placed event
messageQueue.subscribe('Order.Placed', 'DeliveryService', async (message, eventId) => {
  const { orderId, customerId, customerPhone, deliveryAddress, items } = message;
  
  console.log(`\n    🚚 [DELIVERY SERVICE] Processing Order ${orderId}`);
  
  // 1. Calculate ETA
  const eta = await routeService.calculateETA('warehouse_main', deliveryAddress);
  
  // 2. Assign delivery partner
  const partnerId = await pickupAssignmentService.assignPickup(orderId, items.length);
  
  // 3. Create pickup request with detailed info
  const pickupRequest = {
    orderId,
    partnerId,
    customerId,
    customerPhone,
    pickupAddress: 'Akhil Sports Warehouse, Hyderabad Main',
    deliveryAddress,
    itemCount: items.length,
    itemDetails: items.map(i => ({ name: i.name, quantity: i.quantity })),
    eta,
    priority: items.length > 3 ? 'high' : 'normal',
    specialInstructions: '',
    createdAt: new Date().toISOString()
  };
  
  pickupRequests.push(pickupRequest);
  
  // 4. Send pickup request to delivery partner app
  await deliveryNotificationService.sendPickupRequest(partnerId, pickupRequest);
  
  console.log(`    ✅ [DELIVERY SERVICE] Pickup assigned to ${partnerId} | ETA: ${eta} mins`);
});

// Subscribe to when packing is complete - send delivery ready event
messageQueue.subscribe('Packing.Completed', 'DeliveryService', async (message, eventId) => {
  const { orderId, partnerId } = message;
  
  console.log(`\n    🚛 [DELIVERY SERVICE] Packing completed for Order ${orderId}`);
  
  // Update pickup request status
  const request = pickupRequests.find(r => r.orderId === orderId);
  if (request) {
    request.status = 'ready_for_pickup';
    console.log(`      ✅ Pickup request ${orderId} marked as READY_FOR_PICKUP`);
    
    // Send updated notification to partner
    await deliveryNotificationService.sendPickupRequest(partnerId, {
      ...request,
      status: 'ready_for_pickup',
      message: 'Order ready for pickup! Start heading to warehouse.'
    });
  }
});

module.exports = {
  pickupRequests,
  routeService,
  pickupAssignmentService,
  deliveryNotificationService
};
