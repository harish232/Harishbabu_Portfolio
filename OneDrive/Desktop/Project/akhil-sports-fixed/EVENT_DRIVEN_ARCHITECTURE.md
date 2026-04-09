# 📡 Event-Driven Order Processing Architecture

## System Overview

This is a **production-grade event-driven order processing system** using a message queue pattern (simulating Kafka/RabbitMQ). When an order is placed, a single **"Order.Placed"** event is published to the queue, and multiple services subscribe and process it **in parallel**.

```
┌─────────────────────────────────────────────────────────────────┐
│                  CUSTOMER PLACES ORDER                          │
│                    (Checkout API)                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │   PAYMENT PROCESSING                   │
        │   (95% success, 5% random failures)    │
        └────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │  PUBLISH: Order.Placed Event           │
        │  To: Message Queue (Kafka/RabbitMQ)    │
        └────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬─────────────────┬──────────────┐
        │                │                │                 │              │
        ▼                ▼                ▼                 ▼              ▼
   SUBSCRIBE:      SUBSCRIBE:        SUBSCRIBE:       SUBSCRIBE:   SUBSCRIBE:
   CUSTOMER       SELLER             DELIVERY         ADMIN        INVENTORY
   SERVICE        SERVICE            SERVICE          SERVICE      SERVICE
        │                │                │                 │              │
        └────────────────┼────────────────┼─────────────────┼──────────────┘
        │                │                │                 │              │
        ▼                ▼                ▼                 ▼              ▼
   📧 EMAIL          📦 PACKING         🚛 PICKUP       📈 DASHBOARD  📉 STOCK
   📱 SMS            🎯 TASK            REQUEST        💰 REVENUE    REDUCE
   🔔 PUSH           🚨 ALERT           🗺️ ROUTE       📋 REPORTS   🔴 MARK
   💬 IN-APP                            OPTIMIZE       📊 METRICS   RESERVED
        │                │                │                 │              │
        └────────────────┴────────────────┴─────────────────┴──────────────┘
                         │
                         ▼
            ✅ ORDER PROCESSING COMPLETE
            All events delivered in PARALLEL
            No waiting, synchronized updates
```

---

## 📌 Topics & Detailed Explanations

Click on any box below to see what happens:

### 1️⃣ **Order.Placed Event Topic**

**When:** Immediately after order is confirmed and payment succeeds

**What gets published:**
```json
{
  "orderId": "ORD-A1B2C3D4",
  "customerId": "CUST-12345",
  "items": [
    { "id": "cricket-bat", "name": "Cricket Bat - Premium", "quantity": 2, "price": 2500 },
    { "id": "ball", "name": "Cricket Ball", "quantity": 1, "price": 499 }
  ],
  "totalAmount": 5499,
  "deliveryAddress": "123 Main Street, Hyderabad 500001",
  "customerEmail": "customer@example.com",
  "customerPhone": "+91-98765-43210",
  "seller": "akhilsports-main",
  "timestamp": "2026-04-05T10:30:00.000Z"
}
```

**Subscribers:** ✅ Customer Service, ✅ Seller Service, ✅ Delivery Service, ✅ Admin Service, ✅ Inventory Service

**Effect on each:**
- 🛍️ **Customer Service:** Sends email, SMS, notifications
- 🏪 **Seller Service:** Creates packing task immediately
- 🚚 **Delivery Service:** Assigns delivery partner, calculates ETA
- 👨‍💼 **Admin Service:** Updates dashboard metrics
- 📊 **Inventory Service:** **AUTO-REDUCES STOCK** (CRITICAL!)

---

### 2️⃣ **Customer Service Subscriber**

**Who receives:** The customer who placed the order

**What happens:**
```
📧 EMAIL NOTIFICATION
├─ Subject: "Order Confirmed - #ORD-A1B2C3D4"
├─ To: customer@example.com
├─ Body: 
│  └─ Order Order Confirmation! 🎉
│     Order ID: ORD-A1B2C3D4
│     Items: Cricket Bat - Premium x2, Cricket Ball x1
│     Total: ₹5,499
│     Your order has been confirmed and will be delivered soon!
└─ Sent at: 10:30:00 UTC

📱 SMS NOTIFICATION
├─ To: +91-98765-43210
├─ Message: "Akhil Sports: Your order #ORD-A1B2C3D4 is confirmed! 
│            Track: app.akhilsports.com/track/ORD-A1B2C3D4"
└─ Sent at: 10:30:01 UTC

🔔 PUSH NOTIFICATION (App)
├─ Title: "✅ Order Placed Successfully!"
├─ Message: "Your order #ORD-A1B2C3D4 for ₹5,499 is confirmed"
├─ Action: Opens order tracking page
└─ Sent at: 10:30:02 UTC

💬 IN-APP NOTIFICATION (Message Center)
├─ Type: order_placed
├─ Title: "🎉 Order Placed"
├─ Message: "Your order for ₹5,499 has been placed. Order ID: ORD-A1B2C3D4"
├─ Link: /orders/ORD-A1B2C3D4
└─ Saved at: 10:30:02 UTC
```

