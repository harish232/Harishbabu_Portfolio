const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay with real keys from .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_REPLACE_WITH_YOUR_LIVE_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'REPLACE_WITH_YOUR_LIVE_KEY_SECRET'
});

/**
 * Create a real order in Razorpay
 */
exports.createOrder = async (amountInRupees, receiptId) => {
  try {
    const options = {
      amount: amountInRupees * 100, // Razorpay uses paise
      currency: "INR",
      receipt: receiptId
    };
    const order = await razorpay.orders.create(options);
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Razorpay Error:', error);
    return { success: false, error: 'Payment gateway failed' };
  }
};

/**
 * Verify payment signature after customer pays
 */
exports.verifyPayment = (razorpayOrderId, razorpayPaymentId, signature) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'REPLACE_WITH_YOUR_LIVE_KEY_SECRET';
  
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest('hex');

  return generatedSignature === signature;
};