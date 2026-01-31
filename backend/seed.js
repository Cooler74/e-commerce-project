const mongoose = require('mongoose');
const Product = require('./models/product'); // Ensure this matches your model filename
const products = require('./data/products'); // Updated to use your external product list
require('dotenv').config();

const seedDB = async () => {
  try {
    // 1. Establish Connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // 2. Clear existing data to avoid duplicates
    await Product.deleteMany({}); 
    console.log('Old data cleared...');

    // 3. Insert the data from your products.js file
    // This will now include your 'countInStock' values (5, 3, 2, etc.)
    await Product.insertMany(products);
    
    console.log('✅ Database Seeded Successfully with countInStock!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();