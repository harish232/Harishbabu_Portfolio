const express = require('express');
const router = express.Router();

// Mock user database
const users = {
  'customer@akhilsports.com': {
    id: 'user_1',
    name: 'Harish Babu',
    email: 'customer@akhilsports.com',
    password: 'password123'
  }
};

// Mock generate token (simple Base64 JWT-like format)
function generateToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ 
    id: user.id, 
    email: user.email, 
    name: user.name,
    iat: Date.now()
  })).toString('base64');
  const signature = Buffer.from('mock-signature').toString('base64');
  return `${header}.${payload}.${signature}`;
}

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log(`🔐 [AUTH] Login attempt for ${email}`);

  const user = users[email];
  
  if (!user || user.password !== password) {
    console.log(`❌ [AUTH] Login failed - invalid credentials`);
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  const token = generateToken(user);
  console.log(`✅ [AUTH] Login successful - Token issued`);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// Registration endpoint (mock)
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  console.log(`📝 [AUTH] Registration attempt for ${email}`);

  if (users[email]) {
    console.log(`❌ [AUTH] Registration failed - email already exists`);
    return res.status(409).json({
      success: false,
      error: 'Email already registered'
    });
  }

  const user = {
    id: `user_${Date.now()}`,
    name,
    email,
    password
  };

  users[email] = user;
  const token = generateToken(user);

  console.log(`✅ [AUTH] Registration successful`);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

module.exports = router;
