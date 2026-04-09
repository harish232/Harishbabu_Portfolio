# 🚀 Event-Driven Order Processing - Quick Start Guide

## What's New? 🎉

Your Akhil Sports backend now has a **complete event-driven order processing system** with Kafka/RabbitMQ simulation!

📊 **New Files Created:**
```
backend/
├── services/
│   ├── messageQueue.js                 # Core event queue
│   ├── customerService.js              # Customer notifications
│   ├── sellerService.js                # Seller dashboard
│   ├── deliveryService.js              # Delivery partner assignment
│   ├── adminService.js                 # Analytics & reporting
│   └── inventoryServiceEvents.js       # Auto-reduce stock
├── routes/
│   └── ordersEventDriven.js           # Event-driven order API
└── test-event-system.js               # Test script

Documentation/
├── EVENT_DRIVEN_ARCHITECTURE.md       # Complete system guide
├── EVENT_DRIVEN_VISUAL_GUIDE.md       # Visual diagrams & flows
├── EVENT_DRIVEN_TOPICS_REFERENCE.md   # Detailed topic reference
└── EVENT_DRIVEN_QUICK_START.md        # This file
```

---

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Start Server
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════════╗
║  AKHIL SPORTS BACKEND - Order Processing API  ║
║  Server running on http://localhost:3000       ║
║  Event-Driven Order Processing Ready! ✓       ║
╚════════════════════════════════════════════════╝
```

### Step 3: Run Tests
In a **new terminal**:
```bash
cd backend
node test-event-system.js
```

Watch the magic! 🎇

---

## 🎯 What Happens When You Place an Order

```
1. Customer submits order
        ↓
2. Payment processed (95% success)
        ↓
3. ✅ Order.Placed event PUBLISHED to message queue
        ↓
4. 🎉 ALL 5 services process SIMULTANEOUSLY:
   ├─ 📧 CustomerService → Sends email, SMS, push
   ├─ 📦 SellerService → Creates packing task
   ├─ 🚚 DeliveryService → Assigns delivery partner
   ├─ 📊 AdminService → Updates dashboard
   └─ 📉 InventoryService → AUTO-REDUCES STOCK
        ↓
5. ✅ Everything complete in ~2 seconds!
```

---

## 📡 Test the System

### Via curl (Manual Test):

```bash
# Test successful order
curl -X POST http://localhost:3000/api/orders/event-driven \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST-12345",
    "items": [
      {"id": "cricket-bat", "name": "Cricket Bat - Premium", "quantity": 2, "price": 2500},
      {"id": "cricket-ball", "name": "Cricket Ball", "quantity": 1, "price": 499}
    ],
    "deliveryAddress": "123 Main Street, Hyderabad 500001",
    "customerEmail": "customer@example.com",
    "customerPhone": "+91-98765-43210"
  }'
```

### Via Test Script (Recommended):

```bash
node test-event-system.js
```

This runs 3 test scenarios automatically and shows all events!

---

## 📊 API Endpoints

### 1. Place Order (Event-Driven)
```
POST /api/orders/event-driven
Content-Type: application/json

Request Body:
{
  "customerId": "CUST-12345",
  "items": [
    {
      "id": "cricket-bat",
      "name": "Cricket Bat - Premium",
      "quantity": 2,
      "price": 2500
    }
  ],
  "deliveryAddress": "123 Main Street",
  "customerEmail": "customer@example.com",
  "customerPhone": "+91-98765-43210"
}

Response:
{
  "success": true,
  "orderId": "ORD-A1B2C3D4",
  "totalAmount": 5499,
  "paymentId": "PAY-XXXX"
}
```

### 2. View Event Log
```
GET /api/orders/event-log

Shows all events published to message queue (last 20 events)
```

### 3. View Queue Statistics
```
GET /api/orders/event-stats

Shows topics, event counts, subscriber counts
```

### 4. List Orders
```
GET /api/orders/list

