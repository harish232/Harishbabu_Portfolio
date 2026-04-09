# Akhil Sports - Complete Order Processing System

Complete production-grade e-commerce backend with mock order processing, payment validation, inventory management, and parallel notifications.

## What's Included

### ✅ Frontend (Already Set Up)
- HTML/CSS/JavaScript responsive e-commerce UI
- Product browsing, search, filtering
- Shopping cart management
- Checkout with address management
- Customer dashboard
- Admin dashboard
- localStorage fallback for offline support

### ✅ Backend (New - Mock Implementation)
- Node.js + Express API server
- Auth token validation
- Complete order processing flow:
  - Order validation
  - Inventory checking
  - Mock payment processing
  - Database storage
  - Parallel email/SMS/warehouse notifications
- Detailed console logging for each step
- Comprehensive error handling

## Quick Start

### 1️⃣ Start the Backend Server

```bash
cd backend
npm install
npm start
```

You should see:
```
╔════════════════════════════════════════════════╗
║  AKHIL SPORTS BACKEND - Order Processing API  ║
║  Server running on http://localhost:3000       ║
║  Mock Payment + Inventory + Notifications     ║
╚════════════════════════════════════════════════╝
```

### 2️⃣ Open Frontend

Open `akhil_sports_website.html` in your browser.

### 3️⃣ Test the Complete Flow

1. **Login** with:
   - Email: `customer@akhilsports.com`
   - Password: `password123`

2. **Add items to cart** and proceed to checkout

3. **Watch the console** as your order processes through all steps

## Complete Order Processing Flow

When you place an order, here's exactly what happens:

```
CUSTOMER CLICKS "Place Order"
          ↓
    [FRONTEND]
    • Collects order data
    • Form validation
    • Sends to API
          ↓
    [BACKEND - Step 1] 🌐 API Gateway
    • Request received
    • Load balancer routes to server
          ↓
    [BACKEND - Step 2] 🔐 Auth Check
    • Validates JWT token
    • Rejects if invalid
          ↓
    [BACKEND - Step 3] 📋 Order Validation
    • Checks if items exist
    • Verifies customer info
    • Ensures address is complete
          ↓
    [BACKEND - Step 4] 📦 Inventory Check
    • Queries database for stock
    • Confirms quantities available
    • ❌ FAILS if out of stock → Order rejected
          ↓
    [BACKEND - Step 5] 💳 Payment Processing
    • Calls mock payment gateway
    • Simulates card processing
    • ❌ FAILS if payment declined → No charge, order rejected
          ↓
    [BACKEND - Step 6] 💾 Database Save
    • Generates unique Order ID
    • Saves to database
    • Creates order record
          ↓
    [BACKEND - Step 7] 🔄 PARALLEL EXECUTION
    ├→ Email: Sends confirmation email
    ├→ SMS: Sends delivery notification
    └→ Warehouse: Adds to fulfillment queue
          ↓
    [FRONTEND]
    • Shows success page
    • Displays order ID
    • Shows order summary
    • Clears cart
```

## Testing Different Scenarios

### Scenario 1: Successful Order ✅

1. Log in
2. Add "English Willow Bat" (45 in stock)
3. Add "Football" (120 in stock)
4. Clear cart, re-add items
5. Proceed to checkout
6. Enter valid delivery info
7. Check console logs → See all steps complete
8. Success page shows order and summary

**Expected Result:**
```
🌐 [STEP 1] API Gateway - Request received
🔐 [STEP 2] Auth Check - Complete
📋 [STEP 3] Order Validation
✅ [STEP 4] Inventory Check - All items in stock
💳 [STEP 5] Payment Processing
✅ Payment SUCCESS
✅ [DATABASE] Order saved
🔔 [NOTIFICATIONS] Email, SMS, Warehouse notifications sent
```

### Scenario 2: Out of Stock ❌

1. Add "Tennis Racket" (0 in stock) to cart
2. Proceed to checkout
3. Enter valid info
4. Click Place Order

**Expected Result:**
```
❌ [STEP 4] Inventory Check FAILED
   Tennis Racket - Requested: 1, Available: 0
❌ [ORDER FAILED] Error during processing
   Message: Out of stock
   Rollback: Order NOT saved to database
   Rollback: No payment charged
```

Error message shown to customer: "Tennis Racket - Requested: 1, Available: 0"

### Scenario 3: Payment Declined ❌

The mock payment gateway randomly fails ~5% of transactions:

1. Add items to cart
2. Proceed to checkout
3. Click "Place Order"
4. Sometimes you'll see: Payment declined error

**Expected Result:**
```
💳 [STEP 5] Payment Processing...
❌ [PAYMENT] Payment FAILED for order
   Error: Payment declined by gateway - Card declined
❌ [ORDER FAILED] Error during processing
   Rollback: Order NOT saved
```

### Scenario 4: Backend NOT Running (Fallback) 📱

1. Close the backend server
2. Try to place an order
3. Browser falls back to localStorage

**Expected Result:**
- Order still saves locally
- Works offline
- Syncs to backend when it comes back online

## Console Output Details

Open **Browser DevTools** (F12) and look for:

`[CHECKOUT]` messages - Frontend logging
`[API]` messages - API communication
`[STEP X]` messages - Backend processing steps

