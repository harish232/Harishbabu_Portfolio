const nodemailer = require('nodemailer');

// Configure your email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your_app_password' 
  }
});

exports.sendOrderConfirmation = async (customerEmail, orderName, orderId, total) => {
  if (!customerEmail) return false;

  const mailOptions = {
    from: '"Akhil Sports Bapatla" <noreply@akhilsports.com>',
    to: customerEmail,
    subject: `Order Confirmed! Your Order ID is ${orderId}`,
    html: `
      <h2>Thank you for your order, ${orderName}!</h2>
      <p>We have successfully received your order <strong>#${orderId}</strong>.</p>
      <p><strong>Total Amount:</strong> ₹${total}</p>
      <p>Our team is packing your sports gear and it will be dispatched soon.</p>
      <br/>
      <p>Regards,<br/>Akhil Sports Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

exports.sendSaleAlert = async (customerEmail, customerName, productName, newPrice, oldPrice) => {
  if (!customerEmail) return false;

  const mailOptions = {
    from: '"Akhil Sports Alerts" <noreply@akhilsports.com>',
    to: customerEmail,
    subject: `🚨 Price Drop Alert: ${productName} is on sale!`,
    html: `
      <h2>Great news, ${customerName}!</h2>
      <p>An item on your wishlist just went on sale.</p>
      <p><strong>${productName}</strong> is now available for just <strong>₹${newPrice}</strong> (was ₹${oldPrice}).</p>
      <p>Grab it before it goes out of stock!</p>
      <br/>
      <a href="http://localhost:5500/akhil_sports_website.html" style="background:#D42B20;color:#fff;padding:10px 20px;text-decoration:none;font-weight:bold;">Shop Now</a>
      <p>Regards,<br/>Akhil Sports Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Sale alert email failed:', error);
    return false;
  }
};