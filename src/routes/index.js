const { Router } = require('express');
const { register, login } = require('../controllers/auth');
const {
  getFunds,
  createFund,
  createDonation,
  getFund,
  updateFund,
  deleteFund,
  updateDonation,
} = require('../controllers/fund');

const {
  getUsers, getUser, updateUser, deleteUser,
} = require('../controllers/user');
const { authentication } = require('../middlewares/jwtAuth');

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/users', getUsers);
router.get('/user/:id', getUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

router.get('/funds', getFunds);
router.get('/fund/:id', getFund);
router.post('/fund', authentication, createFund);
router.post('/fund/:id', authentication, createDonation);
router.put('/fund/:id', authentication, updateFund);
router.put('/fund/:fundId/:donaturId', authentication, updateDonation);
router.delete('/fund/:id', authentication, deleteFund);

module.exports = router;
