import { Router } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../models/User.js';

export const authRouter = Router();

// POST /auth/login { email, password }
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  req.session.userId = user.id;
  res.json({ ok: true });
});

// POST /auth/logout
authRouter.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// guard
export function authRequired(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthenticated' });
  next();
}
