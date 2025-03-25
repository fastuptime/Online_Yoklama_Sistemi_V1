const bcrypt = require('bcrypt');

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Verify password against hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if match, false otherwise
 */
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Check if user is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.status(401).redirect('/auth/login');
};

module.exports = {
  hashPassword,
  verifyPassword,
  isAuthenticated
};
