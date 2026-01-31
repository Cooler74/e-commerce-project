const express = require('express');
const router = express.Router();
const { 
  authUser, 
  registerUser, 
  getUsers, 
  deleteUser, 
  updateUser 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public Routes
router.post('/', registerUser);
router.post('/login', authUser);

// Admin Routes (Protected by both protect and admin middleware)
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser); // Used for promoting/demoting admins

module.exports = router;