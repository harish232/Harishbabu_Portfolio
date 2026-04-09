// Inventory Service Subscriber & Manager
// Handles: Auto-reducing stock when order is placed
// This is a CRITICAL service - ensures real-time inventory accuracy
const messageQueue = require('./messageQueue');

// In-memory inventory database
const inventory = {
  'tennis-racket': { name: 'Professional Tennis Racket', available: 0, reserved: 0 },
  'cricket-bat': { name: 'Cricket Bat - Premium', available: 50, reserved: 0 },
  'football': { name: 'Football - Official Match', available: 100, reserved: 0 },
  'basketball': { name: 'Basketball Pro', available: 75, reserved: 0 },
  'badminton-shuttles': { name: 'Badminton Shuttles Pack', available: 200, reserved: 0 },
  'table-tennis-paddle': { name: 'Table Tennis Paddle', available: 60, reserved: 0 }
};

const inventoryLog = [];

// Stock reservation history for audit trail
const reservationHistory = [];

// Subscribe to Order.Placed event
messageQueue.subscribe('Order.Placed', 'InventoryService', async (message, eventId) => {
  const { orderId, items } = message;
  
  console.log(`\n    📊 [INVENTORY SERVICE] Processing Order ${orderId}`);
  console.log(`      🔴 CRITICAL: Auto-reducing stock for ordered items...`);
  
  // Process each item in the order
  for (const item of items) {
    const productId = item.id;
    
    if (inventory[productId]) {
      const beforeStock = inventory[productId].available;
      const afterStock = beforeStock - item.quantity;
      
      inventory[productId].available = Math.max(0, afterStock);
      inventory[productId].reserved += item.quantity;
      
      // Log the change
      const logEntry = {
        orderId,
        productId,
        productName: item.name,
        quantityOrdered: item.quantity,
        beforeStock,
        afterStock: inventory[productId].available,
        timestamp: new Date().toISOString(),
        action: 'order_placed'
      };
      
      inventoryLog.push(logEntry);
      reservationHistory.push({
        orderId,
        productId,
        quantity: item.quantity,
        status: 'reserved',
        timestamp: new Date().toISOString()
      });
      
      console.log(`      📉 ${item.name}`);
      console.log(`         Before: ${beforeStock} | Ordered: ${item.quantity} | After: ${afterStock}`);
      console.log(`         Status: STOCK REDUCED ✅`);
    }
  }
  
  console.log(`    ✅ [INVENTORY SERVICE] Inventory updated for Order ${orderId}`);
  console.log(`       Next customer won't see incorrect stock info ✓`);
});

// Subscribe to Order.Cancelled event
messageQueue.subscribe('Order.Cancelled', 'InventoryService', async (message, eventId) => {
  const { orderId, items } = message;
  
  console.log(`\n    📊 [INVENTORY SERVICE] Order cancelled: ${orderId}`);
  
  // Restore stock
  for (const item of items) {
    if (inventory[item.id]) {
      inventory[item.id].available += item.quantity;
      inventory[item.id].reserved -= item.quantity;
      
      console.log(`      📈 Restored ${item.quantity}x ${item.name}`);
    }
  }
  
  console.log(`    ✅ [INVENTORY SERVICE] Stock restored for cancelled Order ${orderId}`);
});

// Subscribe to Delivery.Completed event
messageQueue.subscribe('Delivery.Completed', 'InventoryService', async (message, eventId) => {
  const { orderId, items } = message;
  
  console.log(`\n    📊 [INVENTORY SERVICE] Delivery completed: ${orderId}`);
  
  // Move from reserved to delivered/sold
  for (const item of items) {
    if (inventory[item.id]) {
      inventory[item.id].reserved -= item.quantity;
      console.log(`      ✓ ${item.name} moved from reserved to delivered`);
    }
  }
  
  console.log(`    ✅ [INVENTORY SERVICE] Inventory finalized for delivered Order ${orderId}`);
});

// Get current inventory status
const getInventoryStatus = () => {
  const status = {};
  for (const [productId, data] of Object.entries(inventory)) {
    status[productId] = {
      name: data.name,
      available: data.available,
      reserved: data.reserved,
      total: data.available + data.reserved
    };
  }
  return status;
};

// Get a product's current availability
const getProductAvailability = (productId) => {
  if (inventory[productId]) {
    return {
      productId,
      name: inventory[productId].name,
      inStock: inventory[productId].available > 0,
      available: inventory[productId].available,
      reserved: inventory[productId].reserved
    };
  }
  return null;
};

module.exports = {
  inventory,
  inventoryLog,
  reservationHistory,
  getInventoryStatus,
  getProductAvailability
};
