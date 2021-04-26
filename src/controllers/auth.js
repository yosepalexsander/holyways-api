const Joi = require('joi');
const { User } = require('../../models');
const { hashPassword, comparePassword } = require('../utils/hashing');
/**
 * Handling user register
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
exports.register = async (req, res) => {
  const { email, fullName, password } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().min(10)
      .max(30)
      .required(),
    fullName: Joi.string().min(10).max(50).required(),
    password: Joi.string().min(8).max(50).required(),

  });

  const { error } = schema.validate({ email, fullName, password });

  if (error) {
    return res.status(400).send({
      status: 'error',
      message: error.details[0].message,
    });
  }

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      return res.status(400).send({
        status: 'error',
        message: 'resource has already exist',
      });
    }
    const hashedPassword = await hashPassword(password);

    const createdUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });

    return res.status(200).send({
      status: 'success',
      message: 'resource has been successfully created',
      data: {
        user: {
          fullName: createdUser.fullName,
          email: createdUser.email,
          password: createdUser.password,
        },
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: 'error',
      message: 'internal server error',
    });
  }
};

/**
 * Handling user login
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    });

    if (user) {
      const isMatching = comparePassword(password, user.password);

      if (!isMatching) {
        return res.status(400).send({
          status: 'error',
          message: 'your credentials is not valid',
        });
      }
      return res.status(200).send({
        status: 'success',
        message: 'your credentials is valid',
        data: user,
      });
    }

    return res.status(404).send({
      status: 'error',
      message: 'resource doesn\'t exist',
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      message: 'internal server error',
    });
  }
};
