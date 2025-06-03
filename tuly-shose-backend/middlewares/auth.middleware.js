const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token missing' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.customerId = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};