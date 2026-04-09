# Installation Guide

## Prerequisites

### 1. Node.js (Required for Backend)

**Download & Install from:** https://nodejs.org/

Choose **LTS (Long Term Support)** version.

**Verify installation:**
```bash
node --version
npm --version
```

Should output something like:
```
v18.17.0
9.8.1
```

### 2. Browser (For Frontend)

Any modern browser works:
- Chrome/Edge (Recommended)
- Firefox
- Safari

---

## Setup Instructions

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- `express` - Web server framework
- `cors` - Cross-origin request handling
- `body-parser` - JSON parsing
- `uuid` - Unique ID generation
- `dotenv` - Environment variables

**Expected output:**
```
added 64 packages, and audited 65 packages in 5s
```

### Step 2: Start Backend Server

```bash
npm start
```

**Expected output:**
```
╔════════════════════════════════════════════════╗
║  AKHIL SPORTS BACKEND - Order Processing API  ║
║  Server running on http://localhost:3000       ║
║  Mock Payment + Inventory + Notifications     ║
╚════════════════════════════════════════════════╝
```

Leave this terminal running. Backend is now ready! ✅

### Step 3: Open Frontend

In another terminal or file explorer:
```bash
start akhil_sports_website.html
```

Or manually:
1. Open file explorer
2. Navigate to your project folder
3. Double-click `akhil_sports_website.html`

**Expected:**
- Website opens in your default browser
- Ready to use! ✅

---

## Testing the Complete Flow

### Login

1. Click "Login" button
2. Enter:
   - Email: `customer@akhilsports.com`
   - Password: `password123`

### Place an Order

1. Browse products
2. Add items to cart
3. Go to cart
4. Click "Proceed to Checkout"
5. Fill in delivery details
6. Click "Place Order"

### Watch the Flow

Open **DevTools** (Press `F12`) and look at:

**Browser Console:**
```
🛒 [CHECKOUT] Customer: Harish Babu
📤 [API] Sending order to server...
✅ Backend available - using API
✅ [API] Order placed successfully
```

**Server Terminal** (where npm start runs):
```
🌐 [STEP 1] API Gateway - Request received
🔐 [STEP 2] Auth Check - Complete
📋 [STEP 3] Order Validation
📦 [STEP 4] Inventory Check
💳 [STEP 5] Payment Processing
✅ Payment SUCCESS
✅ [DATABASE] Order saved
🔔 [NOTIFICATIONS] Sending notifications...
   📧 Email sent
   📱 SMS sent
   🏭 Warehouse queue updated
```

---

## Troubleshooting

### "npm is not recognized"

**Solution:** Install Node.js from https://nodejs.org/

After installation, restart your terminal.

### "Port 3000 already in use"

**Solution 1:** Kill the existing process:
```bash
# Windows
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /pid %a /f

# Or edit backend/server.js and change PORT
```

**Solution 2:** Use different port:
```javascript
// In backend/server.js
const PORT = 3001;  // instead of 3000
```

Then update `js/apiService.js`:
```javascript
const API_BASE_URL = 'http://localhost:3001/api';  // Updated port
```

### "CORS error when placing order"

**Solution:** 
- Make sure backend is running (`npm start`)
- Backend should be running on `http://localhost:3000`
- Frontend should be opened from the project folder

### "Stuck on 'Processing order...'"

The backend might be processing. Check:
1. Server terminal for any errors
2. Browser console (F12) for error messages
3. Try placing order again

---

## File Checklist

After setup, you should have:

```
✅ akhilsports/
   ✅ akhil_sports_website.html (Frontend)
   ✅ js/ (JavaScript modules)
   ✅ backend/ (Backend API)
      ✅ node_modules/ (After npm install)
      ✅ package.json
      ✅ server.js
      ✅ routes/
      ✅ middleware/
      ✅ services/
      ✅ README.md
```

---

## What Happens Behind the Scenes

When you place an order:

1. **Frontend** validates form and sends to API
2. **Backend** receives request
3. **Auth** validates your token
4. **Order validation** checks if data is complete
5. **Inventory** confirms items are in stock
6. **Payment** processes transaction
7. **Database** saves order
8. **Notifications** send email/SMS
9. **Warehouse** gets order for packing
10. **Frontend** shows success page

All of this happens in ~2 seconds!

---

## Next Steps

- Read `SETUP.md` for detailed flow documentation
- Read `backend/README.md` for API documentation
- Try different scenarios (out of stock, payment fail, etc.)
- Explore the code to understand the architecture

---

**Questions?** Check the console logs - they show exactly what's happening at each step!
