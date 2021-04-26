const jwt = require('jsonwebtoken');

/**
 *  generate access token
 * @param {string} user
 * @returns {string} access token
 */
exports.generateAccessToken = (user) => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

/**
 *  generate refresh token
 * @param {string} user
 * @returns {string} refresh token
 */
exports.generateRefreshToken = (user) => jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

/**
 *  verify access token
 * @param {string} token access token
 * @returns {strin|object} user
 */
exports.verifyToken = (token) => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
