# 🎯 Event-Driven System - Topic Details Reference

## CLICK ON EACH TOPIC TO EXPAND:

---

## 📌 Topic 1: Order.Placed

### When Triggered
- ✅ Payment processed successfully (95% success)
- ✅ Order data validated
- ✅ Order ID generated
- ❌ NOT triggered: if payment fails

### What Gets Published
```json
{
  "orderId": "ORD-A1B2C3D4",
  "customerId": "CUST-12345",
  "customerEmail": "customer@akhilsports.com",
  "customerPhone": "+91-98765-43210",
  "items": [
    {
      "id": "cricket-bat",
      "name": "Cricket Bat - Premium",
      "quantity": 2,
      "price": 2500,
      "category": "Sports Equipment"
    }
  ],
  "totalAmount": 5499,
  "deliveryAddress": "123 Main Street, Hyderabad 500001",
  "seller": "akhilsports-main",
  "timestamp": "2026-04-05T10:30:00.000Z"
}
```

### Who Subscribes (5 Services)
1. ✅ **CustomerService** → Sends notifications
2. ✅ **SellerService** → Creates packing task
3. ✅ **DeliveryService** → Assigns delivery partner
4. ✅ **AdminService** → Updates analytics
5. ✅ **InventoryService** → Reduces stock

### Processing Time
- ⏱️ Event published: 10:30:00
- ⏱️ All subscribers processed: 10:30:02 (within 2 seconds)
- 🚀 **Parallel execution** (not sequential!)

### Success Criteria
- ✅ Event reaches all 5 subscribers
- ✅ Each subscriber completes processing
- ✅ No failures block the order (fault-tolerant)

### Example Payload Sizes
```
Event Size: ~1.2 KB
Subscriber Responses: ~5 KB each
Total Queue Memory: ~30 KB per order
```

---

## 📌 Topic 2: Packing.Completed

### When Triggered
- ✅ Warehouse manager completes packing
- ✅ Items verified and sealed
- ✅ Barcode scanner scan confirms
- 🎯 Currently: Triggered automatically after 2 seconds (demo)

### What Gets Published
```json
{
  "orderId": "ORD-A1B2C3D4",
  "completeTime": "2026-04-05T10:30:02.000Z",
  "packingTaskId": "PKG-ORD-A1B2C3D4",
  "itemsProcessed": 3,
  "weight": "2.5 kg",
  "dimensions": "30x20x15 cm",
  "partnerId": "DP-4521"
}
```

### Who Subscribes (2 Services)
1. ✅ **DeliveryService** → Updates pickup status to "Ready"
2. ✅ **AdminService** → Updates packing metrics

### Workflow Impact
```
Before: Delivery partner waiting for status
         ├─ Status: "Pending acceptance"
         └─ ETA: Unknown

After Packing.Completed:
         ├─ Status: "Ready for pickup"
         ├─ Warehouse address sent
         ├─ ETA: 45 minutes to delivery
         └─ Partner heads to warehouse immediately ✓
```

### Use Cases
- 📦 Notify warehouse for pickup
- 📍 Update delivery map with pickup confirmation
- 📊 Track packing time metrics (efficiency)
- 🚚 Trigger delivery partner navigation

---

## 📌 Topic 3: Delivery.Completed

### When Triggered
- ✅ Delivery partner reaches destination
- ✅ Customer verifies items
- ✅ Signature/OTP confirmed
- ✅ Photo of delivery taken

### What Gets Published
```json
{
  "orderId": "ORD-A1B2C3D4",
  "partnerId": "DP-4521",
  "deliveryTime": "2026-04-05T11:15:00.000Z",
  "receivedBy": "Customer Name",
  "location": { "lat": 17.3850, "lng": 78.4867 },
  "photoProof": "base64_image_data",
  "deliveryNotes": "Left at door as requested"
}
```

### Who Subscribes (3 Services)
1. ✅ **AdminService** → Final metrics, delivery success
2. ✅ **InventoryService** → Finalize stock count
3. ✅ **CustomerService** (Optional) → Send delivery confirmation

### Inventory Impact
```
Before Delivery.Completed:
├─ Available: 50
├─ Reserved: 2 (Order still pending)
└─ Sold: 0

After Delivery.Completed:
├─ Available: 50
├─ Reserved: 0 (Released)
└─ Sold: 2 ✓ (Order finalized)
```

