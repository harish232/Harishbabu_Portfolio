const EventEmitter = require('events');
const realEmailService = require('./emailService'); // 👈 Import Real Email Service
const messageQueue = require('./messageQueue');

class NotificationService extends EventEmitter {
  async sendNotifications(order) {
    console.log('🔔 [NOTIFICATIONS] Sending parallel notifications...');
    
    // Parallel execution - Email and SMS at the same time
    await Promise.all([
      this.sendEmail(order),
      this.sendSMS(order),
      this.addToWarehouseQueue(order)
    ]);

    console.log('✅ [NOTIFICATIONS] All notifications sent');
    return true;
  }

  async sendEmail(order) {
    try {
      // Send real email using the Nodemailer service we created
      await realEmailService.sendOrderConfirmation(
        order.customerEmail,
        order.customerName,
        order.id,
        order.total
      );
      console.log(`  📧 [EMAIL] REAL Order confirmation sent to ${order.customerEmail}`);
    } catch (error) {
      console.log(`  ⚠️ [EMAIL] Real email failed (Please check .env credentials)`);
    }
  }

  async sendSMS(order) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`  📱 [SMS] Notification sent to ${order.customerPhone}`);
        console.log(`     "Order #${order.id} placed. Amount: ₹${order.total}. Expected delivery: ${order.estimatedDelivery}"`);
        resolve();
      }, 250);
    });
  }

  async addToWarehouseQueue(order) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`  🏭 [WAREHOUSE] Order added to fulfillment queue`);
        console.log(`     Queue ID: Q-${order.id}`);
        console.log(`     Items: ${order.items.map(i => i.qty + 'x ' + i.name).join(', ')}`);
        console.log(`     Delivery Address: ${order.deliveryAddress.city}`);
        resolve();
      }, 200);
    });
  }
}

// Subscribe to Wishlist Sale Alerts
messageQueue.subscribe('Product.OnSale', 'NotificationService', async (message, eventId) => {
  const { productId, productName, newPrice, oldPrice, interestedUsers } = message;
  
  console.log(`\n    🏷️ [NOTIFICATION SERVICE] Processing Sale Alert for ${productName}`);
  console.log(`      Notifying ${interestedUsers.length} users who wishlisted this item...`);

  // Process emails in parallel for speed
  const emailPromises = interestedUsers.map(user => 
    realEmailService.sendSaleAlert(
      user.email,
      user.name,
      productName,
      newPrice,
      oldPrice
    )
  );

  await Promise.all(emailPromises);
  console.log(`    ✅ [NOTIFICATION SERVICE] Sent ${interestedUsers.length} sale alerts`);
});

module.exports = new NotificationService();
