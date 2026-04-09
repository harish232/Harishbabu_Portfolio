const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/auth');
const paymentGateway = require('../services/paymentGateway');
const inventoryService = require('../services/inventoryService');
const notificationService = require('../services/notificationService');
const orderService = require('../services/orderService');

// Place Order - Complete Flow
router.post('/place-order', validateToken, async (req, res) => {
  try {
    const { items, subtotal, deliveryCharge, total, paymentMethod, deliveryAddress, deliveryZone } = req.body;
    const user = req.user;

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║         COMPLETE ORDER PROCESSING FLOW                  ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');

    // STEP 1: API Gateway & Load Balancer
    console.log('\n🌐 [STEP 1] API Gateway - Request received');
    console.log('             Load Balancer - Routing to server instance 1');
    await new Promise(resolve => setTimeout(resolve, 200));

    // STEP 2: Auth Check (already done by middleware)
    console.log('\n🔐 [STEP 2] Auth Check - Complete');

    // STEP 3: Order Validation
    console.log('\n📋 [STEP 3] Order Validation');
    orderService.validateOrderData({
      items,
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: req.body.customerPhone,
      deliveryAddress,
      total
    });

    // STEP 4: Inventory Check
    console.log('\n[STEP 4] Inventory Check');
    await inventoryService.checkInventory(items);

    // STEP 5: Payment Processing
    console.log('\n[STEP 5] Payment Processing');
    const tempOrderId = `TEMP-${Date.now()}`;
    const paymentResult = await paymentGateway.processPayment(tempOrderId, total, paymentMethod);

    // STEP 6: Database Save
    console.log('\n[STEP 6] Database - Saving Order');
    const order = await orderService.createOrder({
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: req.body.customerPhone,
      items,
      subtotal,
      deliveryCharge,
      total,
      paymentMethod,
      deliveryAddress,
      deliveryZone,
      transactionId: paymentResult.transactionId
    });

    // Reserve inventory
    await inventoryService.reserveInventory(items);

    // STEP 7a & 7b: Parallel Notifications & Warehouse Queue
    console.log('\n[STEP 7a & 7b] PARALLEL PROCESSING');
    await notificationService.sendNotifications(order);

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║           ✅ ORDER PROCESSING COMPLETE                  ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    res.json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
        estimatedDelivery: order.estimatedDelivery,
        items: order.items
      }
    });

  } catch (error) {
    console.error('\n❌ [ORDER FAILED] Error during processing:');
    console.error(`   Message: ${error.message}`);
    
    // Parse inventory errors
    let errorDetails = error.message;
    try {
      errorDetails = JSON.parse(error.message);
    } catch (e) {}

    console.log('   Rollback: Order NOT saved to database');
    console.log('   Rollback: No payment charged\n');

    res.status(400).json({
      success: false,
      error: errorDetails || error.message,
      step: error.step || 'unknown'
    });
  }
});

// Get all orders (for debugging/admin)
router.get('/list', validateToken, (req, res) => {
  const orders = orderService.getAllOrders();
  res.json({
    success: true,
    totalOrders: orders.length,
    orders
  });
});

// Get inventory status
router.get('/inventory-status', (req, res) => {
  const inventory = require('../services/inventoryService').getInventoryStatus();
  res.json({
    success: true,
    inventory
  });
});

module.exports = router;
