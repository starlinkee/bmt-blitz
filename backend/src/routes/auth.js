const { Router } = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../../models/User.js');

const authRouter = Router();

// POST /auth/login { email, password }d
authRouter.post('/login', async (req, res) => {
  console.log('Login attempt:', req.body.email);
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  req.session.userId = user.id;
  console.log('Login successful for user:', user.id);
  res.json({ ok: true });
});

// POST /auth/logoutt
authRouter.post('/logout', (req, res) => {
  console.log('Logout for user:', req.session.userId);
  req.session.destroy(() => res.json({ ok: true }));
});

// guard
function authRequired(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthenticated' });
  next();
}

// GET /auth/me
authRouter.get('/me', (req, res) => {
  console.log('🔍 /auth/me called');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌐 Headers:', req.headers);
  console.log('🍪 Cookies:', req.headers.cookie);
  console.log('🆔 Session ID:', req.sessionID);
  console.log('📊 Session data:', req.session);
  console.log('👤 User ID in session:', req.session.userId);
  
  if (!req.session.userId) {
    console.log('❌ No user ID in session - returning 401');
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  
  console.log('✅ User authenticated:', req.session.userId);
  console.log('📤 Sending response with user ID');
  res.json({ id: req.session.userId });
});

module.exports = { authRouter, authRequired };
