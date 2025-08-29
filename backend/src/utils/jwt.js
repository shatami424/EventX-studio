import jwt from 'jsonwebtoken';

export const signToken = (payload, opts = {}) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d', ...opts });

export const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
