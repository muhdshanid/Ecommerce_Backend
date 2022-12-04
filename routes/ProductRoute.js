const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProduct, createProductReview, getAllReviews, getSingleProductReviews, deleteReview } = require('../controllers/ProductController');
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticatedUser,authorizedRoles("admin"),createProduct);
router.route("/product/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateProduct);
router.route("/product/:id").delete(isAuthenticatedUser,authorizedRoles("admin"),deleteProduct).get(getSingleProduct)
router.route("/product/review").post(isAuthenticatedUser,createProductReview)
router.route("/reviews").get(isAuthenticatedUser,getSingleProductReviews)
router.route("/reviews").delete(isAuthenticatedUser,authorizedRoles("admin"),deleteReview)
module.exports = router;