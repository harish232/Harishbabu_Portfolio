const { v4: uuidv4 } = require('uuid');
const OrderModel = require('../models/Order'); // 👈 Import real MongoDB model

// Mock database
let orders = [];

class OrderService {
  async createOrder(orderData) {
    console.log('\n═══════════════════════════════════════════════');
    console.log('🛒 [ORDER SERVICE] Starting order creation...');
    console.log('═══════════════════════════════════════════════');

    // Step 1: Validate order data
    this.validateOrderData(orderData);

    // Generate unique order ID
    const orderId = `AS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create order object
    const order = {
      id: orderId,
      customerId: orderData.customerId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryCharge: orderData.deliveryCharge,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      deliveryAddress: orderData.deliveryAddress,
      status: 'placed',
      estimatedDelivery: this.calculateEstimatedDelivery(orderData.deliveryZone),
      createdAt: new Date().toISOString(),
      transactionId: null
    };

    // 💾 Save to REAL MongoDB Database (Fallback to array if DB is offline)
    try {
      const dbOrder = new OrderModel({
        orderId: orderId,
        customer: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          phone: orderData.customerPhone
        },
        deliveryAddress: {
          address: typeof orderData.deliveryAddress === 'object' ? orderData.deliveryAddress.street : orderData.deliveryAddress,
          city: typeof orderData.deliveryAddress === 'object' ? orderData.deliveryAddress.city : '',
          pincode: typeof orderData.deliveryAddress === 'object' ? orderData.deliveryAddress.pin : ''
        },
        items: orderData.items.map(i => ({
          productId: i.id || i.productId,
          name: i.name,
          quantity: i.qty || i.quantity,
          price: i.price
        })),
        payment: {
          method: orderData.paymentMethod === 'COD' ? 'COD' : 'UPI',
          amount: orderData.total
        }
      });
      await dbOrder.save();
      console.log(`✅ [DATABASE] Order saved to MongoDB with ID: ${orderId}`);
    } catch (dbError) {
      console.warn('⚠️ [DATABASE] MongoDB not connected, saving to memory array instead.');
      orders.push(order);
    }

    console.log('═══════════════════════════════════════════════\n');

    return order;
  }

  validateOrderData(data) {
    console.log('✔️  [ORDER VALIDATION] Validating order data...');
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    if (!data.customerName || !data.customerEmail || !data.customerPhone) {
      throw new Error('Missing required customer information');
    }

    if (!data.deliveryAddress) {
      throw new Error('Delivery address required');
    }

    console.log(`   ✅ Order has ${data.items.length} items`);
    console.log(`   ✅ Customer: ${data.customerName}`);
    console.log(`   ✅ Amount: ₹${data.total}`);
    
    return true;
  }

  calculateEstimatedDelivery(zone) {
    const days = zone === 'local' ? 2 : zone === 'state' ? 3 : 5;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  getAllOrders() {
    return orders;
  }

  getOrderById(orderId) {
    return orders.find(o => o.id === orderId);
  }
}

module.exports = new OrderService();
