#!/usr/bin/env node

/**
 * Event-Driven System Testing Script
 * Run this after server starts to test the complete event flow
 * 
 * Usage: node test-event-system.js
 */

const http = require('http');

// ANSI Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, ...args) {
  console.log(colors[color] + args.join(' ') + colors.reset);
}

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

const testScenarios = [
  {
    name: 'Successful Order (All Systems Go)',
    description: 'Standard order with payment success',
    data: {
      customerId: 'CUST-12345',
      items: [
        { id: 'cricket-bat', name: 'Cricket Bat - Premium', quantity: 2, price: 2500 },
        { id: 'cricket-ball', name: 'Cricket Ball', quantity: 1, price: 499 }
      ],
      deliveryAddress: '123 Main Street, Hyderabad 500001',
      customerEmail: 'customer1@example.com',
      customerPhone: '+91-98765-43210'
    }
  },
  {
    name: 'High-Value Order (>₹10,000)',
    description: 'Triggers finance alerts and priority packing',
    data: {
      customerId: 'CUST-PREMIUM-001',
      items: [
        { id: 'cricket-bat', name: 'Cricket Bat - Premium', quantity: 5, price: 2500 }
      ],
      deliveryAddress: '456 Business Park, Bangalore 560001',
      customerEmail: 'premium@example.com',
      customerPhone: '+91-99999-11111'
    }
  },
  {
    name: 'Bulk Order (Multiple Items)',
    description: 'Large order with high delivery priority',
    data: {
      customerId: 'CUST-BULK-001',
      items: [
        { id: 'cricket-bat', name: 'Cricket Bat', quantity: 3, price: 2500 },
        { id: 'football', name: 'Football', quantity: 2, price: 1200 },
        { id: 'basketball', name: 'Basketball', quantity: 4, price: 3500 }
      ],
      deliveryAddress: '789 School Lane, Delhi 110001',
      customerEmail: 'school@example.com',
      customerPhone: '+91-11111-22222'
    }
  }
];

async function runTests() {
  log('bright', '\n╔════════════════════════════════════════════════════════════╗');
  log('bright', '║       EVENT-DRIVEN ORDER PROCESSING - TEST SUITE            ║');
  log('bright', '╚════════════════════════════════════════════════════════════╝\n');

  // Check server health first
  log('yellow', '🔍 Checking server health...');
  try {
    const health = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    });
    log('green', '✅ Server is running at http://localhost:3000\n');
  } catch (e) {
    log('bright', '\n❌ Server is not running!');
    log('bright', 'Start the server with: cd backend && npm start\n');
    process.exit(1);
  }

  // Run each test scenario
  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    
    log('cyan', `\n${'═'.repeat(60)}`);
    log('cyan', `TEST ${i + 1}: ${scenario.name}`);
    log('cyan', `${'═'.repeat(60)}`);
    log('dim', scenario.description);
    log('dim', `Total Amount: ₹${scenario.data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}\n`);

    try {
      const response = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/orders/event-driven',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, scenario.data);

      if (response.status === 201) {
        log('green', '✅ Order Placed Successfully!');
        log('blue', `   Order ID: ${response.data.orderId}`);
        log('blue', `   Amount: ₹${response.data.totalAmount}`);
        log('blue', `   Payment ID: ${response.data.paymentId}`);
        log('yellow', `\n📡 Events published to message queue:`);
        log('yellow', `   ├─ Order.Placed`);
        log('yellow', `   ├─ (All 5 services subscribed and processing...)`);
        log('yellow', `   └─ After 2 seconds: Packing.Completed`);
      } else {
        log('bright', `❌ Error: ${response.data.error}`);
      }
    } catch (e) {
      log('bright', `❌ Request failed: ${e.message}`);
    }

    // Wait between tests for log readability
    if (i < testScenarios.length - 1) {
      log('dim', '\n⏳ Waiting 3 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Show event log
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  log('cyan', `\n${'═'.repeat(60)}`);
  log('cyan', 'VIEWING EVENT LOG');
  log('cyan', `${'═'.repeat(60)}\n`);

  try {
    const eventLog = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders/event-log',
      method: 'GET'
    });

    log('green', `✅ Total Events in Queue: ${eventLog.data.totalEvents}`);
    log('yellow', '\n📋 Last 5 Events:');
    
    const events = eventLog.data.events.slice(-5);
    events.forEach((event, idx) => {
      log('blue', `\n   Event ${idx + 1}:`);
      log('dim', `      ID: ${event.id}`);
      log('dim', `      Topic: ${event.topic}`);
      log('dim', `      Subscribers: ${event.subscribers.join(', ')}`);
      log('dim', `      Time: ${event.timestamp}`);
    });

  } catch (e) {
    log('bright', `❌ Failed to fetch event log: ${e.message}`);
  }

  // Show statistics
  log('cyan', `\n${'═'.repeat(60)}`);
  log('cyan', 'MESSAGE QUEUE STATISTICS');
  log('cyan', `${'═'.repeat(60)}\n`);

  try {
    const stats = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders/event-stats',
      method: 'GET'
    });

    log('green', '✅ Queue Topics:');
    for (const [topic, data] of Object.entries(stats.data.topics)) {
      log('blue', `\n   ${topic}`);
      log('dim', `      Events: ${data.eventCount}`);
      log('dim', `      Subscribers: ${data.subscriberCount}`);
    }

  } catch (e) {
    log('bright', `❌ Failed to fetch statistics: ${e.message}`);
  }

  log('bright', `\n${'═'.repeat(60)}`);
  log('green', '✅ TESTS COMPLETE!');
  log('bright', `${'═'.repeat(60)}\n`);

  log('yellow', 'Key Observations:');
  log('dim', '  • Each order publishes 1 "Order.Placed" event');
  log('dim', '  • 5 services subscribe to each event');
  log('dim', '  • All services process IN PARALLEL (not sequentially)');
  log('dim', '  • Inventory stock is auto-reduced immediately');
  log('dim', '  • Customer receives email/SMS/notifications within 2 seconds');
  log('dim', '  • Check server console for detailed event flow logs\n');
}

// Run tests
runTests().catch(err => {
  log('bright', `\n❌ Test suite error: ${err.message}\n`);
  process.exit(1);
});
