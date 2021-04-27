const { literal } = require('sequelize');
// eslint-disable-next-line no-unused-vars
const { Request, Response } = require('express');
const {
  Fund, Donation,
} = require('../../models');

/**
 * Handling request for get all funds
 * @param {Request} req client request
 * @param {Response} res server response
 * @returns
 */
exports.getFunds = async (req, res) => {
  try {
    const funds = await Fund.findAll({
      include: [{
        model: Donation,
        as: 'usersDonate',
        attributes: [
          'id',
          [
            literal(`(
                SELECT user.fullName
                FROM users AS user
                WHERE user.id = usersDonate.donaturId
              )`), 'fullName',
          ],
          [
            literal(`(
                SELECT user.email
                FROM users AS user
                WHERE user.id = usersDonate.donaturId
              )`), 'email',
          ],
          'donateAmount',
          'status',
          'proofAttachment',
        ],
      }],
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });
    return res.status(200).send({
      status: 'success',
      message: 'resources has successfully get',
      data: {
        funds,
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
 * Handling request for get single fund
 * @param {Request} req client request
 * @param {Response} res server response
 * @returns
 */
exports.getFund = async (req, res) => {
  const { id } = req.params;

  try {
    const fund = await Fund.findOne({
      where: {
        id,
      },
      include: [{
        model: Donation,
        as: 'usersDonate',
        attributes: [
          'id',
          [
            literal(`(
                SELECT user.fullName
                FROM users AS user
                WHERE user.id = usersDonate.donaturId
              )`), 'fullName',
          ],
          [
            literal(`(
                SELECT user.email
                FROM users AS user
                WHERE user.id = usersDonate.donaturId
              )`), 'email',
          ],
          'donateAmount',
          'status',
          'proofAttachment',
        ],
      }],
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });
    return res.status(200).send({
      status: 'success',
      message: 'resources has successfully get',
      data: {
        fund,
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
 * Handling request for create fund
 * @param {Request} req client request
 * @param {Response} res server response
 * @returns
 */

exports.createFund = async (req, res) => {
  const { user, body } = req;
  try {
    const fund = await Fund.create({
      ...body,
      userId: user.id,
    });

    return res.status(200).send({
      status: 'success',
      message: 'resources has successfully get',
      data: {
        fund: {
          id: fund.id,
          title: fund.title,
          thumbnail: fund.thumbnail,
          goal: fund.goal,
          description: fund.description,
          usersDonate: [],
        },
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

/**
 * Handling request for create fund
 * @param {Request} req client request
 * @param {Response} res server response
 * @returns
 */
exports.updateFund = async (req, res) => {
  const {
    user,
    body,
    params: { id },
  } = req;

  try {
    const fund = await Fund.findOne({
      where: {
        id,
      },
    });

    if (user.id !== fund.userId) {
      return res.status(401).send({
        status: 'error',
        message: 'acces denied',
      });
    }

    await Fund.update(
      body,
      {
        where: {
          id,
        },
      },
    );

    const updatedFund = await Fund.findOne({
      where: {
        id,
      },
      include: [{
        model: Donation,
        as: 'usersDonate',
        attributes: [
          'id',
          [
            literal(`(
                SELECT user.fullName
                FROM users AS user
                WHERE user.id = usersDonate.donaturId
              )`), 'fullName',
          ],
          [
            literal(`(
                SELECT user.email
                FROM users AS user
                WHERE user.id = usersDonate.donaturId
              )`), 'email',
          ],
          'donateAmount',
          'status',
          'proofAttachment',
        ],
      }],
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });

    return res.status(200).send({
      status: 'success',
      message: 'resources has successfully get',
      data: {
        fund: updatedFund,
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
 * Handling request for delete fund
 * @param {Request} req client request
 * @param {Response} res server response
 * @returns
 */
exports.deleteFund = async (req, res) => {
  const { user, params: { id } } = req;
  try {
    const fund = await Fund.findOne({
      where: {
        id,
      },
    });

    if (fund) {
      if (fund.userId !== user.id) {
        return res.status(403).send({
          status: 'error',
          message: 'access denied',
        });
      }

      await Fund.destroy({
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
    console.log(e);
    return res.status(500).send({
      status: 'error',
      message: 'internal server error',
    });
  }
};

/**
 * Handling request for create donation
 * @param {Request} req client request
 * @param {Response} res server response
 * @returns
 */
exports.createDonation = async (req, res) => {
  const { user, body } = req;
  const { id } = req.params;
  try {
    const donation = await Donation.create({
      ...body,
      donaturId: user.id,
      fundId: parseInt(id, 10),
    });

    return res.status(200).send({
      status: 'success',
      message: 'resources has successfully get',
      data: {
        donation,
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
 * Handling request for update user donation
 * @param {Request} req client request
 * @param {Response} res server response
 * @returns
 */

exports.updateDonation = async (req, res) => {
  const { user, body, params: { fundId, donaturId } } = req;
  const fund = await Fund.findOne({
    where: { id: fundId },
  });

  if (fund.userId !== user.id) {
    return res.status(403).send({
      status: 'error',
      message: 'access denied',
    });
  }

  await Donation.update(
    body,
    {
      where: { fundId, donaturId },
    },
  );

  return res.status(200).send({
    status: 'success',
    message: 'resource has been updated successfully',
    data: {
      id: 1,
    },
  });
};
