const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/product'); 
const User = require('../models/userModel'); 
const sendEmail = require('../utils/sendEmail'); 

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = new Order({
    orderItems: orderItems.map((x) => ({
      name: x.name,
      qty: x.qty,
      image: x.image,
      price: x.price,
      product: x._id || x.id,
    })),
    user: req.user._id, 
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  for (const item of orderItems) {
    const product = await Product.findById(item._id || item.id);
    if (product) {
      product.countInStock -= item.qty;
      await product.save();
    }
  }

  try {
    const orderItemsList = orderItems
      .map(item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: center;">${item.qty}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: right;">$${item.price.toLocaleString()}</td>
        </tr>
      `).join('');

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="background-color: #2c3e50; color: #ffffff; padding: 20px; text-align: center;">
          <h1>Order Confirmed!</h1>
        </div>
        <div style="padding: 30px;">
          <p>Hi <strong>${req.user.name}</strong>,</p>
          <p>Your order <strong>#${createdOrder._id}</strong> has been placed successfully.</p>
          <table style="width: 100%; border-collapse: collapse;">
            ${orderItemsList}
          </table>
          <p style="text-align: right; font-size: 18px;"><strong>Total: $${totalPrice.toLocaleString()}</strong></p>
        </div>
      </div>
    `;

    await sendEmail({
      email: req.user.email,
      subject: `Marc Shop Order Confirmation #${createdOrder._id}`,
      html: emailHtml, 
    });
  } catch (emailErr) {
    console.error('Order confirmation email failed:', emailErr.message);
  }

  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// --- ADMIN FUNCTIONS ---

// @desc    Get dashboard summary stats & daily sales for graphs
// @route   GET /api/orders/summary
// @access  Private/Admin
const getOrderSummary = asyncHandler(async (req, res) => {
  const numOrders = await Order.countDocuments();
  const numUsers = await User.countDocuments();
  const numProducts = await Product.countDocuments();

  // 1. Calculate Total Sales
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);

  const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

  // 2. Calculate Daily Sales for the Graph
  const salesByDate = await Order.aggregate([
    {
      $group: {
        // Formats date to YYYY-MM-DD for the X-axis
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } }, // Sort chronologically
  ]);

  res.json({
    numUsers,
    numOrders,
    numProducts,
    totalSales,
    salesByDate, // Send this array to the frontend chart
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    try {
      await sendEmail({
        email: order.user.email,
        subject: `Marc Shop - Order Delivered! #${order._id}`,
        html: `<h1>Good news, ${order.user.name}!</h1>
               <p>Your order <strong>${order._id}</strong> has been marked as delivered.</p>
               <p>Thank you for shopping with us!</p>`
      });
    } catch (emailErr) {
      console.error('Delivery email failed:', emailErr.message);
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = { 
  addOrderItems, 
  getMyOrders,
  getOrderSummary, 
  getOrders,
  updateOrderToDelivered
};