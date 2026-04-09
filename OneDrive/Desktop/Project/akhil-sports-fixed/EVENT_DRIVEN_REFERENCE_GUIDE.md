# 🎯 Event-Driven Order Processing - Complete Reference Guide

## 📌 System Overview

When a customer places an order in Akhil Sports, here's what happens:

```
Order → Payment → Event Published → 5 Services Process in Parallel

🎉 Result: Everything happens in ~2 seconds! 
   Customer gets confirmation
   Seller gets packing task
   Delivery partner gets assignment
   Admin sees dashboard update
   Inventory auto-reduces
```

---

## 📚 Documentation Guide - Where to Start

### 🚀 NEW USER? Start Here:
1. **[EVENT_DRIVEN_QUICK_START.md](EVENT_DRIVEN_QUICK_START.md)** (5 min read)
   - What's new in the system
   - 3-step setup guide
   - Quick API reference
   - Testing instructions

2. **Run the test script:**
   ```bash
   cd backend
   npm install
   npm start
   # In another terminal:
   node test-event-system.js
   ```

3. **Watch what happens** (observe console output)

---

### 📖 WANT TO UNDERSTAND? Read These:

**Visual Learners:**
→ [EVENT_DRIVEN_VISUAL_GUIDE.md](EVENT_DRIVEN_VISUAL_GUIDE.md) (10 min)
- Flow diagrams
- Timeline visualization  
- Message sequences
- Performance metrics

**Detail-Oriented:**
→ [EVENT_DRIVEN_ARCHITECTURE.md](EVENT_DRIVEN_ARCHITECTURE.md) (20 min)
- Complete system explanation
- All 6 topics detailed
- Event flow sequence
- File structure

**Deep Divers:**
→ [EVENT_DRIVEN_TOPICS_REFERENCE.md](EVENT_DRIVEN_TOPICS_REFERENCE.md) (30 min)
- Each topic explained in detail
- Each subscriber service explained
- JSON payload examples
- Use cases and workflows

---

## 🎯 The 5 Key Topics You Need to Know

