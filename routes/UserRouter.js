const express = require('express');
const { createUser, loginUser, logoutUser, forgotPassword, resetPassword, userDetails, updateUserPassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require('../controllers/UserController');
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');
const router = express.Router();

router.route("/registration").post(createUser);
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticatedUser,userDetails)
router.route("/me/update").put(isAuthenticatedUser,updateUserPassword)
router.route("/me/update/info").put(isAuthenticatedUser,updateProfile)
router.route("/admin/users").get(isAuthenticatedUser,authorizedRoles("admin"),getAllUsers)
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizedRoles("admin"),getSingleUser).put(isAuthenticatedUser,authorizedRoles("admin"),updateUserRole).delete(
    isAuthenticatedUser,authorizedRoles("admin"),deleteUser
)

module.exports = router;