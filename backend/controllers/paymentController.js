const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe payment intent
// @route   POST /api/payment/process
// @access  Private
const processPayment = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount, // Amount in cents (e.g., $10.00 = 1000)
      currency: 'usd',
      metadata: { company: 'Marc Shop' },
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { processPayment };