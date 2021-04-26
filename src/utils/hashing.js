const bcrypt = require('bcrypt');

const SALT_ROUND = 10;

/**
 * Hashing password utils
 * @param {String} password password entered by client
 * @returns {Promise<String>} hashed password
 */
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUND);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
 * Compare password from request and from database
 * @param {String} passwordEntered
 * @param {String} hashedPassword
 * @returns {Promise<Boolean} matching result
 */
exports.comparePassword = async (passwordEntered, hashedPassword) => {
  const match = await bcrypt.compare(passwordEntered, hashedPassword);
  return match;
};
