const { User } = require('../../models');

/**
 * Handling request for get all user
 * @param {Request} req client request
 * @param {Response} res server response
 * @returns
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });
    return res.status(200).send({
      status: 'success',
      message: 'resources has successfully get',
      data: {
        users,
      },
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      message: 'internal server error',
    });
  }
};

/**
 * Handling request for get user
 * @param {Request} req client request
 * @param {Response} res server response
 * @returns
 */

exports.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });
    return res.status(200).send({
      status: 'success',
      message: 'resources has successfully get',
      data: {
        user,
      },
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      message: 'internal server error',
    });
  }
};

/**
 * Handling request for update user
 * @param {Request} req client request
 * @param {Response} res server response
 * @returns
 */

exports.updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });

    if (!user) {
      return res.status(404).send({
        status: 'error',
        message: 'resource doesn\'t exist',
      });
    }

    await User.update(
      req.body,
      {
        where: {
          id,
        },
      },
    );

    const updatedUser = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });
    return res.status(200).send({
      status: 'success',
      message: 'resources has successfully updated',
      data: {
        user: updatedUser,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      status: 'error',
      message: 'internal server error',
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (user) {
      await User.destroy({
        where: {
          id,
        },
      });

      return res.status(200).send({
        status: 'success',
        message: 'resources has successfully deleted',
        data: {
          id: 1,
        },
      });
    }

    return res.send(404).send({
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