**Timeline:**
- T+0s: Email sent
- T+1s: SMS sent  
- T+2s: Push notification sent
- T+2s: In-app notification saved

**All sent in PARALLEL** — customer gets alerts within 2 seconds!

---

### 3️⃣ **Seller Service Subscriber**

**Who receives:** The merchant/seller of Akhil Sports

**What happens:**

```
📊 SELLER DASHBOARD UPDATE
├─ New Order Alert: "🚨 NEW ORDER ALERT!"
├─ Order ID: ORD-A1B2C3D4
├─ Items to Pack: Cricket Bat - Premium x2, Cricket Ball x1
├─ Amount: ₹5,499
├─ Priority: NORMAL (or HIGH if > ₹10,000)
└─ Status: PACKING_NEEDED

📦 PACKING TASK CREATED
├─ Task ID: PKG-ORD-A1B2C3D4
├─ Items:
│  ├─ Cricket Bat - Premium x2
│  └─ Cricket Ball x1
├─ Priority: Normal
├─ Status: PENDING
├─ Warehouse Section: Sports Equipment
├─ Expected Completion: Within 30 minutes
└─ CreatedAt: 10:30:00 UTC

🚨 REAL-TIME SELLER ALERT
├─ Type: "new_order"
├─ Title: "🚨 NEW ORDER ALERT!"
├─ Message: "Order #ORD-A1B2C3D4 received! Items: Cricket Bat - Premium, 
│           Cricket Ball. Amount: ₹5,499. START PACKING NOW!"
├─ Priority: Normal
└─ Sent to: Seller App/Dashboard
```

**Seller Dashboard Shows:**
- Live order count
- Orders waiting to be packed (FIFO queue)
- Click item → See exact location in warehouse
- Click "Start Packing" → Task marked as in-progress
- Scan items → Update inventory as shipped

**High Priority Orders (>₹10,000):**
- Displayed at TOP of queue
- Red badge "URGENT"
- Phone call/SMS to warehouse manager
- Estimated packing time reduced

---

### 4️⃣ **Delivery Service Subscriber**

**Who receives:** Assigned Delivery Partner (auto-assigned)

**What happens:**

```
🚛 PICKUP REQUEST CREATED
├─ Request ID: PU-ORD-A1B2C3D4
├─ Assigned Partner: DP-4521 (Driver Name: Raj Kumar)
├─ Status: PENDING_ACCEPTANCE
│
├─ PICKUP DETAILS
│  ├─ Location: Akhil Sports Warehouse, Hyderabad Main
│  ├─ Address: 47 Sports Complex, Hyderabad 500001
│  ├─ Contact: +91-94523-67890
│  
├─ DELIVERY DETAILS
│  ├─ Customer: Customer Name
│  ├─ Address: 123 Main Street, Hyderabad 500001
│  ├─ Phone: +91-98765-43210
│  ├─ Items: 3 items total
│  
├─ LOGISTICS
│  ├─ ETA to Warehouse: 15 minutes
│  ├─ Pickup-to-Delivery Time: 45 minutes
│  ├─ Estimated Delivery: 11:15 AM
│  ├─ Route: Optimized (based on location)
│  
├─ PRIORITY
│  ├─ Level: Normal
│  ├─ Acceptance Deadline: 2 minutes
│  └─ (High priority orders get accepted first)
```

**Delivery Partner App Shows:**
- Map with warehouse location
- Tap "Accept" → Status changes to "Heading to Warehouse"
- Tap "Arrived at Warehouse" → Packing status checked
- Warehouse manager hands package
- Partner scans → Status: "In Transit"
- Partner arrives at delivery address
- Customer signs/confirms → Status: "Delivered"

