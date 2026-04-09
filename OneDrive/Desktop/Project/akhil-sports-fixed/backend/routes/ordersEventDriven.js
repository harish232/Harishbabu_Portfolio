// Event-driven Order Processing API
// Publishes Order.Placed event to message queue
// All services subscribe and process in parallel

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const messageQueue = require('../services/messageQueue');

// Initialize mock database
const ordersDB = [];

// Import all subscriber services (they register their subscriptions on import)
require('../services/customerService');
require('../services/sellerService');
require('../services/deliveryService');
require('../services/adminService');
require('../services/inventoryServiceEvents');

// Initialize message queue topics
const initializeTopics = () => {
  messageQueue.createTopic('Order.Placed');
  messageQueue.createTopic('Order.Cancelled');
  messageQueue.createTopic('Order.Delivered');
  messageQueue.createTopic('Packing.Completed');
  messageQueue.createTopic('Payment.Processed');
};

initializeTopics();

/**
 * POST /api/orders/event-driven
 * 
 * Event-driven order processing flow:
 * 1. Validate order
 * 2. Process payment
 * 3. Publish Order.Placed event to message queue
 * 4. ALL SERVICES subscribe and execute in PARALLEL:
 *    - Customer Service: Sends email, SMS, notifications
 *    - Seller Service: Creates packing task, alerts
 *    - Delivery Service: Assigns delivery partner, creates pickup request
 *    - Admin Service: Updates analytics, generates reports
 *    - Inventory Service: AUTO-REDUCES STOCK
 */
router.post('/event-driven', async (req, res) => {
  try {
    const { customerId, items, deliveryAddress, customerEmail, customerPhone } = req.body;

    console.log('\n' + '='.repeat(80));
    console.log('🚀 [ORDER PROCESSING] New order received');
    console.log('='.repeat(80));

    // STEP 1: Validate order
    console.log('\n[STEP 1] VALIDATING ORDER');
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;
    console.log(`   Order ID: ${orderId}`);
    console.log(`   Items: ${items.length}`);
    console.log(`   Delivery: ${deliveryAddress}`);
    console.log('   ✅ Validation passed');

    // STEP 2: Calculate total and process payment
    console.log('\n[STEP 2] PROCESSING PAYMENT');
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;
    }
    console.log(`   Total: ₹${totalAmount}`);

    // Mock payment processing
    const paymentSuccess = Math.random() < 0.95; // 95% success rate
    if (!paymentSuccess) {
      console.log('   ❌ Payment FAILED (random failure)');
      return res.status(400).json({ 
        error: 'Payment declined. Please try again.',
        orderId 
      });
    }
    console.log('   ✅ Payment processed successfully');

    // Store order locally
    const orderRecord = {
      orderId,
      customerId,
      items,
      deliveryAddress,
      customerEmail,
      customerPhone,
      totalAmount,
      seller: 'akhilsports-main',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      paymentId: `PAY-${uuidv4().substring(0, 8).toUpperCase()}`
    };

    ordersDB.push(orderRecord);

    // STEP 3: PUBLISH ORDER.PLACED EVENT
    console.log('\n[STEP 3] PUBLISHING ORDER.PLACED EVENT');
    console.log('   🔔 Publishing to message queue...');
    console.log('   📡 Event being delivered to all subscribers SIMULTANEOUSLY...\n');

    // This is the key: Publish single event, multiple services subscribe
    await messageQueue.publish('Order.Placed', {
      orderId,
      customerId,
      items,
      totalAmount,
      deliveryAddress,
      customerEmail,
      customerPhone,
      seller: 'akhilsports-main',
      timestamp: new Date().toISOString()
    });

    // STEP 4: Simulate packing completion after a delay
    setTimeout(() => {
      messageQueue.publish('Packing.Completed', {
        orderId,
        completedAt: new Date().toISOString(),
        partnerId: `DP-${Math.floor(Math.random() * 1000) + 1000}`
      });
    }, 2000);

    console.log('\n' + '='.repeat(80));
    console.log('✅ ORDER PROCESSING COMPLETE');
    console.log('='.repeat(80) + '\n');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully and event published!',
      orderId,
      totalAmount,
      paymentId: orderRecord.paymentId,
      deliveryPartner: 'Assigned automatically',
      notificationSent: true,
      note: 'All services (Customer, Seller, Delivery, Admin, Inventory) are processing in parallel'
    });

  } catch (error) {
    console.error('❌ Order processing error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/orders/event-log
 * View all events published to the message queue
 */
router.get('/event-log', (req, res) => {
  const log = messageQueue.getEventLog();
  res.json({
    totalEvents: log.length,
    events: log.slice(-20) // Last 20 events
  });
});

/**
 * GET /api/orders/event-stats
 * View message queue statistics
 */
router.get('/event-stats', (req, res) => {
  const stats = messageQueue.getTopicStats();
  res.json({
    topics: stats,
    totalEvents: messageQueue.getEventLog().length
  });
});

/**
 * GET /api/orders/list
 * View all placed orders
 */
router.get('/list', (req, res) => {
  res.json({
    totalOrders: ordersDB.length,
    orders: ordersDB
  });
});

module.exports = router;
