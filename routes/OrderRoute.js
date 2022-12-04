const express = require('express');
const { createOrder, getSingleOrder, getAllOrders, getAdminAllOrders, updateAdminOrder, deleteOrder } = require('../controllers/OrderController');
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser,createOrder)
router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder)
router.route("/orders/me").get(isAuthenticatedUser,getAllOrders)
router.route("/admin/orders").get(isAuthenticatedUser,authorizedRoles("admin"),getAdminAllOrders)
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateAdminOrder).delete(isAuthenticatedUser,authorizedRoles("admin"),deleteOrder)

module.exports =router;