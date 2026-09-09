const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. Token is missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_ai_career_assistant_2026';
    
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
    }

    // Fetch user from db
    const userResult = await db.query('SELECT id, email, full_name, role FROM users WHERE id = $1', [decoded.id]);
    if (!userResult.rows || userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized. User account not found.' });
    }

    req.user = userResult.rows[0];
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(500).json({ error: 'Internal authentication server error.' });
  }
};

module.exports = authMiddleware;
