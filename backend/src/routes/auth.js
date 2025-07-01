import { Router } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../models/User.js';

export const authRouter = Router();

// POST /auth/login { email, password }
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

// POST /auth/logout
authRouter.post('/logout', (req, res) => {
  console.log('Logout for user:', req.session.userId);
  req.session.destroy(() => res.json({ ok: true }));
});

// guard
export function authRequired(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthenticated' });
  next();
}

// GET /auth/me
authRouter.get('/me', (req, res) => {
  console.log('/auth/me called');
  console.log('Session ID:', req.sessionID);
  console.log('Session data:', req.session);
  console.log('User ID in session:', req.session.userId);
  
  if (!req.session.userId) {
    console.log('No user ID in session - returning 401');
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  
  console.log('User authenticated:', req.session.userId);
  res.json({ id: req.session.userId });
});
