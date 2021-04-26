const jwt = require('jsonwebtoken');

/**
 *  generate access token
 * @param {string|object} user
 * @returns {string} access token
 */
exports.generateAccessToken = (user) => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

/**
 *  verify access token
 * @param {string} token access token
 * @returns {string|object} user
 */
exports.verifyToken = (token) => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
