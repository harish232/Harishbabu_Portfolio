// Customer Service Subscriber
// Handles: Email, SMS, Push Notifications, In-app Notifications
const messageQueue = require('./messageQueue');

const customerNotifications = new Map();

// Email Service
const emailService = {
  async send(to, subject, body) {
    console.log(`   📧 EMAIL SENT to ${to}`);
    console.log(`      Subject: ${subject}`);
    console.log(`      Body: ${body.substring(0, 80)}...`);
    return true;
  }
};

// SMS Service
const smsService = {
  async send(phoneNumber, message) {
    console.log(`   📱 SMS SENT to ${phoneNumber}`);
    console.log(`      Message: ${message}`);
    return true;
  }
};

// Push Notification Service
const pushNotificationService = {
  async send(userId, title, message, data = {}) {
    console.log(`   🔔 PUSH NOTIFICATION sent to user ${userId}`);
    console.log(`      Title: ${title}`);
    console.log(`      Message: ${message}`);
    return true;
  }
};

// In-app Notification Service
const inAppNotificationService = {
  async save(userId, notification) {
    console.log(`   💬 IN-APP NOTIFICATION saved for user ${userId}`);
    console.log(`      Title: ${notification.title}`);
    console.log(`      Message: ${notification.message}`);
    
    // Save to mock database
    if (!customerNotifications.has(userId)) {
      customerNotifications.set(userId, []);
    }
    customerNotifications.get(userId).push({
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    });
    return true;
  }
};

// Subscribe to Order.Placed event
messageQueue.subscribe('Order.Placed', 'CustomerService', async (message, eventId) => {
  const { orderId, customerId, email, phone, items, totalAmount } = message;
  
  console.log(`\n    🛍️ [CUSTOMER SERVICE] Processing Order ${orderId}`);
  
  // 1. Send Order Summary Email
  const emailBody = `
    Order Confirmation! 🎉
    Order ID: ${orderId}
    Items: ${items.map(i => `${i.name} x${i.quantity}`).join(', ')}
    Total: ₹${totalAmount}
    
    Your order has been confirmed and will be delivered soon!
  `;
  
  await emailService.send(
    email,
    `Order Confirmed - #${orderId}`,
    emailBody
  );

  // 2. Send Order ID via SMS
  const smsMessage = `Akhil Sports: Your order #${orderId} is confirmed! Track: app.akhilsports.com/track/${orderId}`;
  await smsService.send(phone, smsMessage);

  // 3. Send Push Notification
  await pushNotificationService.send(
    customerId,
    '✅ Order Placed Successfully!',
    `Your order #${orderId} for ₹${totalAmount} is confirmed`,
    { orderId, amount: totalAmount }
  );

  // 4. Save In-App Notification
  await inAppNotificationService.save(customerId, {
    type: 'order_placed',
    title: '🎉 Order Placed',
    message: `Your order for ₹${totalAmount} has been placed. Order ID: ${orderId}`,
    actionUrl: `/orders/${orderId}`,
    icon: 'success'
  });

  console.log(`    ✅ [CUSTOMER SERVICE] All notifications sent for Order ${orderId}`);
});

module.exports = {
  customerNotifications,
  emailService,
  smsService,
  pushNotificationService,
  inAppNotificationService
};