### Dashboard Updates
```
Metrics Updated:
├─ Total Delivered: +1
├─ Delivery Success Rate: ~99%
├─ Average Delivery Time: Recalculated
└─ Customer Rating: (auto-request sent)
```

---

## 📌 Topic 4: Order.Cancelled

### When Triggered
- ❌ Customer cancels within 1 hour
- ❌ Out of stock cancellation
- ❌ Payment reversal requested
- ❌ Seller cancels (rare)

### What Gets Published
```json
{
  "orderId": "ORD-A1B2C3D4",
  "reason": "customer_request",
  "cancelledAt": "2026-04-05T10:45:00.000Z",
  "refundAmount": 5499,
  "refundStatus": "initiated",
  "items": [
    { "id": "cricket-bat", "quantity": 2 }
  ]
}
```

### Who Subscribes (2 Services)
1. ✅ **InventoryService** → Restore stock
2. ✅ **AdminService** → Update cancellation metrics

### Stock Restoration
```
Order Cancelled for Cricket Bat x2

Before:
├─ Available: 48
├─ Reserved: 2
└─ Total: 50

After:
├─ Available: 50 ✓
├─ Reserved: 0
└─ Total: 50 (Restored!)
```

### Customer Notification
- 📧 Email: "Order #XXX cancelled. Refund initiated."
- 💰 Refund to original payment method
- 📲 In-app notification: "Your order has been cancelled"

---

## 📊 SUBSCRIBER SERVICE DETAILS

---

### 🛍️ **CustomerService** Subscriber

**Subscribes to:** Order.Placed, (Delivery.Completed)

**What it does:**
```
1. Parse Order.Placed event
   └─ Extract email, phone, items, amount

2. Send EMAIL
   ├─ Service: AWS SES / SendGrid
   ├─ Template: Order Confirmation
   ├─ Recipient: customerEmail from event
   ├─ Contains: Order ID, items, amount, tracking link
   └─ Retry: 3 times if failed

3. Send SMS
   ├─ Service: Twilio / AWS SNS
   ├─ Format: 160 characters max
   ├─ Contains: Order ID, tracking link
   └─ Retry: 2 times if failed

4. Send PUSH NOTIFICATION
   ├─ Service: Firebase Cloud Messaging
   ├─ Targets: iOS + Android apps
   ├─ Title: "✅ Order Placed Successfully!"
   ├─ Data Payload: orderId, amount
   └─ Priority: High

5. Save IN-APP NOTIFICATION
   ├─ Database: User notification center
   ├─ Type: "order_placed"
   ├─ Searchable by date/order ID
   └─ Mark as read when opened
```

**Error Handling:**
```
Email Failed?
└─ Retry after 5 minutes
└─ If still fails → Queue for manual crew
└─ Customer gets SMS + Push (ensures delivery)

SMS Failed?
└─ Retry immediately
└─ If fails → Alert admin (phone might be wrong)

Push Failed?
└─ Not critical (email/SMS already sent)
└─ Store for next app launch
```

**Timeline:**
```
T+0: Event received
T+100ms: Email sent
T+200ms: SMS sent
T+300ms: Push sent
T+400ms: In-app saved
→ Total: 400ms, customer has 4 touchpoints
```

---

### 🏪 **SellerService** Subscriber

**Subscribes to:** Order.Placed

**What it does:**
```
1. Create PACKING TASK
   ├─ Task ID: PKG-{orderId}
   ├─ Priority: Determine based on amount
   ├─ Items: List from order
   ├─ Due Time: 30 min (normal) / 15 min (urgent)
   └─ Queue: FIFO - first in, first out

2. Post to SELLER DASHBOARD
   ├─ Display: "🚨 NEW ORDER ALERT!"
   ├─ Show: Order ID, items, amount
   ├─ Action: "Start Packing Now" button
   └─ Color: Red if urgent, Yellow if normal

3. Send REAL-TIME ALERT
   ├─ Type: Push notification to seller app
   ├─ Sound: Alert tone (loud)
   ├─ Vibration: Pattern (enabled)
   ├─ Title: "NEW ORDER! ORD-XXX"
   └─ Actions: [View] [Dismiss]

4. Update SELLER METRICS
   ├─ Orders awaiting packing: +1
   ├─ Packing queue size: Recalculated
   └─ Estimated completion time: Updated
```

**High Priority Triggers (>₹10,000):**
```
Amount > ₹10,000?
├─ Priority: HIGH
├─ Color: RED in dashboard
├─ Packing Time: Reduced to 15 minutes
├─ Alert: Phone call to warehouse manager
├─ Position: Top of queue (priority)
└─ Seller receives 2 alerts (app + phone)
```

