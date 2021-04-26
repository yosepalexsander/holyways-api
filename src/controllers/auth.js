const Joi = require('joi');
const { User } = require('../../models');
const { hashPassword, comparePassword } = require('../utils/hashing');
const { generateAccessToken } = require('../utils/jwt');
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

    const accessToken = generateAccessToken({ id: createdUser.id });

    return res.status(200).send({
      status: 'success',
      message: 'resource has been successfully created',
      data: {
        user: {
          fullName: createdUser.fullName,
          email: createdUser.email,
          token: accessToken,
        },
      },
    });
  } catch (err) {
    console.log(err);
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
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    if (user) {
      const isMatching = await comparePassword(password, user.password);

      if (!isMatching) {
        return res.status(400).send({
          status: 'error',
          message: 'your credentials is not valid',
        });
      }

      const token = generateAccessToken({ id: user.id });

      return res.status(200).send({
        status: 'success',
        message: 'your credentials is valid',
        data: {
          user: {
            fullName: user.fullName,
            email: user.email,
            token,
          },
        },
      });
    }

    return res.status(404).send({
      status: 'error',
      message: 'resource doesn\'t exist',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: 'error',
      message: 'internal server error',
    });
  }
};