**Real-time Location Updates:**
- Customer sees delivery partner location on map
- ETA updates as partner moves
- Push notifications at key milestones:
  - "Partner heading to warehouse"
  - "Package picked up"
  - "Package in transit"
  - "Partner arriving in 5 minutes"
  - "Delivered!"

**Failure Scenarios:**
- Partner rejects assignment → Auto-assigned to next partner
- Traffic delay → ETA auto-updated
- Delivery failed (customer not home) → Automatically reschedule next day
- Payment issues → Escalate to admin

---

### 5️⃣ **Admin & Analytics Service Subscriber**

**Who receives:** Admin Dashboard, Finance Team, Business Analytics

**What happens at ORDER PLACEMENT:**

```
📈 REAL-TIME DASHBOARD UPDATE
├─ Total Orders: +1 (increments immediately)
├─ Total Revenue: +₹5,499 (instantly reflected)
├─ Orders This Hour: +1 (updated in real-time)
├─ Average Order Value: Recalculated
└─ Timestamp: 10:30:00 UTC

📊 ANALYTICS DATA UPDATED
├─ Hourly Breakdown
│  └─ 10:00 AM: 3 orders, ₹12,000 revenue
├─ Category Breakdown
│  └─ Sports Equipment: +₹5,499
├─ Top Products
│  ├─ Cricket Bat: 5 orders
│  ├─ Cricket Ball: 3 orders
│  └─ Basketball: 2 orders
└─ Conversion Metrics
   └─ Cart to Order: Updated
```

**Every 10 Orders - Auto-Generate Report:**
```
📋 DAILY SUMMARY REPORT (Auto-generated)
├─ Date: 2026-04-05
├─ Total Orders: 10
├─ Total Revenue: ₹54,990
├─ Average Order Value: ₹5,499
├─ Order Success Rate: 95%
├─ Top Category: Sports Equipment (60%)
├─ Peak Order Time: 10:00-11:00 AM
└─ Report Sent To: finance@akhilsports.com
```

**If High-Value Order (>₹10,000):**
```
💰 FINANCE ALERT TRIGGERED
├─ Alert Type: HIGH_VALUE_ORDER
├─ Order ID: ORD-A1B2C3D4
├─ Amount: ₹15,000
├─ Items Count: 5
├─ Customer: Premium Member
├─ Action: 
│  ├─ Flag for priority processing
│  ├─ Notify accounts team
│  └─ Send special thank you email
└─ Sent To: finance-alerts@akhilsports.com
```

**Weekly Summary (Auto-generated Sundays):**
```
📊 WEEKLY BUSINESS REPORT (Week ending Apr 05, 2026)
├─ Total Orders: 67
├─ Total Revenue: ₹368,433
├─ Avg Order Value: ₹5,498
├─ Order Success Rate: 96%
├─ Payment Failures: 3 (4%)
├─ Top Selling Product: Cricket Bat (23 sold)
├─ Customer Satisfaction: 4.7/5.0
├─ Delivery Performance: 99.2% on-time
├─ Recommendation: Increase stock for Cricket Bats
└─ Generated: Sunday 10:00 AM (Auto-email to business team)
```

---

### 6️⃣ **Inventory Service Subscriber (CRITICAL!)**

**❌ PROBLEM THAT THIS SOLVES:**

Before event-driven system:
```
T+0s: Customer 1 sees "Cricket Bat in stock: 50 available"
T+1s: Customer 1 places order for 10 Cricket Bats ❌ (stock NOT reduced immediately)
T+2s: Customer 2 sees "Cricket Bat in stock: 50 available" 
      (WRONG! Should be 40, but system hasn't updated yet)
T+3s: Customer 2 places order for 20 Cricket Bats ✅ (succeeds, but oversells!)
T+5s: System updates stock to 20 ← TOO LATE! Double-sold 10 bats!
```

**✅ SOLUTION WITH EVENT-DRIVEN SYSTEM:**

```
T+0s: Order.Placed event published to message queue
T+1ms: Inventory Service receives event
T+2ms: Stock IMMEDIATELY reduced:
       Cricket Bat: 50 → 40 (Customer 1's 10 units reserved)
T+10ms: Customer 2 checks stock → Sees 40 available ✓ CORRECT!
T+11ms: Customer 2 sees true inventory, places order for 15 Bats
T+12ms: Order.Placed event published for Customer 2
T+13ms: Stock IMMEDIATELY updated:
       Cricket Bat: 40 → 25 (Customer 2's 15 units reserved) ✓ PRECISE!
```