**Workflow for Seller:**
```
1. Receives alert "NEW ORDER!"
   └─ Clicks "View"

2. Dashboard shows:
   ├─ Items to pack (with images)
   ├─ Warehouse location to pick items from
   ├─ Packaging instructions
   └─ Button: "Mark as Packing"

3. Seller collects items
   ├─ Scans item barcodes
   ├─ Verifies quantity
   └─ System confirms: ✓

4. Seller packs items
   ├─ Scans packing box ID
   ├─ Puts seal
   └─ Clicks "Packing Complete"

5. System publishes: Packing.Completed
   └─ Delivery partner gets alert
```

---

### 🚚 **DeliveryService** Subscriber

**Subscribes to:** Order.Placed, Packing.Completed

**What it does:**

#### On Order.Placed:
```
1. ASSIGN DELIVERY PARTNER
   ├─ Algorithm: Find nearest partner to warehouse
   ├─ Criteria: Rating > 4.5, Available now
   ├─ Fallback: Next available partner
   └─ Assign: Partner ID (e.g., DP-4521)

2. CALCULATE ETA
   ├─ From: Warehouse location
   ├─ To: Delivery address
   ├─ Traffic: Real-time traffic API
   ├─ Base time: 30-120 minutes
   └─ Confidence: 85%

3. CREATE PICKUP REQUEST
   ├─ Fields: OrderID, CustomerName, Items count, 
   │  DeliveryAddress, ETA, RouteMap
   └─ Status: "PENDING_ACCEPTANCE"

4. SEND PICKUP NOTIFICATION TO PARTNER
   ├─ Alert: "🚛 NEW PICKUP REQUEST!"
   ├─ Show: Full order details, navigation
   ├─ Action: "Accept" or "Reject"
   └─ Timeout: Expires after 2 minutes
```

#### On Packing.Completed:
```
1. UPDATE PICKUP REQUEST STATUS
   ├─ Status: "READY_FOR_PICKUP"
   └─ Send updated notification to partner

2. SORT ROUTE OPTIMIZATION
   ├─ Current partner location
   ├─ Warehouse pickup point
   ├─ Multiple deliveries on route
   └─ Optimal order calculated
```

**Partner App Shows:**
```
┌─────────────────────────────────────┐
│ PICKUP REQUEST                      │
├─────────────────────────────────────┤
│ Order: ORD-A1B2C3D4                 │
│ Pickup: Warehouse Main, Hyderbad    │
│ Items: 3                            │
│ Delivery: 123 Main St, Hyderbad     │
│ Customer: +91-98765-43210           │
│                                     │
│ [ACCEPT]           [MAYBE]          │
└─────────────────────────────────────┘
```

**After Acceptance:**
```
Status Updates:
├─ T+0: Partner heading to warehouse
├─ T+15: "Partner arriving in 10 min" (SMS to customer)
├─ T+20: Partner at warehouse
├─ T+21: Package handed to partner
├─ T+22: Partner scans = "In Transit"
├─ T+45: Partner arriving delivery address
│        "Partner arriving in 2 min" (SMS)
├─ T+46: Delivered & photo taken
├─ T+47: Delivery.Completed event published
└─ T+50: Customer gets confirmation
```

---

### 👨‍💼 **AdminService** Subscriber

**Subscribes to:** Order.Placed, Delivery.Completed, Order.Cancelled

**What it does:**

#### On Order.Placed:
```
1. UPDATE REAL-TIME DASHBOARD
   ├─ totalOrders: +1
   ├─ totalRevenue: +amount
   ├─ ordersThisHour: +1
   ├─ selectedCategory: +amount
   └─ topProducts recognition

2. TRACK BY CATEGORY
   ├─ Sports Equipment: +5499
   ├─ Apparel: +0
   └─ Accessories: +0

3. TRACK BY HOUR
   ├─ 10:00 hour: +1 order
   ├─ Updates: Hourly bar chart

4. MONITOR FOR ALERTS
   Amount > ₹10,000?
   ├─ YES: Send FINANCE ALERT
   │  └─ "HIGH_VALUE_ORDER"
   │     To: finance@akhilsports.com
   └─ NO: Continue

5. CHECK THRESHOLD (Every 10 orders)
   Total orders % 10 == 0?
   ├─ YES: Generate DAILY REPORT
   │  ├─ Total orders today
   │  ├─ Total revenue
   │  ├─ Average order value
   │  ├─ Top products
   │  └─ Send to: business@akhilsports.com
   └─ NO: Continue
```

