const { Router } = require('express');
const { register, login } = require('../controllers/auth');
const {
  getUsers, getUser, updateUser, deleteUser,
} = require('../controllers/user');

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/users', getUsers);
router.get('/user/:id', getUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);
module.exports = router;
