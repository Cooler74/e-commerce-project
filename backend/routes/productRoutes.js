const express = require("express");
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// Route for all products: Public GET, Admin POST to create
router.route("/")
  .get(getProducts)
  .post(protect, admin, createProduct);

// Route for specific products: Public GET, Admin PUT/DELETE
router.route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;