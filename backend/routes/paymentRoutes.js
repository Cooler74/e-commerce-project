const express = require('express'); // Required to use the router
const router = express.Router();    // Required to define your routes
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Required to talk to Stripe

router.post('/process', async (req, res) => {
  try {
    let { amount } = req.body;

    // Convert to number and divide by 1000 to remove the extra formatting zeros
    // If your total is 1072000, this turns it into 1072.
    const cleanAmount = Number(amount) / 1000;

    // Now convert to cents for Stripe ($1072 -> 107200)
    const amountInCents = Math.round(cleanAmount * 100); 

    console.log("FIXED Amount for Stripe (Cents):", amountInCents);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: { company: 'Marc Shop' },
    });

    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("STRIPE_BACKEND_ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; // Required so index.js can use these routes