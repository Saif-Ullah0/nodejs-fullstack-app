const express = require('express');
const router = express.Router();

const {
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
  loginUserController,
  getUserByIdController
} = require('../controllers/userController');

router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    location: __dirname,
  });
});

router.get('/', getUserController);
router.post('/register', createUserController);
router.get('/:id', getUserByIdController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

router.post('/login', loginUserController);

module.exports = router;