**WHAT HAPPENS:**

```
📊 INVENTORY SERVICE - AUTO-REDUCTION PROCESS

Order Placed: ORD-A1B2C3D4
Items ordered:
├─ Cricket Bat - Premium x2
└─ Cricket Ball x1

🔴 STOCK BEFORE:
├─ Cricket Bat: Available=50, Reserved=0
└─ Cricket Ball: Available=100, Reserved=0

⚡ STOCK AUTO-REDUCTION (Triggered immediately):
├─ Cricket Bat: 50 - 2 = 48 available, +2 reserved
│  ├─ Status: STOCK REDUCED ✅
│  ├─ Product Page: Now shows 48 in stock
│  └─ Other customers: Can't order more than 48
│
└─ Cricket Ball: 100 - 1 = 99 available, +1 reserved
   ├─ Status: STOCK REDUCED ✅
   ├─ Product Page: Now shows 99 in stock
   └─ Other customers: Can't order more than 99

🟢 STOCK AFTER:
├─ Cricket Bat: Available=48, Reserved=2, Total=50 ✅
└─ Cricket Ball: Available=99, Reserved=1, Total=100 ✅

📊 INVENTORY LOG ENTRY:
├─ OrderID: ORD-A1B2C3D4
├─ Product: Cricket Bat - Premium
├─ Before: 50
├─ Ordered: 2
├─ After: 48
├─ Status action: "order_placed"
├─ Timestamp: 2026-04-05T10:30:00.000Z
└─ NEXT CUSTOMER GETS ACCURATE STOCK ✅
```

**Inventory Lifecycle:**

```
1️⃣ ORDER PLACED
   └─ Stock: RESERVED
      Cricket Bat: available=48, reserved=2

2️⃣ ORDER CANCELLED (if customer changes mind)
   └─ Stock: RESTORED
      Cricket Bat: available=50, reserved=0

3️⃣ ORDER DELIVERED (courier confirms)
   └─ Stock: FINALIZED
      Cricket Bat: sold (removed from both available & reserved)
```

**Critical Audit Trail:**

```
📋 INVENTORY TRANSACTION HISTORY (Last 24 hours)

ORD-A1B2C3D4 | Cricket Bat       | 50→48 | -2 | Reserved  | 10:30:00 ✅
ORD-A1B2C3D5 | Cricket Ball      | 100→99 | -1 | Reserved  | 10:32:15 ✅
ORD-A1B2C3D6 | Cricket Bat       | 48→46 | -2 | Reserved  | 10:35:22 ✅
ORD-A1B2C3D7 | Football          | 150→145 | -5 | Reserved  | 10:40:10 ✅
ORD-A1B2C3D3 | Cricket Bat       | 46→48 | +2 | Cancelled | 11:00:00 ❌
ORD-A1B2C3D8 | Badminton Shuttle | 200→200 | 0 | Failed (OOS) | 11:02:00 ❌
```

---

## 🎯 Complete Event Flow Sequence

### Customer Places Order for "Cricket Bat x2 + Cricket Ball x1" (₹5,499)

```
TIME    EVENT                           SERVICE(S)              STATUS
────────────────────────────────────────────────────────────────────────────
10:30:00  Checkout Submit               -                       -
10:30:01  Payment Processing            Payment Gateway        ✓ Success
10:30:02  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          Order.Placed Event Published
10:30:02  └─ Customer Service           Email/SMS/Push/In-app   ✓ Sent
10:30:02  └─ Seller Service             Packing Task Created    ✓ Pending
10:30:02  └─ Delivery Service           Assigned Partner        ✓ DP-4521
10:30:02  └─ Admin Service              Dashboard Updated       ✓ +1 Order
10:30:02  └─ Inventory Service          Stock Reduced: 🟢 ✓     
             Cricket Bat: 50→48
             Cricket Ball: 100→99
10:30:03  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ALL SERVICES COMPLETE (in parallel)
10:30:04  Customer receives Email       ✓
10:30:04  Customer receives SMS         ✓
10:30:05  Seller sees Dashboard Alert   ✓ "NEW ORDER! START PACKING"
10:30:06  Delivery Partner receives notification ✓ "Pickup Ready"
10:30:10  Admin Dashboard shows +1 Order, +₹5,499 Revenue ✓
```

---

## 📊 Testing & Observability

### Test the System:

