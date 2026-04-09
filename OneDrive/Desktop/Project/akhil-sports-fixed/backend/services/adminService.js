// Admin & Analytics Service Subscriber
// Handles: Real-time dashboard, Revenue tracking, Automated reports
const messageQueue = require('./messageQueue');

const analytics = {
  totalOrders: 0,
  totalRevenue: 0,
  hourlyOrders: new Map(),
  revenueByCategory: new Map(),
  topProducts: new Map(),
  events: []
};

// Real-time Dashboard Service
const dashboardService = {
  async updateMetrics(metrics) {
    console.log(`   📈 DASHBOARD METRICS UPDATED`);
    console.log(`      Total Orders: ${metrics.totalOrders}`);
    console.log(`      Total Revenue: ₹${metrics.totalRevenue}`);
    return true;
  }
};

// Report Generation Service
const reportService = {
  async generateDailyReport(date, data) {
    console.log(`   📋 DAILY REPORT GENERATED for ${date}`);
    console.log(`      Orders: ${data.orders}`);
    console.log(`      Revenue: ₹${data.revenue}`);
    console.log(`      Avg Order Value: ₹${data.avgOrderValue}`);
    return {
      reportId: `RPT-${date}`,
      date,
      data,
      generatedAt: new Date().toISOString()
    };
  },

  async generateWeeklyReport(weekEnd, data) {
    console.log(`   📊 WEEKLY REPORT GENERATED (Week ending ${weekEnd})`);
    console.log(`      Total Orders: ${data.totalOrders}`);
    console.log(`      Total Revenue: ₹${data.totalRevenue}`);
    console.log(`      Top Product: ${data.topProduct}`);
    return {
      reportId: `RPT-WK-${weekEnd}`,
      type: 'weekly',
      weekEnd,
      data
    };
  }
};

// Finance Alert Service
const financeAlertService = {
  alerts: [],
  
  async sendAlert(alertType, data) {
    console.log(`   💰 FINANCE ALERT: ${alertType}`);
    console.log(`      Data: ${JSON.stringify(data)}`);
    this.alerts.push({
      type: alertType,
      data,
      timestamp: new Date().toISOString()
    });
    return true;
  }
};

// Subscribe to Order.Placed event
messageQueue.subscribe('Order.Placed', 'AdminService', async (message, eventId) => {
  const { orderId, totalAmount, items } = message;
  
  console.log(`\n    👨‍💼 [ADMIN SERVICE] Processing Order ${orderId}`);
  
  // 1. Update analytics
  analytics.totalOrders++;
  analytics.totalRevenue += totalAmount;
  analytics.events.push({
    orderId,
    amount: totalAmount,
    itemCount: items.length,
    timestamp: new Date().toISOString()
  });
  
  // Track hourly orders
  const hour = new Date().getHours();
  const hourKey = `${hour}:00`;
  const currentHourOrders = (analytics.hourlyOrders.get(hourKey) || 0) + 1;
  analytics.hourlyOrders.set(hourKey, currentHourOrders);
  
  // Track revenue by category
  for (const item of items) {
    const category = item.category || 'other';
    const currentCategoryRevenue = (analytics.revenueByCategory.get(category) || 0) + (item.price * item.quantity);
    analytics.revenueByCategory.set(category, currentCategoryRevenue);
  }
  
  // 2. Update real-time dashboard
  await dashboardService.updateMetrics({
    totalOrders: analytics.totalOrders,
    totalRevenue: analytics.totalRevenue,
    ordersThisHour: analytics.hourlyOrders.get(hourKey)
  });
  
  // 3. Send daily report if this crosses certain order threshold
  if (analytics.totalOrders % 10 === 0) {
    // Generate daily summary every 10 orders (for demo)
    const dailyData = {
      orders: analytics.totalOrders,
      revenue: analytics.totalRevenue,
      avgOrderValue: Math.round(analytics.totalRevenue / analytics.totalOrders)
    };
    
    await reportService.generateDailyReport(
      new Date().toISOString().split('T')[0],
      dailyData
    );
  }
  
  // 4. Send finance alert for large orders
  if (totalAmount > 10000) {
    await financeAlertService.sendAlert('high_value_order', {
      orderId,
      amount: totalAmount,
      itemCount: items.length
    });
  }
  
  console.log(`    ✅ [ADMIN SERVICE] Analytics updated | Total Revenue: ₹${analytics.totalRevenue}`);
});

// Subscribe to all order-related events for continuous analysis
messageQueue.subscribe('Order.Delivered', 'AdminService', async (message, eventId) => {
  const { orderId } = message;
  
  console.log(`\n    👨‍💼 [ADMIN SERVICE] Order delivered: ${orderId}`);
  console.log(`      Updating delivery metrics...`);
});

module.exports = {
  analytics,
  dashboardService,
  reportService,
  financeAlertService
};
