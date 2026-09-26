import jwt from 'jsonwebtoken';
import { state } from '../data/store.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }
    next();
  };
}

export function getMentorById(id) {
  return state.mentors.find((mentor) => mentor.id === Number(id));
}
