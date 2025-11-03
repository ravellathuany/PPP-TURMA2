const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-eduquiz';

function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, role, name, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

module.exports = {
  authMiddleware,
  requireRole,
  JWT_SECRET
};