Shows all placed orders
```

---

## 🎯 Key Features Explained

### 1️⃣ Event-Driven Architecture
- **Topic-based:** Events published to topics like `Order.Placed`
- **Subscribers:** Multiple services listen and process
- **Parallel:** All services process simultaneously
- **Decoupled:** Services don't need to know about each other

### 2️⃣ Inventory Auto-Reduction ⚡
When order is placed:
```
Cricket Bat: 50 → 48 (instantly)
Cricket Ball: 100 → 99 (instantly)
```
Next customer sees correct stock immediately! ✓

### 3️⃣ Customer Notifications
Automatic delivery of:
- 📧 Email (order confirmation)
- 📱 SMS (order ID)
- 🔔 Push notification (app alert)
- 💬 In-app notification (message center)

### 4️⃣ Seller Packing
Automatic alerts to warehouse:
- 🚨 "NEW ORDER! START PACKING"
- 📦 Packing task created
- 📊 Priority determined by amount
- High orders (>₹10,000) get priority ⚠️

### 5️⃣ Delivery Partner Assignment
Automatic assignment to:
- 🚚 Nearest available partner
- 📍 ETA calculated: 30-120 minutes
- ✅ High-rated partners first
- 🗺️ Route optimized

### 6️⃣ Real-Time Analytics Dashboard
Automatic updates:
- 📈 Total orders count
- 💰 Total revenue
- 📊 Revenue by category
- 🏆 Top products
- ⏰ Orders by hour
- 📋 Automated daily reports

### 7️⃣ Audit Trail
Every stock change logged:
```
OrderID | Product | Before | Ordered | After | Action | Time
---------|---------|--------|---------|-------|--------|----------
ORD-001 | Bat     | 50     | 2       | 48    | reserve| 10:30:00
ORD-002 | Ball    | 100    | 1       | 99    | reserve| 10:31:00
ORD-001 | Bat     | 48     | 2       | 50    | restore| 10:35:00
```

---

## 🎓 Learning Path

This system covers production-grade concepts:

### Beginner Level:
- Understanding events and topics
- Pub-Sub pattern basics
- Simple message queues

### Intermediate Level:
- Multi-service integration
- Asynchronous processing
- Event-driven workflows
- Fault tolerance

### Advanced Level:
- Kafka/RabbitMQ simulation
- Distributed transactions
- Inventory consistency
- Service resilience
- Real-time analytics

---

## 📋 Testing Scenarios Included

### Scenario 1: Successful Order ✅
- All items in stock
- Payment succeeds
- All 5 services process
- Stock reduced correctly

### Scenario 2: High-Value Order 💰
- Amount > ₹10,000
- Priority packing triggered
- Finance alert sent
- Premium delivery assigned

### Scenario 3: Bulk Order 📦
- Multiple items
- Large quantity
- Multiple subscribers notified
- Accelerated packing

Run with:
```bash
node test-event-system.js
```

---

## 🔍 Monitor Events in Real-Time

Watch the server console for event flow:
```
[REST API] New order received
[STEP 1] VALIDATING ORDER ✅
[STEP 2] PROCESSING PAYMENT ✅
[STEP 3] PUBLISHING ORDER.PLACED EVENT

📤 [EVENT] Published to topic: Order.Placed
   Event ID: EVT-001-ABC123

   🛍️ [CUSTOMER SERVICE] Processing Order ORD-A1B2C3D4
      📧 EMAIL SENT
      📱 SMS SENT
      🔔 PUSH NOTIFICATION SENT
      💬 IN-APP NOTIFICATION

   🏪 [SELLER SERVICE] Processing Order ORD-A1B2C3D4
      📦 PACKING TASK CREATED
      🚨 SELLER ALERT SENT

   🚚 [DELIVERY SERVICE] Processing Order ORD-A1B2C3D4
      🚛 PICKUP REQUEST CREATED
      ETA: 45 MINUTES

   👨‍💼 [ADMIN SERVICE] Processing Order ORD-A1B2C3D4
      📈 DASHBOARD UPDATED

   📊 [INVENTORY SERVICE] Processing Order ORD-A1B2C3D4
      📉 STOCK REDUCED
      Cricket Bat: 50 → 48

✅ All 5 subscribers completed in 2 seconds!
```

---

## 🚨 Troubleshooting

### Problem: "npm start" fails
```
Solution: 
1. Make sure Node.js is installed: node --version
2. reinstall dependencies: rm -rf node_modules && npm install
3. Check package.json exists in backend folder
```

### Problem: Port 3000 already in use
```
Solution:
Option 1: Kill existing process on port 3000
Option 2: Change PORT in server.js to 3001 or 3002
```

### Problem: Orders not appearing in log
```
Solution:
1. Check server is running: curl http://localhost:3000/api/health
2. Check status code: 201 (created) = success
3. Check console for error messages
```

---

## 📚 Documentation Files

1. **EVENT_DRIVEN_ARCHITECTURE.md** (Main Guide)
   - Complete system overview
   - All 5 subscriber details
   - Architecture advantages
   - Full API documentation

2. **EVENT_DRIVEN_VISUAL_GUIDE.md** (Diagrams)
   - Flow diagrams
   - Timeline visualization
   - Message sequences
   - Performance metrics

3. **EVENT_DRIVEN_TOPICS_REFERENCE.md** (Deep Dive)
   - Each topic explained in detail
   - Use cases and workflows
   - Error scenarios
   - Complete examples

4. **EVENT_DRIVEN_QUICK_START.md** (This File)
   - Quick setup instructions
   - Fast API reference
   - Testing guide

---

## 🎯 Next Steps

After running the tests successfully:

1. **Explore the code:**
   - Read `backend/routes/ordersEventDriven.js` (main flow)
   - Read `backend/services/messageQueue.js` (core queue)
   - Read each subscriber service

2. **Modify and extend:**
   - Add more services (e.g., ReviewService, LoyaltyService)
   - Add new topics (e.g., Review.Submitted, Points.Earned)
   - Implement database persistence
   - Add real payment gateway
   - Connect to real email service

3. **Deploy to production:**
   - Replace mock services with real ones
   - Use actual Kafka or RabbitMQ instead of simulated queue
   - Add load balancing
   - Implement horizontal scaling
   - Set up monitoring & alerts

---

## 🎉 Congratulations!

You now have a **production-grade event-driven order processing system** running locally!

This demonstrates:
- ✅ Modern microservices architecture
- ✅ Asynchronous processing
- ✅ Real-time data consistency
- ✅ Scalable system design
- ✅ Professional backend patterns

Perfect for your portfolio or learning! 🚀

---

## 📞 Need Help?

Review these docs in order:
1. **Quick Start** (this file) - Get it running
2. **Visual Guide** - Understand the flow
3. **Topics Reference** - Deep dive into each service
4. **Architecture** - Full system design

Check server logs for detailed event processing information!