**1. Place Order with Event Logging:**
```bash
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

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully and event published!",
  "orderId": "ORD-A1B2C3D4",
  "totalAmount": 5499,
  "paymentId": "PAY-XXXX",
  "note": "All services (Customer, Seller, Delivery, Admin, Inventory) processing in parallel"
}
```

**Watch Console Output:**
```
[ORDER PROCESSING] New order received
[STEP 1] VALIDATING ORDER
[STEP 2] PROCESSING PAYMENT ✅
[STEP 3] PUBLISHING ORDER.PLACED EVENT

📤 [EVENT] Published to topic: Order.Placed
   Event ID: EVT-xxx-yyy
   📢 [QUEUE] CustomerService subscribed to: Order.Placed
   🛍️ [CUSTOMER SERVICE] Processing Order ORD-A1B2C3D4
       📧 EMAIL SENT
       📱 SMS SENT
       🔔 PUSH NOTIFICATION SENT
       💬 IN-APP NOTIFICATION SAVED
   
   📢 [QUEUE] SellerService subscribed to: Order.Placed
   🏪 [SELLER SERVICE] Processing Order ORD-A1B2C3D4
       📊 SELLER DASHBOARD UPDATE
       📦 PACKING TASK CREATED
       🚨 SELLER ALERT SENT
   
   📢 [QUEUE] DeliveryService subscribed to: Order.Placed
   🚚 [DELIVERY SERVICE] Processing Order ORD-A1B2C3D4
       🚛 DELIVERY PARTNER DP-4521 PICKUP REQUEST
       ETA: 45 MINUTES
   
   📢 [QUEUE] AdminService subscribed to: Order.Placed
   👨‍💼 [ADMIN SERVICE] Processing Order ORD-A1B2C3D4
       📈 DASHBOARD METRICS UPDATED
       💰 FINANCE ALERT (if high-value)
   
   📢 [QUEUE] InventoryService subscribed to: Order.Placed
   📊 [INVENTORY SERVICE] Processing Order ORD-A1B2C3D4
       🔴 CRITICAL: Auto-reducing stock for ordered items...
       📉 Cricket Bat: 50 → 48
       📉 Cricket Ball: 100 → 99

✅ EVENT Delivered to 5 subscribers
✅ ORDER PROCESSING COMPLETE
```

---

## 🏗️ Architecture Advantages

✅ **Decoupled Services** - Each service is independent, can be scaled separately
✅ **Fault Tolerant** - If one service fails, others still process (no cascading failures)
✅ **Real-time** - All services process simultaneously, not sequentially
✅ **Scalable** - Can add new services without modifying existing code (subscribe pattern)
✅ **Observable** - Event log shows exactly what happened and when
✅ **Reliable** - Message queue guarantees delivery (with proper persistence)
✅ **Fast** - No waiting for responses, publish-and-forget pattern

---

## 📁 Files Created

```
backend/
├── services/
│   ├── messageQueue.js                 # Core event queue system
│   ├── customerService.js              # Customer notifications subscriber
│   ├── sellerService.js                # Seller dashboard & packing
│   ├── deliveryService.js              # Delivery partner assignment
│   ├── adminService.js                 # Analytics & reporting
│   └── inventoryServiceEvents.js       # Inventory auto-reduction
├── routes/
│   └── ordersEventDriven.js            # Event-driven order processing API
└── server.js                           # Updated with event routes
```

---

## API Endpoints

### 1. Place Order (Event-Driven)
```
POST /api/orders/event-driven
```

### 2. View Event Log
```
GET /api/orders/event-log
```

### 3. View Message Queue Statistics
```
GET /api/orders/event-stats
```

### 4. List All Orders
```
GET /api/orders/list
```

---

## Key Metrics Tracked

**Per-Order:**
- Order ID, Amount, Item Count, Customer
- Payment Status, Delivery Address
- Order Timestamp, Processing Duration

**Real-time Dashboard:**
- Total Orders Placed
- Total Revenue Generated
- Orders by Hour
- Top Products Sold
- Category Breakdown
- Delivery Performance

**Automatically Generated:**
- Daily Summary Report (every 10 orders)
- Weekly Business Report (Sundays)
- High-Value Order Alerts (>₹10,000)
- Inventory Transaction Audit Trail

---

## Next Steps

1. Run `npm install` in backend folder
2. Run `npm start` to start the server
3. Test with curl commands above
4. Watch console to see all 5 services processing in parallel
5. Check inventory auto-reduction in real-time

This is a **production-ready example** of modern microservices architecture! 🚀
