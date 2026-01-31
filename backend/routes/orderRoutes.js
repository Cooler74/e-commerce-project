const express = require('express');
const router = express.Router();
const { 
  addOrderItems, 
  getMyOrders, 
  getOrders, 
  updateOrderToDelivered,
  getOrderSummary // Added this import
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/authMiddleware');

// 1. General Order Routes
router.route('/')
  .get(protect, admin, getOrders)
  .post(protect, addOrderItems);

// 2. Personal Orders
router.route('/myorders').get(protect, getMyOrders);

// 3. Analytics Summary (MUST be above /:id)
router.route('/summary').get(protect, admin, getOrderSummary);

// 4. Specific Order Actions
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;