Example output:
```
🛒 [CHECKOUT] Customer: Harish Babu Phone: 9876543210 Total: ₹3757
📤 [API] Sending order to server...
✅ Backend available - using API
✅ [API] Order placed successfully: AS-1705316245-ABC123

[In Server Console:]
🌐 [STEP 1] API Gateway - Request received
Load Balancer - Routing to server instance 1
🔐 [STEP 2] Auth Check - Token valid for user: customer@akhilsports.com
📋 [STEP 3] Order Validation
   ✅ Order has 2 items
   ✅ Customer: Harish Babu
   ✅ Amount: ₹3757
📦 [STEP 4] Inventory Check
   ✅ English Willow Bat - Available: 45
   ✅ Football - Available: 120
💳 [STEP 5] Payment Processing...
✅ Payment SUCCESS - TXN: TXN-1705316...
✅ [DATABASE] Order saved with ID: AS-1705316245-ABC123
🔔 [NOTIFICATIONS] Sending parallel notifications...
   📧 [EMAIL] Order confirmation sent
   📱 [SMS] Notification sent
   🏭 [WAREHOUSE] Order added to fulfillment queue
```

## Database/Inventory Status

**Check inventory in real time:**

```bash
curl http://localhost:3000/api/orders/inventory-status
```

Response:
```json
{
  "1": { "productId": 1, "name": "English Willow Bat", "stock": 45 },
  "2": { "productId": 2, "name": "Football", "stock": 120 },
  "3": { "productId": 3, "name": "Badminton Racket", "stock": 8 },
  "4": { "productId": 4, "name": "Basketball", "stock": 25 },
  "5": { "productId": 5, "name": "Tennis Racket", "stock": 0 }
}
```

**Get all orders:**

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/orders/list
```

## Architecture

```
┌─────────────────────────────────────────────┐
│         Frontend (HTML/CSS/JS)              │
│  • UI Components                            │
│  • Form Validation                          │
│  • Local Storage Cache                      │
└────────────┬────────────────────────────────┘
             │ HTTP REST API
             ↓
┌─────────────────────────────────────────────┐
│      Backend Server (Node.js Express)       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │      API Gateway / Load Balancer    │   │
│  └──────────┬──────────────────────────┘   │
│             ↓                               │
│  ┌─────────────────────────────────────┐   │
│  │  Auth Middleware (JWT Validation)   │   │
│  └──────────┬──────────────────────────┘   │
│             ↓                               │
│  ┌─────────────────────────────────────┐   │
│  │  Routes (Orders, Auth)              │   │
│  │  ├─ Order Validation                │   │
│  │  ├─ Inventory Service               │   │
│  │  ├─ Payment Service                 │   │
│  │  └─ Notification Service            │   │
│  └──────────┬──────────────────────────┘   │
│             ↓                               │
│  ┌────────┬────────┬──────────────────┐    │
│  ↓        ↓        ↓                  ↓    │
│ Email   SMS   Warehouse Orders Database    │
│ Service Service  Queue                     │
│                                             │
└─────────────────────────────────────────────┘
```

## Project Structure

```
akhilsports/
├── akhil_sports_website.html    ← Frontend (open in browser)
├── js/
│   ├── utils.js
│   ├── data.js
│   ├── apiService.js            ← NEW: API communication
│   ├── ui.js
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── location.js
│   ├── checkout.js              ← UPDATED: Uses API
│   └── admin.js
└── backend/                     ← NEW: Express API Server
    ├── server.js                ← Start here: npm start
    ├── package.json
    ├── README.md
    ├── routes/
    │   ├── orders.js            ← Order processing flow
    │   └── auth.js              ← Login/register
    ├── middleware/
    │   └── auth.js              ← JWT validation
    └── services/
        ├── orderService.js      ← Order business logic
        ├── paymentGateway.js    ← Mock payment processing
        ├── inventoryService.js  ← Stock management
        └── notificationService.js ← Email/SMS/warehouse
```

## Next Steps - Production Readiness

To convert this mock to production:

### 1. Database
Replace in-memory storage with actual database:
```javascript
// services/orderService.js
// Replace: let orders = []
// With: MongoDB/PostgreSQL connection

const mongoose = require('mongoose');
const Order = require('../models/Order');
```

### 2. Real Payment Gateway
```javascript
// services/paymentGateway.js
const razorpay = require('razorpay');
const instance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
```

### 3. Email/SMS Services
```javascript
// services/notificationService.js
const nodemailer = require('nodemailer');
const twilio = require('twilio');
```

### 4. Security
- Add rate limiting
- Implement proper JWT secrets
- Add CORS properly
- Use environment variables
- Add request logging

### 5. Deployment
- Docker containerization
- Kubernetes for scaling
- CI/CD pipeline
- Monitoring & alerts

## Troubleshooting

### Backend won't start
```
Error: Port 3000 already in use
Solution: 
- Kill process: netstat -ano | findstr :3000
- Or change PORT in server.js
```

### CORS errors when ordering
```
Error: No 'Access-Control-Allow-Origin'
Solution:
- Check if backend is running
- Check if URL is http://localhost:3000
- Frontend has CORS handling built in
```

### Payment always fails
```
Mock gateway set to fail ~5% of requests randomly.
Try multiple times - will eventually succeed.
```

### Can't see console logs
```
Open DevTools: Press F12 → Console tab
Server logs: Look at terminal running "npm start"
```

## Support

For issues:
1. Check the console logs (F12 → Console)
2. Check the server logs (where npm start runs)
3. Verify backend is running on port 3000
4. Check inventory status: curl http://localhost:3000/api/orders/inventory-status

---

**Built with:** Node.js, Express, Vanilla JavaScript, Mock Services
**Status:** Production-Ready Mock Implementation ✅
