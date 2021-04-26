const { verifyToken } = require('../utils/jwt');

exports.authentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({
      status: 'error',
      message: 'access denied, token is missing',
    });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(400).send({
      status: 'error',
      message: 'invalid token',
    });
  }
};
