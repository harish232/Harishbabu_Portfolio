const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  console.log('📋 [AUTH CHECK] Validating token...');
  
  if (!token) {
    console.log('❌ [AUTH] No token provided');
    return res.status(401).json({
      success: false,
      error: 'Missing authorization token',
      step: 'auth_check'
    });
  }

  // Mock token validation - check if it's a valid JWT format
  const tokenParts = token.split('.');
  if (tokenParts.length !== 3) {
    console.log('❌ [AUTH] Invalid token format');
    return res.status(401).json({
      success: false,
      error: 'Invalid token format',
      step: 'auth_check'
    });
  }

  try {
    // Decode base64 payload (mock JWT)
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    req.user = payload;
    console.log(`✅ [AUTH] Token valid for user: ${payload.email}`);
    next();
  } catch (e) {
    console.log('❌ [AUTH] Token decode failed');
    return res.status(401).json({
      success: false,
      error: 'Token validation failed',
      step: 'auth_check'
    });
  }
};

module.exports = { validateToken };