**Dashboard Metrics Updated:**
```
BEFORE ORDER:
├─ Total Orders: 42
├─ Total Revenue: ₹2,25,501
├─ Avg Order: ₹5,369

AFTER ORDER (₹5,499):
├─ Total Orders: 43 ✓
├─ Total Revenue: ₹2,31,000 ✓
├─ Avg Order: ₹5,372 (recalculated)
└─ Updated in: Real-time
```

**Automatic Report Triggers:**
```
10 orders placed?
└─ Generate "Daily Summary Report"
   ├─ Date
   ├─ Order count
   ├─ Revenue
   ├─ Top seller
   └─ Email to finance team

At End of Day (11:59 PM)?
└─ Generate "Daily Complete Report"

Every Sunday?
└─ Generate "Weekly Business Report"
   ├─ Total orders week
   ├─ Total revenue week
   ├─ Performance vs last week
   ├─ Recommendations
   └─ Email to CEO
```

---

### 📊 **InventoryService** Subscriber

**CRITICAL SERVICE** - Subscribes to: Order.Placed, Order.Cancelled, Delivery.Completed

**What it does (MOST IMPORTANT):**

#### On Order.Placed ⚡ IMMEDIATE EFFECT:
```
EVENT RECEIVED:
{
  items: [
    { id: "cricket-bat", quantity: 2 },
    { id: "cricket-ball", quantity: 1 }
  ]
}

FOR EACH ITEM:
1. Find: Current stock for this product
2. Reduce: available -= quantity
3. Increase: reserved += quantity
4. Update: Database IMMEDIATELY (< 5ms)
5. Log: Create audit entry
6. Verify: available >= 0 (prevent negative)

CRICKET BAT STOCK UPDATE:
├─ Before: available=50, reserved=0
├─ After: available=48, reserved=2
├─ Total: 50 (unchanged) ✓
├─ Updated in: < 5 milliseconds
├─ Database: Persistent (not in-memory)
└─ Other customers now see: 48 available ✓

CRICKET BALL STOCK UPDATE:
├─ Before: available=100, reserved=0
├─ After: Available=99, reserved=1
└─ Total: 100 ✓

AUDIT LOG ENTRY CREATED:
├─ OrderID: ORD-A1B2C3D4
├─ ProductID: cricket-bat
├─ Before: 50
├─ Ordered: 2
├─ After: 48
├─ Action: "order_placed"
└─ Timestamp: 2026-04-05T10:30:00.123Z
```

**Why This is Critical:**

❌ **WITHOUT Event-Driven Inventory:**
```
T+0: Customer A sees "50 available"
     Places order for 10
     
T+1: Stock NOT updated yet

T+2: Customer B sees "50 available" ← WRONG!
     Places order for 20
     
T+3: Customer C sees "50 available" ← WRONG!
     Places order for 25
     
T+10: System finally updates stock
      Total ordered: 55 ← OVERSOLD by 5! 📛
```

✅ **WITH Event-Driven Inventory:**
```
T+0: Customer A places order for 10
     Event published
     
T+5ms: Inventory reduced: 50 → 40 ✓

T+1: Customer B sees "40 available" ← CORRECT!
     Places order for 15
     
T+6ms: Inventory reduced: 40 → 25 ✓

T+2: Customer C sees "25 available" ← CORRECT!
     Orders 20
     
T+12ms: Inventory reduced: 25 → 5 ✓

Result: NO OVERSELLING, ACCURATE STOCK 📊✓
```

#### On Order.Cancelled:
```
Order ORD-A1B2C3D4 cancelled (customer request)

RESTORE STOCK:
├─ Cricket Bat: 48 + 2 = 50 ✓
├─ Cricket Ball: 99 + 1 = 100 ✓
└─ Status: available (no longer reserved)

AUDIT LOG ENTRY:
├─ OrderID: ORD-A1B2C3D4
├─ Action: "order_cancelled"
├─ ProductID: cricket-bat
├─ Quantity restored: 2
└─ Timestamp: 2026-04-05T10:35:00.000Z
```

#### On Delivery.Completed:
```
Package delivered successfully

FINALIZE STOCK:
├─ Cricket Bat Reserved: 2 → 0
├─ Cricket Bat Available: 48 (unchanged)
│  └─ Means: 2 bats have been sold (finalized)
│
└─ Scenario: These 2 cricket bats are no more
   available for any calculation

Stock Accounting:
├─ Available: 48 (can sell)
├─ Reserved: 0 (not reserved to any order)
├─ Sold: 2 (already delivered)
└─ Total in warehouse: 50 + (other orders' reservations)
```

