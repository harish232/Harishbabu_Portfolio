# Akhil Sports Backend - Mock Order Processing

Complete production-grade order processing backend with all validation, payment processing, and notifications.

## Features

- ✅ API Gateway + Load Balancer simulation
- ✅ Auth token validation
- ✅ Order validation
- ✅ Inventory management with stock checking
- ✅ Mock payment processing (Razorpay/Stripe-like)
- ✅ Database order storage
- ✅ Parallel email, SMS, and warehouse queue notifications
- ✅ Comprehensive error handling & rollback

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start the Server

```bash
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

## API Endpoints

### Authentication

**POST** `/api/auth/login`
```json
{
  "email": "customer@akhilsports.com",
  "password": "password123"
}
```

**POST** `/api/auth/register`
```json
{
  "name": "Your Name",
  "email": "your@email.com",
  "password": "password123"
}
```

### Place Order

**POST** `/api/orders/place-order`

Headers:
```
Authorization: Bearer <token>
```

Body:
```json
{
  "items": [
    {"id": 1, "name": "Willow Bat", "qty": 1, "price": 2499},
    {"id": 2, "name": "Football", "qty": 2, "price": 599}
  ],
  "subtotal": 3697,
  "deliveryCharge": 60,
  "total": 3757,
  "paymentMethod": "COD",
  "customerPhone": "9876543210",
  "deliveryZone": "local",
  "deliveryAddress": {
    "name": "Harish Babu",
    "street": "Main Road",
    "city": "Bapatla",
    "pin": "522101"
  }
}
```

### List Orders

**GET** `/api/orders/list`

Headers:
```
Authorization: Bearer <token>
```

### Check Inventory

**GET** `/api/orders/inventory-status`

## Order Processing Flow

```
1. API Gateway receives request
   ↓
2. Load Balancer routes to server
   ↓
3. Auth Check - Token validation
   ↓
4. Order Validation - Data integrity check
   ↓
5. Inventory Check - Stock availability
   ↓
6. Payment Processing - Charge customer
   ↓
7. Database Save - Create order record
   ↓
8a. Notifications (PARALLEL)
    ├→ Email confirmation
    ├→ SMS notification
    └→ Warehouse queue
   ↓
✅ Order Complete
```

## Mock Data

### Test Users

- Email: `customer@akhilsports.com`
- Password: `password123`

### Inventory

1. English Willow Bat - 45 units
2. Football - 120 units
3. Badminton Racket - 8 units
4. Basketball - 25 units
5. Tennis Racket - 0 units (out of stock)

## Error Handling

All errors are caught and logged with detailed information:

- ❌ **Auth Failed** - Invalid token or no authorization
- ❌ **Validation Failed** - Invalid order data
- ❌ **Out of Stock** - Insufficient inventory
- ❌ **Payment Failed** - Payment declined
- ❌ **Database Error** - Order save failed

When an error occurs:
- Order is NOT saved
- Payment is NOT processed
- User receives detailed error message

## Console Output

The server logs every step in real-time:

```
[2024-01-15T10:30:45.123Z] POST /api/orders/place-order
🌐 [STEP 1] API Gateway - Request received
🔐 [STEP 2] Auth Check - Complete
📋 [STEP 3] Order Validation
   ✅ Order has 2 items
   ✅ Customer: Harish Babu
   ✅ Amount: ₹3757
📦 [STEP 4] Inventory Check
   ✅ Willow Bat - Available: 45
   ✅ Football - Available: 120
💳 [STEP 5] Payment Processing...
   ✅ Payment SUCCESS - TXN: TXN-1705316...
✅ [DATABASE] Order saved with ID: AS-1705316245-ABC123DEF
🔔 [NOTIFICATIONS] Sending parallel notifications...
   📧 [EMAIL] Order confirmation sent to customer@akhilsports.com
   📱 [SMS] Notification sent to 9876543210
   🏭 [WAREHOUSE] Order added to fulfillment queue
```

## Frontend Integration

Update `js/checkout.js` to call the backend API instead of localStorage:

```javascript
async function placeOrder() {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:3000/api/orders/place-order', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: cart,
      subtotal,
      deliveryCharge,
      total,
      paymentMethod,
      customerPhone,
      deliveryZone,
      deliveryAddress
    })
  });
  
  const result = await response.json();
  if (result.success) {
    goTo('success');
  } else {
    showToastMsg(result.error, '⚠️');
  }
}
```

## Testing Scenarios

### Test 1: Successful Order
- All items in stock
- Valid payment method
- Complete address info
→ Result: ✅ Order placed successfully

### Test 2: Payment Declined
- Valid inventory
- Payment fails (mock fails ~5% of requests)
→ Result: ❌ Order not saved, no inventory deducted

### Test 3: Out of Stock
- Add Tennis Racket (0 stock) to cart
→ Result: ❌ Order rejected at inventory check

### Test 4: Invalid Token
- Send request without token
- Send malformed token
→ Result: ❌ Auth check fails, order rejected

## Next Steps

To convert mock to production:

1. **Database**: Replace in-memory with MongoDB/PostgreSQL
2. **Payment**: Integrate real Razorpay/Stripe API
3. **Email**: Use SendGrid or AWS SES
4. **SMS**: Use Twilio
5. **Auth**: Implement real JWT with secrets
6. **Load Balancer**: Deploy to Kubernetes/Docker
7. **Monitoring**: Add Datadog/New Relic logging