### Topic 1: 📌 **Order.Placed**
**When:** Order is confirmed and payment succeeds
**Effect:** Published to message queue, triggers all 5 services
**Read:** [EVENT_DRIVEN_TOPICS_REFERENCE.md - Topic 1](EVENT_DRIVEN_TOPICS_REFERENCE.md#-topic-1-orderplaced)

```
Published once → Consumed by 5 services → All process in parallel
Customer: Gets 4 notifications (email, SMS, push, in-app)
Seller: Gets packing task with alert
Delivery: Gets pickup assignment
Admin: Dashboard updated
Inventory: Stock reduced immediately
```

---

### Topic 2: 📌 **Packing.Completed**
**When:** Warehouse manager finishes packing
**Effect:** Notifies delivery partner that package is ready
**Read:** [EVENT_DRIVEN_TOPICS_REFERENCE.md - Topic 2](EVENT_DRIVEN_TOPICS_REFERENCE.md#-topic-2-packingcompleted)

```
Packing done → Delivery partner notified → Heads to warehouse
Delivery status: "Ready for pickup"
Partner gets map, address, ETA
```

---

### Topic 3: 📌 **Delivery.Completed**
**When:** Package delivered and customer confirms
**Effect:** Finalizes order, updates metrics
**Read:** [EVENT_DRIVEN_TOPICS_REFERENCE.md - Topic 3](EVENT_DRIVEN_TOPICS_REFERENCE.md#-topic-3-deliverycompleted)

```
Delivery confirmed → Stock finalized → Metrics updated
Inventory: reserved stock → converted to sold
Admin: Delivery success recorded
Customer: Sent delivery confirmation
```

---

### Topic 4: 📌 **Order.Cancelled**
**When:** Customer or system cancels order
**Effect:** Restores stock, updates metrics
**Read:** [EVENT_DRIVEN_TOPICS_REFERENCE.md - Topic 4](EVENT_DRIVEN_TOPICS_REFERENCE.md#-topic-4-ordercancelled)

```
Order cancelled → Stock restored → Metrics updated
Inventory: reserved stock → returned to available
Customer: Refund initiated
Admin: Cancellation recorded
```

---

## 🎯 The 5 Subscriber Services

### Service 1: 🛍️ **CustomerService**
**Purpose:** Notify customer about order
**Actions:**
- Sends 📧 Email (order confirmation)
- Sends 📱 SMS (order ID)
- Sends 🔔 Push notification (app alert)
- Saves 💬 In-app notification (message center)

**Read:** [EVENT_DRIVEN_TOPICS_REFERENCE.md - CustomerService](EVENT_DRIVEN_TOPICS_REFERENCE.md#-%EF%B8%8F-customerservice-subscriber)

---

### Service 2: 🏪 **SellerService**
**Purpose:** Alert warehouse to pack items
**Actions:**
- Creates 📦 Packing task
- Shows 📊 Dashboard alert
- Sends 🚨 Real-time alert to seller
- Determines 🎯 Priority (high for >₹10,000)

**Read:** [EVENT_DRIVEN_TOPICS_REFERENCE.md - SellerService](EVENT_DRIVEN_TOPICS_REFERENCE.md#-%F0%9F%8F%AA-sellerservice-subscriber)

---

### Service 3: 🚚 **DeliveryService**
**Purpose:** Assign delivery partner
**Actions:**
- Assigns 🚛 Nearest available partner
- Calculates 📍 ETA (30-120 minutes)
- Creates 📌 Pickup request
- Sends 💬 Notification to partner

**Read:** [EVENT_DRIVEN_TOPICS_REFERENCE.md - DeliveryService](EVENT_DRIVEN_TOPICS_REFERENCE.md#-%F0%9F%9A%9A-deliveryservice-subscriber)

---

### Service 4: 👨‍💼 **AdminService**
**Purpose:** Track analytics and reporting
**Actions:**
- Updates 📈 Real-time dashboard metrics
- Tracks 💰 Revenue by category
- Generates 📋 Daily reports (auto)
- Sends 💸 Finance alerts for high orders

**Read:** [EVENT_DRIVEN_TOPICS_REFERENCE.md - AdminService](EVENT_DRIVEN_TOPICS_REFERENCE.md#-%F0%9F%91%A8%E2%80%8D%F0%9F%92%BC-adminservice-subscriber)

---

### Service 5: 📊 **InventoryService** ⚡ CRITICAL
**Purpose:** **AUTO-REDUCE STOCK** (prevents overselling)
**Actions:**
- Reduces 📉 Available count immediately
- Reserves 📌 Quantities for orders
- Restores 📈 Stock if cancelled
- Creates 📝 Audit trail for compliance

**WHY CRITICAL:** Next customer sees correct stock right away!

**Read:** [EVENT_DRIVEN_TOPICS_REFERENCE.md - InventoryService](EVENT_DRIVEN_TOPICS_REFERENCE.md#-%F0%9F%93%8A-inventoryservice-subscriber)

---

## 🔄 How It All Works Together

### Step-by-Step Flow:

```
1. CUSTOMER PLACES ORDER
   └─ Submits order form with items, address, payment

2. VALIDATE
   └─ Check items valid, address valid, stock available

3. PROCESS PAYMENT
   └─ Send to payment gateway (95% success rate)
   └─ If fails: Return error to customer

4. PUBLISH EVENT
   └─ ordersEventDriven.js publishes: Order.Placed
   └─ Event sent to messageQueue

5. ALL 5 SERVICES EXECUTE IN PARALLEL:

   🛍️ CustomerService (0ms)
   ├─ Email "Order confirmed" sent
   ├─ SMS "Order ID ###" sent
   ├─ Push notification sent
   └─ In-app notification saved
   
   🏪 SellerService (0ms)
   ├─ Packing task created (PKG-xxx)
   ├─ Dashboard shows alert
   ├─ Alert notification sent
   └─ Priority determined
   
   🚚 DeliveryService (0ms)
   ├─ Partner assigned (DP-xxx)
   ├─ ETA calculated (45 min)
   ├─ Pickup request created
   └─ Notification sent to partner
   
   👨‍💼 AdminService (0ms)
   ├─ Order count: +1
   ├─ Revenue: +amount
   ├─ Dashboard updated
   └─ Category tracked
   
   📊 InventoryService (0ms) ⚡
   ├─ Cricket Bat: 50 → 48
   ├─ Cricket Ball: 100 → 99
   ├─ Status: RESERVED
   └─ Audit entry created

6. ALL COMPLETE
   └─ Within ~2 seconds
   └─ Everything synchronized
   └─ No waiting between services
```

---

## 💻 API Endpoints

### 1. Place Order
```
POST /api/orders/event-driven
Content-Type: application/json

{
  "customerId": "CUST-12345",
  "items": [
    {
      "id": "cricket-bat",
      "name": "Cricket Bat",
      "quantity": 2,
      "price": 2500
    }
  ],
  "deliveryAddress": "123 Main St",
  "customerEmail": "customer@example.com",
  "customerPhone": "+91-98765-43210"
}
```

### 2. View Event Log
```
GET /api/orders/event-log

Shows all events with IDs, topics, subscribers, timestamps
```

### 3. View Queue Statistics
```
GET /api/orders/event-stats

Shows topic names, event counts, subscriber counts
```

### 4. List All Orders
```
GET /api/orders/list

Shows all placed orders with details
```

---

## 📊 Real-Time Monitoring

### Watch Console Output:
```
[STEP 3] PUBLISHING ORDER.PLACED EVENT

📤 [EVENT] Published to topic: Order.Placed
📢 [QUEUE] CustomerService subscribed: Order.Placed
📢 [QUEUE] SellerService subscribed: Order.Placed
📢 [QUEUE] DeliveryService subscribed: Order.Placed
📢 [QUEUE] AdminService subscribed: Order.Placed
📢 [QUEUE] InventoryService subscribed: Order.Placed

🛍️ [CUSTOMER SERVICE] Processing Order ORD-AB12
   📧 EMAIL SENT
   📱 SMS SENT
   🔔 PUSH NOTIFICATION SENT
   💬 IN-APP NOTIFICATION SAVED

🏪 [SELLER SERVICE] Processing Order ORD-AB12
   📦 PACKING TASK CREATED
   🚨 SELLER ALERT SENT

🚚 [DELIVERY SERVICE] Processing Order ORD-AB12
   🚛 PICKUP REQUEST CREATED
   ETA: 45 MINUTES

👨‍💼 [ADMIN SERVICE] Processing Order ORD-AB12
   📈 DASHBOARD UPDATED

📊 [INVENTORY SERVICE] Processing Order ORD-AB12
   📉 STOCK REDUCED
   Cricket Bat: 50 → 48
   Cricket Ball: 100 → 99

✅ All 5 subscribers completed!
```

---

## 🧪 Testing Guide

### Quick Test (1 order):
```bash
curl -X POST http://localhost:3000/api/orders/event-driven \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST-12345",
    "items": [
      {"id": "cricket-bat", "name": "Cricket Bat", "quantity": 2, "price": 2500}
    ],
    "deliveryAddress": "123 Main Street, Hyderabad",
    "customerEmail": "customer@example.com",
    "customerPhone": "+91-98765-43210"
  }'
```

### Automated Tests (3 scenarios):
```bash
cd backend
node test-event-system.js
```

Tests:
- ✅ Successful order
- 💰 High-value order (>₹10,000)
- 📦 Bulk order (multiple items)

---

## 📁 Code Files (What Each Does)

```
backend/
├── services/
│   ├── messageQueue.js
│   │   └─ Core event queue system
│   │   └─ Manages topics, subscribers, publishing
│   │
│   ├── customerService.js
│   │   └─ Subscribes to Order.Placed
│   │   └─ Sends email, SMS, push, in-app notifications
│   │
│   ├── sellerService.js
│   │   └─ Subscribes to Order.Placed
│   │   └─ Creates packing tasks, sends alerts
│   │
│   ├── deliveryService.js
│   │   └─ Subscribes to Order.Placed & Packing.Completed
│   │   └─ Assigns delivery partners, calculates ETA
│   │
│   ├── adminService.js
│   │   └─ Subscribes to Order.Placed & Order.Cancelled
│   │   └─ Updates analytics, generates reports
│   │
│   ├── inventoryServiceEvents.js
│   │   └─ Subscribes to Order.Placed & Order.Cancelled
│   │   └─ AUTO-REDUCES stock (CRITICAL!)
│   │
│   └── inventoryService.js [EXISTING]
│       └─ Original inventory system (still used)
│
├── routes/
│   ├── ordersEventDriven.js [NEW]
│   │   └─ Event-driven order processing endpoints
│   │   └─ POST /api/orders/event-driven
│   │   └─ GET /api/orders/event-log
│   │   └─ GET /api/orders/event-stats
│   │
│   ├── orders.js [EXISTING]
│   │   └─ Original order endpoints (still works)
│   │
│   └── auth.js [EXISTING]
│       └─ Authentication endpoints
│
├── middleware/
│   └── auth.js [EXISTING]
│       └─ JWT token validation
│
├── server.js [MODIFIED]
│   └─ Added event-driven routes
│
└── test-event-system.js [NEW]
    └─ Automated test suite
    └─ 3 test scenarios
    └─ Colored console output
```

---

## 🎓 Learning Outcomes

After completing this guide, you'll understand:

✅ **Event-Driven Architecture**
- Topics and subscribers pattern
- Pub-Sub messaging system
- Asynchronous event processing

✅ **Message Queues**
- How Kafka/RabbitMQ work (simulated here)
- Event publishing and consumption
- Topic-based routing

✅ **Microservices**
- Service decoupling
- Independent scaling
- Fault tolerance

✅ **Real-Time Systems**
- Parallel execution
- Live data synchronization
- Real-time analytics

✅ **Inventory Management**
- Stock reduction strategies
- Preventing overselling
- Audit trails

✅ **Production Patterns**
- Error handling
- Resilience
- Observability

---

## 🚀 Next Steps

### For Learning:
1. Run the test script: `node test-event-system.js`
2. Read the documentation in order (Quick Start → Architecture → Topics)
3. Modify the code (add new services, new topics)
4. Deploy locally and test with postman

### For Production:
1. Replace event queue with real Kafka/RabbitMQ
2. Add database persistence
3. Implement real payment gateway
4. Send real emails and SMS
5. Use real delivery partner API
6. Add horizontal scaling
7. Implement monitoring and alerting

### For Portfolio:
1. Document the system well (already done!)
2. Create a demo video showing the event flow
3. Show the architecture diagrams
4. Explain the design patterns used
5. Showcase real-time processing

---

## 📞 Quick Reference

### Startup:
```bash
cd backend && npm install && npm start
```

### Test:
```bash
node backend/test-event-system.js
```

### Check Events:
```bash
curl http://localhost:3000/api/orders/event-log | jq
```

### Check Stats:
```bash
curl http://localhost:3000/api/orders/event-stats | jq
```

### Place Order:
```bash
# See API Endpoints section above
```

---

## 📚 Documentation Map

```
Event-Driven System
│
├─ START HERE
│  └─ EVENT_DRIVEN_QUICK_START.md ← Read first!
│
├─ UNDERSTAND (Choose One)
│  ├─ EVENT_DRIVEN_VISUAL_GUIDE.md (diagrams & flows)
│  ├─ EVENT_DRIVEN_ARCHITECTURE.md (complete overview)
│  └─ EVENT_DRIVEN_REFERENCE_GUIDE.md (this file)
│
├─ DEEP DIVE
│  └─ EVENT_DRIVEN_TOPICS_REFERENCE.md (detailed breakdown)
│
├─ FILES SUMMARY
│  └─ EVENT_DRIVEN_FILES_SUMMARY.md (what's where)
│
└─ CODE
   ├─ backend/services/messageQueue.js
   ├─ backend/services/customerService.js
   ├─ backend/services/sellerService.js
   ├─ backend/services/deliveryService.js
   ├─ backend/services/adminService.js
   ├─ backend/services/inventoryServiceEvents.js
   ├─ backend/routes/ordersEventDriven.js
   └─ backend/test-event-system.js
```

---

## ✨ Summary

You now have a **complete, production-inspired event-driven order processing system!**

- 📡 **Message queue** for event publishing
- 🎯 **5 concurrent services** processing orders
- 📊 **Real-time analytics** and dashboards
- 🚚 **Delivery partner assignment**
- 📉 **Inventory auto-reduction** (prevents overselling)
- 📧 **Multi-channel notifications**
- 📝 **Complete audit trails**

This is **professional-grade backend architecture** demonstrated in a learning-friendly way. Perfect for understanding modern e-commerce systems! 🌟

---

Start with: [EVENT_DRIVEN_QUICK_START.md](EVENT_DRIVEN_QUICK_START.md)

Then run: `node test-event-system.js`

That's it! You're ready to explore! 🚀