**Stock Lifecycle Example (Complete Flow):**
```
SCENARIO: Stock of Cricket Bat through full lifecycle

INITIAL:
├─ Available: 100
├─ Reserved: 0
└─ Total: 100

ORDER 1 PLACED (10 units):
├─ Available: 90 (100-10)
├─ Reserved: 10
└─ Total: 100 ✓

ORDER 2 PLACED (8 units):
├─ Available: 82 (90-8)
├─ Reserved: 18 (10+8)
└─ Total: 100 ✓

ORDER 1 DELIVERED:
├─ Available: 82 (unchanged)
├─ Reserved: 8 (18-10)
└─ Sold: +10 items ✓

ORDER 2 CANCELLED:
├─ Available: 90 (82+8)
├─ Reserved: 0 (8-8)
└─ Never sold! ✓

FINAL STATE:
├─ Available: 90
├─ Reserved: 0
├─ Sold: 10
└─ Match: 90 + 10 = 100 ✓ (Accounting perfect!)
```

**Inventory Display Logic:**
```
What customers see on website:
└─ "Available: 90 in stock"
   └─ Calculated from: available _count
       └─ Does NOT include reserved

What system tracks:
├─ available: 90
├─ reserved: 0
└─ sold: 10
```

---

## 🧪 Test Scenarios

### Scenario 1: Happy Path ✅
```
Customer places ₹5,499 order for Cricket Bat x2

Timeline:
T+0: Order.Placed published
T+1ms: CustomerService sends 4 notifications ✓
T+1ms: SellerService creates packing task ✓
T+1ms: DeliveryService assigns partner ✓
T+1ms: AdminService updates dashboard ✓
T+1ms: InventoryService reduces stock ✓
T+2: Partnership.Completed (auto 2 sec)
T+10: Delivery assigned, ETA shown ✓

Result: SUCCESS (all 5 subscribers processed)
```

### Scenario 2: Out of Stock ❌
```
Customer tries to order Cricket Bat x50
Stock available: 48

Order.Placed event published
├─ InventoryService checks: 50 - 48 = need 2 more
├─ Action: PARTIAL FULFILLMENT or CANCEL
├─ Inventory tries to reserve 48 only
└─ Customer email: "Only 48 available, reserved."

Result: Inventory prevents overselling ✓
```

### Scenario 3: High-Value Order 💰
```
Customer places ₹15,000 order

Order.Placed event triggered
├─ AdminService: Detects amount > ₹10,000
├─ AdminService: sends FINANCE ALERT
├─ SellerService: Sets PRIORITY=HIGH
├─ SellerService: 15-min packing SLA
├─ DeliveryService: Assigns top-rated partner
└─ All subscribers notified immediately

Result: Priority processing initiated ✓
```

---

## 📊 Monitoring & Observability

### Event Log (All Events Tracked):
```
GET /api/orders/event-log

Response:
{
  "totalEvents": 47,
  "events": [
    {
      "id": "EVT-001-ABC123...",
      "topic": "Order.Placed",
      "timestamp": "2026-04-05T10:30:00.000Z",
      "subscribers": ["CustomerService", "SellerService", "DeliveryService", "AdminService", "InventoryService"],
      "message": { ...orderData... }
    },
    ...
  ]
}
```

### Message Queue Statistics:
```
GET /api/orders/event-stats

Response:
{
  "topics": {
    "Order.Placed": {
      "eventCount": 10,
      "subscriberCount": 5
    },
    "Packing.Completed": {
      "eventCount": 9,
      "subscriberCount": 2
    },
    "Delivery.Completed": {
      "eventCount": 8,
      "subscriberCount": 3
    }
  },
  "totalEvents": 27
}
```

---

## 🎓 Learning Value

This system demonstrates:
- ✅ Event-driven architecture
- ✅ Pub-Sub pattern (Publisher-Subscriber)
- ✅ Message queues (Kafka/RabbitMQ simulation)
- ✅ Asynchronous processing
- ✅ Microservices integration
- ✅ Real-time data updates
- ✅ Fault tolerance
- ✅ Scalability patterns
- ✅ Audit trails
- ✅ Distributed systems

Perfect for understanding modern backend systems! 🚀
